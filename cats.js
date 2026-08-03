/* ═══════════════════════════════════════════════════════════════
   Gatos samurái · sprites pixel dibujados a mano, sin imágenes
   Cada sprite es un arreglo de cadenas. Una letra es un pixel.
     .  vacío      o  contorno    b  pelaje    d  sombra
     w  claro      p  hocico      e  ojo       g  brillo
     r  cinta roja k  acero de la katana       h  empuñadura
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var touch = window.matchMedia("(hover: none)").matches;

var COATS = {
  tinta:  { b:"#3a3b38", d:"#262724", w:"#ece5d8", o:"#0b0c0b", p:"#ad0013", e:"#c9a15c", g:"#fff", r:"#ad0013", k:"#d8d4c8", h:"#a67d43" },
  oro:    { b:"#a67d43", d:"#7d5c2f", w:"#ece5d8", o:"#0b0c0b", p:"#ad0013", e:"#0b0c0b", g:"#fff", r:"#ad0013", k:"#d8d4c8", h:"#5c4526" },
  hueso:  { b:"#ece5d8", d:"#bdb4a4", w:"#fff", o:"#0b0c0b", p:"#ad0013", e:"#0b0c0b", g:"#fff", r:"#ad0013", k:"#d8d4c8", h:"#a67d43" },
  carmin: { b:"#8c1220", d:"#6b0a16", w:"#ece5d8", o:"#0b0c0b", p:"#ece5d8", e:"#c9a15c", g:"#fff", r:"#c9a15c", k:"#d8d4c8", h:"#a67d43" }
};

/* ── Gato samurái sentado, de frente, con cinta en la frente ── */
var SIT = [
  "....................",
  "..oo........oo......",
  "..obo......obo......",
  "..obpo....obpo......",
  "..obbboooobbbo......",
  ".obbbbbbbbbbbbo.....",
  ".orrrrrrrrrrrro.....",
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
var SIT_BLINK = SIT.slice();
SIT_BLINK[7] = ".obbbbbbbbbbbbo.....";
SIT_BLINK[8] = ".obbeebbbbeebbo.....";

/* ── Compañero de cursor: gato de perfil, katana envainada ── */
var GUARD = [
  "..o..o..........",
  ".obbbo..........",
  ".obbbbo.........",
  "pobebbooooooo...",
  ".orrrrrrrrrro...",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  "..obbbbbbbbbo.hh",
  "..oobbbbbbboohh.",
  "...o.o...o.o....",
  "...ooo...ooo...."
];

/* ── Mismo gato con la katana desenvainada ── */
var GUARD_ATTACK = [
  "..o..o.......k..",
  ".obbbo......k...",
  ".obbbbo....k....",
  "pobebbooook.....",
  ".orrrrrrhr......",
  ".obbbbbbbbbbbo..",
  ".obbbbbbbbbbbo..",
  "..obbbbbbbbbo...",
  "..oobbbbbbboo...",
  "..o..o...o..o...",
  "..ooo.....ooo..."
];

/* ── Gato dormido ── */
var SLEEP = [
  "................",
  "...oo......oo...",
  "..obbo....obbo..",
  "..obbboooobbbo..",
  ".obbbbbbbbbbbbo.",
  ".orrrrrrrrrrrro.",
  ".obbooobbooobbo.",
  ".obbbbbppbbbbbo.",
  "..obbbbbbbbbbo..",
  "..oooooooooooo..",
  "................"
];

/* ── Gatito guardián de sección, sentado de perfil ── */
var GUARDIAN = [
  "..o..o......",
  ".obbbo......",
  ".obebbo.....",
  ".orrrrro....",
  ".obbbbbbo...",
  "..obbbbbo.oo",
  "..obwwwbo.ob",
  "..obwwwbooob",
  "..obbbbbbbbo",
  "..oooooooooo"
];
/* El guardián hace una reverencia: la cabeza baja una fila */
var GUARDIAN_BOW = [
  "............",
  "..o..o......",
  ".obbbo......",
  ".obebbo.....",
  ".orrrrro.oo.",
  ".obbbbbbo.ob",
  "..obwwwbo.ob",
  "..obwwwboooo",
  "..obbbbbbbbo",
  "..oooooooooo"
];

/* ── Sprite a SVG. Une pixeles contiguos para no crear cientos de nodos ── */
function sprite(map, coat, px, cls) {
  var w = 0, i, j;
  for (i = 0; i < map.length; i++) if (map[i].length > w) w = map[i].length;
  var out = '<svg class="cat-svg ' + (cls || "") + '" viewBox="0 0 ' + w + " " + map.length +
            '" width="' + (w * px) + '" height="' + (map.length * px) +
            '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  for (i = 0; i < map.length; i++) {
    var row = map[i];
    j = 0;
    while (j < row.length) {
      var c = row[j];
      if (c === ".") { j++; continue; }
      var run = 1;
      while (j + run < row.length && row[j + run] === c) run++;
      out += '<rect x="' + j + '" y="' + i + '" width="' + run + '" height="1" fill="' + (coat[c] || coat.b) + '"/>';
      j += run;
    }
  }
  return out + "</svg>";
}

