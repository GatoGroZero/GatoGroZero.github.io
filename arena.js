/* ═══════════════════════════════════════════════════════════════
   Demo del juego CyberGrid: servidor autoritativo.
   Una miniatura escrita para esta página con la misma idea del juego:
   el cliente solo manda su intención, predice con la misma función que
   el servidor y reconcilia cuando llega la respuesta. El servidor tiene
   la última palabra sobre posición, colisiones y vida.
   El texto va en pares data-es / data-en que el CSS del sitio muestra u
   oculta, así cambiar de idioma no reinicia la partida.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var root = document.querySelector('[data-demo="arena"]');
if (!root) return;

var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function bi(es, en) { return "<span data-es>" + es + "</span><span data-en>" + en + "</span>"; }
function lang() { return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "es"; }

/* ───────────────────────── El mundo ───────────────────────── */

var TILE = 16, COLS = 24, ROWS = 15, W = TILE * COLS, H = TILE * ROWS;
var DT = 1 / 30;                        // el servidor avanza 30 pasos por segundo
var VEL = 5;                            // casillas por segundo
var MEDIO_W = 5, MEDIO_H = 4;           // media caja del gato, en px
var CENTRO = { x: W / 2, y: H / 2 };
var R_INI = 232, R_FIN = 44;            // radio de la zona segura al inicio y al final
var SEG_OLA = 60, DANO = 7;             // la ola cierra en 60 s; vida por segundo en el agua
var INICIO = { x: 40, y: 120 };
var MUROS = [[4, 3, 4, 3], [15, 2, 5, 3], [9, 8, 3, 4], [17, 9, 4, 3], [2, 11, 3, 2]].map(function (m) {
  return { x: m[0] * TILE, y: m[1] * TILE, w: m[2] * TILE, h: m[3] * TILE };
});
var ESQUINAS = [{ x: 24, y: 24 }, { x: 360, y: 24 }, { x: 24, y: 216 }, { x: 360, y: 216 }];

/* Una predicción honesta repite exactamente lo que hará el servidor (mismo código, mismo orden),
   así que su error es 0. Cualquier diferencia mayor a una décima de casilla es una corrección. */
var UMBRAL_ERR = 0.1;

var GATO = [".#.....#.", ".#i...i#.", "#########", "#e##d##e#", "###wnw###", ".#######.", "..#...#.."];
var PAL = { "#": "#e8863a", d: "#c96a22", i: "#f4a6b8", e: "#2a1a12", n: "#e86a86", w: "#fff3df" };
/* El campo usa la paleta real del juego (pasto, agua, madera), como las maquetas del sitio usan la de su producto */
var COLOR = {
  pasto: ["#3c7c36", "#3f8139"], mata: "#5aa04a", agua: "#2b7fd0", olaTrazo: "#78bdf0", espuma: "#fff3df",
  muro: "#b88a58", muroSombra: "#8c6238", techo: "#c23b2e", techoSombra: "#8f241b", puerta: "#5a3a1e",
  contorno: "#2a1a12", trampa: "#ffd45e", vida: "#e0405a", marco: "#fff3df"
};

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function dist(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }

function choca(x, y) {
  if (x - MEDIO_W < 0 || x + MEDIO_W > W || y - MEDIO_H < 0 || y + MEDIO_H > H) return true;
  for (var i = 0; i < MUROS.length; i++) {
    var m = MUROS[i];
    if (x + MEDIO_W > m.x && x - MEDIO_W < m.x + m.w && y + MEDIO_H > m.y && y - MEDIO_H < m.y + m.h) return true;
  }
  return false;
}

/* La misma función mueve al gato en el cliente (predicción) y en el servidor (verdad).
   Las opciones "veloz" y "atraviesa" solo existen en un cliente trucado. */
function mover(e, dx, dy, dt, o) {
  var len = Math.sqrt(dx * dx + dy * dy);
  if (len > 1) { dx /= len; dy /= len; }
  var v = VEL * TILE * dt * (o.veloz ? 5 : 1);
  var nx = e.x + dx * v, ny = e.y + dy * v;
  if (o.atraviesa) {
    e.x = clamp(nx, MEDIO_W, W - MEDIO_W);
    e.y = clamp(ny, MEDIO_H, H - MEDIO_H);
    return;
  }
  if (!choca(nx, e.y)) e.x = nx;
  if (!choca(e.x, ny)) e.y = ny;
}

function radio(zt) { return R_INI + (R_FIN - R_INI) * Math.min(zt / SEG_OLA, 1); }
function enAgua(e, zt) { return dist(e, CENTRO) > radio(zt); }

