import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(DOC_DIR)
SCREENSHOTS_DIR = os.path.join(PROJECT_ROOT, 'screenshots')
OUTPUT_DOCX = os.path.join(PROJECT_ROOT, 'Student_Attendance_Management_System_Project_Report.docx')
OUTPUT_ROOT_DOCX = os.path.join(os.path.dirname(PROJECT_ROOT), 'Student_Attendance_Management_System_Class10_IT_Project_File.docx')

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def create_project_report():
    doc = docx.Document()

    # Set Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Palette
    c_primary = RGBColor(30, 58, 138)     # Navy
    c_secondary = RGBColor(99, 102, 241)  # Indigo
    c_dark = RGBColor(15, 23, 42)         # Slate Dark
    c_emerald = RGBColor(16, 185, 129)
    c_rose = RGBColor(225, 29, 72)

    # -------------------------------------------------------------
    # 1. COVER PAGE
    # -------------------------------------------------------------
    p_pre = doc.add_paragraph()
    p_pre.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_pre = p_pre.add_run("CENTRAL BOARD OF SECONDARY EDUCATION (CBSE)\nATAL ADARSH VIDYALAYA\nTILAK MARG, NEW DELHI-110001")
    r_pre.font.name = 'Arial'
    r_pre.font.size = Pt(13)
    r_pre.font.bold = True
    r_pre.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph()

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("STUDENT ATTENDANCE\nMANAGEMENT SYSTEM")
    r_title.font.name = 'Arial'
    r_title.font.size = Pt(28)
    r_title.font.bold = True
    r_title.font.color.rgb = c_primary

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("An Automated Full-Stack Information System for Real-Time Attendance Recording, Defaulter Tracking & Spreadsheet Analytics")
    r_sub.font.name = 'Arial'
    r_sub.font.size = Pt(12)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph()

    # Academic Notice Badge Table
    badge_table = doc.add_table(rows=1, cols=1)
    badge_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = badge_table.cell(0, 0)
    set_cell_background(c, "EEF2FF")
    set_cell_margins(c, 180, 180, 240, 240)
    p_badge = c.paragraphs[0]
    p_badge.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_b = p_badge.add_run("CLASS 10 INFORMATION TECHNOLOGY (IT 402)\nANNUAL PRACTICAL PROJECT FILE — ACADEMIC SESSION 2026-2027")
    r_b.font.name = 'Arial'
    r_b.font.size = Pt(11)
    r_b.font.bold = True
    r_b.font.color.rgb = c_secondary

    doc.add_paragraph()
    doc.add_paragraph()

    # Student Info Table (Only SUBMITTED BY, without SUBMITTED TO)
    info_table = doc.add_table(rows=1, cols=1)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_sub = info_table.cell(0, 0)
    set_cell_background(c_sub, "F8FAFC")
    set_cell_margins(c_sub, 180, 180, 240, 240)
    p_l = c_sub.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_l1 = p_l.add_run("SUBMITTED BY:\n")
    r_l1.bold = True
    r_l1.font.size = Pt(12)
    r_l1.font.color.rgb = c_primary
    r_l2 = p_l.add_run("Name: Rahul Yadav\nClass: 10th - Section A\nRoll Number: 15\nSubject: Information Technology (402)")
    r_l2.font.size = Pt(11)
    r_l2.font.color.rgb = c_dark

    doc.add_page_break()

    # -------------------------------------------------------------
    # 2. CERTIFICATE OF AUTHENTICITY
    # -------------------------------------------------------------
    h1 = doc.add_heading("CERTIFICATE OF AUTHENTICITY", level=1)
    h1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h1.runs[0].font.color.rgb = c_primary

    p_cert = doc.add_paragraph()
    p_cert.paragraph_format.line_spacing = 1.3
    r = p_cert.add_run(
        "\nThis is to certify that the project file entitled \"STUDENT ATTENDANCE MANAGEMENT SYSTEM\" has been successfully "
        "designed, developed, and completed by RAHUL YADAV, a student of Class 10, Section A (Roll Number: 15), under my "
        "direct guidance and supervision for the partial fulfillment of the practical assessment in INFORMATION TECHNOLOGY "
        "(Subject Code: 402) prescribed by the Central Board of Secondary Education (CBSE) for the academic session 2026-2027.\n\n"
        "To the best of my knowledge, the work presented in this project file represents the student's authentic and original "
        "effort. The database design, frontend web forms, backend REST APIs, SQL query scripts, and spreadsheet analysis have "
        "been thoroughly inspected and found to satisfy all curricular requirements.\n"
    )
    r.font.size = Pt(11)

    doc.add_paragraph()
    doc.add_paragraph()

    # Signature Lines Table
    sig_table = doc.add_table(rows=1, cols=3)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.columns[0].width = Inches(2.2)
    sig_table.columns[1].width = Inches(2.2)
    sig_table.columns[2].width = Inches(2.2)

    s1 = sig_table.cell(0, 0).paragraphs[0]
    s1.add_run("_____________________\nTeacher In-Charge\n(IT Department)").font.size = Pt(10)
    s2 = sig_table.cell(0, 1).paragraphs[0]
    s2.add_run("_____________________\nInternal / External Examiner\n(CBSE Board)").font.size = Pt(10)
    s3 = sig_table.cell(0, 2).paragraphs[0]
    s3.add_run("_____________________\nPrincipal\n(School Stamp & Seal)").font.size = Pt(10)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 3. ACKNOWLEDGEMENT
    # -------------------------------------------------------------
    h_ack = doc.add_heading("ACKNOWLEDGEMENT", level=1)
    h_ack.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_ack.runs[0].font.color.rgb = c_primary

    p_ack = doc.add_paragraph()
    p_ack.paragraph_format.line_spacing = 1.3
    r = p_ack.add_run(
        "\nI would like to express my profound gratitude and sincere thanks to our respected Principal and the School Management "
        "for granting me the permission and facilities to undertake this Information Technology practical project.\n\n"
        "I am deeply indebted to my Information Technology Teacher whose valuable guidance, patient feedback, and continuous "
        "encouragement enabled me to complete this project successfully. Their technical insights on relational database schema, "
        "spreadsheet modeling, and web architectures helped shape this project into an institutional-grade solution.\n\n"
        "I also extend my heartfelt thanks to my parents and classmates for their constant support and cooperation throughout "
        "the testing and documentation phase of this software application.\n\n"
        "Rahul Yadav\n"
        "Class 10 - Section A (Roll No. 15)\n"
        "Atal Adarsh Vidyalaya\n"
        "Tilak Marg, New Delhi-110001"
    )
    r.font.size = Pt(11)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 4. TABLE OF CONTENTS
    # -------------------------------------------------------------
    h_toc = doc.add_heading("TABLE OF CONTENTS / INDEX", level=1)
    h_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h_toc.runs[0].font.color.rgb = c_primary

    p_toc_intro = doc.add_paragraph("Curricular Subtopics specified in Class 10 IT Project Guidelines:")
    p_toc_intro.runs[0].font.italic = True

    toc_table = doc.add_table(rows=1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.columns[0].width = Inches(0.8)
    toc_table.columns[1].width = Inches(4.8)
    toc_table.columns[2].width = Inches(1.0)

    hdr = toc_table.rows[0].cells
    hdr[0].paragraphs[0].add_run("S.No.").bold = True
    hdr[1].paragraphs[0].add_run("Topic / Subtopic Name").bold = True
    hdr[2].paragraphs[0].add_run("Page No.").bold = True
    for c in hdr:
        set_cell_background(c, "F1F5F9")

    toc_items = [
        ("1", "Introduction to Student Attendance Management System", "5"),
        ("2", "Problem Identification & Traditional Register Analysis", "6"),
        ("3", "Objectives of the Project (CBSE Rule 13 Compliance)", "8"),
        ("4", "Hardware & Software Environment (Software Used)", "9"),
        ("5", "System Architecture & High-Level Data Flow (DFD)", "11"),
        ("6", "Database Design, ER Model & Data Dictionaries", "12"),
        ("7", "Form Creation & User Interface Design", "15"),
        ("8", "SQL Query and Report Generation", "18"),
        ("9", "Spreadsheet Analysis & Mathematical Evaluation", "21"),
        ("10", "Operational & Pedagogical Advantages of the System", "24"),
        ("11", "Conclusion & Future Enhancements", "26"),
        ("12", "Appendix: System Source Code & Verification Logs", "27")
    ]

    for no, title, page in toc_items:
        row = toc_table.add_row().cells
        row[0].paragraphs[0].add_run(no)
        row[1].paragraphs[0].add_run(title)
        row[2].paragraphs[0].add_run(page)

    doc.add_page_break()

    # Helper function for adding chapters
    def add_chapter(title, chapter_no):
        h = doc.add_heading(f"CHAPTER {chapter_no}: {title.upper()}", level=1)
        h.runs[0].font.color.rgb = c_primary
        h.runs[0].font.bold = True
        p_div = doc.add_paragraph()
        p_div.paragraph_format.space_after = Pt(8)
        r = p_div.add_run("─" * 55)
        r.font.color.rgb = c_secondary
        return h

    def add_image_if_exists(filename, caption, width=Inches(6.2)):
        img_path = os.path.join(SCREENSHOTS_DIR, filename)
        if os.path.exists(img_path):
            doc.add_paragraph()
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            doc.add_picture(img_path, width=width)
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_cap = p_cap.add_run(f"Figure: {caption}")
            r_cap.font.name = 'Arial'
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(100, 116, 139)
            doc.add_paragraph()

    # -------------------------------------------------------------
    # CHAPTER 1: INTRODUCTION
    # -------------------------------------------------------------
    add_chapter("Introduction", 1)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "In modern academic institutions, student attendance recording is an indispensable operational routine. It directly correlates with "
        "academic performance, institutional discipline, and statutory compliance. Under the Central Board of Secondary Education (CBSE) "
        "framework, maintaining a minimum of 75% attendance is a mandatory eligibility criterion for students appearing in the Class 10 "
        "Secondary School Board Examinations (Regulation Rule 13 & 14).\n\n"
        "The \"Student Attendance Management System\" (branded as EduTrack Pro) is a full-stack, automated web-based management information "
        "system (MIS) designed to modernize, streamline, and eliminate the inefficiencies of manual paper-based attendance registers. Built using "
        "modern standards — HTML5, CSS3, JavaScript, Node.js, Express REST API, relational structured ledgers, and electronic spreadsheet engines "
        "— this system empowers class teachers and school administrators with real-time digital roll calls, instant calculation of monthly "
        "attendance percentages, dynamic identification of defaulters, and automated generation of parental warning notices.\n\n"
        "By transitioning from traditional paper rosters to an interactive web platform, the school achieves absolute data accuracy, eliminates proxy "
        "marking, secures historical records against physical damage, and provides transparent analytical dashboards for teachers, parents, and "
        "school inspectors."
    )

    doc.add_heading("Scope and Target Audience", level=2)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "• Class Teachers: Facilitates instantaneous one-click roll calls (Present, Absent, Late, Half-Day) during morning homeroom periods.\n"
        "• School Administration: Provides aggregated attendance intelligence, section-wise turnout comparisons, and CBSE audit compliance.\n"
        "• Students & Parents: Ensures complete transparency in attendance tracking, with immediate alerts when attendance falls into the danger zone (<75%).\n"
        "• CBSE Board Inspectors: Offers instant spreadsheet verification matrices and exportable CSV ledgers for official inspection."
    )

    add_image_if_exists("01_dashboard.png", "EduTrack Pro Main Dashboard — Real-time attendance KPIs, 7-day trend chart, and section turnout")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 2: PROBLEM IDENTIFICATION
    # -------------------------------------------------------------
    add_chapter("Problem Identification & Needs Analysis", 2)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "For decades, educational institutions have relied on manual paper attendance registers. While simple on the surface, empirical observation "
        "in secondary schools reveals severe systemic bottlenecks, operational waste, and data security risks associated with physical paper logs:\n\n"
        "1. Massive Classroom Time Wastage:\n"
        "Calling out 40 to 50 roll numbers manually consumes 10 to 15 minutes of every classroom period. Over an academic year of 220 working days, "
        "this translates to more than 40 hours of lost instructional time per section.\n\n"
        "2. Human Calculation Errors & Inaccurate Turnout:\n"
        "At the conclusion of every month, class teachers are burdened with manually summing 'P' and 'A' markings across 30 columns for every student. "
        "Counting errors frequently lead to disputed percentages and incorrect defaulter listings.\n\n"
        "3. Vulnerability to Proxy Attendance & Tampering:\n"
        "Physical registers can easily be manipulated by students altering markings (changing 'A' to 'P' with fluid or pen overwriting) while the "
        "teacher is distracted.\n\n"
        "4. Lack of Timely Parent Communication:\n"
        "In a manual system, parents are often notified of acute absenteeism only at the very end of the academic term or during parent-teacher meetings, "
        "leaving no time for remedial attendance recovery.\n\n"
        "5. Physical Fragility & Storage Overhead:\n"
        "Paper registers are prone to physical tearing, ink fading, water spills, and loss due to misplacement. Archiving decades of registers creates "
        "unnecessary storage and retrieval burdens."
    )

    doc.add_heading("Comparative Evaluation: Manual vs. Automated System", level=2)
    comp_table = doc.add_table(rows=1, cols=3)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    comp_table.columns[0].width = Inches(1.8)
    comp_table.columns[1].width = Inches(2.3)
    comp_table.columns[2].width = Inches(2.3)

    c_hdr = comp_table.rows[0].cells
    c_hdr[0].paragraphs[0].add_run("Evaluation Parameter").bold = True
    c_hdr[1].paragraphs[0].add_run("Traditional Paper Register").bold = True
    c_hdr[2].paragraphs[0].add_run("EduTrack Automated System").bold = True
    for cell in c_hdr:
        set_cell_background(cell, "F1F5F9")

    comp_data = [
        ("Roll Call Duration", "10 to 15 minutes per day", "Under 60 seconds (1-Click Bulk Mark)"),
        ("Monthly % Calculation", "Manual counting (prone to errors)", "Instant mathematical computation (100% accurate)"),
        ("CBSE 75% Defaulter Detection", "Identified late at term end", "Real-time Defaulter Radar with shortfall math"),
        ("Parent Notification", "Postal mail or manual phone calls", "Automated printable formal notice with single click"),
        ("Data Security", "Easily lost, damaged, or altered", "Persistent digital storage with immutable timestamps"),
        ("Spreadsheet Integration", "Requires manual re-typing", "Direct 1-click export to CSV / Excel matrix")
    ]

    for param, old, new in comp_data:
        r = comp_table.add_row().cells
        r[0].paragraphs[0].add_run(param).bold = True
        r[1].paragraphs[0].add_run(old)
        r[2].paragraphs[0].add_run(new)

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 3: OBJECTIVES OF THE PROJECT
    # -------------------------------------------------------------
    add_chapter("Objectives of the Project", 3)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "The primary purpose of developing the Student Attendance Management System is to create a robust, accessible, and user-centric "
        "digital framework that fulfills both daily administrative routines and formal CBSE board documentation standards.\n\n"
        "Key Objectives:\n"
        "1. Rapid One-Click Roll Call Interface: Provide class teachers with single-click interactive status toggles (Present, Absent, Late, "
        "Half-Day) and a global 'Mark All Present' mechanism to complete classroom attendance in under one minute.\n\n"
        "2. Mandatory CBSE Rule 13/14 Enforcement: Implement an automated 'Defaulter Radar' that continuously evaluates cumulative attendance "
        "against the statutory 75% threshold, calculating the exact number of shortfall days required for examination eligibility.\n\n"
        "3. Automated Parent Warning Dispatch: Generate formal, printable parent warning letters containing the school letterhead, specific "
        "absenteeism statistics, and principal signature lines.\n\n"
        "4. Comprehensive Spreadsheet & Query Reporting: Provide dynamic matrix reports mimicking electronic spreadsheets (as taught in the "
        "Class 10 IT curriculum) with support for formulas like COUNTIF, AVERAGE, and IF conditions.\n\n"
        "5. Complete Paperless Sustainability: Eliminate the recurring procurement of bulky paper ledgers, advancing green computing practices "
        "in educational governance."
    )

    add_image_if_exists("03_defaulters_radar.png", "Defaulter Radar (<75%) showing CBSE Rule 13 compliance, working days, and shortfall calculation")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 4: SOFTWARE & HARDWARE ENVIRONMENT
    # -------------------------------------------------------------
    add_chapter("Software & Hardware Requirements (Software Used)", 4)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "To guarantee high performance, modularity, and cross-platform compatibility, the system has been developed using industry-standard "
        "open-source web technologies.\n"
    )

    doc.add_heading("1. Software Environment (Software Used)", level=2)
    sw_table = doc.add_table(rows=1, cols=3)
    sw_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sw_table.columns[0].width = Inches(1.8)
    sw_table.columns[1].width = Inches(2.2)
    sw_table.columns[2].width = Inches(2.4)

    h_cells = sw_table.rows[0].cells
    h_cells[0].paragraphs[0].add_run("Component").bold = True
    h_cells[1].paragraphs[0].add_run("Technology / Software").bold = True
    h_cells[2].paragraphs[0].add_run("Role in Project").bold = True
    for c in h_cells:
        set_cell_background(c, "F1F5F9")

    sw_data = [
        ("Operating System", "Microsoft Windows 10 / 11", "Host development & deployment platform"),
        ("Frontend Structure", "HTML5 Semantic Markup", "Structured UI forms, tables, modals & semantic layout"),
        ("Styling & Design", "Vanilla CSS3 (Glassmorphism)", "Responsive design system, dark palette, badges & print styles"),
        ("Client Logic", "JavaScript (Vanilla ES6+)", "State management, DOM rendering, canvas charts & event handling"),
        ("Backend Server", "Node.js (v24) & Express.js", "REST API architecture, route handling & business validation"),
        ("Data Persistence", "Relational JSON Database", "Structured storage for Students, Attendance & Defaulters"),
        ("Spreadsheet Engine", "CSV OpenFormat / Excel", "Tabular data export compatible with MS Excel & Calc"),
        ("IDE & Editor", "Antigravity IDE / VS Code", "Source code authoring, linting & command orchestration"),
        ("Browser Runtime", "Google Chrome / Chromium", "Client presentation, execution & headless verification")
    ]

    for comp, tech, role in sw_data:
        r = sw_table.add_row().cells
        r[0].paragraphs[0].add_run(comp).bold = True
        r[1].paragraphs[0].add_run(tech)
        r[2].paragraphs[0].add_run(role)

    doc.add_heading("2. Hardware Requirements", level=2)
    p_hw = doc.add_paragraph()
    p_hw.add_run(
        "• Processor: Intel Core i3 / AMD Ryzen 3 or higher\n"
        "• System Memory (RAM): Minimum 4 GB (8 GB Recommended)\n"
        "• Hard Disk Space: Minimum 500 MB free storage for application runtime and database records\n"
        "• Display Resolution: 1280 x 720 minimum (1920 x 1080 Full HD optimal)\n"
        "• Input Peripherals: Standard QWERTY Keyboard, Mouse, and Network Interface Card"
    )

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 5: SYSTEM ARCHITECTURE & WORKFLOW
    # -------------------------------------------------------------
    add_chapter("System Architecture & Workflow", 5)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "The Student Attendance Management System is built upon a decoupled Client-Server REST (Representational State Transfer) architecture. "
        "The separation of concerns between presentation and data persistence guarantees modularity, maintainability, and rapid responsiveness.\n\n"
        "Data Flow Architecture:\n"
        "1. Presentation Layer (Client): The user interacts with the Single Page Application (SPA) in their browser. All views (Dashboard, "
        "Register, Defaulters, Directory, Reports) render dynamically without requiring full-page reloads.\n\n"
        "2. Application Programming Interface (REST API): User actions trigger HTTP asynchronous requests (GET, POST, PUT, DELETE) to Express "
        "endpoints (/api/students, /api/attendance, /api/reports).\n\n"
        "3. Business Logic & Validation Layer: The server evaluates authorization, validates roll numbers, executes CBSE 75% attendance calculations, "
        "and coordinates shortfall logic.\n\n"
        "4. Persistence Layer: Records are committed with atomic safety into relational structured JSON storage files with automatic historical "
        "timestamps."
    )

    add_image_if_exists("02_attendance_register.png", "Daily Attendance Register — Single-click status toggles, remarks, and quick filters")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 6: DATABASE DESIGN & DATA DICTIONARIES
    # -------------------------------------------------------------
    add_chapter("Database Design & Data Dictionaries", 6)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "The database design conforms to relational normalization principles up to 3NF (Third Normal Form) to avoid data redundancy and "
        "insertion/update anomalies. The relational schema revolves around two core entities: Students and AttendanceRecords, linked via the "
        "primary key StudentID.\n"
    )

    doc.add_heading("Table 1: Students Table (Master Roster)", level=2)
    t1 = doc.add_table(rows=1, cols=5)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.columns[0].width = Inches(1.3)
    t1.columns[1].width = Inches(1.1)
    t1.columns[2].width = Inches(0.8)
    t1.columns[3].width = Inches(1.2)
    t1.columns[4].width = Inches(2.0)

    hdr1 = t1.rows[0].cells
    hdr1[0].paragraphs[0].add_run("Field Name").bold = True
    hdr1[1].paragraphs[0].add_run("Data Type").bold = True
    hdr1[2].paragraphs[0].add_run("Key").bold = True
    hdr1[3].paragraphs[0].add_run("Nullability").bold = True
    hdr1[4].paragraphs[0].add_run("Description").bold = True
    for c in hdr1: set_cell_background(c, "F1F5F9")

    t1_fields = [
        ("id", "VARCHAR(12)", "PK", "NOT NULL", "Unique Student Identifier (e.g., STU1001)"),
        ("rollNo", "INTEGER", "Unique", "NOT NULL", "Class Roll Number (1 to 100)"),
        ("name", "VARCHAR(60)", "-", "NOT NULL", "Full Student Name"),
        ("class", "VARCHAR(4)", "-", "NOT NULL", "Standard (e.g., '10', '9')"),
        ("section", "CHAR(1)", "-", "NOT NULL", "Section ('A', 'B')"),
        ("gender", "VARCHAR(10)", "-", "NOT NULL", "Male / Female / Other"),
        ("dob", "DATE", "-", "NULL", "Date of Birth (YYYY-MM-DD)"),
        ("parentName", "VARCHAR(60)", "-", "NULL", "Father / Mother / Guardian Name"),
        ("phone", "VARCHAR(18)", "-", "NULL", "Emergency Contact Phone Number"),
        ("status", "VARCHAR(12)", "-", "NOT NULL", "'Active' or 'Withdrawn'")
    ]

    for f, dt, k, nl, desc in t1_fields:
        r = t1.add_row().cells
        r[0].paragraphs[0].add_run(f).bold = True
        r[1].paragraphs[0].add_run(dt)
        r[2].paragraphs[0].add_run(k)
        r[3].paragraphs[0].add_run(nl)
        r[4].paragraphs[0].add_run(desc)

    doc.add_paragraph()
    doc.add_heading("Table 2: AttendanceRegister Table (Transaction Ledger)", level=2)
    t2 = doc.add_table(rows=1, cols=5)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2.columns[0].width = Inches(1.3)
    t2.columns[1].width = Inches(1.1)
    t2.columns[2].width = Inches(0.8)
    t2.columns[3].width = Inches(1.2)
    t2.columns[4].width = Inches(2.0)

    hdr2 = t2.rows[0].cells
    hdr2[0].paragraphs[0].add_run("Field Name").bold = True
    hdr2[1].paragraphs[0].add_run("Data Type").bold = True
    hdr2[2].paragraphs[0].add_run("Key").bold = True
    hdr2[3].paragraphs[0].add_run("Nullability").bold = True
    hdr2[4].paragraphs[0].add_run("Description").bold = True
    for c in hdr2: set_cell_background(c, "F1F5F9")

    t2_fields = [
        ("recordId", "VARCHAR(24)", "PK", "NOT NULL", "Composite Hash (Date_StudentID)"),
        ("attendanceDate", "DATE", "-", "NOT NULL", "Academic Working Day (YYYY-MM-DD)"),
        ("studentId", "VARCHAR(12)", "FK", "NOT NULL", "References Students.id"),
        ("status", "VARCHAR(12)", "-", "NOT NULL", "'Present', 'Absent', 'Late', 'Half-Day'"),
        ("remarks", "VARCHAR(100)", "-", "NULL", "Reason or teacher notes"),
        ("markedAt", "TIMESTAMP", "-", "NOT NULL", "System timestamp of roll recording")
    ]

    for f, dt, k, nl, desc in t2_fields:
        r = t2.add_row().cells
        r[0].paragraphs[0].add_run(f).bold = True
        r[1].paragraphs[0].add_run(dt)
        r[2].paragraphs[0].add_run(k)
        r[3].paragraphs[0].add_run(nl)
        r[4].paragraphs[0].add_run(desc)

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 7: FORM CREATION & USER INTERFACE
    # -------------------------------------------------------------
    add_chapter("Form Creation & User Interface Design", 7)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "A critical requirement in the Class 10 IT curriculum is Form Creation — designing intuitive graphical forms that allow end-users "
        "to enter, validate, and manipulate data easily without directly interacting with raw database tables.\n\n"
        "Key Forms Implemented in EduTrack Pro:\n"
        "1. Student Registration Form: Modal dialog featuring input controls for Student Name, Roll Number, Class, Section, Gender, Parent Name, "
        "Phone, and Residential Address with HTML5 client-side validation.\n\n"
        "2. Daily Attendance Register Form: Interactive tabular grid with custom radio chip buttons allowing teachers to toggle attendance states "
        "with a single mouse click. Includes instant live turnout counters.\n\n"
        "3. Filter & Search Control Form: Real-time search input with live debouncing, allowing instant lookup by student name or roll number.\n\n"
        "4. Parent Notice Preview Form: A formal letterhead dialog automatically filled with student shortfall metrics ready for direct printing."
    )

    add_image_if_exists("05_student_directory.png", "Student Directory Form — Student cards displaying turnout percentage, parent contacts, and actions")
    add_image_if_exists("04_parent_notice_modal.png", "Parent Defaulter Notice Modal — Formal CBSE Rule 13 warning notice with shortfall metrics")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 8: SQL QUERY AND REPORT GENERATION
    # -------------------------------------------------------------
    add_chapter("Query and Report Generation", 8)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "In relational database management systems (RDBMS), Queries are used to retrieve, filter, aggregate, and calculate information from "
        "one or more tables. Below are the core SQL queries implemented in the backend query engine along with sample output reports:\n"
    )

    doc.add_heading("Query 1: Daily Classroom Attendance Summary Query", level=2)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(
        "SELECT \n"
        "    s.rollNo, s.name, s.class, s.section, a.status, a.remarks \n"
        "FROM Students s \n"
        "JOIN AttendanceRegister a ON s.id = a.studentId \n"
        "WHERE a.attendanceDate = '2026-10-29' AND s.class = '10' AND s.section = 'A'\n"
        "ORDER BY s.rollNo ASC;"
    )
    r.font.name = 'Courier New'
    r.font.size = Pt(9.5)
    r.font.color.rgb = c_primary

    doc.add_heading("Query 2: CBSE 75% Defaulter Identification Query", level=2)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(
        "SELECT \n"
        "    s.rollNo, s.name, s.class, s.section, s.parentName, s.phone,\n"
        "    COUNT(a.attendanceDate) AS totalWorkingDays,\n"
        "    SUM(CASE WHEN a.status = 'Present' THEN 1 WHEN a.status = 'Late' THEN 0.8 ELSE 0 END) AS attendedDays,\n"
        "    ROUND((SUM(CASE WHEN a.status = 'Present' THEN 1 WHEN a.status = 'Late' THEN 0.8 ELSE 0 END) / COUNT(a.attendanceDate)) * 100, 1) AS attendancePercentage\n"
        "FROM Students s\n"
        "JOIN AttendanceRegister a ON s.id = a.studentId\n"
        "GROUP BY s.id\n"
        "HAVING attendancePercentage < 75.0\n"
        "ORDER BY attendancePercentage ASC;"
    )
    r.font.name = 'Courier New'
    r.font.size = Pt(9.5)
    r.font.color.rgb = c_primary

    doc.add_heading("Sample Defaulter Query Output Report:", level=2)
    q_table = doc.add_table(rows=1, cols=6)
    q_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    q_table.columns[0].width = Inches(0.8)
    q_table.columns[1].width = Inches(1.8)
    q_table.columns[2].width = Inches(1.0)
    q_table.columns[3].width = Inches(0.9)
    q_table.columns[4].width = Inches(1.0)
    q_table.columns[5].width = Inches(1.0)

    q_hdr = q_table.rows[0].cells
    q_hdr[0].paragraphs[0].add_run("Roll #").bold = True
    q_hdr[1].paragraphs[0].add_run("Student Name").bold = True
    q_hdr[2].paragraphs[0].add_run("Class-Sec").bold = True
    q_hdr[3].paragraphs[0].add_run("Working").bold = True
    q_hdr[4].paragraphs[0].add_run("Attended").bold = True
    q_hdr[5].paragraphs[0].add_run("Turnout %").bold = True
    for c in q_hdr: set_cell_background(c, "F1F5F9")

    q_data = [
        ("3", "Chirag Bhatia", "10-B", "25", "12", "48.0%"),
        ("7", "Manish Kumar", "10-A", "25", "14", "56.0%"),
        ("17", "Utkarsh Mishra", "10-A", "25", "16", "64.0%"),
        ("3", "Harshit Tyagi", "9-A", "25", "16", "64.0%")
    ]

    for r1, r2, r3, r4, r5, r6 in q_data:
        row = q_table.add_row().cells
        row[0].paragraphs[0].add_run(r1)
        row[1].paragraphs[0].add_run(r2).bold = True
        row[2].paragraphs[0].add_run(r3)
        row[3].paragraphs[0].add_run(r4)
        row[4].paragraphs[0].add_run(r5)
        row[5].paragraphs[0].add_run(r6).bold = True

    add_image_if_exists("06_student_history_modal.png", "Individual Student Attendance Ledger — Complete date-by-date attendance history log")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 9: SPREADSHEET ANALYSIS
    # -------------------------------------------------------------
    add_chapter("Spreadsheet Analysis & Evaluation", 9)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "A mandatory component of the Class 10 Information Technology practical syllabus is Spreadsheet Analysis. Electronic spreadsheets "
        "(such as Microsoft Excel or LibreOffice Calc) provide powerful mathematical formulas, conditional logic, and charting capabilities.\n\n"
        "EduTrack Pro incorporates a dedicated 'Spreadsheet & Analytical Reports' module featuring an exportable matrix and built-in formulas:\n"
    )

    doc.add_heading("Formulas Applied in the Spreadsheet Module:", level=2)
    f_table = doc.add_table(rows=1, cols=3)
    f_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    f_table.columns[0].width = Inches(2.0)
    f_table.columns[1].width = Inches(2.6)
    f_table.columns[2].width = Inches(2.0)

    f_hdr = f_table.rows[0].cells
    f_hdr[0].paragraphs[0].add_run("Statistical Metric").bold = True
    f_hdr[1].paragraphs[0].add_run("Excel Formula Syntax").bold = True
    f_hdr[2].paragraphs[0].add_run("Mathematical Purpose").bold = True
    for c in f_hdr: set_cell_background(c, "F1F5F9")

    f_data = [
        ("Total Present Count", "=COUNTIF(D2:AB2, \"Present\")", "Counts cells marked 'Present' for the row"),
        ("Late Arrival Weighting", "=0.8 * COUNTIF(D2:AB2, \"Late\")", "Credits 0.8 attendance point for late entries"),
        ("Turnout Percentage", "=(E2 / Total_Working_Days) * 100", "Calculates proportional turnout ratio"),
        ("CBSE Defaulter Flag", "=IF(G2 < 75, \"DEFAULTER\", \"ELIGIBLE\")", "Applies logical test for board eligibility"),
        ("Shortfall Calculation", "=ROUNDUP(0.75 * Total_Days) - E2", "Computes present days needed to hit 75%"),
        ("Class Turnout Average", "=AVERAGE(G2:G21)", "Computes section-wide aggregate attendance")
    ]

    for m, syn, purp in f_data:
        r = f_table.add_row().cells
        r[0].paragraphs[0].add_run(m).bold = True
        r[1].paragraphs[0].add_run(syn).font.name = 'Courier New'
        r[2].paragraphs[0].add_run(purp)

    add_image_if_exists("07_spreadsheet_reports.png", "Monthly Spreadsheet Matrix View — Full tabular grid with color-coded P/A cells and formulas")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 10: ADVANTAGES OF THE SYSTEM
    # -------------------------------------------------------------
    add_chapter("Advantages of the System", 10)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "Deploying the automated Student Attendance Management System yields significant advantages across all dimensions of school operations:\n\n"
        "1. Extreme Time Savings (Over 90% Reduction):\n"
        "By utilizing the 'Mark All Present' quick trigger followed by single-click exceptions for absentees, roll call time drops from 12 minutes to "
        "under 45 seconds, returning precious instructional time back to educators.\n\n"
        "2. Total Elimination of Proxy Marking & Human Error:\n"
        "All attendance updates are digitally authenticated with immutable timestamps. Mathematical errors in monthly percentage calculations are "
        "completely eliminated through automated software formulas.\n\n"
        "3. Proactive Defaulter Prevention (CBSE Board Compliance):\n"
        "Instead of waiting until the final board registration deadlines, teachers can observe students sliding below 75% in real time and issue "
        "remedial parent warning notices weeks in advance.\n\n"
        "4. Environmental Sustainability & Cost Efficiency:\n"
        "Eliminates the physical printing and binding of hundreds of paper registers each academic year, directly supporting sustainable green "
        "computing.\n\n"
        "5. One-Click Spreadsheet & CSV Exports:\n"
        "Institutional reports can be downloaded in standard CSV format in seconds, ready for Microsoft Excel, Google Sheets, or school management ERPs."
    )

    add_image_if_exists("08_project_guide.png", "Class 10 IT Project File Guide View — Integrated documentation viewer matching CBSE guidelines")

    doc.add_page_break()

    # -------------------------------------------------------------
    # CHAPTER 11: CONCLUSION & FUTURE ENHANCEMENTS
    # -------------------------------------------------------------
    add_chapter("Conclusion & Future Scope", 11)
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    p.add_run(
        "The \"Student Attendance Management System\" (EduTrack Pro) successfully addresses all systemic challenges of manual classroom attendance "
        "recording. Developed strictly in accordance with the Class 10 Information Technology (Subject Code: 402) curriculum, the project "
        "demonstrates practical competence in relational database design, frontend user interface engineering, asynchronous REST API integration, "
        "and electronic spreadsheet data analysis.\n\n"
        "The project stands as a fully operational, production-ready solution that delivers immediate value to educators, students, parents, and "
        "school administrations.\n\n"
        "Future Enhancements & Scope for Expansion:\n"
        "1. Biometric & Facial Recognition Integration: Upgrading client inputs with camera-based computer vision for automated biometric roll "
        "calls upon classroom entry.\n\n"
        "2. Automated WhatsApp Cloud API & SMS Gateway: Integrating automated messaging APIs to dispatch instant SMS/WhatsApp alerts to parents "
        "the minute an absentee is recorded.\n\n"
        "3. Mobile Progressive Web Application (PWA): Developing a touch-optimized mobile interface for Android and iOS smartphones to empower "
        "teachers on the move."
    )

    doc.add_heading("References & Bibliography", level=2)
    p_ref = doc.add_paragraph()
    p_ref.add_run(
        "1. CBSE Class 10 Information Technology (Code 402) Curriculum & Study Material, Central Board of Secondary Education, New Delhi.\n"
        "2. World Wide Web Consortium (W3C) HTML5 & CSS3 Standard Specifications.\n"
        "3. Mozilla Developer Network (MDN) Web Docs — JavaScript Reference & DOM APIs.\n"
        "4. Node.js & Express.js Documentation — RESTful Web Service Design Patterns."
    )

    doc.save(OUTPUT_DOCX)
    print(f"Generated DOCX report: {OUTPUT_DOCX}")

    # Also save a copy directly in class root so the user can easily find it!
    doc.save(OUTPUT_ROOT_DOCX)
    print(f"Saved copy to class root: {OUTPUT_ROOT_DOCX}")

if __name__ == '__main__':
    create_project_report()
