const fs = require('fs');
const path = require('path');

const DEFAULT_DATA_DIR = path.join(__dirname, 'data');
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'attendance-data') : DEFAULT_DATA_DIR;
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');

const INITIAL_STUDENTS = [
  // Class 10-A (20 Students)
  { id: 'STU1001', rollNo: 1, name: 'Aarav Sharma', class: '10', section: 'A', gender: 'Male', dob: '2010-04-12', parentName: 'Rajesh Sharma', phone: '+91 98765 43210', email: 'aarav.sharma@example.com', address: 'B-12, Green Park, New Delhi', status: 'Active' },
  { id: 'STU1002', rollNo: 2, name: 'Ananya Verma', class: '10', section: 'A', gender: 'Female', dob: '2010-07-25', parentName: 'Sunil Verma', phone: '+91 98112 34567', email: 'ananya.v@example.com', address: '45-C, Model Town, Delhi', status: 'Active' },
  { id: 'STU1003', rollNo: 3, name: 'Aditya Patel', class: '10', section: 'A', gender: 'Male', dob: '2010-02-18', parentName: 'Kiran Patel', phone: '+91 97234 56789', email: 'aditya.p@example.com', address: 'Flat 302, Sunrise Apts, Noida', status: 'Active' },
  { id: 'STU1004', rollNo: 4, name: 'Diya Gupta', class: '10', section: 'A', gender: 'Female', dob: '2010-09-05', parentName: 'Manoj Gupta', phone: '+91 99887 65432', email: 'diya.gupta@example.com', address: 'H-89, Preet Vihar, Delhi', status: 'Active' },
  { id: 'STU1005', rollNo: 5, name: 'Ishaan Singh', class: '10', section: 'A', gender: 'Male', dob: '2010-11-30', parentName: 'Harpreet Singh', phone: '+91 98711 22334', email: 'ishaan.s@example.com', address: 'Sector 14, Rohini, Delhi', status: 'Active' },
  { id: 'STU1006', rollNo: 6, name: 'Kavya Nair', class: '10', section: 'A', gender: 'Female', dob: '2010-03-14', parentName: 'Ramesh Nair', phone: '+91 97123 44556', email: 'kavya.nair@example.com', address: 'Tower 4, Mayur Vihar, Delhi', status: 'Active' },
  { id: 'STU1007', rollNo: 7, name: 'Manish Kumar', class: '10', section: 'A', gender: 'Male', dob: '2010-06-22', parentName: 'Suresh Kumar', phone: '+91 98109 87654', email: 'manish.k@example.com', address: '12/A, Karol Bagh, Delhi', status: 'Active' },
  { id: 'STU1008', rollNo: 8, name: 'Neha Joshi', class: '10', section: 'A', gender: 'Female', dob: '2010-08-19', parentName: 'Vinod Joshi', phone: '+91 98991 12233', email: 'neha.joshi@example.com', address: 'Pocket B, Sarita Vihar, Delhi', status: 'Active' },
  { id: 'STU1009', rollNo: 9, name: 'Pranav Reddy', class: '10', section: 'A', gender: 'Male', dob: '2010-01-09', parentName: 'Venkat Reddy', phone: '+91 97401 23456', email: 'pranav.r@example.com', address: 'C-7, Greater Kailash 1, Delhi', status: 'Active' },
  { id: 'STU1010', rollNo: 10, name: 'Riya Sen', class: '10', section: 'A', gender: 'Female', dob: '2010-10-17', parentName: 'Subir Sen', phone: '+91 98300 45678', email: 'riya.sen@example.com', address: 'Flat 12B, CR Park, New Delhi', status: 'Active' },
  { id: 'STU1011', rollNo: 11, name: 'Rohan Mehra', class: '10', section: 'A', gender: 'Male', dob: '2010-05-03', parentName: 'Anil Mehra', phone: '+91 98118 76543', email: 'rohan.mehra@example.com', address: 'D-44, Hauz Khas, New Delhi', status: 'Active' },
  { id: 'STU1012', rollNo: 12, name: 'Saanvi Malhotra', class: '10', section: 'A', gender: 'Female', dob: '2010-12-08', parentName: 'Deepak Malhotra', phone: '+91 99102 34567', email: 'saanvi.m@example.com', address: '22, Defence Colony, New Delhi', status: 'Active' },
  { id: 'STU1013', rollNo: 13, name: 'Samar Khan', class: '10', section: 'A', gender: 'Male', dob: '2010-03-29', parentName: 'Tariq Khan', phone: '+91 98733 44556', email: 'samar.khan@example.com', address: 'Plot 55, Jamia Nagar, Delhi', status: 'Active' },
  { id: 'STU1014', rollNo: 14, name: 'Sneha Pandey', class: '10', section: 'A', gender: 'Female', dob: '2010-07-11', parentName: 'Alok Pandey', phone: '+91 98188 99001', email: 'sneha.p@example.com', address: 'Pocket 2, Dwarka Sector 6, Delhi', status: 'Active' },
  { id: 'STU1015', rollNo: 15, name: 'Rahul Yadav', class: '10', section: 'A', gender: 'Male', dob: '2010-02-14', parentName: 'Ram Yadav', phone: '+91 98101 23450', email: 'rahul.yadav@example.com', address: 'House 18, Janakpuri, New Delhi', status: 'Active' },
  { id: 'STU1016', rollNo: 16, name: 'Tanvi Kapoor', class: '10', section: 'A', gender: 'Female', dob: '2010-09-21', parentName: 'Vikas Kapoor', phone: '+91 99580 11223', email: 'tanvi.k@example.com', address: 'Block C, Punjabi Bagh, Delhi', status: 'Active' },
  { id: 'STU1017', rollNo: 17, name: 'Utkarsh Mishra', class: '10', section: 'A', gender: 'Male', dob: '2010-04-05', parentName: 'Dinesh Mishra', phone: '+91 98710 33445', email: 'utkarsh.m@example.com', address: 'A-301, Vasundhara Enclave, Delhi', status: 'Active' },
  { id: 'STU1018', rollNo: 18, name: 'Vaishnavi Das', class: '10', section: 'A', gender: 'Female', dob: '2010-08-30', parentName: 'Pranab Das', phone: '+91 98114 55667', email: 'vaishnavi.das@example.com', address: '78, Chittaranjan Park, Delhi', status: 'Active' },
  { id: 'STU1019', rollNo: 19, name: 'Vivaan Agarwal', class: '10', section: 'A', gender: 'Male', dob: '2010-01-27', parentName: 'Sanjay Agarwal', phone: '+91 99990 88776', email: 'vivaan.a@example.com', address: 'E-5, Ashok Vihar Phase 1, Delhi', status: 'Active' },
  { id: 'STU1020', rollNo: 20, name: 'Zoya Siddiqui', class: '10', section: 'A', gender: 'Female', dob: '2010-10-02', parentName: 'Farhan Siddiqui', phone: '+91 98732 11009', email: 'zoya.s@example.com', address: '90, Batla House, Okhla, Delhi', status: 'Active' },

  // Class 10-B (10 Students)
  { id: 'STU1021', rollNo: 1, name: 'Aryan Chawla', class: '10', section: 'B', gender: 'Male', dob: '2010-03-15', parentName: 'Gaurav Chawla', phone: '+91 98103 44556', email: 'aryan.c@example.com', address: 'Flat 101, Paschim Vihar, Delhi', status: 'Active' },
  { id: 'STU1022', rollNo: 2, name: 'Bhavna Tiwari', class: '10', section: 'B', gender: 'Female', dob: '2010-06-18', parentName: 'Rakesh Tiwari', phone: '+91 98712 34509', email: 'bhavna.t@example.com', address: 'G-14, Vikaspuri, Delhi', status: 'Active' },
  { id: 'STU1023', rollNo: 3, name: 'Chirag Bhatia', class: '10', section: 'B', gender: 'Male', dob: '2010-09-12', parentName: 'Satish Bhatia', phone: '+91 98115 67890', email: 'chirag.b@example.com', address: '88-A, Rajouri Garden, Delhi', status: 'Active' },
  { id: 'STU1024', rollNo: 4, name: 'Devika Pillai', class: '10', section: 'B', gender: 'Female', dob: '2010-05-24', parentName: 'Madhavan Pillai', phone: '+91 97110 98765', email: 'devika.p@example.com', address: 'Flat 504, Sector 7, Dwarka', status: 'Active' },
  { id: 'STU1025', rollNo: 5, name: 'Gaurav Dubey', class: '10', section: 'B', gender: 'Male', dob: '2010-11-04', parentName: 'Mahesh Dubey', phone: '+91 98993 45678', email: 'gaurav.d@example.com', address: '23/5, Shakarpur, Delhi', status: 'Active' },
  { id: 'STU1026', rollNo: 6, name: 'Kritika Roy', class: '10', section: 'B', gender: 'Female', dob: '2010-02-28', parentName: 'Debashis Roy', phone: '+91 98311 22334', email: 'kritika.roy@example.com', address: 'C-12, Kalkaji, New Delhi', status: 'Active' },
  { id: 'STU1027', rollNo: 7, name: 'Nikhil Rathi', class: '10', section: 'B', gender: 'Male', dob: '2010-07-09', parentName: 'Joginder Rathi', phone: '+91 99114 55667', email: 'nikhil.rathi@example.com', address: 'Village Najafgarh, New Delhi', status: 'Active' },
  { id: 'STU1028', rollNo: 8, name: 'Pooja Saxena', class: '10', section: 'B', gender: 'Female', dob: '2010-12-19', parentName: 'Ajay Saxena', phone: '+91 98760 12345', email: 'pooja.saxena@example.com', address: 'D-3, Laxmi Nagar, Delhi', status: 'Active' },
  { id: 'STU1029', rollNo: 9, name: 'Rajat Chauhan', class: '10', section: 'B', gender: 'Male', dob: '2010-04-30', parentName: 'Bijender Chauhan', phone: '+91 98180 98712', email: 'rajat.c@example.com', address: 'House 45, Uttam Nagar, Delhi', status: 'Active' },
  { id: 'STU1030', rollNo: 10, name: 'Shruti Bhatt', class: '10', section: 'B', gender: 'Female', dob: '2010-10-14', parentName: 'Navin Bhatt', phone: '+91 99530 67891', email: 'shruti.b@example.com', address: 'Pocket A, Mayur Vihar Phase 3', status: 'Active' },

  // Class 9-A (5 Students)
  { id: 'STU1031', rollNo: 1, name: 'Abhinav Rawat', class: '9', section: 'A', gender: 'Male', dob: '2011-05-16', parentName: 'Mohan Rawat', phone: '+91 98119 88776', email: 'abhinav.r@example.com', address: 'Sector 23, Rohini, Delhi', status: 'Active' },
  { id: 'STU1032', rollNo: 2, name: 'Anushka Jain', class: '9', section: 'A', gender: 'Female', dob: '2011-08-20', parentName: 'Praveen Jain', phone: '+91 98714 55443', email: 'anushka.j@example.com', address: '12, Daryaganj, Old Delhi', status: 'Active' },
  { id: 'STU1033', rollNo: 3, name: 'Harshit Tyagi', class: '9', section: 'A', gender: 'Male', dob: '2011-01-11', parentName: 'Devender Tyagi', phone: '+91 99105 44332', email: 'harshit.t@example.com', address: 'Block F, Shalimar Bagh, Delhi', status: 'Active' },
  { id: 'STU1034', rollNo: 4, name: 'Meera Nambiar', class: '9', section: 'A', gender: 'Female', dob: '2011-09-27', parentName: 'Gopinath Nambiar', phone: '+91 98102 99887', email: 'meera.n@example.com', address: 'Flat 702, IP Extension, Delhi', status: 'Active' },
  { id: 'STU1035', rollNo: 5, name: 'Yashwardhan Roy', class: '9', section: 'A', gender: 'Male', dob: '2011-03-08', parentName: 'Somnath Roy', phone: '+91 98731 22334', email: 'yash.roy@example.com', address: 'Pocket C, Vasant Kunj, Delhi', status: 'Active' }
];

