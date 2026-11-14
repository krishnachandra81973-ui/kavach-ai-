"""
Speech Synthesis & Emergency WhatsApp SOS Helper
Generates calming, actionable audio advisory scripts in Hindi and English,
and pre-formats one-tap WhatsApp SOS alert messages for families.
"""
from urllib.parse import quote
from typing import Dict, Any, List
from app.models.schemas import ThreatLevel, ThreatCategory


class SpeechAndSOSHelper:
    """
    Produces bilingual spoken scripts and SOS triggers for non-technical users and parents.
    """

    @classmethod
    def generate_advisory_scripts(
        cls,
        category: ThreatCategory,
        threat_level: ThreatLevel,
        threat_score: int,
        details: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate Hindi and English audio text and immediate action checklists.
        """
        if threat_level == ThreatLevel.SAFE:
            script_en = "This message or file appears safe. No critical fraud patterns or dangerous permissions were detected."
            script_hi = "यह संदेश या फाइल सुरक्षित प्रतीत होती है। इसमें कोई गंभीर धोखाधड़ी या खतरनाक परमिशन नहीं पाई गई है।"
            actions_en = [
                "No immediate threat detected.",
                "Always verify official announcements on gov.in websites.",
                "Never share your banking OTP with anyone."
            ]
            actions_hi = [
                "कोई खतरा नहीं पाया गया।",
                "सरकारी सूचनाओं की पुष्टि केवल gov.in वेबसाइट से करें।",
                "अपना बैंक ओटीपी कभी किसी को न बताएं।"
            ]
            return {
                "script_en": script_en,
                "script_hi": script_hi,
                "actions_en": actions_en,
                "actions_hi": actions_hi,
            }

        if category == ThreatCategory.DIGITAL_ARREST:
            script_en = (
                "Alert! This is a fake police notice and a Digital Arrest cyber fraud. "
                "Do not panic. Under Indian law and the Bharatiya Nagarik Suraksha Sanhita, "
                "no police or court can ever arrest you on video call or demand money transfer to verify innocence. "
                "Disconnect the call immediately, do not send any money, and dial 1930 for the National Cyber Crime Helpline."
            )
            script_hi = (
                "सावधान! यह एक फर्जी पुलिस नोटिस और डिजिटल अरेस्ट की गंभीर धोखाधड़ी है। "
                "घबराएं नहीं! भारतीय कानून (BNSS / CrPC) के तहत कोई भी पुलिस या कोर्ट वीडियो कॉल पर गिरफ्तारी नहीं कर सकती, "
                "और न ही किसी खाते में पैसे ट्रांसफर करने को कह सकती है। "
                "तुरंत वीडियो कॉल काट दें, किसी को पैसे न भेजें, और राष्ट्रीय साइबर हेल्पलाइन 1930 पर तुरंत कॉल करें।"
            )
            actions_en = [
                "1. Disconnect the Skype / WhatsApp video call immediately.",
                "2. Do NOT transfer any money to any 'RBI' or 'Clearance' account.",
                "3. Inform your family members immediately; do not stay isolated in your room.",
                "4. Dial 1930 (National Cyber Crime Helpline) or report on cybercrime.gov.in."
            ]
            actions_hi = [
                "1. तुरंत स्काइप या व्हाट्सएप वीडियो कॉल को काट दें।",
                "2. किसी भी 'आरबीआई' या 'सरकारी वेरिफिकेशन' खाते में पैसे न भेजें।",
                "3. कमरे में अकेले बंद न रहें, तुरंत अपने परिवार को पूरी बात बताएं।",
                "4. राष्ट्रीय साइबर हेल्पलाइन नंबर 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।"
            ]

        elif category == ThreatCategory.MALICIOUS_APK:
            apk_name = details.get("filename", "APK")
            script_en = (
                f"Warning! The file '{apk_name}' is a dangerous malicious app, likely a banking trojan. "
                "It is designed to steal your bank OTPs, read your SMS, and hijack your phone. "
                "Do NOT install or open this file. If already installed, immediately disconnect Wi-Fi and mobile data, "
                "uninstall the application, and contact your bank to freeze your net banking."
            )
            script_hi = (
                f"चेतावनी! '{apk_name}' फाइल एक बेहद खतरनाक मैलवेयर और बैंकिंग वायरस है। "
                "यह आपके बैंक के गुप्त ओटीपी चुराने और फोन पर कब्जा करने के लिए बनाई गई है। "
                "इस फाइल को बिल्कुल भी इंस्टॉल न करें! अगर इंस्टॉल कर लिया है, तो तुरंत फोन का इंटरनेट बंद करें, "
                "ऐप को डिलीट करें, और अपने बैंक को कॉल करके खाते को सुरक्षित करें।"
            )
            actions_en = [
                "1. Do NOT tap 'Install' or open this APK file.",
                "2. If already installed: immediately turn off Wi-Fi and Mobile Data (Flight Mode).",
                "3. Go to Phone Settings -> Apps and uninstall the unknown application.",
                "4. Call your bank immediately and change UPI and NetBanking passwords."
            ]
            actions_hi = [
                "1. इस APK फाइल को फोन में बिल्कुल इंस्टॉल न करें।",
                "2. यदि इंस्टॉल कर लिया है, तो तुरंत फोन को फ्लाइट मोड (इंटरनेट बंद) पर डालें।",
                "3. फोन की सेटिंग्स -> ऐप्स में जाकर अज्ञात ऐप को अनइंस्टॉल (डिलीट) करें।",
                "4. तुरंत अपने बैंक को सूचित करें और यूपीआई / नेटबैंकिंग का पिन बदलें।"
            ]

        else:  # GREED_SCAM
            script_en = (
                "Warning! This message is a deceptive fraud offer promising free mobile recharge or fake cash. "
                "Government schemes and telecom companies never give free recharge via WhatsApp links or ask you to forward messages. "
                "Do not click the link, do not share OTP, and do not forward this to your family or friends."
            )
            script_hi = (
                "चेतावनी! यह मुफ्त मोबाइल रिचार्ज या सरकारी योजना के नाम पर ठगी का संदेश है। "
                "कोई भी सरकारी योजना या जियो-एयरटेल व्हाट्सएप लिंक पर मुफ्त रिचार्ज नहीं देती। "
                "इस लिंक पर क्लिक न करें, किसी को ओटीपी न दें, और इस मैसेज को किसी भी ग्रुप या रिश्तेदार को न भेजें।"
            )
            actions_en = [
                "1. Do NOT click the unofficial link.",
                "2. Do NOT forward this message to WhatsApp groups or friends.",
                "3. Official government websites always end with '.gov.in' or '.nic.in'.",
                "4. Warn the person who sent this message that it is a cyber fraud."
            ]
            actions_hi = [
                "1. इस फर्जी लिंक पर बिल्कुल क्लिक न करें।",
                "2. इस मैसेज को किसी अन्य व्हाट्सएप ग्रुप या दोस्तों को फॉरवर्ड न करें।",
                "3. असली सरकारी वेबसाइट हमेशा '.gov.in' या '.nic.in' पर समाप्त होती हैं।",
                "4. जिस व्यक्ति ने आपको यह मैसेज भेजा है, उसे भी सचेत करें कि यह फ्रॉड है।"
            ]

        return {
            "script_en": script_en,
            "script_hi": script_hi,
            "actions_en": actions_en,
            "actions_hi": actions_hi,
        }

    @classmethod
    def format_whatsapp_sos(
        cls,
        category: ThreatCategory,
        threat_level: ThreatLevel,
        threat_score: int,
        title_en: str
    ) -> str:
        """
        Creates a pre-formatted message that users can send to family or friends via WhatsApp.
        """
        if threat_level == ThreatLevel.SAFE:
            return "Kavach AI Verification: This message or app has been verified as SAFE."

        category_label = {
            ThreatCategory.DIGITAL_ARREST: "DIGITAL ARREST / FAKE POLICE EXTORTION",
            ThreatCategory.GREED_SCAM: "FAKE FREE RECHARGE / GOVERNMENT SCHEME PHISHING",
            ThreatCategory.MALICIOUS_APK: "DANGEROUS BANKING TROJAN (APK MALWARE)"
        }.get(category, "CYBER SCAM")

        sos_text = (
            f"🚨 *CYBER SCAM ALERT - KAVACH AI* 🚨\n\n"
            f"⚠️ *Threat Level:* {threat_level.value} (Risk Score: {threat_score}/100)\n"
            f"📌 *Detected Fraud:* {category_label}\n\n"
            f"🛑 *CRITICAL ADVISORY:*\n"
            f"• Under Indian Law, Police/CBI NEVER arrest via video call.\n"
            f"• Never transfer money to any 'RBI' or verification account.\n"
            f"• Never install unknown APK files (like Wedding Card or Electricity Bill).\n"
            f"• Do not click unofficial links or forward to groups.\n\n"
            f"📞 *National Cyber Helpline:* 1930\n"
            f"🌐 *Report Fraud:* https://cybercrime.gov.in\n\n"
            f"_(Verified using Kavach AI Shield)_"
        )
        return sos_text

    @classmethod
    def get_whatsapp_share_url(cls, sos_text: str) -> str:
        """Return the one-tap WhatsApp share URL."""
        return f"https://api.whatsapp.com/send?text={quote(sos_text)}"
