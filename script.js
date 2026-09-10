// Spin the hero halo rings on hover (desktop) or press-and-hold (touch),
// since touchscreens have no real hover state to key off of.
(function () {
  var frame = document.querySelector(".hero__portrait-frame");
  if (!frame) return;

  function start() { frame.classList.add("is-spinning"); }
  function stop() { frame.classList.remove("is-spinning"); }

  frame.addEventListener("mouseenter", start);
  frame.addEventListener("mouseleave", stop);
  frame.addEventListener("touchstart", start, { passive: true });
  frame.addEventListener("touchend", stop);
  frame.addEventListener("touchcancel", stop);

  // One-time spin right after the hero fades in, so mobile visitors (no
  // hover to stumble into) get a glimpse that the ring is interactive.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    setTimeout(function () {
      frame.classList.add("intro-spin");
      frame.addEventListener("animationend", function () {
        frame.classList.remove("intro-spin");
      }, { once: true });
    }, 1000);
  }
})();

// Masthead shrinks and solidifies once the page has scrolled past the hero.
(function () {
  var masthead = document.querySelector(".masthead");
  if (!masthead) return;

  function update() {
    masthead.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
})();

// Mobile hamburger: toggle nav open/closed, close on link click.
(function () {
  var toggle = document.querySelector(".masthead__toggle");
  var nav = document.querySelector(".masthead__nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// Highlight the nav link for whichever section is currently in view.
// Picks whichever section's band contains the vertical center of the
// viewport, checked directly off scroll position instead of an
// IntersectionObserver — a short last section (the footer) can sit fully
// visible without ever crossing an observer's enter/exit threshold, which
// left the nav stuck on the previous link.
(function () {
  var navLinks = document.querySelectorAll(".masthead__nav a");
  var sections = document.querySelectorAll("main section[id], footer[id]");
  if (!navLinks.length || !sections.length) return;

  var linkByHash = {};
  navLinks.forEach(function (link) {
    linkByHash[link.getAttribute("href").slice(1)] = link;
  });

  function update() {
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    var center = window.innerHeight * 0.5;
    var current = sections[0];

    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= center) current = s;
    });
    if (atBottom) current = sections[sections.length - 1];

    var link = linkByHash[current.id];
    navLinks.forEach(function (l) { l.classList.remove("is-active"); });
    if (link) link.classList.add("is-active");
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
})();

// Scroll-triggered fade+rise reveal, reused for section headings and the
// timeline/achievement/education/leadership blocks below.
// Replays every time a target re-enters the viewport (scroll up past it and
// back down plays the reveal again) instead of firing once and staying put.
// Respects prefers-reduced-motion: if set, targets are just shown immediately.

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".section__head, .reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();
