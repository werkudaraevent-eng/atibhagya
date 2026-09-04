/*
 * Atibhagya Estate — MOTION REFERENCE (extracted verbatim from the design prototype)
 * ----------------------------------------------------------------------------------
 * This is the exact scroll/animation logic the client approved. Port it 1:1 into the
 * Next.js app as a client hook (e.g. useEstateMotion) or a small vanilla module mounted
 * in a client component. Keep every constant (lerp factors, easings, thresholds, timings).
 *
 * The class extends DCLogic (the prototype runtime); ignore that — you only need the
 * methods. componentDidMount ≈ useEffect setup, componentWillUnmount ≈ cleanup.
 * this.props.customCursor / this.reduce (prefers-reduced-motion) are the only inputs.
 *
 * DOM contract — the hook finds elements by these attributes (keep them in the JSX):
 *   [data-role="nav"] [data-role="progress"] [data-role="dotnav"] [data-dot="<id>"] [data-curl]
 *   [data-role="thread"] [data-role="threadbg"] [data-dotlabel] [data-role="wave"] [data-role="wavewrap"]
 *   [data-role="stickyapply"] [data-role="mobilebar"] [data-role="mobileprog"] [data-role="mobilen"] [data-role="mobilet"]
 *   [data-role="chapmark"] [data-role="chapmarkN"] [data-role="chapmarkT"]
 *   [data-role="cursor"] [data-role="cursordot"] [data-role="cursorcurl"]
 *   [data-fade] [data-words] [data-para] [data-pull][data-drift="<index>"] [data-clip] [data-dark]
 *   [data-zoom] [data-heroveil] [data-role="heroword"] [data-quotemark] [data-split] [data-role="dpsL"|"dpsR"]
 *   [data-role="daytrack"] > [data-role="dayline"]   [data-role="ornament"] [data-draw]
 *   section ids: #top #ch1 #ch2 #ch3 #ch4 #apply (nav stages) · #day #before
 *
 * Keyframes required (global CSS):
 *   @keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.18)}}
 *   @keyframes breatheGlyph{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.18);opacity:1}}
 *   @keyframes flow{0%{transform:translateX(0)}100%{transform:translateX(-14px)}}
 *   @keyframes mist{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:.9;transform:scale(1.07)}}
 *   @keyframes cue{0%,100%{transform:translateY(0);opacity:.7}50%{transform:translateY(8px);opacity:.25}}
 *   @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
 *   @media (pointer:fine){body[data-cursor="1"],body[data-cursor="1"] a,body[data-cursor="1"] button{cursor:none}}
 */

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const WM = f => "https://commons.wikimedia.org/wiki/Special:FilePath/" + f;

