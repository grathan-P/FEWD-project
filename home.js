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
  'NNM24CS001': {
    name: 'Riya Sharma',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: '3rd Semester',
    section: 'A',
    email: 'riya.sharma@nmamit.in',
    phone: '+91 98765 43210',
    attendance: '92%',
    cgpa: '9.93',
    sgpa: '9.95',
    parentName: 'Mr. Rajesh Sharma',
    parentContact: '+91 98123 45678',
    address: 'MIG-45, Sector 12, Bangalore, Karnataka',
    bloodGroup: 'O+'
  },
  'NNM24CS002': {
    name: 'Arjun Kumar',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Information Technology',
    semester: '5th Semester',
    section: 'B',
    email: 'arjun.kumar@nmamit.in',
    phone: '+91 99887 76655',
    attendance: '88%',
    cgpa: '8.45',
    sgpa: '8.30',
    parentName: 'Mrs. Sunita Kumar',
    parentContact: '+91 98234 56789',
    address: 'House No. 23, Jayanagar, Mangalore, Karnataka',
    bloodGroup: 'A+'
  },
  'NNM24CS003': {
    name: 'Sneha Patil',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Electronics and Communication',
    semester: '4th Semester',
    section: 'C',
    email: 'sneha.patil@nmamit.in',
    phone: '+91 97654 32109',
    attendance: '85%',
    cgpa: '8.12',
    sgpa: '7.95',
    parentName: 'Mr. Prakash Patil',
    parentContact: '+91 99345 67890',
    address: 'Flat 12B, Kodialbail, Mangalore, Karnataka',
    bloodGroup: 'B+'
  },
  'NNM24CS004': {
    name: 'rajendra jogi',
    img: 'images/student1.png',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: '2nd Semester',
    section: 'A',
    email: 'rajendra.jogi@nmamit.in',
    phone: '+91 96543 21098',
    attendance: '95%',
    cgpa: '9.10',
    sgpa: '9.20',
    parentName: 'Mrs. Anita Jogi',
    parentContact: '+91 98456 78901',
    address: 'Villa 8, Kadri Hills, Mangalore, Karnataka',
    bloodGroup: 'AB+'
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

  // Check if student exists
  const data = studentData[usn];

  if (!data) {
    // Student not found - show error message only
    imgDiv.innerHTML = '';
    infoDiv.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <i class="fa-solid fa-user-slash" style="font-size: 60px; color: #ef4444; margin-bottom: 15px;"></i>
        <h3 style="color: #ef4444; font-size: 24px; margin-bottom: 10px;">Student Not Found</h3>
        <p style="color: #cbd5e1; font-size: 16px;">No student with USN "${usn}" is recorded in the system.</p>
      </div>
    `;

    const mainContent = document.querySelector('.content');
    if (mainContent && !mainContent.contains(studentContainer)) {
      mainContent.appendChild(studentContainer);
    }

    studentContainer.style.display = 'flex';
    
    // Hide extra details section if student not found
    const extraDetailsSection = document.querySelector('.extra-details-section');
    if (extraDetailsSection) {
      extraDetailsSection.style.display = 'none';
    }
    
    return;
  }

  // Student found - show full details
  // Left: image
  imgDiv.innerHTML = `<img src="${data.img}" alt="${data.name}">`;

  // Right: text info
  infoDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p>USN: ${usn}</p>
    <p>Course: ${data.course}</p>
    <p>Branch: ${data.branch}</p>
  `;

   // Action buttons (Attendance / Report)
   // Extra-Curricular button removed as requested (was: <button class="btn student-btn extra-btn">Extra-Curricular</button>)
   actionButtons.innerHTML = `
    <!-- Extra-Curricular button intentionally removed -->
    <button class="btn student-btn attendance-btn">Attendance</button>
    <button class="btn student-btn report-btn">Report</button>
   `;

  const attendanceBtn = actionButtons.querySelector('.attendance-btn');
  const reportBtn = actionButtons.querySelector('.report-btn');

// Extra-Curricular button removed: no event listener needed


  attendanceBtn.addEventListener('click', () => {
    window.location.href = `attendance.html?usn=${encodeURIComponent(usn)}`;
  });

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

  // Create separate extra details section below the main container
  let extraDetailsSection = document.querySelector('.extra-details-section');
  if (!extraDetailsSection) {
    extraDetailsSection = document.createElement('div');
    extraDetailsSection.classList.add('extra-details-section');
    mainContent.appendChild(extraDetailsSection);
  }

  

  extraDetailsSection.innerHTML = `
    <div class="extra-details">
      <!-- College Information -->
      <div class="detail-item">
        <i class="fa-solid fa-graduation-cap"></i>
        <div class="detail-content">
          <span class="detail-label">Semester</span>
          <span class="detail-value">${data.semester || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-users"></i>
        <div class="detail-content">
          <span class="detail-label">Section</span>
          <span class="detail-value">${data.section || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-calendar-check"></i>
        <div class="detail-content">
          <span class="detail-label">Attendance</span>
          <span class="detail-value">${data.attendance || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-chart-line"></i>
        <div class="detail-content">
          <span class="detail-label">CGPA / SGPA</span>
          <span class="detail-value">${data.cgpa || 'N/A'} / ${data.sgpa || 'N/A'}</span>
        </div>
      </div>
      
      <!-- Personal Information -->
      <div class="detail-item">
        <i class="fa-solid fa-envelope"></i>
        <div class="detail-content">
          <span class="detail-label">Email</span>
          <span class="detail-value">${data.email || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-phone"></i>
        <div class="detail-content">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${data.phone || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-location-dot"></i>
        <div class="detail-content">
          <span class="detail-label">Address</span>
          <span class="detail-value">${data.address || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-droplet"></i>
        <div class="detail-content">
          <span class="detail-label">Blood Group</span>
          <span class="detail-value">${data.bloodGroup || 'N/A'}</span>
        </div>
      </div>
      
      <!-- Parent/Guardian Information -->
      <div class="detail-item">
        <i class="fa-solid fa-user-tie"></i>
        <div class="detail-content">
          <span class="detail-label">Parent/Guardian</span>
          <span class="detail-value">${data.parentName || 'N/A'}</span>
        </div>
      </div>
      
      <div class="detail-item">
        <i class="fa-solid fa-phone-volume"></i>
        <div class="detail-content">
          <span class="detail-label">Parent Contact</span>
          <span class="detail-value">${data.parentContact || 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
  extraDetailsSection.style.display = 'block';

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
    // Hide "Enter Student USN" button if USN is present
    if (enterBtn) {
      enterBtn.style.display = 'none';
    }
    
    if (!document.body.contains(input)) {
      viewBtn.parentNode.insertBefore(input, viewBtn);
    }
    input.value = usn;
    renderStudent(usn);
  }
});
