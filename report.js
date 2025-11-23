// =============== THEME HANDLING (same behaviour as home.js) ===============

const THEME_KEY = 'site_theme';

function applyThemeReport(theme) {
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

function loadThemeReport() {
  const t = localStorage.getItem(THEME_KEY) || 'dark';
  applyThemeReport(t);
}

function toggleThemeReport() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyThemeReport(next);
}

// =============== MAIN LOGIC ===============

document.addEventListener('DOMContentLoaded', () => {
  // Theme wiring
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleThemeReport);
  }
  loadThemeReport();

  // ---------------- MARKS DATABASE ----------------
  const marksDB = {};

  fetch("report.json")
    .then(res => res.json())
    .then(data => {
      Object.assign(marksDB, data);
      initializeReportPage(marksDB);   // Only run after JSON is ready
    })
    .catch(err => {
      console.error("Error loading report.json:", err);
      initializeReportPage(marksDB);   // Try to load (no data)
    });
});

function initializeReportPage(marksDB) {
  // ---------------- DOM ELEMENTS ----------------
  const nameInput = document.getElementById('stuName');
  const usnInput  = document.getElementById('stuUSN');
  const semSelect = document.getElementById('semSelect');

  const tbody        = document.querySelector('#marksTable tbody');
  const noDataEl     = document.getElementById('noData');
  const semCreditsEl = document.getElementById('semCredits');
  const semCPEl      = document.getElementById('semCreditPoints');
  const sgpaEl       = document.getElementById('sgpaCurrent');
  const cumCreditsEl = document.getElementById('cumCredits');
  const cumCPEl      = document.getElementById('cumCreditPoints');
  const overallCgpaEl= document.getElementById('overallCgpa');
  const backlogInfo  = document.getElementById('backlogInfo');

  const printBtn = document.getElementById('print');
  const homeNavBtn = document.getElementById('home-link');

  // ---------------- GET CURRENT STUDENT FROM URL ----------------
  const params = new URLSearchParams(window.location.search);
  const usnParamRaw = params.get('usn') || '1';  // default to USN 1
  const usnParam = usnParamRaw.toUpperCase();

  const record = marksDB[usnParam];

  if (!record) {
    nameInput.value = '';
    usnInput.value  = usnParam;
    noDataEl.style.display = 'block';
    backlogInfo.textContent = 'No data available for this USN.';
    return;
  }

  // Fill student header
  nameInput.value = record.name;
  usnInput.value  = record.usn;

  // ---------------- HELPERS ----------------
  function computeSemesterStats(sem) {
    let credits = 0;
    let creditPoints = 0;
    let backlogs = [];

    sem.subjects.forEach(sub => {
      if (sub.credits > 0) {
        credits += sub.credits;
        creditPoints += sub.credits * sub.gradePoints;
      }

      const rem = (sub.remarks || '').trim().toLowerCase();
      // Anything not Pass / PP is treated as backlog
      if (rem && rem !== 'pass' && rem !== 'pp') {
        backlogs.push(sub);
      }
    });

    const sgpaCalc = credits > 0 ? creditPoints / credits : 0;
    const sgpa = typeof sem.officialSgpa === 'number' ? sem.officialSgpa : sgpaCalc;

    return { credits, creditPoints, sgpa, backlogs };
  }

  function computeOverallStats() {
    let totalCredits = 0;
    let totalCP = 0;
    let allBacklogs = [];

    Object.values(record.semesters).forEach(sem => {
      const { credits, creditPoints, backlogs } = computeSemesterStats(sem);
      totalCredits += credits;
      totalCP += creditPoints;
      allBacklogs = allBacklogs.concat(backlogs);
    });

    const cgpaCalc = totalCredits > 0 ? totalCP / totalCredits : 0;
    const cgpa = typeof record.officialCgpa === 'number' ? record.officialCgpa : cgpaCalc;

    return { totalCredits, totalCP, cgpa, allBacklogs };
  }

  function renderSemester(semKey) {
    const sem = record.semesters[semKey];
    if (!sem) return;

    // Clear table
    tbody.innerHTML = '';

    sem.subjects.forEach((sub, index) => {
      const tr = document.createElement('tr');

      const tdSl = document.createElement('td');
      tdSl.textContent = index + 1;
      tr.appendChild(tdSl);

      const tdCode = document.createElement('td');
      tdCode.textContent = sub.code;
      tr.appendChild(tdCode);

      const tdTitle = document.createElement('td');
      tdTitle.textContent = sub.title;
      tr.appendChild(tdTitle);

      const tdCredits = document.createElement('td');
      tdCredits.textContent = sub.credits > 0 ? sub.credits : '-';
      tr.appendChild(tdCredits);

      const tdGP = document.createElement('td');
      tdGP.textContent = sub.credits > 0 ? sub.gradePoints : '-';
      tr.appendChild(tdGP);

      const tdCP = document.createElement('td');
      const cp = sub.credits > 0 ? sub.credits * sub.gradePoints : '-';
      tdCP.textContent = cp;
      tr.appendChild(tdCP);

      const tdGrade = document.createElement('td');
      tdGrade.textContent = sub.grade;
      tr.appendChild(tdGrade);

      const tdRemarks = document.createElement('td');
      tdRemarks.textContent = sub.remarks || '';
      tr.appendChild(tdRemarks);

      tbody.appendChild(tr);
    });

    // Selected semester stats
    const { credits, creditPoints, sgpa } = computeSemesterStats(sem);
    semCreditsEl.textContent  = credits;
    semCPEl.textContent       = creditPoints;
    sgpaEl.textContent        = sgpa.toFixed(2);

    // Overall stats
    const { totalCredits, totalCP, cgpa, allBacklogs } = computeOverallStats();
    cumCreditsEl.textContent  = totalCredits;
    cumCPEl.textContent       = totalCP;
    overallCgpaEl.textContent = cgpa.toFixed(2);

    // Backlog info
    if (allBacklogs.length === 0) {
      backlogInfo.textContent = 'Backlog Status: No backlogs in any semester.';
    } else {
      const lines = allBacklogs.map(b =>
        `${b.code} – ${b.title} (${b.grade}, ${b.remarks})`
      );
      backlogInfo.textContent = 'Backlog Status: ' + lines.join(' | ');
    }

    noDataEl.style.display = 'none';
  }

  // ---------------- INITIAL RENDER ----------------
  const defaultSem = '1';
  semSelect.value = defaultSem;
  renderSemester(defaultSem);

  // Semester switch
  semSelect.addEventListener('change', () => {
    renderSemester(semSelect.value);
  });

  // Print
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Home link in navbar – keep same student status
  if (homeNavBtn) {
    homeNavBtn.addEventListener('click', () => {
      window.location.href = 'home.html?usn=' + encodeURIComponent(record.usn);
    });
  }
}
