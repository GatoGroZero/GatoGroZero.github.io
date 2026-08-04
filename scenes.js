/* ═══════════════════════════════════════════════════════════════
   Escenarios de tinta japonesa. Uno por proyecto.
   Trazo fluido, no pixel: sakura, nubes, koi, grullas y crisantemos.
   Se dibujan con paths para que se vean limpios a cualquier tamaño.
   El movimiento va atado al scroll, nunca en bucle infinito.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var CARMIN = "#ad0013",
    CARMIN_LT = "#d4243a",
    ROSA = "#e0697c",
    ORO = "#a67d43",
    ORO_LT = "#c9a15c",
    TINTA = "#2a2b28",
    HUESO = "#ece5d8";

function svg(w, h, cuerpo, cls) {
  return '<svg class="scene-svg ' + cls + '" viewBox="0 0 ' + w + " " + h +
         '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
         cuerpo + "</svg>";
}
function trazo(d, color, ancho, op) {
  return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + ancho +
         '" stroke-linecap="round" stroke-linejoin="round"' + (op ? ' opacity="' + op + '"' : "") + "/>";
}
function forma(d, color, op) {
  return '<path d="' + d + '" fill="' + color + '"' + (op ? ' opacity="' + op + '"' : "") + "/>";
}

/* ── Flor de cinco pétalos ── */
function flor(cx, cy, r, color, op, giro) {
  var g = '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (giro || 0) + ')" opacity="' + (op || 1) + '">';
  for (var i = 0; i < 5; i++) {
    g += '<ellipse cx="0" cy="' + (-r * 0.66).toFixed(2) + '" rx="' + (r * 0.44).toFixed(2) +
         '" ry="' + (r * 0.62).toFixed(2) + '" fill="' + color +
         '" transform="rotate(' + (i * 72) + ')"/>';
  }
  g += '<circle r="' + (r * 0.24).toFixed(2) + '" fill="' + ORO_LT + '"/>';
  for (var k = 0; k < 5; k++) {
    g += '<line x1="0" y1="0" x2="0" y2="' + (-r * 0.5).toFixed(2) +
         '" stroke="' + ORO_LT + '" stroke-width="' + (r * 0.07).toFixed(2) +
         '" opacity=".85" transform="rotate(' + (k * 72 + 36) + ')"/>';
  }
  return g + "</g>";
}

/* ═══════ 1. SAKURA · el nombre ═══════ */
function sakura() {
  var o = '<g class="capa-lenta">';
  /* rama principal, de gruesa a fina */
  o += trazo("M-12 236 C 54 212 84 176 132 152 C 186 124 236 116 292 88 C 338 64 372 46 412 26", TINTA, 9, .95);
  o += trazo("M-12 240 C 54 216 84 180 132 156 C 186 128 236 120 292 92", "#15160f", 4, .5);
  /* ramas secundarias */
  o += trazo("M104 168 C 118 138 128 116 122 88", TINTA, 5, .9);
  o += trazo("M122 88 C 116 70 118 56 128 44", TINTA, 3, .85);
  o += trazo("M196 130 C 216 106 232 92 262 84", TINTA, 4.5, .9);
  o += trazo("M262 84 C 286 78 300 68 312 54", TINTA, 2.6, .8);
  o += trazo("M64 202 C 74 178 72 158 60 140", TINTA, 4, .85);
  o += trazo("M300 82 C 322 96 344 100 368 96", TINTA, 3.4, .8);
  o += trazo("M160 146 C 168 168 182 182 202 190", TINTA, 3, .75);
  o += "</g>";

  /* flores: grandes cerca de la rama, chicas al fondo */
  o += '<g class="capa-media">';
  var grandes = [[122,44,15,0],[128,74,13,24],[104,110,12,50],[60,140,14,12],
                 [70,176,11,70],[168,150,13,32],[202,190,12,8],[262,84,15,44],
                 [312,54,12,18],[368,96,13,60],[292,92,11,36],[214,120,10,52]];
  grandes.forEach(function (f, i) {
    o += flor(f[0], f[1], f[2], i % 3 === 0 ? CARMIN : CARMIN_LT, .95, f[3]);
  });
  o += "</g>";

  o += '<g class="capa-rapida">';
  var chicas = [[150,86,7,10],[236,54,6,40],[86,68,6,25],[330,120,7,55],
                [190,42,5,70],[268,140,6,15],[46,110,5,35],[350,60,6,48]];
  chicas.forEach(function (f) { o += flor(f[0], f[1], f[2], ROSA, .7, f[3]); });
  /* capullos */
  [[142,64],[248,72],[96,148],[322,86],[178,168]].forEach(function (c) {
    o += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="3.4" fill="' + CARMIN + '" opacity=".8"/>';
  });
  o += "</g>";

  return svg(400, 260, o, "sc-sakura");
}

