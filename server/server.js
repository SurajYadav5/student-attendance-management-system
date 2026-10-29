const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDataFiles, getStudents, saveStudents, getAttendance, saveAttendance } = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure data files exist
initDataFiles();

// Helper: Calculate attendance summary for a student
function computeStudentAttendance(studentId, attendanceData) {
  let totalDays = 0;
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let halfDays = 0;

  for (const date in attendanceData) {
    const record = attendanceData[date][studentId];
    if (record) {
      totalDays++;
      if (record.status === 'Present') presentDays++;
      else if (record.status === 'Absent') absentDays++;
      else if (record.status === 'Late') {
        lateDays++;
        presentDays += 0.8; // Standard educational half/late weighting
      } else if (record.status === 'Half-Day') {
        halfDays++;
        presentDays += 0.5;
      }
    }
  }

  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100 * 10) / 10 : 0;
  return {
    totalDays,
    presentDays: Math.round(presentDays),
    absentDays,
    lateDays,
    halfDays,
    percentage,
    isDefaulter: percentage < 75
  };
}

// 1. Health & Meta
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Student Attendance Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Students List & Search
app.get('/api/students', (req, res) => {
  try {
    let students = getStudents();
    const { class: cls, section, search, status } = req.query;

    if (cls) {
      students = students.filter(s => s.class === cls);
    }
    if (section) {
      students = students.filter(s => s.section.toUpperCase() === section.toUpperCase());
    }
    if (status) {
      students = students.filter(s => s.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      students = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.rollNo.toString().includes(q) ||
        (s.parentName && s.parentName.toLowerCase().includes(q))
      );
    }

    // Attach overall attendance percentage to each student
    const attendanceData = getAttendance();
    const enriched = students.map(s => {
      const stats = computeStudentAttendance(s.id, attendanceData);
      return { ...s, attendanceStats: stats };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Add Student
app.post('/api/students', (req, res) => {
  try {
    const { name, class: cls, section, gender, rollNo, dob, parentName, phone, email, address } = req.body;
    if (!name || !cls || !section || !rollNo) {
      return res.status(400).json({ success: false, message: 'Name, Class, Section, and Roll No are required.' });
    }

    const students = getStudents();
    // Generate new unique ID
    const maxNum = students.reduce((max, s) => {
      const n = parseInt(s.id.replace('STU', ''), 10) || 1000;
      return n > max ? n : max;
    }, 1000);
    const newId = `STU${maxNum + 1}`;

    const newStudent = {
      id: newId,
      rollNo: parseInt(rollNo, 10),
      name: name.trim(),
      class: cls.toString().trim(),
      section: section.toString().trim().toUpperCase(),
      gender: gender || 'Other',
      dob: dob || '2010-01-01',
      parentName: parentName || '',
      phone: phone || '',
      email: email || '',
      address: address || '',
      status: 'Active'
    };

    students.push(newStudent);
    saveStudents(students);

    res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Update Student
app.put('/api/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    const students = getStudents();
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    students[index] = { ...students[index], ...req.body, id };
    saveStudents(students);

    res.json({ success: true, message: 'Student updated successfully', data: students[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Delete Student
app.delete('/api/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    let students = getStudents();
    const exists = students.some(s => s.id === id);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    students = students.filter(s => s.id !== id);
    saveStudents(students);

    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Get Attendance by Date & Filters
app.get('/api/attendance', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const cls = req.query.class;
    const section = req.query.section;

    const students = getStudents();
    const attendanceData = getAttendance();
    const dayAttendance = attendanceData[date] || {};

    let filteredStudents = students;
    if (cls) filteredStudents = filteredStudents.filter(s => s.class === cls);
    if (section) filteredStudents = filteredStudents.filter(s => s.section.toUpperCase() === section.toUpperCase());

    const result = filteredStudents.map(student => {
      const record = dayAttendance[student.id] || { status: 'Not Marked', remarks: '' };
      return {
        studentId: student.id,
        rollNo: student.rollNo,
        name: student.name,
        class: student.class,
        section: student.section,
        gender: student.gender,
        status: record.status,
        remarks: record.remarks || '',
        markedAt: record.markedAt || null
      };
    });

    const summary = {
      date,
      total: result.length,
      present: result.filter(r => r.status === 'Present').length,
      absent: result.filter(r => r.status === 'Absent').length,
      late: result.filter(r => r.status === 'Late').length,
      halfDay: result.filter(r => r.status === 'Half-Day').length,
      unmarked: result.filter(r => r.status === 'Not Marked').length
    };
    summary.presentRate = summary.total > 0 ? Math.round(((summary.present + (summary.late * 0.8) + (summary.halfDay * 0.5)) / summary.total) * 100) : 0;

    res.json({ success: true, date, summary, records: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Mark Attendance (Single or Batch)
app.post('/api/attendance/mark', (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: date and records array required.' });
    }

    const attendanceData = getAttendance();
    if (!attendanceData[date]) {
      attendanceData[date] = {};
    }

    const now = new Date().toISOString();
    records.forEach(rec => {
      if (rec.studentId && rec.status) {
        attendanceData[date][rec.studentId] = {
          status: rec.status,
          remarks: rec.remarks || '',
          markedAt: now
        };
      }
    });

    saveAttendance(attendanceData);

    res.json({ success: true, message: `Successfully updated attendance for ${records.length} students on ${date}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Bulk Mark (e.g. Mark All Present)
app.post('/api/attendance/bulk-mark', (req, res) => {
  try {
    const { date, class: cls, section, status } = req.body;
    if (!date || !status) {
      return res.status(400).json({ success: false, message: 'Date and status are required.' });
    }

    const students = getStudents();
    let targets = students;
    if (cls) targets = targets.filter(s => s.class === cls);
    if (section) targets = targets.filter(s => s.section.toUpperCase() === section.toUpperCase());

    const attendanceData = getAttendance();
    if (!attendanceData[date]) {
      attendanceData[date] = {};
    }

    const now = new Date().toISOString();
    targets.forEach(s => {
      attendanceData[date][s.id] = {
        status: status,
        remarks: 'Bulk marked',
        markedAt: now
      };
    });

    saveAttendance(attendanceData);

    res.json({
      success: true,
      message: `Marked all ${targets.length} students as ${status} on ${date}.`,
      affectedCount: targets.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. Dashboard Analytics & Stats
app.get('/api/analytics/dashboard', (req, res) => {
  try {
    const today = req.query.date || new Date().toISOString().split('T')[0];
    const students = getStudents();
    const attendanceData = getAttendance();

    const todayRecords = attendanceData[today] || {};
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;

    students.forEach(s => {
      const rec = todayRecords[s.id];
      if (rec) {
        if (rec.status === 'Present') presentCount++;
        else if (rec.status === 'Absent') absentCount++;
        else if (rec.status === 'Late') lateCount++;
        else if (rec.status === 'Half-Day') halfDayCount++;
      }
    });

    // Compute Defaulters (<75%)
    const defaulters = [];
    students.forEach(s => {
      const stats = computeStudentAttendance(s.id, attendanceData);
      if (stats.percentage < 75 && stats.totalDays > 0) {
        defaulters.push({ ...s, stats });
      }
    });

    // 7-day trend
    const allDates = Object.keys(attendanceData).sort();
    const last7Dates = allDates.slice(-7);
    const trend = last7Dates.map(d => {
      const dayRecs = attendanceData[d] || {};
      let p = 0;
      let tot = 0;
      students.forEach(s => {
        const r = dayRecs[s.id];
        if (r) {
          tot++;
          if (r.status === 'Present') p += 1;
          else if (r.status === 'Late') p += 0.8;
          else if (r.status === 'Half-Day') p += 0.5;
        }
      });
      const pct = tot > 0 ? Math.round((p / tot) * 100) : 0;
      return { date: d, percentage: pct, totalMarked: tot };
    });

    // Class wise comparison
    const class10A = students.filter(s => s.class === '10' && s.section === 'A');
    const class10B = students.filter(s => s.class === '10' && s.section === 'B');
    const class9A = students.filter(s => s.class === '9' && s.section === 'A');

    function getGroupRate(group) {
      if (group.length === 0) return 0;
      let p = 0;
      group.forEach(s => {
        const r = todayRecords[s.id];
        if (r && r.status === 'Present') p++;
        else if (r && r.status === 'Late') p += 0.8;
      });
      return Math.round((p / group.length) * 100);
    }

    res.json({
      success: true,
      data: {
        totalStudents: students.length,
        today,
        todayStats: {
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          halfDay: halfDayCount,
          attendanceRate: students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0
        },
        defaulterCount: defaulters.length,
        defaulters: defaulters.map(d => ({
          id: d.id,
          rollNo: d.rollNo,
          name: d.name,
          class: `${d.class}-${d.section}`,
          percentage: d.stats.percentage,
          absentDays: d.stats.absentDays,
          phone: d.phone,
          parentName: d.parentName
        })),
        trend,
        classComparison: [
          { name: 'Class 10-A', rate: getGroupRate(class10A), total: class10A.length },
          { name: 'Class 10-B', rate: getGroupRate(class10B), total: class10B.length },
          { name: 'Class 9-A', rate: getGroupRate(class9A), total: class9A.length }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 10. Student Individual Ledger & Calendar
app.get('/api/students/:id/attendance-history', (req, res) => {
  try {
    const { id } = req.params;
    const students = getStudents();
    const student = students.find(s => s.id === id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const attendanceData = getAttendance();
    const history = [];

    const sortedDates = Object.keys(attendanceData).sort().reverse();
    sortedDates.forEach(date => {
      const rec = attendanceData[date][id];
      if (rec) {
        history.push({
          date,
          status: rec.status,
          remarks: rec.remarks || '',
          markedAt: rec.markedAt
        });
      }
    });

    const stats = computeStudentAttendance(id, attendanceData);

    res.json({
      success: true,
      student,
      stats,
      history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 11. Defaulters List (<75%)
app.get('/api/reports/defaulters', (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 75;
    const students = getStudents();
    const attendanceData = getAttendance();

    const defaulters = [];
    students.forEach(s => {
      const stats = computeStudentAttendance(s.id, attendanceData);
      if (stats.percentage < threshold && stats.totalDays > 0) {
        defaulters.push({
          ...s,
          attendancePercentage: stats.percentage,
          attendedDays: stats.presentDays,
          missedDays: stats.absentDays,
          totalWorkingDays: stats.totalDays,
          shortfallDays: Math.ceil((threshold / 100) * stats.totalDays) - stats.presentDays
        });
      }
    });

    // Sort by lowest percentage first
    defaulters.sort((a, b) => a.attendancePercentage - b.attendancePercentage);

    res.json({ success: true, count: defaulters.length, threshold, data: defaulters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 12. Monthly Attendance Matrix (Spreadsheet view)
app.get('/api/reports/monthly-matrix', (req, res) => {
  try {
    const cls = req.query.class || '10';
    const section = req.query.section || 'A';
    const students = getStudents().filter(s => s.class === cls && s.section.toUpperCase() === section.toUpperCase());
    const attendanceData = getAttendance();

    const dates = Object.keys(attendanceData).sort();
    const matrix = students.map(student => {
      const row = {
        id: student.id,
        rollNo: student.rollNo,
        name: student.name,
        days: {},
        presentCount: 0,
        absentCount: 0
      };

      dates.forEach(d => {
        const rec = attendanceData[d][student.id];
        const st = rec ? rec.status : '-';
        row.days[d] = st;
        if (st === 'Present') row.presentCount++;
        else if (st === 'Absent') row.absentCount++;
      });

      row.percentage = dates.length > 0 ? Math.round((row.presentCount / dates.length) * 100) : 0;
      return row;
    });

    res.json({ success: true, class: `${cls}-${section}`, dates, matrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 13. CSV Export for Spreadsheet Analysis (Class 10 IT Requirement)
app.get('/api/reports/export-csv', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const cls = req.query.class || '10';
    const section = req.query.section || 'A';

    const students = getStudents().filter(s => s.class === cls && s.section.toUpperCase() === section.toUpperCase());
    const attendanceData = getAttendance();
    const dayAttendance = attendanceData[date] || {};

    let csvContent = `Roll No,Student ID,Student Name,Class,Section,Gender,Attendance Status,Remarks,Marked Date\n`;
    students.forEach(s => {
      const rec = dayAttendance[s.id] || { status: 'Not Marked', remarks: '' };
      csvContent += `${s.rollNo},"${s.id}","${s.name}","${s.class}","${s.section}","${s.gender}","${rec.status}","${rec.remarks || ''}","${date}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`Attendance_Class_${cls}_${section}_${date}.csv`);
    return res.send(csvContent);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Catch-all for SPA client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🎓 Student Attendance Management System running on http://localhost:${PORT}`);
    console.log(`   Interactive Web UI: http://localhost:${PORT}`);
    console.log(`   REST API Endpoint: http://localhost:${PORT}/api/students`);
    console.log(`================================================================`);
  });
}

module.exports = app;
