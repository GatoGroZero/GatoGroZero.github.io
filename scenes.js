/* ═══════════════════════════════════════════════════════════════
   Escenarios de sakura. Un solo motivo, bien resuelto, que cambia
   de composición, color y densidad en cada sección.
   Cinco motivos distintos daban resultados desiguales: es más
   profesional un sistema coherente que variedad mal ejecutada.
   El movimiento va atado al scroll, nunca en bucle infinito.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var PALETAS = {
  carmin: { flor: "#ad0013", flor2: "#d4243a", brote: "#e0697c", centro: "#c9a15c", rama: "#2a2b28" },
  oro:    { flor: "#a67d43", flor2: "#c9a15c", brote: "#dcc08a", centro: "#ece5d8", rama: "#2a2b28" },
  mixta:  { flor: "#ad0013", flor2: "#c9a15c", brote: "#e0697c", centro: "#ece5d8", rama: "#2a2b28" },
  palida: { flor: "#8a3a44", flor2: "#a67d43", brote: "#c98a92", centro: "#ece5d8", rama: "#22231f" }
};

function trazo(d, color, ancho, op) {
  return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + ancho +
         '" stroke-linecap="round" stroke-linejoin="round"' + (op ? ' opacity="' + op + '"' : "") + "/>";
}

/* Flor de cinco pétalos con estambres */
function flor(cx, cy, r, color, centro, op, giro) {
  var g = '<g transform="translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ') rotate(' + giro.toFixed(0) + ')" opacity="' + op + '">';
  for (var i = 0; i < 5; i++) {
    g += '<ellipse cx="0" cy="' + (-r * 0.66).toFixed(2) + '" rx="' + (r * 0.44).toFixed(2) +
         '" ry="' + (r * 0.62).toFixed(2) + '" fill="' + color +
         '" transform="rotate(' + (i * 72) + ')"/>';
  }
  for (var k = 0; k < 5; k++) {
    g += '<line x1="0" y1="0" x2="0" y2="' + (-r * 0.5).toFixed(2) +
         '" stroke="' + centro + '" stroke-width="' + (r * 0.07).toFixed(2) +
         '" opacity=".8" transform="rotate(' + (k * 72 + 36) + ')"/>';
  }
  g += '<circle r="' + (r * 0.22).toFixed(2) + '" fill="' + centro + '"/>';
  return g + "</g>";
}

