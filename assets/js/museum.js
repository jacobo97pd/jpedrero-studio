(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (typeof window.THREE === "undefined") {
    console.error("[Museum] THREE no esta disponible.");
    return;
  }

  var THREE = window.THREE;

  var ROOM = {
    width: 18,
    depth: 24,
    height: 5.4
  };

  var WALK = {
    eyeHeight: 1.66,
    margin: 0.9,
    acceleration: 34,
    damping: 8
  };

  var defaultDescription = "Obra original enmarcada de J. Pedrero Studio.";

  var fallbackWorks = [
    {
      id: "cuadro1",
      title: "Retrato en carmin",
      year: 2025,
      technique: "Pastel",
      size: "50x70 cm",
      status: "Disponible",
      description: "Retrato expresivo con contraste calido y fondo atmosferico.",
      image: "assets/blenders/retrato.jpeg"
    },
    {
      id: "cuadro2",
      title: "Barco azul",
      year: 2024,
      technique: "Tecnica mixta",
      size: "60x60 cm",
      status: "Disponible",
      description: "Escena marina con velero y reflejos azules sobre agua en calma.",
      image: "assets/blenders/barco.jpeg"
    },
    {
      id: "cuadro3",
      title: "Orilla al atardecer",
      year: 2025,
      technique: "Pastel",
      size: "70x100 cm",
      status: "Disponible",
      description: "Paisaje de orilla al atardecer con luz suave y atmosfera serena.",
      image: "assets/blenders/atardecer.jpeg"
    },
    {
      id: "cuadro4",
      title: "London Eye",
      year: 2026,
      technique: "Tecnica mixta",
      size: "80x60 cm",
      status: "Disponible",
      description: "Interpretacion urbana nocturna con acentos luminosos.",
      image: "assets/blenders/londoeye.jpeg"
    },
    {
      id: "cuadro5",
      title: "Caballos",
      year: 2026,
      technique: "Tecnica mixta",
      size: "60x80 cm",
      status: "Disponible",
      description: "Composicion figurativa con caballos en movimiento.",
      image: "assets/blenders/caballo.jpeg"
    },
    {
      id: "cuadro6",
      title: "El Padrino",
      year: 2026,
      technique: "Pastel",
      size: "50x70 cm",
      status: "Disponible",
      description: "Retrato dramatico de gesto sobrio y paleta contenida.",
      image: "assets/blenders/cuadro6.png"
    }
  ];

  var fallbackRenderById = {
    cuadro1: "assets/blenders/retrato.jpeg",
    cuadro2: "assets/blenders/barco.jpeg",
    cuadro3: "assets/blenders/atardecer.jpeg",
    cuadro4: "assets/blenders/londoeye.jpeg",
    cuadro5: "assets/blenders/caballo.jpeg",
    cuadro6: "assets/blenders/cuadro6.png"
  };

  function normalizePath(path) {
    if (!path) return "";
    return String(path).trim().replace(/\\/g, "/");
  }

  function toMuseumUrl(path) {
    var clean = normalizePath(path);
    if (!clean) return "";
    if (/^(blob:|data:|https?:|file:)/i.test(clean)) return clean;
    if (clean.indexOf("../") === 0 || clean.indexOf("./") === 0 || clean.indexOf("/") === 0) return clean;
    return "../" + clean;
  }

  function uniquePaths(paths) {
    var result = [];
    var seen = Object.create(null);
    for (var i = 0; i < paths.length; i += 1) {
      var value = normalizePath(paths[i]);
      if (!value || seen[value]) continue;
      seen[value] = true;
      result.push(value);
    }
    return result;
  }

  function resolveArtworkCandidates(work) {
    if (!work) return [];
    var inlineMap = window.MUSEUM_INLINE_IMAGES || {};
    var inlineImage = inlineMap[work.id] || "";
    var blenderImage = fallbackRenderById[work.id] || "";
    return uniquePaths([
      inlineImage,
      blenderImage,
      work.render,
      work.renderImage,
      work.image
    ]);
  }

  function normalizeWorkData(work, index) {
    var safe = work || {};
    var id = safe.id || ("obra" + (index + 1));
    return {
      id: id,
      title: safe.title || ("Obra " + (index + 1)),
      year: safe.year || "",
      technique: safe.technique || safe.tecnica || "",
      size: safe.size || safe.measure || "",
      status: safe.status || "",
      description: safe.description || safe.desc || defaultDescription,
      image: safe.image || "",
      render: safe.render || "",
      renderImage: safe.renderImage || ""
    };
  }

  function loadWorks() {
    if (window.location.protocol === "file:") {
      return Promise.resolve(fallbackWorks);
    }

    return fetch("../data/works.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length) return data;
        return fallbackWorks;
      })
      .catch(function (error) {
        console.warn("[Museum] No se pudo cargar works.json, uso fallback local.", error);
        return fallbackWorks;
      });
  }

  function clampValue(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function createWallTexture(maxAnisotropy) {
    var size = 1024;

    var colorCanvas = document.createElement("canvas");
    colorCanvas.width = size;
    colorCanvas.height = size;
    var colorCtx = colorCanvas.getContext("2d");
    colorCtx.fillStyle = "#dddcd7";
    colorCtx.fillRect(0, 0, size, size);

    for (var i = 0; i < 140; i += 1) {
      var cx = Math.random() * size;
      var cy = Math.random() * size;
      var radius = 48 + Math.random() * 190;
      var grad = colorCtx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius);
      var light = 204 + Math.floor(Math.random() * 24);
      var dark = 168 + Math.floor(Math.random() * 24);
      grad.addColorStop(0, "rgba(" + light + "," + light + "," + light + ",0.20)");
      grad.addColorStop(1, "rgba(" + dark + "," + dark + "," + dark + ",0)");
      colorCtx.fillStyle = grad;
      colorCtx.beginPath();
      colorCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      colorCtx.fill();
    }

    for (var n = 0; n < 11000; n += 1) {
      var base = 170 + Math.floor(Math.random() * 45);
      var alpha = 0.035 + Math.random() * 0.075;
      colorCtx.fillStyle = "rgba(" + base + "," + base + "," + base + "," + alpha.toFixed(3) + ")";
      colorCtx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }

    colorCtx.strokeStyle = "rgba(120,113,101,0.09)";
    colorCtx.lineWidth = 1.3;
    for (var line = 0; line < 58; line += 1) {
      var y = (line + 0.5) * (size / 58);
      colorCtx.beginPath();
      colorCtx.moveTo(0, y + Math.sin(line * 0.65) * 2.2);
      colorCtx.lineTo(size, y + Math.cos(line * 0.53) * 2.2);
      colorCtx.stroke();
    }

    var bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    var bumpCtx = bumpCanvas.getContext("2d");
    bumpCtx.fillStyle = "rgb(126,126,126)";
    bumpCtx.fillRect(0, 0, size, size);

    for (var b = 0; b < 12500; b += 1) {
      var tone = 102 + Math.floor(Math.random() * 58);
      bumpCtx.fillStyle = "rgb(" + tone + "," + tone + "," + tone + ")";
      bumpCtx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }

    bumpCtx.strokeStyle = "rgba(175,175,175,0.24)";
    bumpCtx.lineWidth = 1;
    for (var ly = 0; ly < size; ly += 22) {
      bumpCtx.beginPath();
      bumpCtx.moveTo(0, ly + Math.sin(ly * 0.014) * 2);
      bumpCtx.lineTo(size, ly + Math.cos(ly * 0.012) * 2);
      bumpCtx.stroke();
    }

    var wallMap = new THREE.CanvasTexture(colorCanvas);
    wallMap.wrapS = THREE.RepeatWrapping;
    wallMap.wrapT = THREE.RepeatWrapping;
    wallMap.repeat.set(4.2, 2.0);
    wallMap.encoding = THREE.sRGBEncoding;
    wallMap.anisotropy = maxAnisotropy;
    wallMap.needsUpdate = true;

    var wallBump = new THREE.CanvasTexture(bumpCanvas);
    wallBump.wrapS = THREE.RepeatWrapping;
    wallBump.wrapT = THREE.RepeatWrapping;
    wallBump.repeat.copy(wallMap.repeat);
    wallBump.anisotropy = maxAnisotropy;
    wallBump.needsUpdate = true;

    return {
      map: wallMap,
      bump: wallBump
    };
  }

  function createFloorTexture(maxAnisotropy) {
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#735238";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var plankHeight = 64;
    for (var y = 0; y < canvas.height; y += plankHeight) {
      var hue = 102 + Math.floor(Math.random() * 28);
      var shade = "rgb(" + hue + "," + (hue - 30) + "," + (hue - 58) + ")";
      ctx.fillStyle = shade;
      ctx.fillRect(0, y, canvas.width, plankHeight);

      var plankGradient = ctx.createLinearGradient(0, y, 0, y + plankHeight);
      plankGradient.addColorStop(0, "rgba(255,236,214,0.08)");
      plankGradient.addColorStop(0.35, "rgba(255,236,214,0.02)");
      plankGradient.addColorStop(0.65, "rgba(34,20,10,0.06)");
      plankGradient.addColorStop(1, "rgba(34,20,10,0.12)");
      ctx.fillStyle = plankGradient;
      ctx.fillRect(0, y, canvas.width, plankHeight);

      ctx.strokeStyle = "rgba(54,34,18,0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y + plankHeight - 1);
      ctx.lineTo(canvas.width, y + plankHeight - 1);
      ctx.stroke();

      for (var i = 0; i < 120; i += 1) {
        var x = Math.random() * canvas.width;
        var h = Math.random() * (plankHeight - 6);
        ctx.fillStyle = "rgba(255,247,230,0.045)";
        ctx.fillRect(x, y + 3 + h, 12 + Math.random() * 42, 1);
      }

      for (var j = 0; j < 80; j += 1) {
        var gx = Math.random() * canvas.width;
        var gy = y + 4 + Math.random() * (plankHeight - 10);
        ctx.fillStyle = "rgba(26,14,8,0.08)";
        ctx.fillRect(gx, gy, 10 + Math.random() * 30, 1);
      }
    }

    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3.1, 4.1);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = maxAnisotropy;
    texture.needsUpdate = true;
    return texture;
  }

  function createRoom(scene, renderer) {
    var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    var wallTexture = createWallTexture(maxAnisotropy);
    var floorTexture = createFloorTexture(maxAnisotropy);

    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
      new THREE.MeshStandardMaterial({
        color: 0x805f45,
        map: floorTexture,
        roughness: 0.9,
        metalness: 0.01
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    var wallMaterialBack = new THREE.MeshStandardMaterial({
      color: 0xc8c7c3,
      map: wallTexture.map,
      bumpMap: wallTexture.bump,
      bumpScale: 0.2,
      roughness: 0.76,
      metalness: 0.01
    });
    var wallMaterialLeft = wallMaterialBack.clone();
    wallMaterialLeft.color = new THREE.Color(0xd9d8d4);
    wallMaterialLeft.bumpScale = 0.14;

    var wallMaterialRight = wallMaterialBack.clone();
    wallMaterialRight.color = new THREE.Color(0xcecdc9);
    wallMaterialRight.bumpScale = 0.11;

    var backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.width, ROOM.height), wallMaterialBack);
    backWall.position.set(0, ROOM.height / 2, -ROOM.depth / 2);
    scene.add(backWall);

    var leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.depth, ROOM.height), wallMaterialLeft);
    leftWall.position.set(-ROOM.width / 2, ROOM.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    var rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.depth, ROOM.height), wallMaterialRight);
    rightWall.position.set(ROOM.width / 2, ROOM.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    var ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
      new THREE.MeshStandardMaterial({ color: 0xafada8, roughness: 0.93, metalness: 0.01 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = ROOM.height;
    scene.add(ceiling);

    var skirtingMaterial = new THREE.MeshStandardMaterial({ color: 0xe2d9cb, roughness: 0.9, metalness: 0.01 });
    var skirtingH = 0.11;
    var skirtingD = 0.04;

    var skBack = new THREE.Mesh(new THREE.BoxGeometry(ROOM.width, skirtingH, skirtingD), skirtingMaterial);
    skBack.position.set(0, skirtingH / 2, -ROOM.depth / 2 + skirtingD / 2);
    scene.add(skBack);

    var skLeft = new THREE.Mesh(new THREE.BoxGeometry(skirtingD, skirtingH, ROOM.depth), skirtingMaterial);
    skLeft.position.set(-ROOM.width / 2 + skirtingD / 2, skirtingH / 2, 0);
    scene.add(skLeft);

    var skRight = new THREE.Mesh(new THREE.BoxGeometry(skirtingD, skirtingH, ROOM.depth), skirtingMaterial);
    skRight.position.set(ROOM.width / 2 - skirtingD / 2, skirtingH / 2, 0);
    scene.add(skRight);
  }

  function createFramedArtwork(texture) {
    var imgW = texture && texture.image && texture.image.width ? texture.image.width : 4;
    var imgH = texture && texture.image && texture.image.height ? texture.image.height : 5;
    var aspect = imgW / imgH;

    var artHeight = 1.85;
    var artWidth = artHeight * aspect;
    var maxWidth = 1.45;

    if (artWidth > maxWidth) {
      artWidth = maxWidth;
      artHeight = artWidth / aspect;
    }

    var matPadding = 0.14;
    var frameBorder = 0.07;
    var frameDepth = 0.1;
    var outerW = artWidth + 2 * (matPadding + frameBorder);
    var outerH = artHeight + 2 * (matPadding + frameBorder);

    var frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.55,
      metalness: 0.08
    });

    var frame = new THREE.Mesh(new THREE.BoxGeometry(outerW, outerH, frameDepth), frameMaterial);

    var mat = new THREE.Mesh(
      new THREE.PlaneGeometry(outerW - frameBorder * 2, outerH - frameBorder * 2),
      new THREE.MeshStandardMaterial({ color: 0xf6f4ef, roughness: 0.96, metalness: 0.02 })
    );
    mat.position.z = frameDepth / 2 + 0.001;

    var paintingMaterial = texture
      ? new THREE.MeshBasicMaterial({ map: texture })
      : new THREE.MeshStandardMaterial({ color: 0xe7e1d7, roughness: 0.94, metalness: 0.01 });

    var painting = new THREE.Mesh(
      new THREE.PlaneGeometry(artWidth, artHeight),
      paintingMaterial
    );
    painting.position.z = frameDepth / 2 + 0.003;

    var group = new THREE.Group();
    group.add(frame);
    group.add(mat);
    group.add(painting);

    return {
      group: group,
      outerW: outerW,
      outerH: outerH,
      frameDepth: frameDepth,
      paintingMesh: painting
    };
  }

  function createPlaqueTexture(title, subtitle) {
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f6f1e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(128,112,88,0.55)";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    ctx.fillStyle = "#201d19";
    ctx.font = "600 68px 'Cormorant Garamond', serif";
    ctx.textBaseline = "top";

    var safeTitle = String(title || "Obra");
    var safeSubtitle = String(subtitle || "Ficha disponible");

    var maxTitleWidth = canvas.width - 80;
    var titleText = safeTitle;
    while (ctx.measureText(titleText).width > maxTitleWidth && titleText.length > 6) {
      titleText = titleText.slice(0, -2);
    }
    if (titleText !== safeTitle) titleText += "...";

    ctx.fillText(titleText, 40, 44);

    ctx.fillStyle = "#5f5648";
    ctx.font = "500 34px 'Manrope', sans-serif";
    ctx.fillText(safeSubtitle, 40, 166);

    ctx.fillStyle = "#877964";
    ctx.font = "500 26px 'Manrope', sans-serif";
    ctx.fillText("Click para ver ficha", 40, 234);

    var texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
    return texture;
  }

  function createPlaqueMesh(work) {
    var subtitleParts = [];
    if (work.year) subtitleParts.push(String(work.year));
    if (work.technique) subtitleParts.push(String(work.technique));
    var subtitle = subtitleParts.join(" · ");

    var texture = createPlaqueTexture(work.title, subtitle || "Ficha disponible");
    var material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.84, metalness: 0.04 });
    var plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.26), material);
    plaque.userData.isPlaque = true;
    return plaque;
  }

  function loadTexture(url) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.onload = function () {
        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        resolve(texture);
      };
      image.onerror = function () { resolve(null); };
      image.src = url;
    });
  }

  function spreadValues(start, end, count) {
    if (count <= 1) return [ (start + end) / 2 ];
    var values = [];
    var step = (end - start) / (count - 1);
    for (var i = 0; i < count; i += 1) {
      values.push(start + step * i);
    }
    return values;
  }

  function buildSlots(worksCount) {
    var slots = [];
    var wallInset = 0.055;
    var rows = worksCount > 12 ? [2.45, 4.08] : [2.45];
    var countPerRow = worksCount > 12 ? Math.ceil(worksCount / 2) : worksCount;
    var perWall = Math.max(2, Math.ceil(countPerRow / 2));

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      var y = rows[rowIndex];

      var backXs = spreadValues(-ROOM.width / 2 + 2.1, ROOM.width / 2 - 2.1, perWall);
      for (var bx = 0; bx < backXs.length; bx += 1) {
        slots.push({ x: backXs[bx], y: y, z: -ROOM.depth / 2 + wallInset, ry: 0, wall: "back" });
      }

      var sideZs = spreadValues(-ROOM.depth / 2 + 2.8, ROOM.depth / 2 - 2.8, perWall);
      for (var lz = 0; lz < sideZs.length; lz += 1) {
        slots.push({ x: -ROOM.width / 2 + wallInset, y: y, z: sideZs[lz], ry: Math.PI / 2, wall: "left" });
      }
      for (var rz = 0; rz < sideZs.length; rz += 1) {
        slots.push({ x: ROOM.width / 2 - wallInset, y: y, z: sideZs[rz], ry: -Math.PI / 2, wall: "right" });
      }
    }

    return slots;
  }

  function tagPickable(root, workData, pickableMeshes) {
    root.traverse(function (child) {
      if (!child || !child.isMesh) return;
      child.userData.work = workData;
      pickableMeshes.push(child);
    });
  }

  function addArtworks(scene, renderer, works, pickableMeshes) {
    var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    var safeWorks = Array.isArray(works) ? works : [];
    var slots = buildSlots(safeWorks.length);
    var placedCount = 0;

    var visibleWorks = safeWorks.slice(0, slots.length);
    var chain = Promise.resolve();

    visibleWorks.forEach(function (rawWork, index) {
      chain = chain.then(function () {
        var slot = slots[index];
        if (!slot) return;

        var work = normalizeWorkData(rawWork, index);
        var candidates = resolveArtworkCandidates(work);
        if (!candidates.length) return;

        var pick = Promise.resolve(null);
        candidates.forEach(function (candidate) {
          pick = pick.then(function (currentTexture) {
            if (currentTexture) return currentTexture;
            return loadTexture(toMuseumUrl(candidate));
          });
        });

        return pick.then(function (texture) {
          if (texture) {
            texture.encoding = THREE.sRGBEncoding;
            texture.anisotropy = maxAnisotropy;
          }

          var artwork = createFramedArtwork(texture || null);
          var frame = artwork.group;
          frame.position.set(slot.x, slot.y, slot.z);
          frame.rotation.y = slot.ry;
          scene.add(frame);

          tagPickable(frame, work, pickableMeshes);

          var sideMultiplier;
          if (slot.wall === "back") {
            sideMultiplier = slot.x >= 0 ? -1 : 1;
          } else if (slot.wall === "left") {
            sideMultiplier = slot.z >= 0 ? -1 : 1;
          } else {
            sideMultiplier = slot.z >= 0 ? 1 : -1;
          }

          var plaque = createPlaqueMesh(work);
          var localOffset = new THREE.Vector3(
            sideMultiplier * (artwork.outerW / 2 + 0.58),
            0,
            artwork.frameDepth / 2 + 0.02
          );
          localOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), slot.ry);
          plaque.position.copy(frame.position).add(localOffset);
          plaque.rotation.y = slot.ry;
          scene.add(plaque);

          plaque.userData.work = work;
          pickableMeshes.push(plaque);
          placedCount += 1;
        });
      });
    });

    return chain.then(function () { return placedCount; });
  }

  function applyCameraLook(camera, yaw, pitch) {
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.rotation.z = 0;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var viewport = document.getElementById("museumViewport");
    var hud = document.getElementById("museumHud");
    var hudText = document.getElementById("museumHudText");
    var infoPanel = document.getElementById("museumInfo");
    var infoClose = document.getElementById("museumInfoClose");
    var infoTitle = document.getElementById("museumInfoTitle");
    var infoMeta = document.getElementById("museumInfoMeta");
    var infoText = document.getElementById("museumInfoText");
    var infoLink = document.getElementById("museumInfoLink");
    var joystick = document.getElementById("museumJoystick");
    var joystickThumb = document.getElementById("museumJoystickThumb");
    var joystickLabel = document.getElementById("museumJoystickLabel");

    if (!viewport || !hud) return;

    var isCoarsePointer = Boolean(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = false;
    viewport.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeebe5);
    scene.fog = new THREE.Fog(0xeeebe5, 12, 36);

    var camera = new THREE.PerspectiveCamera(68, viewport.clientWidth / viewport.clientHeight, 0.1, 80);
    camera.position.set(0, WALK.eyeHeight, 8.6);

    var hemi = new THREE.HemisphereLight(0xfaf5ec, 0xc5baa8, 0.96);
    scene.add(hemi);

    var key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(2, ROOM.height + 2, 4);
    scene.add(key);

    var fill = new THREE.DirectionalLight(0xf8ede0, 0.22);
    fill.position.set(-5, 3.4, -7);
    scene.add(fill);

    var wallRake = new THREE.DirectionalLight(0xf0ede6, 0.28);
    wallRake.position.set(-ROOM.width * 0.75, ROOM.height * 0.9, -ROOM.depth * 0.1);
    scene.add(wallRake);

    createRoom(scene, renderer);

    var pickableMeshes = [];

    if (hudText) {
      hudText.textContent = isCoarsePointer
        ? "Joystick para moverte · Arrastra para mirar · Toca una placa para ver la ficha"
        : "WASD o flechas para moverte · Arrastra para mirar · Click en una placa para ver la ficha";
    }

    if (joystickLabel) {
      joystickLabel.textContent = "Mover";
    }

    loadWorks().then(function (works) {
      return addArtworks(scene, renderer, works || fallbackWorks, pickableMeshes);
    }).then(function (placedCount) {
      if (!placedCount) {
        console.warn("[Museum] No se pudo colocar ninguna obra.");
      }
    }).catch(function (error) {
      console.warn("[Museum] Error cargando obras:", error);
    });

    var moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      boost: false
    };

    var interaction = {
      active: true,
      dragLook: false,
      lastX: 0,
      lastY: 0,
      yaw: 0,
      pitch: 0
    };

    var pointerState = {
      downX: 0,
      downY: 0,
      moved: false
    };

    var joystickState = {
      active: false,
      pointerId: null,
      x: 0,
      y: 0
    };

    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2();

    function openWorkInfo(work) {
      if (!infoPanel || !work) return;
      var metaParts = [];
      if (work.technique) metaParts.push(work.technique);
      if (work.size) metaParts.push(work.size);
      if (work.status) metaParts.push(work.status);
      if (work.year) metaParts.push(String(work.year));

      if (infoTitle) infoTitle.textContent = work.title || "Obra";
      if (infoMeta) infoMeta.textContent = metaParts.join(" · ");
      if (infoText) infoText.textContent = work.description || defaultDescription;
      if (infoLink) infoLink.href = "../works/obra.html?id=" + encodeURIComponent(work.id || "");
      infoPanel.hidden = false;
    }

    function closeWorkInfo() {
      if (!infoPanel) return;
      infoPanel.hidden = true;
    }

    function setJoystickVisual(dx, dy) {
      if (!joystickThumb) return;
      joystickThumb.style.transform = "translate3d(" + dx.toFixed(2) + "px, " + dy.toFixed(2) + "px, 0)";
    }

    function resetJoystick() {
      joystickState.active = false;
      joystickState.pointerId = null;
      joystickState.x = 0;
      joystickState.y = 0;
      setJoystickVisual(0, 0);
      if (joystick) joystick.classList.remove("is-active");
    }

    function updateJoystickFromPointer(clientX, clientY) {
      if (!joystick) return;
      var rect = joystick.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var radius = rect.width * 0.34;

      var dx = clientX - centerX;
      var dy = clientY - centerY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius && dist > 0.0001) {
        var ratio = radius / dist;
        dx *= ratio;
        dy *= ratio;
      }

      joystickState.x = clampValue(dx / radius, -1, 1);
      joystickState.y = clampValue(dy / radius, -1, 1);
      setJoystickVisual(dx, dy);
    }

    function setInteractionActive(active) {
      interaction.active = !!active;
      hud.classList.toggle("is-active", interaction.active);
      viewport.classList.toggle("is-interacting", interaction.active);
      if (!interaction.active) {
        moveState.forward = false;
        moveState.backward = false;
        moveState.left = false;
        moveState.right = false;
        moveState.boost = false;
        interaction.dragLook = false;
        viewport.classList.remove("is-dragging");
        resetJoystick();
      }
    }

    function clampPosition() {
      var maxX = ROOM.width / 2 - WALK.margin;
      var maxZ = ROOM.depth / 2 - WALK.margin;
      camera.position.x = clampValue(camera.position.x, -maxX, maxX);
      camera.position.z = clampValue(camera.position.z, -maxZ, maxZ);
      camera.position.y = WALK.eyeHeight;
    }

    function applyFreeLook(deltaX, deltaY) {
      var pitchLimit = Math.PI / 2 - 0.04;
      var lookSensitivity = 0.0024;
      interaction.yaw -= deltaX * lookSensitivity;
      interaction.pitch -= deltaY * lookSensitivity;
      interaction.pitch = clampValue(interaction.pitch, -pitchLimit, pitchLimit);
      applyCameraLook(camera, interaction.yaw, interaction.pitch);
    }

    function getWorkFromScreenPoint(clientX, clientY) {
      if (!pickableMeshes.length) return null;
      var rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      var intersects = raycaster.intersectObjects(pickableMeshes, true);
      if (!intersects.length) return null;

      for (var i = 0; i < intersects.length; i += 1) {
        var candidate = intersects[i].object;
        if (candidate && candidate.userData && candidate.userData.work) {
          return candidate.userData.work;
        }
      }
      return null;
    }

    function onKeyEvent(event, isDown) {
      if (event.code === "Escape" && isDown) {
        if (infoPanel && !infoPanel.hidden) {
          closeWorkInfo();
        } else {
          setInteractionActive(false);
        }
        return;
      }
      if (!interaction.active) return;

      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.forward = isDown;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.backward = isDown;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.left = isDown;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.right = isDown;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          moveState.boost = isDown;
          break;
        default:
          break;
      }

      if (event.code.indexOf("Arrow") === 0) event.preventDefault();
    }

    document.addEventListener("keydown", function (event) { onKeyEvent(event, true); });
    document.addEventListener("keyup", function (event) { onKeyEvent(event, false); });

    if (joystick) {
      joystick.addEventListener("pointerdown", function (event) {
        if (!interaction.active) return;
        joystickState.active = true;
        joystickState.pointerId = event.pointerId;
        joystick.classList.add("is-active");
        if (joystick.setPointerCapture) joystick.setPointerCapture(event.pointerId);
        updateJoystickFromPointer(event.clientX, event.clientY);
        event.preventDefault();
        event.stopPropagation();
      });

      joystick.addEventListener("pointermove", function (event) {
        if (!joystickState.active || joystickState.pointerId !== event.pointerId) return;
        updateJoystickFromPointer(event.clientX, event.clientY);
        event.preventDefault();
        event.stopPropagation();
      });

      var endJoystick = function (event) {
        if (!joystickState.active) return;
        if (event && joystickState.pointerId !== null && event.pointerId !== joystickState.pointerId) return;
        resetJoystick();
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      joystick.addEventListener("pointerup", endJoystick);
      joystick.addEventListener("pointercancel", endJoystick);
      joystick.addEventListener("lostpointercapture", function () {
        resetJoystick();
      });
    }

    viewport.addEventListener("pointerdown", function (event) {
      pointerState.downX = event.clientX;
      pointerState.downY = event.clientY;
      pointerState.moved = false;
    });

    viewport.addEventListener("pointermove", function (event) {
      if (Math.abs(event.clientX - pointerState.downX) > 6 || Math.abs(event.clientY - pointerState.downY) > 6) {
        pointerState.moved = true;
      }
    });

    viewport.addEventListener("pointerup", function (event) {
      if (pointerState.moved) return;
      var work = getWorkFromScreenPoint(event.clientX, event.clientY);
      if (work) {
        openWorkInfo(work);
        return;
      }
      if (!interaction.active) setInteractionActive(true);
    });

    viewport.addEventListener("mousedown", function (event) {
      if (!interaction.active) return;
      interaction.dragLook = true;
      interaction.lastX = event.clientX;
      interaction.lastY = event.clientY;
      viewport.classList.add("is-dragging");
      event.preventDefault();
    });

    window.addEventListener("mousemove", function (event) {
      if (!interaction.dragLook) return;
      var dx = event.clientX - interaction.lastX;
      var dy = event.clientY - interaction.lastY;
      interaction.lastX = event.clientX;
      interaction.lastY = event.clientY;
      applyFreeLook(dx, dy);
    });

    function stopDragLook() {
      interaction.dragLook = false;
      viewport.classList.remove("is-dragging");
    }

    window.addEventListener("mouseup", stopDragLook);
    viewport.addEventListener("mouseleave", stopDragLook);

    viewport.addEventListener("touchstart", function (event) {
      if (!interaction.active) return;
      if (!event.touches || event.touches.length !== 1) return;
      interaction.dragLook = true;
      interaction.lastX = event.touches[0].clientX;
      interaction.lastY = event.touches[0].clientY;
      pointerState.downX = interaction.lastX;
      pointerState.downY = interaction.lastY;
      pointerState.moved = false;
    }, { passive: true });

    viewport.addEventListener("touchmove", function (event) {
      if (!interaction.dragLook || !event.touches || event.touches.length !== 1) return;
      var touchX = event.touches[0].clientX;
      var touchY = event.touches[0].clientY;
      var dx = touchX - interaction.lastX;
      var dy = touchY - interaction.lastY;
      if (Math.abs(touchX - pointerState.downX) > 6 || Math.abs(touchY - pointerState.downY) > 6) {
        pointerState.moved = true;
      }
      interaction.lastX = touchX;
      interaction.lastY = touchY;
      applyFreeLook(dx, dy);
      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    viewport.addEventListener("touchend", function (event) {
      stopDragLook();
      if (pointerState.moved) return;
      var changedTouch = event.changedTouches && event.changedTouches[0];
      if (!changedTouch) return;
      var work = getWorkFromScreenPoint(changedTouch.clientX, changedTouch.clientY);
      if (work) openWorkInfo(work);
    });

    viewport.addEventListener("touchcancel", stopDragLook);

    if (infoClose) {
      infoClose.addEventListener("click", function () {
        closeWorkInfo();
      });
    }

    function onResize() {
      var width = viewport.clientWidth;
      var height = viewport.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", onResize);

    var velocity = new THREE.Vector3();
    var direction = new THREE.Vector3();
    var previousTime = performance.now();

    function animate(time) {
      var delta = Math.min(0.05, (time - previousTime) / 1000);
      previousTime = time;

      if (interaction.active) {
        velocity.x -= velocity.x * WALK.damping * delta;
        velocity.z -= velocity.z * WALK.damping * delta;

        var analogX = joystickState.x;
        var analogZ = -joystickState.y;

        direction.set(
          (Number(moveState.right) - Number(moveState.left)) + analogX,
          0,
          (Number(moveState.forward) - Number(moveState.backward)) + analogZ
        );

        if (direction.lengthSq() > 0) direction.normalize();

        var speedFactor = moveState.boost ? 1.65 : 1;

        if (direction.lengthSq() > 0) {
          velocity.z -= direction.z * WALK.acceleration * speedFactor * delta;
          velocity.x -= direction.x * WALK.acceleration * speedFactor * delta;
        }

        var right = new THREE.Vector3(Math.cos(interaction.yaw), 0, -Math.sin(interaction.yaw));
        var forward = new THREE.Vector3(-Math.sin(interaction.yaw), 0, -Math.cos(interaction.yaw));

        camera.position.addScaledVector(right, -velocity.x * delta);
        camera.position.addScaledVector(forward, -velocity.z * delta);
        clampPosition();
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    applyCameraLook(camera, interaction.yaw, interaction.pitch);
    setInteractionActive(true);
    requestAnimationFrame(animate);
  });
})();