/* ───────────────────────── Estado ───────────────────────── */

var S, C, enRedAlServidor, enRedAlCliente, tickN, tiempo;
var lat = 0.16;                         // retraso de red en segundos
var teclas = {}, pad = {};
var bitacora = [], bitacoraSucia = true;
var veredicto, veredictoHasta, ultimaTrampa;
var ultimoLogIntencion = "", ultimoLogT = 0;

var BASE_VEREDICTO = {
  es: "Tu cliente predice y el servidor confirma: los dos paneles coinciden, salvo por el retraso de la red.",
  en: "Your client predicts and the server confirms: both panes match, except for network delay.",
  rej: false
};

function reiniciar() {
  S = { x: INICIO.x, y: INICIO.y, ax: INICIO.x, ay: INICIO.y, hp: 100, ultimaSeq: 0, zonaT: 0,
        muerto: false, rechazados: 0, marcas: [], aguaAvisada: false };
  C = { x: INICIO.x, y: INICIO.y, ax: INICIO.x, ay: INICIO.y, hp: 100, seq: 0, pend: [], zonaT: 0, tpSeq: 0,
        muerto: false, correcciones: 0, ultimaCorr: -9999, maxErr: 0, maxLejos: 0, ultimaCorrHp: -9999,
        hacks: { veloz: false, atraviesa: false, vida: false } };
  enRedAlServidor = []; enRedAlCliente = [];
  ultimoAtServidor = 0; ultimoAtCliente = 0;
  tickN = 0; tiempo = 0;
  bitacora = []; bitacoraSucia = true;
  veredicto = BASE_VEREDICTO; veredictoHasta = 0; ultimaTrampa = "";
  ultimoLogIntencion = ""; ultimoLogT = 0;
  if (ui) { actualizaHacks(); actualizaOver(); }
}

/* ───────────────────────── Bitácora de red y veredicto ───────────────────────── */

function anota(tipo, tagEs, tagEn, es, en) {
  var ahora = performance.now();
  var ult = bitacora[bitacora.length - 1];
  if (ult && ult.es === es && ult.en === en && ahora - ult.t < 1800) { ult.n++; ult.t = ahora; }
  else {
    bitacora.push({ tick: tickN, tipo: tipo, tagEs: tagEs, tagEn: tagEn, es: es, en: en, n: 1, t: ahora, nueva: true });
    if (bitacora.length > 7) bitacora.shift();
  }
  bitacoraSucia = true;
}

var MUERTE = {
  es: "La ola te alcanzó. El daño lo calcula el servidor: ningún cliente puede negarlo.",
  en: "The wave got you. Damage is computed by the server: no client can deny it.",
  rej: true
};

/* Un aviso reciente manda; después, el veredicto describe el estado de ahora: eliminado, trampa activa o todo en orden */
function veredictoActual() {
  if (performance.now() < veredictoHasta) return veredicto;
  if (S.muerto) return MUERTE;
  var id = C.hacks[ultimaTrampa] ? ultimaTrampa : ["veloz", "atraviesa", "vida"].filter(function (k) { return C.hacks[k]; })[0];
  if (id) return { es: DICHOS[id][0], en: DICHOS[id][1], rej: true };
  return BASE_VEREDICTO;
}

function dice(es, en, rej, ms) {
  veredicto = { es: es, en: en, rej: !!rej };
  veredictoHasta = performance.now() + (ms || 6500);
}

/* ───────────────────────── Red simulada ───────────────────────── */

var ultimoAtServidor = 0, ultimoAtCliente = 0;
function enviarAlServidor(msg) {
  ultimoAtServidor = msg.at = Math.max(ultimoAtServidor, tiempo + lat);
  enRedAlServidor.push(msg);
}
function enviarAlCliente(msg) {
  ultimoAtCliente = msg.at = Math.max(ultimoAtCliente, tiempo + lat);
  enRedAlCliente.push(msg);
}

/* ───────────────────────── Un paso de simulación ───────────────────────── */

function intencion() {
  var dx = (teclas.der || pad.der ? 1 : 0) - (teclas.izq || pad.izq ? 1 : 0);
  var dy = (teclas.abajo || pad.abajo ? 1 : 0) - (teclas.arriba || pad.arriba ? 1 : 0);
  return { dx: dx, dy: dy };
}

function opcionesCliente() { return { veloz: C.hacks.veloz, atraviesa: C.hacks.atraviesa }; }

