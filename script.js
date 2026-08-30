/* =========================================================
   DATA-DRIVEN RENDER
   All content is fetched from data.json — edit that file to
   update the site, no HTML changes required.
========================================================= */

const SKILL_LABELS = {
  languages: "languages",
  backend: "backend",
  databases: "databases",
  orm_odm: "orm / odm",
  payments: "payments",
  frontend: "frontend",
  devops: "devops",
  familiar_with: "familiar_with",
  ai_ml: "ai / ml"
};

const PROJECT_EXT_LABEL = {
  api: "API",
  saas: "SAAS",
  iot: "IOT",
  ai: "AI"
};

async function loadData() {
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load data.json');
    const data = await res.json();
    render(data);
  } catch (err) {
    console.error(err);
    document.getElementById('app').innerHTML =
      '<p style="padding:40px;font-family:monospace;color:#f0796f;">Error: could not load data.json — ' + err.message + '</p>';
  }
}

function render(data) {
  document.title = data.meta.siteTitle;
  renderHero(data.profile);
  renderSummary(data.summary, data.profile, data.projects);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderCertifications(data.certifications);
  renderContact(data.profile);
}

/* ---------------- HERO ---------------- */
function renderHero(profile) {
  document.getElementById('heroName').textContent = profile.name;
  document.getElementById('heroTitle').textContent =
    `${profile.title} · ${profile.experience}`;
  document.getElementById('heroLocation').textContent = `📍 ${profile.location}`;
  document.getElementById('heroExperience').textContent = `${profile.experience} experience`;

  const stackWrap = document.getElementById('heroStack');
  stackWrap.innerHTML = profile.stack
    .map(s => `<span class="tag">${escapeHtml(s)}</span>`)
    .join('');

  // wire up resume download button
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn && profile.resumeUrl) {
    resumeBtn.href = profile.resumeUrl;
    resumeBtn.setAttribute('download', profile.name.replace(/\s+/g, '_') + './data/_Backend-5EXP-Resume.Rahul_Dubey.pdf');
  } else if (resumeBtn) {
    resumeBtn.style.display = 'none';
  }

  typeTerminal(profile.terminalLines);
}

function typeTerminal(lines) {
  const body = document.getElementById('terminalBody');
  body.innerHTML = '';
  let lineIndex = 0;
  let charIndex = 0;

  function nextChar() {
    if (lineIndex >= lines.length) return;
    const currentText = lines[lineIndex];
    let lineEl = body.children[lineIndex];
    if (!lineEl) {
      lineEl = document.createElement('div');
      lineEl.className = 'term-line';
      const isPrompt = currentText.startsWith('$');
      if (isPrompt) lineEl.innerHTML = '<span class="term-prompt"></span>';
      body.appendChild(lineEl);
    }

    const isPrompt = currentText.startsWith('$');
    const target = isPrompt ? lineEl.querySelector('.term-prompt') : lineEl;
    target.textContent = currentText.slice(0, charIndex + 1);

    charIndex++;
    if (charIndex < currentText.length) {
      setTimeout(nextChar, isPrompt ? 34 : 14);
    } else {
      lineIndex++;
      charIndex = 0;
      if (lineIndex < lines.length) {
        setTimeout(nextChar, 260);
      } else {
        const cursor = document.createElement('span');
        cursor.className = 'term-cursor';
        body.appendChild(cursor);
      }
    }
  }
  nextChar();
}

/* ---------------- SUMMARY ---------------- */
function renderSummary(summary, profile, projects) {
  document.getElementById('summaryText').textContent = summary;
  const expYears = parseInt(profile.experience) || 5;
  const projectCount = projects ? projects.length : 10;
  document.getElementById('aboutStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${expYears}+</div>
      <div class="stat-label">Years Exp.</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${20}+</div>
      <div class="stat-label">Projects</div>
    </div>
  `;
}

/* ---------------- SKILLS ---------------- */
function renderSkills(skills) {
  const wrap = document.getElementById('skillsBlock');
  const rows = skills.filter(group => group.visible !== false).map(group => `
    <div class="config-row">
      <span class="config-key">${escapeHtml(SKILL_LABELS[group.category] || group.category)}</span>
      <div class="config-values">
        ${group.items.map(i => `<span class="chip">${escapeHtml(i)}</span>`).join('')}
      </div>
    </div>
  `).join('');
  // keep the header that's already in HTML, append rows after it
  const header = wrap.querySelector('.config-block-header');
  wrap.innerHTML = '';
  if (header) wrap.appendChild(header);
  wrap.insertAdjacentHTML('beforeend', rows);
}

/* ---------------- EXPERIENCE ---------------- */
function renderExperience(experience) {
  const wrap = document.getElementById('experienceList');
  wrap.innerHTML = experience.map(job => `
    <div class="timeline-item ${job.current ? 'current' : ''}">
      <span class="timeline-dot"></span>
      <div class="timeline-card ${job.certificate ? 'has-cert' : ''}" ${job.certificate ? `data-cert="${job.certificate}" data-cert-title="${escapeHtml(job.company)} — Internship Certificate"` : ''}>
        <div class="timeline-header">
          <span class="timeline-role">${escapeHtml(job.role)}</span>
          ${job.current ? '<span class="timeline-badge">● current</span>' : ''}
          ${job.certificate ? '<span class="timeline-cert-badge">🎓 View Certificate</span>' : ''}
        </div>
        <div class="timeline-company">
          ${job.url
            ? `<a class="record-link" href="${job.url}" target="_blank" rel="noopener">${escapeHtml(job.company)}</a>`
            : escapeHtml(job.company)}
        </div>
        <div class="timeline-sub">${escapeHtml(job.location)} &nbsp;·&nbsp; ${escapeHtml(job.duration)}</div>
        <ul class="timeline-points">
          ${job.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // wire up certificate click
  wrap.querySelectorAll('.timeline-card.has-cert').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openCertModal(card.dataset.cert, card.dataset.certTitle);
    });
  });
}

