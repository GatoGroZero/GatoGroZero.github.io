/* ═══════════════════════════════════════════════════════════════
   Gatos samurái · sprites pixel dibujados a mano, sin imágenes
   Una letra es un pixel:
     .  vacío     o  contorno    b  pelaje     d  sombra del pelaje
     w  pancita   i  oreja rosa  p  nariz      k  cachete
     e  ojo       g  brillo      r  cinta      s  acero
     c  filo      t  tsuba       h  mango      x  trenzado
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
var touch = window.matchMedia("(hover: none)").matches;

function off() {
  return document.documentElement.classList.contains("no-cats") || mqReduce.matches;
}

var COATS = {
  naranja: { b:"#d98b3f", d:"#b06a26", w:"#f6e3c4", o:"#141412", i:"#e08f96", p:"#c96a72", k:"#e0868e", e:"#141412", g:"#c9a15c", r:"#ad0013", s:"#d8cdb4", a:"#24251f", h:"#1b1c19", n:"#2a2118", c:"#6b4a2a", v:"#6b2028", f:"#e8c86a" },
  tinta:   { b:"#4a4a46", d:"#333330", w:"#d8d2c6", o:"#0e0e0d", i:"#c97f86", p:"#c96a72", k:"#a86a70", e:"#c9a15c", g:"#c9a15c", r:"#ad0013", s:"#d8cdb4", a:"#24251f", h:"#1b1c19", n:"#2a2118", c:"#6b4a2a", v:"#6b2028", f:"#e8c86a" },
  hueso:   { b:"#e6ddcc", d:"#c2b7a2", w:"#fdf8ee", o:"#141412", i:"#e08f96", p:"#c96a72", k:"#e0a0a6", e:"#141412", g:"#c9a15c", r:"#ad0013", s:"#d8cdb4", a:"#24251f", h:"#1b1c19", n:"#2a2118", c:"#6b4a2a", v:"#6b2028", f:"#e8c86a" },
  humo:    { b:"#9a968e", d:"#7a766f", w:"#e2ded6", o:"#141412", i:"#d0868d", p:"#c96a72", k:"#c98a90", e:"#141412", g:"#c9a15c", r:"#ad0013", s:"#d8cdb4", a:"#24251f", h:"#1b1c19", n:"#2a2118", c:"#6b4a2a", v:"#6b2028", f:"#e8c86a" },
  carmin:  { b:"#8c3038", d:"#6b222a", w:"#e8d5c8", o:"#140e0e", i:"#e0a0a6", p:"#e8d5c8", k:"#b05a60", e:"#c9a15c", g:"#c9a15c", r:"#c9a15c", s:"#d8cdb4", a:"#24251f", h:"#1b1c19", n:"#2a2118", c:"#6b4a2a", v:"#6b2028", f:"#e8c86a" }
};

/* ── Gato sentado de frente. Cabeza ancha, cachetes y cola curva ── */
var SIT = [
  "...oo..........oo.....",
  "..obbo........obbo....",
  "..obibo......obibo....",
  ".obiibo......obiibo...",
  ".obbbboooooooobbbbbo..",
  "obbbbbbbbbbbbbbbbbbo..",
  "obbbbbbbbbbbbbbbbbbo..",
  "obbbbgebbbbbbgebbbbo..",
  "obbbbeebbbbbbeebbbbo..",
  "obkkbbbbbppbbbbbkkbo..",
  "obbbbbbwwwwwwbbbbbbo..",
  ".obbbbbwwwwwwbbbbbo...",
  "..obbbbbbbbbbbbbbo....",
  "..obbbbbbbbbbbbbo.oo..",
  "..obbbbbbbbbbbbo.obbo.",
  "..obbbwwwwwwbbbo.obbo.",
  "..obbwwwwwwwwbbo.obbo.",
  "..obbwwwwwwwwbbo.obbo.",
  "..obbbwwwwwwbbboobbo..",
  "..obbbbbbbbbbbbbbbo...",
  "..oobbwwwwwwbbooobo...",
  "...oooooooooooo.ooo..."
];
var SIT_BLINK = SIT.slice();
SIT_BLINK[7] = "obbbbbbbbbbbbbbbbbbo..";
SIT_BLINK[8] = "obbbbeebbbbbbeebbbbo..";

