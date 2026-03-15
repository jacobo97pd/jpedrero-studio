document.addEventListener("DOMContentLoaded", () => {
  // Ano dinamico en footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Menu movil
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      const inside = nav.contains(event.target) || btn.contains(event.target);
      if (!inside && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Entrada suave y minimal del visual principal
  const heroArt = document.querySelector(".hero-art");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroArt && !reducedMotion) {
    heroArt.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "both"
      }
    );
  }

  // Reveal elegante y discreto en scroll
  if (!reducedMotion) {
    const groups = [
      ".hero-copy",
      ".hero-art",
      ".section-head",
      ".featured-card",
      ".about-copy",
      ".about-grid .page-box",
      ".works-grid .card",
      ".page-hero",
      ".page-grid .page-box"
    ];

    const targets = groups.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    );

    targets.forEach((el, index) => {
      el.classList.add("reveal-item");
      const delay = Math.min(index * 35, 280);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // Consentimiento de cookies
  const consentKey = "jps_cookie_consent_v1";
  const hasConsent = localStorage.getItem(consentKey);
  if (!hasConsent) {
    const banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.innerHTML = `
      <div class="cookie-consent-box">
        <p class="cookie-consent-title">Cookies</p>
        <p class="cookie-consent-text">
          Usamos cookies tecnicas para el funcionamiento del sitio. Puedes aceptar o rechazar su uso.
          Consulta la <a href="/legal/cookies.html">politica de cookies</a>.
        </p>
        <div class="cookie-consent-actions">
          <button type="button" class="btn btn-ghost" data-consent="rejected">Rechazar</button>
          <button type="button" class="btn" data-consent="accepted">Aceptar</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.classList.add("cookie-open");

    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      const value = button.getAttribute("data-consent");
      localStorage.setItem(consentKey, value);
      document.body.classList.remove("cookie-open");
      banner.remove();
    });
  }

  // Zoom de cuadros en popup oscuro
  const zoomSelector = ".featured-card img, .works-grid .card img, .hero-art img, #workImage";
  let lightbox = null;
  let lightboxImg = null;

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="image-lightbox-stage">
        <button type="button" class="image-lightbox-close" aria-label="Cerrar">&times;</button>
        <img src="" alt="" />
      </div>
    `;
    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector("img");

    const closeBtn = lightbox.querySelector(".image-lightbox-close");
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  function openLightbox(src, alt) {
    ensureLightbox();
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagen ampliada";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  function addZoomToImage(img) {
    if (!img || img.dataset.zoomReady === "1") return;
    const host = img.closest(".featured-card, .card, .hero-art, figure");
    if (!host) return;

    host.classList.add("zoom-host");
    if (!host.querySelector(".zoom-btn")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "zoom-btn";
      button.setAttribute("aria-label", "Ampliar imagen");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="6"></circle>
          <line x1="16.2" y1="16.2" x2="21" y2="21"></line>
          <line x1="11" y1="8.5" x2="11" y2="13.5"></line>
          <line x1="8.5" y1="11" x2="13.5" y2="11"></line>
        </svg>
      `;

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const src = img.currentSrc || img.src;
        openLightbox(src, img.alt);
      });

      host.appendChild(button);
    }

    img.dataset.zoomReady = "1";
  }

  function initZoom(root = document) {
    if (!(root instanceof Element || root instanceof Document)) return;
    const images = root.querySelectorAll(zoomSelector);
    images.forEach(addZoomToImage);
  }

  initZoom(document);
  const zoomObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches && node.matches(zoomSelector)) addZoomToImage(node);
        initZoom(node);
      }
    }
  });
  zoomObserver.observe(document.body, { childList: true, subtree: true });
});
