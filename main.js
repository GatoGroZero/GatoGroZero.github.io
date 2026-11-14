/* ═══════════════════════════════════════════════════════════════
   Interacción y movimiento, sin dependencias.
   IntersectionObserver + rAF + Web Animations. Cero librerías.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────── Idioma ─────────── */
(function () {
  var html = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  if (!saved) {
    saved = (navigator.language || "es").toLowerCase().indexOf("en") === 0 ? "en" : "es";
  }
  set(saved);

  function set(lang) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  var btn = document.getElementById("langToggle");
  if (btn) btn.addEventListener("click", function () {
    set(html.getAttribute("data-lang") === "es" ? "en" : "es");
  });
})();

/* ─────────── Interruptor de gatos y movimiento ─────────── */
(function () {
  var html = document.documentElement;
  var btn = document.getElementById("motionToggle");
  var on = true;
  try { on = localStorage.getItem("cats") !== "off"; } catch (e) {}
  apply();

  function apply() {
    html.classList.toggle("no-cats", !on);
    if (btn) {
      btn.setAttribute("aria-pressed", String(!on));
      btn.title = on ? "Desactivar gatos y animaciones" : "Activar gatos y animaciones";
    }
  }
  if (btn) btn.addEventListener("click", function () {
    on = !on;
    try { localStorage.setItem("cats", on ? "on" : "off"); } catch (e) {}
    apply();
    // Al reactivar, las secciones ocultas deben aparecer sin recargar
    if (on && window.__observeReveals) window.__observeReveals();
  });
})();

/* ─────────── Entrada del hero ─────────── */
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});
// Si load tarda (fuentes lentas), no dejamos el hero invisible.
setTimeout(function () { document.body.classList.add("loaded"); }, 1200);

/* ─────────── Header + barra de progreso ─────────── */
(function () {
  var bar = document.querySelector(".topbar");
  var prog = document.querySelector(".progress");
  var ticking = false;

  function frame() {
    var y = window.scrollY;
    if (bar) bar.classList.toggle("scrolled", y > 20);
    if (prog && !reduced) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  frame();
})();

/* ─────────── Revelado al hacer scroll, escalonado ─────────── */
(function () {
  var SEL = ".case, .sp-card, .stack-col, .about-text, .about-side, .note," +
            " .sec-head, .contact-links, .mk-stage, .side-projects, .sec-lede, .idx";

  if (reduced) { window.__observeReveals = function () {}; return; }

  /* Se comprueba la posición en cada frame de scroll en lugar de usar
     IntersectionObserver: si el usuario salta con un ancla o Ctrl+End, el
     elemento pasa de "debajo" a "encima" sin cruzar nunca el viewport, IO no
     dispara y la sección se queda invisible para siempre. */
  var pending = [];
  var ticking = false;

  function collect() {
    document.querySelectorAll(SEL).forEach(function (el) {
      if (el.dataset.rv) return;
      el.dataset.rv = "1";
      el.classList.add("reveal");
      pending.push(el);
    });
    check();
  }

  function check() {
    if (!pending.length) return;
    var limit = window.innerHeight * 0.94;
    var shown = 0;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        el.style.setProperty("--i", Math.min(shown++, 6));
        el.classList.add("in");
        return false;
      }
      return true;
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { check(); ticking = false; });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.__observeReveals = collect;
  collect();
})();

/* ─────────── Contadores de las estadísticas ─────────── */
(function () {
  var nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach(function (n) { n.textContent = n.dataset.count; });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target);
    });
  }, { threshold: 0.6 });

  nodes.forEach(function (n) { n.textContent = "0"; io.observe(n); });

  function run(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var dur = 1400, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      // expo.out
      var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();

/* Nota: el botón magnético se quitó al pasar al estilo pixel. Escribía
   transform en línea y anulaba el efecto de "botón que se hunde" del CSS,
   que encaja mejor con la estética de sombra dura. */

/* ─────────── Navegación: sección activa y menú del teléfono ─────────── */
(function () {
  var html = document.documentElement;
  html.classList.add("js");

  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mnav");
  var links = document.querySelectorAll(".topnav a, .mnav a");

  function setMenu(open) {
    if (!btn || !panel) return;
    panel.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  }
  if (btn && panel) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!panel.classList.contains("open"));
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) { setMenu(false); btn.focus(); }
    });
    // Si se agranda la ventana con el menú abierto, no se queda colgado
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) setMenu(false);
    });
  }

  // La sección que cruza el centro de la pantalla es la activa
  function mark(id) {
    links.forEach(function (a) {
      if (id && a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) mark(en.target.dataset.nav || "");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    var hero = document.querySelector(".hero");
    if (hero) { hero.dataset.nav = ""; io.observe(hero); }
    ["work", "stack", "about", "formacion", "contact"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.dataset.nav = id; io.observe(el); }
    });
  }
})();

/* ─────────── Año ─────────── */
(function () {
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();

})();
