/* A single continuous room and camera, driven by native document scroll. */
(function () {
  'use strict';
  const root = document.getElementById('galleryWalk');
  const host = document.getElementById('galleryWalkCanvas');
  if (!root || !host) return;
  const stage = root.querySelector('.gallery-walk-stage');
  const fallbackList = document.getElementById('galleryWalkFallback');
  const caption = document.getElementById('galleryWalkCaption');
  const title = document.getElementById('galleryWalkTitle');
  const count = document.getElementById('galleryWalkCount');
  const link = document.getElementById('galleryWalkLink');
  const progress = document.getElementById('galleryWalkProgress');
  const modeButton = document.getElementById('galleryWalkMode');
  const workSelect = document.getElementById('galleryWalkSelect');
  const previousButton = document.getElementById('galleryWalkPrevious');
  const nextButton = document.getElementById('galleryWalkNext');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const works = [
    { id: 'cuadro12', title: 'Luz en el Escenario', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'luz_en_el_escenario_blender.png', aspect: .75 },
    { id: 'cuadro8', title: 'Rayo Verde', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'rayo_verde_blender.png', aspect: .724,
      uv: [.197, .836, .799, .836, .197, .165, .799, .165] },
    { id: 'cuadro6', title: 'El Padrino', meta: '2026 \u00b7 Pastel', image: 'cuadro6.png', aspect: .707,
      uv: [.149, .884, .85, .884, .149, .13, .85, .13] },
    { id: 'cuadro10', title: 'Traves\u00eda \u00cdgnea', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'travesia_ignea_blender.png', aspect: .757,
      uv: [.104, .904, .892, .904, .104, .088, .892, .088] },
    { id: 'cuadro7', title: 'Luz Interna', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'luz_interna.png', aspect: .718,
      uv: [.211, .793, .789, .793, .211, .256, .789, .256] },
    { id: 'cuadro11', title: 'Furia del Mar', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'furia_del_mar_blender.png', aspect: 1.661 },
    { id: 'cuadro5', title: 'Caballos', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'caballo.jpeg', aspect: .76,
      uv: [.097, .916, .894, .916, .097, .082, .894, .082] },
    { id: 'cuadro9', title: 'Honda CRX', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'honda_crx_blender.png', aspect: 1.252,
      uv: [.023, .973, .978, .973, .023, .027, .978, .027] },
    { id: 'cuadro1', title: 'Retrato Carmes\u00ed', meta: '2025 \u00b7 T\u00e9cnica mixta', image: 'retrato.jpeg', aspect: .82,
      uv: [.105, .916, .914, .916, .105, .075, .914, .075] },
    { id: 'cuadro2', title: 'Barco azul', meta: '2024 \u00b7 T\u00e9cnica mixta', image: 'barco.jpeg', aspect: .72,
      uv: [.086, .934, .905, .934, .086, .064, .905, .064] },
    { id: 'cuadro4', title: 'London Eye', meta: '2026 \u00b7 T\u00e9cnica mixta', image: 'londoeye.jpeg', aspect: .65,
      uv: [.272, .768, .733, .792, .273, .309, .737, .301] },
    { id: 'cuadro3', title: 'Orilla al atardecer', meta: '2025 \u00b7 Pastel', image: 'atardecer.jpeg', aspect: .82,
      uv: [.086, .925, .911, .925, .086, .075, .911, .075] }
  ];
  works.forEach(function (work, index) {
    work.z = -5 - index * 8;
    work.side = index % 2 ? 1 : -1;
    work.height = Math.min(1.48, 2.25 / work.aspect);
    const option = document.createElement('option');
    option.value = index;
    option.textContent = String(index + 1).padStart(2, '0') + ' / ' + works.length + ' \u00b7 ' + work.title;
    if (workSelect) workSelect.appendChild(option);
  });
  root.style.setProperty('--walk-height', (works.length * 200 + 180) + 'svh');
  const roomEnd = works[works.length - 1].z - 10.5;
  const roomDepth = 7.5 - roomEnd;
  const roomCenter = (7.5 + roomEnd) / 2;
  const pictureLights = [];
  const fillLights = [];
  let renderer, scene, camera;
  let active = false;
  let unavailable = false;
  let frame = 0;
  let current = 0;
  let target = 0;
  let lastTime = 0;
  let scrollStart = 0;
  let scrollDistance = 1;
  let compact = false;
  let captionIndex = -1;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function ease(value) { const t = clamp(value); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }

  function setStatic(failed) {
    if (failed) unavailable = true;
    active = false;
    cancelAnimationFrame(frame);
    frame = 0;
    root.classList.remove('is-immersive');
    root.style.setProperty('--intro-opacity', 1);
    stage.style.removeProperty('height');
    stage.style.removeProperty('top');
    host.hidden = true;
    fallbackList.hidden = false;
    caption.hidden = true;
    if (modeButton) {
      modeButton.hidden = unavailable;
      modeButton.textContent = 'Entrar al recorrido 3D';
      modeButton.setAttribute('aria-pressed', 'false');
    }
  }

  function createScene() {
    const T = window.THREE;
    renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      setStatic(true);
    });
    scene = new T.Scene();
    scene.background = new T.Color('#141419').convertSRGBToLinear();
    scene.fog = new T.Fog(new T.Color('#18171d').convertSRGBToLinear(), 22, 53);
    camera = new T.PerspectiveCamera(58, 1, .08, 65);
    scene.add(new T.HemisphereLight(0xc8ccdf, 0x54313a, .58));
    const daylight = new T.DirectionalLight(0xffe4bb, .2);
    daylight.position.set(-2, 6, 4);
    scene.add(daylight);

    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    let seed = 73;
    function random() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function surfaceTexture(type) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (type === 'floor') {
        ctx.fillStyle = '#681b32';
        ctx.fillRect(0, 0, 512, 512);
        // Fine, irregular fibres give the carpet a soft pile without tile seams.
        for (let fibre = 0; fibre < 95000; fibre++) {
          const shade = Math.floor(random() * 25);
          ctx.fillStyle = 'rgba(' + (91 + shade) + ',' + (19 + shade * .3) + ',' + (39 + shade * .5) + ',.6)';
          ctx.fillRect(random() * 512, random() * 512, .5 + random(), .5 + random() * 1.5);
        }
      } else {
        ctx.fillStyle = '#e7e3db';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 20000; i++) {
          ctx.fillStyle = random() > .5 ? 'rgba(75,65,49,.035)' : 'rgba(255,255,255,.15)';
          ctx.fillRect(random() * 512, random() * 512, 1.5, 1.5);
        }
      }
      const texture = new T.CanvasTexture(canvas);
      texture.encoding = T.sRGBEncoding;
      texture.wrapS = texture.wrapT = T.RepeatWrapping;
      texture.repeat.set(type === 'floor' ? 4 : 2, roomDepth / 49 * (type === 'floor' ? 26 : 14));
      texture.anisotropy = anisotropy;
      return texture;
    }
    const plaster = new T.MeshStandardMaterial({ color: '#323238', map: surfaceTexture('wall'), roughness: .95 });
    const plasterRight = plaster.clone();
    plasterRight.color.set('#2c2c33');
    const trim = new T.MeshStandardMaterial({ color: '#3b353a', roughness: .78 });
    const dark = new T.MeshStandardMaterial({ color: '#171419', roughness: .65 });
    const brass = new T.MeshStandardMaterial({ color: '#bd9659', metalness: .45, roughness: .32 });
    const ceiling = new T.MeshStandardMaterial({ color: '#1c1c22', roughness: 1 });
    const glowing = new T.MeshBasicMaterial({ color: '#ffdda0', toneMapped: false });
    // This bundled Three.js version needs explicit conversion for CSS colors.
    [plaster, plasterRight, trim, dark, brass, ceiling, glowing].forEach(function (material) {
      material.color.convertSRGBToLinear();
    });
    function box(w, h, d, material, x, y, z, parent) {
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      (parent || scene).add(mesh);
      return mesh;
    }
    const carpetMap = surfaceTexture('floor');
    const floor = new T.Mesh(new T.PlaneGeometry(6.4, roomDepth), new T.MeshStandardMaterial({ map: carpetMap, bumpMap: carpetMap, bumpScale: .012, roughness: 1, metalness: 0 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, roomCenter);
    scene.add(floor);
    box(.22, 3.6, roomDepth, plaster, -3.3, 1.8, roomCenter);
    box(.22, 3.6, roomDepth, plasterRight, 3.3, 1.8, roomCenter);
    box(6.4, .15, roomDepth, ceiling, 0, 3.67, roomCenter);
    [-1, 1].forEach(function (side) {
      box(.06, .12, roomDepth, trim, side * 3.17, .06, roomCenter);
      box(.045, .09, roomDepth, trim, side * 3.17, 3.5, roomCenter);
      box(.025, .012, roomDepth, brass, side * 3.155, .14, roomCenter);
      box(.04, .04, roomDepth, trim, side * 3.16, .62, roomCenter);
      box(.025, .025, roomDepth - 3, brass, side * 2.94, 3.51, roomCenter);
      box(.018, .006, roomDepth - 3, brass, side * 2.86, .005, roomCenter);
      for (let z = 0; z >= roomEnd; z -= 8) {
        box(.15, 3.5, .28, trim, side * 3.12, 1.75, z);
      }
    });
    for (let z = 0; z >= roomEnd; z -= 8) {
      box(6.4, .14, .28, trim, 0, 3.5, z);
    }
    // A fixed light pool keeps the larger gallery affordable on mobile GPUs.
    for (let i = 0; i < 3; i++) {
      const fill = new T.PointLight(0xffd9aa, .16, 10, 2);
      scene.add(fill);
      fillLights.push(fill);
      const spot = new T.SpotLight(0xffdda5, 4.5, 4.5, .76, .8, 1.3);
      scene.add(spot, spot.target);
      pictureLights.push(spot);
    }
    // The doorway gives forward motion a visible destination.
    box(6.4, 3.6, .2, plaster, 0, 1.8, roomEnd);
    box(1.8, 2.75, .06, dark, 0, 1.375, roomEnd + .15);
    box(.07, 2.82, .1, brass, -.94, 1.41, roomEnd + .2);
    box(.07, 2.82, .1, brass, .94, 1.41, roomEnd + .2);
    box(1.95, .07, .1, brass, 0, 2.82, roomEnd + .2);
    function label(text, subtitle, width, height) {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#242329';
      ctx.fillRect(0, 0, 768, 192);
      ctx.fillStyle = '#d7bd90';
      ctx.font = '32px Georgia';
      ctx.fillText(text, 30, 72);
      ctx.font = '19px sans-serif';
      ctx.fillStyle = '#a59780';
      ctx.fillText(subtitle, 30, 127);
      const texture = new T.CanvasTexture(canvas);
      texture.encoding = T.sRGBEncoding;
      return new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: texture, toneMapped: false }));
    }
    const endLabel = label('J. PEDRERO', 'S T U D I O', 1.35, .34);
    endLabel.position.set(0, 1.85, roomEnd + .2);
    scene.add(endLabel);
    // Contact shadows local to each frame avoid expensive shadow render passes.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    shadowCtx.shadowColor = 'rgba(35,25,15,.5)';
    shadowCtx.shadowBlur = 12;
    shadowCtx.fillStyle = 'rgba(35,25,15,.35)';
    shadowCtx.fillRect(16, 16, 96, 96);
    const shadowMap = new T.CanvasTexture(shadowCanvas);
    const loader = new T.TextureLoader();
    works.forEach(function (work, index) {
      const height = work.height;
      const width = height * work.aspect;
      const group = new T.Group();
      group.position.set(work.side * 3.14, 1.75, work.z);
      group.rotation.y = -work.side * Math.PI / 2;
      scene.add(group);
      const shadow = new T.Mesh(new T.PlaneGeometry(width + .62, height + .6), new T.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false }));
      shadow.position.set(.035, -.035, .008);
      group.add(shadow);
      box(width + .25, height + .25, .07, dark, 0, 0, .06, group);
      box(width + .16, height + .16, .025, brass, 0, 0, .103, group);
      box(width + .1, height + .1, .015, new T.MeshStandardMaterial({ color: '#ede7da', roughness: .9 }), 0, 0, .12, group);
      loader.load('assets/blenders/' + work.image, function (texture) {
        texture.encoding = T.sRGBEncoding;
        texture.anisotropy = anisotropy;
        const geometry = new T.PlaneGeometry(width, height);
        // UVs select the artwork, excluding the room photographed around it.
        if (work.uv) geometry.setAttribute('uv', new T.Float32BufferAttribute(work.uv, 2));
        const painting = new T.Mesh(geometry, new T.MeshStandardMaterial({ map: texture, roughness: .95, metalness: 0, emissiveMap: texture, emissive: 0xffffff, emissiveIntensity: .08 }));
        painting.position.z = .134;
        group.add(painting);
        requestRender();
      }, undefined, function () { setStatic(true); });
      const plaque = label(String(index + 1).padStart(2, '0') + '   ' + work.title, work.meta, .72, .18);
      plaque.position.set(width / 2 + .52, -.65, .014);
      group.add(plaque);
      // A wall-mounted brass picture light, directly above each frame.
      const lampY = height / 2 + .4;
      const lampWidth = width * .8;
      box(.2, .09, .045, brass, 0, lampY, .04, group);
      [-.2, .2].forEach(function (x) {
        box(.026, .032, .36, brass, x, lampY, .23, group);
      });
      const shade = new T.Mesh(new T.CylinderGeometry(.047, .047, lampWidth, 20), brass);
      shade.rotation.z = Math.PI / 2;
      shade.position.set(0, lampY, .42);
      group.add(shade);
      box(lampWidth * .9, .012, .045, glowing, 0, lampY - .041, .425, group);
    });
    for (let z = -10; z > roomEnd + 8; z -= 16) {
      box(.5, .1, 1.55, dark, 2.3, .47, z);
      [-.57, .57].forEach(function (offset) {
        box(.055, .42, .055, brass, 2.15, .21, z + offset);
        box(.055, .42, .055, brass, 2.45, .21, z + offset);
      });
    }
  }

  function measure() {
    if (!active) return;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    stage.style.top = headerHeight + 'px';
    const height = Math.max(260, document.documentElement.clientHeight - headerHeight);
    stage.style.height = height + 'px';
    renderer.setSize(host.clientWidth, height, false);
    compact = host.clientWidth / height < .9;
    camera.aspect = host.clientWidth / height;
    camera.fov = compact ? 68 : 58;
    camera.updateProjectionMatrix();
    scrollStart = root.getBoundingClientRect().top + window.scrollY - headerHeight;
    scrollDistance = Math.max(1, root.offsetHeight - height);
    onScroll();
  }
  function draw(p) {
    const timeline = clamp((p - .025) / .9) * works.length;
    const index = Math.min(works.length - 1, Math.floor(timeline));
    const part = timeline - index;
    const work = works[index];
    const fromZ = index ? works[index - 1].z + 1.15 : 4;
    const stopZ = work.z + 1.15;
    const walking = ease(part / .46);
    const turning = ease((part - .44) / .24) * (1 - ease((part - .87) / .13));
    const exit = ease((p - .925) / .075);
    const z = mix(fromZ, stopZ, walking) - exit * 6;
    const x = mix(.12, compact ? -work.side * .85 : -work.side * .2, turning);
    const bob = Math.sin(z * 3.4) * .012 * (1 - turning) * (1 - exit);
    camera.position.set(x, 1.65 + bob, z);
    camera.lookAt(mix(-.15, work.side * 3.14, turning), mix(1.65 + bob, 1.75, turning), mix(z - 7, work.z, turning));
    const firstLit = Math.max(0, Math.min(works.length - pictureLights.length, index - 1));
    pictureLights.forEach(function (spot, i) {
      const litWork = works[firstLit + i];
      spot.position.set(litWork.side * 2.7, 1.75 + litWork.height / 2 + .365, litWork.z);
      spot.target.position.set(litWork.side * 3.13, 1.55, litWork.z);
    });
    fillLights.forEach(function (fill, i) {
      fill.position.set(0, 3.2, Math.round(z / 8) * 8 + (i - 1) * 8);
    });
    renderer.render(scene, camera);
    root.style.setProperty('--intro-opacity', 1 - ease(p / .065));
    progress.style.transform = 'scaleX(' + p + ')';
    caption.hidden = !(turning > .78 && exit < .1);
    if (captionIndex !== index) {
      captionIndex = index;
      title.textContent = work.title;
      count.textContent = String(index + 1).padStart(2, '0') + ' / ' + works.length + ' \u00b7 ' + work.meta;
      link.href = 'works/obra.html?id=' + work.id;
      if (workSelect) workSelect.value = String(index);
      if (previousButton) previousButton.disabled = index === 0;
      if (nextButton) nextButton.disabled = index === works.length - 1;
    }
  }
  function render(time) {
    frame = 0;
    if (!active || document.hidden) return;
    const delta = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    // Damp wheel notches without intercepting wheel, touch, or keyboard events.
    current = mix(current, target, 1 - Math.exp(-delta / 95));
    if (Math.abs(current - target) < .000015) current = target;
    draw(current);
    if (current !== target) frame = requestAnimationFrame(render);
  }
  function requestRender() {
    if (active && !frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function onScroll() {
    if (!active) return;
    target = clamp((window.scrollY - scrollStart) / scrollDistance);
    requestRender();
  }
  function enter() {
    if (unavailable || !window.THREE) { setStatic(true); return; }
    try { if (!renderer) createScene(); }
    catch (_) { setStatic(true); return; }
    active = true;
    host.hidden = false;
    fallbackList.hidden = true;
    root.classList.add('is-immersive');
    if (modeButton) {
      modeButton.hidden = false;
      modeButton.textContent = 'Vista sin movimiento';
      modeButton.setAttribute('aria-pressed', 'true');
    }
    measure();
    current = target;
    requestRender();
  }
  function goToWork(index) {
    index = Math.max(0, Math.min(works.length - 1, index));
    window.scrollTo({ top: scrollStart + scrollDistance * (.025 + (index + .78) / works.length * .9), behavior: 'instant' });
  }
  if (workSelect) workSelect.addEventListener('change', function () { goToWork(Number(workSelect.value)); });
  if (previousButton) previousButton.addEventListener('click', function () { goToWork(captionIndex - 1); });
  if (nextButton) nextButton.addEventListener('click', function () { goToWork(captionIndex + 1); });
  if (modeButton) modeButton.addEventListener('click', function () {
    const oldTop = root.getBoundingClientRect().top + window.scrollY;
    if (active) setStatic(false);
    else enter();
    window.scrollTo({ top: oldTop - (document.querySelector('.site-header')?.offsetHeight || 0), behavior: 'instant' });
    onScroll();
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  document.addEventListener('visibilitychange', function () { lastTime = 0; onScroll(); });
  motion.addEventListener('change', function () { if (motion.matches) setStatic(false); });
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.querySelector('.site-header'));
  if (motion.matches) setStatic(false);
  else enter();
}());
