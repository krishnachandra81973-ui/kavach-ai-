"""
Pillar 1: Digital Arrest & Fake Agency Notice Analyzer
Implements deterministic legal heuristics based on Indian CrPC / BNSS 2023,
PMLA, and Indian Constitution.
"""
import re
from typing import Dict, Any, List, Tuple
from app.models.schemas import ForensicEvidence, LegalRuleCheck
from app.config import LEGAL_STATUTES


class DigitalArrestAnalyzer:
    """
    Forensic engine to detect Digital Arrest scams, fake police/CBI warrants,
    and coercive video-interrogation extortion.
    """

    # Agency & Authority keywords (English + Hinglish + Devanagari Hindi)
    AGENCY_KEYWORDS = [
        r"\bcbi\b",
        r"central bureau of investigation",
        r"सीबीआई",
        r"सीबीआइ",
        r"\bed\b",
        r"enforcement directorate",
        r"ईडी",
        r"प्रवर्तन निदेशालय",
        r"mumbai police",
        r"मुंबई पुलिस",
        r"delhi police",
        r"दिल्ली पुलिस",
        r"cyber crime branch",
        r"cyber crime",
        r"cyber cell",
        r"साइबर सेल",
        r"साइबर क्राइम",
        r"साइबर पुलिस",
        r"crime branch",
        r"क्राइम ब्रांच",
        r"narcotics control bureau",
        r"\bncb\b",
        r"नारकोटिक्स",
        r"supreme court of india",
        r"supreme court",
        r"सुप्रीम कोर्ट",
        r"सर्वोच्च न्यायालय",
        r"high court",
        r"हाई कोर्ट",
        r"उच्च न्यायालय",
        r"reserve bank of india",
        r"\brbi\b",
        r"रिजर्व बैंक",
        r"आरबीआई",
        r"interpol",
        r"इंटरपोल",
        r"trai",
        r"ट्राई",
        r"customs department",
        r"कस्टम विभाग",
        r"police officer",
        r"पुलिस अधिकारी",
        r"police thana",
        r"थाना",
        r"कोतवाली",
    ]

    # Digital arrest & video extortion keywords (English + Hinglish + Devanagari Hindi)
    VIDEO_EXTORTION_KEYWORDS = [
        r"digital arrest",
        r"डिजिटल अरेस्ट",
        r"डिजिटल गिरफ़्तारी",
        r"डिजिटल हिरासत",
        r"digital custody",
        r"virtual arrest",
        r"वर्चुअल अरेस्ट",
        r"skype video",
        r"skype",
        r"स्काइप",
        r"zoom call",
        r"zoom",
        r"ज़ूम कॉल",
        r"ज़ूम",
        r"whatsapp video call",
        r"whatsapp video",
        r"व्हाट्सएप वीडियो",
        r"video call",
        r"वीडियो कॉल",
        r"stay in room",
        r"कमरे में रहें",
        r"कमरा बंद",
        r"camera on",
        r"कैमरा ऑन",
        r"कैमरा चालू",
        r"do not disconnect",
        r"कॉल मत काटना",
        r"कॉल न काटें",
        r"confidential interrogation",
        r"गोपनीय पूछताछ",
        r"webcam.*surveillance",
        r"webcam",
        r"वेबकैम",
        r"isolated.*room",
        r"अकेले कमरे",
    ]

    # Threat & Coercion keywords (English + Hinglish + Devanagari Hindi)
    COERCION_KEYWORDS = [
        r"illegal parcel",
        r"अवैध पार्सल",
        r"drugs found",
        r"drugs",
        r"ड्रग्स",
        r"नशीला",
        r"mdma.*taiwan",
        r"mdma",
        r"एमडीएमए",
        r"passport.*seized",
        r"पासपोर्ट जब्त",
        r"fake passport",
        r"sim card.*illegal",
        r"अवैध सिम",
        r"fake sim",
        r"money laundering",
        r"मनी लॉन्ड्रिंग",
        r"काले धन",
        r"human trafficking",
        r"मानव तस्करी",
        r"arrest warrant",
        r"गिरफ्तारी वारंट",
        r"warrant of arrest",
        r"वारंट",
        r"non-bailable warrant",
        r"गैर-जमानती",
        r"immediate detention",
        r"तुरंत गिरफ्तारी",
        r"do not inform family",
        r"परिवार को मत बताना",
        r"किसी को मत बताना",
        r"keep it secret",
        r"गोपनीय रखें",
        r"court summons",
        r"कोर्ट समन",
        r"commando raid",
        r"पुलिस छापा",
    ]

    # Financial extortion traps (English + Hinglish + Devanagari Hindi)
    FINANCIAL_EXTORTION_KEYWORDS = [
        r"rbi.*verification",
        r"आरबीआई वेरिफिकेशन",
        r"rbi.*account",
        r"आरबीआई खाता",
        r"clearance account",
        r"क्लियरेंस खाता",
        r"सरकारी खाता",
        r"security deposit",
        r"सुरक्षा राशि",
        r"सिक्योरिटी डिपॉजिट",
        r"escrow account",
        r"एस्क्रो खाता",
        r"asset verification",
        r"संपत्ति वेरिफिकेशन",
        r"refundable.*deposit",
        r"रिफंडेबल राशि",
        r"transfer.*to verify",
        r"वेरिफाई करने के लिए पैसे",
        r"transfer.*(account|rbi|cbi|police|court|money|rs|inr|fund|lakh|khate|paise)",
        r"(paise|rupaye|paisa|money|amount|fund).*transfer",
        r"(paise|rupaye|paisa|money).*bhejo",
        r"(paise|rupaye|paisa|money).*jama",
        r"deposit.*(account|rbi|cbi|police|court|rs|inr|money|fund)",
        r"rtgs.*account",
        r"safety account",
        r"safekeeping account",
        r"bank account seizure",
        r"खाता सीज",
        r"बैंक खाता सीज",
        r"freeze.*all.*accounts",
        r"freeze.*account",
        r"खाता फ्रीज",
        r"bail amount",
        r"जमानत राशि",
    ]

    @classmethod
    def analyze(cls, text: str) -> Dict[str, Any]:
        """
        Analyze text or OCR content for Digital Arrest markers and legal violations.
        """
        clean_text = text.lower()
        score = 0
        evidence: List[ForensicEvidence] = []
        legal_checks: List[LegalRuleCheck] = []

        # 1. Check for Agency Impersonation
        matched_agencies = []
        for pat in cls.AGENCY_KEYWORDS:
            if re.search(pat, clean_text):
                matched_agencies.append(pat.replace(r"\b", "").upper())

        # 2. Check for Video Arrest / Isolation Trap
        matched_video = []
        for pat in cls.VIDEO_EXTORTION_KEYWORDS:
            if re.search(pat, clean_text):
                matched_video.append(pat)

        # 3. Check for False Criminal Charges & Coercion
        matched_coercion = []
        for pat in cls.COERCION_KEYWORDS:
            if re.search(pat, clean_text):
                matched_coercion.append(pat)

        # 4. Check for Financial Extortion / Clearance Account demands
        matched_finance = []
        for pat in cls.FINANCIAL_EXTORTION_KEYWORDS:
            if re.search(pat, clean_text):
                matched_finance.append(pat)

        # --- Rule Evaluation ---
        # Violation 1: Video Call Arrest (Illegal under BNSS / CrPC)
        if matched_video:
            score += 45
            evidence.append(ForensicEvidence(
                indicator="Digital Arrest / Video Call Coercion",
                severity="CRITICAL",
                detail_en="Scammer claims arrest or custody via video call (Skype/WhatsApp/Zoom).",
                detail_hi="धोखेबाज वीडियो कॉल (Skype/WhatsApp) पर गिरफ्तारी या डिजिटल अरेस्ट का दावा कर रहा है।"
            ))
            legal_checks.append(LegalRuleCheck(
                statute=LEGAL_STATUTES["NO_VIDEO_ARREST"]["section"],
                rule_name="Prohibition of Video Arrest",
                violated=True,
                explanation_en=LEGAL_STATUTES["NO_VIDEO_ARREST"]["rule_en"],
                explanation_hi=LEGAL_STATUTES["NO_VIDEO_ARREST"]["rule_hi"]
            ))

        # Violation 2: Secret RBI / Government Verification Account Transfer Demand
        if matched_finance:
            score += 40
            evidence.append(ForensicEvidence(
                indicator="Demanding Money Transfer to 'Verification Account'",
                severity="CRITICAL",
                detail_en="Demand for fund transfer to 'RBI verification' or 'security deposit' account to prove innocence.",
                detail_hi="निर्दोष साबित करने के लिए 'आरबीआई वेरिफिकेशन' या सरकारी खाते में पैसे ट्रांसफर करने की मांग।"
            ))
            legal_checks.append(LegalRuleCheck(
                statute=LEGAL_STATUTES["NO_SECRET_ACCOUNT_TRANSFER"]["section"],
                rule_name="No Fund Transfer for Legal Verification",
                violated=True,
                explanation_en=LEGAL_STATUTES["NO_SECRET_ACCOUNT_TRANSFER"]["rule_en"],
                explanation_hi=LEGAL_STATUTES["NO_SECRET_ACCOUNT_TRANSFER"]["rule_hi"]
            ))

        # Violation 3: Threat of immediate arrest / contraband accusation + Secrecy demand
        if matched_coercion:
            score += 25
            evidence.append(ForensicEvidence(
                indicator="Fabricated Contraband / Money Laundering Charges",
                severity="HIGH",
                detail_en="Accusations of drugs, fake SIMs, illegal parcel, or money laundering intended to induce panic.",
                detail_hi="ड्रग्स, अवैध पार्सल, सिम कार्ड या मनी लॉन्ड्रिंग के झूठे आरोप लगाकर डराने की कोशिश।"
            ))
            if any(re.search(r"inform family|secret|alone", p) for p in matched_coercion) or matched_video:
                legal_checks.append(LegalRuleCheck(
                    statute=LEGAL_STATUTES["NO_ISOLATION_DEMAND"]["section"],
                    rule_name="Right to Liberty & Counsel (Article 21)",
                    violated=True,
                    explanation_en=LEGAL_STATUTES["NO_ISOLATION_DEMAND"]["rule_en"],
                    explanation_hi=LEGAL_STATUTES["NO_ISOLATION_DEMAND"]["rule_hi"]
                ))

        # Agency mismatch or multi-agency forgery (e.g. Interpol + CBI + Mumbai Police on same document)
        if len(matched_agencies) >= 2:
            score += 20
            evidence.append(ForensicEvidence(
                indicator="Multi-Agency Seal / Header Inconsistency",
                severity="HIGH",
                detail_en=f"Document or message mixes distinct unrelated agencies: {', '.join(set(matched_agencies))}.",
                detail_hi=f"संदेश या नोटिस में कई अलग-अलग सरकारी एजेंसियों के नाम मिले-जुले हैं: {', '.join(set(matched_agencies))}।"
            ))

        # Cap score at 100
        score = min(score, 100)
        is_digital_arrest = bool(score >= 50 or (matched_video and (matched_finance or matched_coercion)))

        return {
            "score": score,
            "is_digital_arrest": is_digital_arrest,
            "matched_agencies": matched_agencies,
            "evidence": evidence,
            "legal_checks": legal_checks,
        }
