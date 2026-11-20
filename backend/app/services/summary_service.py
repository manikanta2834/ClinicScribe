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
        schedule_list: List[PatientMedicationSchedule] = []
        for m in medications:
            name = m.get("medicine_name", "Medicine")
            dosage = m.get("dosage", "")
            freq = str(m.get("frequency", "OD")).upper()
            
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
                    instructions=m.get("special_instructions", "மருத்துவரின் அறிவுரைப்படி எடுத்துக்கொள்ளவும்.")
                )
            )

        precautions = advice if advice else [
            "தினமும் குறைந்தது 2.5 லிட்டர் வெதுவெதுப்பான சுடுதண்ணீர் குடிக்கவும்.",
            "குளிர்ந்த பானங்கள் மற்றும் தூசி நிறைந்த இடங்களை தவிர்க்கவும்.",
            "உடலுக்கு போதுமான ஓய்வு கொடுக்கவும்.",
        ]

        warning_signs = [
            "மூச்சு விடுவதில் அதிக சிரமம் அல்லது நெஞ்சு வலி ஏற்பட்டால் உடனடியாக மருத்துவமனைக்கு வரவும்.",
            "உடல் அசதி அல்லது காய்ச்சல் தீவிரமடைந்தால் உடனடியாக மருத்துவரை தொடர்பு கொள்ளவும்.",
        ]

        # Dynamic Diagnosis in Tamil
        d_lower = diagnosis.lower()
        if "bronchitis" in d_lower or "cough" in d_lower:
            diag_tamil = "மூச்சுக்குழாய் அழற்சி (Acute Bronchitis)"
        elif "migraine" in d_lower or "headache" in d_lower:
            diag_tamil = "ஒற்றைத் தலைவலி (Migraine / Cephalea)"
        elif "gastritis" in d_lower or "stomach" in d_lower:
            diag_tamil = "இரைப்பை அழற்சி (Acute Gastritis)"
        elif "hypertension" in d_lower or "bp" in d_lower:
            diag_tamil = "இரத்த அழுத்த மாறுபாடு (Hypertension)"
        else:
            diag_tamil = f"பொதுவான உடல்நல ஆலோசனை ({diagnosis})"

        if medications:
            diag_summary = f"மருத்துவர் உங்கள் பரிசோதனையின் முடிவில் {diag_tamil} உள்ளதாக குறிப்பிட்டுள்ளார். முறையான மாத்திரைகள் மற்றும் ஓய்வு மூலம் இது விரைவில் குணமாகும்."
        else:
            diag_summary = f"மருத்துவர் உங்கள் பரிசோதனையின் முடிவில் {diag_tamil} என்பதை உறுதி செய்துள்ளார். இச்சந்திப்பில் பிரத்யேக மருந்துகள் எதுவும் தேவையில்லை; வாழ்க்கைமுறை ஆலோசனைகளை பின்பற்றினால் போதுமானது."

        return PatientSummaryResponse(
            language="Tamil",
            patient_name=patient_name,
            greeting=f"வணக்கம் {patient_name}, உங்கள் நலமே எங்களின் முதன்மை நோக்கம்.",
            diagnosis_summary=diag_summary,
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice=follow_up if follow_up else "தேவைப்படும்போது மருத்துவரை நேரில் அணுகவும்.",
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
            freq = str(m.get("frequency", "OD")).upper()

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
                    instructions=m.get("special_instructions", "दवा का कोर्स पूरा करें और समय पर लें।")
                )
            )

        precautions = advice if advice else [
            "दिन भर में कम से कम 2.5 लीटर गुनगुना पानी पिएं।",
            "ठंडे पेय पदार्थ, आइसक्रीम और धूल-मिट्टी से बचें।",
            "पर्याप्त शारीरिक व मानसिक आराम करें।",
        ]

        warning_signs = [
            "यदि सांस लेने में भारी तकलीफ या बेचैनी हो, तो तुरंत अस्पताल आएं।",
            "यदि लक्षण गंभीर हों, तो बिना देर किए डॉक्टर से संपर्क करें।",
        ]

        d_lower = diagnosis.lower()
        if "bronchitis" in d_lower or "cough" in d_lower:
            diag_hindi = "ब्रोंकाइटिस (Acute Bronchitis)"
        elif "migraine" in d_lower or "headache" in d_lower:
            diag_hindi = "माइग्रेन / सिरदर्द (Migraine Cephalea)"
        elif "gastritis" in d_lower or "stomach" in d_lower:
            diag_hindi = "गैस्ट्राइटिस (Acute Gastritis)"
        elif "hypertension" in d_lower or "bp" in d_lower:
            diag_hindi = "उच्च रक्तचाप (Hypertension)"
        else:
            diag_hindi = f"सामान्य स्वास्थ्य परामर्श ({diagnosis})"

        if medications:
            diag_summary = f"डॉक्टर ने आपकी जांच के बाद {diag_hindi} पाई है। नियमित दवा और देखभाल से आप 4-5 दिनों में पूरी तरह स्वस्थ हो जाएंगे।"
        else:
            diag_summary = f"डॉक्टर ने आपकी जांच में {diag_hindi} का अवलोकन किया है। इस परामर्श में किसी दवा की आवश्यकता नहीं है; स्वस्थ दिनचर्या और सावधानियों का पालन करें।"

        return PatientSummaryResponse(
            language="Hindi",
            patient_name=patient_name,
            greeting=f"नमस्ते {patient_name} जी, आपकी सेहत हमारी पहली प्राथमिकता है।",
            diagnosis_summary=diag_summary,
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice=follow_up if follow_up else "आवश्यकतानुसार फॉलो-अप के लिए क्लिनिक आएं।",
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
            "Avoid chilled beverages and dusty environments.",
            "Ensure adequate physical rest and balanced nutrition.",
        ]

        warning_signs = [
            "Severe shortness of breath or persistent chest discomfort.",
            "Escalating symptoms unresponsive to conservative measures.",
        ]

        if medications:
            diag_summary = f"The attending physician evaluated your symptoms and identified {diagnosis}. With proper rest and prescribed medications, symptoms are expected to resolve promptly."
        else:
            diag_summary = f"The attending physician conducted a review regarding {diagnosis}. No pharmacological medications were prescribed during this encounter; conservative lifestyle measures are advised."

        return PatientSummaryResponse(
            language="English",
            patient_name=patient_name,
            greeting=f"Hello {patient_name}, here is your personalized care summary from your consultation.",
            diagnosis_summary=diag_summary,
            medication_schedule=schedule_list,
            lifestyle_precautions=precautions,
            warning_signs=warning_signs,
            follow_up_advice=follow_up if follow_up else "Review as needed or if symptoms escalate.",
        )