/* ═══════ 2. NUBES ESTILIZADAS · Gestión de Solicitudes ═══════ */

/* Nube japonesa: banda con lomos redondos arriba y voluta en la punta.
   Se dibuja el contorno completo y luego una línea interior que lo sigue,
   que es lo que le da el aire de grabado. */
function nube(x, y, ancho, alto, lobulos, color, op) {
  var paso = ancho / lobulos, r = paso / 2, i;

  /* Contorno cerrado: lomos hacia la derecha arriba, y de regreso
     por abajo con lomos más chicos. Así flota en vez de verse cortada. */
  var d = "M" + x + " " + (y + alto * 0.55);
  for (i = 0; i < lobulos; i++) {
    var rr = r * (i % 2 ? 0.78 : 1);
    d += " a" + rr + " " + rr + " 0 0 1 " + (rr * 2) + " " + (i % 2 ? -2 : 2);
    if (rr * 2 < paso) d += " l" + (paso - rr * 2) + " 0";
  }
  d += " L" + (x + ancho) + " " + (y + alto);
  for (i = lobulos - 1; i >= 0; i--) {
    var rb = r * 0.5;
    d += " a" + rb + " " + rb + " 0 0 1 " + (-rb * 2) + " 0";
    d += " l" + (-(paso - rb * 2)) + " 0";
  }
  d += " Z";

  var g = '<g opacity="' + op + '">' + forma(d, color);

  /* Línea interior que sigue el lomo, el detalle de grabado */
  var d2 = "M" + (x + paso * 0.55) + " " + (y + alto * 0.62);
  for (i = 0; i < lobulos - 1; i++) {
    var r2 = r * 0.6;
    d2 += " a" + r2 + " " + r2 + " 0 0 1 " + (r2 * 2) + " 0";
    d2 += " l" + (paso - r2 * 2) + " 0";
  }
  g += trazo(d2, HUESO, 1.2, .4);

  /* Volutas en los dos extremos */
  g += trazo("M" + (x + ancho) + " " + (y + alto * 0.72) +
             " c 15 1 19 -12 6 -16 c -8 -2 -12 4 -7 8", color, 3, .95);
  g += trazo("M" + x + " " + (y + alto * 0.68) +
             " c -15 1 -19 -12 -6 -16 c 8 -2 12 4 7 8", color, 2.4, .8);
  return g + "</g>";
}

function nubes() {
  var o = "";
  o += '<g class="capa-lenta">'  + nube(-30, 44,  300, 92, 5, CARMIN,    .32) + "</g>";
  o += '<g class="capa-media">'  + nube(60,  96,  330, 86, 6, CARMIN_LT, .30) + "</g>";
  o += '<g class="capa-rapida">' + nube(-10, 152, 380, 78, 7, ORO,       .30) + "</g>";
  return svg(400, 260, o, "sc-nubes");
}

/* ── Un koi ── */
function koi(x, y, s, giro, cuerpo, op) {
  var g = '<g transform="translate(' + x + ',' + y + ') rotate(' + giro + ') scale(' + s + ')" opacity="' + op + '">';
  /* cola */
  g += forma("M18 0 C 6 -14 -6 -22 -20 -19 C -10 -10 -6 -5 -4 0 C -6 5 -10 10 -20 19 C -6 22 6 14 18 0 Z", cuerpo);
  /* cuerpo */
  g += forma("M16 0 C 28 -15 58 -16 76 0 C 58 16 28 15 16 0 Z", cuerpo);
  /* aleta dorsal */
  g += forma("M38 -11 C 44 -24 56 -27 64 -20 C 54 -18 46 -15 40 -9 Z", cuerpo, .85);
  /* aleta pectoral */
  g += forma("M46 7 C 50 20 44 26 34 23 C 40 18 43 13 44 7 Z", cuerpo, .85);
  /* escamas */
  for (var i = 0; i < 4; i++) {
    g += trazo("M" + (32 + i * 10) + " -9 q 5 9 0 18", HUESO, 1.2, .45);
  }
  /* ojo */
  g += '<circle cx="68" cy="-2.5" r="2.6" fill="' + TINTA + '"/>';
  g += '<circle cx="68.8" cy="-3.3" r="1" fill="#fff" opacity=".9"/>';
  /* bigotes */
  g += trazo("M76 2 c 6 2 9 6 8 11", cuerpo, 1.3, .7);
  return g + "</g>";
}

