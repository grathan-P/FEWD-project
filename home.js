// home.js

// ================= THEME HANDLING (dark / light) =================

const THEME_KEY = 'site_theme';

function applyTheme(theme) {
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

function loadTheme() {
  const t = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(t);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Apply theme and wire toggle button
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  loadTheme();
});

// ================= HOME PAGE LOGIC (USN, student view, buttons) =================

// Buttons from home.html
const enterBtn = document.getElementsByClassName('primary')[0];   // "Enter Student USN"
const viewBtn = document.getElementsByClassName('secondary')[0]; // "View Reports"

// Input for USN (created dynamically)
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter Student USN';
input.classList.add('usn-input');

// Container to show student info + action buttons
const studentContainer = document.createElement('div');
studentContainer.classList.add('student-container');

const imgDiv = document.createElement('div');
imgDiv.classList.add('student-image');

const infoDiv = document.createElement('div');
infoDiv.classList.add('student-info');

// Action buttons (Assignments / Attendance / Report)
const actionButtons = document.createElement('div');
actionButtons.classList.add('student-action-buttons');

studentContainer.appendChild(imgDiv);
studentContainer.appendChild(infoDiv);

// Example student DB (you can extend this)
const studentData = {
  '1': {
    name: 'Riya Sharma',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Computer Science'
  },
  '4NM21CS002': {
    name: 'Arjun Kumar',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Information Technology'
  },
  '4NM21CS003': {
    name: 'Sneha Patil',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Electronics and Communication'
  },
  'NNM24CS999': {
    name: 'rajendra jogi',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Computer Science'
  }
};

// Helper to read USN from URL (?usn=...)
function getUSNfromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('usn') || '').toUpperCase();
}

// Helper to update URL with current USN (so state persists)
function setUSNinURL(usn) {
  const newUrl = new URL(window.location.href);
  if (usn) {
    newUrl.searchParams.set('usn', usn);
  } else {
    newUrl.searchParams.delete('usn');
  }
  history.replaceState({}, '', newUrl.toString());
}

// ================= Render student + buttons =================

function renderStudent(usnRaw) {
  const usn = (usnRaw || '').trim().toUpperCase();
  if (!usn) {
    alert('Please enter a USN.');
    return;
  }

  // Get record (or fallback)
  const data = studentData[usn] || {
    name: 'Student Not Found',
    img: 'images/default.png',
    course: 'N/A',
    branch: 'N/A'
  };

  // Left: image
  imgDiv.innerHTML = `<img src="${data.img}" alt="${data.name}">`;

  // Right: text info
  infoDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p>USN: ${usn}</p>
    <p>Course: ${data.course}</p>
    <p>Branch: ${data.branch}</p>
  `;

  // Action buttons (Assignments / Attendance / Report)
  actionButtons.innerHTML = `
    <button class="btn student-btn assignment-btn">Assignments</button>
    <button class="btn student-btn attendance-btn">Attendance</button>
    <button class="btn student-btn report-btn">Report</button>
  `;

  const assignmentBtn = actionButtons.querySelector('.assignment-btn');
  const attendanceBtn = actionButtons.querySelector('.attendance-btn');
  const reportBtn = actionButtons.querySelector('.report-btn');

  assignmentBtn.addEventListener('click', () => {
    window.location.href = `assignment.html?usn=${encodeURIComponent(usn)}`;
  });

  attendanceBtn.addEventListener('click', () => {
    window.location.href = `attendance.html?usn=${encodeURIComponent(usn)}`;
  });

  // NEW: Report button – opens read-only result page
  reportBtn.addEventListener('click', () => {
    window.location.href = `report.html?usn=${encodeURIComponent(usn)}`;
  });

  if (!infoDiv.contains(actionButtons)) {
    infoDiv.appendChild(actionButtons);
  }

  const mainContent = document.querySelector('.content');
  if (mainContent && !mainContent.contains(studentContainer)) {
    mainContent.appendChild(studentContainer);
  }

  studentContainer.style.display = 'flex';

  // Update URL so state persists on refresh
  setUSNinURL(usn);
}

// ================= Wire buttons & initial load =================

// Click "Enter Student USN" → show input box
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    enterBtn.style.opacity = '0';
    enterBtn.style.transform = 'scale(0.9)';

    setTimeout(() => {
      enterBtn.style.display = 'none';
      viewBtn.parentNode.insertBefore(input, viewBtn);
      input.focus();
    }, 300);
  });
}

// Press Enter in input → show that student's info
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    renderStudent(input.value);
  }
});

// Click "View Reports" → show current USN student, or focus input
if (viewBtn) {
  viewBtn.addEventListener('click', () => {
    const inputInDom = document.body.contains(input);

    if (inputInDom && input.value.trim() !== '') {
      renderStudent(input.value);
      return;
    }

    if (!inputInDom) {
      viewBtn.parentNode.insertBefore(input, viewBtn);
    }
    input.focus();

    if (input.value.trim() === '') {
      input.classList.add('usn-input--highlight');
      setTimeout(() => input.classList.remove('usn-input--highlight'), 900);
    }
  });
}

// On page load, if ?usn= is present, auto-load that student
document.addEventListener('DOMContentLoaded', () => {
  const usn = getUSNfromURL();
  if (usn) {
    if (!document.body.contains(input)) {
      viewBtn.parentNode.insertBefore(input, viewBtn);
    }
    input.value = usn;
    renderStudent(usn);
  }
});
