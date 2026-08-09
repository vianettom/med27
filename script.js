/* Medicarians Vegas 2027 — prototype interactions */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  /* ---------------------------------------------------------- Mobile nav -- */
  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  function navIsOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!navIsOpen());
    });
  }

  // Close after picking a destination.
  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navIsOpen()) {
      setNav(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (!navIsOpen()) return;
    if (event.target.closest("#primary-nav") || event.target.closest("#nav-toggle")) return;
    setNav(false);
  });

  // The panel only exists below 1180px — reset state when we grow past it.
  var wide = window.matchMedia("(min-width: 1181px)");
  var onWide = function (event) { if (event.matches) setNav(false); };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else if (wide.addListener) wide.addListener(onWide);

  /* ------------------------------------------------------- Header state --- */
  // Transparent over the hero, solid navy once past it.
  var hero = document.querySelector(".hero");

  if (header && hero) {
    var sentinelOffset = hero.offsetHeight - header.offsetHeight;

    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > sentinelOffset);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      sentinelOffset = hero.offsetHeight - header.offsetHeight;
      onScroll();
    });
    onScroll();
  }

  /* ---------------------------------------------------------- Newsletter -- */
  // Prototype only — nothing is sent anywhere.
  var form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }
})();
