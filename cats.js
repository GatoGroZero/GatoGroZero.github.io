/* ═══════════════════════════════════════════════════════════════
   Gatos pixel · sprites dibujados a mano, sin imágenes externas
   Cada sprite es un arreglo de cadenas. Una letra = un pixel.
     .  transparente     o  contorno      b  cuerpo
     d  sombra           w  claro         p  rosa
     e  ojo              g  brillo del ojo
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Paletas vintage ── */
var COATS = {
  naranja: { b:"#d98b3f", d:"#b06a26", w:"#f6e3c4", o:"#2e2620", p:"#c96a72", e:"#2e2620", g:"#fff8ea" },
  gris:    { b:"#8d8a93", d:"#6d6a74", w:"#e6e2e6", o:"#2e2620", p:"#c96a72", e:"#2e2620", g:"#fff8ea" },
  crema:   { b:"#e6cfa8", d:"#c8ab7e", w:"#fff8ea", o:"#2e2620", p:"#c96a72", e:"#2e2620", g:"#fff8ea" },
  negro:   { b:"#4a4048", d:"#332c33", w:"#8d8a93", o:"#2e2620", p:"#c96a72", e:"#d19a1c", g:"#fff8ea" },
  sage:    { b:"#7d9c84", d:"#5d7a64", w:"#e2ecdf", o:"#2e2620", p:"#c96a72", e:"#2e2620", g:"#fff8ea" }
};

/* ── Gato sentado, de frente. 20 x 16, con cola a la derecha ── */
var SIT = [
  "....................",
  "..oo........oo......",
  "..obo......obo......",
  "..obbo....obbo......",
  "..obpboooobpbo......",
  ".obbbbbbbbbbbbo.....",
  ".obbbbbbbbbbbbo.....",
  ".obbgebbbbgebbo.....",
  ".obbeebbbbeebbo.....",
  ".obbbbbppbbbbbo..oo.",
  ".obbbbwwwwbbbbo.obbo",
  "..obbbwwwwbbbo..obbo",
  "..obbwwwwwwbbo..obbo",
  "..obbwwwwwwbbooobbo.",
  "..obbbbbbbbbbbbbbo..",
  "..oooooooooooooooo.."
];

/* Mismo gato con los ojos cerrados, para parpadear */
var SIT_BLINK = SIT.slice();
SIT_BLINK[7] = ".obbbbbbbbbbbbo.....";
SIT_BLINK[8] = ".obbeebbbbeebbo.....";

/* Gato de perfil caminando (mira a la izquierda), dos cuadros */
var WALK_A = [
  "..o..o..........",
  ".obbbo......oo..",
  ".obbbbo....obbo.",
  "pobebbooooooobbo",
  ".obbbbbbbbbbbbbo",
  ".obbbbbbbbbbbbo.",
  "..obbbbbbbbbbo..",
  "..oobbbbbbbboo..",
  "...o.o....o.o...",
  "...o.o....o.o...",
  "...ooo....ooo..."
];
var WALK_B = WALK_A.slice(0, 8).concat([
  "...oo.....oo....",
  "..o..o...o..o...",
  "..ooo....ooo...."
]);

/* Gato dormido */
var SLEEP = [
  "................",
  "...oo......oo...",
  "..obbo....obbo..",
  "..obbboooobbbo..",
  ".obbbbbbbbbbbbo.",
  ".obbooobbooobbo.",
  ".obbbbbppbbbbbo.",
  ".obbbbbbbbbbbbo.",
  "..obbbbbbbbbbo..",
  "..oooooooooooo..",
  "................"
];

/* ── Convierte un sprite a SVG ── */
function sprite(map, coat, px, extraClass) {
  var w = 0, i, j;
  for (i = 0; i < map.length; i++) if (map[i].length > w) w = map[i].length;
  var h = map.length;
  var out = '<svg class="cat-svg ' + (extraClass || "") + '" viewBox="0 0 ' + w + " " + h +
            '" width="' + (w * px) + '" height="' + (h * px) +
            '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  for (i = 0; i < h; i++) {
    var row = map[i];
    j = 0;
    while (j < row.length) {
      var c = row[j];
      if (c === "." || c === undefined) { j++; continue; }
      // Une pixeles del mismo color en un solo rect (menos nodos)
      var run = 1;
      while (j + run < row.length && row[j + run] === c) run++;
      var fill = coat[c] || coat.b;
      out += '<rect x="' + j + '" y="' + i + '" width="' + run + '" height="1" fill="' + fill + '"/>';
      j += run;
    }
  }
  return out + "</svg>";
}

