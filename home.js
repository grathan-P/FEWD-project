// home.js - combined original + updates

// Select the main buttons
const enterBtn = document.getElementsByClassName('primary')[0];
const viewBtn = document.getElementsByClassName('secondary')[0];

// Create the USN input (reused)
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter Student USN';
input.classList.add('usn-input');

// Create student container and inner columns (no inline CSS; styling in home.css)
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
  '4NM21CS001': { name: 'Riya Sharma', img: 'images/student1.png', course: 'B.Tech', branch: 'Computer Science' },
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
