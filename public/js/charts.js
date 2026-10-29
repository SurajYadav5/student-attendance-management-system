/**
 * EduTrack Pro — Native Canvas Chart Engine
 * Renders 7-day attendance trend lines with smooth gradient fills and tooltips.
 */

function renderTrendChart(trendData) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set resolution
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.parentElement.clientWidth || 500;
  const height = 220;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  if (!trendData || trendData.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "Plus Jakarta Sans"';
    ctx.textAlign = 'center';
    ctx.fillText('No attendance trend data available', width / 2, height / 2);
    return;
  }

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Grid lines (0%, 25%, 50%, 75%, 100%)
  const yTicks = [0, 25, 50, 75, 100];
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  yTicks.forEach(tick => {
    const y = paddingTop + graphHeight - (tick / 100) * graphHeight;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    ctx.fillText(tick + '%', paddingLeft - 8, y + 4);
  });

  // Calculate points
  const stepX = graphWidth / (trendData.length - 1 || 1);
  const points = trendData.map((d, i) => {
    const x = paddingLeft + i * stepX;
    const y = paddingTop + graphHeight - (Math.min(100, Math.max(0, d.percentage)) / 100) * graphHeight;
    return { x, y, val: d.percentage, label: d.date.slice(5) };
  });

  // Gradient Area Fill
  const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - paddingBottom);
  points.forEach((pt) => {
    ctx.lineTo(pt.x, pt.y);
  });
  ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line Stroke
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((pt) => {
    ctx.lineTo(pt.x, pt.y);
  });
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Points & Labels
  points.forEach((pt) => {
    // Outer glow
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Value label
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px "Plus Jakarta Sans"';
    ctx.textAlign = 'center';
    ctx.fillText(pt.val + '%', pt.x, pt.y - 10);

    // X-axis date
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText(pt.label, pt.x, height - 12);
  });
}

function renderClassComparison(classes) {
  const container = document.getElementById('class-comparison-bars');
  if (!container || !classes) return;

  container.innerHTML = classes.map(c => `
    <div class="class-bar-row">
      <div class="class-bar-header">
        <span class="text-main">${c.name} (${c.total} students)</span>
        <span class="badge-tag ${c.rate >= 80 ? 'success' : (c.rate >= 75 ? 'warning' : 'danger')}">${c.rate}% Turnout</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${c.rate}%; background: ${c.rate >= 80 ? 'linear-gradient(90deg, #10b981, #059669)' : (c.rate >= 75 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #f43f5e, #e11d48)')}"></div>
      </div>
    </div>
  `).join('');
}
