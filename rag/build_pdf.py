import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT

SRC = r"C:\Users\Admin\Desktop\Project\website\Protien Bites\rag\knowledge-base.md"
OUT = r"C:\Users\Admin\Desktop\Project\website\Protien Bites\rag\knowledge-base.pdf"

with open(SRC, "r", encoding="utf-8") as f:
    lines = f.read().splitlines()

styles = getSampleStyleSheet()
title_style = ParagraphStyle("TitleX", parent=styles["Title"], textColor=colors.HexColor("#3B2A22"))
h2_style = ParagraphStyle("H2", parent=styles["Heading2"], textColor=colors.HexColor("#5A3D2C"),
                           spaceBefore=14, spaceAfter=6)
body_style = ParagraphStyle("BodyX", parent=styles["Normal"], fontSize=10, leading=14,
                             alignment=TA_LEFT, spaceAfter=6)
italic_style = ParagraphStyle("ItalicX", parent=body_style, fontName="Helvetica-Oblique",
                               textColor=colors.HexColor("#555555"))
bullet_style = ParagraphStyle("BulletX", parent=body_style, leftIndent=16, bulletIndent=4)

def inline(text):
    text = text.replace("₹", "Rs. ")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    return text

story = []
i = 0
n = len(lines)

while i < n:
    line = lines[i]
    stripped = line.strip()

    if stripped == "":
        i += 1
        continue

    if stripped == "---":
        story.append(Spacer(1, 4))
        story.append(HRFlowable(width="100%", color=colors.HexColor("#D8C9B8"), thickness=1))
        story.append(Spacer(1, 8))
        i += 1
        continue

    if stripped.startswith("# "):
        story.append(Paragraph(inline(stripped[2:]), title_style))
        story.append(Spacer(1, 10))
        i += 1
        continue

    if stripped.startswith("## "):
        story.append(Paragraph(inline(stripped[3:]), h2_style))
        i += 1
        continue

    if stripped.startswith("### "):
        story.append(Paragraph(inline(stripped[4:]), ParagraphStyle(
            "H3", parent=styles["Heading3"], textColor=colors.HexColor("#7A5640"),
            spaceBefore=8, spaceAfter=4)))
        i += 1
        continue

    if stripped.startswith("|"):
        table_lines = []
        while i < n and lines[i].strip().startswith("|"):
            table_lines.append(lines[i].strip())
            i += 1
        rows = []
        for tl in table_lines:
            cells = [c.strip() for c in tl.strip("|").split("|")]
            if all(re.fullmatch(r":?-+:?", c) for c in cells):
                continue
            rows.append(cells)
        table_data = [[Paragraph(inline(c), body_style) for c in row] for row in rows]
        col_count = len(rows[0])
        avail_width = 6.4 * inch
        col_widths = [avail_width / col_count] * col_count
        t = Table(table_data, colWidths=col_widths, hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#3B2A22")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8C9B8")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FBF6EE")]),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 10))
        continue

    if stripped.startswith("- "):
        bullet_items = []
        while i < n and lines[i].strip().startswith("- "):
            bullet_items.append(lines[i].strip()[2:])
            i += 1
        for item in bullet_items:
            story.append(Paragraph("• " + inline(item), bullet_style))
        story.append(Spacer(1, 6))
        continue

    para_lines = [stripped]
    i += 1
    while i < n and lines[i].strip() != "" and not lines[i].strip().startswith(("#", "-", "|", "---")):
        para_lines.append(lines[i].strip())
        i += 1
    text = " ".join(para_lines)
    style = italic_style if text.startswith("This document") else body_style
    story.append(Paragraph(inline(text), style))

doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    leftMargin=0.75 * inch, rightMargin=0.75 * inch,
    topMargin=0.75 * inch, bottomMargin=0.75 * inch,
    title="BetterBite Knowledge Base",
)
doc.build(story)
print("done")
