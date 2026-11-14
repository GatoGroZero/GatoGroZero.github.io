/* ═══════════════════════════════════════════════════════════════
   Selector de modos del caso CyberGrid.
   Mejora progresiva: sin JavaScript los cuatro modos se ven apilados;
   con JavaScript es un conjunto de pestañas accesibles (flechas, Inicio y Fin).
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

document.querySelectorAll("[data-modos]").forEach(function (raiz) {
  var tabs = Array.prototype.slice.call(raiz.querySelectorAll('[role="tab"]'));
  var paneles = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
  if (!tabs.length || paneles.some(function (p) { return !p; })) return;

  function elegir(i, enfocar) {
    tabs.forEach(function (t, j) {
      var activa = j === i;
      t.setAttribute("aria-selected", String(activa));
      t.tabIndex = activa ? 0 : -1;
      paneles[j].hidden = !activa;
    });
    if (enfocar) tabs[i].focus();
  }

  raiz.classList.add("es-js");
  elegir(0, false);

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { elegir(i, false); });
    t.addEventListener("keydown", function (e) {
      var n = tabs.length, destino = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") destino = (i + 1) % n;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") destino = (i - 1 + n) % n;
      else if (e.key === "Home") destino = 0;
      else if (e.key === "End") destino = n - 1;
      if (destino === null) return;
      e.preventDefault();
      elegir(destino, true);
    });
  });
});

})();