// Generate past 25 school days (excluding Sundays) leading up to 2026-10-29
function getPastSchoolDates(count = 25) {
  const dates = [];
  let d = new Date(2026, 9, 29); // Oct 29, 2026

  while (dates.length < count) {
    const dayOfWeek = d.getDay(); // 0 is Sunday
    if (dayOfWeek !== 0) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    d.setDate(d.getDate() - 1);
  }
  return dates.reverse();
}

function generateInitialAttendance() {
  const dates = getPastSchoolDates(25);
  const attendance = {};

  // Predictable attendance profiles:
  // - Defaulters (<75%): Suraj Yadav (64%), Utkarsh Mishra (68%), Chirag Bhatia (60%)
  // - High performers (>90%): Aarav, Ananya, Diya, Kavya, Sneha, Aryan
  // - Average (80-88%): others
  dates.forEach((dateStr, dateIdx) => {
    attendance[dateStr] = {};

    INITIAL_STUDENTS.forEach((student) => {
      let status = 'Present';
      const rand = (Math.sin(student.rollNo * 37 + dateIdx * 19) + 1) / 2; // deterministic pseudo-random

      if (['STU1007', 'STU1017', 'STU1023', 'STU1033'].includes(student.id)) {
        // Known Defaulters (<75%)
        if (rand < 0.42) status = 'Absent';
        else if (rand < 0.52) status = 'Late';
        else status = 'Present';
      } else if (['STU1001', 'STU1002', 'STU1011', 'STU1012', 'STU1015', 'STU1021', 'STU1031'].includes(student.id)) {
        // High Performers (>90%, including Suraj Yadav)
        if (rand < 0.05) status = 'Absent';
        else if (rand < 0.08) status = 'Late';
        else status = 'Present';
      } else {
        // Normal distribution (82-89%)
        if (rand < 0.12) status = 'Absent';
        else if (rand < 0.18) status = 'Late';
        else if (rand < 0.22) status = 'Half-Day';
        else status = 'Present';
      }

      // Today (2026-10-29)
      if (dateIdx === dates.length - 1) {
        if (['STU1007', 'STU1023'].includes(student.id)) status = 'Absent';
        else if (student.id === 'STU1017') status = 'Late';
        else status = 'Present';
      }

      attendance[dateStr][student.id] = {
        status: status,
        markedAt: `${dateStr}T08:15:00Z`,
        remarks: status === 'Absent' ? 'Uninformed' : (status === 'Late' ? 'Late by 15 mins' : '')
      };
    });
  });

  return attendance;
}

function initDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STUDENTS_FILE)) {
    const bundledStudents = path.join(DEFAULT_DATA_DIR, 'students.json');
    if (fs.existsSync(bundledStudents)) {
      fs.copyFileSync(bundledStudents, STUDENTS_FILE);
    } else {
      fs.writeFileSync(STUDENTS_FILE, JSON.stringify(INITIAL_STUDENTS, null, 2), 'utf-8');
    }
    console.log(`[Seed] Initialized students data file.`);
  }

  if (!fs.existsSync(ATTENDANCE_FILE)) {
    const bundledAttendance = path.join(DEFAULT_DATA_DIR, 'attendance.json');
    if (fs.existsSync(bundledAttendance)) {
      fs.copyFileSync(bundledAttendance, ATTENDANCE_FILE);
    } else {
      const attendanceData = generateInitialAttendance();
      fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(attendanceData, null, 2), 'utf-8');
    }
    console.log(`[Seed] Initialized attendance records.`);
  }
}

function getStudents() {
  initDataFiles();
  return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf-8'));
}

function saveStudents(students) {
  initDataFiles();
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');
}

function getAttendance() {
  initDataFiles();
  return JSON.parse(fs.readFileSync(ATTENDANCE_FILE, 'utf-8'));
}

function saveAttendance(attendance) {
  initDataFiles();
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(attendance, null, 2), 'utf-8');
}

module.exports = {
  initDataFiles,
  getStudents,
  saveStudents,
  getAttendance,
  saveAttendance
};