/* ═══════════ Gato del hero ═══════════ */
function heroCat() {
  var host = document.querySelector("[data-cat=hero]");
  if (!host) return;
  var coat = COATS.tinta, px = 7;

  host.innerHTML =
    '<div class="cat-hero-wrap">' +
      '<div class="cat-bubble" hidden>ニャー</div>' +
      '<div class="cat-body">' + sprite(SIT, coat, px) + "</div>" +
    "</div>";

  var body = host.querySelector(".cat-body");
  var bubble = host.querySelector(".cat-bubble");
  var open = sprite(SIT, coat, px), shut = sprite(SIT_BLINK, coat, px);

  if (!reduced) (function loop() {
    setTimeout(function () {
      body.innerHTML = shut;
      setTimeout(function () { body.innerHTML = open; loop(); }, 150);
    }, 2400 + Math.random() * 4000);
  })();

  function react() {
    body.classList.remove("hop");
    void body.offsetWidth;
    body.classList.add("hop");
    bubble.hidden = false;
    bubble.classList.remove("pop");
    void bubble.offsetWidth;
    bubble.classList.add("pop");
    clearTimeout(host._t);
    host._t = setTimeout(function () { bubble.hidden = true; }, 1500);
  }
  host.addEventListener("click", react);
  host.setAttribute("role", "button");
  host.setAttribute("tabindex", "0");
  host.setAttribute("aria-label", "Gato samurái. Actívalo para que salude.");
  host.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); react(); }
  });
}

/* ═══════════ Guardián que sigue al cursor y corta al hacer clic ═══════════ */
function cursorCat() {
  if (reduced || touch) return;
  var host = document.querySelector("[data-cat=cursor]");
  if (!host) return;

  var coat = COATS.hueso, px = 4;
  host.innerHTML = '<div class="cat-follow">' + sprite(GUARD, coat, px) + "</div>";
  var el = host.querySelector(".cat-follow");
  var idle = sprite(GUARD, coat, px), atk = sprite(GUARD_ATTACK, coat, px);

  var tx = innerWidth - 140, ty = innerHeight - 150, cx = tx, cy = ty, face = 1, raf = null;

  document.addEventListener("mousemove", function (e) {
    tx = e.clientX + 30;
    ty = e.clientY + 22;
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });

  function step() {
    var prev = cx;
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    if (Math.abs(cx - prev) > 0.5) face = cx > prev ? 1 : -1;
    cx = Math.max(4, Math.min(cx, innerWidth - 70));
    cy = Math.max(72, Math.min(cy, innerHeight - 60));
    el.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) scaleX(" + face + ")";
    if (Math.abs(tx - cx) > 0.6 || Math.abs(ty - cy) > 0.6) raf = requestAnimationFrame(step);
    else raf = null;
  }
  step();

  /* Al hacer clic desenvaina y deja un corte en el aire */
  var busy = false;
  document.addEventListener("click", function (e) {
    // No interrumpe si el clic fue sobre un control real
    if (busy) return;
    busy = true;
    el.innerHTML = atk;
    el.classList.add("swing");

    var cut = document.createElement("span");
    cut.className = "cat-cut";
    cut.style.left = e.clientX + "px";
    cut.style.top = e.clientY + "px";
    document.body.appendChild(cut);
    setTimeout(function () { cut.remove(); }, 460);

    setTimeout(function () {
      el.innerHTML = idle;
      el.classList.remove("swing");
      busy = false;
    }, 380);
  }, true);
}

/* ═══════════ Guardianes de sección: se inclinan al aparecer ═══════════ */
function guardians() {
  var hosts = document.querySelectorAll("[data-cat=guard]");
  if (!hosts.length) return;
  var coats = [COATS.tinta, COATS.oro, COATS.carmin, COATS.hueso];

  hosts.forEach(function (host, i) {
    var coat = coats[i % coats.length], px = 4;
    var up = sprite(GUARDIAN, coat, px), bow = sprite(GUARDIAN_BOW, coat, px);
    host.innerHTML = up;
    if (reduced) return;

    var done = false;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting || done) return;
        done = true;
        io.disconnect();
        // Reverencia: baja, sube, baja, sube
        var seq = [bow, up, bow, up], k = 0;
        (function next() {
          if (k >= seq.length) return;
          host.innerHTML = seq[k++];
          setTimeout(next, 180);
        })();
      });
    }, { threshold: 0.5 });
    io.observe(host);

    host.addEventListener("mouseenter", function () {
      if (reduced) return;
      host.innerHTML = bow;
      setTimeout(function () { host.innerHTML = up; }, 260);
    });
  });
}

/* ═══════════ Gato dormido del pie ═══════════ */
function sleeperCat() {
  var host = document.querySelector("[data-cat=sleeper]");
  if (!host) return;
  host.innerHTML =
    '<span class="cat-sleep">' +
      '<i class="zzz z1">z</i><i class="zzz z2">z</i><i class="zzz z3">z</i>' +
      sprite(SLEEP, COATS.tinta, 4) +
    "</span>";
}

function init() { heroCat(); cursorCat(); guardians(); sleeperCat(); }

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
