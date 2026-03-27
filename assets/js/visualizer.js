document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("vizStage");
  const roomInput = document.getElementById("vizRoomInput");
  const artworkSelect = document.getElementById("vizArtworkSelect");
  const roomImage = document.getElementById("vizRoomImage");
  const artworkLayer = document.getElementById("vizArtworkLayer");
  const paintingModel = document.getElementById("vizPaintingModel");
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
  const modeMoveBtn = document.getElementById("vizModeMove");
  const modeModelBtn = document.getElementById("vizModeModel");

  if (
    !stage || !roomInput || !artworkSelect || !roomImage || !artworkLayer || !paintingModel || !paintingImage || !placeholder ||
    !sizeInput || !rotationInput || !skewInput || !opacityInput || !shadowInput ||
    !sizeValue || !rotationValue || !skewValue || !opacityValue || !shadowValue ||
    !resetBtn || !downloadBtn || !modeMoveBtn || !modeModelBtn
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

  // Preferred rendered still images for fallback/export.
  const renderImageById = {
    cuadro1: "assets/blenders/retrato.jpeg",
    cuadro2: "assets/blenders/barco.jpeg",
    cuadro3: "assets/blenders/atardecer.jpeg",
    cuadro4: "assets/blenders/londoeye.jpeg",
    cuadro5: "assets/blenders/caballo.jpeg",
    cuadro6: "assets/blenders/cuadro6.png"
  };

  // Preferred 3D models for the simulator.
  const modelById = {
    cuadro1: { model: "assets/blenders/cuadro_retrato_3d.glb?v=1", poster: "assets/blenders/retrato.jpeg" },
    cuadro2: { model: "assets/blenders/cuadro_barco_3d.glb?v=1", poster: "assets/blenders/barco.jpeg" },
    cuadro3: { model: "assets/blenders/cuadro_atardecer_3d.glb?v=1", poster: "assets/blenders/atardecer.jpeg" },
    cuadro4: { model: "assets/blenders/cuadro_london_eye_3d.glb?v=1", poster: "assets/blenders/londoeye.jpeg" },
    cuadro5: { model: "assets/blenders/cuadro_caballos_3d_front.glb?v=1", poster: "assets/blenders/caballo.jpeg" },
    cuadro6: {
      model: "assets/blenders/cuadro_retrato_3d.glb?v=1",
      poster: "assets/blenders/cuadro6.png",
      texture: "assets/blenders/cuadro6.png"
    }
  };

  const DEFAULT_CAMERA_ORBIT = "210deg 82deg 125%";
  const DEFAULT_MIN_CAMERA_ORBIT = "auto 65deg 80%";
  const DEFAULT_MAX_CAMERA_ORBIT = "auto 95deg 220%";

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
    artworkLoadToken: 0,
    modelEnabled: false,
    interactionMode: "move"
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
    rotationValue.textContent = `${Math.round(state.rotation)}deg`;
    skewValue.textContent = `${Math.round(state.skew)}deg`;
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

  function syncModeButtons() {
    const isMove = state.interactionMode === "move";
    modeMoveBtn.classList.toggle("is-active", isMove);
    modeModelBtn.classList.toggle("is-active", !isMove);
    artworkLayer.classList.toggle("is-model-mode", !isMove);
  }

  function setInteractionMode(mode) {
    const safeMode = mode === "model" && state.modelEnabled ? "model" : "move";
    state.interactionMode = safeMode;
    if (safeMode === "model") {
      stage.style.cursor = "default";
    } else {
      stage.style.removeProperty("cursor");
    }
    syncModeButtons();
  }

  function renderArtworkLayer() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const layerWidth = rect.width * (state.size / 100);
    artworkLayer.style.width = `${layerWidth}px`;
    artworkLayer.style.left = `${state.x * 100}%`;
    artworkLayer.style.top = `${state.y * 100}%`;
    artworkLayer.style.opacity = `${state.opacity / 100}`;
    artworkLayer.style.transform = `translate(-50%, -50%) rotate(${state.rotation}deg) skewX(${state.skew}deg)`;
    artworkLayer.style.filter = `drop-shadow(0px ${Math.round(state.shadow * 0.32)}px ${Math.round(state.shadow)}px rgba(0, 0, 0, 0.32))`;
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

  function buildModelConfig(work, posterSrc) {
    const mapped = modelById[work?.id] || {};
    const modelPath = normalizePath(work?.model || work?.modelSrc || mapped.model || "");
    if (!modelPath) return null;

    const texturePath = normalizePath(work?.modelTexture || mapped.texture || "");
    const posterPath = normalizePath(work?.modelPoster || mapped.poster || "");
    return {
      modelSrc: toVisualizerUrl(modelPath),
      textureSrc: toVisualizerUrl(texturePath),
      posterSrc: posterSrc || toVisualizerUrl(posterPath),
      cameraOrbit: work?.modelCameraOrbit || mapped.cameraOrbit || DEFAULT_CAMERA_ORBIT,
      minCameraOrbit: work?.modelMinCameraOrbit || mapped.minCameraOrbit || DEFAULT_MIN_CAMERA_ORBIT,
      maxCameraOrbit: work?.modelMaxCameraOrbit || mapped.maxCameraOrbit || DEFAULT_MAX_CAMERA_ORBIT
    };
  }

  async function applyModelTextureToViewer(viewer, textureSrc) {
    if (
      !viewer || !textureSrc || typeof viewer.createTexture !== "function" ||
      !viewer.model || !Array.isArray(viewer.model.materials) || !viewer.model.materials.length
    ) {
      return;
    }

    try {
      const texture = await viewer.createTexture(textureSrc);
      const material = viewer.model.materials[0];
      if (material && material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      }
    } catch (error) {
      console.warn("[Visualizer] No se pudo aplicar textura 3D personalizada.", error);
    }
  }

  function loadModelIntoViewer(config, token) {
    if (!config || !config.modelSrc) return Promise.resolve(false);

    return new Promise((resolve) => {
      let done = false;
      const clean = () => {
        paintingModel.removeEventListener("load", onLoad);
        paintingModel.removeEventListener("error", onError);
        window.clearTimeout(timeoutId);
      };
      const finish = (ok) => {
        if (done) return;
        done = true;
        clean();
        resolve(ok);
      };
      const onError = () => finish(false);
      const onLoad = async () => {
        if (token !== state.artworkLoadToken) {
          finish(false);
          return;
        }
        if (config.textureSrc) {
          await applyModelTextureToViewer(paintingModel, config.textureSrc);
        }
        finish(true);
      };

      const timeoutId = window.setTimeout(() => finish(false), 9000);
      paintingModel.addEventListener("load", onLoad);
      paintingModel.addEventListener("error", onError);

      paintingModel.setAttribute("camera-orbit", config.cameraOrbit);
      paintingModel.setAttribute("min-camera-orbit", config.minCameraOrbit);
      paintingModel.setAttribute("max-camera-orbit", config.maxCameraOrbit);
      if (config.posterSrc) {
        paintingModel.setAttribute("poster", config.posterSrc);
      } else {
        paintingModel.removeAttribute("poster");
      }
      paintingModel.setAttribute("src", config.modelSrc);
    });
  }

  async function setArtworkById(artworkId) {
    const artwork = state.artworks.find((item) => item.id === artworkId);
    if (!artwork) return;

    state.selectedArtworkId = artwork.id;
    artworkSelect.value = artwork.id;
    paintingImage.alt = localizeTitle(artwork);
    paintingModel.setAttribute("alt", `${localizeTitle(artwork)} 3D`);

    const token = ++state.artworkLoadToken;
    state.modelEnabled = false;
    paintingModel.hidden = true;
    paintingImage.hidden = true;
    artworkLayer.hidden = true;
    paintingModel.removeAttribute("src");
    paintingModel.removeAttribute("poster");

    const fallbackSource = await resolveArtworkSource(artwork);
    if (token !== state.artworkLoadToken) return;

    if (fallbackSource) {
      paintingImage.src = fallbackSource;
    } else {
      paintingImage.removeAttribute("src");
    }

    const modelConfig = buildModelConfig(artwork, fallbackSource);
    let modelLoaded = false;
    if (modelConfig) {
      modelLoaded = await loadModelIntoViewer(modelConfig, token);
      if (token !== state.artworkLoadToken) return;
    }

    if (modelLoaded) {
      state.modelEnabled = true;
      paintingModel.hidden = false;
      paintingImage.hidden = true;
      artworkLayer.hidden = false;
      setInteractionMode(state.interactionMode);
      renderArtworkLayer();
      return;
    }

    state.modelEnabled = false;
    paintingModel.hidden = true;
    setInteractionMode("move");

    if (fallbackSource) {
      paintingImage.hidden = false;
      artworkLayer.hidden = false;
      renderArtworkLayer();
    } else {
      paintingImage.hidden = true;
      artworkLayer.hidden = true;
    }
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
    renderArtworkLayer();
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

  function exportComposition() {
    if (!roomImage.complete || roomImage.naturalWidth === 0) {
      window.alert("Sube primero una foto del espacio.");
      return;
    }
    if (!paintingImage.complete || paintingImage.naturalWidth === 0) {
      window.alert("No se pudo preparar una imagen de referencia del cuadro para descargar.");
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
    if (paintingImage.naturalWidth && paintingImage.naturalHeight) {
      artworkLayer.style.aspectRatio = `${paintingImage.naturalWidth} / ${paintingImage.naturalHeight}`;
    }
    if (!state.modelEnabled) {
      paintingImage.hidden = false;
      artworkLayer.hidden = false;
    }
    renderArtworkLayer();
  });

  roomImage.addEventListener("load", () => {
    roomImage.hidden = false;
    setPlaceholderVisible(false);
    if (roomImage.naturalWidth && roomImage.naturalHeight) {
      stage.style.aspectRatio = `${roomImage.naturalWidth} / ${roomImage.naturalHeight}`;
    }
    renderArtworkLayer();
  });

  roomImage.addEventListener("error", () => {
    roomImage.hidden = true;
    setPlaceholderVisible(true);
    window.alert("No se pudo cargar la foto seleccionada.");
  });

  artworkLayer.addEventListener("pointerdown", (event) => {
    if (state.interactionMode !== "move") return;
    const point = getStagePoint(event);
    state.dragging = true;
    state.dragOffsetX = point.x - state.x * point.width;
    state.dragOffsetY = point.y - state.y * point.height;
    artworkLayer.classList.add("is-dragging");
    artworkLayer.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const point = getStagePoint(event);
    state.x = clamp((point.x - state.dragOffsetX) / point.width, 0.02, 0.98);
    state.y = clamp((point.y - state.dragOffsetY) / point.height, 0.02, 0.98);
    renderArtworkLayer();
  });

  window.addEventListener("pointerup", () => {
    state.dragging = false;
    artworkLayer.classList.remove("is-dragging");
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
    renderArtworkLayer();
  });

  rotationInput.addEventListener("input", () => {
    state.rotation = Number(rotationInput.value);
    renderArtworkLayer();
  });

  skewInput.addEventListener("input", () => {
    state.skew = Number(skewInput.value);
    renderArtworkLayer();
  });

  opacityInput.addEventListener("input", () => {
    state.opacity = Number(opacityInput.value);
    renderArtworkLayer();
  });

  shadowInput.addEventListener("input", () => {
    state.shadow = Number(shadowInput.value);
    renderArtworkLayer();
  });

  modeMoveBtn.addEventListener("click", () => {
    setInteractionMode("move");
  });

  modeModelBtn.addEventListener("click", () => {
    setInteractionMode("model");
  });

  resetBtn.addEventListener("click", resetPlacement);
  downloadBtn.addEventListener("click", exportComposition);
  window.addEventListener("resize", renderArtworkLayer);
  window.addEventListener("beforeunload", () => {
    if (state.roomObjectUrl) URL.revokeObjectURL(state.roomObjectUrl);
  });

  (async () => {
    state.artworks = await loadWorks();
    populateArtworkSelect(state.artworks);
    await setArtworkById(state.artworks[0]?.id || "");
    syncInputs();
    setInteractionMode("move");
    setPlaceholderVisible(true);
    renderArtworkLayer();
  })();
});