/* ═══════ 3. KOI · Devengo ═══════ */
function koiEscena() {
  var o = "";
  /* remolinos del agua */
  o += '<g class="capa-lenta" opacity=".5">';
  [[70,70,34],[300,60,40],[180,190,46],[350,180,30],[40,190,26]].forEach(function (c) {
    var d = "M" + c[0] + " " + c[1];
    for (var t = 0; t < 26; t++) {
      var a = t * 0.55, r = c[2] * (1 - t / 30);
      d += " L" + (c[0] + Math.cos(a) * r).toFixed(1) + " " + (c[1] + Math.sin(a) * r * 0.62).toFixed(1);
    }
    o += trazo(d, ORO, 1.5, .8);
  });
  o += "</g>";

  /* corrientes largas */
  o += '<g class="capa-media" opacity=".4">';
  o += trazo("M-10 150 C 80 118 130 172 210 140 C 280 112 330 158 410 126", ORO_LT, 2, .9);
  o += trazo("M-10 178 C 90 150 140 200 220 168 C 290 142 340 186 410 156", ORO, 1.6, .7);
  o += trazo("M-10 96 C 70 70 120 112 200 84", ORO_LT, 1.4, .6);
  o += "</g>";

  /* los peces */
  o += '<g class="capa-rapida">';
  o += koi(64, 108, 1.25, -14, CARMIN, .95);
  o += koi(236, 168, 1.05, 166, HUESO, .78);
  o += koi(300, 74, 0.8, 22, ORO_LT, .6);
  o += "</g>";

  /* burbujas */
  o += '<g class="capa-rapida" opacity=".55">';
  [[150,60,3],[168,44,2],[280,124,2.5],[96,168,2],[330,140,3],[210,96,2]].forEach(function (b) {
    o += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + HUESO + '"/>';
  });
  o += "</g>";

  return svg(400, 260, o, "sc-koi");
}

/* ── Grulla en vuelo ── */
function grulla(x, y, s, op) {
  var g = '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" opacity="' + op + '">';
  g += forma("M0 0 C 10 -8 24 -10 36 -6 C 30 -2 22 0 14 1 Z", HUESO);          // ala superior
  g += forma("M6 2 C 16 8 28 12 40 11 C 30 15 18 15 8 10 Z", HUESO, .85);      // ala inferior
  g += forma("M36 -6 C 46 -8 54 -12 60 -18 C 56 -10 50 -4 42 -2 Z", HUESO, .7);// cuello
  g += trazo("M0 0 C -8 3 -14 8 -18 14", HUESO, 1.6, .7);                       // cola
  return g + "</g>";
}

/* ═══════ 4. NUBES, GRULLAS Y LUNA · Paymet ═══════ */
function grullas() {
  var o = "";
  /* luna */
  o += '<g class="capa-lenta">';
  o += '<circle cx="316" cy="66" r="46" fill="' + HUESO + '" opacity=".13"/>';
  o += '<circle cx="316" cy="66" r="34" fill="' + HUESO + '" opacity=".2"/>';
  o += "</g>";

  /* bancos de niebla: líneas largas, no manchas */
  o += '<g class="capa-media" opacity=".34">';
  [[  0, 158, 260], [110, 186, 300], [240, 168, 240], [190, 208, 280]].forEach(function (n, i) {
    var x = n[0], y = n[1], w = n[2];
    o += trazo("M" + x + " " + y + " c " + (w * 0.28) + " -9 " + (w * 0.5) + " 9 " + (w * 0.74) + " -2" +
               " c " + (w * 0.12) + " -6 " + (w * 0.2) + " 2 " + (w * 0.26) + " -3",
               ORO_LT, i % 2 ? 1.6 : 2.2, .9);
    o += trazo("M" + (x + 22) + " " + (y + 9) + " c " + (w * 0.26) + " -7 " + (w * 0.46) + " 8 " + (w * 0.66) + " -2",
               ORO, 1.2, .6);
  });
  o += "</g>";

  /* trazos de viento */
  o += '<g class="capa-media" opacity=".26">';
  o += trazo("M40 96 C 110 80 160 104 230 88", HUESO, 1.4);
  o += trazo("M20 118 C 100 104 150 126 220 112", HUESO, 1.1);
  o += trazo("M180 52 C 240 40 280 58 340 46", HUESO, 1.1);
  o += "</g>";

  /* las grullas */
  o += '<g class="capa-rapida">';
  o += grulla(70, 84, 1.3, .85);
  o += grulla(150, 54, 1.0, .7);
  o += grulla(212, 104, 0.8, .55);
  o += "</g>";

  return svg(400, 260, o, "sc-grullas");
}