function paso() {
  tiempo += DT; tickN++;
  S.ax = S.x; S.ay = S.y; C.ax = C.x; C.ay = C.y;

  /* Cliente: lee el teclado, predice y manda solo su intención */
  if (!C.muerto) {
    var dir = intencion();
    var inp = { seq: ++C.seq, dx: dir.dx, dy: dir.dy };
    mover(C, inp.dx, inp.dy, DT, opcionesCliente());
    C.pend.push(inp);
    enviarAlServidor({ tipo: "input", seq: inp.seq, dx: inp.dx, dy: inp.dy });
    anotaIntencion(dir);
    if (C.hacks.vida && tickN % 30 === 0) enviarAlServidor({ tipo: "hp", valor: 100 });
  }

  /* Servidor: procesa lo que ya llegó */
  while (enRedAlServidor.length && enRedAlServidor[0].at <= tiempo) {
    var m = enRedAlServidor.shift();
    if (m.tipo === "input") {
      if (!S.muerto) mover(S, m.dx, m.dy, DT, {});
      S.ultimaSeq = m.seq;
    } else if (m.tipo === "pos") {
      S.rechazados++;
      S.marcas.push({ x: m.x, y: m.y, t: performance.now() });
      anota("rej", "rechaza", "rejects",
        "posición (" + Math.round(m.x / TILE) + ", " + Math.round(m.y / TILE) + "): el servidor solo acepta intención, nunca posiciones",
        "position (" + Math.round(m.x / TILE) + ", " + Math.round(m.y / TILE) + "): the server only accepts intent, never positions");
    } else if (m.tipo === "hp") {
      S.rechazados++;
      anota("rej", "rechaza", "rejects",
        "vida = " + m.valor + ": la vida la calcula el servidor, no la manda el cliente",
        "health = " + m.valor + ": health is computed by the server, not sent by the client");
    }
  }

  /* Servidor: la ola cierra el mapa y descuenta vida */
  if (!S.muerto) {
    if (!reducido) S.zonaT += DT;
    if (enAgua(S, S.zonaT)) {
      if (!S.aguaAvisada) {
        S.aguaAvisada = true;
        anota("ola", "ola", "wave", "estás en el agua: el servidor te quita vida", "you are in the water: the server takes health");
      }
      S.hp -= DANO * DT;
      if (S.hp <= 0) {
        S.hp = 0; S.muerto = true;
        anota("rej", "rechaza", "rejects", "eliminado por la ola: decisión del servidor", "eliminated by the wave: the server's call");
        dice("La ola te alcanzó. El daño lo calcula el servidor: ningún cliente puede negarlo.",
             "The wave got you. Damage is computed by the server: no client can deny it.", true, 9000);
      }
    } else S.aguaAvisada = false;
  }
  enviarAlCliente({ x: S.x, y: S.y, hp: Math.ceil(S.hp), ultimaSeq: S.ultimaSeq, zonaT: S.zonaT, muerto: S.muerto });

  /* Cliente: recibe la confirmación y reconcilia */
  while (enRedAlCliente.length && enRedAlCliente[0].at <= tiempo) reconciliar(enRedAlCliente.shift());

  if (dist(C, { x: C.ax, y: C.ay }) > 3 * TILE) { C.ax = C.x; C.ay = C.y; }
  if (dist(S, { x: S.ax, y: S.ay }) > 3 * TILE) { S.ax = S.x; S.ay = S.y; }
  S.marcas = S.marcas.filter(function (k) { return performance.now() - k.t < 1600; });
}

function anotaIntencion(dir) {
  var clave = dir.dx + "," + dir.dy;
  var ahora = performance.now();
  if (clave === ultimoLogIntencion || ahora - ultimoLogT < 140) return;
  ultimoLogIntencion = clave; ultimoLogT = ahora;
  anota("env", "envía", "sends", "intención (" + dir.dx + ", " + dir.dy + ")", "intent (" + dir.dx + ", " + dir.dy + ")");
}

