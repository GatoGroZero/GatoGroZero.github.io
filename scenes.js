/* ═══════════════════════════════════════════════════════════════
   Escenarios de fondo. Uno por sección, dibujados con rectángulos
   para que combinen con los gatos. Van muy tenues a propósito:
   ambientan sin competir con el texto.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var ORO = "#a67d43", CARMIN = "#c4102a", TINTA = "#6b5a42", HUESO = "#ece5d8";

function svg(w, h, cuerpo, cls) {
  return '<svg class="scene-svg ' + (cls || "") + '" viewBox="0 0 ' + w + " " + h +
         '" preserveAspectRatio="xMaxYMax meet" shape-rendering="crispEdges" ' +
         'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + cuerpo + "</svg>";
}
function r(x, y, w, h, f, o) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
         '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>";
}

/* ── Sakura: rama con flores, para el nombre ── */
function sakura() {
  var o = "";
  /* rama principal desde la esquina */
  var tramos = [[0,16,26,5],[24,20,18,5],[40,25,16,4],[54,29,14,4],[66,33,12,4],
                [20,14,4,10],[36,18,4,10],[52,23,4,9]];
  tramos.forEach(function (t) { o += r(t[0], t[1], t[2], t[3], TINTA, .85); });
  /* flores de cinco pétalos hechas con cuadros */
  var flores = [[16,6],[30,10],[44,14],[58,20],[70,26],[10,24],[36,30],[62,38],[24,34],[50,6]];
  flores.forEach(function (f, i) {
    var x = f[0], y = f[1], c = i % 3 === 0 ? CARMIN : "#d4707c";
    o += r(x + 2, y, 3, 3, c, .5) + r(x, y + 2, 3, 3, c, .5) +
         r(x + 4, y + 2, 3, 3, c, .5) + r(x + 1, y + 4, 3, 3, c, .5) +
         r(x + 3, y + 4, 3, 3, c, .5) + r(x + 2, y + 2, 2, 2, ORO, .6);
  });
  return svg(100, 60, o, "sc-sakura");
}

/* ── Torii: la puerta del santuario ── */
function torii() {
  var o = "";
  o += r(6, 10, 88, 5, CARMIN);          // dintel superior
  o += r(2, 6, 96, 4, TINTA);            // remate
  o += r(14, 22, 72, 4, CARMIN);         // travesaño
  o += r(18, 15, 6, 45, CARMIN);         // pilar izquierdo
  o += r(76, 15, 6, 45, CARMIN);         // pilar derecho
  o += r(16, 58, 10, 3, TINTA);          // base izquierda
  o += r(74, 58, 10, 3, TINTA);          // base derecha
  o += r(46, 14, 8, 9, ORO, .8);         // tablilla central
  return svg(100, 62, o, "sc-torii");
}

/* ── Pagoda de tres cuerpos ── */
function pagoda() {
  var o = "";
  o += r(48, 2, 4, 8, ORO);                       // aguja
  var pisos = [[30,10,40,4],[26,14,48,3],[34,17,32,9],
               [24,26,52,4],[20,30,60,3],[30,33,40,10],
               [18,43,64,4],[14,47,72,3],[26,50,48,12]];
  pisos.forEach(function (p, i) {
    o += r(p[0], p[1], p[2], p[3], i % 3 === 2 ? TINTA : CARMIN, i % 3 === 2 ? .9 : 1);
  });
  o += r(46, 54, 8, 8, ORO, .7);                  // puerta
  return svg(100, 62, o, "sc-pagoda");
}

/* ── Monte y luna ── */
function monte() {
  var o = "";
  o += r(70, 6, 14, 14, HUESO, .55);              // luna
  /* ladera en escalones */
  for (var i = 0; i < 14; i++) {
    o += r(34 - i * 2.4, 26 + i * 2.6, 4.8 + i * 4.8, 2.8, TINTA, .9);
  }
  o += r(40, 24, 20, 4, HUESO, .5);               // nieve de la cima
  o += r(0, 58, 100, 4, TINTA, .7);               // suelo
  return svg(100, 62, o, "sc-monte");
}

/* ── Bambú ── */
function bambu() {
  var o = "";
  [10, 28, 52, 74, 90].forEach(function (x, i) {
    var an = i % 2 ? 5 : 7;
    o += r(x, 0, an, 62, ORO, .55);
    for (var y = 8; y < 62; y += 14) o += r(x - 1, y, an + 2, 2, TINTA, .8);
  });
  [[18,14],[44,26],[64,10],[84,34]].forEach(function (h) {
    o += r(h[0], h[1], 12, 2, ORO, .45) + r(h[0] + 3, h[1] - 3, 9, 2, ORO, .35);
  });
  return svg(100, 62, o, "sc-bambu");
}

/* ── Olas seigaiha ── */
function olas() {
  var o = "";
  for (var f = 0; f < 4; f++) {
    for (var c = 0; c < 8; c++) {
      var x = c * 13 + (f % 2 ? 6 : 0), y = f * 12 + 8;
      for (var k = 0; k < 3; k++) {
        o += r(x + k * 2, y + k * 2, 13 - k * 4, 2, ORO, .3 - k * .06);
      }
    }
  }
  return svg(100, 62, o, "sc-olas");
}

var ESCENAS = { sakura: sakura, torii: torii, pagoda: pagoda, monte: monte, bambu: bambu, olas: olas };

function montar() {
  document.querySelectorAll("[data-scene]").forEach(function (el) {
    var f = ESCENAS[el.getAttribute("data-scene")];
    if (!f) return;
    el.classList.add("scene");
    el.innerHTML = f();
  });

  /* Pétalos que caen sobre el hero */
  var hero = document.querySelector(".hero .scene");
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var lluvia = document.createElement("div");
  lluvia.className = "petalos";
  var n = 14, html = "";
  for (var i = 0; i < n; i++) {
    html += '<i style="left:' + (Math.random() * 100).toFixed(1) + "%;" +
            "animation-delay:" + (Math.random() * 14).toFixed(1) + "s;" +
            "animation-duration:" + (11 + Math.random() * 10).toFixed(1) + 's"></i>';
  }
  lluvia.innerHTML = html;
  hero.appendChild(lluvia);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
else montar();

})();
