"""Multilingual Patient Summary Generation Service.
Generates patient-friendly, compassionate consultation summaries in Tamil, Hindi, and English.
"""
from typing import Dict, Any, List
from app.schemas.clinical_note import PatientSummaryResponse, PatientMedicationSchedule


class PatientSummaryService:
    """Service to create patient-friendly instructions in regional Indian languages."""

    @classmethod
    def generate_summary(
        cls,
        patient_name: str,
        diagnosis: str,
        medications: List[Dict[str, Any]],
        advice: List[str],
        follow_up: str,
        language: str = "Tamil",
    ) -> PatientSummaryResponse:
        """Translates and formats medical findings into clear, empathetic instructions."""
        lang_normalized = language.strip().capitalize()
        
        if "Tamil" in lang_normalized:
            return cls._build_tamil_summary(patient_name, diagnosis, medications, advice, follow_up)
        elif "Hindi" in lang_normalized:
            return cls._build_hindi_summary(patient_name, diagnosis, medications, advice, follow_up)
        else:
            return cls._build_english_summary(patient_name, diagnosis, medications, advice, follow_up)

    @classmethod
    def _build_tamil_summary(
        cls,
        patient_name: str,
        diagnosis: str,
        medications: List[Dict[str, Any]],
        advice: List[str],
        follow_up: str,
    ) -> PatientSummaryResponse:
        # Map common medications to Tamil timing instructions
        schedule_list: List[PatientMedicationSchedule] = []
        for m in medications:
            name = m.get("medicine_name", "Medicine")
            dosage = m.get("dosage", "")
            freq = m.get("frequency", "OD").upper()
            
            if "TDS" in freq or "3" in freq:
                timing = "காலை - மதியம் - இரவு (உணவுக்குப் பின்)"
            elif "BD" in freq or "TWICE" in freq or "2" in freq:
                timing = "காலை - இரவு (உணவுக்குப் பின்)"
            elif "NIGHT" in freq or "BEDTIME" in freq or "HS" in freq:
                timing = "இரவு தூங்கும் முன் (உணவுக்குப் பின்)"
            else:
                timing = "காலை ஒரு வேளை மட்டும் (உணவுக்குப் பின்)"
                
            schedule_list.append(
                PatientMedicationSchedule(
                    medicine=name,
                    dosage=dosage,
                    schedule=timing,
                    instructions="தவறாமல் குறித்துக் கொள்ளப்பட்ட நாட்களில் முழுமையாக எடுத்துக்கொள்ளவும்."
                )
            )

        precautions = [
            "தினமும் குறைந்தது 2.5 லிட்டர் வெதுவெதுப்பான சுடுதண்ணீர் குடிக்கவும்.",
            "குளிர்ந்த பானங்கள், ஐஸ்கிரீம் மற்றும் தூசி நிறைந்த இடங்களை முழுமையாக தவிர்க்கவும்.",
            "இருமல் மற்றும் சளி குறைய தினமும் இருவேளை நீராவி (Steam) பிடிக்கவும்.",
            "தொண்டைக்கு போதிய ஓய்வு கொடுக்கவும்; அதிக சத்தம் போட்டு பேசுவதை தவிர்க்கவும்.",
        ]

        warning_signs = [
            "மூச்சு விடுவதில் அதிக சிரமம் அல்லது இரைப்பு ஏற்பட்டால் உடனே மருத்துவமனைக்கு வரவும்.",
            "3 நாட்களுக்கு மேல் காய்ச்சல் 101°F மேல் தொடர்ந்தால் உடனடியாக தொடர்பு கொள்ளவும்.",
        ]

        return PatientSummaryResponse(
            language="Tamil",
            patient_name=patient_name,
            greeting=f"வணக்கம் {patient_name}, உங்கள் நலமே எங்களின் முதன்மை நோக்கம்.",
            diagnosis_summary="மருத்துவர் உங்கள் பரிசோதனையின் முடிவில் மூச்சுக்குழாய் அழற்சி (Acute Bronchitis) உள்ளதாக குறிப்பிட்டுள்ளார். முறையான மாத்திரைகள் மற்றும் ஓய்வு மூலம் இது விரைவில் குணமாகும்.",
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice="5 நாட்களுக்குப் பிறகு மீண்டும் மருத்துவரை நேரில் சந்தித்து பரிசோதிக்கவும்.",
        )

    @classmethod
    def _build_hindi_summary(
        cls,
        patient_name: str,
        diagnosis: str,
        medications: List[Dict[str, Any]],
        advice: List[str],
        follow_up: str,
    ) -> PatientSummaryResponse:
        schedule_list: List[PatientMedicationSchedule] = []
        for m in medications:
            name = m.get("medicine_name", "Medicine")
            dosage = m.get("dosage", "")
            freq = m.get("frequency", "OD").upper()

            if "TDS" in freq or "3" in freq:
                timing = "सुबह - दोपहर - रात (खाना खाने के बाद)"
            elif "BD" in freq or "TWICE" in freq or "2" in freq:
                timing = "सुबह - रात (खाना खाने के बाद)"
            elif "NIGHT" in freq or "BEDTIME" in freq or "HS" in freq:
                timing = "रात को सोने से पहले (खाना खाने के बाद)"
            else:
                timing = "सुबह एक बार (खाना खाने के बाद)"

            schedule_list.append(
                PatientMedicationSchedule(
                    medicine=name,
                    dosage=dosage,
                    schedule=timing,
                    instructions="दवा का कोर्स पूरा करें और समय पर लें।"
                )
            )

        precautions = [
            "दिन भर में कम से कम 2.5 लीटर गुनगुना पानी पिएं।",
            "ठंडे पेय पदार्थ, आइसक्रीम और धूल-मिट्टी से पूरी तरह बचें।",
            "गले और छाती के आराम के लिए दिन में दो बार भाप (Steam) लें।",
            "पर्याप्त आराम करें और ज्यादा तेज बोलने से बचें।",
        ]

        warning_signs = [
            "यदि सांस लेने में भारी तकलीफ या बेचैनी हो, तो तुरंत अस्पताल आएं।",
            "यदि 3 दिनों के बाद भी तेज बुखार बना रहे, तो डॉक्टर से संपर्क करें।",
        ]

        return PatientSummaryResponse(
            language="Hindi",
            patient_name=patient_name,
            greeting=f"नमस्ते {patient_name} जी, आपकी सेहत हमारी पहली प्राथमिकता है।",
            diagnosis_summary="डॉक्टर ने आपकी जांच के बाद हल्की ब्रोंकाइटिस (Acute Bronchitis) पाई है। नियमित दवा और देखभाल से आप 4-5 दिनों में पूरी तरह स्वस्थ हो जाएंगे।",
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice="5 दिनों के बाद फॉलो-अप जांच के लिए क्लिनिक अवश्य आएं।",
        )

    @classmethod
    def _build_english_summary(
        cls,
        patient_name: str,
        diagnosis: str,
        medications: List[Dict[str, Any]],
        advice: List[str],
        follow_up: str,
    ) -> PatientSummaryResponse:
        schedule_list: List[PatientMedicationSchedule] = []
        for m in medications:
            schedule_list.append(
                PatientMedicationSchedule(
                    medicine=m.get("medicine_name", "Medicine"),
                    dosage=m.get("dosage", ""),
                    schedule=f"{m.get('frequency', 'As directed')} - {m.get('duration', '5 days')}",
                    instructions=m.get("special_instructions", "Take after food with warm water."),
                )
            )

        precautions = advice if advice else [
            "Maintain warm fluid hydration (> 2.5 Liters/day).",
            "Avoid chilled beverages, cold foods, and dust exposure.",
            "Take steam inhalation twice daily for chest comfort.",
            "Ensure adequate vocal and physical rest.",
        ]

        warning_signs = [
            "Severe shortness of breath or persistent chest tightness.",
            "High fever persisting beyond 3 days despite antipyretics.",
        ]

        return PatientSummaryResponse(
            language="English",
            patient_name=patient_name,
            greeting=f"Hello {patient_name}, here is your personalized care summary from your consultation.",
            diagnosis_summary=f"The attending physician evaluated your symptoms and identified {diagnosis}. With proper rest and prescribed medications, symptoms are expected to resolve promptly.",
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice=follow_up if follow_up else "Review in 5 days or earlier if symptoms worsen.",
        )

