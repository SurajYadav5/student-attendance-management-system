/**
 * EduTrack Pro — Core Application Logic
 * Class 10 IT Project — Student Attendance Management System
 */

// Global State
let currentRegisterRecords = [];
let allStudentsList = [];
let searchDebounceTimer = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  setupNavigation();
  setupFilters();

  // Load Initial Data
  loadDashboardAnalytics();
  loadAttendanceRegister();
  loadDefaulters();
  loadStudentsDirectory();
  loadSpreadsheetMatrix();
});

// Real-Time Clock
function initClock() {
  const clockEl = document.getElementById('current-datetime');
  function update() {
    const now = new Date();
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    if (clockEl) clockEl.textContent = now.toLocaleDateString('en-IN', options);
  }
  update();
  setInterval(update, 1000);
}

// Tab Switching
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
  });

  // Switch tab pane
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  // Update Page Title
  const titles = {
    dashboard: { title: 'Dashboard & Analytics', sub: 'Real-time attendance intelligence and daily class summaries' },
    attendance: { title: 'Daily Attendance Register', sub: 'Mark, review, and synchronize classroom attendance records' },
    defaulters: { title: 'Defaulter Radar (<75%)', sub: 'CBSE Rule 13 compliance radar & parent notification dispatch' },
    students: { title: 'Student Directory', sub: 'Comprehensive roster with enrollment details & attendance cards' },
    reports: { title: 'Spreadsheet & Analytical Reports', sub: 'CBSE IT practical spreadsheet matrix, formulas & CSV export' },
    syllabus: { title: 'Class 10 IT Project File Guide', sub: 'Curriculum structure, 20+ page file breakdown, & ready artifacts' }
  };

  const meta = titles[tabId] || titles.dashboard;
  document.getElementById('page-title').textContent = meta.title;
  document.getElementById('page-subtitle').textContent = meta.sub;

  // Tab specific refreshes
  if (tabId === 'dashboard') loadDashboardAnalytics();
  if (tabId === 'attendance') loadAttendanceRegister();
  if (tabId === 'defaulters') loadDefaulters();
  if (tabId === 'students') loadStudentsDirectory();
  if (tabId === 'reports') loadSpreadsheetMatrix();
}

function setupFilters() {
  const dateInput = document.getElementById('att-date-picker');
  const classSelect = document.getElementById('att-class-select');
  const secSelect = document.getElementById('att-section-select');

  if (dateInput) dateInput.addEventListener('change', () => loadAttendanceRegister());
  if (classSelect) classSelect.addEventListener('change', () => loadAttendanceRegister());
  if (secSelect) secSelect.addEventListener('change', () => loadAttendanceRegister());
}

// -------------------------------------------------------------
// 1. Dashboard Analytics
// -------------------------------------------------------------
async function loadDashboardAnalytics() {
  const today = document.getElementById('att-date-picker')?.value || '2026-10-29';
  try {
    const res = await fetch(`/api/analytics/dashboard?date=${today}`);
    const json = await res.json();
    if (!json.success) return;

    const { totalStudents, todayStats, defaulterCount, trend, classComparison } = json.data;

    // Update KPIs
    document.getElementById('kpi-total-students').textContent = totalStudents;
    document.getElementById('kpi-rate').textContent = `${todayStats.attendanceRate}%`;
    document.getElementById('kpi-present-count').textContent = todayStats.present;
    document.getElementById('kpi-present-sub').textContent = `${todayStats.late} late • ${todayStats.halfDay} half-day`;
    document.getElementById('kpi-absent-count').textContent = todayStats.absent;
    document.getElementById('kpi-defaulter-count').textContent = defaulterCount;

    // Render Canvas Trend Chart & Class Comparison
    renderTrendChart(trend);
    renderClassComparison(classComparison);
  } catch (err) {
    console.error('Failed to load dashboard', err);
  }
}

