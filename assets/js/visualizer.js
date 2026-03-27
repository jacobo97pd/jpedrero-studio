document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("vizStage");
  const roomInput = document.getElementById("vizRoomInput");
  const artworkSelect = document.getElementById("vizArtworkSelect");
  const roomImage = document.getElementById("vizRoomImage");
  const paintingImage = document.getElementById("vizPaintingImage");
  const placeholder = document.getElementById("vizPlaceholder");
  const sizeInput = document.getElementById("vizSize");
  const rotationInput = document.getElementById("vizRotation");
  const skewInput = document.getElementById("vizSkew");
  const opacityInput = document.getElementById("vizOpacity");
  const shadowInput = document.getElementById("vizShadow");
  const sizeValue = document.getElementById("vizSizeValue");
  const rotationValue = document.getElementById("vizRotationValue");
  const skewValue = document.getElementById("vizSkewValue");
  const opacityValue = document.getElementById("vizOpacityValue");
  const shadowValue = document.getElementById("vizShadowValue");
  const resetBtn = document.getElementById("vizResetBtn");
  const downloadBtn = document.getElementById("vizDownloadBtn");

  if (
    !stage || !roomInput || !artworkSelect || !roomImage || !paintingImage || !placeholder ||
    !sizeInput || !rotationInput || !skewInput || !opacityInput || !shadowInput ||
    !sizeValue || !rotationValue || !skewValue || !opacityValue || !shadowValue ||
    !resetBtn || !downloadBtn
  ) {
    return;
  }

  const currentLang = localStorage.getItem("jps_lang") === "en" ? "en" : "es";
  const titleMap = {
    cuadro1: { es: "Retrato en carmin", en: "Crimson Portrait" },
    cuadro2: { es: "Barco azul", en: "Blue Ship" },
    cuadro3: { es: "Orilla al atardecer", en: "Shore at Dusk" },
    cuadro4: { es: "London Eye", en: "London Eye" },
    cuadro5: { es: "Caballos", en: "Horses" },
    cuadro6: { es: "El Padrino", en: "The Godfather" }
  };

  const fallbackWorks = [
    { id: "cuadro1", title: "Retrato en carmin", image: "assets/img/works/Cuadro1.png" },
    { id: "cuadro2", title: "Barco azul", image: "assets/img/works/Cuadro3.png" },
    { id: "cuadro3", title: "Orilla al atardecer", image: "assets/img/works/Cuadro2.png" },
    { id: "cuadro4", title: "London Eye", image: "assets/img/works/Cuadro4.png" },
    { id: "cuadro5", title: "Caballos", image: "assets/img/works/cuadro5.png" },
    { id: "cuadro6", title: "El Padrino", image: "assets/img/works/cuadro6.png" }
  ];

  // Preferred render sources for the simulator.
  // If these are missing, it falls back automatically to works.json image.
  const renderImageById = {
    cuadro1: "assets/blenders/retrato.jpeg",
    cuadro2: "assets/blenders/barco.jpeg",
    cuadro3: "assets/blenders/atardecer.jpeg",
    cuadro4: "assets/blenders/londoeye.jpeg",
    cuadro5: "assets/blenders/caballo.jpeg",
    cuadro6: "assets/blenders/cuadro6.png"
  };

  const state = {
    artworks: [],
    selectedArtworkId: "",
    roomObjectUrl: "",
    x: 0.5,
    y: 0.52,
    size: 34,
    rotation: 0,
    skew: 0,
    opacity: 100,
    shadow: 20,
    dragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    artworkLoadToken: 0
  };

  function localizeTitle(work) {
    if (!work) return "";
    const fromMap = titleMap[work.id];
    if (fromMap) return fromMap[currentLang] || fromMap.es;
    return work.title || work.id || "Artwork";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizePath(path) {
    if (!path) return "";
    return String(path).trim().replace(/\\/g, "/");
  }

  function toVisualizerUrl(path) {
    const clean = normalizePath(path);
    if (!clean) return "";
    if (/^(blob:|data:|https?:|file:)/i.test(clean)) return clean;
    if (clean.startsWith("../") || clean.startsWith("./") || clean.startsWith("/")) return clean;
    return `../${clean}`;
  }

  function setPlaceholderVisible(visible) {
    placeholder.hidden = !visible;
    placeholder.classList.toggle("is-hidden", !visible);
  }

  function getStagePoint(event) {
    const rect = stage.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  function syncValueLabels() {
    sizeValue.textContent = `${Math.round(state.size)}%`;
    rotationValue.textContent = `${Math.round(state.rotation)} deg`;
    skewValue.textContent = `${Math.round(state.skew)} deg`;
    opacityValue.textContent = `${Math.round(state.opacity)}%`;
    shadowValue.textContent = `${Math.round(state.shadow)}`;
  }

  function syncInputs() {
    sizeInput.value = String(state.size);
    rotationInput.value = String(state.rotation);
    skewInput.value = String(state.skew);
    opacityInput.value = String(state.opacity);
    shadowInput.value = String(state.shadow);
    syncValueLabels();
  }

  function renderPainting() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const frameWidth = rect.width * (state.size / 100);
    paintingImage.style.width = `${frameWidth}px`;
    paintingImage.style.left = `${state.x * 100}%`;
    paintingImage.style.top = `${state.y * 100}%`;
    paintingImage.style.opacity = `${state.opacity / 100}`;
    paintingImage.style.transform = `translate(-50%, -50%) rotate(${state.rotation}deg) skewX(${state.skew}deg)`;
    paintingImage.style.filter = `drop-shadow(0px ${Math.round(state.shadow * 0.32)}px ${Math.round(state.shadow)}px rgba(0, 0, 0, 0.32))`;
    syncValueLabels();
  }

  function buildArtworkCandidates(work) {
    const candidates = [];
    const id = normalizePath(work?.id || "");
    const workImage = normalizePath(work?.image || "");
    const workFilename = workImage.split("/").pop() || "";
    const renderFromData = normalizePath(work?.render || work?.renderImage || "");

    if (renderFromData) candidates.push(renderFromData);
    if (workFilename) {
      candidates.push(`assets/img/renders/${workFilename}`);
      candidates.push(`assets/renders/${workFilename}`);
    }
    if (id && renderImageById[id]) candidates.push(renderImageById[id]);
    if (workImage) candidates.push(workImage);

    return [...new Set(candidates.filter(Boolean))];
  }

  function testImageLoad(url) {
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = url;
    });
  }

  async function resolveArtworkSource(work) {
    const candidates = buildArtworkCandidates(work);
    for (const candidate of candidates) {
      const url = toVisualizerUrl(candidate);
      // eslint-disable-next-line no-await-in-loop
      const ok = await testImageLoad(url);
      if (ok) return url;
    }
    return "";
  }

  async function setArtworkById(artworkId) {
    const artwork = state.artworks.find((item) => item.id === artworkId);
    if (!artwork) return;

    state.selectedArtworkId = artwork.id;
    artworkSelect.value = artwork.id;
    paintingImage.alt = localizeTitle(artwork);

    const token = ++state.artworkLoadToken;
    const source = await resolveArtworkSource(artwork);
    if (token !== state.artworkLoadToken) return;

    if (!source) {
      paintingImage.hidden = true;
      paintingImage.removeAttribute("src");
      return;
    }

    paintingImage.hidden = true;
    paintingImage.src = source;
  }

  function resetPlacement() {
    state.x = 0.5;
    state.y = 0.52;
    state.size = 34;
    state.rotation = 0;
    state.skew = 0;
    state.opacity = 100;
    state.shadow = 20;
    syncInputs();
    renderPainting();
  }

  function setRoomImageFromFile(file) {
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      window.alert("Selecciona un archivo de imagen valido.");
      return;
    }

    if (state.roomObjectUrl) {
      URL.revokeObjectURL(state.roomObjectUrl);
      state.roomObjectUrl = "";
    }

    roomImage.hidden = true;
    setPlaceholderVisible(true);
    state.roomObjectUrl = URL.createObjectURL(file);
    roomImage.src = state.roomObjectUrl;
  }

  async function loadWorks() {
    if (window.location.protocol === "file:") {
      return fallbackWorks;
    }

    try {
      const response = await fetch("../data/works.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length) return data;
    } catch (error) {
      console.warn("[Visualizer] No se pudo cargar works.json, uso fallback local.", error);
    }

    return fallbackWorks;
  }

  function populateArtworkSelect(works) {
    artworkSelect.innerHTML = works
      .map((work) => `<option value="${work.id}">${localizeTitle(work)}</option>`)
      .join("");
  }

  async function exportComposition() {
    if (!roomImage.complete || roomImage.naturalWidth === 0) {
      window.alert("Sube primero una foto del espacio.");
      return;
    }
    if (!paintingImage.complete || paintingImage.naturalWidth === 0) {
      window.alert("No se pudo cargar el cuadro seleccionado.");
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return;

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = roomImage.naturalWidth;
    outputCanvas.height = roomImage.naturalHeight;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(roomImage, 0, 0, outputCanvas.width, outputCanvas.height);

    const centerX = state.x * outputCanvas.width;
    const centerY = state.y * outputCanvas.height;
    const scaleX = outputCanvas.width / stageRect.width;
    const frameWidth = stageRect.width * (state.size / 100) * scaleX;
    const frameHeight = frameWidth * (paintingImage.naturalHeight / paintingImage.naturalWidth);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.transform(1, 0, Math.tan((state.skew * Math.PI) / 180), 1, 0, 0);
    ctx.globalAlpha = state.opacity / 100;
    if (state.shadow > 0) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
      ctx.shadowBlur = state.shadow * scaleX * 0.8;
      ctx.shadowOffsetY = state.shadow * scaleX * 0.25;
    }
    ctx.drawImage(paintingImage, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
    ctx.restore();

    outputCanvas.toBlob((blob) => {
      if (!blob) return;
      const tempUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = tempUrl;
      link.download = `simulacion-${state.selectedArtworkId || "obra"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(tempUrl);
    }, "image/png");
  }

  paintingImage.addEventListener("load", () => {
    paintingImage.hidden = false;
    renderPainting();
  });

  roomImage.addEventListener("load", () => {
    roomImage.hidden = false;
    setPlaceholderVisible(false);
    if (roomImage.naturalWidth && roomImage.naturalHeight) {
      stage.style.aspectRatio = `${roomImage.naturalWidth} / ${roomImage.naturalHeight}`;
    }
    renderPainting();
  });

  roomImage.addEventListener("error", () => {
    roomImage.hidden = true;
    setPlaceholderVisible(true);
    window.alert("No se pudo cargar la foto seleccionada.");
  });

  paintingImage.addEventListener("pointerdown", (event) => {
    const point = getStagePoint(event);
    state.dragging = true;
    state.dragOffsetX = point.x - state.x * point.width;
    state.dragOffsetY = point.y - state.y * point.height;
    paintingImage.classList.add("is-dragging");
    paintingImage.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const point = getStagePoint(event);
    state.x = clamp((point.x - state.dragOffsetX) / point.width, 0.02, 0.98);
    state.y = clamp((point.y - state.dragOffsetY) / point.height, 0.02, 0.98);
    renderPainting();
  });

  window.addEventListener("pointerup", () => {
    state.dragging = false;
    paintingImage.classList.remove("is-dragging");
  });

  roomInput.addEventListener("change", () => {
    const file = roomInput.files && roomInput.files[0];
    if (!file) return;
    setRoomImageFromFile(file);
  });

  artworkSelect.addEventListener("change", () => {
    setArtworkById(artworkSelect.value);
  });

  sizeInput.addEventListener("input", () => {
    state.size = Number(sizeInput.value);
    renderPainting();
  });

  rotationInput.addEventListener("input", () => {
    state.rotation = Number(rotationInput.value);
    renderPainting();
  });

  skewInput.addEventListener("input", () => {
    state.skew = Number(skewInput.value);
    renderPainting();
  });

  opacityInput.addEventListener("input", () => {
    state.opacity = Number(opacityInput.value);
    renderPainting();
  });

  shadowInput.addEventListener("input", () => {
    state.shadow = Number(shadowInput.value);
    renderPainting();
  });

  resetBtn.addEventListener("click", resetPlacement);
  downloadBtn.addEventListener("click", exportComposition);
  window.addEventListener("resize", renderPainting);
  window.addEventListener("beforeunload", () => {
    if (state.roomObjectUrl) URL.revokeObjectURL(state.roomObjectUrl);
  });

  (async () => {
    state.artworks = await loadWorks();
    populateArtworkSelect(state.artworks);
    await setArtworkById(state.artworks[0]?.id || "");
    syncInputs();
    setPlaceholderVisible(true);
    renderPainting();
  })();
});
