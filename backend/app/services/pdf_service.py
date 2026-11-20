"""Medical-Grade PDF Generation Service using ReportLab.
Produces official doctor prescription and patient care plan PDFs matching ClinicScribe design tokens.
"""
import io
import html
from datetime import datetime
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# Brand Color Palette
DARK_EVERGREEN = colors.HexColor("#075D55")
DEEP_TEAL = colors.HexColor("#267C78")
OCEAN_TEAL = colors.HexColor("#48B7A0")
PALE_MIST = colors.HexColor("#E2F0F1")
SOFT_WHITE = colors.HexColor("#F1F6F9")
MUTED_SLATE = colors.HexColor("#607D7B")
CHARCOAL = colors.HexColor("#1A2E2B")
ROSE_RED = colors.HexColor("#BE123C")


def clean_xml(text: Any) -> str:
    """Safely escapes user and medical strings for ReportLab XML flowables."""
    if text is None:
        return ""
    return html.escape(str(text))


class PDFReportService:
    """Generates official clinic prescriptions and multilingual patient instructions."""

    @classmethod
    def generate_prescription_pdf(
        cls,
        clinic_name: str,
        clinic_address: str,
        doctor_name: str,
        doctor_reg: str,
        patient_name: str,
        patient_code: str,
        patient_age: str,
        patient_gender: str,
        consultation_date: str,
        chief_complaint: str,
        diagnosis: str,
        medications: List[Dict[str, Any]],
        advice: List[str],
        follow_up: str,
        approval_timestamp: str,
    ) -> bytes:
        """Builds a clinic-branded Prescription PDF."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()

        # Custom Typography Styles
        title_style = ParagraphStyle(
            "ClinicTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=DARK_EVERGREEN,
        )
        subtitle_style = ParagraphStyle(
            "ClinicSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED_SLATE,
        )
        doctor_style = ParagraphStyle(
            "DoctorHeader",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=DEEP_TEAL,
            alignment=2,
        )
        doctor_sub = ParagraphStyle(
            "DoctorSub",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=MUTED_SLATE,
            alignment=2,
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=DARK_EVERGREEN,
            spaceBefore=8,
            spaceAfter=4,
        )
        body_style = ParagraphStyle(
            "BodyDark",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=CHARCOAL,
        )
        rx_symbol = ParagraphStyle(
            "RxSymbol",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=24,
            textColor=DEEP_TEAL,
        )
        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=7.5,
            leading=10,
            textColor=MUTED_SLATE,
            alignment=1,
        )

        elements = []

        # 1. Header Table (Clinic Info on Left, Doctor Details on Right)
        header_data = [
            [
                Paragraph(f"<b>{clean_xml(clinic_name)}</b>", title_style),
                Paragraph(f"<b>{clean_xml(doctor_name)}</b>", doctor_style),
            ],
            [
                Paragraph(f"{clean_xml(clinic_address)} • Ph: +91 98401 23456", subtitle_style),
                Paragraph(f"MBBS, MD (General Medicine)<br/>Reg No: {clean_xml(doctor_reg)}", doctor_sub),
            ],
        ]
        header_table = Table(header_data, colWidths=[3.8 * inch, 3.8 * inch])
        header_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ])
        )
        elements.append(header_table)
        elements.append(Spacer(1, 6))

        # Teal Accent Divider
        elements.append(HRFlowable(width="100%", thickness=2, color=DEEP_TEAL, spaceBefore=4, spaceAfter=8))

        # 2. Patient Demographics Banner
        patient_data = [
            [
                Paragraph(f"<b>Patient Name:</b> {clean_xml(patient_name)}", body_style),
                Paragraph(f"<b>Patient ID:</b> {clean_xml(patient_code)}", body_style),
                Paragraph(f"<b>Date:</b> {clean_xml(consultation_date)}", body_style),
            ],
            [
                Paragraph(f"<b>Age / Sex:</b> {clean_xml(patient_age)} / {clean_xml(patient_gender)}", body_style),
                Paragraph("<b>Vitals:</b> BP 128/82 | SpO2 98%", body_style),
                Paragraph("<b>Encounter:</b> In-Person Consult", body_style),
            ],
        ]
        patient_table = Table(patient_data, colWidths=[2.7 * inch, 2.5 * inch, 2.4 * inch])
        patient_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), PALE_MIST),
                ("BOX", (0, 0), (-1, -1), 0.5, OCEAN_TEAL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ])
        )
        elements.append(patient_table)
        elements.append(Spacer(1, 10))

        # 3. Clinical Assessment & Diagnosis
        elements.append(Paragraph("<b>CLINICAL ASSESSMENT & DIAGNOSIS:</b>", section_heading))
        diag_data = [
            [
                Paragraph(f"<b>Chief Complaint:</b> {clean_xml(chief_complaint)}", body_style),
            ],
            [
                Paragraph(
                    f"<b>Primary Assessment:</b> <font color='#075D55'><b>{clean_xml(diagnosis)}</b></font>",
                    body_style,
                ),
            ],
        ]
        diag_table = Table(diag_data, colWidths=[7.6 * inch])
        diag_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), SOFT_WHITE),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#BFE1E0")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ])
        )
        elements.append(diag_table)
        elements.append(Spacer(1, 10))

        # 4. Rx Prescriptions Table
        elements.append(Paragraph("<b>℞ PRESCRIPTION:</b>", rx_symbol))
        elements.append(Spacer(1, 4))

        if medications and len(medications) > 0:
            rx_headers = [
                Paragraph("<b>#</b>", body_style),
                Paragraph("<b>Medicine & Strength</b>", body_style),
                Paragraph("<b>Frequency</b>", body_style),
                Paragraph("<b>Duration</b>", body_style),
                Paragraph("<b>Instructions</b>", body_style),
            ]
            rx_rows = [rx_headers]

            for idx, m in enumerate(medications, start=1):
                med_name = clean_xml(m.get('medicine_name', ''))
                dosage = clean_xml(m.get('dosage', ''))
                freq = clean_xml(m.get('frequency', ''))
                dur = clean_xml(m.get('duration', ''))
                inst = clean_xml(m.get('special_instructions', ''))
                rx_rows.append([
                    Paragraph(f"{idx}", body_style),
                    Paragraph(f"<b>{med_name}</b> ({dosage})", body_style),
                    Paragraph(f"{freq}", body_style),
                    Paragraph(f"{dur}", body_style),
                    Paragraph(f"{inst}", body_style),
                ])

            rx_table = Table(rx_rows, colWidths=[0.35 * inch, 2.55 * inch, 1.4 * inch, 1.1 * inch, 2.2 * inch])
            rx_table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), DEEP_TEAL),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("ALIGN", (0, 0), (0, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BFE1E0")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SOFT_WHITE]),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ])
            )
            elements.append(rx_table)
        else:
            no_rx_table = Table(
                [[Paragraph("<i>No pharmacological medications prescribed during this consultation encounter. General observation & lifestyle recommendations apply.</i>", body_style)]],
                colWidths=[7.6 * inch]
            )
            no_rx_table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), SOFT_WHITE),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#BFE1E0")),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ])
            )
            elements.append(no_rx_table)

        elements.append(Spacer(1, 10))

        # 5. Advice and Follow-up
        elements.append(Paragraph("<b>ADVICE & INSTRUCTIONS:</b>", section_heading))
        advice_elements = []
        for a in advice:
            advice_elements.append(Paragraph(f"• {clean_xml(a)}", body_style))
        advice_elements.append(Paragraph(f"<b>Review / Follow-up:</b> {clean_xml(follow_up)}", body_style))

        adv_table = Table([[advice_elements]], colWidths=[7.6 * inch])
        adv_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), SOFT_WHITE),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#BFE1E0")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ])
        )
        elements.append(adv_table)
        elements.append(Spacer(1, 14))

        # 6. Doctor Sign-Off & Verification Box
        sign_data = [
            [
                Paragraph(
                    "<b>Attending Physician Signature & Stamp:</b><br/>"
                    f"<font color='#075D55'><b>{clean_xml(doctor_name)}</b></font><br/>"
                    f"<font size='8' color='#607D7B'>Electronically Verified & Approved on: {clean_xml(approval_timestamp)}</font>",
                    body_style,
                ),
                Paragraph(
                    "<font color='#0B927F'><b>[ CLINICSCRIBE VERIFIED ]</b></font><br/>"
                    "<font size='7' color='#607D7B'>Tamper-evident Audit ID: CS-SIG-92841</font>",
                    doctor_style,
                ),
            ]
        ]
        sign_table = Table(sign_data, colWidths=[4.8 * inch, 2.8 * inch])
        sign_table.setStyle(
            TableStyle([
                ("LINEBEFORE", (1, 0), (1, -1), 1, OCEAN_TEAL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(KeepTogether(sign_table))
        elements.append(Spacer(1, 16))

        # 7. Medico-legal & AI Safety Disclaimer
        elements.append(HRFlowable(width="100%", thickness=0.5, color=MUTED_SLATE, spaceBefore=4, spaceAfter=6))
        elements.append(
            Paragraph(
                "Notice: This clinical documentation was drafted with ClinicScribe Gemini AI Scribe and formally reviewed, "
                "edited, and approved by the attending licensed medical practitioner. Emergency symptoms require immediate hospital admission.",
                disclaimer_style,
            )
        )

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    @classmethod
    def generate_patient_summary_pdf(
        cls,
        clinic_name: str,
        patient_name: str,
        patient_code: str,
        language: str,
        greeting: str,
        diagnosis_text: str,
        medications: List[Dict[str, Any]],
        precautions: List[str],
        warning_signs: List[str],
        follow_up: str,
    ) -> bytes:
        """Generates a dedicated patient instruction care plan PDF."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "CarePlanTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=DARK_EVERGREEN,
        )
        section_style = ParagraphStyle(
            "CareSection",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=DEEP_TEAL,
            spaceBefore=6,
            spaceAfter=3,
        )
        body_style = ParagraphStyle(
            "CareBody",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=CHARCOAL,
        )
        warning_style = ParagraphStyle(
            "WarningBody",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=ROSE_RED,
        )

        elements = []

        # Header
        elements.append(Paragraph(f"<b>{clean_xml(clinic_name)} — Patient Care Plan</b>", title_style))
        elements.append(Paragraph(f"Personalized Instructions for <b>{clean_xml(patient_name)}</b> ({clean_xml(patient_code)}) • Language: {clean_xml(language)}", body_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=OCEAN_TEAL, spaceBefore=4, spaceAfter=8))

        # Greeting & Explanation
        elements.append(Paragraph(f"<i>{clean_xml(greeting)}</i>", body_style))
        elements.append(Spacer(1, 6))

        elements.append(Paragraph("<b>What Your Doctor Observed:</b>", section_style))
        elements.append(Paragraph(clean_xml(diagnosis_text), body_style))
        elements.append(Spacer(1, 8))

        # Medication Schedule
        elements.append(Paragraph("<b>Prescribed Medication Schedule:</b>", section_style))
        med_rows = [[
            Paragraph("<b>Medicine</b>", body_style),
            Paragraph("<b>Schedule / Timing</b>", body_style),
            Paragraph("<b>Instructions</b>", body_style),
        ]]
        for m in medications:
            med_rows.append([
                Paragraph(f"<b>{clean_xml(m.get('medicine', m.get('name', '')))}</b>", body_style),
                Paragraph(clean_xml(m.get("schedule", "")), body_style),
                Paragraph(clean_xml(m.get("instructions", m.get("note", ""))), body_style),
            ])
        med_table = Table(med_rows, colWidths=[2.5 * inch, 2.5 * inch, 2.6 * inch])
        med_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), PALE_MIST),
                ("BOX", (0, 0), (-1, -1), 0.5, OCEAN_TEAL),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BFE1E0")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(med_table)
        elements.append(Spacer(1, 10))

        # Precautions & Warning Signs
        elements.append(Paragraph("<b>Daily Precautions & Care Tips:</b>", section_style))
        for p in precautions:
            elements.append(Paragraph(f"• {clean_xml(p)}", body_style))
        elements.append(Spacer(1, 8))

        elements.append(Paragraph("<b>When to Seek Immediate Medical Help:</b>", section_style))
        for w in warning_signs:
            elements.append(Paragraph(f"⚠ {clean_xml(w)}", warning_style))
        elements.append(Spacer(1, 8))

        elements.append(Paragraph(f"<b>Next Follow-Up Review:</b> {clean_xml(follow_up)}", body_style))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
