/* ═══════════════════════════════════════════════════════════════
   Maquetas de producto, recreadas desde cero, datos ficticios.
   Cada una usa la paleta real de su aplicación, no la del sitio.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

function L(es, en) {
  return document.documentElement.getAttribute("data-lang") === "en" ? en : es;
}

function cap(es, en) {
  return (
    '<p class="mk-cap">' +
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg>' +
    "<span>" + L(es, en) + "</span></p>"
  );
}

function chrome(url) {
  return (
    '<div class="mk-chrome"><span class="mk-dots"><i></i><i></i><i></i></span>' +
    '<span class="mk-url">' + url + "</span></div>"
  );
}

function bars(vals, hiFrom) {
  return '<div class="mk-chart">' + vals.map(function (v, i) {
    return '<i class="' + (i >= hiFrom ? "hi" : "") + '" style="height:' + v + '%"></i>';
  }).join("") + "</div>";
}

/* ═══════════ 1. Devengo · portal de empresa + app del trabajador ═══════════ */
function payStream() {
  var rows = [
    ["MS", "Mariana Solís",   "Operaciones",  "$2,520", "ok",   L("Aprobada", "Approved")],
    ["ER", "Édgar Rentería",  "Almacén",      "$1,180", "wait", L("En revisión", "In review")],
    ["PV", "Paola Vidal",     "Atención",     "$3,040", "ok",   L("Aprobada", "Approved")],
    ["TA", "Tomás Aguirre",   "Logística",    "$860",   "no",   L("Sin saldo", "No balance")]
  ];

  return (
    '<div class="mk-stage s-paystream t-paystream reveal">' +

      '<div class="mk">' + chrome("devengo.app / portal-empresa") +
        '<div class="mk-screen">' +

          '<div class="mk-top"><div class="mk-brand">' +
            '<span class="mk-logo">DV</span>' +
            "<div><div class=\"mk-bname\">Devengo</div>" +
            '<div class="mk-bsub">' + L("Portal empresa", "Company portal") + "</div></div>" +
          "</div>" +
          '<div class="mk-tabs">' +
            '<span class="mk-tab on">' + L("Panel", "Overview") + "</span>" +
            '<span class="mk-tab">' + L("Plantilla", "People") + "</span>" +
            '<span class="mk-tab">' + L("Políticas", "Policies") + "</span>" +
          "</div></div>" +

          '<div class="mk-kpis">' +
            kpi(L("Ciclo actual", "Current cycle"), "#14", L("quincenal", "biweekly")) +
            kpi(L("Fondo disponible", "Available fund"), "$47,550", L("para adelantos", "for advances"), "pos") +
            kpi(L("Adelantado", "Advanced"), "$7,600", L("este ciclo", "this cycle")) +
            kpi(L("Por revisar", "To review"), "3", L("solicitudes", "requests"), "warn") +
          "</div>" +

          '<div class="mk-panel" style="margin-bottom:9px">' +
            '<div class="mk-ph"><b>' + L("Solicitudes del ciclo", "Cycle requests") + "</b>" +
            "<span>" + L("29 sep · corte", "Sep 29 · cutoff") + "</span></div>" +
            '<div class="mk-row mk-row-5 head"><span>' + L("Colaborador", "Team member") + "</span>" +
              "<span>" + L("Área", "Area") + "</span><span>" + L("Monto", "Amount") + "</span>" +
              "<span>" + L("Estado", "Status") + "</span><span></span></div>" +
            rows.map(function (r) {
              return '<div class="mk-row mk-row-5">' +
                '<div class="mk-who"><span class="mk-av">' + r[0] + "</span><div><b>" + r[1] + "</b>" +
                "<span>" + L("antigüedad ", "tenure ") + "18m</span></div></div>" +
                "<span>" + r[2] + "</span>" +
                '<span class="mk-num">' + r[3] + "</span>" +
                '<span><span class="mk-pill ' + r[4] + '">' + r[5] + "</span></span>" +
                '<span class="mk-btn' + (r[4] === "wait" ? "" : " ghost") + '">' +
                (r[4] === "wait" ? L("Aprobar", "Approve") : L("Ver", "View")) + "</span>" +
              "</div>";
            }).join("") +
          "</div>" +

          '<div class="mk-panel">' +
            '<div class="mk-ph"><b>' + L("Liquidez por ciclo", "Liquidity per cycle") + "</b>" +
            "<span>" + L("últimos 12", "last 12") + "</span></div>" +
            bars([38, 52, 45, 61, 48, 70, 58, 74, 66, 81, 72, 88], 9) +
          "</div>" +

        "</div>" +
      "</div>" +

      '<div class="mk-phone"><div class="mk-pscreen">' +
        '<div class="mk-notch"></div>' +
        '<div class="mk-pstatus"><span>9:41</span><span>▮▮▮ 84%</span></div>' +
        '<div class="mk-phello">' + L("Hola,", "Hi,") + "</div>" +
        '<div class="mk-pname">Mariana</div>' +
        '<div class="mk-pcard"><span>' + L("Disponible para retirar", "Available to withdraw") + "</span>" +
          "<b>$2,520</b><small>" + L("de $3,600 devengado · día 9/15", "of $3,600 accrued · day 9/15") + "</small></div>" +
        '<div class="mk-plist">' +
          '<div class="mk-pitem"><div><b>' + L("Adelanto", "Advance") + " · $1,200</b><span>12 " + L("sep", "Sep") + "</span></div>" +
            '<span class="mk-pill ok">' + L("Pagado", "Paid") + "</span></div>" +
          '<div class="mk-pitem"><div><b>' + L("Adelanto", "Advance") + " · $800</b><span>28 " + L("ago", "Aug") + "</span></div>" +
            '<span class="mk-pill ok">' + L("Pagado", "Paid") + "</span></div>" +
        "</div>" +
        '<div class="mk-pcta">' + L("Solicitar adelanto", "Request advance") + "</div>" +
        '<div class="mk-pnav"><i class="on"></i><i></i><i></i><i></i></div>' +
      "</div></div>" +

    "</div>" +
    cap("Recreación del portal de empresa y la app del trabajador, con la paleta real del producto: pizarra y esmeralda. Nombres y montos inventados.",
        "Recreation of the company portal and the worker app, using the product's real palette: slate and emerald. Names and amounts are invented.")
  );
}

