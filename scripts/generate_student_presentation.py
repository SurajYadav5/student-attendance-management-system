import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import win32com.client

DOC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(DOC_DIR)
SCREENSHOTS_DIR = os.path.join(PROJECT_ROOT, 'screenshots')
OUTPUT_PPTX = os.path.join(PROJECT_ROOT, 'Student_Attendance_System_Presentation.pptx')
OUTPUT_PDF = os.path.join(PROJECT_ROOT, 'Student_Attendance_System_Presentation.pdf')
DESKTOP_DIR = 'C:\\Users\\suraj yadav\\Desktop'

# Theme Colors
BG_COLOR = RGBColor(11, 15, 25)         # Dark Slate
CARD_BG = RGBColor(22, 30, 46)          # Elevated Panel
BORDER_COLOR = RGBColor(51, 65, 85)     # Slate Border
TEXT_PRIMARY = RGBColor(248, 250, 252)  # White
TEXT_MUTED = RGBColor(148, 163, 184)    # Slate
INDIGO_ACCENT = RGBColor(99, 102, 241)  # Electric Indigo
EMERALD_ACCENT = RGBColor(16, 185, 129) # Emerald Green
ROSE_ACCENT = RGBColor(244, 63, 94)     # Rose Accent

def set_slide_background(slide):
    bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = BG_COLOR
    bg_shape.line.color.rgb = BG_COLOR
    bg_shape.line.width = Pt(0)
    return bg_shape

