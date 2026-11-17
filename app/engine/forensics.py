"""
Kavach Master Forensic Orchestrator
Merges Gemini 1.5 Flash Multimodal outputs with deterministic legal and static heuristics.
"""
from typing import Optional, Dict, Any, List
from app.models.schemas import (
    AnalysisResponse,
    ThreatLevel,
    ThreatCategory,
    ForensicEvidence,
    LegalRuleCheck,
    APKMetadata
)
from app.engine.digital_arrest import DigitalArrestAnalyzer
from app.engine.greed_scams import GreedScamAnalyzer
from app.engine.apk_analyzer import APKAnalyzer
from app.engine.gemini_analyzer import GeminiAnalyzer
from app.engine.speech_helper import SpeechAndSOSHelper
from app.config import THRESHOLD_CRITICAL, THRESHOLD_SUSPICIOUS, CYBER_HELPLINE, CYBER_PORTAL


class ForensicOrchestrator:
    """
    Main controller coordinating Digital Arrest, Greed, and APK threat detection.
    """

    @classmethod
    async def analyze(
        cls,
        text: Optional[str] = None,
        file_bytes: Optional[bytes] = None,
        filename: Optional[str] = None,
        mime_type: Optional[str] = None,
        api_key: Optional[str] = None
    ) -> AnalysisResponse:
        """
        End-to-end analysis method handling both text, uploaded files, and APKs.
        """
        text_str = str(text) if text is not None else ""
        text_content = text_str.strip()
        filename_str = str(filename) if filename else ""
        filename_lower = filename_str.lower()

        # Is this an APK file?
        is_apk = (
            filename_lower.endswith(".apk") or
            mime_type == "application/vnd.android.package-archive" or
            (file_bytes and file_bytes[:4] == b"PK\x03\x04" and any(k in filename_lower for k in ["apk", "app", "card", "bill"]))
        )

        # 1. APK STATIC ANALYSIS
        apk_result: Optional[Dict[str, Any]] = None
        if is_apk and file_bytes:
            apk_result = APKAnalyzer.analyze_bytes(file_bytes, filename=filename_str or "app.apk")
        elif filename_lower.endswith(".apk") and not file_bytes:
            # Filename only or text describing an APK
            apk_result = APKAnalyzer.analyze_bytes(b"", filename=filename_str or "app.apk")

        # 2. DIGITAL ARREST HEURISTICS
        digital_arrest_res = DigitalArrestAnalyzer.analyze(text_content)

        # 3. GREED SCAM HEURISTICS
        greed_res = GreedScamAnalyzer.analyze(text_content)

        # 4. GEMINI 1.5 FLASH (Multimodal or Text)
        gemini_result: Optional[Dict[str, Any]] = None
        if GeminiAnalyzer.is_configured(api_key):
            gemini_result = await GeminiAnalyzer.analyze(
                text=text_content,
                image_bytes=file_bytes if mime_type and mime_type.startswith("image/") else None,
                mime_type=mime_type,
                custom_key=api_key
            )

        # 5. SYNTHESIZE FINDINGS & CLASSIFY
        threat_score = 0
        category = ThreatCategory.LEGITIMATE
        evidence: List[ForensicEvidence] = []
        legal_checks: List[LegalRuleCheck] = []
        apk_meta: Optional[APKMetadata] = None
        engine_used = "Kavach Heuristic & Statutory Engine (Offline / Fallback)"

        if gemini_result:
            engine_used = "Hybrid Engine (Gemini 1.5 Flash + Kavach Statutory Checker)"

        # Determine dominant pillar
        apk_score = apk_result["score"] if apk_result else 0
        da_score = digital_arrest_res["score"]
        greed_score = greed_res["score"]

        # If Gemini returned a score, take the maximum or blend
        if gemini_result and "threat_score" in gemini_result:
            gem_score = int(gemini_result.get("threat_score", 0))
            threat_score = max(gem_score, apk_score, da_score, greed_score)
        else:
            threat_score = max(apk_score, da_score, greed_score)

        if apk_score >= max(da_score, greed_score) and apk_score > 0:
            category = ThreatCategory.MALICIOUS_APK
            evidence.extend(apk_result["evidence"])
            apk_meta = apk_result["metadata"]

        elif da_score >= max(apk_score, greed_score) and da_score > 0:
            category = ThreatCategory.DIGITAL_ARREST
            evidence.extend(digital_arrest_res["evidence"])
            legal_checks.extend(digital_arrest_res["legal_checks"])

        elif greed_score > 0:
            category = ThreatCategory.GREED_SCAM
            evidence.extend(greed_res["evidence"])

        # Incorporate Gemini visual anomalies if available
        if gemini_result:
            visual_anomalies = gemini_result.get("visual_anomalies", [])
            for anom in visual_anomalies:
                evidence.append(ForensicEvidence(
                    indicator="Visual Forensic Anomaly (Gemini 1.5 Flash)",
                    severity="HIGH",
                    detail_en=str(anom),
                    detail_hi=f"एआई विज़ुअल जांच में विसंगति पाई गई: {anom}"
                ))

        # Categorize Threat Level
        if threat_score >= THRESHOLD_CRITICAL:
            threat_level = ThreatLevel.CRITICAL
        elif threat_score >= THRESHOLD_SUSPICIOUS:
            threat_level = ThreatLevel.SUSPICIOUS
        else:
            threat_level = ThreatLevel.SAFE
            category = ThreatCategory.LEGITIMATE

        # Generate titles and summaries
        if category == ThreatCategory.DIGITAL_ARREST:
            title_en = "CRITICAL SCAM: Digital Arrest & Fake Police Extortion"
            title_hi = "गंभीर साइबर फ्रॉड: डिजिटल अरेस्ट व फर्जी पुलिस नोटिस"
            summary_en = (
                "This document or message is a fraudulent 'Digital Arrest' extortion scheme. "
                "Indian law (BNSS / CrPC) strictly forbids video call arrests, and no law enforcement agency "
                "or court ever demands funds to 'clearance' or 'RBI verification' accounts."
            )
            summary_hi = (
                "यह एक पूर्णतः फर्जी 'डिजिटल अरेस्ट' और जबरन वसूली का फ्रॉड है। "
                "भारतीय कानून (BNSS / CrPC) में वीडियो कॉल पर किसी भी प्रकार की गिरफ्तारी का कोई प्रावधान नहीं है, "
                "और न ही कोई सरकारी एजेंसी या कोर्ट वेरिफिकेशन के नाम पर पैसे मांगती है।"
            )

        elif category == ThreatCategory.MALICIOUS_APK:
            title_en = "MALICIOUS MALWARE: High-Risk Android Trojan / Dropper"
            title_hi = "खतरनाक वायरस: बैंकिंग ट्रोजन / दुर्भावनापूर्ण APK ऐप"
            summary_en = (
                f"The file '{filename_str or 'APK'}' is a deceptive Android malware package designed to steal bank OTPs, "
                "intercept confidential SMS, and abuse accessibility permissions to take over your device."
            )
            summary_hi = (
                f"फाइल '{filename_str or 'APK'}' एक खतरनाक एंड्रॉइड वायरस (ट्रोजन) है जो आपके बैंक ओटीपी और एसएमएस "
                "चुराने तथा फोन पर अनधिकृत नियंत्रण पाने के लिए तैयार किया गया है।"
            )

        elif category == ThreatCategory.GREED_SCAM:
            title_en = "CYBER SCAM: Fake Free Recharge / Phishing Trap"
            title_hi = "साइबर फ्रॉड: फर्जी मुफ्त रिचार्ज व फिशिंग जाल"
            summary_en = (
                "This message lures victims with false promises of free telecom recharges or instant government cash. "
                "It uses unauthorized non-governmental domains and viral WhatsApp forwarding traps to harvest personal data."
            )
            summary_hi = (
                "यह मैसेज मुफ्त मोबाइल रिचार्ज या सरकारी योजना के नाम पर झूठा लालच देकर लोगों को फंसाने का काम कर रहा है। "
                "यह असत्यापित निजी लिंक और व्हाट्सएप फॉरवर्डिंग का उपयोग करता है।"
            )

        else:
            title_en = "VERIFIED: No Malicious Indicators Detected"
            title_hi = "सुरक्षित: कोई दुर्भावनापूर्ण गतिविधि नहीं पाई गई"
            summary_en = "The analyzed text or file does not trigger known cyber scam or malware indicators."
            summary_hi = "विश्लेषण किए गए संदेश या फाइल में कोई ज्ञात साइबर धोखाधड़ी या वायरस का संकेत नहीं मिला है।"

        # Speech and Actions
        details_map = {"filename": filename or "APK"}
        advisory = SpeechAndSOSHelper.generate_advisory_scripts(
            category=category,
            threat_level=threat_level,
            threat_score=threat_score,
            details=details_map
        )

        whatsapp_sos = SpeechAndSOSHelper.format_whatsapp_sos(
            category=category,
            threat_level=threat_level,
            threat_score=threat_score,
            title_en=title_en
        )

        return AnalysisResponse(
            threat_level=threat_level,
            threat_score=threat_score,
            category=category,
            title_en=title_en,
            title_hi=title_hi,
            summary_en=summary_en,
            summary_hi=summary_hi,
            evidence_list=evidence,
            legal_rule_violations=legal_checks,
            apk_analysis=apk_meta,
            immediate_actions_en=advisory["actions_en"],
            immediate_actions_hi=advisory["actions_hi"],
            speech_script_en=advisory["script_en"],
            speech_script_hi=advisory["script_hi"],
            whatsapp_sos_text=whatsapp_sos,
            engine_used=engine_used,
            emergency_helpline=CYBER_HELPLINE,
            official_portal=CYBER_PORTAL
        )