/* ── Crisantemo ── */
function crisantemo(cx, cy, r, color, op) {
  var g = '<g transform="translate(' + cx + ',' + cy + ')" opacity="' + op + '">';
  for (var capa = 0; capa < 3; capa++) {
    var n = 12 + capa * 4, rr = r * (1 - capa * 0.26);
    for (var i = 0; i < n; i++) {
      g += '<ellipse cx="0" cy="' + (-rr * 0.62).toFixed(2) + '" rx="' + (rr * 0.1).toFixed(2) +
           '" ry="' + (rr * 0.5).toFixed(2) + '" fill="' + color +
           '" opacity="' + (0.55 + capa * 0.18).toFixed(2) +
           '" transform="rotate(' + ((i * 360 / n) + capa * 9).toFixed(1) + ')"/>';
    }
  }
  g += '<circle r="' + (r * 0.16).toFixed(2) + '" fill="' + ORO_LT + '"/>';
  return g + "</g>";
}

/* ═══════ 5. CRISANTEMOS · Gestión de Recursos ═══════ */
function crisantemos() {
  var o = "";
  /* tallos */
  o += '<g class="capa-lenta" opacity=".55">';
  o += trazo("M60 260 C 66 200 58 160 74 116", ORO, 2.4);
  o += trazo("M180 260 C 174 210 186 172 172 128", ORO, 2);
  o += trazo("M300 260 C 308 214 296 178 312 140", ORO, 2.2);
  o += trazo("M120 260 C 126 220 118 196 130 174", ORO, 1.6);
  o += trazo("M244 260 C 238 224 248 202 236 184", ORO, 1.6);
  o += "</g>";

  /* hojas */
  o += '<g class="capa-media" opacity=".4">';
  [[70,170,1],[168,190,-1],[304,196,1],[128,214,-1],[240,222,1]].forEach(function (h) {
    var x = h[0], y = h[1], s = h[2];
    o += forma("M" + x + " " + y + " c " + (18 * s) + " -12 " + (34 * s) + " -6 " + (40 * s) + " 8" +
               " c " + (-20 * s) + " 6 " + (-32 * s) + " 2 " + (-40 * s) + " -8 Z", ORO);
  });
  o += "</g>";

  /* flores */
  o += '<g class="capa-rapida">';
  o += crisantemo(74, 112, 34, CARMIN, .8);
  o += crisantemo(172, 124, 26, ORO_LT, .7);
  o += crisantemo(312, 136, 30, CARMIN_LT, .72);
  o += crisantemo(130, 172, 18, ORO, .55);
  o += crisantemo(236, 182, 16, CARMIN, .5);
  o += "</g>";

  return svg(400, 260, o, "sc-crisantemo");
}

/* ═══════ 6. ASANOHA · Stack ═══════ */
function asanoha() {
  var o = '<g class="capa-lenta" opacity=".5">', p = 46;
  for (var fy = 0; fy < 7; fy++) {
    for (var fx = 0; fx < 10; fx++) {
      var x = fx * p + (fy % 2 ? p / 2 : 0), y = fy * p * 0.86;
      o += trazo("M" + x + " " + (y - p / 2) + " L" + (x + p / 2) + " " + y +
                 " L" + x + " " + (y + p / 2) + " L" + (x - p / 2) + " " + y + " Z", ORO, 0.9);
      o += trazo("M" + x + " " + (y - p / 2) + " L" + x + " " + (y + p / 2) +
                 " M" + (x - p / 2) + " " + y + " L" + (x + p / 2) + " " + y, ORO, 0.7, .8);
    }
  }
  return svg(400, 260, o + "</g>", "sc-asanoha");
}

var ESCENAS = {
  sakura: sakura,
  nubes: nubes,
  koi: koiEscena,
  grullas: grullas,
  crisantemo: crisantemos,
  asanoha: asanoha
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

  /* Pétalos sobre el nombre */
  var hero = document.querySelector(".hero .scene");
  if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var lluvia = document.createElement("div");
    lluvia.className = "petalos";
    var html = "";
    for (var i = 0; i < 12; i++) {
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + "%;" +
              "animation-delay:" + (Math.random() * 16).toFixed(1) + "s;" +
              "animation-duration:" + (13 + Math.random() * 12).toFixed(1) + 's"></i>';
    }
    lluvia.innerHTML = html;
    hero.appendChild(lluvia);
  }

  /* Parallax atado al scroll. Nada de bucles infinitos: la escena
     solo se mueve mientras el usuario se mueve. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var pendiente = false;
  function pintar() {
    var vh = window.innerHeight;
    escenas.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var t = (r.top + r.height / 2 - vh / 2) / vh;   // -1 arriba, 1 abajo
      var svgEl = el.firstElementChild;
      if (!svgEl) return;
      var l = svgEl.querySelector(".capa-lenta"),
          m = svgEl.querySelector(".capa-media"),
          f = svgEl.querySelector(".capa-rapida");
      if (l) l.style.transform = "translateY(" + (t * 10).toFixed(1) + "px)";
      if (m) m.style.transform = "translateY(" + (t * 22).toFixed(1) + "px)";
      if (f) f.style.transform = "translateY(" + (t * 36).toFixed(1) + "px)";
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