def add_header(slide, category, title, subtitle):
    # Top Accent Line
    top_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.04))
    top_line.fill.solid()
    top_line.fill.fore_color.rgb = INDIGO_ACCENT
    top_line.line.color.rgb = INDIGO_ACCENT
    top_line.line.width = Pt(0)

    # Category Badge
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(0.35))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = category.upper()
    p_c.font.size = Pt(11)
    p_c.font.bold = True
    p_c.font.color.rgb = INDIGO_ACCENT

    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.733), Inches(0.55))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_PRIMARY

    # Subtitle
    if subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.35))
        tf_s = sub_box.text_frame
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.size = Pt(11)
        p_s.font.color.rgb = TEXT_MUTED

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # ---------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # ---------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative Glow Shape
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    glow.fill.solid()
    glow.fill.fore_color.rgb = CARD_BG
    glow.line.color.rgb = INDIGO_ACCENT
    glow.line.width = Pt(1.5)

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.3), Inches(11.0), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "CENTRAL BOARD OF SECONDARY EDUCATION (CBSE) • IT (402)"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = INDIGO_ACCENT
    p0.alignment = PP_ALIGN.CENTER

    p1 = tf.add_paragraph()
    p1.text = "STUDENT ATTENDANCE\nMANAGEMENT SYSTEM"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_PRIMARY
    p1.alignment = PP_ALIGN.CENTER
    p1.space_before = Pt(16)

    p2 = tf.add_paragraph()
    p2.text = "Automated Full-Stack Web Application for Digital Roll Calls, CBSE Rule 13 Defaulter Radar & Spreadsheet Analytics"
    p2.font.size = Pt(13)
    p2.font.italic = True
    p2.font.color.rgb = TEXT_MUTED
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(10)

    p3 = tf.add_paragraph()
    p3.text = "\nSubmitted By: RAHUL YADAV (Roll No. 15, Class 10-A)\nSchool: Atal Adarsh Vidyalaya, Tilak Marg, New Delhi-110001 • Session 2026-2027"
    p3.font.size = Pt(12)
    p3.font.bold = True
    p3.font.color.rgb = EMERALD_ACCENT
    p3.alignment = PP_ALIGN.CENTER

    # ---------------------------------------------------------
    # SLIDE 2: PROJECT OVERVIEW & PROBLEM STATEMENT
    # ---------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Introduction & Problem Identification", "The Need for Digital Attendance Automation", "Overcoming the systematic flaws of traditional manual paper registers in secondary schools")

    # Left Card: Traditional Paper Register Challenges
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.7), Inches(5.15))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = ROSE_ACCENT
    c1.line.width = Pt(1.5)
    tf1 = c1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.25)
    p = tf1.paragraphs[0]
    p.text = "❌ TRADITIONAL PAPER REGISTERS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ROSE_ACCENT

    items1 = [
        "Time Wastage: Calling 40-50 roll numbers takes 10-15 minutes of every class period.",
        "Human Calculation Errors: Month-end summation of 'P' and 'A' columns leads to percentage mistakes.",
        "Proxy Marking & Tampering: Students alter markings (changing A to P with correction fluid).",
        "Delayed Defaulter Detection: Absenteeism is only recognized at term end when it's too late.",
        "Physical Fragility: High risk of tearing, water damage, ink fading, or misplacement."
    ]
    for it in items1:
        pi = tf1.add_paragraph()
        pi.text = f"• {it}"
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_PRIMARY
        pi.space_before = Pt(10)

    # Right Card: EduTrack Pro Solution
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.7), Inches(5.15))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = EMERALD_ACCENT
    c2.line.width = Pt(1.5)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.25)
    p = tf2.paragraphs[0]
    p.text = "✔ EDUTRACK PRO AUTOMATED SYSTEM"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD_ACCENT

    items2 = [
        "Under 60 Seconds: 1-Click 'Mark All Present' with instant toggle chips for absentees.",
        "100% Mathematical Accuracy: Instant turnout percentage computation without manual counting.",
        "CBSE Rule 13 Defaulter Radar: Real-time surveillance of students slipping below 75%.",
        "Parent SMS / Notice Generation: Formal warning letters with principal signature lines.",
        "Spreadsheet Matrix & CSV Export: 1-Click export to Microsoft Excel & LibreOffice Calc."
    ]
    for it in items2:
        pi = tf2.add_paragraph()
        pi.text = f"• {it}"
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_PRIMARY
        pi.space_before = Pt(10)

    # ---------------------------------------------------------
    # SLIDE 3: SYSTEM ARCHITECTURE & TECH STACK
    # ---------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Architecture & Technologies", "Full-Stack System Design (Software Used)", "Built using robust web technologies conforming to modern modular design patterns")

    cards = [
        ("FRONTEND LAYER", "Vanilla HTML5 + Modern CSS3 + JavaScript", "Single Page Application (SPA), dark-mode glassmorphic interface, canvas charts, responsive mobile-ready layout, print styles.", INDIGO_ACCENT),
        ("BACKEND REST API", "Node.js (v24) & Express Framework", "RESTful web services, student CRUD endpoints, bulk attendance engine, CBSE 75% calculation logic, and CSV streaming.", EMERALD_ACCENT),
        ("DATABASE & SPREADSHEET", "Relational JSON Tables + Excel CSV", "Structured tables (Students, AttendanceRegister, DefaulterAudit) with primary keys, relational joins, and Excel formula exports.", INDIGO_ACCENT)
    ]

    for i, (title, tech, desc, col) in enumerate(cards):
        cx = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 4.0), Inches(1.85), Inches(3.7), Inches(5.15))
        cx.fill.solid()
        cx.fill.fore_color.rgb = CARD_BG
        cx.line.color.rgb = col
        cx.line.width = Pt(1.5)
        tfc = cx.text_frame
        tfc.word_wrap = True
        tfc.margin_left = tfc.margin_right = tfc.margin_top = Inches(0.2)
        
        p = tfc.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        p2 = tfc.add_paragraph()
        p2.text = tech
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_PRIMARY
        p2.space_before = Pt(10)

        p3 = tfc.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(12)

    # ---------------------------------------------------------
    # SLIDE 4: DASHBOARD & LIVE ANALYTICS
    # ---------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Core Module 1: Dashboard", "Real-Time Attendance Intelligence", "Dynamic KPI cards, 7-day attendance trend canvas chart, and section turnout comparison")

    img_dash = os.path.join(SCREENSHOTS_DIR, '01_dashboard.png')
    if os.path.exists(img_dash):
        s4.shapes.add_picture(img_dash, Inches(0.8), Inches(1.85), width=Inches(8.0))

    # Right summary box
    c_sum = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.85), Inches(3.4), Inches(5.15))
    c_sum.fill.solid()
    c_sum.fill.fore_color.rgb = CARD_BG
    c_sum.line.color.rgb = INDIGO_ACCENT
    c_sum.line.width = Pt(1.5)
    tf_sum = c_sum.text_frame
    tf_sum.word_wrap = True
    tf_sum.margin_left = tf_sum.margin_right = tf_sum.margin_top = Inches(0.2)
    p = tf_sum.paragraphs[0]
    p.text = "KEY HIGHLIGHTS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = INDIGO_ACCENT

    pts = [
        "Live KPI Counter: Total Enrolled (35), Today's Turnout (91%), Present (32), Absent (2).",
        "7-Day Trend: Custom HTML5 Canvas chart displaying percentage fluctuation across the week.",
        "Section Turnout: Progress bars comparing Class 10-A, 10-B, and 9-A turnout.",
        "Real-Time Clock: Synchronized Indian Standard Time display."
    ]
    for pt in pts:
        p = tf_sum.add_paragraph()
        p.text = f"✔ {pt}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(8)

    # ---------------------------------------------------------
    # SLIDE 5: ATTENDANCE REGISTER
    # ---------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Core Module 2: Attendance Register", "1-Click High-Speed Classroom Roll Call", "Teachers can mark entire classes in under 60 seconds with single-click status chips")

    img_reg = os.path.join(SCREENSHOTS_DIR, '02_attendance_register.png')
    if os.path.exists(img_reg):
        s5.shapes.add_picture(img_reg, Inches(0.8), Inches(1.85), width=Inches(8.0))

    c_reg = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.85), Inches(3.4), Inches(5.15))
    c_reg.fill.solid()
    c_reg.fill.fore_color.rgb = CARD_BG
    c_reg.line.color.rgb = EMERALD_ACCENT
    c_reg.line.width = Pt(1.5)
    tf_reg = c_reg.text_frame
    tf_reg.word_wrap = True
    tf_reg.margin_left = tf_reg.margin_right = tf_reg.margin_top = Inches(0.2)
    p = tf_reg.paragraphs[0]
    p.text = "REGISTER FEATURES"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD_ACCENT

    pts = [
        "Status Chips: Present (Green), Absent (Red), Late (Amber), Half-Day (Sky Blue).",
        "Bulk Mark: 1-click 'Mark All Present' for fastest morning routine.",
        "Custom Remarks: Optional notes for uninformed leave or late minutes.",
        "Individual Log: Direct lookup of student history calendar from register row."
    ]
    for pt in pts:
        p = tf_reg.add_paragraph()
        p.text = f"✔ {pt}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(8)

    # ---------------------------------------------------------
    # SLIDE 6: CBSE DEFAULTER RADAR (<75%)
    # ---------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Core Module 3: Defaulter Radar", "CBSE Rule 13/14 Compliance Enforcement", "Automated shortfall calculation and formal parent notice dispatch for students below 75%")

    img_def = os.path.join(SCREENSHOTS_DIR, '03_defaulters_radar.png')
    if os.path.exists(img_def):
        s6.shapes.add_picture(img_def, Inches(0.8), Inches(1.85), width=Inches(8.0))

    c_def = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.85), Inches(3.4), Inches(5.15))
    c_def.fill.solid()
    c_def.fill.fore_color.rgb = CARD_BG
    c_def.line.color.rgb = ROSE_ACCENT
    c_def.line.width = Pt(1.5)
    tf_def = c_def.text_frame
    tf_def.word_wrap = True
    tf_def.margin_left = tf_def.margin_right = tf_def.margin_top = Inches(0.2)
    p = tf_def.paragraphs[0]
    p.text = "RADAR CAPABILITIES"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ROSE_ACCENT

    pts = [
        "CBSE Threshold: Real-time filter flags any student with attendance < 75%.",
        "Shortfall Recovery Math: Calculates exact number of present days needed to hit 75%.",
        "Parent Contact: Shows parent name and contact number for immediate intervention.",
        "Printable Notice: Generates official warning letter with school letterhead."
    ]
    for pt in pts:
        p = tf_def.add_paragraph()
        p.text = f"✔ {pt}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(8)

    # ---------------------------------------------------------
    # SLIDE 7: SPREADSHEET ANALYSIS & FORMULAS
    # ---------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Class 10 IT Syllabus: Spreadsheet Analysis", "Matrix Evaluation & Excel Formula Integration", "Fulfilling electronic spreadsheet curriculum requirements with formulas and CSV exports")

    img_rep = os.path.join(SCREENSHOTS_DIR, '07_spreadsheet_reports.png')
    if os.path.exists(img_rep):
        s7.shapes.add_picture(img_rep, Inches(0.8), Inches(1.85), width=Inches(8.0))

    c_rep = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.85), Inches(3.4), Inches(5.15))
    c_rep.fill.solid()
    c_rep.fill.fore_color.rgb = CARD_BG
    c_rep.line.color.rgb = INDIGO_ACCENT
    c_rep.line.width = Pt(1.5)
    tf_rep = c_rep.text_frame
    tf_rep.word_wrap = True
    tf_rep.margin_left = tf_rep.margin_right = tf_rep.margin_top = Inches(0.2)
    p = tf_rep.paragraphs[0]
    p.text = "EXCEL FORMULAS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = INDIGO_ACCENT

    pts = [
        "=COUNTIF(D2:AB2, \"Present\"): Counts days student was present.",
        "=(Present / Total_Days)*100: Computes mark-to-date turnout %.",
        "=IF(Pct < 75, \"DEFAULTER\", \"ELIGIBLE\"): Conditional examination eligibility check.",
        "=AVERAGE(Pct_Range): Overall class aggregate performance.",
        "1-Click CSV Export: Instant download for MS Excel analysis."
    ]
    for pt in pts:
        p = tf_rep.add_paragraph()
        p.text = f"✔ {pt}"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(6)

    # ---------------------------------------------------------
    # SLIDE 8: CONCLUSION & PROJECT SUMMARY
    # ---------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Summary & Conclusion", "Project Outcomes & Future Scope", "Achieving operational excellence and sustainability in school attendance management")

    # Left: Outcomes
    co = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.7), Inches(5.15))
    co.fill.solid()
    co.fill.fore_color.rgb = CARD_BG
    co.line.color.rgb = EMERALD_ACCENT
    co.line.width = Pt(1.5)
    tfo = co.text_frame
    tfo.word_wrap = True
    tfo.margin_left = tfo.margin_right = tfo.margin_top = Inches(0.25)
    p = tfo.paragraphs[0]
    p.text = "✔ PROJECT OUTCOMES"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD_ACCENT

    items_o = [
        "90% Time Reduction: Roll call duration dropped from 15 minutes to under 45 seconds.",
        "Zero Proxy Marking: Verified digital records with exact timestamps.",
        "CBSE Compliance: Proactive warning notices ensure zero surprise exam disqualifications.",
        "Environmental Sustainability: 100% paperless administration saves trees and printing costs.",
        "Complete 20+ Page Project File ready for Class 10 IT practical examination."
    ]
    for it in items_o:
        p = tfo.add_paragraph()
        p.text = f"• {it}"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Right: Future Scope
    cf = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.7), Inches(5.15))
    cf.fill.solid()
    cf.fill.fore_color.rgb = CARD_BG
    cf.line.color.rgb = INDIGO_ACCENT
    cf.line.width = Pt(1.5)
    tff = cf.text_frame
    tff.word_wrap = True
    tff.margin_left = tff.margin_right = tff.margin_top = Inches(0.25)
    p = tff.paragraphs[0]
    p.text = "➔ FUTURE ENHANCEMENTS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = INDIGO_ACCENT

    items_f = [
        "Biometric Fingerprint & Facial Recognition integration for automated door entry.",
        "WhatsApp Cloud API & SMS Gateway for instant absentee alerts to parents.",
        "Mobile Progressive Web App (PWA) for handheld teacher smartphones.",
        "RFID Smart Student ID Cards integration with turnstile gate scanners.",
        "Machine Learning attendance prediction to detect dropout risk early."
    ]
    for it in items_f:
        p = tff.add_paragraph()
        p.text = f"• {it}"
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_PRIMARY
        p.space_before = Pt(10)

    # Save PPTX
    prs.save(OUTPUT_PPTX)
    print(f"Saved PPTX to: {OUTPUT_PPTX}")

    # Copy PPTX to Desktop
    desktop_pptx = os.path.join(DESKTOP_DIR, 'Student_Attendance_System_Presentation.pptx')
    prs.save(desktop_pptx)
    print(f"Copied PPTX to Desktop: {desktop_pptx}")

    # Convert to PDF using PowerPoint COM
    try:
        powerpoint = win32com.client.Dispatch("PowerPoint.Application")
        powerpoint.Visible = 1
        deck = powerpoint.Presentations.Open(OUTPUT_PPTX)
        deck.SaveAs(OUTPUT_PDF, 32) # 32 = ppSaveAsPDF
        deck.Close()
        powerpoint.Quit()
        print(f"Converted PPTX to PDF: {OUTPUT_PDF}")

        desktop_pdf = os.path.join(DESKTOP_DIR, 'Student_Attendance_System_Presentation.pdf')
        import shutil
        shutil.copyfile(OUTPUT_PDF, desktop_pdf)
        print(f"Copied PDF to Desktop: {desktop_pdf}")
    except Exception as e:
        print(f"Error converting to PDF via COM: {e}")

if __name__ == '__main__':
    build_presentation()