function reconciliar(snap) {
  if (snap.ultimaSeq < C.tpSeq) {
    /* Respuesta vieja, anterior al teletransporte: el cliente trucado todavía no sabe que el
       servidor lo rechazó, así que sigue creyendo su posición falsa durante un viaje de ida y vuelta. */
    C.zonaT = snap.zonaT;
    return;
  }
  var antes = { x: C.x, y: C.y };
  C.x = snap.x; C.y = snap.y;
  C.pend = C.pend.filter(function (i) { return i.seq > snap.ultimaSeq; });
  var o = opcionesCliente();
  C.pend.forEach(function (i) { mover(C, i.dx, i.dy, DT, o); });
  var err = dist(antes, C) / TILE;        // cuánto se equivocó la predicción
  var lejos = dist(antes, S) / TILE;      // cuánto creía estar de donde de verdad está

  var hpAntes = C.hacks.vida ? 100 : C.hp;
  C.hp = snap.hp; C.zonaT = snap.zonaT;
  if (snap.muerto && !C.muerto) { C.muerto = true; C.pend = []; actualizaOver(); }

  var ahora = performance.now();
  C.maxErr = Math.max(C.maxErr, err);
  if (err > UMBRAL_ERR) C.maxLejos = Math.max(C.maxLejos, lejos);
  if (C.maxErr > UMBRAL_ERR && ahora - C.ultimaCorr > 700) {
    C.correcciones++; C.ultimaCorr = ahora;
    anota("cor", "corrige", "corrects",
      "el servidor te devuelve a su posición: tu cliente creía estar a " + C.maxLejos.toFixed(1) + " casillas de ella",
      "the server puts you back at its position: your client believed it was " + C.maxLejos.toFixed(1) + " tiles away from it");
    C.maxErr = 0; C.maxLejos = 0;
    destella();
  } else if (ahora - C.ultimaCorr > 700) C.maxErr = Math.min(C.maxErr, UMBRAL_ERR);
  if (C.hacks.vida && !C.muerto && hpAntes - snap.hp > 3 && ahora - C.ultimaCorrHp > 1500) {
    C.ultimaCorrHp = ahora; C.correcciones++;
    anota("cor", "corrige", "corrects",
      "vida real según el servidor: " + snap.hp + " (tu cliente mostraba " + hpAntes + ")",
      "real health according to the server: " + snap.hp + " (your client showed " + hpAntes + ")");
  }
}

/* ───────────────────────── Dibujo ───────────────────────── */

function pintaGato(ctx, x, y, contorno, anda) {
  var ox = Math.round(x) - 9, oy = Math.round(y) - 7 - (anda && !reducido ? Math.floor(performance.now() / 130) % 2 : 0);
  function dibuja(dx, dy, color) {
    for (var r = 0; r < GATO.length; r++) for (var c = 0; c < 9; c++) {
      var ch = GATO[r].charAt(c);
      if (ch === ".") continue;
      ctx.fillStyle = color || PAL[ch];
      ctx.fillRect(ox + dx + c * 2, oy + dy + r * 2, 2, 2);
    }
  }
  var c = contorno ? COLOR.trampa : COLOR.contorno;
  dibuja(2, 0, c); dibuja(-2, 0, c); dibuja(0, 2, c); dibuja(0, -2, c);
  ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(ox + 3, oy + 16, 12, 2);
  dibuja(0, 0, null);
}