/* ═══════════ 2. Paymet Bienestar ═══════════ */
function paymet() {
  var rows = [
    ["LM", "Lucía Márquez",  "$12,400", 78],
    ["RB", "Rodrigo Bernal", "$8,150",  52],
    ["CN", "Carmen Nájera",  "$19,700", 91],
    ["DF", "Diego Fuentes",  "$4,320",  27]
  ];

  return (
    '<div class="mk-stage s-paymet t-paymet reveal">' +

      '<div class="mk">' + chrome("admin.paymet.mx / bienestar") +
        /* Estructura distinta a la de Devengo a propósito: navegación lateral,
           anillo de avance y lista compacta en lugar de tabla ancha. */
        '<div class="mk-shell">' +
          '<div class="mk-side">' +
            '<div class="mk-brand"><span class="mk-logo">PB</span></div>' +
            '<span class="mk-nav on">' + L("Resumen", "Summary") + "</span>" +
            '<span class="mk-nav">' + L("Metas", "Goals") + "</span>" +
            '<span class="mk-nav">' + L("Aportaciones", "Contributions") + "</span>" +
            '<span class="mk-nav">' + L("Reportes", "Reports") + "</span>" +
          "</div>" +

          '<div class="mk-screen">' +
            '<div class="mk-head2"><b>' + L("Bienestar del equipo", "Team wellness") + "</b>" +
            "<span>" + L("trimestre actual", "current quarter") + "</span></div>" +

            '<div class="mk-split2">' +
              '<div class="mk-ringbox">' +
                ring(62) +
                '<div class="mk-ringtxt"><b>62%</b><span>' + L("meta promedio", "average goal") + "</span></div>" +
              "</div>" +
              '<div class="mk-ministack">' +
                mini(L("Colaboradores", "Members"), "128") +
                mini(L("Ahorro acumulado", "Total saved"), "$1.24M", "pos") +
                mini(L("Alertas", "Alerts"), "5", "warn") +
              "</div>" +
            "</div>" +

            '<div class="mk-goals">' +
              rows.map(function (r) {
                return '<div class="mk-goal">' +
                  '<span class="mk-av">' + r[0] + "</span>" +
                  '<div class="mk-goaltxt"><b>' + r[1] + "</b>" +
                    '<span class="mk-bar"><i style="width:' + r[3] + '%"></i>' +
                    '<i class="dim" style="width:' + (100 - r[3]) + '%"></i></span></div>' +
                  '<span class="mk-num">' + r[2] + "</span>" +
                "</div>";
              }).join("") +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      '<div class="mk-phone"><div class="mk-pscreen">' +
        '<div class="mk-notch"></div>' +
        '<div class="mk-pstatus"><span>9:41</span><span>▮▮▮ 84%</span></div>' +
        '<div class="mk-bio">' +
          '<div class="mk-ring"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 2a5 5 0 015 5v3a5 5 0 01-10 0V7a5 5 0 015-5z"/><path d="M4 15c0 4 3.6 7 8 7s8-3 8-7"/></svg></div>' +
          '<div class="mk-pname" style="margin-bottom:4px">' + L("Verificación", "Verification") + "</div>" +
          '<div class="mk-phello">' + L("Confirma tu identidad para continuar", "Confirm your identity to continue") + "</div>" +
        "</div>" +
        '<div class="mk-pcard" style="margin-top:14px"><span>' + L("Tu ahorro", "Your savings") + "</span>" +
          "<b>$12,400</b><small>" + L("78% de tu meta anual", "78% of your annual goal") + "</small></div>" +
        '<div class="mk-plist">' +
          '<div class="mk-pitem"><div><b>' + L("Aportación quincenal", "Biweekly contribution") + "</b>" +
            "<span>$650 · " + L("automática", "automatic") + "</span></div>" +
            '<span class="mk-pill ok">' + L("Activa", "Active") + "</span></div>" +
        "</div>" +
        '<div class="mk-pcta">' + L("Ver mis metas", "View my goals") + "</div>" +
        '<div class="mk-pnav"><i class="on"></i><i></i><i></i><i></i></div>' +
      "</div></div>" +

    "</div>" +
    cap("Panel administrativo y aplicación móvil, con la identidad oficial del producto: azul profundo, azul editorial y blanco piedra. Datos inventados.",
        "Admin panel and mobile app, using the product's official identity: deep blue, editorial blue and stone white. Invented data.")
  );
}