/* ---------------- PROJECTS ---------------- */
const PROJECT_EXT_COLOR = {
  api:  { color: '#4fd1c5', bg: 'rgba(79,209,197,.12)'  },
  saas: { color: '#e3a53c', bg: 'rgba(227,165,60,.12)'  },
  iot:  { color: '#f0796f', bg: 'rgba(240,121,111,.12)' },
  ai:   { color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
};

function renderProjects(projects) {
  const carousel = document.getElementById('projectCarousel');
  const dotsWrap = document.getElementById('carouselDots');
  const countEl  = document.getElementById('carouselCount');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');

  const PLAY_ICON  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6.6C3 4.1 5.7 2.6 7.8 3.9l12.3 7.4c2 1.2 2 4.2 0 5.4L7.8 24.1C5.7 25.4 3 23.9 3 21.4V6.6z"/></svg>`;
  const APPLE_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.7 12.4c0-2.9 2.4-4.3 2.5-4.4-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1s-2.3-1-3.8-1c-1.9 0-3.7 1.1-4.7 2.8-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.9 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.9 2.6-1.4 3.5-2.8c1.1-1.6 1.6-3.2 1.6-3.3-.1 0-3-.1-3.9-2.2zm-3.6-12C15.8.9 16.6 0 16.6 0c-1.6.1-3.5 1.1-4.6 2.5-.9 1.1-1.7 2.8-1.5 4.5 1.8.1 3.5-1 4.6-2.6z"/></svg>`;
  const GLOBE_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

  const visible = projects.filter(p => p.visible !== false);

  carousel.innerHTML = visible.map((p, i) => {
    const extLabel = PROJECT_EXT_LABEL[p.ext] || p.ext;
    const extStyle = PROJECT_EXT_COLOR[p.ext] || { color: '#cbd5e1', bg: 'rgba(255,255,255,.08)' };

    const imgHtml = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)} screenshot" class="pcard-img" loading="lazy">`
      : `<div class="pcard-img pcard-img-placeholder">
           <span class="pcard-img-label">${escapeHtml(p.name.slice(0,2).toUpperCase())}</span>
         </div>`;

    const links = [];
    if (p.url)       links.push(`<a class="pcard-link pcard-link-web"   href="${p.url}"       target="_blank" rel="noopener">${GLOBE_ICON} Website</a>`);
    if (p.playstore) links.push(`<a class="pcard-link pcard-link-play"  href="${p.playstore}" target="_blank" rel="noopener">${PLAY_ICON} Play Store</a>`);
    if (p.appstore)  links.push(`<a class="pcard-link pcard-link-apple" href="${p.appstore}"  target="_blank" rel="noopener">${APPLE_ICON} App Store</a>`);

    const cardUrl = p.url || p.playstore || p.appstore || '';
    const cardClickAttr = cardUrl ? `data-url="${cardUrl}" style="cursor:pointer;"` : '';

    return `
    <div class="pcard" role="group" aria-label="Project ${i+1} of ${visible.length}: ${escapeHtml(p.name)}" ${cardClickAttr}>
      ${imgHtml}
      <div class="pcard-body">
        <div class="pcard-head">
          <div class="pcard-title-row">
            <h3 class="pcard-name">${escapeHtml(p.name)}</h3>
            <span class="pcard-ext" style="color:${extStyle.color};background:${extStyle.bg};">.${escapeHtml(extLabel)}</span>
          </div>
          <p class="pcard-desc">${escapeHtml(p.description || '')}</p>
        </div>
        <ul class="pcard-points">
          ${p.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
        </ul>
        <div class="pcard-stack">
          ${p.stack.map(s => `<span>${escapeHtml(s)}</span>`).join('')}
        </div>
        ${links.length ? `<div class="pcard-links">${links.join('')}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // dots
  dotsWrap.innerHTML = visible.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to project ${i+1}"></button>`
  ).join('');

  // state
  let current = 0;
  const cards = carousel.querySelectorAll('.pcard');
  const dots  = dotsWrap.querySelectorAll('.carousel-dot');

  function goTo(idx) {
    current = (idx + visible.length) % visible.length;
    const card = cards[current];
    // scroll the card into view relative to the carousel container
    carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    countEl.textContent = `${current + 1} / ${visible.length}`;
  }

  countEl.textContent = `1 / ${visible.length}`;
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

  // card click → open project URL
  cards.forEach(card => {
    const url = card.dataset.url;
    if (!url) return;
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  // sync dots on native scroll (use getBoundingClientRect for accuracy)
  let scrollTimer;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const carouselRect = carousel.getBoundingClientRect();
      const midX = carouselRect.left + carouselRect.width / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardMid = rect.left + rect.width / 2;
        const dist = Math.abs(cardMid - midX);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      if (closest !== current) {
        current = closest;
        dots.forEach((d, j) => d.classList.toggle('active', j === current));
        countEl.textContent = `${current + 1} / ${visible.length}`;
      }
    }, 80);
  });
}


