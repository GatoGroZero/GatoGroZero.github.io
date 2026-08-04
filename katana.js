/* ═══════════════════════════════════════════════════════════════
   Katana como cursor. Sigue al puntero con un retraso suave y
   corta al hacer clic. Se apaga con el botón de efectos, en
   pantallas táctiles y con prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

var host = document.getElementById("katana");
if (!host) return;

var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
var touch = window.matchMedia("(hover: none)").matches;
if (touch) return;

function off() {
  return document.documentElement.classList.contains("no-cats") || mqReduce.matches;
}

/* La hoja: filo claro, tsuba dorada y mango trenzado */
host.innerHTML =
  '<svg class="kat" viewBox="0 0 120 120" width="82" height="82" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g transform="rotate(-45 60 60)">' +
      /* hoja */
      '<path d="M60 8 L66 16 L66 74 L60 80 L54 74 L54 16 Z" fill="#e8e4d8"/>' +
      '<path d="M60 8 L66 16 L66 74 L61 74 L61 14 Z" fill="#fffdf6"/>' +
      '<path d="M54 20 L54 72" stroke="#b9b3a4" stroke-width="1" fill="none"/>' +
      /* habaki */
      '<rect x="53" y="76" width="14" height="5" fill="#c9a15c"/>' +
      /* tsuba */
      '<ellipse cx="60" cy="85" rx="13" ry="4.5" fill="#c9a15c"/>' +
      '<ellipse cx="60" cy="84" rx="13" ry="4.5" fill="#a67d43"/>' +
      /* mango */
      '<rect x="55" y="88" width="10" height="26" rx="2" fill="#2a2320"/>' +
      '<path d="M55 92 L65 96 M65 92 L55 96 M55 100 L65 104 M65 100 L55 104 M55 108 L65 112 M65 108 L55 112" ' +
        'stroke="#8c6a4a" stroke-width="1.4" fill="none"/>' +
      '<rect x="54" y="112" width="12" height="3" fill="#c9a15c"/>' +
    "</g>" +
  "</svg>";

var hoja = host.querySelector(".kat");

var mx = -200, my = -200, cx = mx, cy = my, raf = null;

document.addEventListener("mousemove", function (e) {
  mx = e.clientX; my = e.clientY;
  if (off()) return;
  host.classList.add("visible");
  if (!raf) raf = requestAnimationFrame(paso);
}, { passive: true });

document.addEventListener("mouseleave", function () { host.classList.remove("visible"); });

function paso() {
  cx += (mx - cx) * 0.22;
  cy += (my - cy) * 0.22;
  host.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
  if (Math.abs(mx - cx) > 0.4 || Math.abs(my - cy) > 0.4) raf = requestAnimationFrame(paso);
  else raf = null;
}

/* El corte: la hoja gira y deja una estela en diagonal */
var cortando = false;
document.addEventListener("click", function (e) {
  if (off() || cortando) return;
  cortando = true;

  hoja.classList.add("corte");

  var estela = document.createElement("span");
  estela.className = "tajo";
  estela.style.left = e.clientX + "px";
  estela.style.top = e.clientY + "px";
  document.body.appendChild(estela);

  /* Pétalos que salen del impacto */
  for (var i = 0; i < 5; i++) {
    var p = document.createElement("i");
    p.className = "chispa";
    p.style.left = e.clientX + "px";
    p.style.top = e.clientY + "px";
    p.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
    p.style.setProperty("--dy", (Math.random() * 90 + 30).toFixed(0) + "px");
    p.style.animationDelay = (i * 30) + "ms";
    document.body.appendChild(p);
    (function (n) { setTimeout(function () { n.remove(); }, 900); })(p);
  }

  setTimeout(function () { estela.remove(); }, 520);
  setTimeout(function () { hoja.classList.remove("corte"); cortando = false; }, 460);
}, true);

})();
