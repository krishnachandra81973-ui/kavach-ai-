"""
Pillar 2: Greed Scam & Fake Offer Analyzer
Detects fake free mobile recharge, fake PM/Govt cash doles, phishing URLs,
non-.gov.in domain violations, and WhatsApp viral forward traps.
"""
import re
from urllib.parse import urlparse
from typing import Dict, Any, List, Set
from app.models.schemas import ForensicEvidence
from app.config import OFFICIAL_GOV_DOMAINS, OFFICIAL_TELCO_DOMAINS


class GreedScamAnalyzer:
    """
    Forensic engine to detect Free Recharge traps, Fake Government Schemes,
    phishing domains, and WhatsApp viral sharing extortion.
    """

    # Fake Free Recharge keywords
    RECHARGE_KEYWORDS = [
        r"free recharge",
        r"muft recharge",
        r"मुफ्त रिचार्ज",
        r"free 5g recharge",
        r"3 month.*recharge",
        r"84 day.*recharge",
        r"1 year free recharge",
        r"jio.*free",
        r"airtel.*free",
        r"vi.*free",
        r"recharge offer",
        r"unlimited 5g free",
    ]

    # Fake Govt Welfare Schemes & Cash Giveaways
    GOVT_SCHEME_KEYWORDS = [
        r"pm kisan.*installment",
        r"pm kisan.*rupees",
        r"ladli behna.*yojana",
        r"mahila samman",
        r"pm awas.*cash",
        r"free laptop.*yojana",
        r"free smartphone.*student",
        r"pradhan mantri.*yojana",
        r"pm modi.*gift",
        r"cash subsidy",
        r"instant loan.*approved",
        r"lottery.*won",
        r"kbc.*winner",
    ]

    # WhatsApp Viral Sharing Trap Patterns
    VIRAL_FORWARD_PATTERNS = [
        r"forward.*to \d+.*(group|friend|whatsapp)",
        r"share.*with \d+.*(group|friend|people)",
        r"bhejo.*(group|friend|whatsapp)",
        r"\d+ logo ko bheje",
        r"\d+ dosto ko share",
        r"whatsapp pe share kare",
        r"share to unlock",
        r"forward to unlock",
    ]

    # Suspicious Phishing TLDs and Substrings
    SUSPICIOUS_TLDS = {
        ".xyz", ".online", ".site", ".top", ".info", ".live", ".cc", ".click",
        ".buzz", ".club", ".icu", ".work", ".shop", ".vip", ".space", ".fit"
    }

    @classmethod
    def extract_urls(cls, text: str) -> List[str]:
        """Extract all HTTP/HTTPS and bare domain URLs from text."""
        url_regex = r"(?:https?://)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:/[^\s]*)?"
        matches = re.findall(url_regex, text)
        return [m.strip() for m in matches]

    @classmethod
    def audit_url(cls, url_str: str) -> Dict[str, Any]:
        """
        Check if a URL pretends to be Government or Telco but is on an unauthorized domain.
        """
        # Ensure scheme for urlparse
        target = url_str if url_str.startswith(("http://", "https://")) else f"https://{url_str}"
        try:
            parsed = urlparse(target)
            domain = (parsed.hostname or "").lower()
        except Exception:
            domain = url_str.lower()

        # Check if domain mimics Government
        mimics_gov = any(k in domain for k in ["pmkisan", "yojana", "gov", "nic", "sarkar", "seva", "portal"])
        is_official_gov = any(domain.endswith(f".{gov_d}") or domain == gov_d for gov_d in OFFICIAL_GOV_DOMAINS)

        # Check if domain mimics Telecom
        mimics_telco = any(k in domain for k in ["jio", "airtel", "vi-recharge", "bsnl"])
        is_official_telco = any(domain.endswith(f".{t_d}") or domain == t_d for t_d in OFFICIAL_TELCO_DOMAINS)

        # Check suspicious TLD
        has_suspicious_tld = any(domain.endswith(tld) for tld in cls.SUSPICIOUS_TLDS)

        is_phishing = False
        reason = ""
        reason_hi = ""

        if mimics_gov and not is_official_gov:
            is_phishing = True
            reason = f"Domain '{domain}' mimics an Indian Government portal but does not end with the official '.gov.in' or '.nic.in' extension."
            reason_hi = f"डोमेन '{domain}' सरकारी पोर्टल की नकल कर रहा है, लेकिन आधिकारिक '.gov.in' या '.nic.in' नहीं है।"
        elif mimics_telco and not is_official_telco:
            is_phishing = True
            reason = f"Domain '{domain}' mimics a telecom operator (Jio/Airtel/Vi) but is an unofficial third-party link."
            reason_hi = f"डोमेन '{domain}' टेलीकॉम कंपनी (Jio/Airtel) की नकल कर रहा है लेकिन यह आधिकारिक वेबसाइट नहीं है।"
        elif has_suspicious_tld:
            is_phishing = True
            reason = f"Domain '{domain}' uses a cheap/disposable top-level domain frequently utilized in phishing scams."
            reason_hi = f"डोमेन '{domain}' एक संदिग्ध और फर्जी वेबसाइट एक्सटेंशन का उपयोग कर रहा है।"

        return {
            "domain": domain,
            "is_phishing": is_phishing,
            "mimics_gov": mimics_gov,
            "is_official_gov": is_official_gov,
            "mimics_telco": mimics_telco,
            "is_official_telco": is_official_telco,
            "reason": reason,
            "reason_hi": reason_hi,
        }

    @classmethod
    def analyze(cls, text: str) -> Dict[str, Any]:
        """
        Analyze text for Greed / Lalach scam patterns.
        """
        clean_text = text.lower()
        score = 0
        evidence: List[ForensicEvidence] = []

        # 1. Check for Fake Free Recharge
        matched_recharge = [pat for pat in cls.RECHARGE_KEYWORDS if re.search(pat, clean_text)]
        if matched_recharge:
            score += 45
            evidence.append(ForensicEvidence(
                indicator="Fake Free Recharge Trap",
                severity="CRITICAL",
                detail_en="Offers free 84-day/1-year mobile recharge or free 5G data from PM or telecom companies.",
                detail_hi="फर्जी मुफ्त रिचार्ज (84 दिन / 1 साल) या पीएम मोदी के नाम पर फ्री डाटा का झूठा लालच।"
            ))

        # 2. Check for Fake Government Cash Doles
        matched_govt = [pat for pat in cls.GOVT_SCHEME_KEYWORDS if re.search(pat, clean_text)]
        if matched_govt:
            score += 40
            evidence.append(ForensicEvidence(
                indicator="Fake Government Scheme / Cash Dole Trap",
                severity="CRITICAL",
                detail_en="Promises direct cash deposits (PM Kisan, Ladli Behna, free laptop) without official verification.",
                detail_hi="पीएम किसान, लाडली बहना या मुफ्त लैपटॉप के नाम पर सीधे बैंक खाते में पैसे देने का फर्जी दावा।"
            ))

        # 3. Check for WhatsApp Viral Forward Trap
        matched_viral = [pat for pat in cls.VIRAL_FORWARD_PATTERNS if re.search(pat, clean_text)]
        if matched_viral:
            score += 35
            evidence.append(ForensicEvidence(
                indicator="Viral WhatsApp Forwarding Trap",
                severity="HIGH",
                detail_en="Requires forwarding message to 5 WhatsApp groups or 10 friends to unlock reward/recharge.",
                detail_hi="मुफ्त ऑफर पाने के लिए मैसेज को 5 व्हाट्सएप ग्रुप या 10 दोस्तों को भेजने का दबाव।"
            ))

        # 4. Check URLs and Domains
        urls = cls.extract_urls(text)
        phishing_urls_found = []
        for url in urls:
            audit = cls.audit_url(url)
            if audit["is_phishing"]:
                phishing_urls_found.append(audit)
                score += 40
                evidence.append(ForensicEvidence(
                    indicator="Fraudulent / Phishing Domain",
                    severity="CRITICAL",
                    detail_en=audit["reason"],
                    detail_hi=audit["reason_hi"]
                ))

        score = min(score, 100)
        is_greed_scam = bool(score >= 50 or (matched_recharge and (matched_viral or phishing_urls_found)))

        return {
            "score": score,
            "is_greed_scam": is_greed_scam,
            "matched_recharge": matched_recharge,
            "matched_govt": matched_govt,
            "matched_viral": matched_viral,
            "phishing_urls": phishing_urls_found,
            "evidence": evidence,
        }
