// home.js (updated: preserve student via query string and theme toggle)

// --- Theme handling (persisted to localStorage) ---
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

// set up theme button
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }
  loadTheme();
});

// ---------------- existing home.js content (keeps original behavior) ----------------
const enterBtn = document.getElementsByClassName('primary')[0];
const viewBtn = document.getElementsByClassName('secondary')[0];

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter Student USN';
input.classList.add('usn-input');

const studentContainer = document.createElement('div');
studentContainer.classList.add('student-container');

const imgDiv = document.createElement('div');
imgDiv.classList.add('student-image');

const infoDiv = document.createElement('div');
infoDiv.classList.add('student-info');

// Action buttons container (Assignments / Attendance)
const actionButtons = document.createElement('div');
actionButtons.classList.add('student-action-buttons');

// Assemble container (buttons appended into infoDiv when rendering)
studentContainer.appendChild(imgDiv);
studentContainer.appendChild(infoDiv);

// --- Simulated student data (replace with server call later) ---
const studentData = {
  '1': { name: 'Riya Sharma', img: 'images/student1.png', course: 'B.Tech', branch: 'Computer Science' },
  '4NM21CS002': { name: 'Arjun Kumar', img: 'images/student1.png', course: 'B.Tech', branch: 'Information Technology' },
  '4NM21CS003': { name: 'Sneha Patil', img: 'images/student1.png', course: 'B.Tech', branch: 'Electronics and Communication' }
};

// --- Helper: render student details for a given USN (string) ---
function renderStudent(usnRaw) {
  const usn = (usnRaw || '').trim().toUpperCase();
  if (!usn) {
    alert('Please enter a USN.');
    return;
  }

  // fetch data (simulated)
  const data = studentData[usn] || {
    name: 'Student Not Found',
    img: 'images/default.png',
    course: 'N/A',
    branch: 'N/A'
  };

  // update image column
  imgDiv.innerHTML = `<img src="${data.img}" alt="${data.name}">`;

  // update info column
  infoDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p>USN: ${usn}</p>
    <p>Course: ${data.course}</p>
    <p>Branch: ${data.branch}</p>
  `;

  // prepare action buttons (recreated each render to ensure fresh listeners)
  actionButtons.innerHTML = `
    <button class="btn student-btn assignment-btn">Assignments</button>
    <button class="btn student-btn attendance-btn">Attendance</button>
  `;

  // wire up buttons (navigate and include USN in query string)
  const assignmentBtn = actionButtons.querySelector('.assignment-btn');
  const attendanceBtn = actionButtons.querySelector('.attendance-btn');

  assignmentBtn.addEventListener('click', () => {
    // navigate to assignment page and include usn in query string
    window.location.href = `assignment.html?usn=${encodeURIComponent(usn)}`;
  });

  attendanceBtn.addEventListener('click', () => {
    window.location.href = `attendance.html?usn=${encodeURIComponent(usn)}`;
  });

  // append action buttons under info if not already
  if (!infoDiv.contains(actionButtons)) {
    infoDiv.appendChild(actionButtons);
  }

  // attach the studentContainer to the page if not present
  const mainContent = document.querySelector('.content');
  if (!mainContent.contains(studentContainer)) {
    mainContent.appendChild(studentContainer);
  }

  // show the container (CSS controls display)
  studentContainer.style.display = 'flex';
}

// --- Original behavior: show input when Enter Student USN button clicked ---
enterBtn.addEventListener('click', () => {
  // small transition effect on the button (keeps original feel)
  enterBtn.style.opacity = '0';
  enterBtn.style.transform = 'scale(0.9)';

  setTimeout(() => {
    enterBtn.style.display = 'none';
    // insert input before the View Reports button (same as original)
    viewBtn.parentNode.insertBefore(input, viewBtn);
    input.focus();
  }, 300);
});

// If user presses Enter inside the input, render that student's details
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    renderStudent(input.value);
    // also update the URL so the state is shareable / persists on refresh or navigation
    const usn = (input.value || '').trim().toUpperCase();
    if (usn) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('usn', usn);
      history.replaceState({}, '', newUrl.toString());
    }
  }
});

// --- New: read ?usn= on load and auto-render if present ---
function getUSNfromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('usn') || '').toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
  // if there's a usn in the url, ensure the input is present and filled, then render
  const usn = getUSNfromURL();
  if (usn) {
    // ensure input exists in DOM (so teacher can edit)
    if (!document.body.contains(input)) {
      viewBtn.parentNode.insertBefore(input, viewBtn);
    }
    input.value = usn;
    renderStudent(usn);
  }
});

// --- New behavior: View Reports should display the particular student's details ---
// Cases handled:
// 1) If the input exists and has a value -> render that student's details.
// 2) If input not present -> insert input and focus it so teacher can type.
// 3) If input present but empty -> highlight input briefly and focus it.
viewBtn.addEventListener('click', () => {
  const inputInDom = document.body.contains(input);

  if (inputInDom && input.value.trim() !== '') {
    // input exists and has a value -> render directly
    renderStudent(input.value);
    // update URL to include USN
    const usn = input.value.trim().toUpperCase();
    if (usn) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('usn', usn);
      history.replaceState({}, '', newUrl.toString());
    }
    return;
  }

  // If input not yet inserted, insert it before View Reports and focus
  if (!inputInDom) {
    viewBtn.parentNode.insertBefore(input, viewBtn);
  }
  input.focus();

  // If input present but empty, give a gentle visual nudge (requires CSS class)
  if (input.value.trim() === '') {
    input.classList.add('usn-input--highlight'); // optional - define style in CSS if desired
    setTimeout(() => input.classList.remove('usn-input--highlight'), 900);
  }
});
