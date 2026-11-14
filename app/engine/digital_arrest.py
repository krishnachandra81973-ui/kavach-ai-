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

    # Agency & Authority keywords
    AGENCY_KEYWORDS = [
        r"\bcbi\b",
        r"central bureau of investigation",
        r"\bed\b",
        r"enforcement directorate",
        r"mumbai police",
        r"delhi police",
        r"cyber crime branch",
        r"crime branch",
        r"narcotics control bureau",
        r"\bncb\b",
        r"supreme court of india",
        r"high court",
        r"reserve bank of india",
        r"\brbi\b",
        r"interpol",
        r"trai",
        r"customs department",
        r"cyber cell",
    ]

    # Digital arrest & video extortion keywords
    VIDEO_EXTORTION_KEYWORDS = [
        r"digital arrest",
        r"digital custody",
        r"virtual arrest",
        r"skype video",
        r"zoom call",
        r"whatsapp video call",
        r"stay in room",
        r"camera on",
        r"do not disconnect",
        r"confidential interrogation",
        r"webcam.*surveillance",
        r"isolated.*room",
    ]

    # Threat & Coercion keywords
    COERCION_KEYWORDS = [
        r"illegal parcel",
        r"drugs found",
        r"mdma.*taiwan",
        r"passport.*seized",
        r"sim card.*illegal",
        r"money laundering",
        r"human trafficking",
        r"arrest warrant",
        r"warrant of arrest",
        r"immediate detention",
        r"do not inform family",
        r"keep it secret",
        r"court summons",
    ]

    # Financial extortion traps
    FINANCIAL_EXTORTION_KEYWORDS = [
        r"rbi.*verification",
        r"rbi.*account",
        r"clearance account",
        r"security deposit",
        r"escrow account",
        r"asset verification",
        r"refundable.*deposit",
        r"transfer.*to verify",
        r"transfer.*(account|rbi|cbi|police|court|money|rs|inr|fund)",
        r"deposit.*(account|rbi|cbi|police|court|rs|inr|money)",
        r"rtgs.*account",
        r"safety account",
        r"safekeeping account",
        r"bank account seizure",
        r"freeze.*all.*accounts",
        r"freeze.*account",
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
