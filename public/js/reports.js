/**
 * EduTrack Pro — Reports & Defaulter Logic
 * Handles CBSE 75% threshold analysis, shortfall calculation, and spreadsheet grid
 */

let currentDefaultersList = [];

async function loadDefaulters() {
  const threshold = document.getElementById('defaulter-thresh-select') ? document.getElementById('defaulter-thresh-select').value : 75;
  const tbody = document.getElementById('defaulters-table-tbody');
  const badge = document.getElementById('defaulter-badge');
  const kpiCount = document.getElementById('kpi-defaulter-count');
  const dashTbody = document.getElementById('dash-defaulters-tbody');

  try {
    const res = await fetch(`/api/reports/defaulters?threshold=${threshold}`);
    const json = await res.json();
    if (!json.success) return;

    currentDefaultersList = json.data;
    if (badge) badge.textContent = json.count;
    if (kpiCount) kpiCount.textContent = json.count;

    // Render Dashboard Strip
    if (dashTbody) {
      if (json.data.length === 0) {
        dashTbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center" style="padding: 24px;">No students below threshold. Great attendance record!</td></tr>`;
      } else {
        dashTbody.innerHTML = json.data.slice(0, 5).map(s => `
          <tr>
            <td><strong>#${s.rollNo}</strong></td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td><span class="badge-tag info">${s.class}-${s.section}</span></td>
            <td><span class="badge-tag danger">${s.attendancePercentage}%</span></td>
            <td>${s.phone || 'N/A'}</td>
            <td>
              <button class="btn btn-outline-sm" onclick="openNoticeModal('${s.id}')">Notice ✉</button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Render Full Defaulter Radar Table
    if (tbody) {
      if (json.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="text-muted text-center" style="padding: 30px;">All students meet or exceed the ${threshold}% requirement.</td></tr>`;
      } else {
        tbody.innerHTML = json.data.map(s => `
          <tr>
            <td><strong>#${s.rollNo}</strong></td>
            <td>
              <strong>${escapeHtml(s.name)}</strong>
              <div class="text-dim" style="font-size: 0.72rem;">ID: ${s.id}</div>
            </td>
            <td><span class="badge-tag info">${s.class}-${s.section}</span></td>
            <td>${s.totalWorkingDays} days</td>
            <td class="text-emerald"><strong>${s.attendedDays}</strong></td>
            <td class="text-rose"><strong>${s.missedDays}</strong></td>
            <td>
              <span class="badge-tag ${s.attendancePercentage < 65 ? 'danger' : 'warning'}">
                ${s.attendancePercentage}%
              </span>
            </td>
            <td>
              <strong class="text-rose">+${Math.max(1, s.shortfallDays || 2)} days</strong>
              <div class="text-dim" style="font-size: 0.7rem;">Needed for 75%</div>
            </td>
            <td>${escapeHtml(s.parentName || 'Parent')}</td>
            <td>${s.phone || 'N/A'}</td>
            <td>
              <button class="btn btn-outline-sm" onclick="openNoticeModal('${s.id}')">
                Generate Notice
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load defaulters', err);
  }
}

async function loadSpreadsheetMatrix() {
  const select = document.getElementById('report-class-select');
  const val = select ? select.value : '10';
  let cls = '10';
  let sec = 'A';

  if (val === '10B') {
    cls = '10';
    sec = 'B';
  } else if (val === '9') {
    cls = '9';
    sec = 'A';
  }

  const table = document.getElementById('matrix-table');
  if (!table) return;

  try {
    const res = await fetch(`/api/reports/monthly-matrix?class=${cls}&section=${sec}`);
    const json = await res.json();
    if (!json.success) return;

    const { dates, matrix } = json;

    // Build Header
    let html = `<thead><tr>
      <th width="50">Roll</th>
      <th width="140">Student Name</th>
      <th width="75">Total</th>
      <th width="65">Present</th>
      <th width="65">Absent</th>
      <th width="65">%</th>
    `;
    dates.forEach(d => {
      const shortDate = d.slice(5); // MM-DD
      html += `<th title="${d}">${shortDate}</th>`;
    });
    html += `</tr></thead><tbody>`;

    // Build Rows
    matrix.forEach(row => {
      const pctBadge = row.percentage >= 75 
        ? `<span class="badge-tag success">${row.percentage}%</span>`
        : `<span class="badge-tag danger">${row.percentage}%</span>`;

      html += `<tr>
        <td><strong>#${row.rollNo}</strong></td>
        <td><strong>${escapeHtml(row.name)}</strong></td>
        <td>${dates.length}</td>
        <td class="text-emerald"><strong>${row.presentCount}</strong></td>
        <td class="text-rose"><strong>${row.absentCount}</strong></td>
        <td>${pctBadge}</td>
      `;

      dates.forEach(d => {
        const st = row.days[d];
        let code = '-';
        let clsName = '';
        if (st === 'Present') { code = 'P'; clsName = 'matrix-cell-P'; }
        else if (st === 'Absent') { code = 'A'; clsName = 'matrix-cell-A'; }
        else if (st === 'Late') { code = 'L'; clsName = 'matrix-cell-L'; }
        else if (st === 'Half-Day') { code = 'H'; clsName = 'matrix-cell-H'; }

        html += `<td class="${clsName}">${code}</td>`;
      });

      html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
  } catch (err) {
    console.error('Failed to load matrix', err);
  }
}

function downloadCsvSpreadsheet() {
  const select = document.getElementById('report-class-select');
  const val = select ? select.value : '10';
  let cls = '10';
  let sec = 'A';

  if (val === '10B') { cls = '10'; sec = 'B'; }
  else if (val === '9') { cls = '9'; sec = 'A'; }

  const today = document.getElementById('att-date-picker')?.value || '2026-10-29';
  window.location.href = `/api/reports/export-csv?date=${today}&class=${cls}&section=${sec}`;
}

function exportDefaultersReport() {
  if (currentDefaultersList.length === 0) {
    showToast('No defaulters to export', '⚠️');
    return;
  }

  let csv = 'Roll No,Student Name,Class,Section,Working Days,Attended Days,Absent Days,Attendance %,Shortfall Days,Parent Name,Phone\n';
  currentDefaultersList.forEach(s => {
    csv += `${s.rollNo},"${s.name}","${s.class}","${s.section}",${s.totalWorkingDays},${s.attendedDays},${s.missedDays},${s.attendancePercentage}%,${s.shortfallDays || 2},"${s.parentName || ''}","${s.phone || ''}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `Defaulters_List_Below_75_Percent_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Defaulter list exported successfully!', '📥');
}

function openNoticeModal(studentId) {
  const s = currentDefaultersList.find(item => item.id === studentId);
  if (!s) return;

  document.getElementById('notice-parent-name').textContent = s.parentName || 'Parent / Guardian';
  document.getElementById('notice-student-name').textContent = s.name;
  document.getElementById('notice-class').textContent = `${s.class}-${s.section}`;
  document.getElementById('notice-roll').textContent = s.rollNo;
  document.getElementById('notice-phone').textContent = s.phone || 'N/A';
  document.getElementById('notice-pct').textContent = `${s.attendancePercentage}%`;
  document.getElementById('notice-present-days').textContent = s.attendedDays;
  document.getElementById('notice-total-days').textContent = s.totalWorkingDays;
  document.getElementById('notice-shortfall').textContent = Math.max(1, s.shortfallDays || 2);

  document.getElementById('modal-notice').classList.add('show');
}

function closeNoticeModal() {
  document.getElementById('modal-notice').classList.remove('show');
}

function printNotice() {
  window.print();
}