/* Gato sentado que estira la pata hacia el cursor */
var SIT_PAW = SIT.slice();
SIT_PAW[13] = "..obbbbbbbbbbbbbo.oo..";
SIT_PAW[14] = "obbbbbbbbbbbbbbo.obbo.";
SIT_PAW[15] = "obbobbbwwwwwwbbo.obbo.";
SIT_PAW[16] = "ooo.obbwwwwwwwbo.obbo.";

/* Los gatos de perfil quedaban ilegibles a este tamaño, así que los que se
   mueven usan el mismo gato de frente dando saltitos. Se entiende mejor. */
var WALK_A = SIT;
var WALK_B = SIT_PAW;

/* Agazapado: el mismo gato con las orejas hacia atrás y el lomo bajo */
var CROUCH = SIT.slice();
CROUCH[0] = "......................";
CROUCH[1] = "...oo..........oo.....";
CROUCH[2] = "..obbo........obbo....";
CROUCH[3] = "..obibo......obibo....";

/* ── Gato dormido ── */
var SLEEP = [
  "..................",
  "...oo.......oo....",
  "..obio.....obio...",
  "..obiiboooobiibo..",
  ".obbbbbbbbbbbbbbo.",
  ".obbooobbbooobbbo.",
  ".obkkbbbppbbbkkbo.",
  ".obbbbwwwwwwbbbbo.",
  "..obbbbbbbbbbbbo..",
  "..oooooooooooooo..",
  "..................",
  ".................."
];

/* ── Katana: mango trenzado, tsuba dorada, hoja con filo claro ── */
var KATANA = [
  "....................................",
  ".xhxhxhxhx..tt.cccccccccccccccccccc.",
  "ohxhxhxhxho.tt.ssssssssssssssssssscc",
  ".xhxhxhxhx..tt......................",
  "...................................."
];


/* ═══════════════════════════════════════════════════════════════
   Sprites de 32 pixeles. Regla de oro del pixel art: cada gato
   debe reconocerse por su silueta. Maneki = pata en alto.
   Samurai = cuernos del kabuto. Lector = pergamino ancho.
   ═══════════════════════════════════════════════════════════════ */

/* ── Maneki neko: gato de la fortuna, saluda con la pata ── */
var MANEKI = [
  "........................oo......",
  "..oo.........oo........obbo.....",
  ".obbo.......obbo......obbbbo....",
  ".obiibo....obiibo.....obbbbo....",
  ".obiiiboooobiiibo.....obbbbo....",
  "obbbbbbbbbbbbbbbbo....obbbbo....",
  "obbbbbbbbbbbbbbbbo....obbbbo....",
  "obbbeebbbbbbeebbbo....obbbbo....",
  "obbbeebbbbbbeebbbo..obbbbo......",
  "obkkbbbbppbbbbkkbo..obbbo.......",
  "obbbbbwwwwwwbbbbbo.obbbo........",
  ".obbbbwwwwwwbbbbobbbbo..........",
  "..obbbbbbbbbbbbobbbo............",
  "..orrrrrrrrrrrroo...............",
  "..orrrgggrrrrrro................",
  "...obbbbbbbbbbo.................",
  "...obbbbbbbbbbo.................",
  "...obggggggggbo.................",
  "...obgnngnnngbo.................",
  "...obgnngnnngbo.................",
  "...obggggggggbo.................",
  "...obbbbbbbbbbo.................",
  "..obbbbbbbbbbbbo................",
  "..obbwwwwwwwwbbo................",
  "..obbwwwwwwwwbbo................",
  "..obbbwwwwwwbbbo................",
  "..oobbbbbbbbbboo................",
  "...oooooooooooo................."
];
var MANEKI_DOWN = MANEKI.slice();
MANEKI_DOWN[0]  = "................................";
MANEKI_DOWN[1]  = "..oo.........oo.................";
MANEKI_DOWN[2]  = ".obbo.......obbo................";
MANEKI_DOWN[3]  = ".obiibo....obiibo...............";
MANEKI_DOWN[4]  = ".obiiiboooobiiibo...............";
MANEKI_DOWN[5]  = "obbbbbbbbbbbbbbbbo..............";
MANEKI_DOWN[6]  = "obbbbbbbbbbbbbbbbo....oo........";
MANEKI_DOWN[7]  = "obbbeebbbbbbeebbbo...obbo.......";
MANEKI_DOWN[8]  = "obbbeebbbbbbeebbbo...obbbo......";
MANEKI_DOWN[9]  = "obkkbbbbppbbbbkkbo...obbbo......";
MANEKI_DOWN[10] = "obbbbbwwwwwwbbbbbo...obbbo......";
MANEKI_DOWN[11] = ".obbbbwwwwwwbbbbo...obbbo.......";
MANEKI_DOWN[12] = "..obbbbbbbbbbbbo...obbo.........";

