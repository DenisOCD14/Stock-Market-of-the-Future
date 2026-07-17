/* ============================================================
   FutureMarket — enhance.js
   Progressive enhancement for 10 modern design trends.
   Vanilla JS, no dependencies beyond the browser. Self-injecting
   UI so every page gets it with only two <link>/<script> tags.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- profile store (8. hyper-personalization) ---------- */
  var Profile = {
    get: function () { try { return JSON.parse(localStorage.getItem("fm_profile") || "{}"); } catch (e) { return {}; } },
    set: function (o) { var p = Profile.get(); Object.assign(p, o); try { localStorage.setItem("fm_profile", JSON.stringify(p)); } catch (e) {} return p; }
  };
  var Prefs = {
    get: function (k, d) { var v = localStorage.getItem("fm_" + k); return v == null ? d : v === "1"; },
    set: function (k, v) { try { localStorage.setItem("fm_" + k, v ? "1" : "0"); } catch (e) {} }
  };

  /* ============================================================
     5. DIAL-UP PRELOADER  (first visit per session)
     ============================================================ */
  function preloader() {
    if (sessionStorage.getItem("fm_booted") || reduce) return;
    sessionStorage.setItem("fm_booted", "1");
    var wrap = el("div", "fm-preload");
    wrap.innerHTML =
      '<div class="box">' +
        '<div class="logo">&#9670; Future<span>Market</span></div>' +
        '<div class="lines" id="fmBootLines"></div>' +
        '<div class="bar"><i id="fmBootBar"></i></div>' +
        '<div class="pct" id="fmBootPct">Establishing secure uplink&hellip; 0%</div>' +
      '</div>';
    document.body.appendChild(wrap);
    var steps = [
      "&gt; dialing broker.futuremarket.net ...",
      "&gt; CONNECT 56000 &#9679; handshake OK",
      "&gt; syncing live market feed ...",
      "&gt; loading your dashboard ..."
    ];
    var lines = $("#fmBootLines"), bar = $("#fmBootBar"), pct = $("#fmBootPct");
    var i = 0, p = 0;
    var tick = setInterval(function () {
      p += Math.random() * 16 + 6;
      if (p > 100) p = 100;
      bar.style.width = p + "%";
      pct.innerHTML = "Establishing secure uplink&hellip; " + Math.floor(p) + "%";
      var want = Math.min(steps.length, Math.ceil(p / 25));
      while (i < want) { lines.innerHTML += steps[i] + "<br>"; i++; }
      if (p >= 100) {
        clearInterval(tick);
        lines.innerHTML += '&gt; welcome. <span class="blink">_</span>';
        setTimeout(function () { wrap.classList.add("hide"); setTimeout(function () { wrap.remove(); }, 500); }, 480);
      }
    }, 190);
  }

  /* ============================================================
     1. MICRO-INTERACTIONS: reveal, count-up, ripple, tilt
     ============================================================ */
  function reveals() {
    var targets = $$(".panel, .section-title, .section-eyebrow, .stat, .cta-band, .timeline-item, .bento .cell-b, .illus-showcase, .contact-item");
    if (!("IntersectionObserver" in window) || reduce) { targets.forEach(function (t) { t.classList.add("in"); }); return; }
    targets.forEach(function (t) { t.classList.add("reveal"); });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  function countUp() {
    var nums = $$(".stat .num, .bento .b-num");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var node = e.target, raw = node.textContent.trim();
        if (raw.indexOf("/") > -1) return;                 // skip 24/7, 50/30/20
        var m = raw.match(/^([^\d]*)(\d[\d,]*\.?\d*)(.*)$/);
        if (!m || reduce) return;
        var pre = m[1], target = parseFloat(m[2].replace(/,/g, "")), suf = m[3];
        var dec = (m[2].split(".")[1] || "").length;
        var t0 = null, dur = 1100;
        function frame(ts) {
          if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur);
          var val = (target * (1 - Math.pow(1 - k, 3)));
          node.textContent = pre + (dec ? val.toFixed(dec) : Math.round(val).toLocaleString()) + suf;
          if (k < 1) requestAnimationFrame(frame);
          else { node.textContent = raw; node.classList.add("counted"); }
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function ripples() {
    document.addEventListener("pointerdown", function (ev) {
      var b = ev.target.closest(".btn"); if (!b) return;
      var r = el("span", "ripple"); var rect = b.getBoundingClientRect();
      var d = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = d + "px";
      r.style.left = (ev.clientX - rect.left - d / 2) + "px";
      r.style.top = (ev.clientY - rect.top - d / 2) + "px";
      b.appendChild(r); setTimeout(function () { r.remove(); }, 560);
    });
  }

  function tilt() {
    if (reduce || matchMedia("(pointer: coarse)").matches) return;
    $$(".panel").forEach(function (p) {
      p.addEventListener("pointermove", function (e) {
        var r = p.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        p.style.transform = "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      p.addEventListener("pointerleave", function () { p.style.transform = ""; });
    });
  }

  /* ============================================================
     6+7. CARBON PILL + ECO/MINIMAL MODE   |   Y2K theme
     ============================================================ */
  function estimateCarbon() {
    var bytes = 0;
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.transferSize) bytes += nav.transferSize;
      performance.getEntriesByType("resource").forEach(function (r) { bytes += (r.transferSize || r.encodedBodySize || 0); });
    } catch (e) {}
    if (!bytes) bytes = 420000; // fallback estimate
    // Sustainable Web Design-ish: ~0.494 g CO2e per MB transferred (illustrative)
    var grams = (bytes / 1048576) * 0.494;
    return { kb: Math.round(bytes / 1024), g: grams };
  }

  function ecoAndCarbon() {
    var c = estimateCarbon();
    var pill = el("button", "carbon-pill");
    pill.setAttribute("aria-label", "Carbon footprint and eco mode");
    pill.innerHTML = '<span class="leaf">&#127793;</span> ~' + c.g.toFixed(2) +
      'g CO<sub>2</sub>/view <span class="eco-flag">&middot; eco on</span>';
    document.body.appendChild(pill);

    function applyEco(on) {
      document.body.classList.toggle("eco-mode", on);
      Prefs.set("eco", on);
      if (agentSwitch.eco) agentSwitch.eco.classList.toggle("on", on);
      // recompute lighter footprint indication when eco on
      var g = on ? c.g * 0.55 : c.g;
      pill.innerHTML = '<span class="leaf">&#127793;</span> ~' + g.toFixed(2) +
        'g CO<sub>2</sub>/view <span class="eco-flag">&middot; eco on</span>';
    }
    pill.addEventListener("click", function () { applyEco(!document.body.classList.contains("eco-mode")); });
    if (Prefs.get("eco", false)) applyEco(true);
    window.__fmApplyEco = applyEco;
  }

  function applyY2K(on) {
    document.body.classList.toggle("y2k", on);
    Prefs.set("y2k", on);
    if (agentSwitch.y2k) agentSwitch.y2k.classList.toggle("on", on);
  }

  /* ============================================================
     8. HYPER-PERSONALIZATION banner
     ============================================================ */
  var RECS = {
    "Complete beginner": [["Investing basics", "investing.html"], ["Money habits", "personal-finance.html"]],
    "Some experience": [["Future themes", "investing.html"], ["Retirement plan", "retirement.html"]],
    "Confident investor": [["Macro forces", "economy.html"], ["Frontier themes", "investing.html"]],
    "Finance professional": [["The economy", "economy.html"], ["Our research", "about.html"]],
    "_default": [["Start investing", "investing.html"], ["Personal finance", "personal-finance.html"]]
  };
  function personalize() {
    var p = Profile.get();
    if (!p.level && !p.name) return;
    if (sessionStorage.getItem("fm_perso_dismissed")) return;
    if (page === "login.html" || page === "create-account.html") return;
    var recs = RECS[p.level] || RECS._default;
    var nav = $(".nav-wrap");
    if (!nav) return;
    var band = el("div", "perso-banner");
    var name = p.name ? (", " + p.name) : "";
    band.innerHTML = '<div class="grid-container"><div class="inner">' +
      '<div class="av">' + (p.name ? p.name[0].toUpperCase() : "&#9670;") + '</div>' +
      '<div><b>Welcome back' + name + '.</b> <span class="subtle" style="font-size:.88rem">' +
      (p.level ? "Tuned for: " + p.level : "Picking up where you left off") + '</span></div>' +
      '<div class="rec">' + recs.map(function (r) { return '<a class="btn btn-ghost" href="' + r[1] + '">' + r[0] + '</a>'; }).join("") +
      '</div><button class="dismiss" aria-label="Dismiss">&times;</button></div></div>';
    nav.insertAdjacentElement("afterend", band);
    band.querySelector(".dismiss").addEventListener("click", function () {
      sessionStorage.setItem("fm_perso_dismissed", "1"); band.remove();
    });
  }
  // capture profile from the create-account form
  function captureProfile() {
    var form = $("#confirmPassword") ? $("#confirmPassword").closest("form") : null;
    if (!form) return;
    form.addEventListener("submit", function () {
      var name = (form.querySelector('input[type=text]') || {}).value || "";
      var sel = form.querySelector("select");
      var level = sel ? sel.value : "";
      Profile.set({ name: name.trim(), level: level });
    }, true);
  }

  /* ============================================================
     5+9. AGENTIC ASSISTANT + VOICE UI
     ============================================================ */
  var agentSwitch = {};
  var ROUTES = [
    [/\b(home|start|main)\b/, "index.html", "the home page"],
    [/\b(about|who|mission|story)\b/, "about.html", "About"],
    [/\b(invest|stock|share|portfolio|theme)/, "investing.html", "Investing"],
    [/\b(personal|budget|save|saving|money|debt)/, "personal-finance.html", "Personal Finance"],
    [/\b(retire|pension|401|100.?year)/, "retirement.html", "Retirement"],
    [/\b(econom|macro|inflation|rate|gdp)/, "economy.html", "the Economy"],
    [/\b(contact|email|support|reach|talk)/, "contact.html", "Contact"],
    [/\b(log ?in|sign ?in)\b/, "login.html", "Log in"],
    [/\b(sign ?up|create|register|account|join)/, "create-account.html", "Create account"]
  ];
  var GLOSSARY = {
    "tokeniz": "Tokenization means issuing an asset — a stock, bond, or property — as a digital token on a blockchain, enabling fractional ownership and near-instant settlement.",
    "diversif": "Diversification is spreading your money across many different assets so no single loss can sink you. It's often called the only free lunch in finance.",
    "compound": "Compounding is earning returns on your past returns. Given decades, small regular contributions can grow dramatically.",
    "index fund": "An index fund is a low-cost fund that simply owns an entire market index, giving you broad diversification for a tiny fee.",
    "etf": "An ETF (exchange-traded fund) is a basket of assets that trades like a single stock — a common, low-cost way to diversify.",
    "inflation": "Inflation is the gradual rise in prices over time, which erodes the purchasing power of cash. Central banks often target around 2%.",
    "bull": "A bull market is a sustained period of rising prices and optimism. Its opposite is a bear market.",
    "bear": "A bear market is a sustained fall in prices, usually 20% or more from recent highs."
  };

  function buildAgent() {
    var launch = el("button", "fm-launch");
    launch.setAttribute("aria-label", "Open FutureMarket assistant");
    launch.innerHTML = '<span class="pulse-ring"></span>&#9670;';
    document.body.appendChild(launch);

    var panel = el("div", "fm-agent");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "FutureMarket assistant");
    panel.innerHTML =
      '<div class="fm-agent-head"><span class="a-mark">&#9670;</span>' +
        '<div><b>Market Assistant</b><div class="st">&#9679; online &middot; agentic + voice</div></div>' +
        '<button class="x" aria-label="Close">&times;</button></div>' +
      '<div class="fm-log" id="fmLog"></div>' +
      '<div class="fm-chips">' +
        '<button class="tactile" data-q="Take me to investing">Investing</button>' +
        '<button class="tactile" data-q="Explain tokenization">Explain tokenization</button>' +
        '<button class="tactile" data-q="Turn on eco mode">Eco mode</button>' +
        '<button class="tactile" data-q="Read this page">Read page</button>' +
      '</div>' +
      '<div class="fm-input">' +
        '<input type="text" id="fmInput" placeholder="Ask or say a command&hellip;" aria-label="Message the assistant">' +
        '<button class="fm-icon-btn mic" id="fmMic" aria-label="Voice input" title="Voice input">&#127908;</button>' +
        '<button class="fm-icon-btn send" id="fmSend" aria-label="Send">&#10148;</button>' +
      '</div>' +
      '<div class="fm-settings">' +
        '<div class="row"><span class="skeu-switch" id="swEco"><span class="track"><span class="knob"></span></span><span class="lbl">Carbon-aware eco mode</span></span><small>less motion, ~45% lighter</small></div>' +
        '<div class="row"><span class="skeu-switch" id="swY2K"><span class="track"><span class="knob"></span></span><span class="lbl">Y2K / dial-up theme</span></span><small>just for fun</small></div>' +
        '<div class="row"><span class="skeu-switch" id="swVoice"><span class="track"><span class="knob"></span></span><span class="lbl">Speak replies aloud</span></span><small>voice output</small></div>' +
      '</div>';
    document.body.appendChild(panel);

    var log = $("#fmLog"), input = $("#fmInput");
    function open() { panel.classList.add("open"); setTimeout(function () { input.focus(); }, 200); }
    function close() { panel.classList.remove("open"); }
    launch.addEventListener("click", function () { panel.classList.contains("open") ? close() : open(); });
    panel.querySelector(".x").addEventListener("click", close);

    function add(text, who) {
      var m = el("div", "fm-msg " + (who || "bot"), text);
      log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
    }
    // voice output
    var speakOn = Prefs.get("voice", false);
    function speak(text) {
      if (!speakOn || !("speechSynthesis" in window)) return;
      try { var u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, "")); u.rate = 1.03; speechSynthesis.speak(u); } catch (e) {}
    }
    function reply(html) { add(html, "bot"); speak(html); }

    function handle(qRaw) {
      var q = qRaw.toLowerCase().trim();
      if (!q) return;
      // settings intents
      if (/\beco|green|sustain|carbon\b/.test(q) && /\b(on|enable|turn|activate|yes)\b/.test(q)) { window.__fmApplyEco(true); return reply("Eco mode on &#127793; — animations off and the page is lighter to load."); }
      if (/\beco|carbon\b/.test(q) && /\b(off|disable|no)\b/.test(q)) { window.__fmApplyEco(false); return reply("Eco mode off — full experience restored."); }
      if (/\beco|carbon|green|sustain/.test(q)) { window.__fmApplyEco(!document.body.classList.contains("eco-mode")); return reply("Toggled carbon-aware eco mode."); }
      if (/\by2k|retro|dial.?up|nineties|90s/.test(q)) { applyY2K(!document.body.classList.contains("y2k")); return reply("Y2K theme toggled. Best viewed in Netscape Navigator. &#9829;"); }
      if (/\b(read|speak|aloud|narrat)/.test(q)) { return readPage(); }
      if (/\b(remember|my name is|call me)\b/.test(q)) {
        var nm = qRaw.replace(/.*(?:my name is|call me|remember(?: that)?(?: i am| i'm)?)\s+/i, "").replace(/[.!]/g, "").trim();
        if (nm) { Profile.set({ name: nm.split(" ")[0] }); return reply("Nice to meet you, " + nm.split(" ")[0] + ". I'll personalize your experience."); }
      }
      var lvl = q.match(/\b(beginner|some experience|confident|professional)\b/);
      if (lvl && /\b(level|i am|i'm|set)\b/.test(q)) {
        var map = { beginner: "Complete beginner", "some experience": "Some experience", confident: "Confident investor", professional: "Finance professional" };
        Profile.set({ level: map[lvl[1]] }); return reply("Got it — I'll tailor recommendations for a " + lvl[1] + ".");
      }
      // glossary
      for (var k in GLOSSARY) { if (q.indexOf(k) > -1) return reply(GLOSSARY[k]); }
      if (/\b(explain|what is|what's|define|mean)/.test(q)) {
        return reply("I can explain tokenization, diversification, compounding, index funds, ETFs, inflation, and bull/bear markets. Which one?");
      }
      // navigation
      for (var i = 0; i < ROUTES.length; i++) {
        if (ROUTES[i][0].test(q)) {
          var dest = ROUTES[i][1], label = ROUTES[i][2];
          reply("Taking you to <a href='" + dest + "'>" + label + "</a>&hellip;");
          setTimeout(function () { location.href = dest; }, 900);
          return;
        }
      }
      if (/\b(help|what can you|hi|hello|hey)\b/.test(q)) {
        return reply("I'm your on-site agent. I can <b>navigate</b> ('take me to retirement'), <b>explain</b> concepts ('what is tokenization'), <b>personalize</b> ('my name is Sam', 'set level to beginner'), or change the <b>experience</b> ('eco mode', 'Y2K theme', 'read this page'). Try the chips below, or tap the mic.");
      }
      reply("I can navigate the site, explain market concepts, or adjust the experience for you. Try 'take me to investing' or 'explain compounding'.");
    }

    function readPage() {
      var h1 = $("h1"), lead = $(".hero p.lead, .page-head p, .section-lead");
      var txt = (h1 ? h1.textContent + ". " : "") + (lead ? lead.textContent : "");
      if (!txt) txt = "This is FutureMarket, your guide to the stock market of the future.";
      add("Reading this page aloud&hellip; &#128266;", "bot");
      if ("speechSynthesis" in window) { try { var u = new SpeechSynthesisUtterance(txt); u.rate = 1.02; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
      else add("(Your browser doesn't support speech output.)", "bot");
    }

    function send(q) { add(q, "me"); setTimeout(function () { handle(q); }, 260); }
    $("#fmSend").addEventListener("click", function () { var v = input.value; input.value = ""; if (v.trim()) send(v); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { var v = input.value; input.value = ""; if (v.trim()) send(v); } });
    $$(".fm-chips button").forEach(function (c) { c.addEventListener("click", function () { send(c.getAttribute("data-q")); }); });

    // voice input (Web Speech API)
    var mic = $("#fmMic");
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mic.style.display = "none"; }
    else {
      var rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
      var listening = false;
      mic.addEventListener("click", function () {
        if (listening) { rec.stop(); return; }
        try { rec.start(); } catch (e) {}
      });
      rec.onstart = function () { listening = true; mic.classList.add("listening"); input.placeholder = "Listening&hellip;"; };
      rec.onend = function () { listening = false; mic.classList.remove("listening"); input.placeholder = "Ask or say a command…"; };
      rec.onerror = function () { listening = false; mic.classList.remove("listening"); };
      rec.onresult = function (ev) { var t = ev.results[0][0].transcript; send(t); };
    }

    // skeuomorphic setting switches
    function wireSwitch(id, isOn, onToggle) {
      var sw = $("#" + id); sw.classList.toggle("on", !!isOn);
      sw.addEventListener("click", function () { var now = !sw.classList.contains("on"); sw.classList.toggle("on", now); onToggle(now); });
      return sw;
    }
    agentSwitch.eco = wireSwitch("swEco", Prefs.get("eco", false), function (on) { window.__fmApplyEco(on); });
    agentSwitch.y2k = wireSwitch("swY2K", Prefs.get("y2k", false), function (on) { applyY2K(on); });
    wireSwitch("swVoice", speakOn, function (on) { speakOn = on; Prefs.set("voice", on); if (on) speak("Voice replies enabled."); });

    // greeting
    var p = Profile.get();
    setTimeout(function () {
      add(p.name ? ("Welcome back, " + p.name + "! Ask me to navigate, explain a concept, or tweak the experience.") :
        "Hi &#128075; I'm your FutureMarket agent. Ask me to navigate the site, explain a market concept, or switch on eco mode. Tap the mic to talk.", "bot");
    }, 300);
  }

  /* ---------- boot ---------- */
  function init() {
    preloader();
    reveals();
    countUp();
    ripples();
    tilt();
    captureProfile();
    personalize();
    buildAgent();      // creates the switches referenced by ecoAndCarbon
    ecoAndCarbon();
    if (Prefs.get("y2k", false)) applyY2K(true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
