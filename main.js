/* ── Language toggle (persists across visits) ── */
(function () {
  var html = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}

  if (!saved) {
    saved = (navigator.language || "es").toLowerCase().indexOf("en") === 0 ? "en" : "es";
  }
  setLang(saved);

  function setLang(lang) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
    // Demos render their own text from JS, so they need to be told.
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  var btn = document.getElementById("langToggle");
  if (btn) {
    btn.addEventListener("click", function () {
      setLang(html.getAttribute("data-lang") === "es" ? "en" : "es");
    });
  }
})();

/* ── Sticky header border on scroll ── */
(function () {
  var bar = document.querySelector(".topbar");
  if (!bar) return;
  var ticking = false;
  function update() {
    bar.classList.toggle("scrolled", window.scrollY > 20);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ── Scroll reveal ── */
(function () {
  var targets = document.querySelectorAll(
    ".case, .sp-card, .stack-col, .about-text, .about-side, .note, .sec-head, .contact-links"
  );

  if (!("IntersectionObserver" in window)) return;

  targets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });

  targets.forEach(function (el) { io.observe(el); });
})();

/* ── Current year ── */
(function () {
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