/* ── Gato samurai: kabuto con cuernos y katana al costado ── */
var SAMURAI = [
  "....o..........o................",
  "....oo........oo................",
  ".....oo......oo.................",
  "......oooooooo..................",
  "...oohhhhhhhhhhoo...............",
  "..ohhhhhhggghhhhhho.............",
  "..ohhhhhhhhhhhhhhho.............",
  "..ohhoobbbbbbbboohho............",
  "...oobbbbbbbbbbbboo.............",
  "....obbeebbbbeebbo.............s",
  "....obkbbbppbbbkbo............s.",
  "....obbbwwwwwwbbbo...........s..",
  ".....obbbbbbbbbbo...........s...",
  "....oaaaaaaaaaaaao.........s....",
  "....oarrrrrrrrrrao........s.....",
  "....oaagggggggaaao.......s......",
  "....oaaaaaaaaaaaao......st......",
  ".....oaaaaaaaaaao......hh.......",
  ".....oaaaaaaaaaao.....hh........",
  ".....oaabbbbbbaao...............",
  ".....oaa.oooo.aao...............",
  ".....ooo......ooo..............."
];
var SAMURAI_B = SAMURAI.slice();
SAMURAI_B[19] = ".....oabbbbbbbbao...............";
SAMURAI_B[20] = "....oaa.oo..oo.aao..............";
SAMURAI_B[21] = "....ooo........ooo..............";

/* ── Gato lector: sentado sobre cojin con un pergamino ── */
var LECTOR = [
  "................................",
  "..oo.........oo.................",
  ".obbo.......obbo................",
  ".obiibo....obiibo...............",
  ".obiiiboooobiiibo...............",
  "obbbbbbbbbbbbbbbbo..............",
  "obbbeebbbbbbeebbbo..............",
  "obkkbbbbppbbbbkkbo..............",
  "obbbbbwwwwwwbbbbbo..............",
  ".obbbbbbbbbbbbbbo...............",
  "..okkkkkkkkkkkko................",
  ".ooooooooooooooooooooooooooo....",
  ".ocsssssssssssssssssssssssco....",
  ".ocsnnnnsnnnnsnnnnsnnnnsssco....",
  ".ocsssssssssssssssssssssssco....",
  ".ocsnnnnnsnnnnsnnnnnsnnnssco....",
  ".ocsssssssssssssssssssssssco....",
  ".ooooooooooooooooooooooooooo....",
  "..obbbbbbbbbbbbbbbbo...........",
  "..ovvvvvvvvvvvvvvvvvo..........",
  ".ovvvvvvvvvvvvvvvvvvvo.........",
  ".ooooooooooooooooooooo.........."
];