/* ═══════════ 3. Resource Management (UTEZ) · claro institucional ═══════════ */
function rms() {
  var rows = [
    ["Proyector Epson X41",  "PRY-018", "Aula B-204",   L("Prestado", "On loan"),    "wait"],
    ["Kit de robótica",      "ROB-007", "Lab. Mecatrónica", L("Disponible", "Available"), "ok"],
    ["Multímetro Fluke 117", "MUL-032", "Lab. Eléctrica", L("Prestado", "On loan"),  "wait"],
    ["Laptop Dell 5420",     "LAP-104", "Coord. Académica", L("Vencido", "Overdue"), "no"],
    ["Cámara Canon R50",     "CAM-011", "Difusión",      L("Disponible", "Available"), "ok"]
  ];

  return (
    '<div class="mk-stage solo s-rms t-rms reveal">' +
      '<div class="mk">' + chrome("recursos.utez.edu.mx / inventario") +
        '<div class="mk-screen">' +

          '<div class="mk-top"><div class="mk-brand">' +
            '<span class="mk-logo">R</span>' +
            "<div><div class=\"mk-bname\">" + L("Gestión de Recursos", "Resource Management") + "</div>" +
            '<div class="mk-bsub">' + L("Centro de desarrollo", "Development center") + "</div></div>" +
          "</div>" +
          '<div class="mk-tabs">' +
            '<span class="mk-tab on">' + L("Inventario", "Inventory") + "</span>" +
            '<span class="mk-tab">' + L("Préstamos", "Loans") + "</span>" +
            '<span class="mk-tab">' + L("Reportes", "Reports") + "</span>" +
          "</div></div>" +

          '<div class="mk-kpis">' +
            kpi(L("Recursos", "Resources"), "342", L("en catálogo", "in catalog")) +
            kpi(L("Disponibles", "Available"), "241", L("listos", "ready"), "pos") +
            kpi(L("Prestados", "On loan"), "87", L("en uso", "in use")) +
            kpi(L("Vencidos", "Overdue"), "14", L("requieren atención", "need attention"), "warn") +
          "</div>" +

          '<div class="mk-panel">' +
            '<div class="mk-ph"><b>' + L("Inventario", "Inventory") + "</b>" +
            "<span>" + L("342 registros · página 1 de 18", "342 records · page 1 of 18") + "</span></div>" +
            '<div class="mk-row mk-row-5 head"><span>' + L("Recurso", "Resource") + "</span>" +
              "<span>" + L("Ubicación", "Location") + "</span><span>" + L("Clave", "Code") + "</span>" +
              "<span>" + L("Estado", "Status") + "</span><span></span></div>" +
            rows.map(function (r) {
              return '<div class="mk-row mk-row-5">' +
                '<div class="mk-who"><span class="mk-av">' + r[1].charAt(0) + "</span>" +
                "<div><b>" + r[0] + "</b><span>" + r[1] + "</span></div></div>" +
                "<span>" + r[2] + "</span>" +
                '<span class="mk-num" style="font-size:.58rem">' + r[1] + "</span>" +
                '<span><span class="mk-pill ' + r[4] + '">' + r[3] + "</span></span>" +
                '<span class="mk-btn' + (r[4] === "no" ? "" : " ghost") + '">' +
                (r[4] === "no" ? L("Recuperar", "Recover") : L("Editar", "Edit")) + "</span>" +
              "</div>";
            }).join("") +
          "</div>" +

        "</div>" +
      "</div>" +
      cap("Interfaz clara sobre azul institucional, la paleta que usa el sistema real. El catálogo y las claves son ficticios.",
          "Light interface on institutional blue, the palette the real system uses. Catalog and codes are fictional.") +
    "</div>"
  );
}

