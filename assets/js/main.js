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
  }

  // Entrada del cuadro principal desde el fondo al cargar
  const heroArt = document.querySelector(".hero-art");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroArt && !reducedMotion) {
    heroArt.animate(
      [
        { opacity: 0, transform: "translateY(56px) scale(0.93)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both"
      }
    );
  }
});
