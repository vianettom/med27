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

  /* ----------------------------------------------------- Video statement -- */
  // The Vimeo player costs ~300KB of third-party JS, so it is only injected
  // once the band is close to view, and never on small screens or under
  // reduced motion — the poster in the markup covers all three cases.
  var narrow = window.matchMedia("(max-width: 900px)");

  function initVideoBand() {
    var band = document.querySelector("[data-video-band]");
    if (!band) return;

    var id = band.getAttribute("data-vimeo");
    if (!id) return;

    // Unlisted videos carry a privacy hash; without it the embed 404s.
    var hash = band.getAttribute("data-vimeo-h");
    var privacy = hash ? "&h=" + encodeURIComponent(hash) : "";

    var load = function () {
      if (band.querySelector(".video-band__frame")) return;
      if (reduceMotion.matches || narrow.matches) return;

      var frame = document.createElement("iframe");
      // background=1 is what strips the chrome and makes it autoplay, loop and
      // mute in one go; autopause=0 keeps it running if another Vimeo embed
      // ever lands on the page.
      frame.src = "https://player.vimeo.com/video/" + id +
        "?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1" + privacy;
      frame.className = "video-band__frame";
      frame.title = "Medicarians 2026 ambient loop";
      frame.setAttribute("frameborder", "0");
      frame.setAttribute("allow", "autoplay; fullscreen");
      frame.setAttribute("aria-hidden", "true");
      frame.setAttribute("tabindex", "-1");

      band.querySelector(".video-band__media").appendChild(frame);

      // The player talks back over postMessage. We subscribe to "play" on
      // ready, and only then fade the iframe in over the poster — so a
      // blocked or failed embed leaves the poster showing instead of its
      // error page. Origin-checked because this listens on window.
      window.addEventListener("message", function (event) {
        if (event.origin !== "https://player.vimeo.com") return;
        if (event.source !== frame.contentWindow) return;

        var data = event.data;
        if (typeof data === "string") {
          try { data = JSON.parse(data); } catch (err) { return; }
        }
        if (!data) return;

        if (data.event === "ready") {
          frame.contentWindow.postMessage(
            { method: "addEventListener", value: "play" }, "https://player.vimeo.com");
        } else if (data.event === "play") {
          band.classList.add("is-playing");
        }
      });
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }

    // 400px of lead time so the first frame is up before the band is read.
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      load();
    }, { rootMargin: "400px 0px" });

    observer.observe(band);
  }

  initVideoBand();

  /* ---------------------------------------------------------- Video modal -- */
  // The "Watch Video" link is real markup pointing at Vimeo, so it works with
  // JS off. Here it's upgraded into a <dialog> playing the same video with
  // sound and controls. The iframe is created on open and removed on close —
  // removing it is what actually stops playback.
  function initVideoModal() {
    var modal = document.getElementById("video-modal");
    var opener = document.querySelector("[data-video-open]");
    var band = document.querySelector("[data-video-band]");
    if (!modal || !opener || !band) return;

    // Older browsers without the top-layer dialog keep the plain link.
    if (typeof modal.showModal !== "function") return;

    var mount = modal.querySelector("[data-video-mount]");
    if (!mount) return;

    // The full film, which is a different (longer) cut from the muted loop
    // behind the band. Read off the link's own href — that keeps the JS-off
    // destination and what the dialog plays from ever drifting apart. Second
    // capture is the privacy hash unlisted videos carry.
    var parts = /vimeo\.com\/(\d+)(?:\/(\w+))?/.exec(opener.getAttribute("href") || "");
    if (!parts) return;

    var id = parts[1];
    var hash = parts[2];

    // The muted loop behind the band would otherwise keep streaming under the
    // backdrop while the real player runs. Vimeo takes pause/play over
    // postMessage, so no player SDK is needed for this.
    function tellBackground(method) {
      var bg = band.querySelector(".video-band__frame");
      if (!bg || !bg.contentWindow) return;
      bg.contentWindow.postMessage({ method: method }, "https://player.vimeo.com");
    }

    function open(event) {
      if (event) event.preventDefault();

      var frame = document.createElement("iframe");
      frame.src = "https://player.vimeo.com/video/" + id +
        "?autoplay=1&dnt=1" + (hash ? "&h=" + encodeURIComponent(hash) : "");
      frame.title = "Medicarians 2026 Sizzle Video";
      frame.setAttribute("frameborder", "0");
      frame.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");

      mount.appendChild(frame);
      tellBackground("pause");
      modal.showModal();
    }

    opener.addEventListener("click", open);

    modal.querySelector("[data-video-close]").addEventListener("click", function () {
      modal.close();
    });

    // Click-outside: the dialog element itself is only the backdrop area, so a
    // click landing on it (rather than on a child) means outside the panel.
    modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.close();
    });

    // Fires for the close button, the backdrop click and Esc alike.
    modal.addEventListener("close", function () {
      mount.innerHTML = "";
      tellBackground("play");
      opener.focus();
    });
  }

  initVideoModal();

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
      btn.innerHTML = open ? "Show Fewer Speakers" : "View All Speakers";
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
      btn.innerHTML = open ? "Show Fewer Sponsors" : "View All Sponsors";
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
