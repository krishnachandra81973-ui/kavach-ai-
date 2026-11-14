"""
Edge case and multilingual tests for Kavach AI
Covers Hinglish, Devanagari Hindi, legitimate promos, corrupt APK inputs, and SOS formatting.
"""
import pytest
from app.engine.forensics import ForensicOrchestrator
from app.engine.digital_arrest import DigitalArrestAnalyzer
from app.engine.greed_scams import GreedScamAnalyzer
from app.engine.apk_analyzer import APKAnalyzer
from app.models.schemas import ThreatLevel, ThreatCategory


@pytest.mark.anyio
async def test_hinglish_digital_arrest_detection():
    text = (
        "CBI police notice: aapke naam pe illegal parcel pakda gaya hai MDMA drugs ka. "
        "Aapko digital arrest kiya jata hai. Turant Skype video call pe connect kare aur camera on rakhe. "
        "Kisi ko mat bataye aur RBI clearance account me 1 lakh transfer kare."
    )
    result = await ForensicOrchestrator.analyze(text=text)
    assert result.threat_level == ThreatLevel.CRITICAL
    assert result.category == ThreatCategory.DIGITAL_ARREST
    assert result.threat_score >= 80
    assert "1930" in result.speech_script_hi
    assert "1930" in result.speech_script_en


@pytest.mark.anyio
async def test_hindi_script_digital_arrest():
    text = (
        "सावधान: यह मुंबई पुलिस साइबर सेल का नोटिस है। आपके खिलाफ डिजिटल अरेस्ट वारंट जारी हुआ है। "
        "स्काइप वीडियो कॉल (Skype video) पर तुरंत जुड़ें और कमरा बंद रखें।"
    )
    result = await ForensicOrchestrator.analyze(text=text)
    assert result.threat_level in [ThreatLevel.CRITICAL, ThreatLevel.SUSPICIOUS]
    assert result.category == ThreatCategory.DIGITAL_ARREST


@pytest.mark.anyio
async def test_hindi_recharge_scam():
    text = (
        "बधाई हो! पीएम मोदी दे रहे हैं सभी को 84 दिन का मुफ्त रिचार्ज (Free recharge)। "
        "अभी इस लिंक http://modi-recharge.xyz पर जाएं और 5 दोस्तों को व्हाट्सएप पर भेजें।"
    )
    result = await ForensicOrchestrator.analyze(text=text)
    assert result.threat_level in [ThreatLevel.CRITICAL, ThreatLevel.SUSPICIOUS]
    assert result.category == ThreatCategory.GREED_SCAM


@pytest.mark.anyio
async def test_legitimate_jio_renewal_message():
    text = (
        "Dear Customer, your Jio 5G plan expires in 3 days. "
        "Recharge with your favorite unlimited 5G plan today at https://www.jio.com or via MyJio app."
    )
    result = await ForensicOrchestrator.analyze(text=text)
    assert result.threat_level == ThreatLevel.SAFE
    assert result.category == ThreatCategory.LEGITIMATE


def test_corrupt_apk_with_apk_extension():
    # File named .apk but contains garbage or text
    data = b"This is just a text file renamed to fake.apk"
    result = APKAnalyzer.analyze_bytes(data, filename="Wedding_Card.apk")
    assert result["is_malicious"] is True  # Filename matches high-threat deceptive lure pattern
    assert result["metadata"].is_valid_zip is False


@pytest.mark.anyio
async def test_whatsapp_sos_formatting():
    text = "Digital arrest warrant from CBI. Transfer money to verification account."
    result = await ForensicOrchestrator.analyze(text=text)
    assert "🚨 *CYBER SCAM ALERT - KAVACH AI* 🚨" in result.whatsapp_sos_text
    assert "1930" in result.whatsapp_sos_text
    assert "https://cybercrime.gov.in" in result.whatsapp_sos_text