/* ── Gato mercader: sostiene un koban ── */
var KOBAN = MANEKI_DOWN.slice();

/* ── Gato con farol ── */
var FAROL = [
  "................................",
  "..oo.........oo.................",
  ".obbo.......obbo................",
  ".obiibo....obiibo...ooo.........",
  ".obiiiboooobiiibo..o...o........",
  "obbbbbbbbbbbbbbbbo.offfo........",
  "obbbeebbbbbbeebbbo.ofnfo........",
  "obkkbbbbppbbbbkkbo.ofnfo........",
  "obbbbbwwwwwwbbbbbo.offfo........",
  ".obbbbbbbbbbbbbbo..ooooo........",
  "..orrrrrrrrrrrroboo.o...........",
  "..obbbbbbbbbbbbobbo.............",
  "..obbbbbbbbbbbbbo...............",
  "..obbwwwwwwwwwbbo...............",
  "..obbwwwwwwwwwbbo...............",
  "..obbbwwwwwwwbbbo...............",
  "..oobbbbbbbbbbboo...............",
  "...ooooooooooooo................"
];

/* ── Sprite a SVG, uniendo pixeles contiguos ── */
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

var STEEL = { s:"#c9c6bc", c:"#f4f1e8", t:"#c9a15c", h:"#3a2620", x:"#8c5a4a", o:"#141412" };

