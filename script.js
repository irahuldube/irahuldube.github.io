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
  familiar_with: "familiar_with"
};

const PROJECT_EXT_LABEL = {
  api: "API",
  saas: "SAAS",
  iot: "IOT"
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
  renderSummary(data.summary);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderCertifications(data.certifications);
  renderContact(data.profile);
  document.getElementById('footerName').textContent = data.profile.name;
  document.getElementById('year').textContent = new Date().getFullYear();
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
function renderSummary(summary) {
  document.getElementById('summaryText').textContent = summary;
}

/* ---------------- SKILLS ---------------- */
function renderSkills(skills) {
  const wrap = document.getElementById('skillsBlock');
  wrap.innerHTML = skills.map(group => `
    <div class="config-row">
      <span class="config-key">${escapeHtml(SKILL_LABELS[group.category] || group.category)}</span>
      <div class="config-values">
        ${group.items.map(i => `<span class="chip">${escapeHtml(i)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ---------------- EXPERIENCE ---------------- */
function renderExperience(experience) {
  const wrap = document.getElementById('experienceList');
  wrap.innerHTML = experience.map(job => `
    <div class="timeline-item ${job.current ? 'current' : ''}">
      <span class="timeline-dot"></span>
      <div class="timeline-header">
        <span class="timeline-role">${escapeHtml(job.role)}</span>
        ${job.current ? '<span class="timeline-badge">current</span>' : ''}
      </div>
      <div class="timeline-company">${escapeHtml(job.company)}</div>
      <div class="timeline-sub">${escapeHtml(job.location)} &nbsp;·&nbsp; ${escapeHtml(job.duration)}</div>
      <ul class="timeline-points">
        ${job.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ---------------- PROJECTS ---------------- */
function renderProjects(projects) {
  const wrap = document.getElementById('projectGrid');
  wrap.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-head">
        <span class="project-name">${escapeHtml(p.name)}</span>
        <span class="project-ext">.${escapeHtml(PROJECT_EXT_LABEL[p.ext] || p.ext)}</span>
      </div>
      <ul class="project-points">
        ${p.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
      </ul>
      <div class="project-stack">
        ${p.stack.map(s => `<span>${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ---------------- EDUCATION ---------------- */
function renderEducation(education) {
  const wrap = document.getElementById('eduBlock');
  wrap.innerHTML = education.map(e => `
    <div class="edu-degree">${escapeHtml(e.degree)}</div>
    <div class="edu-institute">${escapeHtml(e.institute)}</div>
    <div class="edu-duration">${escapeHtml(e.duration)}</div>
    <div class="edu-detail">${escapeHtml(e.detail)}</div>
  `).join('');
}

/* ---------------- CERTIFICATIONS ---------------- */
function renderCertifications(certs) {
  const wrap = document.getElementById('certList');
  wrap.innerHTML = certs.map(c => `<li>${escapeHtml(c)}</li>`).join('');
}

/* ---------------- CONTACT ---------------- */
function renderContact(profile) {
  const items = [
    { icon: '✉', label: 'email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: '☎', label: 'phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    { icon: 'in', label: 'linkedin', value: 'rahuldubeme', href: profile.linkedin },
    { icon: '⌥', label: 'github', value: 'rahuldubeyme', href: profile.github },
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

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const fileItems = document.querySelectorAll('.file-item');
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.section[id]');

  // scrim for mobile drawer
  const scrim = document.createElement('div');
  scrim.className = 'sidebar-scrim';
  document.body.appendChild(scrim);

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

  fileItems.forEach(item => {
    item.addEventListener('click', () => closeDrawer());
  });

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