function escena(ctx, e, zt, hp, alpha, contorno, marcas) {
  var r = radio(zt), r2 = r * r;
  var ola = reducido ? 0 : Math.floor(performance.now() / 260);
  for (var ty = 0; ty < ROWS; ty++) for (var tx = 0; tx < COLS; tx++) {
    var cx = tx * TILE + 8 - CENTRO.x, cy = ty * TILE + 8 - CENTRO.y, px = tx * TILE, py = ty * TILE;
    if (cx * cx + cy * cy > r2) {
      ctx.fillStyle = COLOR.agua; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = COLOR.olaTrazo;
      var d = (ola + tx + ty) % 4;
      ctx.fillRect(px + 1 + d * 2, py + 5, 6, 1);
      ctx.fillRect(px + 7 - d * 2 + 4, py + 11, 5, 1);
    } else {
      ctx.fillStyle = COLOR.pasto[(tx + ty) % 2]; ctx.fillRect(px, py, TILE, TILE);
      if ((tx * 7 + ty * 13) % 9 === 0) { ctx.fillStyle = COLOR.mata; ctx.fillRect(px + 5, py + 6, 2, 3); ctx.fillRect(px + 9, py + 9, 2, 2); }
    }
  }
  ctx.strokeStyle = COLOR.espuma; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.arc(CENTRO.x, CENTRO.y, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);

  MUROS.forEach(function (m) {
    ctx.fillStyle = COLOR.muro; ctx.fillRect(m.x, m.y, m.w, m.h);
    ctx.fillStyle = COLOR.muroSombra; ctx.fillRect(m.x, m.y + m.h - 3, m.w, 3);
    ctx.fillStyle = COLOR.techo; ctx.fillRect(m.x - 1, m.y, m.w + 2, 6);
    ctx.fillStyle = COLOR.techoSombra; ctx.fillRect(m.x - 1, m.y + 6, m.w + 2, 1);
    ctx.fillStyle = COLOR.puerta; ctx.fillRect(m.x + m.w / 2 - 3, m.y + m.h - 9, 6, 9);
  });

  var vx = e.ax + (e.x - e.ax) * alpha, vy = e.ay + (e.y - e.ay) * alpha;
  pintaGato(ctx, vx, vy, contorno, Math.abs(e.x - e.ax) + Math.abs(e.y - e.ay) > 0.01);

  if (marcas) marcas.forEach(function (k) {
    var edad = (performance.now() - k.t) / 1600;
    ctx.globalAlpha = Math.max(0, 1 - edad);
    [["#fff3df", 4], ["#d10018", 2]].forEach(function (c) {
      ctx.strokeStyle = c[0]; ctx.lineWidth = c[1];
      ctx.beginPath(); ctx.moveTo(k.x - 6, k.y - 6); ctx.lineTo(k.x + 6, k.y + 6);
      ctx.moveTo(k.x + 6, k.y - 6); ctx.lineTo(k.x - 6, k.y + 6); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = "rgba(24,24,30,.9)"; ctx.fillRect(4, 4, 70, 12);
  ctx.strokeStyle = COLOR.marco; ctx.lineWidth = 1; ctx.strokeRect(5.5, 5.5, 67, 9);
  ctx.fillStyle = COLOR.vida;
  ctx.fillRect(7, 7, Math.round(64 * clamp(hp, 0, 100) / 100), 6);
}

function dibuja(alpha) {
  var hacks = C.hacks, hpMostrado = C.muerto ? 0 : hacks.vida ? 100 : C.hp;
  escena(ui.cvC, C, C.zonaT, hpMostrado, alpha, hacks.veloz || hacks.atraviesa || hacks.vida, null);
  escena(ui.cvS, S, S.zonaT, Math.ceil(S.hp), alpha, false, S.marcas);
}

/* ───────────────────────── Interfaz ───────────────────────── */

var ui = null;

var FLECHAS = {
  up: '<path d="M12 6l7 11H5z"/>', down: '<path d="M12 18L5 7h14z"/>',
  left: '<path d="M6 12l11-7v14z"/>', right: '<path d="M18 12L7 19V5z"/>'
};
function tecla(dir, es, en) {
  return '<button type="button" class="arena-key" data-dir="' + dir + '" data-l-es="' + es + '" data-l-en="' + en +
         '"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + FLECHAS[dir] + "</svg></button>";
}
function trampa(id, es, en, unaVez) {
  return '<button type="button" class="arena-hack' + (unaVez ? " arena-hack-once" : "") + '" data-hack="' + id + '"' +
         (unaVez ? "" : ' aria-pressed="false"') + ">" + bi(es, en) + "</button>";
}
function numero(id, es, en, subEs, subEn) {
  return '<div class="num" data-num="' + id + '"><span>' + bi(es, en) + '</span><b>0</b><small>' + bi(subEs, subEn) + "</small></div>";
}

function montar() {
  root.classList.add("demo");
  root.innerHTML =
    '<div class="demo-bar"><div class="demo-dots"><i></i><i></i><i></i></div>' +
      '<span class="demo-title">' + bi("Servidor autoritativo", "Authoritative server") + "</span>" +
      '<button class="demo-reset" type="button" data-reiniciar>' + bi("Reiniciar", "Reset") + "</button>" +
      '<span class="demo-live">' + bi("interactivo", "interactive") + "</span></div>" +
    '<div class="demo-body">' +
      '<p class="arena-intro">' + bi(
        "Es el Battle Royale en miniatura. A la izquierda está tu cliente, que predice sin esperar al servidor. A la derecha, lo que el servidor sabe de verdad y lo que ven los demás jugadores. Mueve al gato, quédate dentro del círculo (el agua de afuera quita vida) y luego intenta mentirle al servidor.",
        "This is the Battle Royale in miniature. On the left is your client, which predicts without waiting for the server. On the right, what the server really knows and what the other players see. Move the cat, stay inside the circle (the water outside takes health), then try to lie to the server.") + "</p>" +
      '<div class="arena-panes">' +
        '<section class="arena-pane" data-pane="c"><div class="arena-pane-h"><b>' + bi("Tu cliente", "Your client") + "</b><small>" + bi("lo que tú ves", "what you see") + "</small></div>" +
          '<div class="arena-stage" tabindex="0" role="group" data-l-es="Campo de juego de tu cliente. Mueve al gato con WASD o las flechas." data-l-en="Your client\'s play field. Move the cat with WASD or the arrow keys.">' +
            '<canvas width="' + W + '" height="' + H + '" aria-hidden="true"></canvas>' +
            '<div class="arena-hint">' + bi("Haz clic aquí y usa WASD o las flechas", "Click here and use WASD or the arrow keys") + "</div>" +
            '<div class="arena-over" hidden>' + bi("El servidor dice que estás eliminado", "The server says you are eliminated") + "</div>" +
          "</div></section>" +
        '<section class="arena-pane arena-pane-srv"><div class="arena-pane-h"><b>' + bi("El servidor", "The server") + "</b><small>" + bi("lo que ven los demás", "what everyone else sees") + "</small></div>" +
          '<div class="arena-stage" role="img" data-l-es="Campo de juego del servidor, con la posición real del gato." data-l-en="The server\'s play field, with the cat\'s real position.">' +
            '<canvas width="' + W + '" height="' + H + '" aria-hidden="true"></canvas>' +
            '<div class="arena-over" hidden>' + bi("Eliminado por la ola", "Eliminated by the wave") + "</div>" +
          "</div></section>" +
      "</div>" +
      '<div class="arena-controls">' +
        "<div><span class=\"arena-lab\">" + bi("Mover", "Move") + "</span>" +
          '<div class="arena-pad">' + tecla("up", "Arriba", "Up") + tecla("left", "Izquierda", "Left") + tecla("down", "Abajo", "Down") + tecla("right", "Derecha", "Right") + "</div></div>" +
        '<div class="arena-right">' +
          '<div class="arena-lat slider-row"><div class="slider-top"><label for="arenaLat">' + bi("Retraso de red", "Network delay") + '</label><b data-lat>160 ms</b></div>' +
            '<input type="range" id="arenaLat" min="40" max="400" step="10" value="160"></div>' +
          "<div><span class=\"arena-lab\">" + bi("Trampas (solo en tu cliente)", "Cheats (your client only)") + "</span>" +
            '<div class="arena-hacks">' +
              trampa("teleport", "Teletransportarme", "Teleport me", true) +
              trampa("veloz", "Correr ×5", "Run ×5") +
              trampa("atraviesa", "Atravesar muros", "Walk through walls") +
              trampa("vida", "Vida infinita", "Infinite health") +
              (reducido ? '<button type="button" class="arena-btn" data-ola>' + bi("Cerrar la ola un paso", "Close the wave one step") + "</button>" : "") +
            "</div></div>" +
        "</div>" +
      "</div>" +
      '<div class="arena-low">' +
        '<div class="arena-console" role="log" aria-live="off"><span class="arena-console-t">' + bi("Lo que viaja por la red", "What travels over the network") + '</span><div data-bitacora></div></div>' +
        '<div class="nums arena-nums">' +
          numero("tick", "Pasos del servidor", "Server steps", "30 por segundo", "30 per second") +
          numero("rech", "Mensajes rechazados", "Rejected messages", "los falsos nunca entran", "fake ones never get in") +
          numero("corr", "Correcciones", "Corrections", "veces que te devolvió", "times it sent you back") +
          numero("desf", "Desfase", "Offset", "casillas entre los dos gatos", "tiles between the two cats") +
        "</div>" +
      "</div>" +
      '<p class="arena-verdict" aria-live="polite" data-veredicto></p>' +
      '<p class="demo-cap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg><span>' + bi(
        "Es una miniatura escrita para esta página con la misma idea del juego, no su código: el cliente predice con la misma función que el servidor y el servidor tiene la última palabra. El juego real y su servidor están en el repositorio.",
        "A miniature written for this page with the same idea as the game, not its code: the client predicts with the same function as the server and the server has the last word. The real game and its server are in the repository.") + "</span></p>" +
    "</div>";

  var stages = root.querySelectorAll(".arena-stage");
  ui = {
    cvC: root.querySelectorAll("canvas")[0].getContext("2d"),
    cvS: root.querySelectorAll("canvas")[1].getContext("2d"),
    stage: stages[0],
    paneC: root.querySelector('[data-pane="c"]'),
    overC: stages[0].querySelector(".arena-over"),
    overS: stages[1].querySelector(".arena-over"),
    bit: root.querySelector("[data-bitacora]"),
    ver: root.querySelector("[data-veredicto]"),
    lat: root.querySelector("[data-lat]"),
    nums: {}
  };
  ["tick", "rech", "corr", "desf"].forEach(function (k) { ui.nums[k] = root.querySelector('[data-num="' + k + '"]'); });
  pone18n();
}

function pone18n() {
  var l = lang();
  root.querySelectorAll("[data-l-es]").forEach(function (el) {
    var texto = el.getAttribute("data-l-" + l);
    if (el.classList.contains("arena-key") || el.classList.contains("arena-stage")) el.setAttribute("aria-label", texto);
  });
}

var destelloT = 0;
function destella() {
  if (!ui) return;
  ui.paneC.classList.add("is-corrected");
  clearTimeout(destelloT);
  destelloT = setTimeout(function () { ui.paneC.classList.remove("is-corrected"); }, 300);
}

function actualizaOver() {
  if (!ui) return;
  ui.overC.hidden = !C.muerto;
  ui.overS.hidden = !S.muerto;
}
function actualizaHacks() {
  root.querySelectorAll("[data-hack]").forEach(function (b) {
    var id = b.getAttribute("data-hack");
    if (id !== "teleport") b.setAttribute("aria-pressed", String(!!C.hacks[id]));
  });
  var tramposo = C.hacks.veloz || C.hacks.atraviesa || C.hacks.vida;
  ui.paneC.classList.toggle("is-cheating", tramposo);
}

/* Las cadenas de la bitácora son internas (textos fijos y números calculados aquí): nada del usuario entra en el HTML. */
function pintaBitacora() {
  var html = bitacora.map(function (b) {
    var n = b.n > 1 ? " ×" + b.n : "";
    var nueva = b.nueva ? " is-new" : "";
    b.nueva = false;
    return '<div class="arena-ln arena-ln-' + b.tipo + nueva + '"><i>#' + b.tick + "</i><b>" + bi(b.tagEs, b.tagEn) + "</b><span>" +
           bi(b.es + n, b.en + n) + "</span></div>";
  }).join("");
  ui.bit.innerHTML = html;
  bitacoraSucia = false;
}

function pintaNumeros() {
  var d = dist(C, S) / TILE;
  function pon(k, v, clase) {
    var n = ui.nums[k]; n.querySelector("b").textContent = v;
    n.classList.remove("ok", "warn", "bad"); if (clase) n.classList.add(clase);
  }
  pon("tick", tickN);
  pon("rech", S.rechazados, S.rechazados ? "bad" : "");
  pon("corr", C.correcciones, C.correcciones ? "warn" : "");
  pon("desf", d.toFixed(1), d < 1.2 ? "ok" : d < 2.6 ? "warn" : "bad");
  var v = veredictoActual(), clave = v.es + (v.rej ? "!" : "");
  if (ui.ver.getAttribute("data-k") !== clave) {
    ui.ver.setAttribute("data-k", clave);
    ui.ver.innerHTML = bi(v.es, v.en);
    ui.ver.classList.toggle("is-rej", v.rej);
    ui.ver.classList.remove("is-swap"); void ui.ver.offsetWidth; ui.ver.classList.add("is-swap");
  }
}

/* ───────────────────────── Eventos ───────────────────────── */

var MAPA_TECLAS = {
  arrowup: "arriba", w: "arriba", arrowdown: "abajo", s: "abajo",
  arrowleft: "izq", a: "izq", arrowright: "der", d: "der"
};
var DIR_PAD = { up: "arriba", down: "abajo", left: "izq", right: "der" };

function teletransporta() {
  if (C.muerto) return;
  var mejor = ESQUINAS.slice().sort(function (a, b) { return dist(b, C) - dist(a, C); })[0];
  C.x = mejor.x; C.y = mejor.y; C.ax = C.x; C.ay = C.y; C.tpSeq = C.seq + 1;
  enviarAlServidor({ tipo: "pos", x: mejor.x, y: mejor.y });
  var p = "(" + Math.round(mejor.x / TILE) + ", " + Math.round(mejor.y / TILE) + ")";
  anota("tu", "tú", "you", "mi cliente dice: estoy en " + p, "my client says: I am at " + p);
  dice("Dijiste que estabas en otro lugar. El servidor lo descartó: solo cree en la intención (hacia dónde empujas), nunca en la posición. En un instante tu cliente vuelve adonde de verdad estás.",
       "You claimed to be somewhere else. The server discarded it: it only believes intent (where you push), never position. In a moment your client returns to where you really are.", true, 7000);
}

var DICHOS = {
  veloz: ["Tu cliente cree que corre cinco veces más rápido. El servidor mueve al gato a su velocidad real y, con cada respuesta, te devuelve a su posición.",
          "Your client thinks it runs five times faster. The server moves the cat at its real speed and, with every reply, puts you back at its position."],
  atraviesa: ["Tu cliente atraviesa los muros. El servidor sigue chocando con ellos, así que el gato de la derecha se queda en la pared y a ti te corrige.",
              "Your client walks through walls. The server keeps colliding with them, so the cat on the right stays at the wall and you get corrected."],
  vida: ["Tu cliente muestra 100 de vida. Métete al agua y compara los dos paneles: el servidor sigue descontando, y su número es el que cuenta.",
         "Your client shows 100 health. Step into the water and compare both panes: the server keeps deducting, and its number is the one that counts."]
};
var NOMBRES = {
  veloz: ["correr ×5", "run ×5"], atraviesa: ["atravesar muros", "walk through walls"], vida: ["vida infinita", "infinite health"]
};

function alternaTrampa(id) {
  C.hacks[id] = !C.hacks[id];
  actualizaHacks();
  if (C.hacks[id]) {
    anota("tu", "tú", "you", "trampa activada: " + NOMBRES[id][0], "cheat on: " + NOMBRES[id][1]);
    ultimaTrampa = id;
    dice(DICHOS[id][0], DICHOS[id][1], true, 6500);
    if (id === "vida" && !C.muerto) enviarAlServidor({ tipo: "hp", valor: 100 });
  } else {
    anota("tu", "tú", "you", "trampa apagada: " + NOMBRES[id][0], "cheat off: " + NOMBRES[id][1]);
  }
}

function enlaza() {
  ui.stage.addEventListener("keydown", function (e) {
    var d = MAPA_TECLAS[(e.key || "").toLowerCase()];
    if (!d) return;
    teclas[d] = true; ui.stage.classList.add("is-play"); e.preventDefault();
  });
  ui.stage.addEventListener("keyup", function (e) {
    var d = MAPA_TECLAS[(e.key || "").toLowerCase()];
    if (d) { teclas[d] = false; e.preventDefault(); }
  });
  ui.stage.addEventListener("blur", function () { teclas = {}; ui.stage.classList.remove("is-play"); });

  root.querySelectorAll(".arena-key").forEach(function (b) {
    var d = DIR_PAD[b.getAttribute("data-dir")];
    function suelta() { pad[d] = false; b.classList.remove("is-down"); }
    b.addEventListener("pointerdown", function (e) {
      e.preventDefault(); pad[d] = true; b.classList.add("is-down");
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
    });
    b.addEventListener("pointerup", suelta);
    b.addEventListener("pointercancel", suelta);
    b.addEventListener("lostpointercapture", suelta);
    b.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { pad[d] = true; b.classList.add("is-down"); e.preventDefault(); } });
    b.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") suelta(); });
    b.addEventListener("blur", suelta);
  });

  root.querySelectorAll("[data-hack]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-hack");
      if (id === "teleport") teletransporta(); else alternaTrampa(id);
    });
  });
  var deslizador = root.querySelector("#arenaLat");
  deslizador.addEventListener("input", function () { setLat(+deslizador.value); });
  var ola = root.querySelector("[data-ola]");
  if (ola) ola.addEventListener("click", function () { S.zonaT = Math.min(S.zonaT + 6, SEG_OLA); });
  root.querySelector("[data-reiniciar]").addEventListener("click", function () { reiniciar(); });
  document.addEventListener("langchange", pone18n);
}