/* Ruido reproducible: cada sección se dibuja siempre igual */
function dado(semilla) {
  var s = semilla;
  return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/* ── Una escena de sakura ──
   Las flores se reparten a lo largo de los propios paths de las ramas,
   así siempre caen sobre la madera y no flotando en el aire. */
function sakura(cfg) {
  var p = PALETAS[cfg.paleta], rnd = dado(cfg.semilla), o = "";

  o += '<g class="capa-lenta">';
  cfg.ramas.forEach(function (r, i) {
    o += trazo(r.d, p.rama, r.w, .95);
    if (i === 0) o += trazo(r.d, "#15160f", r.w * 0.45, .45);
  });
  o += "</g>";

  var medidor = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  medidor.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  document.body.appendChild(medidor);

  var puntos = [];
  cfg.ramas.forEach(function (r) {
    var pt = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pt.setAttribute("d", r.d);
    medidor.appendChild(pt);
    var largo = pt.getTotalLength();
    var n = Math.max(2, Math.round(largo / cfg.separacion));
    for (var i = 0; i <= n; i++) {
      var q = pt.getPointAtLength((i / n) * largo);
      puntos.push({ x: q.x, y: q.y, peso: r.w });
    }
  });
  medidor.remove();

  /* Flores grandes: solo sobre las ramas gruesas */
  o += '<g class="capa-media">';
  puntos.forEach(function (q, i) {
    if (q.peso < 3.4 || rnd() > 0.7) return;
    var r = cfg.tam * (0.8 + rnd() * 0.5);
    o += flor(q.x + (rnd() - .5) * 12, q.y + (rnd() - .5) * 12, r,
              i % 3 === 0 ? p.flor : p.flor2, p.centro, .95, rnd() * 72);
  });
  o += "</g>";

  /* Flores chicas y brotes al frente */
  o += '<g class="capa-rapida">';
  puntos.forEach(function (q) {
    if (rnd() > 0.48) return;
    var r = cfg.tam * (0.36 + rnd() * 0.3);
    o += flor(q.x + (rnd() - .5) * 26, q.y + (rnd() - .5) * 26, r, p.brote, p.centro, .72, rnd() * 72);
  });
  puntos.forEach(function (q) {
    if (rnd() > 0.26) return;
    o += '<circle cx="' + (q.x + (rnd() - .5) * 30).toFixed(1) + '" cy="' + (q.y + (rnd() - .5) * 30).toFixed(1) +
         '" r="' + (cfg.tam * 0.2).toFixed(1) + '" fill="' + p.flor + '" opacity=".78"/>';
  });
  o += "</g>";

  return '<svg class="scene-svg ' + cfg.cls + '" viewBox="0 0 400 260" ' +
         'preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
         o + "</svg>";
}

/* Misma flor, distinta composición y color en cada sección */
var ESCENAS = {
  hero: function () {
    return sakura({
      cls: "sc-hero", paleta: "carmin", semilla: 4021, tam: 14, separacion: 34,
      ramas: [
        { d: "M-12 236 C 54 212 84 176 132 152 C 186 124 236 116 292 88 C 338 64 372 46 412 26", w: 9 },
        { d: "M104 168 C 118 138 128 116 122 88 C 116 66 120 52 130 40", w: 5 },
        { d: "M196 130 C 216 106 232 92 262 84 C 288 78 302 66 314 50", w: 4.4 },
        { d: "M64 202 C 74 178 72 158 60 138", w: 4 },
        { d: "M300 82 C 322 96 344 100 372 94", w: 3.4 },
        { d: "M160 146 C 168 168 184 182 206 190", w: 3 }
      ]
    });
  },
  ramaAlta: function () {
    return sakura({
      cls: "sc-alta", paleta: "carmin", semilla: 1177, tam: 12, separacion: 38,
      ramas: [
        { d: "M412 8 C 350 26 300 20 244 42 C 190 62 150 60 96 82", w: 6 },
        { d: "M300 30 C 296 60 282 78 258 92", w: 3.6 },
        { d: "M196 56 C 190 84 172 100 148 108", w: 3.2 },
        { d: "M360 16 C 366 44 360 66 342 82", w: 2.8 }
      ]
    });
  },
  ramaOro: function () {
    return sakura({
      cls: "sc-oro", paleta: "oro", semilla: 8830, tam: 12, separacion: 40,
      ramas: [
        { d: "M412 30 C 348 18 296 40 240 30 C 184 20 146 44 92 36", w: 5.5 },
        { d: "M286 34 C 292 66 282 88 260 102", w: 3.4 },
        { d: "M170 32 C 164 62 146 80 120 90", w: 3 },
        { d: "M356 24 C 362 52 352 74 330 88", w: 2.6 }
      ]
    });
  },
  ramaMixta: function () {
    return sakura({
      cls: "sc-mixta", paleta: "mixta", semilla: 5544, tam: 12.5, separacion: 36,
      ramas: [
        { d: "M412 46 C 356 60 316 34 258 52 C 200 70 164 46 108 62", w: 6 },
        { d: "M320 44 C 328 74 318 96 296 110", w: 3.6 },
        { d: "M212 58 C 206 88 188 104 162 112", w: 3.2 },
        { d: "M380 52 C 384 78 372 96 350 106", w: 2.6 }
      ]
    });
  },
  ramaPalida: function () {
    return sakura({
      cls: "sc-palida", paleta: "palida", semilla: 2299, tam: 11.5, separacion: 42,
      ramas: [
        { d: "M412 22 C 352 42 306 22 250 44 C 196 64 156 42 100 58", w: 5 },
        { d: "M296 32 C 302 62 292 82 270 96", w: 3.2 },
        { d: "M186 48 C 180 76 162 92 138 100", w: 2.8 }
      ]
    });
  },
  ramaAncha: function () {
    return sakura({
      cls: "sc-ancha", paleta: "oro", semilla: 6612, tam: 10, separacion: 48,
      ramas: [
        { d: "M-14 200 C 70 176 140 202 216 180 C 292 158 348 184 414 162", w: 4.5 },
        { d: "M120 190 C 126 160 118 140 100 126", w: 2.6 },
        { d: "M300 172 C 306 142 298 122 280 108", w: 2.4 }
      ]
    });
  }
};

function montar() {
  var escenas = [];
  document.querySelectorAll("[data-scene]").forEach(function (el) {
    var f = ESCENAS[el.getAttribute("data-scene")];
    if (!f) return;
    el.classList.add("scene");
    el.innerHTML = f();
    escenas.push(el);
  });

  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Pétalos: generosos en el nombre, apenas insinuados en el resto */
  if (!quieto) escenas.forEach(function (sc) {
    var esHero = sc.closest(".hero") !== null;
    var n = esHero ? 14 : 5, html = "";
    for (var i = 0; i < n; i++) {
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + "%;" +
              "animation-delay:" + (Math.random() * 18).toFixed(1) + "s;" +
              "animation-duration:" + (14 + Math.random() * 12).toFixed(1) + 's"></i>';
    }
    var lluvia = document.createElement("div");
    lluvia.className = "petalos" + (esHero ? "" : " petalos-poco");
    lluvia.innerHTML = html;
    sc.appendChild(lluvia);
  });

  if (quieto) return;

  /* Parallax por capas, atado al scroll */
  var pendiente = false;
  function pintar() {
    var vh = window.innerHeight;
    escenas.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -250 || r.top > vh + 250) return;
      var t = (r.top + r.height / 2 - vh / 2) / vh;
      var s = el.firstElementChild;
      if (!s) return;
      var l = s.querySelector(".capa-lenta"),
          m = s.querySelector(".capa-media"),
          f = s.querySelector(".capa-rapida");
      if (l) l.style.transform = "translateY(" + (t * 8).toFixed(1) + "px)";
      if (m) m.style.transform = "translateY(" + (t * 20).toFixed(1) + "px)";
      if (f) f.style.transform = "translateY(" + (t * 34).toFixed(1) + "px)";
    });
    pendiente = false;
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
  }, { passive: true });
  pintar();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
else montar();

})();