/* ═══════════ 1. Gato del hero: parpadea y responde al clic ═══════════ */
function heroCat() {
  var host = document.querySelector("[data-cat=hero]");
  if (!host) return;
  var coat = COATS.naranja;
  var px = 7;

  host.innerHTML =
    '<div class="cat-hero-wrap">' +
      '<div class="cat-bubble" hidden>¡miau!</div>' +
      '<div class="cat-body">' + sprite(SIT, coat, px) + "</div>" +
      '<div class="cat-shadow"></div>' +
    "</div>";

  var body = host.querySelector(".cat-body");
  var bubble = host.querySelector(".cat-bubble");
  var open = sprite(SIT, coat, px);
  var shut = sprite(SIT_BLINK, coat, px);

  if (!reduced) {
    (function loop() {
      var wait = 2200 + Math.random() * 3800;
      setTimeout(function () {
        body.innerHTML = shut;
        setTimeout(function () {
          body.innerHTML = open;
          // De vez en cuando parpadea dos veces seguidas
          if (Math.random() < 0.3) {
            setTimeout(function () { body.innerHTML = shut; }, 130);
            setTimeout(function () { body.innerHTML = open; }, 250);
          }
          loop();
        }, 140);
      }, wait);
    })();
  }

  host.addEventListener("click", function () {
    body.classList.remove("hop");
    void body.offsetWidth;          // reinicia la animación
    body.classList.add("hop");
    bubble.hidden = false;
    bubble.classList.remove("pop");
    void bubble.offsetWidth;
    bubble.classList.add("pop");
    clearTimeout(host._t);
    host._t = setTimeout(function () { bubble.hidden = true; }, 1400);
  });
  host.setAttribute("role", "button");
  host.setAttribute("tabindex", "0");
  host.setAttribute("aria-label", "Gato pixel. Actívalo para que maúlle.");
  host.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); host.click(); }
  });
}

/* ═══════════ 2. Gato que camina siguiendo el scroll ═══════════ */
function walkerCat() {
  var host = document.querySelector("[data-cat=walker]");
  if (!host) return;
  var coat = COATS.gris, px = 5;
  host.innerHTML = '<div class="cat-walker">' + sprite(WALK_A, coat, px) + "</div>";
  var el = host.querySelector(".cat-walker");
  var a = sprite(WALK_A, coat, px), b = sprite(WALK_B, coat, px);

  if (reduced) return;

  var frame = 0, pos = 0, lastY = window.scrollY, dir = 1, moving = 0;

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    var delta = y - lastY;
    if (Math.abs(delta) > 1) {
      dir = delta > 0 ? 1 : -1;
      // El gato avanza en proporción a lo que el usuario desplaza
      pos += delta * 0.32;
      moving = 12;
    }
    lastY = y;
  }, { passive: true });

  setInterval(function () {
    if (moving > 0) {
      moving--;
      frame = 1 - frame;
      el.innerHTML = frame ? a : b;
    }
    var w = host.clientWidth || 1;
    var span = w - 80;
    if (span < 40) span = 40;
    // Rebota en los extremos en lugar de salirse
    var t = ((pos % (span * 2)) + span * 2) % (span * 2);
    var x = t > span ? span * 2 - t : t;
    el.style.transform = "translateX(" + x + "px) scaleX(" + (dir > 0 ? 1 : -1) + ")";
  }, 90);
}

/* ═══════════ 3. Gatito que acompaña al cursor ═══════════ */
function cursorCat() {
  if (reduced || window.matchMedia("(hover: none)").matches) return;
  var host = document.querySelector("[data-cat=cursor]");
  if (!host) return;

  var coat = COATS.crema, px = 4;
  host.innerHTML = '<div class="cat-follow">' + sprite(SIT, coat, px) + "</div>";
  var el = host.querySelector(".cat-follow");

  var tx = window.innerWidth - 120, ty = window.innerHeight - 140;
  var cx = tx, cy = ty, face = 1, raf = null;

  document.addEventListener("mousemove", function (e) {
    // Se queda cerca del cursor, no encima: 60px abajo a la derecha
    tx = e.clientX + 34;
    ty = e.clientY + 26;
    if (!raf) raf = requestAnimationFrame(step);
  });

  function step() {
    var px0 = cx;
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    if (Math.abs(cx - px0) > 0.4) face = cx > px0 ? 1 : -1;
    // No dejar que se salga de la ventana
    cx = Math.max(6, Math.min(cx, window.innerWidth - 70));
    cy = Math.max(70, Math.min(cy, window.innerHeight - 76));
    el.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) scaleX(" + face + ")";
    if (Math.abs(tx - cx) > 0.6 || Math.abs(ty - cy) > 0.6) raf = requestAnimationFrame(step);
    else raf = null;
  }
  step();
}

/* ═══════════ 4. Gato dormido del pie ═══════════ */
function sleeperCat() {
  var host = document.querySelector("[data-cat=sleeper]");
  if (!host) return;
  host.innerHTML =
    '<div class="cat-sleep">' +
      '<span class="zzz z1">z</span><span class="zzz z2">z</span><span class="zzz z3">z</span>' +
      sprite(SLEEP, COATS.negro, 5) +
    "</div>";
}

/* ═══════════ 5. Gatitos decorativos de sección ═══════════ */
function tinyCats() {
  document.querySelectorAll("[data-cat=tiny]").forEach(function (el, i) {
    var coats = [COATS.naranja, COATS.sage, COATS.gris, COATS.negro];
    el.innerHTML = sprite(SIT, coats[i % coats.length], 3);
  });
}

function init() {
  heroCat();
  walkerCat();
  cursorCat();
  sleeperCat();
  tinyCats();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
