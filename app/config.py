"""
Kavach AI Configuration & Constants
Defines Indian legal statutes, official domains, high-risk malware patterns,
and system thresholds.
"""
import os
from typing import Set, Dict, List

# Core App Configuration
APP_NAME = "Kavach AI"
APP_SUBTITLE = "Cyber Scam, Digital Arrest & Malicious APK Shield"
VERSION = "1.0.0"

# Gemini AI Configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

# Risk Score Thresholds (0-100)
THRESHOLD_CRITICAL = 75
THRESHOLD_SUSPICIOUS = 40

# Official Indian Government & Telecom Domains (Whitelist)
OFFICIAL_GOV_DOMAINS: Set[str] = {
    "gov.in",
    "nic.in",
    "cybercrime.gov.in",
    "cbi.gov.in",
    "delhipolice.gov.in",
    "mha.gov.in",
    "rbi.org.in",
    "sci.gov.in",
    "echallan.parivahan.gov.in",
    "pmkisan.gov.in",
    "uidai.gov.in",
    "incometax.gov.in",
}

OFFICIAL_TELCO_DOMAINS: Set[str] = {
    "jio.com",
    "airtel.in",
    "myvi.in",
    "bsnl.co.in",
}

# High-Risk Permissions commonly abused by Indian Banking Trojans & RATs
DANGEROUS_PERMISSIONS: Dict[str, Dict[str, str]] = {
    "android.permission.RECEIVE_SMS": {
        "severity": "CRITICAL",
        "description_en": "Can intercept incoming SMS containing Bank OTPs and login codes.",
        "description_hi": "बैंक ओटीपी और सुरक्षा कोड वाले आने वाले एसएमएस पढ़ सकता है।"
    },
    "android.permission.READ_SMS": {
        "severity": "CRITICAL",
        "description_en": "Can read all existing and new text messages on your device.",
        "description_hi": "आपके फोन में मौजूद सभी मैसेज और बैंक अलर्ट पढ़ सकता है।"
    },
    "android.permission.SEND_SMS": {
        "severity": "HIGH",
        "description_en": "Can silently send premium rate SMS or forward OTPs without your knowledge.",
        "description_hi": "बिना आपकी अनुमति के गुप्त रूप से एसएमएस भेज सकता है।"
    },
    "android.permission.BIND_ACCESSIBILITY_SERVICE": {
        "severity": "CRITICAL",
        "description_en": "Grants complete control over the screen, auto-clicking, and keystroke logging.",
        "description_hi": "फोन की स्क्रीन पर पूर्ण नियंत्रण और गुप्त ऑटो-क्लिक की अनुमति देता है।"
    },
    "android.permission.SYSTEM_ALERT_WINDOW": {
        "severity": "HIGH",
        "description_en": "Displays fake overlay login screens over real banking/UPI apps.",
        "description_hi": "असली बैंक ऐप के ऊपर नकली स्क्रीन दिखाकर पासवर्ड चुरा सकता है।"
    },
    "android.permission.REQUEST_INSTALL_PACKAGES": {
        "severity": "HIGH",
        "description_en": "Allows installing additional unauthorized malicious apps in the background.",
        "description_hi": "पृष्ठभूमि में बिना अनुमति अन्य खतरनाक ऐप्स इंस्टॉल कर सकता है।"
    },
    "android.permission.READ_CALL_LOG": {
        "severity": "MEDIUM",
        "description_en": "Can access call history and caller identity.",
        "description_hi": "आपकी कॉल हिस्ट्री और संपर्कों को पढ़ सकता है।"
    },
    "android.permission.RECORD_AUDIO": {
        "severity": "MEDIUM",
        "description_en": "Can record ambient sound and private phone conversations.",
        "description_hi": "आपकी निजी बातचीत रिकॉर्ड कर सकता है।"
    }
}

# Suspicious APK Filename Patterns in India
SUSPICIOUS_APK_PATTERNS: List[str] = [
    r"wedding.*\.apk",
    r"shaadi.*\.apk",
    r"invitation.*\.apk",
    r"nimantran.*\.apk",
    r"electricity.*\.apk",
    r"bijli.*\.apk",
    r"bill.*update.*\.apk",
    r"challan.*\.apk",
    r"traffic.*police.*\.apk",
    r"pm.*kisan.*\.apk",
    r"yono.*update.*\.apk",
    r"kyc.*update.*\.apk",
    r"bank.*rewards.*\.apk",
    r"free.*recharge.*\.apk",
    r"ladli.*behna.*\.apk",
    r"bonus.*cash.*\.apk",
]

# Statutory Legal References (BNSS / CrPC)
LEGAL_STATUTES = {
    "NO_VIDEO_ARREST": {
        "section": "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / CrPC Section 41",
        "rule_en": "Indian law DOES NOT authorize any police, CBI, ED, or court officer to arrest or detain any citizen via video call (Skype, WhatsApp, Zoom).",
        "rule_hi": "भारतीय कानून (BNSS / CrPC) के तहत किसी भी पुलिस, CBI या कोर्ट द्वारा वीडियो कॉल पर गिरफ्तारी का कोई प्रावधान नहीं है।"
    },
    "NO_SECRET_ACCOUNT_TRANSFER": {
        "section": "Prevention of Money Laundering Act (PMLA) & Banking Regulation Act",
        "rule_en": "No government agency, judge, or police officer can order you to transfer funds to a 'Reserve Bank verification account' or 'secret clearance account'.",
        "rule_hi": "कोई भी सरकारी जांच एजेंसी या पुलिस आपको 'आरबीआई वेरिफिकेशन' या किसी निजी खाते में पैसे ट्रांसफर करने को नहीं कह सकती।"
    },
    "NO_ISOLATION_DEMAND": {
        "section": "Constitution of India, Article 21 (Protection of Life & Personal Liberty)",
        "rule_en": "Coercing someone to remain locked in a room under webcam surveillance with threats of seizure is unlawful extortion and cyber kidnapping.",
        "rule_hi": "कैमरा चालू रखकर कमरे में अकेले बंद रहने का दबाव बनाना जबरन वसूली (Extortion) और गैरकानूनी है।"
    }
}

# Emergency Helpline
CYBER_HELPLINE = "1930"
CYBER_PORTAL = "https://cybercrime.gov.in"