/* ---------------- CERTIFICATE MODAL ---------------- */
function openCertModal(src, title) {
  const modal = document.getElementById('certModal');
  const img   = document.getElementById('certModalImg');
  const ttl   = document.getElementById('certModalTitle');
  img.src = src;
  img.alt = title;
  ttl.textContent = title;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

/* ---------------- EDUCATION ---------------- */
function renderEducation(education) {
  const wrap = document.getElementById('eduBlock');
  wrap.innerHTML = education.map(e => `
    <div class="edu-degree">${escapeHtml(e.degree)}</div>
    <div class="edu-institute">
      ${e.url
        ? `<a class="record-link" href="${e.url}" target="_blank" rel="noopener">${escapeHtml(e.institute)}</a>`
        : escapeHtml(e.institute)}
    </div>
    <div class="edu-duration">${escapeHtml(e.duration)}</div>
    <div class="edu-detail">${escapeHtml(e.detail)}</div>
  `).join('');
}

/* ---------------- CERTIFICATIONS ---------------- */
function renderCertifications(certs) {
  const wrap = document.getElementById('certList');
  wrap.innerHTML = certs.map(c => {
    const name = typeof c === 'string' ? c : c.name;
    const url  = typeof c === 'string' ? '' : c.url;
    return `<li>${url
      ? `<a class="record-link" href="${url}" target="_blank" rel="noopener">${escapeHtml(name)}</a>`
      : escapeHtml(name)}</li>`;
  }).join('');
}

/* ---------------- CONTACT ---------------- */
function renderContact(profile) {
  const items = [
    { icon: '✉', label: 'email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: '☎', label: 'phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    { icon: 'in', label: 'linkedin', value: 'irahuldube', href: profile.linkedin },
    { icon: '⌥', label: 'github', value: 'irahuldube', href: profile.github },
    { icon: '⌖', label: 'location', value: profile.location, href: null },
  ];
  const wrap = document.getElementById('contactGrid');
  wrap.innerHTML = items.map(i => {
    const inner = `
      <span class="contact-icon">${i.icon}</span>
      <div>
        <div class="contact-label">${i.label}</div>
        <div class="contact-value">${escapeHtml(i.value)}</div>
      </div>`;
    return i.href
      ? `<a class="contact-card" href="${i.href}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="contact-card">${inner}</div>`;
  }).join('');
}

/* ---------------- UTIL ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* =========================================================
   NAVIGATION / TABS / SIDEBAR DRAWER / SCROLLSPY
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // cert modal close
  const certModal = document.getElementById('certModal');
  document.getElementById('certModalClose').addEventListener('click', closeCertModal);
  certModal.addEventListener('click', e => { if (e.target === certModal) closeCertModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal(); });

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.section[id]');

  // scrim for mobile drawer
  const scrim = document.createElement('div');
  scrim.className = 'sidebar-scrim';
  document.body.appendChild(scrim);

  if (menuBtn) {
    function openDrawer() {
      sidebar.classList.add('open');
      scrim.classList.add('show');
      document.body.classList.add('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeDrawer() {
      sidebar.classList.remove('open');
      scrim.classList.remove('show');
      document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    menuBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    scrim.addEventListener('click', closeDrawer);
    fileItems.forEach(item => item.addEventListener('click', () => closeDrawer()));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = document.getElementById(tab.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function setActive(id) {
    fileItems.forEach(el => el.classList.toggle('active', el.dataset.target === id));
    tabs.forEach(el => el.classList.toggle('active', el.dataset.target === id));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
});