// -------------------------------------------------------------
// 2. Attendance Register Table
// -------------------------------------------------------------
async function loadAttendanceRegister() {
  const date = document.getElementById('att-date-picker')?.value || '2026-10-29';
  const cls = document.getElementById('att-class-select')?.value || '10';
  const sec = document.getElementById('att-section-select')?.value || 'A';
  const tbody = document.getElementById('attendance-register-tbody');

  try {
    const res = await fetch(`/api/attendance?date=${date}&class=${cls}&section=${sec}`);
    const json = await res.json();
    if (!json.success) return;

    currentRegisterRecords = json.records;

    // Update Ribbon Stats
    document.getElementById('ribbon-class-sec').textContent = `${cls}-${sec}`;
    document.getElementById('ribbon-total').textContent = json.summary.total;
    document.getElementById('ribbon-present').textContent = json.summary.present;
    document.getElementById('ribbon-absent').textContent = json.summary.absent;
    document.getElementById('ribbon-late').textContent = json.summary.late;
    document.getElementById('ribbon-half').textContent = json.summary.halfDay;
    document.getElementById('ribbon-pct').textContent = `${json.summary.presentRate}%`;

    // Render Rows
    tbody.innerHTML = currentRegisterRecords.map((r, idx) => {
      const isPresent = r.status === 'Present';
      const isAbsent = r.status === 'Absent';
      const isLate = r.status === 'Late';
      const isHalf = r.status === 'Half-Day';

      return `
        <tr id="row-${r.studentId}">
          <td><strong>#${r.rollNo}</strong></td>
          <td>
            <strong>${escapeHtml(r.name)}</strong>
          </td>
          <td><span class="text-dim" style="font-family: monospace;">${r.studentId}</span></td>
          <td><span class="text-muted">${r.gender}</span></td>
          <td>
            <div class="status-pill-group">
              <button type="button" class="status-chip ${isPresent ? 'selected-Present' : ''}" onclick="setRowStatus('${r.studentId}', 'Present')">Present</button>
              <button type="button" class="status-chip ${isAbsent ? 'selected-Absent' : ''}" onclick="setRowStatus('${r.studentId}', 'Absent')">Absent</button>
              <button type="button" class="status-chip ${isLate ? 'selected-Late' : ''}" onclick="setRowStatus('${r.studentId}', 'Late')">Late</button>
              <button type="button" class="status-chip ${isHalf ? 'selected-Half-Day' : ''}" onclick="setRowStatus('${r.studentId}', 'Half-Day')">Half-Day</button>
            </div>
          </td>
          <td>
            <input type="text" class="input-control" style="padding: 4px 8px; font-size: 0.78rem; width: 140px;" 
              placeholder="Add remark..." value="${escapeHtml(r.remarks || '')}" 
              onchange="updateRowRemark('${r.studentId}', this.value)">
          </td>
          <td>
            <button class="btn btn-outline-sm" onclick="openStudentHistoryModal('${r.studentId}')">Log 🔍</button>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load register', err);
  }
}

function setRowStatus(studentId, newStatus) {
  const rec = currentRegisterRecords.find(r => r.studentId === studentId);
  if (rec) {
    rec.status = newStatus;
  }

  // Update UI row buttons
  const row = document.getElementById(`row-${studentId}`);
  if (row) {
    const chips = row.querySelectorAll('.status-chip');
    chips.forEach(chip => {
      chip.className = 'status-chip';
      if (chip.textContent === newStatus) {
        chip.classList.add(`selected-Present`);
        if (newStatus === 'Absent') chip.className = 'status-chip selected-Absent';
        if (newStatus === 'Late') chip.className = 'status-chip selected-Late';
        if (newStatus === 'Half-Day') chip.className = 'status-chip selected-Half-Day';
      }
    });
  }

  updateRibbonLiveCounters();
}

function updateRowRemark(studentId, remark) {
  const rec = currentRegisterRecords.find(r => r.studentId === studentId);
  if (rec) {
    rec.remarks = remark;
  }
}

function updateRibbonLiveCounters() {
  const total = currentRegisterRecords.length;
  const p = currentRegisterRecords.filter(r => r.status === 'Present').length;
  const a = currentRegisterRecords.filter(r => r.status === 'Absent').length;
  const l = currentRegisterRecords.filter(r => r.status === 'Late').length;
  const h = currentRegisterRecords.filter(r => r.status === 'Half-Day').length;

  document.getElementById('ribbon-present').textContent = p;
  document.getElementById('ribbon-absent').textContent = a;
  document.getElementById('ribbon-late').textContent = l;
  document.getElementById('ribbon-half').textContent = h;

  const rate = total > 0 ? Math.round(((p + (l * 0.8) + (h * 0.5)) / total) * 100) : 0;
  document.getElementById('ribbon-pct').textContent = `${rate}%`;
}

function bulkMarkAll(status) {
  currentRegisterRecords.forEach(r => {
    r.status = status;
  });

  // Re-render table buttons
  loadAttendanceRegister();
  showToast(`All students marked as ${status}`, '✅');
}

async function saveCurrentAttendanceRegister() {
  const date = document.getElementById('att-date-picker')?.value || '2026-10-29';
  if (currentRegisterRecords.length === 0) return;

  const payload = {
    date,
    records: currentRegisterRecords.map(r => ({
      studentId: r.studentId,
      status: r.status,
      remarks: r.remarks
    }))
  };

  try {
    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showToast('Attendance saved & synchronized successfully!', '🎉');
      loadDashboardAnalytics();
      loadDefaulters();
    } else {
      showToast(json.message || 'Error saving attendance', '❌');
    }
  } catch (err) {
    showToast('Network error while saving attendance', '❌');
  }
}

// -------------------------------------------------------------
// 3. Student Directory
// -------------------------------------------------------------
async function loadStudentsDirectory() {
  const cls = document.getElementById('dir-class-select')?.value || '';
  const sec = document.getElementById('dir-section-select')?.value || '';
  const search = document.getElementById('student-search-input')?.value || '';

  try {
    let url = `/api/students?class=${cls}&section=${sec}&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) return;

    allStudentsList = json.data;
    renderStudentCards(allStudentsList);
  } catch (err) {
    console.error('Failed to load students directory', err);
  }
}

function debounceSearchStudents() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    loadStudentsDirectory();
  }, 250);
}

