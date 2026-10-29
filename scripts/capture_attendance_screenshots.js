const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ARTIFACT_DIR = 'C:\\Users\\suraj yadav\\.gemini\\antigravity-ide\\brain\\5fb88e6a-4b12-45f2-aa18-81ddce2997c8';

async function capture() {
  console.log('Launching browser with binary:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  async function saveScreenshot(filename) {
    const localPath = path.join(OUTPUT_DIR, filename);
    const artPath = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: localPath, fullPage: false });
    fs.copyFileSync(localPath, artPath);
    console.log(`Saved screenshot: ${filename}`);
  }

  try {
    console.log('Navigating to http://localhost:5000...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Dashboard
    console.log('Capturing 01_dashboard.png...');
    await saveScreenshot('01_dashboard.png');

    // 2. Attendance Register Tab
    console.log('Capturing 02_attendance_register.png...');
    await page.evaluate(() => switchTab('attendance'));
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot('02_attendance_register.png');

    // 3. Defaulter Radar Tab
    console.log('Capturing 03_defaulters_radar.png...');
    await page.evaluate(() => switchTab('defaulters'));
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot('03_defaulters_radar.png');

    // 4. Parent Notice Modal
    console.log('Capturing 04_parent_notice_modal.png...');
    await page.evaluate(() => {
      if (typeof openNoticeModal === 'function') {
        const id = (currentDefaultersList && currentDefaultersList[0]) ? currentDefaultersList[0].id : 'STU1007';
        openNoticeModal(id);
      }
    });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot('04_parent_notice_modal.png');
    await page.evaluate(() => closeNoticeModal());
    await new Promise(r => setTimeout(r, 400));

    // 5. Student Directory Tab
    console.log('Capturing 05_student_directory.png...');
    await page.evaluate(() => switchTab('students'));
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot('05_student_directory.png');

    // 6. Student History Modal
    console.log('Capturing 06_student_history_modal.png...');
    await page.evaluate(() => {
      if (typeof openStudentHistoryModal === 'function') {
        openStudentHistoryModal('STU1015'); // Suraj Yadav
      }
    });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot('06_student_history_modal.png');
    await page.evaluate(() => closeHistoryModal());
    await new Promise(r => setTimeout(r, 400));

    // 7. Spreadsheet & Reports Tab
    console.log('Capturing 07_spreadsheet_reports.png...');
    await page.evaluate(() => switchTab('reports'));
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot('07_spreadsheet_reports.png');

    // 8. Class 10 IT File Guide Tab
    console.log('Capturing 08_project_guide.png...');
    await page.evaluate(() => switchTab('syllabus'));
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot('08_project_guide.png');

    console.log('ALL 8 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
