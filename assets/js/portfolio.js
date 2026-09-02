/* =========================================================
   FREELANCE PORTFOLIO — portfolio.js
   100% data-driven: data.json + data/portfolio-data.json
========================================================= */
(function () {
  'use strict';

  const EXT_MAP = { api: 'API', saas: 'SaaS', iot: 'IoT', ai: 'AI' };

  const WA_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.505 3.58 1.383 5.065L2.05 21.95l5.003-1.312A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 0 1-4.073-1.117l-.292-.173-3.005.788.802-2.93-.19-.302A7.957 7.957 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>`;
  const EMAIL_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  const WA_ICON   = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.505 3.58 1.383 5.065L2.05 21.95l5.003-1.312A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 0 1-4.073-1.117l-.292-.173-3.005.788.802-2.93-.19-.302A7.957 7.957 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>`;
  const EM_ICON   = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9933" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  const LI_ICON   = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#0a66c2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`;
  const VISIT_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>`;

  /* ---- init ---- */
  async function init() {
    try {
      const [main, pf] = await Promise.all([
        fetch('data.json',               { cache: 'no-store' }).then(r => r.json()),
        fetch('data/portfolio-data.json',{ cache: 'no-store' }).then(r => r.json())
      ]);
      populate(main, pf);
    } catch (e) {
      console.error('[portfolio]', e);
    }
    initCanvas();
    initNav();
    initCounters();
    initReveal();
    initFilter();
  }

  /* ---- populate ---- */
  function populate(main, pf) {
    const p = main.profile;
    const m = pf.meta;
    const wa = `https://wa.me/${p.phone.replace(/\D/g,'')}?text=${encodeURIComponent(m.waMessage)}`;

    // page meta
    document.title = m.pageTitle;
    const desc = document.getElementById('pf-page-desc');
    if (desc) desc.setAttribute('content', m.description);

    // nav
    set('pf-nav-emoji', m.navLogoEmoji);
    set('pf-nav-name',  p.name.split(' ')[0].toLowerCase() + '.dev');
    renderNav(m.nav);

    // hero
    set('pf-availability-text', m.availability);
    set('pf-hero-name', `I'm <span class="hero-name-accent">${p.name.split(' ')[0]}</span>`, true);
    set('pf-tw-prefix', m.heroPrefix + ' ');
    set('pf-hero-sub',  m.heroSub);
    renderHeroCtas(m.heroCtas, wa, p.email);
    renderHeroStats(m.heroStats);

    // section labels
    setSectionText('svc',  m.sections.services);
    setSectionText('proj', m.sections.projects);
    setSectionText('why',  m.sections.why);
    setSectionText('proc', m.sections.process);
    setSectionText('test', m.sections.testimonials);
    setSectionText('cont', m.sections.contact);

    // project filters — dynamic from unique ext values
    renderFilterRow(main.projects);

    // content sections
    renderServices(pf.services);
    renderProjects(main.projects);
    renderWhyCards(m.whyCards);
    renderProcess(pf.process);
    renderTestimonials(main.testimonials || []);
    renderContactCards(m.contactCards, wa, p.email, p.linkedin);

    // footer
    set('pf-footer-name',    p.name);
    set('pf-year',           String(new Date().getFullYear()));
    set('pf-footer-tagline', m.footer.tagline);
    renderFooterLinks(m.footer, wa, p.email, p.linkedin);

    // typewriter
    initTypewriter(m.typewriterWords);
  }

  /* ---- helpers: set section eyebrow/heading/sub ---- */
  function setSectionText(prefix, s) {
    if (!s) return;
    set(`pf-${prefix}-eyebrow`, s.eyebrow);
    set(`pf-${prefix}-heading`, s.heading);
    set(`pf-${prefix}-sub`,     s.sub);
  }

  /* ---- nav ---- */
  function renderNav(links) {
    const w = document.getElementById('pf-nav-links');
    if (!w || !links) return;
    w.innerHTML = links.map(l =>
      `<a href="${l.href}" class="nav-link${l.cta ? ' nav-cta' : ''}">${esc(l.label)}</a>`
    ).join('');
  }

  /* ---- hero ctas ---- */
  function renderHeroCtas(ctas, wa, email) {
    const w = document.getElementById('pf-hero-ctas');
    if (!w || !ctas) return;
    w.innerHTML = ctas.map(c => {
      if (c.type === 'wa')
        return `<a href="${wa}" id="${c.id}" class="btn-wa" target="_blank" rel="noopener">${WA_SVG} ${esc(c.label)}</a>`;
      if (c.type === 'email')
        return `<a href="mailto:${email}" id="${c.id}" class="btn-email">${EMAIL_SVG} ${esc(c.label)}</a>`;
      return `<a href="${c.href}" class="btn-ghost">${esc(c.label)}</a>`;
    }).join('');
  }

  /* ---- hero stats ---- */
  function renderHeroStats(stats) {
    const w = document.getElementById('pf-hero-stats');
    if (!w || !stats) return;
    w.innerHTML = stats.map((s, i) => `
      ${i > 0 ? '<div class="hero-stat-sep"></div>' : ''}
      <div class="hero-stat">
        <div class="hero-stat-num" data-count="${s.count}" data-suffix="${s.suffix}">${s.count}${s.suffix}</div>
        <div class="hero-stat-label">${esc(s.label)}</div>
      </div>`).join('');
  }

  /* ---- filter row ---- */
  function renderFilterRow(projects) {
    const w = document.getElementById('pf-filter-row');
    if (!w) return;
    const exts = [...new Set(projects.filter(p => p.visible !== false).map(p => p.ext))];
    w.innerHTML = `<button class="filter-btn active" data-filter="all">All</button>` +
      exts.map(e => `<button class="filter-btn" data-filter="${e}">${EXT_MAP[e] || e}</button>`).join('');
  }

  /* ---- services ---- */
  function renderServices(services) {
    const w = document.getElementById('pf-services');
    if (!w || !services) return;
    w.innerHTML = services.map((s, i) => `
      <div class="svc-card reveal reveal-d${(i % 3) + 1}">
        <span class="svc-icon">${s.icon}</span>
        <div class="svc-title">${esc(s.title)}</div>
        <div class="svc-desc">${esc(s.desc)}</div>
        <div class="svc-tags">${s.tags.map(t => `<span class="svc-tag">${esc(t)}</span>`).join('')}</div>
      </div>`).join('');
  }

  /* ---- why cards ---- */
  function renderWhyCards(cards) {
    const w = document.getElementById('pf-why-grid');
    if (!w || !cards) return;
    const delays = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3'];
    w.innerHTML = cards.map((c, i) => `
      <div class="why-card reveal ${delays[i] || ''}">
        <div class="why-icon">${c.icon}</div>
        <div class="why-num" data-count="${c.count}" data-suffix="${c.suffix}">0${c.suffix}</div>
        <div class="why-label">${esc(c.label)}</div>
        <div class="why-desc">${esc(c.desc)}</div>
      </div>`).join('');
  }

  /* ---- projects ---- */
  function renderProjects(projects) {
    const w = document.getElementById('pf-projects');
    if (!w) return;
    w.innerHTML = projects.filter(p => p.visible !== false).map((p, i) => {
      const badge   = EXT_MAP[p.ext] || p.ext;
      const live    = p.url || p.playstore || p.appstore || '';
      const imgBack = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" class="pf-back-img">`
        : `<div class="pf-back-abbr">${esc(p.name.slice(0,2).toUpperCase())}</div>`;
      return `
      <div class="pf-card reveal reveal-d${(i % 3) + 1}" data-ext="${p.ext}">
        <div class="pf-card-inner">
          <div class="pf-card-front">
            <div class="pf-card-thumb">
              <div class="pf-card-thumb-bg"></div>
              <div class="pf-card-thumb-abbr">${esc(p.name.slice(0,2).toUpperCase())}</div>
              <span class="pf-flip-hint">click to flip ↻</span>
            </div>
            <div class="pf-card-body">
              <div class="pf-card-top">
                <div class="pf-card-name">${esc(p.name)}</div>
                <span class="pf-badge badge-${p.ext}">${badge}</span>
              </div>
              <div class="pf-card-desc">${esc(p.description||'')}</div>
            </div>
          </div>
          <div class="pf-card-back">
            <div class="pf-back-media">${imgBack}</div>
            <div class="pf-back-body">
              <div class="pf-back-name">${esc(p.name)}</div>
              <div class="pf-back-desc">${esc(p.description||'')}</div>
              <div class="pf-back-actions">
                ${live ? `<a class="pf-back-visit" href="${live}" target="_blank" rel="noopener">${VISIT_SVG} Visit Website</a>`
                       : `<span class="pf-back-no-link">No live URL</span>`}
                <button class="pf-back-close">↩ Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    w.querySelectorAll('.pf-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('a, .pf-back-close')) return;
        card.classList.toggle('flipped');
      });
      card.querySelector('.pf-back-close')?.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
    });
  }

  /* ---- process ---- */
  function renderProcess(steps) {
    const w = document.getElementById('pf-process');
    if (!w || !steps) return;
    w.innerHTML = steps.map((s, i) => `
      <div class="process-step reveal reveal-d${Math.min(i + 1, 3)}">
        <div class="process-step-num">${esc(s.num)}</div>
        <div class="process-step-label">${esc(s.label)}</div>
        <div class="process-step-desc">${esc(s.desc)}</div>
      </div>`).join('');
  }

  /* ---- testimonials ---- */
  function renderTestimonials(list) {
    if (!list.length) return;
    const track = document.getElementById('pf-testimonials');
    const dotsW = document.getElementById('pf-tdots');
    const prev  = document.getElementById('pf-tprev');
    const next  = document.getElementById('pf-tnext');
    if (!track) return;

    track.innerHTML = list.map(t => `
      <div class="t-card">
        <div class="t-card-top">
          <div class="t-avatar">${esc(t.avatar)}</div>
          <div>
            <div class="t-info-name">${esc(t.name)}</div>
            <div class="t-info-role">${esc(t.role)}</div>
          </div>
        </div>
        <div class="t-stars">${'★'.repeat(t.rating || 5)}</div>
        <div class="t-text">${esc(t.text)}</div>
      </div>`).join('');

    const VISIBLE  = 3, GAP = 20;
    const maxIndex = Math.max(0, list.length - VISIBLE);

    dotsW.innerHTML = Array.from({ length: maxIndex + 1 }, (_, i) =>
      `<button class="t-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Slide ${i+1}"></button>`
    ).join('');

    let cur = 0;
    const dots = dotsW.querySelectorAll('.t-dot');

    function goTo(idx) {
      cur = Math.max(0, Math.min(idx, maxIndex));
      const cardW = (track.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE;
      track.scrollTo({ left: cur * (cardW + GAP), behavior: 'smooth' });
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    prev.addEventListener('click', () => goTo(cur - 1));
    next.addEventListener('click', () => goTo(cur + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

    let auto = setInterval(() => goTo(cur >= maxIndex ? 0 : cur + 1), 4000);
    track.addEventListener('mouseenter', () => clearInterval(auto));
    track.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo(cur >= maxIndex ? 0 : cur + 1), 4000);
    });
  }

  /* ---- contact cards ---- */
  function renderContactCards(cards, wa, email, linkedin) {
    const w = document.getElementById('pf-contact-cards');
    if (!w || !cards) return;
    const iconMap = { wa: WA_ICON, em: EM_ICON, li: LI_ICON };
    const hrefMap = { wa: wa, em: `mailto:${email}`, li: linkedin };
    w.innerHTML = cards.map(c => `
      <a href="${hrefMap[c.type] || '#'}" id="${c.id}" class="contact-card contact-${c.type}"
         ${c.type !== 'em' ? 'target="_blank" rel="noopener"' : ''}>
        <div class="contact-card-icon">${iconMap[c.type] || ''}</div>
        <div class="contact-card-text">
          <div class="contact-card-label">${esc(c.label)}</div>
          <div class="contact-card-value">${esc(c.value)}</div>
        </div>
      </a>`).join('');
  }

  /* ---- footer links ---- */
  function renderFooterLinks(footer, wa, email, linkedin) {
    const w = document.getElementById('pf-footer-links');
    if (!w) return;
    const links = [
      { href: wa,              label: 'WhatsApp', external: true  },
      { href: `mailto:${email}`, label: 'Email',  external: false },
      { href: linkedin,        label: 'LinkedIn', external: true  },
    ];
    if (footer.devLink) links.push({ href: footer.devLink.href, label: footer.devLink.label, external: false, cls: 'footer-dev-link' });
    w.innerHTML = links.map(l =>
      `<a href="${l.href}" class="${l.cls||''}" ${l.external ? 'target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`
    ).join('');
  }

  /* ---- canvas ---- */
  function initCanvas() {
    const canvas = document.getElementById('pf-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts;
    const COUNT   = 55;
    const PALETTE = [[255,153,51],[240,120,0],[255,190,106],[230,100,0],[255,210,140]];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function makePoints() {
      pts = Array.from({length:COUNT}, () => ({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-.5)*.5, vy:(Math.random()-.5)*.5,
        r:Math.random()*1.8+.8, c:PALETTE[Math.floor(Math.random()*PALETTE.length)]
      }));
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<150) {
          const [r,g,b]=pts[i].c;
          ctx.strokeStyle=`rgba(${r},${g},${b},${(1-d/150)*.18})`; ctx.lineWidth=.7;
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
        }
      }
      pts.forEach(p => {
        const [r,g,b]=p.c; ctx.fillStyle=`rgba(${r},${g},${b},.7)`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      });
      requestAnimationFrame(draw);
    }
    resize(); makePoints(); draw();
    window.addEventListener('resize', ()=>{ resize(); makePoints(); }, {passive:true});
  }

  /* ---- nav scroll + mobile ---- */
  function initNav() {
    const nav = document.getElementById('pf-nav');
    const hbg = document.getElementById('pf-hamburger');
    const lnk = document.getElementById('pf-nav-links');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), {passive:true});
    if (hbg && lnk) {
      hbg.addEventListener('click', () => lnk.classList.toggle('open'));
      lnk.querySelectorAll('a').forEach(a => a.addEventListener('click', () => lnk.classList.remove('open')));
    }
  }

  /* ---- typewriter ---- */
  function initTypewriter(words) {
    const el = document.getElementById('pf-typewriter');
    if (!el || !words?.length) return;
    let wi=0, ci=0, del=false;
    function tick() {
      const w = words[wi];
      if (!del) {
        el.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del=true; return setTimeout(tick, 1800); }
        setTimeout(tick, 75);
      } else {
        el.textContent = w.slice(0, --ci);
        if (ci === 0) { del=false; wi=(wi+1)%words.length; return setTimeout(tick, 300); }
        setTimeout(tick, 42);
      }
    }
    tick();
  }

  /* ---- counters ---- */
  function initCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el=e.target, end=parseInt(el.dataset.count), sfx=el.dataset.suffix||'';
        let n=0; const step=Math.ceil(end/55);
        const t=setInterval(()=>{ n=Math.min(n+step,end); el.textContent=n+sfx; if(n>=end)clearInterval(t); },28);
        obs.unobserve(el);
      });
    }, {threshold:.5});
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
  }

  /* ---- reveal ---- */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
    }, {threshold:.08});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ---- filter ---- */
  function initFilter() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.pf-card').forEach(c => {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.ext !== f);
      });
      document.querySelectorAll('.pf-card:not(.hidden):not(.visible)').forEach(c => c.classList.add('visible'));
    });
  }

  /* ---- utils ---- */
  function set(id, val, html=false) {
    const el = document.getElementById(id);
    if (!el) return;
    html ? (el.innerHTML = val) : (el.textContent = val);
  }
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
