import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from datetime import datetime

def generate_pdf_report(user_id: str, results: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    story = []
    
    # Title
    story.append(Paragraph("MindPulse Personal Analytics Report", title_style))
    story.append(Spacer(1, 12))
    
    # User Info
    story.append(Paragraph(f"Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", normal_style))
    story.append(Spacer(1, 24))
    
    # Assessment Summary
    story.append(Paragraph("Assessment Summary", heading_style))
    story.append(Spacer(1, 12))
    
    if results.get("current_scores"):
        data = [["Assessment", "Score", "Severity", "Trend"]]
        for assess_type, details in results["current_scores"].items():
            trend_info = results.get("trends", {}).get(assess_type, {})
            trend_str = trend_info.get("trend", "N/A")
            data.append([
                assess_type,
                str(details.get("score", "")),
                details.get("severity", ""),
                trend_str
            ])
            
        t = Table(data, colWidths=[100, 100, 150, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F3F4F6')),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(t)
    else:
        story.append(Paragraph("No assessment data available.", normal_style))
        
    story.append(Spacer(1, 24))
    
    # Sleep & Energy
    if results.get("sleep_energy"):
        story.append(Paragraph("Sleep & Energy Analysis", heading_style))
        se = results["sleep_energy"]
        story.append(Paragraph(f"Average Sleep Quality: {se.get('average_sleep')}/10", normal_style))
        story.append(Paragraph(f"Average Energy Level: {se.get('average_energy')}/10", normal_style))
        story.append(Spacer(1, 24))
        
    # Insights
    story.append(Paragraph("Personalized Insights", heading_style))
    story.append(Spacer(1, 12))
    
    if results.get("insights"):
        for insight in results["insights"]:
            story.append(Paragraph(f"• {insight}", normal_style))
            story.append(Spacer(1, 6))
    else:
        story.append(Paragraph("No insights generated.", normal_style))

    doc.build(story)
    buffer.seek(0)
    return buffer