/* Anillo de avance en SVG, para la maqueta de Paymet */
function ring(pct) {
  var r = 26, c = 2 * Math.PI * r;
  return '<svg viewBox="0 0 64 64" width="64" height="64" style="image-rendering:auto">' +
    '<circle cx="32" cy="32" r="' + r + '" fill="none" stroke="var(--mk-avbg)" stroke-width="7"/>' +
    '<circle cx="32" cy="32" r="' + r + '" fill="none" stroke="var(--mk-accent)" stroke-width="7"' +
    ' stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(1) + '"' +
    ' transform="rotate(-90 32 32)" stroke-linecap="butt"/></svg>';
}

function mini(label, value, cls) {
  return '<div class="mk-mini"><span>' + label + "</span>" +
         "<b" + (cls ? ' class="' + cls + '"' : "") + ">" + value + "</b></div>";
}

function kpi(label, value, sub, cls) {
  return '<div class="mk-kpi"><span>' + label + "</span>" +
         "<b" + (cls ? ' class="' + cls + '"' : "") + ">" + value + "</b>" +
         "<i>" + sub + "</i></div>";
}

var MAP = { paystream: payStream, paymet: paymet, rms: rms };

function mountAll() {
  document.querySelectorAll("[data-mockup]").forEach(function (el) {
    var fn = MAP[el.getAttribute("data-mockup")];
    if (!fn) return;
    el.classList.add("mk-set");
    el.innerHTML = fn();
  });
  // Las maquetas se montan después del observador inicial: reobservar.
  if (window.__observeReveals) window.__observeReveals();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}
document.addEventListener("langchange", mountAll);

})();