/* ═══════════ 1. Gato del hero ═══════════ */
function heroCat() {
  var host = document.querySelector("[data-cat=hero]");
  if (!host) return;
  var coat = COATS.hueso, px = 5;

  host.innerHTML =
    '<div class="cat-hero-wrap">' +
      '<div class="cat-bubble" hidden>いらっしゃい</div>' +
      '<div class="cat-body">' + sprite(MANEKI, coat, px) + "</div>" +
    "</div>";

  var body = host.querySelector(".cat-body"), bubble = host.querySelector(".cat-bubble");
  var up = sprite(MANEKI, coat, px), down = sprite(MANEKI_DOWN, coat, px);

  /* El maneki saluda: la pata sube y baja sin parar */
  var arriba = true;
  setInterval(function () {
    if (off()) return;
    arriba = !arriba;
    body.innerHTML = arriba ? up : down;
  }, 620);

  function react() {
    if (!off()) {
      body.classList.remove("hop"); void body.offsetWidth; body.classList.add("hop");
    }
    bubble.hidden = false;
    bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
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

/* ═══════════ 2. Guardián del cursor con katana ═══════════ */
function cursorCat() {
  if (touch) return;
  var host = document.querySelector("[data-cat=cursor]");
  if (!host) return;

  var coat = COATS.hueso, px = 3;
  host.innerHTML =
    '<div class="cat-follow">' +
      '<span class="cat-blade">' + sprite(KATANA, STEEL, 3, "blade") + "</span>" +
      sprite(WALK_A, coat, px) +
    "</div>";
  var el = host.querySelector(".cat-follow");
  var body = el.querySelector(".cat-svg:not(.blade)");
  var idle = sprite(WALK_A, coat, px), b2 = sprite(WALK_B, coat, px), crouch = sprite(CROUCH, coat, px);

  var tx = innerWidth - 150, ty = innerHeight - 160, cx = tx, cy = ty, face = 1, raf = null, frame = 0, moved = 0;

  document.addEventListener("mousemove", function (e) {
    tx = e.clientX + 34; ty = e.clientY + 26; moved = 14;
    if (!raf && !off()) raf = requestAnimationFrame(step);
  }, { passive: true });

  function step() {
    var prev = cx;
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    var dx = cx - prev;
    if (Math.abs(dx) > 0.5) face = dx > 0 ? 1 : -1;
    cx = Math.max(4, Math.min(cx, innerWidth - 80));
    cy = Math.max(74, Math.min(cy, innerHeight - 64));
    el.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) scaleX(" + face + ")";

    /* Alterna las patas mientras persigue */
    if (moved > 0 && Math.abs(dx) > 0.8) {
      moved--;
      if (++frame % 6 === 0) {
        var cur = el.querySelector(".cat-svg:not(.blade)");
        if (cur) cur.outerHTML = (frame % 12 === 0) ? idle : b2;
      }
    }
    if (Math.abs(tx - cx) > 0.6 || Math.abs(ty - cy) > 0.6) raf = requestAnimationFrame(step);
    else { raf = null; var c = el.querySelector(".cat-svg:not(.blade)"); if (c) c.outerHTML = crouch; }
  }
  step();

  var busy = false;
  document.addEventListener("click", function (e) {
    if (busy || off()) return;
    busy = true;
    el.classList.add("swing");
    var cut = document.createElement("span");
    cut.className = "cat-cut";
    cut.style.left = e.clientX + "px";
    cut.style.top = e.clientY + "px";
    document.body.appendChild(cut);
    setTimeout(function () { cut.remove(); }, 480);
    setTimeout(function () { el.classList.remove("swing"); busy = false; }, 420);
  }, true);
}

/* ═══════════ 3. Un gato por proyecto, cada uno con lo suyo ═══════════ */
function sceneCats() {
  var ELENCO = {
    samurai: { mapas: [SAMURAI, SAMURAI_B], pelaje: "hueso", anda: true },
    koban:   { mapas: [KOBAN, MANEKI],      pelaje: "naranja", anda: true },
    farol:   { mapas: [FAROL],              pelaje: "tinta",   anda: true },
    lector:  { mapas: [LECTOR],             pelaje: "humo",    anda: false }
  };

  document.querySelectorAll("[data-cat=scene]").forEach(function (host) {
    var papel = ELENCO[host.getAttribute("data-act")] || ELENCO.samurai;
    var coat = COATS[papel.pelaje], px = 3;
    var cuadros = papel.mapas.map(function (m) { return sprite(m, coat, px); });

    host.innerHTML = '<div class="cat-scene">' + cuadros[0] + "</div>";
    var el = host.querySelector(".cat-scene");

    /* El lector se queda sentado leyendo, no camina */
    if (!papel.anda) { el.classList.add("quieto"); return; }

    var x = 10, dir = 1, i = 0, persiguiendo = 0;

    /* Si el cursor entra a su franja, va tras él */
    if (!touch) host.addEventListener("mousemove", function (e) {
      if (off()) return;
      var r = host.getBoundingClientRect();
      var meta = e.clientX - r.left - 40;
      dir = meta > x ? 1 : -1;
      x += (meta - x) * 0.16;
      persiguiendo = 30;
    }, { passive: true });

    setInterval(function () {
      if (off()) return;
      var ancho = (host.clientWidth || 320) - 100;
      if (ancho < 60) ancho = 60;
      if (persiguiendo > 0) persiguiendo--;
      else {
        x += dir * 2.2;
        if (x > ancho) { x = ancho; dir = -1; }
        if (x < 0) { x = 0; dir = 1; }
      }
      if (cuadros.length > 1) el.innerHTML = cuadros[(++i) % cuadros.length];
      el.style.transform = "translateX(" + x.toFixed(0) + "px) scaleX(" + dir + ")";
    }, 150);
  });
}

/* ═══════════ 4. Gato dormido del pie ═══════════ */
function sleeperCat() {
  var host = document.querySelector("[data-cat=sleeper]");
  if (!host) return;
  host.innerHTML =
    '<span class="cat-sleep">' +
      '<i class="zzz z1">z</i><i class="zzz z2">z</i><i class="zzz z3">z</i>' +
      sprite(SLEEP, COATS.tinta, 4) +
    "</span>";
}

function init() { heroCat(); cursorCat(); sceneCats(); sleeperCat(); }

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
