/* ═══════════════════════════════════════════════════════════════
   Demos interactivas · Luis Ángel Castelar
   Reconstrucciones limpias, con datos ficticios. Sin código de cliente.
   ═══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

/* ── i18n helper: L("español", "english") ── */
function L(es, en) {
  return document.documentElement.getAttribute("data-lang") === "en" ? en : es;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
var money = function (n) {
  return "$" + Math.round(n).toLocaleString("es-MX");
};

/* Shared chrome for every demo panel */
function chrome(title, opts) {
  opts = opts || {};
  return (
    '<div class="demo-bar">' +
      '<div class="demo-dots"><i></i><i></i><i></i></div>' +
      '<span class="demo-title">' + title + "</span>" +
      (opts.reset ? '<button class="demo-reset" data-reset>' + L("Reiniciar", "Reset") + "</button>" : "") +
      '<span class="demo-live">' + L("interactivo", "interactive") + "</span>" +
    "</div>"
  );
}
function caption(es, en) {
  return (
    '<p class="demo-cap">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg>' +
      "<span>" + L(es, en) + "</span>" +
    "</p>"
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO 1 · Flujo de solicitudes con control por rol
   ═══════════════════════════════════════════════════════════════ */
var Flow = (function () {
  var ROLES = [
    { id: "estudiante", n_es: "Estudiante", n_en: "Student",   who: "Ana Ríos",       sec: "ROLE_ESTUDIANTE" },
    { id: "asesor",     n_es: "Asesor",     n_en: "Advisor",   who: "Dr. Peña",       sec: "ROLE_ASESOR" },
    { id: "admin",      n_es: "Dirección",  n_en: "Director",  who: "Mtra. Ocampo",   sec: "ROLE_ADMIN" },
    { id: "servicios",  n_es: "Servicios",  n_en: "Services",  who: "J. Medina",      sec: "ROLE_SERVICIOS" }
  ];

  var STATES = {
    ENVIADA:         { c: "b-enviada",    es: "Enviada",             en: "Submitted" },
    REVISION_ASESOR: { c: "b-revision",   es: "En revisión",         en: "Under review" },
    VALIDADA_ASESOR: { c: "b-validada",   es: "Validada por asesor", en: "Advisor-validated" },
    APROBADA:        { c: "b-aprobada",   es: "Aprobada y firmada",  en: "Approved & signed" },
    EN_PROCESO:      { c: "b-proceso",    es: "En proceso",          en: "In progress" },
    COMPLETADA:      { c: "b-completada", es: "Completada",          en: "Completed" },
    RECHAZADA:       { c: "b-rechazada",  es: "Rechazada",           en: "Rejected" }
  };

  /* The transition table IS the business rule */
  var ACTIONS = [
    { id:"tomar",     role:"asesor",     from:["ENVIADA"],         to:"REVISION_ASESOR", es:"Tomar en revisión",         en:"Take for review" },
    { id:"validar",   role:"asesor",     from:["REVISION_ASESOR"], to:"VALIDADA_ASESOR", es:"Validar y enviar a dirección", en:"Validate & send to director" },
    { id:"rech_ase",  role:"asesor",     from:["REVISION_ASESOR"], to:"RECHAZADA",       es:"Rechazar",                  en:"Reject", danger:true },
    { id:"aprobar",   role:"admin",      from:["VALIDADA_ASESOR"], to:"APROBADA",        es:"Aprobar y firmar",          en:"Approve & sign" },
    { id:"rech_adm",  role:"admin",      from:["VALIDADA_ASESOR"], to:"RECHAZADA",       es:"Rechazar",                  en:"Reject", danger:true },
    { id:"asignar",   role:"servicios",  from:["APROBADA"],        to:"EN_PROCESO",      es:"Asignar cuadrilla",         en:"Assign crew" },
    { id:"completar", role:"servicios",  from:["EN_PROCESO"],      to:"COMPLETADA",      es:"Marcar como completada",    en:"Mark completed" },
    { id:"reenviar",  role:"estudiante", from:["RECHAZADA"],       to:"ENVIADA",         es:"Corregir y reenviar",       en:"Fix & resubmit" }
  ];

  var SERVICIOS = [
    { id:"mant", es:"Mantenimiento de aula",   en:"Classroom maintenance" },
    { id:"equip",es:"Préstamo de equipo",      en:"Equipment loan" },
    { id:"lab",  es:"Acceso a laboratorio",    en:"Laboratory access" },
    { id:"trans",es:"Transporte institucional",en:"Institutional transport" }
  ];

  var st, seq;

  function seed() {
    seq = 3;
    st = {
      role: "estudiante",
      sel: 1,
      creating: false,
      err: "",
      reqs: [
        { id:1, folio:"SOL-2026-0148", svc:"mant",
          desc_es:"El proyector del aula B-204 no enciende. Se requiere revisión antes del periodo de exámenes.",
          desc_en:"The projector in room B-204 won't turn on. Needs review before the exam period.",
          by:"Ana Ríos", estado:"ENVIADA",
          hist:[{ e:"ENVIADA", r:"estudiante", who:"Ana Ríos", t:"09:14", n_es:"Solicitud creada y enviada", n_en:"Request created and submitted" }] },
        { id:2, folio:"SOL-2026-0147", svc:"equip",
          desc_es:"Préstamo de dos multímetros para la práctica de circuitos del 12 al 14 de marzo.",
          desc_en:"Loan of two multimeters for the circuits lab from March 12–14.",
          by:"Ana Ríos", estado:"VALIDADA_ASESOR",
          hist:[
            { e:"VALIDADA_ASESOR", r:"asesor", who:"Dr. Peña", t:"11:02", n_es:"Validada: el material está disponible en inventario", n_en:"Validated: material available in inventory" },
            { e:"REVISION_ASESOR", r:"asesor", who:"Dr. Peña", t:"10:47", n_es:"Tomada en revisión", n_en:"Taken for review" },
            { e:"ENVIADA", r:"estudiante", who:"Ana Ríos", t:"08:30", n_es:"Solicitud creada y enviada", n_en:"Request created and submitted" }
          ] }
      ]
    };
  }
  seed();

  function svcName(id) {
    var s = SERVICIOS.filter(function (x) { return x.id === id; })[0];
    return s ? L(s.es, s.en) : id;
  }
  function roleOf(id) { return ROLES.filter(function (r) { return r.id === id; })[0]; }
  function cur() { return st.reqs.filter(function (r) { return r.id === st.sel; })[0]; }
  function now() {
    var d = new Date();
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  function allowed(req) {
    if (!req) return [];
    return ACTIONS.filter(function (a) {
      return a.role === st.role && a.from.indexOf(req.estado) !== -1;
    });
  }
  /* Actions some OTHER role could take right now, powers the "denied" message */
  function pending(req) {
    if (!req) return [];
    return ACTIONS.filter(function (a) { return a.from.indexOf(req.estado) !== -1; });
  }

  function render(root) {
    var r = cur();
    var acts = allowed(r);
    var role = roleOf(st.role);

    var html = chrome(L("Flujo de solicitudes · 4 roles", "Request workflow · 4 roles"), { reset: true });

    /* role tabs */
    html += '<div class="roles">';
    ROLES.forEach(function (x) {
      html += '<button class="role-btn' + (x.id === st.role ? " on" : "") + '" data-role="' + x.id + '">' +
                "<b>" + L(x.n_es, x.n_en) + "</b><span>" + x.sec + "</span></button>";
    });
    html += "</div>";

    html += '<div class="split"><div class="split-l">';
    html += '<p class="pane-h">' + L("Solicitudes", "Requests") + " · " + st.reqs.length + "</p>";

    st.reqs.forEach(function (q) {
      var s = STATES[q.estado];
      html += '<button class="req' + (q.id === st.sel ? " on" : "") + '" data-sel="' + q.id + '">' +
                '<span class="req-folio">' + q.folio + "</span>" +
                '<span class="req-svc">' + esc(svcName(q.svc)) + "</span>" +
                '<span class="badge ' + s.c + '">' + L(s.es, s.en) + "</span>" +
              "</button>";
    });

    if (st.role === "estudiante") {
      html += '<button class="act act-ghost" data-new style="width:100%;margin-top:8px">+ ' +
              L("Nueva solicitud", "New request") + "</button>";
    }
    html += "</div>";

    /* ── right pane ── */
    html += '<div class="split-r">';

    if (st.creating) {
      html += '<p class="pane-h">' + L("Nueva solicitud", "New request") + "</p>";
      html += '<div class="nform">';
      html += '<div class="field"><label>' + L("Servicio", "Service") + '</label><select id="f-svc">';
      SERVICIOS.forEach(function (s) { html += '<option value="' + s.id + '">' + L(s.es, s.en) + "</option>"; });
      html += "</select></div>";
      html += '<div class="field"><label>' + L("Descripción", "Description") + "</label>" +
              '<textarea id="f-desc" placeholder="' + L("Describe el problema o la necesidad…", "Describe the problem or need…") + '"></textarea></div>';
      if (st.err) html += '<p class="err">' + esc(st.err) + "</p>";
      html += '<div class="acts"><button class="act" data-save>' + L("Enviar solicitud", "Submit request") + "</button>" +
              '<button class="act act-ghost" data-cancel>' + L("Cancelar", "Cancel") + "</button></div>";
      html += "</div>";
    } else if (!r) {
      html += '<p class="det-sub">' + L("Selecciona una solicitud.", "Select a request.") + "</p>";
    } else {
      var s = STATES[r.estado];
      html += '<div class="det-top"><div><div class="det-h">' + esc(svcName(r.svc)) + "</div>" +
              '<div class="det-sub">' + r.folio + " · " + esc(r.by) + "</div></div>" +
              '<span class="badge ' + s.c + '">' + L(s.es, s.en) + "</span></div>";
      html += '<div class="det-desc">' + esc(L(r.desc_es, r.desc_en)) + "</div>";

      if (acts.length) {
        html += '<p class="pane-h">' + L("Acciones disponibles para " + L(role.n_es, role.n_en), "Actions available to " + role.n_en) + "</p>";
        html += '<div class="acts">';
        acts.forEach(function (a) {
          html += '<button class="act' + (a.danger ? " act-danger" : "") + '" data-act="' + a.id + '">' + L(a.es, a.en) + "</button>";
        });
        html += "</div>";
      } else {
        var pend = pending(r);
        var whoNext = pend.length ? L(roleOf(pend[0].role).n_es, roleOf(pend[0].role).n_en) : null;
        html += '<div class="denied">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex:none;margin-top:2px"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>' +
          "<span>" +
          (whoNext
            ? L("El rol <b>" + role.n_es + "</b> no puede actuar sobre esta solicitud en el estado <b>" + s.es + "</b>. El siguiente paso le corresponde a <b>" + whoNext + "</b>.",
                "Role <b>" + role.n_en + "</b> cannot act on this request in state <b>" + s.en + "</b>. The next step belongs to <b>" + whoNext + "</b>.")
            : L("Esta solicitud llegó al final de su flujo. Ningún rol puede modificarla, solo consultarla.",
                "This request reached the end of its workflow. No role can modify it, only read it.")) +
          "<br><code>403 Forbidden</code> " +
          L("es lo que devolvería la API si se intentara de todos modos.", "is what the API would return if attempted anyway.") +
          "</span></div>";
      }

      /* Acuse genérico. A propósito NO imita membrete, firma ni sello de
         ninguna institución: solo confirma que la aprobación quedó registrada. */
      if (["APROBADA", "EN_PROCESO", "COMPLETADA"].indexOf(r.estado) !== -1) {
        var firma = r.hist.filter(function (h) { return h.e === "APROBADA"; })[0];
        html += '<div class="acuse">' +
          '<div class="acuse-h">' + L("Acuse de aprobación", "Approval receipt") + "</div>" +
          '<div class="doc-row"><span>' + L("Folio", "Ref.") + "</span><span>" + r.folio + "</span></div>" +
          '<div class="doc-row"><span>' + L("Servicio", "Service") + "</span><span>" + esc(svcName(r.svc)) + "</span></div>" +
          '<div class="doc-row"><span>' + L("Autorizó", "Approved by") + "</span><span>" +
            (firma ? esc(firma.who) + " · " + firma.t : L("Pendiente", "Pending")) + "</span></div>" +
          '<p class="acuse-n">' + L("Ejemplo ilustrativo. El documento real lo define cada institución.",
                                     "Illustrative example. The real document is defined by each institution.") + "</p>" +
          "</div>";
      }

      /* audit trail */
      html += '<div class="audit"><p class="pane-h">' + L("Historial de auditoría", "Audit trail") + " · " + r.hist.length + "</p><ul class=\"audit-l\">";
      r.hist.forEach(function (h) {
        var hs = STATES[h.e];
        html += "<li><span class=\"audit-dot\"></span><span class=\"audit-txt\">" +
                '<span class="audit-main">' + esc(L(h.n_es, h.n_en)) + "</span>" +
                '<span class="audit-meta">' + L(hs.es, hs.en).toUpperCase() + " · " + esc(h.who) + " · " + h.t + "</span>" +
                "</span></li>";
      });
      html += "</ul></div>";
    }

    html += "</div></div>";

    html += caption(
      "Prototipo con nombres y datos inventados. No reproduce el flujo de ningún sistema real, sino la forma en que diseño un proceso por pasos con permisos.",
      "Prototype with invented names and data. It does not reproduce any real system's flow, just how I design a step-based process with permissions."
    );

    root.innerHTML = html;
    bind(root);
  }

  function bind(root) {
    root.querySelectorAll("[data-role]").forEach(function (b) {
      b.onclick = function () { st.role = b.dataset.role; st.creating = false; render(root); };
    });
    root.querySelectorAll("[data-sel]").forEach(function (b) {
      b.onclick = function () { st.sel = +b.dataset.sel; st.creating = false; render(root); };
    });
    var nb = root.querySelector("[data-new]");
    if (nb) nb.onclick = function () { st.creating = true; st.err = ""; render(root); };
    var cb = root.querySelector("[data-cancel]");
    if (cb) cb.onclick = function () { st.creating = false; st.err = ""; render(root); };

    var sb = root.querySelector("[data-save]");
    if (sb) sb.onclick = function () {
      var svc = root.querySelector("#f-svc").value;
      var d = root.querySelector("#f-desc").value.trim();
      if (d.length < 15) {
        st.err = L("La descripción debe tener al menos 15 caracteres, validación del lado del servidor.",
                   "Description must be at least 15 characters, server-side validation.");
        return render(root);
      }
      seq++;
      var id = seq;
      st.reqs.unshift({
        id: id, folio: "SOL-2026-0" + (148 + id), svc: svc,
        desc_es: d, desc_en: d, by: "Ana Ríos", estado: "ENVIADA",
        hist: [{ e:"ENVIADA", r:"estudiante", who:"Ana Ríos", t: now(),
                 n_es:"Solicitud creada y enviada", n_en:"Request created and submitted" }]
      });
      st.sel = id; st.creating = false; st.err = "";
      render(root);
    };

    root.querySelectorAll("[data-act]").forEach(function (b) {
      b.onclick = function () {
        var a = ACTIONS.filter(function (x) { return x.id === b.dataset.act; })[0];
        var r = cur();
        /* re-check server-side style: role AND state must both permit */
        if (!a || a.role !== st.role || a.from.indexOf(r.estado) === -1) return;
        var who = roleOf(st.role).who;
        r.estado = a.to;
        r.hist.unshift({ e: a.to, r: st.role, who: who, t: now(), n_es: a.es, n_en: a.en });
        render(root);
      };
    });

    var rb = root.querySelector("[data-reset]");
    if (rb) rb.onclick = function () { seed(); render(root); };
  }

  return { render: render };
})();

/* ═══════════════════════════════════════════════════════════════
   DEMO 2 · Motor de salario devengado
   ═══════════════════════════════════════════════════════════════ */
var Engine = (function () {
  var st = { salario: 12000, dia: 9, antig: 14, retirado: 0, msg: "" };

  /* Tenure tiers → max % of accrued wage withdrawable */
  var TIERS = [
    { min: 0,  max: 5,   pct: 0.30, es: "Menos de 6 meses",  en: "Under 6 months" },
    { min: 6,  max: 11,  pct: 0.50, es: "6 a 11 meses",      en: "6 to 11 months" },
    { min: 12, max: 23,  pct: 0.70, es: "1 a 2 años",        en: "1 to 2 years" },
    { min: 24, max: 999, pct: 0.80, es: "Más de 2 años",     en: "Over 2 years" }
  ];
  var CICLO = 15;      // quincenal
  var COMISION = 25;   // cuota fija por retiro
  var MIN_RETIRO = 200;

  function tier() {
    for (var i = 0; i < TIERS.length; i++)
      if (st.antig >= TIERS[i].min && st.antig <= TIERS[i].max) return TIERS[i];
    return TIERS[0];
  }
  function calc() {
    var t = tier();
    var diario = st.salario / 30;
    var devengado = diario * st.dia;
    var techo = devengado * t.pct;
    var disponible = Math.max(0, techo - st.retirado);
    return { t:t, diario:diario, devengado:devengado, techo:techo, disponible:disponible };
  }

  function render(root) {
    var c = calc();
    var pctRet  = c.devengado ? (st.retirado / c.devengado) * 100 : 0;
    var pctDisp = c.devengado ? (c.disponible / c.devengado) * 100 : 0;
    var pctBloq = Math.max(0, 100 - pctRet - pctDisp);
    var puede = c.disponible >= MIN_RETIRO;

    var html = chrome(L("Motor de salario devengado", "Earned wage engine"), { reset: true });
    html += '<div class="demo-body"><div class="eng">';

    /* controls */
    html += '<div class="ctrl">';
    html += slider("salario", L("Salario mensual", "Monthly salary"), money(st.salario), 4000, 45000, 500, st.salario);
    html += slider("dia", L("Día del ciclo quincenal", "Day of pay cycle"), st.dia + " / " + CICLO, 1, CICLO, 1, st.dia);
    html += slider("antig", L("Antigüedad", "Tenure"), st.antig + L(" meses", " months"), 0, 48, 1, st.antig);
    html += '<div class="tier">' + L("Nivel", "Tier") + ": <b>" + L(c.t.es, c.t.en) + "</b><br>" +
            L("Puede retirar hasta el ", "May withdraw up to ") + "<b>" + Math.round(c.t.pct * 100) + "%</b>" +
            L(" de lo devengado.", " of accrued wages.") + "</div>";
    html += "</div>";

    /* output */
    html += '<div class="out">';
    html += '<div class="bar-wrap"><div class="bar">' +
              '<i class="bar-retirado" style="width:' + pctRet + '%"></i>' +
              '<i class="bar-disp" style="width:' + pctDisp + '%"></i>' +
              '<i class="bar-bloq" style="width:' + pctBloq + '%"></i>' +
            "</div>" +
            '<div class="legend">' +
              '<div><i class="bar-retirado"></i>' + L("Ya retirado", "Withdrawn") + " " + money(st.retirado) + "</div>" +
              '<div><i class="bar-disp"></i>' + L("Disponible ahora", "Available now") + " " + money(c.disponible) + "</div>" +
              '<div><i class="bar-bloq"></i>' + L("Retenido por política", "Held by policy") + " " + money(c.devengado - c.techo) + "</div>" +
            "</div></div>";

    html += '<div class="nums">' +
      num(L("Devengado hoy", "Accrued today"), money(c.devengado), L("día ", "day ") + st.dia + "/" + CICLO) +
      num(L("Techo por política", "Policy ceiling"), money(c.techo), Math.round(c.t.pct * 100) + "% " + L("del devengado", "of accrued")) +
      num(L("Disponible", "Available"), money(c.disponible), L("menos lo ya retirado", "less prior withdrawals"), true) +
      num(L("Salario diario", "Daily wage"), money(c.diario), L("base de cálculo", "calculation base")) +
    "</div>";

    html += '<div class="calcline">' +
      L("salarioDiario", "dailyWage") + "   = " + money(st.salario) + " / 30            → <b>" + money(c.diario) + "</b>\n" +
      L("devengado", "accrued") + "      = " + money(c.diario) + " × " + st.dia + L(" días", " days") + "   → <b>" + money(c.devengado) + "</b>\n" +
      L("techoPolitica", "policyCeiling") + "  = " + money(c.devengado) + " × " + c.t.pct.toFixed(2) + "     → <b>" + money(c.techo) + "</b>\n" +
      L("disponible", "available") + "     = " + money(c.techo) + " − " + money(st.retirado) + L(" retirado", " withdrawn") + "  → <b>" + money(c.disponible) + "</b>" +
    "</div>";

    html += '<div class="rules">' +
      rule(c.disponible >= MIN_RETIRO, L("El monto disponible alcanza el mínimo de retiro (" + money(MIN_RETIRO) + ")",
                                          "Available amount meets the " + money(MIN_RETIRO) + " minimum")) +
      rule(st.antig >= 0 && c.t.pct > 0, L("El trabajador cumple la antigüedad mínima para el programa",
                                            "Worker meets minimum tenure for the program")) +
      rule(st.retirado < c.techo, L("No ha agotado su techo de retiro del ciclo",
                                     "Has not exhausted the cycle withdrawal ceiling")) +
    "</div>";

    html += '<div class="acts">' +
      '<button class="act" data-retirar' + (puede ? "" : " disabled style=\"opacity:.4;cursor:not-allowed\"") + ">" +
      L("Solicitar adelanto", "Request advance") + (puede ? " · " + money(c.disponible) : "") + "</button>" +
      (st.retirado > 0 ? '<button class="act act-ghost" data-nuevociclo>' + L("Nuevo ciclo de nómina", "New payroll cycle") + "</button>" : "") +
    "</div>";

    if (st.msg) html += '<div class="denied"><span>' + st.msg + "</span></div>";

    html += "</div></div>";

    html += caption(
      "Las reglas (niveles por antigüedad, techo por política, comisión fija y monto mínimo) son las mismas que modelé para la plataforma fintech. Los montos son ilustrativos.",
      "The rules (tenure tiers, policy ceiling, flat fee and minimum amount) mirror what I modeled for the fintech platform. Amounts are illustrative."
    );
    html += "</div>";

    root.innerHTML = html;
    bind(root);
  }

  function slider(k, label, val, min, max, step, v) {
    return '<div class="slider-row"><div class="slider-top"><label>' + label + "</label><b>" + val + "</b></div>" +
           '<input type="range" data-k="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '"></div>';
  }
  function num(k, v, sub, hl) {
    return '<div class="num' + (hl ? " hl" : "") + '"><span>' + k + "</span><b>" + v + "</b><small>" + sub + "</small></div>";
  }
  function rule(ok, txt) {
    return '<div class="rule ' + (ok ? "pass" : "fail") + '"><i></i><span>' + txt + "</span></div>";
  }

  function bind(root) {
    root.querySelectorAll("input[type=range]").forEach(function (i) {
      i.oninput = function () { st[i.dataset.k] = +i.value; st.msg = ""; render(root); };
    });
    var rb = root.querySelector("[data-retirar]");
    if (rb) rb.onclick = function () {
      var c = calc();
      if (c.disponible < MIN_RETIRO) return;
      st.retirado += c.disponible;
      st.msg = L("Adelanto de " + money(c.disponible) + " autorizado. Comisión fija: " + money(COMISION) +
                 ". Se descontará del pago de la quincena.",
                 "Advance of " + money(c.disponible) + " authorized. Flat fee: " + money(COMISION) +
                 ". It will be deducted from the next payroll.");
      render(root);
    };
    var nc = root.querySelector("[data-nuevociclo]");
    if (nc) nc.onclick = function () {
      st.retirado = 0; st.dia = 1;
      st.msg = L("Ciclo cerrado. El contador de retiros vuelve a cero y el devengado empieza de nuevo.",
                 "Cycle closed. Withdrawal counter resets and accrual starts over.");
      render(root);
    };
    var rs = root.querySelector("[data-reset]");
    if (rs) rs.onclick = function () {
      st = { salario: 12000, dia: 9, antig: 14, retirado: 0, msg: "" };
      render(root);
    };
  }

  return { render: render };
})();

/* ═══════════════════════════════════════════════════════════════
   DEMO 3 · Control de acceso por roles
   ═══════════════════════════════════════════════════════════════ */
var Rbac = (function () {
  var ROLES = ["ESTUDIANTE", "ASESOR", "ADMIN", "SERVICIOS"];

  var EPS = [
    { v:"GET",    p:"/api/solicitudes/mias",              allow:["ESTUDIANTE","ASESOR","ADMIN","SERVICIOS"],
      ann:'@PreAuthorize("isAuthenticated()")',
      body:{ total:2, items:"[…]" } },
    { v:"POST",   p:"/api/solicitudes",                   allow:["ESTUDIANTE"],
      ann:'@PreAuthorize("hasRole(\'ESTUDIANTE\')")',
      body:{ folio:"SOL-2026-0149", estado:"ENVIADA" } },
    { v:"GET",    p:"/api/asesor/solicitudes",            allow:["ASESOR"],
      ann:'@PreAuthorize("hasRole(\'ASESOR\')")',
      body:{ asignadas:7, pendientes:3 } },
    { v:"PUT",    p:"/api/asesor/solicitudes/{id}/validar",allow:["ASESOR"],
      ann:'@PreAuthorize("hasRole(\'ASESOR\')")',
      body:{ estado:"VALIDADA_ASESOR" } },
    { v:"PUT",    p:"/api/admin/solicitudes/{id}/aprobar", allow:["ADMIN"],
      ann:'@PreAuthorize("hasRole(\'ADMIN\')")',
      body:{ estado:"APROBADA", firma:"registrada" } },
    { v:"GET",    p:"/api/admin/reportes/mensual.xlsx",   allow:["ADMIN"],
      ann:'@PreAuthorize("hasRole(\'ADMIN\')")',
      body:{ archivo:"reporte-2026-03.xlsx", filas:184 } },
    { v:"POST",   p:"/api/admin/usuarios",                allow:["ADMIN"],
      ann:'@PreAuthorize("hasRole(\'ADMIN\')")',
      body:{ id:41, rol:"ASESOR" } },
    { v:"PUT",    p:"/api/servicios/solicitudes/{id}/asignar", allow:["SERVICIOS"],
      ann:'@PreAuthorize("hasRole(\'SERVICIOS\')")',
      body:{ estado:"EN_PROCESO", cuadrilla:"C-02" } },
    { v:"DELETE", p:"/api/admin/solicitudes/{id}",        allow:["ADMIN"],
      ann:'@PreAuthorize("hasRole(\'ADMIN\')")',
      body:{ eliminada:true } }
  ];

  var st = { role: "ESTUDIANTE", sel: 0 };

  function json(o, ind) {
    ind = ind || "  ";
    var ks = Object.keys(o);
    return "{\n" + ks.map(function (k) {
      var v = o[k];
      var vs = typeof v === "number" ? '<span class="n">' + v + "</span>"
             : typeof v === "boolean" ? '<span class="n">' + v + "</span>"
             : v === "[…]" ? '<span class="s">[…]</span>'
             : '<span class="s">"' + esc(v) + '"</span>';
      return ind + '<span class="k">"' + k + '"</span>: ' + vs;
    }).join(",\n") + "\n}";
  }

  function render(root) {
    var ep = EPS[st.sel];
    var ok = ep.allow.indexOf(st.role) !== -1;

    var html = chrome(L("Control de acceso por roles", "Role-based access control"));

    html += '<div class="roles">';
    ROLES.forEach(function (r) {
      html += '<button class="role-btn' + (r === st.role ? " on" : "") + '" data-r="' + r + '">' +
              "<b>" + r.charAt(0) + r.slice(1).toLowerCase() + "</b><span>ROLE_" + r + "</span></button>";
    });
    html += "</div>";

    html += '<div class="demo-body"><div class="rbac">';

    html += '<div><p class="pane-h">' + L("Endpoints de la API", "API endpoints") + "</p><div class=\"ep-list\">";
    EPS.forEach(function (e, i) {
      html += '<button class="ep' + (i === st.sel ? " on" : "") + '" data-ep="' + i + '">' +
                '<span class="verb v-' + e.v + '">' + e.v + "</span>" +
                '<span class="ep-path">' + e.p + "</span></button>";
    });
    html += "</div></div>";

    html += '<div class="term">' +
      '<div class="term-h"><span>' + ep.v + " " + ep.p + "</span>" +
      '<span class="status s-' + (ok ? "200" : "403") + '">' + (ok ? "200 OK" : "403 Forbidden") + "</span></div>" +
      '<div class="term-b">' +
        (ok ? json(ep.body)
            : json({ timestamp:"2026-03-14T10:22:41Z", status:403, error:"Forbidden",
                     message:"Access Denied", path: ep.p })) +
      "</div>" +
      '<div class="term-why">' +
        (ok
          ? L("El rol <b>ROLE_" + st.role + "</b> está autorizado. Spring Security valida la anotación antes de que el método del controlador siquiera se ejecute.",
              "Role <b>ROLE_" + st.role + "</b> is authorized. Spring Security checks the annotation before the controller method even runs.")
          : L("El rol <b>ROLE_" + st.role + "</b> no está en la lista permitida (" +
              ep.allow.map(function(a){return "ROLE_"+a;}).join(", ") + "). La petición se rechaza en el filtro de seguridad, antes de tocar la base de datos.",
              "Role <b>ROLE_" + st.role + "</b> is not permitted (" +
              ep.allow.map(function(a){return "ROLE_"+a;}).join(", ") + "). The request is rejected in the security filter, before touching the database.")) +
        "<code>" + esc(ep.ann) + "</code>" +
      "</div></div>";

    html += "</div>";
    html += caption(
      "Esto es lo que quiero decir con «autorización en el servidor». La interfaz puede ocultar un botón, pero la decisión real vive aquí: cada endpoint declara quién puede llamarlo.",
      "This is what I mean by \"authorization on the server\". The UI can hide a button, but the real decision lives here: every endpoint declares who may call it."
    );
    html += "</div>";

    root.innerHTML = html;
    root.querySelectorAll("[data-r]").forEach(function (b) {
      b.onclick = function () { st.role = b.dataset.r; render(root); };
    });
    root.querySelectorAll("[data-ep]").forEach(function (b) {
      b.onclick = function () { st.sel = +b.dataset.ep; render(root); };
    });
  }

  return { render: render };
})();

/* ═══════════════════════════════════════════════════════════════
   DEMO 4 · Modelador entidad-relación
   ═══════════════════════════════════════════════════════════════ */
var ER = (function () {
  var T = {
    rol: { x:20, y:20, cols:[
      ["id","BIGINT",1],["nombre","VARCHAR(40)"],["descripcion","VARCHAR(120)"]],
      idx:"PRIMARY KEY (id)\nUNIQUE KEY uk_rol_nombre (nombre)",
      note_es:"Catálogo pequeño y estable. Se consulta una vez por sesión y se cachea.",
      note_en:"Small, stable catalog. Read once per session and cached." },

    usuario: { x:20, y:150, cols:[
      ["id","BIGINT",1],["matricula","VARCHAR(15)"],["nombre","VARCHAR(120)"],
      ["correo","VARCHAR(120)"],["rol_id","BIGINT"],["activo","BOOLEAN"]],
      idx:"PRIMARY KEY (id)\nUNIQUE KEY uk_usuario_correo (correo)\nUNIQUE KEY uk_usuario_matricula (matricula)\nKEY idx_usuario_rol (rol_id)",
      note_es:"El correo es único, y el índice lo garantiza en la base, no solo en el formulario.",
      note_en:"Email is unique, and the index enforces it in the database, not just in the form." },

    servicio: { x:290, y:20, cols:[
      ["id","BIGINT",1],["nombre","VARCHAR(80)"],["area","VARCHAR(60)"],["activo","BOOLEAN"]],
      idx:"PRIMARY KEY (id)\nKEY idx_servicio_area (area)",
      note_es:"Catálogo de servicios ofertados. Se filtra por área en el formulario de creación.",
      note_en:"Catalog of offered services. Filtered by area in the creation form." },

    solicitud: { x:290, y:150, cols:[
      ["id","BIGINT",1],["folio","VARCHAR(20)"],["usuario_id","BIGINT"],["servicio_id","BIGINT"],
      ["descripcion","TEXT"],["estado","VARCHAR(24)"],["creada_en","DATETIME"],["actualizada_en","DATETIME"]],
      idx:"PRIMARY KEY (id)\nUNIQUE KEY uk_solicitud_folio (folio)\nKEY idx_sol_usuario_estado (usuario_id, estado)\nKEY idx_sol_estado_fecha (estado, creada_en DESC)",
      note_es:"La tabla que más crece y más se consulta. El índice compuesto (estado, creada_en) sirve a la pantalla más visitada: «solicitudes pendientes, más recientes primero». El orden de las columnas en el índice importa, al revés no se usaría.",
      note_en:"The table that grows and is queried most. The composite index (estado, creada_en) serves the most visited screen: \"pending requests, newest first\". Column order in the index matters: reversed, it would go unused." },

    historial_estado: { x:560, y:20, cols:[
      ["id","BIGINT",1],["solicitud_id","BIGINT"],["estado","VARCHAR(24)"],
      ["actor_id","BIGINT"],["nota","VARCHAR(255)"],["ocurrio_en","DATETIME"]],
      idx:"PRIMARY KEY (id)\nKEY idx_hist_solicitud (solicitud_id, ocurrio_en DESC)",
      note_es:"Append-only: nunca se actualiza ni se borra una fila. Es lo que hace auditable el sistema, porque se puede reconstruir quién hizo qué y cuándo.",
      note_en:"Append-only: rows are never updated or deleted. This is what makes the system auditable, because you can reconstruct who did what, and when." },

    firma_solicitud: { x:560, y:175, cols:[
      ["id","BIGINT",1],["solicitud_id","BIGINT"],["firmante_id","BIGINT"],
      ["firmada_en","DATETIME"]],
      idx:"PRIMARY KEY (id)\nUNIQUE KEY uk_firma_solicitud (solicitud_id)",
      note_es:"Cada aprobación queda ligada a una sola solicitud. La llave única impide que se registre dos veces.",
      note_en:"Each approval is tied to a single request. The unique key prevents recording it twice." },

    notificacion: { x:560, y:300, cols:[
      ["id","BIGINT",1],["usuario_id","BIGINT"],["solicitud_id","BIGINT"],
      ["mensaje","VARCHAR(255)"],["leida","BOOLEAN"],["creada_en","DATETIME"]],
      idx:"PRIMARY KEY (id)\nKEY idx_notif_usuario_leida (usuario_id, leida)",
      note_es:"El índice (usuario_id, leida) resuelve el contador de «no leídas» del encabezado, que se pide en cada carga de página.",
      note_en:"The (usuario_id, leida) index answers the header's \"unread\" counter, requested on every page load." },

    asignacion_asesor: { x:20, y:340, cols:[
      ["usuario_id","BIGINT",1],["asesor_id","BIGINT",1],["asignada_en","DATETIME"]],
      idx:"PRIMARY KEY (usuario_id, asesor_id)\nKEY idx_asig_asesor (asesor_id)",
      note_es:"Llave primaria compuesta: la pareja estudiante–asesor es única por definición, así que no necesita una columna id artificial.",
      note_en:"Composite primary key: the student–advisor pair is unique by definition, so no artificial id column is needed." }
  };

  var REL = [
    ["usuario","rol_id","rol"],
    ["solicitud","usuario_id","usuario"],
    ["solicitud","servicio_id","servicio"],
    ["historial_estado","solicitud_id","solicitud"],
    ["historial_estado","actor_id","usuario"],
    ["firma_solicitud","solicitud_id","solicitud"],
    ["firma_solicitud","firmante_id","usuario"],
    ["notificacion","usuario_id","usuario"],
    ["notificacion","solicitud_id","solicitud"],
    ["asignacion_asesor","usuario_id","usuario"],
    ["asignacion_asesor","asesor_id","usuario"]
  ];

  var W = 200, HEAD = 20, ROW = 14;
  var sel = "solicitud";

  function box(name) {
    var t = T[name];
    return { x:t.x, y:t.y, w:W, h:HEAD + t.cols.length * ROW + 5 };
  }
  function related(name) {
    var s = {};
    REL.forEach(function (r) {
      if (r[0] === name) s[r[2]] = 1;
      if (r[2] === name) s[r[0]] = 1;
    });
    s[name] = 1;
    return s;
  }

  function path(a, b) {
    var A = box(a), B = box(b);
    var ax, bx, ay = A.y + A.h / 2, by = B.y + B.h / 2;
    if (A.x + A.w <= B.x)      { ax = A.x + A.w; bx = B.x; }
    else if (B.x + B.w <= A.x) { ax = A.x;       bx = B.x + B.w; }
    else                        { ax = A.x + A.w; bx = B.x + B.w; }
    var mid = (ax + bx) / 2;
    return "M" + ax + "," + ay + " C" + mid + "," + ay + " " + mid + "," + by + " " + bx + "," + by;
  }

  function render(root) {
    var rel = related(sel);
    var t = T[sel];

    var html = chrome(L("Modelo entidad-relación", "Entity-relationship model"));
    html += '<div class="demo-body">';
    html += '<p class="pane-h">' + L("Toca una tabla para ver sus columnas, índices y por qué están así",
                                      "Tap a table to see its columns, indexes and why they are shaped that way") + "</p>";

    html += '<div class="er-wrap"><svg class="er-svg" viewBox="0 0 790 440" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">';

    /* links first (behind) */
    REL.forEach(function (r) {
      var on = (r[0] === sel || r[2] === sel);
      html += '<path class="er-link' + (on ? " on" : " dim") + '" d="' + path(r[0], r[2]) + '"/>';
    });

    /* tables */
    Object.keys(T).forEach(function (name) {
      var b = box(name), tt = T[name];
      var cls = "er-tbl" + (name === sel ? " on" : (rel[name] ? "" : " dim"));
      html += '<g class="' + cls + '" data-t="' + name + '">';
      html += '<rect class="tbl-bg" x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="6"/>';
      html += '<rect class="thead" x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + HEAD + '" rx="6"/>';
      html += '<rect class="thead" x="' + b.x + '" y="' + (b.y + HEAD - 6) + '" width="' + b.w + '" height="6"/>';
      html += '<text class="tname" x="' + (b.x + 10) + '" y="' + (b.y + 14) + '">' + name + "</text>";
      tt.cols.forEach(function (c, i) {
        var y = b.y + HEAD + 11 + i * ROW;
        html += '<text' + (c[2] ? ' class="pk"' : "") + ' x="' + (b.x + 10) + '" y="' + y + '">' +
                (c[2] ? "◆ " : "") + c[0] + "</text>";
        html += '<text x="' + (b.x + b.w - 10) + '" y="' + y + '" text-anchor="end" opacity=".55">' + c[1] + "</text>";
      });
      html += "</g>";
    });

    html += "</svg></div>";

    /* info panel */
    html += '<div class="er-info"><div>';
    html += "<h5>" + sel + " · " + L("columnas", "columns") + "</h5><div class=\"er-cols\">";
    t.cols.forEach(function (c) {
      html += "<div" + (c[2] ? ' class="is-pk"' : "") + "><span>" + (c[2] ? "◆ " : "") + c[0] + "</span><em>" + c[1] + "</em></div>";
    });
    html += "</div></div><div>";
    html += "<h5>" + L("Índices", "Indexes") + "</h5>";
    html += '<div class="er-idx">' + t.idx.replace(/(PRIMARY KEY|UNIQUE KEY|KEY)/g, "<b>$1</b>") + "</div>";
    html += '<p class="er-note">' + L(t.note_es, t.note_en) + "</p>";
    html += "</div></div>";

    html += caption(
      "Modelo de ejemplo, no el esquema de ningún sistema real. Está aquí para mostrar cómo pienso una base de datos: cada índice responde a una consulta concreta.",
      "Example model, not any real system's schema. It is here to show how I think about a database: each index answers a concrete query."
    );
    html += "</div>";

    root.innerHTML = html;
    root.querySelectorAll("[data-t]").forEach(function (g) {
      g.onclick = function () { sel = g.dataset.t; render(root); };
    });
  }

  return { render: render };
})();

/* ═══════════════════════════════════════════════════════════════
   Mount + re-render on language change
   ═══════════════════════════════════════════════════════════════ */
var MAP = { flow: Flow, engine: Engine, rbac: Rbac, er: ER };

function mountAll() {
  document.querySelectorAll("[data-demo]").forEach(function (el) {
    var m = MAP[el.getAttribute("data-demo")];
    if (!m) return;
    el.classList.add("demo");
    m.render(el);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll);
} else {
  mountAll();
}
document.addEventListener("langchange", mountAll);

})();
