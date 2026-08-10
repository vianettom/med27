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
  // The bar is fixed the whole way down; this only deepens the glass once
  // there's page content behind it rather than the hero.
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

  /* ------------------------------------------------------ Stat count-up --- */
  // The real figures are in the markup, so with JS off (or reduced motion on)
  // they just sit there. We only zero a counter once we've committed to running
  // it, which also means no flash of "0" before the observer fires.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initCounters() {
    if (reduceMotion.matches) return;

    var counters = document.querySelectorAll("[data-counter]");

    Array.prototype.forEach.call(counters, function (el) {
      var to = parseFloat(el.getAttribute("data-counter")) || 0;
      var suffix = el.getAttribute("data-counter-suffix") || "";
      var duration = parseInt(el.getAttribute("data-counter-duration"), 10) || 1600;
      var started = false;

      var format = function (value) {
        return value.toLocaleString("en-US") + suffix;
      };

      var run = function () {
        if (started) return;
        started = true;

        var begin;
        var tick = function (now) {
          if (begin === undefined) begin = now;
          var p = Math.min(1, (now - begin) / duration);
          var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          el.textContent = format(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };

        el.textContent = format(0);
        requestAnimationFrame(tick);
      };

      if (!("IntersectionObserver" in window)) {
        run();
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        run();
      }, { threshold: 0.4 });

      observer.observe(el);
    });
  }

  initCounters();

  /* ------------------------------------------------------ Schedule tabs --- */
  // Progressive enhancement: the markup is four plain day blocks, which is what
  // you get with JS off. Here they're upgraded into a tablist so only one day
  // shows at a time — the day label becomes the tab, so it's hidden inside the
  // panel to avoid saying it twice.
  function initScheduleTabs() {
    var section = document.getElementById("schedule");
    if (!section) return;

    var container = section.querySelector(".schedule__days");
    var days = container ? Array.prototype.slice.call(container.querySelectorAll(".day")) : [];
    if (days.length < 2) return;

    var tablist = document.createElement("div");
    tablist.className = "sched-tabs";
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Schedule by day");

    var tabs = [];

    days.forEach(function (day, i) {
      var panelId = "sched-panel-" + i;
      var tabId = "sched-tab-" + i;
      var label = day.querySelector(".day__label");
      var dow = label ? label.querySelector(".day__dow") : null;
      var date = label ? label.querySelector(".day__date") : null;

      day.id = panelId;
      day.setAttribute("role", "tabpanel");
      day.setAttribute("aria-labelledby", tabId);
      day.setAttribute("tabindex", "0");

      // Stagger the rows so the panel cascades in rather than snapping.
      Array.prototype.forEach.call(day.querySelectorAll(".day__row"), function (row, r) {
        row.style.setProperty("--d", (r * 0.04).toFixed(2) + "s");
      });

      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "sched-tab";
      tab.id = tabId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);

      var tabDow = document.createElement("span");
      tabDow.className = "sched-tab__dow";
      tabDow.textContent = dow ? dow.textContent : "Day " + (i + 1);

      var tabDate = document.createElement("span");
      tabDate.className = "sched-tab__date";
      tabDate.textContent = date ? date.textContent : "";

      tab.appendChild(tabDow);
      tab.appendChild(tabDate);
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", onTabKeydown);

      tablist.appendChild(tab);
      tabs.push(tab);
    });

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      days.forEach(function (day, i) {
        day.classList.toggle("is-on", i === index);
      });
      if (moveFocus) tabs[index].focus();
    }

    // Roving tabindex — the expected keyboard model for a tablist.
    function onTabKeydown(event) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;

      var next = null;
      if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;

      event.preventDefault();
      select(next, true);
    }

    container.parentNode.insertBefore(tablist, container);
    section.classList.add("is-tabbed");
    select(0);
  }

  initScheduleTabs();

  /* ------------------------------------------------------ Speaker fold -- */
  // Progressive enhancement: the markup ships expanded with the button hidden,
  // so a JS failure leaves every speaker reachable rather than stranded.
  function initSpeakerFold() {
    var grid = document.getElementById("speaker-grid");
    var btn = document.getElementById("speakers-toggle");
    if (!grid || !btn) return;

    function setOpen(open) {
      grid.classList.toggle("is-collapsed", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.innerHTML = open ? "Show Fewer Speakers &uarr;" : "View All Speakers &rarr;";
    }

    // Where the four-row cut falls is a CSS decision that moves with the
    // breakpoint, so ask the layout instead of counting cards here.
    setOpen(false);
    var cards = grid.querySelectorAll(".speaker-card");
    if (!cards.length || cards[cards.length - 1].offsetParent !== null) {
      setOpen(true); // Four rows or fewer — nothing to fold, so no button.
      return;
    }
    btn.hidden = false;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
      // Collapsing pulls the button up past the viewport; keep it under the cursor.
      if (open) btn.scrollIntoView({ block: "center" });
    });
  }

  initSpeakerFold();

  /* ------------------------------------------------------ Sponsor fold -- */
  // Title, gold and silver stay on the page; the tiers below them fold away
  // behind the CTA. Same progressive-enhancement contract as the speakers —
  // ships open, JS closes it.
  function initSponsorFold() {
    var more = document.getElementById("sponsor-more");
    var btn = document.getElementById("sponsors-toggle");
    if (!more || !btn) return;

    function setOpen(open) {
      more.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.innerHTML = open ? "Show Fewer Sponsors &uarr;" : "View All Sponsors &rarr;";
    }

    setOpen(false);
    btn.hidden = false;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
      if (open) btn.scrollIntoView({ block: "center" });
    });
  }

  initSponsorFold();

  /* ---------------------------------------------------------- Newsletter -- */
  // Prototype only — nothing is sent anywhere.
  var form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }
})();
