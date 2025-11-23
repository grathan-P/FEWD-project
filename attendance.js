// =============== THEME HANDLING (same behaviour as home.js) ===============

const THEME_KEY = 'site_theme';

function applyThemeAttendance(theme) {
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

function loadThemeAttendance() {
  const t = localStorage.getItem(THEME_KEY) || 'dark';
  applyThemeAttendance(t);
}

function toggleThemeAttendance() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyThemeAttendance(next);
}

// ---------- Get USN from URL ----------
function getUSNfromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("usn") || "").toUpperCase();
}

// ---------- Data ----------
const subjects = [
  { name: "MATHS", tcc: 46 },
  { name: "DS", tcc: 70 },
  { name: "OOPS", tcc: 65 },
  { name: "COA", tcc: 31 },
  { name: "FEWD", tcc: 55 },
  { name: "R", tcc: 24 },
  { name: "IDT", tcc: 10 },
  { name: "DPS", tcc: 13 },
  { name: "EOIC", tcc: 15 }
];

// sample data – you can extend this
let studentAttendance = {};

fetch("attendance.json")
  .then(res => res.json())
  .then(data => {
    studentAttendance = data.attendance;
    console.log("Students attendance loaded:", studentAttendance);

    // If URL already has a attendance, load it after JSON is ready
    loadAttendance();
  })
   .catch(err => console.error("Error loading student attendance data:", err));
// ---------- Load Attendance ----------
function loadAttendance() {
  const usn = getUSNfromURL();
  const tbody = document.querySelector("#attendance-body");
  const usnSpan = document.querySelector("#attendance-usn");

  if (usnSpan) usnSpan.textContent = usn || "—";

  // no usn or not found
  if (!usn || !studentAttendance[usn]) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; padding:20px; color:#ef4444;">Invalid or Missing USN. Please go back and select a valid student.</td></tr>';
    return;
  }

  const tcaList = studentAttendance[usn];
  tbody.innerHTML = "";

  subjects.forEach((sub, index) => {
    const tca = tcaList[index];
    const perc = ((tca / sub.tcc) * 100).toFixed(1);

    let colorClass = "";
    if (perc < 75) colorClass = "perc-red";
    else if (perc >= 75 && perc < 85) colorClass = "perc-orange";
    else colorClass = "perc-green";

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${sub.name}</td>
        <td>${sub.tcc}</td>
        <td>${tca}</td>
        <td class="${colorClass}">${perc}%</td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
  // Theme wiring
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleThemeAttendance);
  }
  loadThemeAttendance();

  // Home button
  const homeBtn = document.getElementById('home-link');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      const currentUSN = getUSNfromURL();
      if (currentUSN) {
        window.location.href = `home.html?usn=${encodeURIComponent(currentUSN)}`;
      } else {
        window.location.href = 'home.html';
      }
    });
  }

  // Load attendance data
  loadAttendance();
});
