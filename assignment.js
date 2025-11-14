// assignment.js (updated: includes Delete button handling)
// Shared assignments + per-student submissions using localStorage

const studentDB = {
  '1': { name: 'Riya Sharma', img: 'images/student1.png', course: 'B.Tech - Computer Science' },
  '4NM21CS002': { name: 'Arjun Kumar', img: 'images/student2.png', course: 'B.Tech - Information Technology' },
  '4NM21CS003': { name: 'Sneha Patil', img: 'images/student3.png', course: 'B.Tech - E&C' },
};

// --- localStorage helpers ---
function loadAssignments() {
  try { return JSON.parse(localStorage.getItem('assignments') || '[]'); }
  catch (e) { return []; }
}
function saveAssignments(list) { localStorage.setItem('assignments', JSON.stringify(list)); }
function loadSubmissions() {
  try { return JSON.parse(localStorage.getItem('submissions') || '{}'); }
  catch (e) { return {}; }
}
function saveSubmissions(obj) { localStorage.setItem('submissions', JSON.stringify(obj)); }

// --- get USN from query string ---
function getUSNfromURL() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('usn') || '').toUpperCase();
}

// --- DOM refs ---
const assignmentsContainer = document.getElementById('assignmentsContainer');
const studentImg = document.getElementById('studentImg');
const studentNameEl = document.getElementById('studentName');
const studentUSNEl = document.getElementById('studentUSN');
const studentCourseEl = document.getElementById('studentCourse');

const aTitle = document.getElementById('aTitle');
const aDesc = document.getElementById('aDesc');
const aDue = document.getElementById('aDue');
const addAssignBtn = document.getElementById('addAssignBtn');
const clearAssignBtn = document.getElementById('clearAssignBtn');

let currentUSN = getUSNfromURL();
if (!currentUSN) {
  studentNameEl.textContent = 'No student selected';
  studentUSNEl.textContent = 'USN: -';
  studentImg.src = 'images/default.png';
  studentCourseEl.textContent = '';
} else {
  const rec = studentDB[currentUSN];
  if (rec) {
    studentNameEl.textContent = rec.name;
    studentUSNEl.textContent = `USN: ${currentUSN}`;
    studentImg.src = rec.img || 'images/default.png';
    studentCourseEl.textContent = rec.course || '';
  } else {
    studentNameEl.textContent = 'Unknown Student';
    studentUSNEl.textContent = `USN: ${currentUSN}`;
    studentImg.src = 'images/default.png';
    studentCourseEl.textContent = '';
  }
}

// unique id for assignments
function uid() { return 'a_' + Math.random().toString(36).slice(2, 9); }

// render assignments list
function renderAssignments() {
  const list = loadAssignments();
  const subs = loadSubmissions();
  const studentSubs = (currentUSN && subs[currentUSN]) ? subs[currentUSN] : [];

  assignmentsContainer.innerHTML = '';

  if (list.length === 0) {
    assignmentsContainer.innerHTML = `<div class="no-assign">No assignments yet. Add one from the right panel.</div>`;
    return;
  }

  // newest first
  list.slice().reverse().forEach(assign => {
    const card = document.createElement('div');
    card.className = 'assign-card';

    const submitted = currentUSN && studentSubs.includes(assign.id);

    card.innerHTML = `
      <div style="flex:1">
        <h3>${escapeHtml(assign.title)}</h3>
        <p>${escapeHtml(assign.description || '')}</p>
        <div class="assign-meta">Due: ${assign.dueDate || 'No due date'}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
        <div style="font-size:13px;color:${submitted ? '#86efac' : '#fda4af'};font-weight:600;">
          ${submitted ? 'Submitted' : 'Not submitted'}
        </div>
        <div style="display:flex;gap:8px;">
          ${ currentUSN ? `<button class="btn student-btn ${submitted ? 'attendance-btn' : 'assignment-btn'} mark-btn" data-id="${assign.id}">
              ${submitted ? 'Mark Unsubmit' : 'Mark as submitted'}
            </button>` : '' }
          <button class="btn student-btn attendance-btn view-btn" data-id="${assign.id}">Details</button>
          <button class="btn delete-btn delete-btn-card" data-id="${assign.id}">Delete</button>
        </div>
      </div>
    `;

    // attach listeners
    const markBtn = card.querySelector('.mark-btn');
    if (markBtn) markBtn.addEventListener('click', () => toggleSubmission(assign.id));

    const viewBtn = card.querySelector('.view-btn');
    if (viewBtn) viewBtn.addEventListener('click', () => {
      alert(`Assignment: ${assign.title}\n\n${assign.description || '(no description)'}\n\nDue: ${assign.dueDate || 'No due date'}`);
    });

    const deleteBtn = card.querySelector('.delete-btn-card');
    if (deleteBtn) deleteBtn.addEventListener('click', () => {
      deleteAssignment(assign.id);
    });

    assignmentsContainer.appendChild(card);
  });
}

// toggle submission for currentUSN and assignment id
function toggleSubmission(assignmentId) {
  if (!currentUSN) {
    alert('Open this page with ?usn=STUDENT_USN to mark submissions for a student.');
    return;
  }
  const subs = loadSubmissions();
  subs[currentUSN] = subs[currentUSN] || [];
  const idx = subs[currentUSN].indexOf(assignmentId);
  if (idx === -1) subs[currentUSN].push(assignmentId);
  else subs[currentUSN].splice(idx, 1);
  saveSubmissions(subs);
  renderAssignments();
}

// delete assignment (with confirm) and remove from submissions
function deleteAssignment(assignmentId) {
  if (!confirm('Delete this assignment for everyone? This action cannot be undone.')) return;

  // remove from assignments list
  let list = loadAssignments();
  list = list.filter(a => a.id !== assignmentId);
  saveAssignments(list);

  // remove assignment id from all submissions
  const subs = loadSubmissions();
  Object.keys(subs).forEach(usn => {
    subs[usn] = subs[usn].filter(id => id !== assignmentId);
    if (subs[usn].length === 0) delete subs[usn];
  });
  saveSubmissions(subs);

  renderAssignments();
}

// add assignment handler
addAssignBtn.addEventListener('click', () => {
  const title = aTitle.value.trim();
  const desc = aDesc.value.trim();
  const due = aDue.value || '';

  if (!title) { alert('Please enter a title for the assignment.'); return; }

  const list = loadAssignments();
  const newAssign = { id: uid(), title, description: desc, dueDate: due, createdAt: Date.now() };
  list.push(newAssign);
  saveAssignments(list);

  // clear form
  aTitle.value = ''; aDesc.value = ''; aDue.value = '';

  renderAssignments();
});

// clear all assignments (with confirm)
clearAssignBtn.addEventListener('click', () => {
  if (!confirm('Clear all assignments? This removes assignments for everyone.')) return;
  saveAssignments([]);
  // also remove assignment references from submissions
  // keep submissions empty object
  saveSubmissions({});
  renderAssignments();
});

// escape helper
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}

// initial render
renderAssignments();