function setLat(ms) {
  lat = ms / 1000;
  ui.lat.textContent = ms + " ms";
}

/* ───────────────────────── Bucle ───────────────────────── */

var corriendo = false, ultimoTs = 0, acum = 0, ultimaUI = 0;

function cuadro(ts) {
  if (!corriendo) return;
  var dt = Math.min(0.1, (ts - ultimoTs) / 1000); ultimoTs = ts; acum += dt;
  while (acum >= DT) { paso(); acum -= DT; }
  dibuja(acum / DT);
  if (ts - ultimaUI > 100) {
    ultimaUI = ts;
    pintaNumeros(); actualizaOver();
    if (bitacoraSucia) pintaBitacora();
  }
  requestAnimationFrame(cuadro);
}
function arranca() {
  if (corriendo || document.hidden) return;
  corriendo = true; ultimoTs = performance.now(); requestAnimationFrame(cuadro);
}
function detiene() { corriendo = false; }

function iniciar() {
  montar();
  reiniciar();
  enlaza();
  dibuja(0); pintaNumeros(); pintaBitacora();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es[0].isIntersecting ? arranca() : detiene(); }, { threshold: 0.05 }).observe(root);
  } else arranca();
  document.addEventListener("visibilitychange", function () { document.hidden ? detiene() : arranca(); });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();

})();
