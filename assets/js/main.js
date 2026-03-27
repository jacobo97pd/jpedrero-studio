document.addEventListener("DOMContentLoaded", () => {
  const i18n = {
    es: {
      common: {
        homeAria: "Inicio",
        openMenu: "Abrir menu",
        navAria: "Navegacion principal",
        nav: { works: "Obras", visualizer: "Visualizador", collections: "Colecciones", about: "Sobre", commissions: "Encargos", contact: "Contacto" },
        footerHome: "Inicio",
        footerBackTop: "Volver arriba",
        footerTagline: "Obra original · Encargos por propuesta · Envio nacional e internacional",
        cookieTitle: "Cookies",
        cookieText: "Usamos cookies tecnicas para el funcionamiento del sitio. Puedes aceptar o rechazar su uso. Consulta la politica de cookies.",
        cookieAccept: "Aceptar",
        cookieReject: "Rechazar",
        readMore: "Leer mas",
        close: "Cerrar",
        bookPrev: "Pagina anterior",
        bookNext: "Pagina siguiente",
        imageUnavailable: "OBRA NO DISPONIBLE",
        metaDate: "Fecha",
        metaAuthor: "Autor",
        metaSize: "Medida",
        metaTechnique: "Tecnica",
        metaSupport: "Soporte",
        metaStatus: "Estado",
        studioDefault: "J. PEDRERO STUDIO"
      }
    },
    en: {
      common: {
        homeAria: "Home",
        openMenu: "Open menu",
        navAria: "Main navigation",
        nav: { works: "Works", visualizer: "Visualizer", collections: "Collections", about: "About", commissions: "Commissions", contact: "Contact" },
        footerHome: "Home",
        footerBackTop: "Back to top",
        footerTagline: "Original artwork · Commissions by proposal · National and international shipping",
        cookieTitle: "Cookies",
        cookieText: "We use technical cookies for site functionality. You can accept or reject them. See the cookies policy.",
        cookieAccept: "Accept",
        cookieReject: "Reject",
        readMore: "Read more",
        close: "Close",
        bookPrev: "Previous page",
        bookNext: "Next page",
        imageUnavailable: "ARTWORK UNAVAILABLE",
        metaDate: "Date",
        metaAuthor: "Author",
        metaSize: "Size",
        metaTechnique: "Technique",
        metaSupport: "Support",
        metaStatus: "Status",
        studioDefault: "J. PEDRERO STUDIO"
      }
    }
  };

  i18n.es.pages = {
    home: {
      kicker: "Experiencia",
      title: "Cuaderno de obra",
      lead: "Apertura automatica al cargar y paso de paginas elegante. Puedes avanzar o retroceder de forma manual.",
      featuredTitle: "Obras destacadas",
      featuredLead: "Seis piezas clave, presentadas con una composicion limpia y contemporanea.",
      featuredLink: "Ver galeria completa →",
      aboutTitle: "Sobre el artista",
      aboutLead: "Mi trabajo investiga la tension entre estructura y emocion. Cada pieza se construye con una mirada contemporanea para dialogar con la luz, el espacio y el tiempo.",
      aboutMore1: "Trabajo en series limitadas y desarrollo encargos por propuesta. La meta es crear obra con identidad, sobriedad y permanencia.",
      aboutMore2: "Para disponibilidad, precios o comisiones, puedes contactarme con una referencia o idea general.",
      commissionsLink: "Encargos →",
      catalogTitle: "Catalogo privado",
      catalogLead: "Acceso a obras disponibles, medidas y condiciones de entrega.",
      catalogCta: "Solicitar ahora",
      featuredCards: ["Retrato en carmin", "Barco azul", "Orilla al atardecer", "London Eye", "Caballos", "El Padrino"]
    },
    works: { kicker: "Galeria", title: "Obras", lead: "Coleccion completa en formato digital con vista limpia y ficha individual de cada pieza." },
    work: { back: "Volver a obras", kicker: "Ficha", info: "Para disponibilidad y precio, solicita informacion por contacto directo.", cta: "Solicitar informacion" },
    about: { kicker: "Artista", title: "Sobre mi", lead: "Mi practica artistica nace entre ingenieria y expresion visual: una combinacion de estructura, gesto y materia para crear obra contemporanea de atmosfera serena.", t1: "Enfoque", p1: "Trabajo en series limitadas y en encargos seleccionados. Cada pieza se plantea como un dialogo entre composicion, luz y presencia espacial.", t2: "Tecnica", p2: "Pastel, oleo y tecnica mixta sobre soportes de alta calidad, con especial cuidado en acabados y conservacion." },
    collections: { kicker: "Series", title: "Colecciones", lead: "Series en desarrollo con narrativa propia, pensadas para instalarse como conjunto o individualmente.", t1: "Curaduria", p1: "Proximamente disponible dossier de cada serie con concepto, tecnicas, medidas y disponibilidad.", t2: "Acceso anticipado", p2: "Solicita catalogo privado para ver obras antes de publicacion abierta.", cta: "Solicitar catalogo" },
    commissions: { kicker: "Comision", title: "Encargos", lead: "Desarrollo obra bajo propuesta personalizada, respetando el caracter del espacio y la intencion del cliente.", t1: "Proceso", t2: "Plazos", p4: "Rango habitual de 3 a 8 semanas, segun tecnica y formato.", cta: "Iniciar encargo" },
    contact: { kicker: "Contacto", title: "Hablemos", lead: "Cuentame que necesitas y te respondo con disponibilidad, opciones y siguiente paso.", form: "Formulario", direct: "Contacto directo", l1: "Nombre", l2: "Apellidos", l3: "Email", l4: "Telefono (opcional)", l5: "Descripcion de lo que quieres", send: "Enviar", hint: "Al enviar, el formulario se manda directamente a jpedrero.studio.art@gmail.com." },
    privacy: { kicker: "Legal", title: "Politica de privacidad", lead: "Informacion general sobre tratamiento de datos personales en J. Pedrero Studio.", back: "Volver al inicio" },
    cookies: { kicker: "Legal", title: "Politica de cookies", lead: "Informacion sobre el uso de cookies y gestion del consentimiento en este sitio.", back: "Volver al inicio" }
  };

  i18n.en.pages = {
    home: {
      kicker: "Experience",
      title: "Studio notebook",
      lead: "Automatic opening on load and elegant page turns. You can move forward or backward manually.",
      featuredTitle: "Featured works",
      featuredLead: "Six key pieces presented with a clean, contemporary composition.",
      featuredLink: "View full gallery →",
      aboutTitle: "About the artist",
      aboutLead: "My work explores the tension between structure and emotion. Each piece is built with a contemporary gaze to dialogue with light, space and time.",
      aboutMore1: "I work in limited series and selected commissions. The goal is to create work with identity, restraint and permanence.",
      aboutMore2: "For availability, pricing or commissions, contact me with a reference or general idea.",
      commissionsLink: "Commissions →",
      catalogTitle: "Private catalog",
      catalogLead: "Access to available works, dimensions and delivery conditions.",
      catalogCta: "Request now",
      featuredCards: ["Crimson Portrait", "Blue Ship", "Shore at Dusk", "London Eye", "Horses", "The Godfather"]
    },
    works: { kicker: "Gallery", title: "Works", lead: "Complete collection in a clean digital format with an individual sheet for each piece." },
    work: { back: "Back to works", kicker: "Sheet", info: "For availability and pricing, request information through direct contact.", cta: "Request information" },
    about: { kicker: "Artist", title: "About me", lead: "My artistic practice emerges between engineering and visual expression: a combination of structure, gesture and material to create contemporary work with a serene atmosphere.", t1: "Approach", p1: "I work in limited series and selected commissions. Each piece is conceived as a dialogue between composition, light and spatial presence.", t2: "Technique", p2: "Pastel, oil and mixed media on high-quality supports, with special care in finishes and conservation." },
    collections: { kicker: "Series", title: "Collections", lead: "Series in development with their own narrative, designed to be installed as a set or individually.", t1: "Curation", p1: "A dossier for each series with concept, techniques, sizes and availability will be available soon.", t2: "Early access", p2: "Request the private catalog to view works before public release.", cta: "Request catalog" },
    commissions: { kicker: "Commission", title: "Commissions", lead: "I develop artworks through tailored proposals, respecting the character of the space and the client's intention.", t1: "Process", t2: "Timeline", p4: "Typical range: 3 to 8 weeks, depending on technique and format.", cta: "Start commission" },
    contact: { kicker: "Contact", title: "Let's talk", lead: "Tell me what you need and I will reply with availability, options and next steps.", form: "Form", direct: "Direct contact", l1: "First name", l2: "Last name", l3: "Email", l4: "Phone (optional)", l5: "Description of what you are looking for", send: "Send", hint: "When submitted, the form is sent directly to jpedrero.studio.art@gmail.com." },
    privacy: { kicker: "Legal", title: "Privacy policy", lead: "General information about personal data processing at J. Pedrero Studio.", back: "Back to home" },
    cookies: { kicker: "Legal", title: "Cookies policy", lead: "Information about cookies use and consent management on this site.", back: "Back to home" }
  };

  const langStoreKey = "jps_lang";
  const allowedLangs = ["es", "en"];
  let currentLang = localStorage.getItem(langStoreKey);
  if (!allowedLangs.includes(currentLang)) currentLang = "es";

  function tr(path, fallback = "") {
    const node = path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), i18n[currentLang]);
    return node === undefined ? fallback : node;
  }

  function localize(value) {
    if (!value) return "";
    if (typeof value === "object") return value[currentLang] || value.es || "";
    return value;
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && typeof value === "string") el.textContent = value;
  }

  function injectLanguageSwitcher() {
    if (document.querySelector(".lang-switcher")) return;
    const host = document.querySelector(".header-inner");
    const switcher = document.createElement("div");
    switcher.className = "lang-switcher";
    switcher.innerHTML = `
      <button type="button" class="lang-btn" data-lang="es">ES</button>
      <button type="button" class="lang-btn" data-lang="en">EN</button>
    `;
    if (host) {
      const navNode = document.getElementById("siteNav");
      (navNode || host).appendChild(switcher);
    } else {
      switcher.classList.add("lang-switcher-floating");
      document.body.appendChild(switcher);
    }
    switcher.addEventListener("click", (event) => {
      const langBtn = event.target.closest(".lang-btn");
      if (!langBtn) return;
      const nextLang = langBtn.getAttribute("data-lang");
      if (!allowedLangs.includes(nextLang) || nextLang === currentLang) return;
      currentLang = nextLang;
      localStorage.setItem(langStoreKey, currentLang);
      window.location.reload();
    });
  }

  function updateLanguageSwitcherState() {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-lang") === currentLang);
    });
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    const pageTexts = i18n[currentLang].pages;
    const brand = document.querySelector(".brand");
    if (brand) brand.setAttribute("aria-label", tr("common.homeAria"));
    const menuBtn = document.getElementById("navToggle");
    if (menuBtn) menuBtn.setAttribute("aria-label", tr("common.openMenu"));
    const mainNav = document.getElementById("siteNav");
    if (mainNav) mainNav.setAttribute("aria-label", tr("common.navAria"));

    document.querySelectorAll(".site-nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.includes("works/index.html")) a.textContent = tr("common.nav.works");
      if (href.includes("visualizer/index.html")) a.textContent = tr("common.nav.visualizer");
      if (href.includes("collections/index.html")) a.textContent = tr("common.nav.collections");
      if (href.includes("about/index.html")) a.textContent = tr("common.nav.about");
      if (href.includes("commissions/index.html")) a.textContent = tr("common.nav.commissions");
      if (href.includes("contact/index.html")) a.textContent = tr("common.nav.contact");
    });

    const footerTag = document.querySelector(".footer-grid .fineprint");
    if (footerTag) footerTag.textContent = tr("common.footerTagline");
    const footerTop = document.querySelector('.footer-bottom a[href="#top"]');
    if (footerTop) footerTop.textContent = tr("common.footerBackTop");
    document.querySelectorAll('.footer-bottom a[href$="index.html"]').forEach((a) => {
      if (!(a.getAttribute("href") || "").includes("#")) a.textContent = tr("common.footerHome");
    });
    document.querySelectorAll('.footer-links a[href*="legal/privacy"]').forEach((a) => {
      a.textContent = currentLang === "en" ? "Privacy" : "Privacidad";
    });
    document.querySelectorAll('.footer-links a[href*="legal/cookies"]').forEach((a) => {
      a.textContent = currentLang === "en" ? "Cookies" : "Cookies";
    });

    if (document.getElementById("artBookSpread")) {
      const page = pageTexts.home;
      document.title = currentLang === "en" ? "J. Pedrero Studio" : "J. Pedrero Studio";
      setText(".book-hero-head .kicker", page.kicker);
      setText(".book-hero-head h1", page.title);
      setText(".book-hero-head .lead", page.lead);
      setText(".section-head h2", page.featuredTitle);
      setText(".section-head p", page.featuredLead);
      setText(".section-foot .link", page.featuredLink);
      setText(".about-copy h2", page.aboutTitle);
      setText(".about-copy > p", page.aboutLead);
      const bioParagraphs = document.querySelectorAll("#bioExpand .bio-text p");
      if (bioParagraphs[0]) bioParagraphs[0].textContent = page.aboutMore1;
      if (bioParagraphs[1]) bioParagraphs[1].textContent = page.aboutMore2;
      setText(".about-actions .link", page.commissionsLink);
      const pageBoxes = document.querySelectorAll(".about-grid .page-box");
      if (pageBoxes[0]) {
        const h2 = pageBoxes[0].querySelector("h2");
        const p = pageBoxes[0].querySelector("p");
        const cta = pageBoxes[0].querySelector(".btn");
        if (h2) h2.textContent = page.catalogTitle;
        if (p) p.textContent = page.catalogLead;
        if (cta) cta.textContent = page.catalogCta;
      }
      const cards = document.querySelectorAll(".featured-card .featured-title");
      cards.forEach((card, idx) => {
        if (page.featuredCards[idx]) card.textContent = page.featuredCards[idx];
      });
    }

    if (document.getElementById("worksGrid")) {
      const page = pageTexts.works;
      document.title = currentLang === "en" ? "Works | J. Pedrero Studio" : "Obras | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
    }

    if (document.getElementById("workInfo")) {
      const page = pageTexts.work;
      document.title = currentLang === "en" ? "Artwork | J. Pedrero Studio" : "Obra | J. Pedrero Studio";
      setText(".header-inner .nav-cta", page.back);
      setText("#workInfo .kicker", page.kicker);
      const infoText = document.querySelector("#workInfo p:not(.kicker):not(#workMeta):not(.meta)");
      if (infoText) infoText.textContent = page.info;
      setText("#workInfo .btn", page.cta);
    }

    if (window.location.pathname.includes("/about/")) {
      const page = pageTexts.about;
      document.title = currentLang === "en" ? "About | J. Pedrero Studio" : "Sobre | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      const cards = document.querySelectorAll(".page-grid .page-box");
      if (cards[0]) {
        const h = cards[0].querySelector("h2");
        const p = cards[0].querySelector("p");
        if (h) h.textContent = page.t1;
        if (p) p.textContent = page.p1;
      }
      if (cards[1]) {
        const h = cards[1].querySelector("h2");
        const p = cards[1].querySelector("p");
        if (h) h.textContent = page.t2;
        if (p) p.textContent = page.p2;
      }
    }

    if (window.location.pathname.includes("/collections/")) {
      const page = pageTexts.collections;
      document.title = currentLang === "en" ? "Collections | J. Pedrero Studio" : "Colecciones | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      const cards = document.querySelectorAll(".page-grid .page-box");
      if (cards[0]) {
        const h = cards[0].querySelector("h2");
        const p = cards[0].querySelector("p");
        if (h) h.textContent = page.t1;
        if (p) p.textContent = page.p1;
      }
      if (cards[1]) {
        const h = cards[1].querySelector("h2");
        const p = cards[1].querySelector("p");
        const cta = cards[1].querySelector(".btn");
        if (h) h.textContent = page.t2;
        if (p) p.textContent = page.p2;
        if (cta) cta.textContent = page.cta;
      }
    }

    if (window.location.pathname.includes("/commissions/")) {
      const page = pageTexts.commissions;
      document.title = currentLang === "en" ? "Commissions | J. Pedrero Studio" : "Encargos | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      const cards = document.querySelectorAll(".page-grid .page-box");
      if (cards[0]) {
        const h = cards[0].querySelector("h2");
        const ps = cards[0].querySelectorAll("p");
        if (h) h.textContent = page.t1;
        if (ps[0]) ps[0].textContent = currentLang === "en" ? "1. Initial brief." : "1. Brief inicial.";
        if (ps[1]) ps[1].textContent = currentLang === "en" ? "2. Visual proposal." : "2. Propuesta visual.";
        if (ps[2]) ps[2].textContent = currentLang === "en" ? "3. Production and delivery." : "3. Produccion y entrega.";
      }
      if (cards[1]) {
        const h = cards[1].querySelector("h2");
        const ps = cards[1].querySelectorAll("p");
        const cta = cards[1].querySelector(".btn");
        if (h) h.textContent = page.t2;
        if (ps[0]) ps[0].textContent = page.p4;
        if (cta) cta.textContent = page.cta;
      }
    }

    if (window.location.pathname.includes("/contact/")) {
      const page = pageTexts.contact;
      document.title = currentLang === "en" ? "Contact | J. Pedrero Studio" : "Contacto | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      const boxes = document.querySelectorAll(".contact-layout .page-box");
      if (boxes[0]) {
        const h2 = boxes[0].querySelector("h2");
        if (h2) h2.textContent = page.form;
      }
      if (boxes[1]) {
        const h2 = boxes[1].querySelector("h2");
        if (h2) h2.textContent = page.direct;
      }
      const labels = document.querySelectorAll(".contact-form .form-field > span");
      if (labels[0]) labels[0].textContent = page.l1;
      if (labels[1]) labels[1].textContent = page.l2;
      if (labels[2]) labels[2].textContent = page.l3;
      if (labels[3]) labels[3].textContent = page.l4;
      if (labels[4]) labels[4].textContent = page.l5;
      setText(".contact-form .btn", page.send);
      setText("#contactHint", page.hint);
    }

    if (window.location.pathname.includes("/legal/privacy")) {
      const page = pageTexts.privacy;
      document.title = currentLang === "en" ? "Privacy | J. Pedrero Studio" : "Privacidad | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      setText(".section-foot .link", page.back);
      const cards = document.querySelectorAll(".page-grid .page-box");
      const privacy = currentLang === "en"
        ? [
            { t: "Controller", p1: "Data controller: J. Pedrero Studio.", p2: "Contact email: jpedrero.studio.art@gmail.com." },
            { t: "Processed data", p1: "Only data voluntarily provided by users through forms or email is processed.", p2: "Examples: first name, last name, email, phone (optional) and request description." },
            { t: "Purpose and legal basis", p1: "Purpose: manage inquiries, information requests and art commissions.", p2: "Legal basis: user consent when sending a request." },
            { t: "Retention and rights", p1: "Data is retained for the time required to handle the request and applicable legal obligations.", p2: "Users may request access, rectification or deletion by writing to the contact email." },
            { t: "Intellectual property of artworks", p1: "All artworks, images, texts and site contents are protected by copyright and intellectual property rights.", p2: "Reproduction, distribution or commercial use is not allowed without explicit authorization from the owner." }
          ]
        : [
            { t: "Responsable", p1: "Responsable del tratamiento: J. Pedrero Studio.", p2: "Correo de contacto: jpedrero.studio.art@gmail.com." },
            { t: "Datos tratados", p1: "Se tratan exclusivamente los datos que el usuario facilita de forma voluntaria en formularios o por correo.", p2: "Ejemplos: nombre, apellidos, email, telefono (opcional) y descripcion de la solicitud." },
            { t: "Finalidad y base legal", p1: "La finalidad es gestionar consultas, solicitudes de informacion y encargos artisticos.", p2: "La base legal es el consentimiento del usuario al enviar su consulta." },
            { t: "Conservacion y derechos", p1: "Los datos se conservan el tiempo necesario para atender la solicitud y obligaciones legales aplicables.", p2: "El usuario puede solicitar acceso, rectificacion o supresion escribiendo al correo indicado." },
            { t: "Propiedad intelectual de la obra", p1: "Todas las obras, imagenes, textos y contenidos del sitio estan protegidos por derechos de autor y propiedad intelectual.", p2: "No esta permitida su reproduccion, distribucion o uso comercial sin autorizacion expresa del titular." }
          ];
      cards.forEach((card, idx) => {
        const item = privacy[idx];
        if (!item) return;
        const h2 = card.querySelector("h2");
        const ps = card.querySelectorAll("p");
        if (h2) h2.textContent = item.t;
        if (ps[0]) ps[0].textContent = item.p1;
        if (ps[1]) ps[1].textContent = item.p2;
      });
    }

    if (window.location.pathname.includes("/legal/cookies")) {
      const page = pageTexts.cookies;
      document.title = currentLang === "en" ? "Cookies | J. Pedrero Studio" : "Cookies | J. Pedrero Studio";
      setText(".page-hero .kicker", page.kicker);
      setText(".page-hero h1", page.title);
      setText(".page-hero p", page.lead);
      setText(".section-foot .link", page.back);
      const cards = document.querySelectorAll(".page-grid .page-box");
      const cookies = currentLang === "en"
        ? [
            { t: "What cookies are", p1: "Cookies are small files stored in the browser to remember browsing information.", p2: "" },
            { t: "Cookies used", p1: "This site uses technical cookies and preference cookies to remember consent choices.", p2: "No third-party advertising cookies are used for commercial profiling." },
            { t: "Consent", p1: "A cookie notice is shown when entering the website, with options to accept or reject.", p2: "The choice is stored in the browser." },
            { t: "Management and disabling", p1: "Users can remove or block cookies from browser settings at any time.", p2: "Disabling cookies may affect the proper functioning of some parts of the site." }
          ]
        : [
            { t: "Que son las cookies", p1: "Las cookies son pequenos archivos que se almacenan en el navegador para recordar informacion de navegacion.", p2: "" },
            { t: "Cookies utilizadas", p1: "Este sitio utiliza cookies tecnicas de funcionamiento y cookies de preferencia para recordar la eleccion de consentimiento.", p2: "No se usan cookies publicitarias de terceros con fines de perfilado comercial." },
            { t: "Consentimiento", p1: "Al entrar en la web se muestra un aviso de cookies con opcion de aceptar o rechazar.", p2: "La eleccion se guarda en el navegador." },
            { t: "Gestion y desactivacion", p1: "El usuario puede eliminar o bloquear cookies desde la configuracion de su navegador en cualquier momento.", p2: "La desactivacion puede afectar al funcionamiento correcto de algunas partes del sitio." }
          ];
      cards.forEach((card, idx) => {
        const item = cookies[idx];
        if (!item) return;
        const h2 = card.querySelector("h2");
        const ps = card.querySelectorAll("p");
        if (h2) h2.textContent = item.t;
        if (ps[0]) ps[0].textContent = item.p1;
        if (ps[1]) ps[1].textContent = item.p2;
      });
    }

    const toggleBio = document.getElementById("toggleBio");
    if (toggleBio) {
      const isOpen = document.getElementById("bioExpand")?.classList.contains("open");
      toggleBio.textContent = isOpen ? tr("common.close") : tr("common.readMore");
    }

    updateLanguageSwitcherState();
  }
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

  injectLanguageSwitcher();
  applyTranslations();

  const bioToggleBtn = document.getElementById("toggleBio");
  if (bioToggleBtn) {
    bioToggleBtn.addEventListener("click", () => {
      const bio = document.getElementById("bioExpand");
      if (!bio) return;
      bio.classList.toggle("open");
      bioToggleBtn.textContent = bio.classList.contains("open") ? tr("common.close") : tr("common.readMore");
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
      ".book-hero-head",
      ".book-stage",
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

  // Cuaderno de obra (spread fijo + flip layer temporal)
  const artBookSpread = document.getElementById("artBookSpread");
  const artPageLeft = document.getElementById("artPageLeft");
  const artPageRight = document.getElementById("artPageRight");
  const artLeftContent = document.getElementById("artLeftContent");
  const artRightContent = document.getElementById("artRightContent");

  const artPageFlipLayer = document.getElementById("artPageFlipLayer");
  const artFlipSheet = document.getElementById("artFlipSheet");
  const artFlipFront = document.getElementById("artFlipFront");
  const artFlipBack = document.getElementById("artFlipBack");

  const prevArtworkBtn = document.getElementById("prevArtworkBtn");
  const nextArtworkBtn = document.getElementById("nextArtworkBtn");
  const artBookPagination = document.getElementById("artBookPagination");

    const artworks = [
      {
        title: { es: "Retrato en carmin", en: "Crimson Portrait" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Retrato contemporaneo de atmosfera calida y gestualidad suelta. La composicion trabaja veladuras y contrastes suaves para dirigir la mirada al gesto y a la expresion, con una construccion cromatica en capas que aporta profundidad y presencia en interior.",
          en: "Contemporary portrait with a warm atmosphere and loose gesture. The composition uses veils and soft contrasts to guide the eye to gesture and expression, with layered color construction that adds depth and presence indoors."
        },
        year: "2025",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "50x70 cm",
        technique: { es: "Tecnica mixta", en: "Mixed media" },
        support: { es: "Papel artistico montado", en: "Mounted fine art paper" },
        status: { es: "Original disponible", en: "Original available" },
        image: "assets/img/works/Cuadro1.png",
        model: "assets/blenders/cuadro_retrato_3d.glb?v=1"
      },
      {
        title: { es: "Barco azul", en: "Blue Ship" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Composicion marina de gran contraste, con trazos dinamicos y una paleta azul dominante que enfatiza la estructura del navio. La pieza explora tension entre masa y vacio, combinando dibujo gestual y capas de color para generar movimiento y ritmo visual.",
          en: "Marine composition with strong contrast, dynamic strokes and a dominant blue palette that emphasizes the ship structure. The piece explores tension between mass and void, combining gestural drawing and color layers to generate movement and rhythm."
        },
        year: "2024",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "60x60 cm",
        technique: { es: "Tecnica mixta", en: "Mixed media" },
        support: { es: "Papel artistico", en: "Fine art paper" },
        status: { es: "Original disponible", en: "Original available" },
        image: "assets/img/works/Cuadro3.png",
        model: "assets/blenders/cuadro_barco_3d.glb?v=1"
      },
      {
        title: { es: "Orilla al atardecer", en: "Shore at Dusk" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Escena de calma y luz suave en la costa. La obra explora equilibrio entre horizonte, agua y figura humana, con una atmosfera de transicion luminica que prioriza silencio y profundidad espacial. El color se organiza en gradaciones para sostener una lectura serena.",
          en: "Scene of calm and soft coastal light. The work explores balance between horizon, water and human figure, with a transitional atmosphere that prioritizes silence and spatial depth. Color is organized in gradients to sustain a serene reading."
        },
        year: "2025",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "70x100 cm",
        technique: { es: "Pastel y oleo", en: "Pastel and oil" },
        support: { es: "Papel artistico de algodon", en: "Cotton fine art paper" },
        status: { es: "Original disponible", en: "Original available" },
        image: "assets/img/works/Cuadro2.png",
        model: "assets/blenders/cuadro_atardecer_3d.glb?v=1"
      },
      {
        title: { es: "London Eye", en: "London Eye" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Paisaje urbano nocturno con fuerte presencia cromatica. La rueda y sus reflejos estructuran la tension visual de la pieza, mientras la figura en primer plano introduce narrativa y escala humana. La superficie combina capas opacas y transparencias para reforzar el ambiente de noche.",
          en: "Night urban scene with strong chromatic presence. The wheel and its reflections structure the visual tension of the piece, while the foreground figure introduces narrative and human scale. The surface combines opaque layers and transparencies to reinforce the nocturnal atmosphere."
        },
        year: "2026",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "80x60 cm",
        technique: { es: "Tecnica mixta", en: "Mixed media" },
        support: { es: "Papel artistico montado", en: "Mounted fine art paper" },
        status: { es: "Serie limitada", en: "Limited series" },
        image: "assets/img/works/Cuadro4.png",
        model: "assets/blenders/cuadro_london_eye_3d.glb?v=1"
      },
      {
        title: { es: "Caballos", en: "Horses" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Composicion figurativa con tres caballos en movimiento. La obra combina contraste de luces y materia suelta para enfatizar energia, ritmo y profundidad, manteniendo una lectura elegante del conjunto dentro del marco.",
          en: "Figurative composition with three horses in motion. The work combines light contrast and loose material to emphasize energy, rhythm and depth, while keeping an elegant reading of the framed piece."
        },
        year: "2026",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "60x80 cm",
        technique: { es: "Tecnica mixta", en: "Mixed media" },
        support: { es: "Papel artistico montado", en: "Mounted fine art paper" },
        status: { es: "Original disponible", en: "Original available" },
        image: "assets/img/works/cuadro5.png",
        model: "assets/blenders/cuadro_caballos_3d_front.glb?v=1"
      },
      {
        title: { es: "El Padrino", en: "The Godfather" },
        subtitle: { es: "J. PEDRERO STUDIO", en: "J. PEDRERO STUDIO" },
        description: {
          es: "Retrato expresivo inspirado en una iconografia cinematografica clasica. El trabajo enfatiza gesto, mirada y contraste tonal con una factura matizada que combina materia seca y transiciones suaves para potenciar caracter y presencia.",
          en: "Expressive portrait inspired by classic cinematic iconography. The work emphasizes gesture, gaze and tonal contrast, with nuanced mark-making that combines dry texture and soft transitions to enhance character and presence."
        },
        year: "2026",
        author: { es: "J. Pedrero", en: "J. Pedrero" },
        size: "50x70 cm",
        technique: { es: "Pastel", en: "Pastel" },
        support: { es: "Papel artistico montado", en: "Mounted fine art paper" },
        status: { es: "Original disponible", en: "Original available" },
        image: "assets/img/works/cuadro6.png",
        model: "assets/blenders/cuadro_retrato_3d.glb?v=1",
        modelTexture: "assets/blenders/cuadro6.png"
      }
    ];

  if (
    artBookSpread && artPageLeft && artPageRight && artLeftContent && artRightContent &&
    artPageFlipLayer && artFlipSheet && artFlipFront && artFlipBack &&
    prevArtworkBtn && nextArtworkBtn && artBookPagination && artworks.length
  ) {
    const fallbackImage = artworks[0].image;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopFlipEnabled = () => window.matchMedia("(min-width: 721px)").matches;

    let currentIndex = artworks.length - 1;
    let animationInProgress = false;
    let flipSafetyTimer = null;

    function preloadArtworkImages() {
      artworks.forEach((artwork) => {
        if (!artwork.image) {
          console.warn("[ArtBook] missing image for artwork=", localize(artwork.title));
          return;
        }
        const img = new Image();
        img.src = artwork.image;
      });
    }

    function getArtwork(index) {
      return artworks[index] || null;
    }

    function buildLeftPageHTML(artwork) {
      const studio = localize(artwork?.subtitle) || tr("common.studioDefault");
      const title = localize(artwork?.title) || "Artwork";
      const description = localize(artwork?.description) || "";
      const year = artwork?.year || "-";
      const author = localize(artwork?.author) || "J. Pedrero";
      const size = artwork?.size || "-";
      const technique = localize(artwork?.technique) || "Mixed media";
      const support = localize(artwork?.support) || "Fine art paper";
      const status = localize(artwork?.status) || "Check";
      return `
        <div class="art-meta">
          <span class="studio">${studio}</span>
          <h2>${title}</h2>
          <p>${description}</p>
          <div class="meta">
            <span>${tr("common.metaDate")}: ${year}</span>
            <span>${tr("common.metaAuthor")}: ${author}</span>
            <span>${tr("common.metaSize")}: ${size}</span>
            <span>${tr("common.metaTechnique")}: ${technique}</span>
            <span>${tr("common.metaSupport")}: ${support}</span>
            <span>${tr("common.metaStatus")}: ${status}</span>
          </div>
        </div>
      `;
    }

    function buildRightPageHTML(artwork) {
      const title = localize(artwork?.title) || "Artwork";
      const src = artwork?.image;
      const modelSrc = artwork?.model || "";
      const modelTexture = artwork?.modelTexture || "";
      const modelCameraOrbit = artwork?.modelCameraOrbit || "210deg 82deg 125%";
      const modelMinCameraOrbit = artwork?.modelMinCameraOrbit || "auto 65deg 80%";
      const modelMaxCameraOrbit = artwork?.modelMaxCameraOrbit || "auto 95deg 220%";
      if (!src) {
        console.warn("[ArtBook] missing image for artwork=", title);
        return `
          <div class="art-artwork-panel">
            <div class="art-artwork-frame">
              <div class="art-artwork-placeholder">${tr("common.imageUnavailable")}</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="art-artwork-panel">
          <div class="art-artwork-frame">
            <img
              class="art-artwork-image"
              src="${src}"
              alt="${title}"
              loading="eager"
              data-model-src="${modelSrc}"
              data-model-texture="${modelTexture}"
              data-model-camera-orbit="${modelCameraOrbit}"
              data-model-min-camera-orbit="${modelMinCameraOrbit}"
              data-model-max-camera-orbit="${modelMaxCameraOrbit}" />
            <div class="art-artwork-placeholder" hidden>${tr("common.imageUnavailable")}</div>
          </div>
        </div>
      `;
    }

    function attachRightImageFallback(artwork) {
      const img = artRightContent.querySelector(".art-artwork-image");
      const placeholder = artRightContent.querySelector(".art-artwork-placeholder");
      if (!img || !placeholder) return;

      img.addEventListener("error", () => {
        const artTitle = localize(artwork?.title) || "Artwork";
        console.warn("[ArtBook] missing image for artwork=", artTitle, "src=", img.getAttribute("src"));
        if (img.getAttribute("src") !== fallbackImage) {
          img.setAttribute("src", fallbackImage);
          return;
        }
        img.style.display = "none";
        placeholder.hidden = false;
      });

      img.addEventListener("load", () => {
        img.style.display = "block";
        placeholder.hidden = true;
      });
    }

    function updateControls() {
      prevArtworkBtn.disabled = animationInProgress || currentIndex >= artworks.length - 1;
      nextArtworkBtn.disabled = animationInProgress || currentIndex <= 0;
      prevArtworkBtn.textContent = tr("common.bookPrev");
      nextArtworkBtn.textContent = tr("common.bookNext");
      artBookPagination.textContent = `${currentIndex + 1} / ${artworks.length}`;
    }

    function renderCurrentSpread(index) {
      const artwork = getArtwork(index);
      if (!artwork) return;

      console.log(`[ArtBook] renderCurrentSpread index=${index}`);
      artLeftContent.innerHTML = buildLeftPageHTML(artwork);
      artRightContent.innerHTML = buildRightPageHTML(artwork);
      const rightImg = artRightContent.querySelector(".art-artwork-image");
      if (rightImg) {
        console.log(`[ArtBook] right image src=${rightImg.getAttribute("src")}`);
      }
      attachRightImageFallback(artwork);
      updateControls();
    }

    function setupFlipFaces(currentArtwork, targetArtwork, direction) {
      const currentImg = currentArtwork?.image || fallbackImage;
      const targetImg = targetArtwork?.image || fallbackImage;

      if (direction === "next") {
        artFlipFront.style.backgroundImage = `url("${currentImg}")`;
        artFlipBack.style.backgroundImage = `url("${targetImg}")`;
        artFlipSheet.style.transform = "rotateY(0deg)";
      } else {
        artFlipFront.style.backgroundImage = `url("${targetImg}")`;
        artFlipBack.style.backgroundImage = `url("${currentImg}")`;
        artFlipSheet.style.transform = "rotateY(-180deg)";
      }
    }

    function resetFlipLayer() {
      artPageFlipLayer.classList.remove("is-active");
      artFlipSheet.style.transition = "none";
      artFlipSheet.style.transform = "";
      artFlipSheet.style.filter = "";
      if (flipSafetyTimer) {
        window.clearTimeout(flipSafetyTimer);
        flipSafetyTimer = null;
      }
    }

    function animateToIndex(targetIndex, direction) {
      if (animationInProgress) return;
      const currentArtwork = getArtwork(currentIndex);
      const targetArtwork = getArtwork(targetIndex);
      if (!currentArtwork || !targetArtwork) return;

      if (prefersReducedMotion || !desktopFlipEnabled()) {
        currentIndex = targetIndex;
        renderCurrentSpread(currentIndex);
        return;
      }

      animationInProgress = true;
      updateControls();
      console.log(`[ArtBook] flip start direction=${direction}`);

      setupFlipFaces(currentArtwork, targetArtwork, direction);
      artPageFlipLayer.classList.add("is-active");
      void artFlipSheet.offsetWidth;

      const midpointTimer = window.setTimeout(() => {
        renderCurrentSpread(targetIndex);
      }, 430);

      const finish = () => {
        artFlipSheet.removeEventListener("transitionend", onEnd);
        window.clearTimeout(midpointTimer);
        currentIndex = targetIndex;
        renderCurrentSpread(currentIndex);
        resetFlipLayer();
        animationInProgress = false;
        updateControls();
        console.log(`[ArtBook] flip end targetIndex=${targetIndex}`);
      };

      const onEnd = (event) => {
        if (event.propertyName !== "transform") return;
        finish();
      };

      artFlipSheet.addEventListener("transitionend", onEnd);
      artFlipSheet.style.transition = "transform 0.95s cubic-bezier(0.2, 0.7, 0.15, 1), filter 0.95s cubic-bezier(0.2, 0.7, 0.15, 1)";
      artFlipSheet.style.filter = "brightness(0.92)";
      artFlipSheet.style.transform = direction === "next" ? "rotateY(-180deg)" : "rotateY(0deg)";
      flipSafetyTimer = window.setTimeout(finish, 1200);
    }

    function goToNextArtwork() {
      if (animationInProgress || currentIndex <= 0) return;
      animateToIndex(currentIndex - 1, "prev");
    }

    function goToPrevArtwork() {
      if (animationInProgress || currentIndex >= artworks.length - 1) return;
      animateToIndex(currentIndex + 1, "next");
    }

    prevArtworkBtn.addEventListener("click", goToPrevArtwork);
    nextArtworkBtn.addEventListener("click", goToNextArtwork);

    document.addEventListener("keydown", (event) => {
      if (animationInProgress) return;
      if (event.key === "ArrowRight") goToNextArtwork();
      if (event.key === "ArrowLeft") goToPrevArtwork();
    });

    preloadArtworkImages();
    renderCurrentSpread(currentIndex);
  }
  // Consentimiento de cookies
  const consentKey = "jps_cookie_consent_v1";
  const savedConsent = localStorage.getItem(consentKey);
  const isHomePage = Boolean(document.getElementById("artBookSpread"));
  const existingCookieBanner = document.querySelector(".cookie-consent");
  if (!existingCookieBanner && isHomePage && !savedConsent) {
    const cookiesPolicyHref = "legal/cookies.html";
    const banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.innerHTML = `
      <div class="cookie-consent-box">
        <p class="cookie-consent-title">${tr("common.cookieTitle")}</p>
        <p class="cookie-consent-text">
          ${tr("common.cookieText")}
          <a href="${cookiesPolicyHref}">Cookies</a>.
        </p>
        <div class="cookie-consent-actions">
          <button type="button" class="btn btn-ghost" data-consent="rejected">${tr("common.cookieReject")}</button>
          <button type="button" class="btn" data-consent="accepted">${tr("common.cookieAccept")}</button>
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
  const zoomSelector = ".featured-card img, .works-grid .card img, .hero-art img, .art-artwork-image, #workImage";
  const artBookModelByImage = {
    "assets/img/works/Cuadro1.png": "assets/blenders/cuadro_retrato_3d.glb?v=1",
    "assets/img/works/Cuadro3.png": "assets/blenders/cuadro_barco_3d.glb?v=1",
    "assets/img/works/Cuadro2.png": "assets/blenders/cuadro_atardecer_3d.glb?v=1",
    "assets/img/works/Cuadro4.png": "assets/blenders/cuadro_london_eye_3d.glb?v=1",
    "assets/img/works/cuadro5.png": "assets/blenders/cuadro_caballos_3d_front.glb?v=1",
    "assets/img/works/cuadro6.png": "assets/blenders/cuadro_retrato_3d.glb?v=1"
  };
  let lightbox = null;
  let lightboxImg = null;
  let lightboxModel = null;
  let lightboxError = null;
  let lightboxMode = "image";
  let lightboxModelTexture = "";

  function normalizeAssetPath(path = "") {
    if (!path) return "";
    try {
      const url = new URL(path, window.location.href);
      return url.pathname.replace(/^\/+/, "");
    } catch (error) {
      return String(path).replace(/^\/+/, "");
    }
  }

  function resolveModelSrcForImage(img, fallbackSrc = "", allowMapFallback = false) {
    const explicitModel = img?.dataset?.modelSrc || "";
    if (explicitModel) return explicitModel;

    if (!allowMapFallback) return "";

    const src = fallbackSrc || img?.getAttribute("src") || img?.currentSrc || "";
    const normalizedSrc = normalizeAssetPath(src);
    return artBookModelByImage[normalizedSrc] || "";
  }

  async function applyModelTextureToViewer(viewer, textureSrc) {
    if (!viewer || !textureSrc || typeof viewer.createTexture !== "function" || !viewer.model || !Array.isArray(viewer.model.materials) || !viewer.model.materials.length) return;
    try {
      const texture = await viewer.createTexture(textureSrc);
      const material = viewer.model.materials[0];
      if (material && material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      }
    } catch (error) {
      console.warn("[Lightbox] No se pudo aplicar textura 3D personalizada.", error);
    }
  }

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="image-lightbox-stage">
        <button type="button" class="image-lightbox-close" aria-label="Cerrar">&times;</button>
        <img class="image-lightbox-image" src="" alt="" />
        <model-viewer
          class="image-lightbox-model"
          hidden
          camera-controls
          loading="eager"
          shadow-intensity="0"
          exposure="1"
          interaction-prompt="none"
          ar="false">
        </model-viewer>
        <p class="image-lightbox-error" hidden>No se pudo cargar el modelo 3D.</p>
      </div>
    `;
    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector(".image-lightbox-image");
    lightboxModel = lightbox.querySelector(".image-lightbox-model");
    lightboxError = lightbox.querySelector(".image-lightbox-error");
    if (lightboxModel) {
      lightboxModel.addEventListener("load", async () => {
        if (lightboxMode !== "model") return;
        if (lightboxModelTexture) {
          await applyModelTextureToViewer(lightboxModel, lightboxModelTexture);
        }
        lightboxModel.hidden = false;
        if (lightboxError) lightboxError.hidden = true;
      });
      lightboxModel.addEventListener("error", () => {
        if (lightboxMode !== "model") return;
        lightboxModel.hidden = true;
        if (lightboxError) lightboxError.hidden = false;
      });
    }

    const closeBtn = lightbox.querySelector(".image-lightbox-close");
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  function setLightboxMode(mode) {
    lightboxMode = mode;
    const showModel = mode === "model";
    lightbox.classList.toggle("is-model", showModel);
    if (lightboxImg) lightboxImg.hidden = showModel;
    if (lightboxModel) lightboxModel.hidden = !showModel;
    if (!showModel && lightboxError) lightboxError.hidden = true;
  }

  function showLightbox() {
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function openLightbox(src, alt) {
    if (!src) return;
    ensureLightbox();
    setLightboxMode("image");
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagen ampliada";
    if (lightboxModel) {
      lightboxModel.removeAttribute("src");
      lightboxModel.removeAttribute("poster");
    }
    lightboxModelTexture = "";
    if (lightboxError) lightboxError.hidden = true;
    showLightbox();
  }

  function openModelLightbox(options = {}) {
    const {
      modelSrc,
      modelTexture = "",
      posterSrc,
      alt,
      cameraOrbit = "210deg 82deg 125%",
      minCameraOrbit = "auto 65deg 80%",
      maxCameraOrbit = "auto 95deg 220%"
    } = options;

    if (!modelSrc) {
      openLightbox(posterSrc, alt);
      return;
    }

    ensureLightbox();
    setLightboxMode("model");
    lightboxModelTexture = modelTexture || "";
    if (lightboxError) lightboxError.hidden = true;
    if (lightboxModel) lightboxModel.hidden = false;
    lightboxModel.setAttribute("src", modelSrc);
    lightboxModel.setAttribute("alt", alt ? `${alt} 3D` : "Obra 3D");
    lightboxModel.setAttribute("camera-orbit", cameraOrbit);
    lightboxModel.setAttribute("min-camera-orbit", minCameraOrbit);
    lightboxModel.setAttribute("max-camera-orbit", maxCameraOrbit);
    if (posterSrc) {
      lightboxModel.setAttribute("poster", posterSrc);
    } else {
      lightboxModel.removeAttribute("poster");
    }
    showLightbox();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    setLightboxMode("image");
    if (lightboxImg) lightboxImg.removeAttribute("src");
    if (lightboxModel) {
      lightboxModel.removeAttribute("src");
      lightboxModel.removeAttribute("poster");
    }
    lightboxModelTexture = "";
    if (lightboxError) lightboxError.hidden = true;
    document.body.classList.remove("lightbox-open");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  function addZoomToImage(img) {
    if (!img || img.dataset.zoomReady === "1") return;
    const host = img.closest(".featured-card, .card, .hero-art, .art-artwork-frame, figure");
    if (!host) return;

    host.classList.add("zoom-host");
    if (!host.querySelector(".zoom-btn")) {
      const button = document.createElement("button");
      const isBookArtwork = img.classList.contains("art-artwork-image") || Boolean(img.closest(".art-artwork-frame"));
      const hasModel = Boolean(resolveModelSrcForImage(img, "", isBookArtwork));
      button.type = "button";
      button.className = "zoom-btn";
      button.setAttribute("aria-label", hasModel ? "Ver obra en 3D" : "Ampliar imagen");
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
        const isBookArtwork = img.classList.contains("art-artwork-image") || Boolean(img.closest(".art-artwork-frame"));
        const modelSrc = resolveModelSrcForImage(img, src, isBookArtwork);
        if (modelSrc) {
          openModelLightbox({
            modelSrc,
            modelTexture: img.dataset.modelTexture,
            posterSrc: src,
            alt: img.alt,
            cameraOrbit: img.dataset.modelCameraOrbit,
            minCameraOrbit: img.dataset.modelMinCameraOrbit,
            maxCameraOrbit: img.dataset.modelMaxCameraOrbit
          });
          return;
        }
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