function renderStudentCards(students) {
  const container = document.getElementById('students-cards-container');
  if (!container) return;

  if (students.length === 0) {
    container.innerHTML = `<div class="glass-panel text-center p-4 text-muted" style="grid-column: 1 / -1;">No students found matching current filters.</div>`;
    return;
  }

  container.innerHTML = students.map(s => {
    const pct = s.attendanceStats ? s.attendanceStats.percentage : 0;
    const isDef = pct < 75;
    const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return `
      <div class="card glass-panel student-card">
        <div class="student-card-header">
          <div class="student-avatar" style="${isDef ? 'border-color: var(--rose);' : ''}">${initials}</div>
          <div class="student-name-box">
            <h4>${escapeHtml(s.name)}</h4>
            <p>Roll #${s.rollNo} • Class ${s.class}-${s.section} • ${s.id}</p>
          </div>
        </div>

        <div class="student-metrics">
          <div class="metric-item">
            <span class="lbl">Turnout</span>
            <span class="val ${isDef ? 'text-rose' : 'text-emerald'}">${pct}%</span>
          </div>
          <div class="metric-item">
            <span class="lbl">Present</span>
            <span class="val text-emerald">${s.attendanceStats?.presentDays || 0}</span>
          </div>
          <div class="metric-item">
            <span class="lbl">Absent</span>
            <span class="val text-rose">${s.attendanceStats?.absentDays || 0}</span>
          </div>
          <div class="metric-item">
            <span class="lbl">Status</span>
            <span class="badge-tag ${isDef ? 'danger' : 'success'}">${isDef ? 'Defaulter' : 'Eligible'}</span>
          </div>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px;">
          <div>📞 <strong>Parent:</strong> ${escapeHtml(s.parentName || 'Parent')} (${s.phone || 'N/A'})</div>
          <div>📍 <strong>Address:</strong> ${escapeHtml(s.address || 'Delhi')}</div>
        </div>

        <div class="student-card-actions">
          <button class="btn btn-outline-sm w-100" onclick="openStudentHistoryModal('${s.id}')">View History Log 📊</button>
          ${isDef ? `<button class="btn btn-outline-sm" style="border-color: var(--rose); color: var(--rose);" onclick="openNoticeModal('${s.id}')">Notice ✉</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 4. Modals
// -------------------------------------------------------------
function openAddStudentModal() {
  document.getElementById('modal-add-student').classList.add('show');
}

function closeAddStudentModal() {
  document.getElementById('modal-add-student').classList.remove('show');
}

async function handleCreateStudent(e) {
  e.preventDefault();
  const name = document.getElementById('add-name').value;
  const rollNo = document.getElementById('add-roll').value;
  const cls = document.getElementById('add-class').value;
  const section = document.getElementById('add-section').value;
  const gender = document.getElementById('add-gender').value;
  const parentName = document.getElementById('add-parent').value;
  const phone = document.getElementById('add-phone').value;
  const email = document.getElementById('add-email').value;
  const address = document.getElementById('add-address').value;

  const payload = { name, rollNo, class: cls, section, gender, parentName, phone, email, address };

  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Student ${name} registered successfully!`, '🎉');
      closeAddStudentModal();
      document.getElementById('form-add-student').reset();
      loadStudentsDirectory();
      loadAttendanceRegister();
      loadDashboardAnalytics();
    } else {
      showToast(json.message || 'Failed to add student', '❌');
    }
  } catch (err) {
    showToast('Failed to connect to server', '❌');
  }
}

async function openStudentHistoryModal(studentId) {
  try {
    const res = await fetch(`/api/students/${studentId}/attendance-history`);
    const json = await res.json();
    if (!json.success) return;

    const { student, stats, history } = json;

    document.getElementById('modal-hist-name').textContent = `${student.name} (Roll #${student.rollNo})`;
    document.getElementById('modal-hist-meta').textContent = `Class ${student.class}-${student.section} • ID: ${student.id} • Parent: ${student.parentName || 'N/A'}`;

    document.getElementById('hist-stat-total').textContent = stats.totalDays;
    document.getElementById('hist-stat-present').textContent = stats.presentDays;
    document.getElementById('hist-stat-absent').textContent = stats.absentDays;
    document.getElementById('hist-stat-pct').textContent = `${stats.percentage}%`;
    document.getElementById('hist-stat-pct').className = `val ${stats.percentage < 75 ? 'text-rose' : 'text-emerald'}`;

    const tbody = document.getElementById('hist-table-tbody');
    tbody.innerHTML = history.map(h => {
      let badgeCls = 'success';
      if (h.status === 'Absent') badgeCls = 'danger';
      else if (h.status === 'Late') badgeCls = 'warning';
      else if (h.status === 'Half-Day') badgeCls = 'info';

      return `
        <tr>
          <td><strong>${h.date}</strong></td>
          <td><span class="badge-tag ${badgeCls}">${h.status}</span></td>
          <td>${escapeHtml(h.remarks || '-')}</td>
          <td class="text-dim" style="font-size: 0.72rem;">${h.markedAt ? new Date(h.markedAt).toLocaleTimeString() : '-'}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('modal-student-history').classList.add('show');
  } catch (err) {
    showToast('Failed to load history', '❌');
  }
}

function closeHistoryModal() {
  document.getElementById('modal-student-history').classList.remove('show');
}

// -------------------------------------------------------------
// Toast Notification
// -------------------------------------------------------------
function showToast(msg, icon = '✅') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  iconEl.textContent = icon;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
