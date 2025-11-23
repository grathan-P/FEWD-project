// ================== Extra-Curricular Page Script ==================

const THEME_KEY = 'site_theme';

function applyThemeExtra(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.documentElement.classList.remove('light-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function loadThemeExtra() {
  const t = localStorage.getItem(THEME_KEY) || 'dark';
  applyThemeExtra(t);
}

function toggleThemeExtra() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyThemeExtra(next);
}

// Read USN from URL
function getUSNParam() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('usn') || '').toUpperCase();
}

// Render Events
function renderEvents(events = []) {
  if (!events.length) return '<p>No events recorded.</p>';
  let html = '<h2 class="section-heading"><i class="fa-solid fa-calendar-check"></i> Events Participated</h2><div class="events-grid">';
  events.forEach(ev => {
    html += `
      <div class="event-card">
        <h3>${ev.title}</h3>
        <p class="event-meta"><strong>Date:</strong> ${ev.date}</p>
        <p class="event-meta"><strong>Role:</strong> ${ev.role}</p>
        <p class="event-meta"><strong>Venue:</strong> ${ev.venue}</p>
      </div>`;
  });
  html += '</div>';
  return html;
}

// Render Achievements + certificate placeholder gallery
function renderAchievements(list = [], certificates = []) {
  let html = '<h2 class="section-heading"><i class="fa-solid fa-award"></i> Achievements</h2>';
  if (!list.length) {
    html += '<p>No achievements recorded.</p>';
  } else {
    html += '<ul class="achievements-list">';
    list.forEach(item => {
      html += `<li class="achievement-item"><i class="fa-solid fa-circle-dot"></i><span>${item}</span></li>`;
    });
    html += '</ul>';
  }
  // Certificates block
  html += '<div class="certificate-gallery">';
  html += '<h3><i class="fa-solid fa-file-arrow-down"></i> Certificates (Download)</h3>';
  if (!certificates.length) {
    html += '<p style="font-size:13px;color:#94a3b8">No certificates uploaded.</p>';
  } else {
    html += '<ul class="certificates-list">';
    certificates.forEach(c => {
      html += `<li class="certificate-item">
        <h4>${c.title}</h4>
        <a class="download-btn" href="${c.file}" download>
          <i class="fa-solid fa-download"></i> Download PDF
        </a>
      </li>`;
    });
    html += '</ul>';
  }
  html += '</div>';
  return html;
}

// Render Credits
function renderCredits(list = []) {
  if (!list.length) return '<p>No credit points recorded.</p>';
  let html = '<h2 class="section-heading"><i class="fa-solid fa-star"></i> Credit Points</h2><div class="credits-box">';
  list.forEach(item => {
    html += `<div class="credit-item"><strong>Credit</strong>${item}</div>`;
  });
  html += '</div>';
  return html;
}

// Render Roles
function renderRoles(list = []) {
  if (!list.length) return '<p>No roles or responsibilities recorded.</p>';
  let html = '<h2 class="section-heading"><i class="fa-solid fa-user-gear"></i> Roles & Responsibilities</h2><ul class="roles-list">';
  list.forEach(item => {
    html += `<li><i class="fa-solid fa-check-circle"></i><span>${item}</span></li>`;
  });
  html += '</ul>';
  return html;
}

// Load and render a section
async function loadSection(section) {
  const box = document.getElementById('extra-content');
  box.innerHTML = '<p style="color:#94a3b8">Loading...</p>';
  const usn = getUSNParam();
  const usnSpan = document.getElementById('extra-usn');
  if (usnSpan) usnSpan.textContent = usn || '—';

  if (!usn) {
    box.innerHTML = '<p>Please navigate from Home after selecting a student.</p>';
    return;
  }

  try {
    const res = await fetch('extra.json');
    const data = await res.json();
    const student = data[usn];
    if (!student) {
      box.innerHTML = `<p>No records found for USN: ${usn}</p>`;
      return;
    }
    let html = '';
    switch (section) {
      case 'events': html = renderEvents(student.eventsParticipated); break;
      case 'achievements': html = renderAchievements(student.achievements, student.certificates || []); break;
      case 'credits': html = renderCredits(student.credits); break;
      case 'roles': html = renderRoles(student.roles); break;
      default: html = '<p>Unknown section.</p>'; break;
    }
    box.innerHTML = html;
  } catch (e) {
    box.innerHTML = '<p>Error loading extra-curricular data.</p>';
  }
}

// Activate tab UI
function setActiveTab(clicked) {
  document.querySelectorAll('.extra-sidebar .tab').forEach(li => li.classList.remove('active'));
  clicked.classList.add('active');
}

// Wire up interactions
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleThemeExtra);
  loadThemeExtra();

  // Home navigation preserves USN
  const homeBtn = document.getElementById('home-link');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      const usn = getUSNParam();
      if (usn) window.location.href = `home.html?usn=${encodeURIComponent(usn)}`;
      else window.location.href = 'home.html';
    });
  }

  // Tabs
  document.querySelectorAll('.extra-sidebar .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveTab(tab);
      loadSection(tab.getAttribute('data-section'));
    });
  });

  // Initial load (default events)
  loadSection('events');
});