class Component extends DCLogic {
  state = { faq: -1 };
  dotEnter = e => { const l = e.currentTarget.querySelector("[data-dotlabel]"); if (l) { l.style.opacity = "1"; l.style.transform = "translate(0,-50%)"; } };
  dotLeave = e => { const a = e.currentTarget, on = a.getAttribute("data-dot") === this.activeCh; const l = a.querySelector("[data-dotlabel]"); if (l && !on) { l.style.opacity = "0"; l.style.transform = "translate(6px,-50%)"; } };
  componentDidMount() {
    this.ornIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll("[data-draw]").forEach(p => p.style.strokeDashoffset = "0"); this.ornIO.unobserve(e.target); } }), { threshold: 0.4 });
    setTimeout(() => document.querySelectorAll('[data-role="ornament"]').forEach(el => this.ornIO.observe(el)), 300);
    this.io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { this.reveal(e.target); this.io.unobserve(e.target); }
    }), { threshold: 0.12 });
    this.scan();
    this.loop = setInterval(() => this.scan(), 400);
    this.onScroll = () => { if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = null; this.tick(); }); this.wake(); };
    this.sm = { y: window.scrollY || 0, v: 0 }; this.reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onScroll);
    this.tick();
    if ((this.props.customCursor ?? true) && window.matchMedia && window.matchMedia("(pointer:fine)").matches && !this.reduce) {
      document.body.dataset.cursor = "1";
      this.cur = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
      this.onMove = e => {
        const c = this.cur, el = document.querySelector('[data-role="cursor"]'); if (!el) return;
        c.tx = e.clientX; c.ty = e.clientY;
        if (!c.shown) { c.shown = true; c.x = c.tx; c.y = c.ty; el.style.opacity = "1"; }
        const hot = !!(e.target && e.target.closest && e.target.closest("a,button,[data-pull],image-slot,[data-clip]"));
        if (hot !== c.hot) { c.hot = hot; const d = el.querySelector('[data-role="cursordot"]'), s = el.querySelector('[data-role="cursorcurl"]'); if (d) d.style.transform = hot ? "scale(0)" : "scale(1)"; if (s) { s.style.opacity = hot ? "1" : "0"; s.style.transform = hot ? "scale(1) rotate(0deg)" : "scale(.5) rotate(-40deg)"; } }
        this.curWake();
      };
      this.onLeave = () => { const el = document.querySelector('[data-role="cursor"]'); if (el) el.style.opacity = "0"; this.cur.shown = false; };
      window.addEventListener("mousemove", this.onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", this.onLeave);
    }
  }
  curWake() {
    if (this.curRaf) return;
    const step = () => { const c = this.cur; c.x += (c.tx - c.x) * 0.2; c.y += (c.ty - c.y) * 0.2; const el = document.querySelector('[data-role="cursor"]'); if (el) el.style.transform = "translate(" + c.x.toFixed(1) + "px," + c.y.toFixed(1) + "px)"; if (Math.abs(c.tx - c.x) > 0.2 || Math.abs(c.ty - c.y) > 0.2) this.curRaf = requestAnimationFrame(step); else this.curRaf = null; };
    this.curRaf = requestAnimationFrame(step);
  }
  splitWords(el) {
    if (el.dataset.split) return; el.dataset.split = "1"; let i = 0;
    [...el.childNodes].forEach(n => {
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
        const s = document.createElement("span"); s.textContent = w; s.dataset.w = "1";
        const d = (i * 70) + "ms", cb = " 1.3s cubic-bezier(.22,1,.36,1) ";
        s.style.cssText = "display:inline-block;opacity:0;filter:blur(8px);transform:translateY(8px);transition:opacity" + cb + d + ",filter" + cb + d + ",transform" + cb + d;
        frag.appendChild(s); i++;
      });
      n.replaceWith(frag);
    });
  }
  paintDots() {
    const order = ["top", "ch1", "ch2", "ch3", "ch4", "apply"], ai = order.indexOf(this.activeCh), dk = this.navDark;
    document.querySelectorAll("[data-dot]").forEach(a => {
      const id = a.getAttribute("data-dot"), on = id === this.activeCh, passed = order.indexOf(id) < ai;
      a.style.color = on ? (dk ? "#e3bd72" : "#a97b2a") : passed ? (dk ? "rgba(227,189,114,.5)" : "rgba(169,123,42,.45)") : (dk ? "rgba(246,243,231,.35)" : "rgba(16,34,47,.22)");
      a.style.transform = on ? "" : "translate(-50%,-50%) scale(" + (passed ? .6 : .5) + ")";
      a.style.animation = on ? "breathe 4s ease-in-out infinite" : "none";
      const lb = a.querySelector("[data-dotlabel]"); if (lb) { lb.style.opacity = on ? "1" : "0"; lb.style.transform = on ? "translate(0,-50%)" : "translate(6px,-50%)"; lb.style.color = dk ? "#e3bd72" : "#a97b2a"; }
    });
    const bg = document.querySelector('[data-role="threadbg"]'); if (bg) bg.setAttribute("stroke", dk ? "rgba(246,243,231,.14)" : "rgba(16,34,47,.09)");
    const th = document.querySelector('[data-role="thread"]'); if (th) th.setAttribute("stroke", dk ? "rgba(227,189,114,.8)" : "rgba(169,123,42,.7)");
    const wv = document.querySelector('[data-role="wave"]'), ww = document.querySelector('[data-role="wavewrap"]');
    if (wv) wv.style.animation = this.activeCh === "apply" ? "flow 2.8s linear infinite" : "none";
    if (ww) ww.style.color = this.activeCh === "apply" ? "#a97b2a" : dk ? "rgba(246,243,231,.3)" : "rgba(16,34,47,.2)";
  }
  componentWillUnmount() {
    clearInterval(this.loop);
    if (this.onMove) { window.removeEventListener("mousemove", this.onMove); document.documentElement.removeEventListener("mouseleave", this.onLeave); }
    this.io && this.io.disconnect();
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onScroll);
  }
  wake() { if (this.motionRaf || this.reduce) return; const step = () => { const y = window.scrollY || 0; const s = this.sm; const ty = y, tv = y - (this.lastY ?? y); this.lastY = y; s.y += (ty - s.y) * 0.09; s.v += (tv - s.v) * 0.12; this.motion(); if (Math.abs(ty - s.y) > 0.3 || Math.abs(s.v) > 0.05) this.motionRaf = requestAnimationFrame(step); else { this.motionRaf = null; s.v = 0; this.motion(); } }; this.motionRaf = requestAnimationFrame(step); }
  motion() {
    const vh = window.innerHeight, s = this.sm, lag = (s.y - (window.scrollY || 0)), pull = clamp(Math.abs(s.v) / 60) * (s.v < 0 ? -1 : 1);
    document.querySelectorAll("[data-para]").forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      const base = (r.top + r.height / 2 - vh / 2) * -0.08;
      el.style.transform = "translateY(" + (base - lag * 0.18).toFixed(1) + "px) scale(" + (1 + Math.abs(pull) * 0.025).toFixed(4) + ")";
    });
    document.querySelectorAll("[data-pull]").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      const di = el.getAttribute("data-drift"), dx = di == null ? 0 : (parseInt(di, 10) - 1) * c * -16;
      el.style.transform = "translate(" + dx.toFixed(1) + "px," + (c * -18 - lag * 0.12).toFixed(1) + "px) scale(" + (1 + Math.abs(pull) * 0.03).toFixed(4) + ")";
    });
  }
  reveal(el) { el.style.opacity = "1"; el.style.transform = "none"; el.dataset.in = "1"; el.querySelectorAll("[data-w]").forEach(s => { s.style.opacity = "1"; s.style.filter = "blur(0)"; s.style.transform = "none"; }); }
  scan() {
    document.querySelectorAll("[data-fade]:not([data-in])").forEach(el => {
      if (!el.dataset.prep) {
        el.dataset.prep = "1";
        if (el.hasAttribute("data-words") && !this.reduce) this.splitWords(el);
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
        if (!el.style.transition) el.style.transition = "opacity 1.5s cubic-bezier(.22,1,.36,1),transform 1.5s cubic-bezier(.22,1,.36,1)";
        this.io.observe(el);
      }
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) this.reveal(el);
    });
  }
  tick() {
    const vh = window.innerHeight;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - vh);
    const wide = window.innerWidth >= 900;
    if (wide !== this.wide) { this.wide = wide; const cm = document.querySelector('[data-role="chapmark"]'); if (cm) cm.style.display = wide ? "flex" : "none"; }
    const bar = document.querySelector('[data-role="progress"]');
    if (bar) bar.style.width = (clamp(y / max) * 100).toFixed(2) + "%";
    const solid = y > vh * 0.82;
    if (solid !== this.navSolid) {
      this.navSolid = solid;
      const nav = document.querySelector('[data-role="nav"]');
      if (nav) {
        nav.style.background = solid ? "linear-gradient(180deg,rgba(246,243,231,.94),rgba(246,243,231,.8))" : "linear-gradient(180deg,rgba(16,34,47,.35),rgba(16,34,47,0))";
        nav.style.borderBottomColor = solid ? "rgba(16,34,47,.08)" : "rgba(255,255,255,0)";
        nav.style.backdropFilter = solid ? "blur(10px)" : "none";
        nav.querySelectorAll("[data-navlink]").forEach(a => a.style.color = solid ? "#10222f" : "#fff");
        const cta = nav.querySelector('[data-role="navcta"]');
        if (cta) { cta.style.color = solid ? "#a97b2a" : "#fff"; cta.style.borderColor = solid ? "#a97b2a" : "rgba(255,255,255,.8)"; }
        const lg = nav.querySelector('[data-role="navlogo"]');
        if (lg) lg.style.filter = solid ? "brightness(.55) sepia(.4)" : "none";
        const pn = nav.querySelector('[data-role="pagenav"]');
        if (pn) { pn.style.height = "0"; pn.style.opacity = "0"; }
        const dn = document.querySelector('[data-role="dotnav"]');
        if (dn) { const wide = window.innerWidth >= 900; this.dotVisible = solid && wide; dn.style.opacity = this.dotVisible ? "1" : "0"; dn.style.pointerEvents = this.dotVisible ? "auto" : "none"; }
      }
    }
    const applyEl = document.getElementById("apply");
    const nearApply = applyEl ? applyEl.getBoundingClientRect().top < vh * 0.9 : false;
    const showSticky = solid && !nearApply && wide;
    const mbOn = solid && !wide;
    if (mbOn !== this.mbOn) { this.mbOn = mbOn; const mb = document.querySelector('[data-role="mobilebar"]'); if (mb) { mb.style.opacity = mbOn ? "1" : "0"; mb.style.transform = mbOn ? "translateY(0)" : "translateY(100%)"; mb.style.pointerEvents = mbOn ? "auto" : "none"; } }
    if (mbOn) { const mp = document.querySelector('[data-role="mobileprog"]'); if (mp) mp.style.width = (clamp(y / max) * 100).toFixed(2) + "%"; }
    const darks = [...document.querySelectorAll("[data-dark]")].map(d => d.getBoundingClientRect());
    const inDark = yy => darks.some(r => yy >= r.top && yy <= r.bottom);
    const navDark = inDark(vh - 100), markDark = inDark(vh / 2);
    if (navDark !== this.navDark) { this.navDark = navDark; this.paintDots(); }
    if (markDark !== this.markDark) { this.markDark = markDark; const cm = document.querySelector('[data-role="chapmark"]'); if (cm) cm.style.color = markDark ? "rgba(246,243,231,.6)" : "rgba(16,34,47,.55)"; }
    const hv = document.querySelector("[data-heroveil]"); if (hv) hv.style.opacity = String(clamp((y - vh * 0.25) / (vh * 0.6)));
    const dt = document.querySelector('[data-role="daytrack"]');
    if (dt) { const r = dt.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh) { const dl = dt.querySelector('[data-role="dayline"]'); if (dl) dl.style.height = (clamp((vh * 0.62 - r.top) / r.height) * r.height).toFixed(0) + "px"; } }
    if (showSticky !== this.stickyOn) {
      this.stickyOn = showSticky;
      const sa = document.querySelector('[data-role="stickyapply"]');
      if (sa) { sa.style.opacity = showSticky ? "1" : "0"; sa.style.transform = showSticky ? "translateY(0)" : "translateY(16px)"; sa.style.pointerEvents = showSticky ? "auto" : "none"; }
    }
    const dots = [...document.querySelectorAll("[data-dot]")];
    const thread = document.querySelector('[data-role="thread"]');
    let prog = 0;
    if (thread && dots.length > 1) {
      const ids = dots.map(a => a.getAttribute("data-dot"));
      for (let i = 0; i < ids.length - 1; i++) {
        const a = document.getElementById(ids[i]), b = document.getElementById(ids[i + 1]);
        if (!a || !b) continue;
        const ta = a.getBoundingClientRect().top + y - vh * 0.45, tb = b.getBoundingClientRect().top + y - vh * 0.45;
        if (y >= tb) prog = i + 1; else if (y > ta) { prog = i + clamp((y - ta) / Math.max(1, tb - ta)); break; } else break;
      }
      thread.style.strokeDashoffset = String((100 - 100 * prog / (ids.length - 1)).toFixed(2));
      dots.forEach((a, i) => {
        const f = i === 0 ? 1 : clamp(prog - (i - 1));
        const p = a.querySelector("[data-curl]"); if (p) p.style.strokeDashoffset = String((100 - 100 * f).toFixed(1));
      });
    }
    let active = "top";
    ["ch1", "ch2", "ch3", "ch4", "apply"].forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= vh * 0.45) active = id; });
    if (active !== this.activeCh) {
      this.activeCh = active;
      document.querySelectorAll("[data-pagelink]").forEach(a => { const on = a.getAttribute("data-pagelink") === active; a.style.color = on ? "#10222f" : "rgba(16,34,47,.55)"; a.style.borderBottomColor = on ? "#a97b2a" : "transparent"; });
      this.paintDots();
      const map = { top: ["N°", "Atibhagya"], ch1: ["01", "Journeys"], ch2: ["02", "Residence"], ch3: ["03", "Healing"], ch4: ["04", "Arrival"], apply: ["N°", "Apply"] }, v = map[active];
      const mn = document.querySelector('[data-role="mobilen"]'), mt = document.querySelector('[data-role="mobilet"]'); if (mn) mn.textContent = v[0]; if (mt) mt.textContent = v[1];
      const cm = document.querySelector('[data-role="chapmark"]');
      if (cm) { cm.style.opacity = "0"; clearTimeout(this.cmT); if (/^ch/.test(active)) this.cmT = setTimeout(() => { cm.querySelector('[data-role="chapmarkN"]').textContent = v[0]; cm.querySelector('[data-role="chapmarkT"]').textContent = v[1]; cm.style.opacity = "1"; }, 450); }
    }
    const w = document.querySelector('[data-role="heroword"]');
    if (w) {
      w.style.transform = "translateY(" + (y * 0.22).toFixed(1) + "px)";
      w.style.opacity = String(clamp(1 - y / (vh * 0.7)));
    }
    const z = document.querySelector("[data-zoom]");
    if (z) z.style.transform = "scale(" + (1 + clamp(y / vh) * 0.12).toFixed(4) + ")";
    document.querySelectorAll("[data-clip]").forEach(el => {
      const r = el.getBoundingClientRect();
      const p = ease(clamp((vh * 0.96 - r.top) / (vh * 0.55)));
      const vy = ((1 - p) * 14).toFixed(2);
      const vx = ((1 - p) * 9).toFixed(2);
      el.style.clipPath = "inset(" + vy + "% " + vx + "% " + vy + "% " + vx + "%)";
    });
    if (this.reduce || !this.motionRaf) this.motion();
    const split = document.querySelector("[data-split]");
    if (split) {
      const r = split.getBoundingClientRect();
      const p = ease(clamp((vh * 0.9 - r.top) / (vh * 0.9)));
      const d = p * Math.min(120, vh * 0.06);
      const l = document.querySelector('[data-role="dpsL"]');
      const rr = document.querySelector('[data-role="dpsR"]');
      if (l) { l.style.transform = "translateX(" + (-d).toFixed(1) + "px)"; l.style.opacity = String(0.2 + p * 0.8); }
      if (rr) { rr.style.transform = "translateX(" + d.toFixed(1) + "px)"; rr.style.opacity = String(0.2 + p * 0.8); }
    }
    const qm = document.querySelector("[data-quotemark]");
    if (qm) {
      const r = qm.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) qm.style.transform = "translateX(-50%) translateY(" + ((r.top - vh / 2) * 0.18).toFixed(1) + "px)";
    }
  }
}
