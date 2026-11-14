"""
Gemini 1.5 Flash Multimodal Analysis Engine
Provides deep visual forensic verification for fake stamps, emblems, and notices,
with robust offline fallback to Kavach local heuristics when API key is missing.
"""
import os
import json
import logging
from typing import Dict, Any, Optional
from app.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)


GEMINI_SYSTEM_PROMPT = """
You are "Kavach AI", an elite Cyber Security & Forensic Legal AI specialized in Indian Cyber Fraud, Digital Arrest scams, and Social Engineering.
Your role is to analyze submitted text, screenshots, police notices, and APK warnings to protect Indian citizens and senior citizens.

Strict Indian Cyber & Legal Ground Truths:
1. "Digital Arrest" is 100% FRAUD: Under Indian law (Bharatiya Nagarik Suraksha Sanhita - BNSS 2023 / CrPC), NO law enforcement agency (Police, CBI, ED, NIA, Narcotics Bureau, Supreme Court) ever conducts arrests, trials, or police custody via Skype, Zoom, or WhatsApp video call.
2. Secret Verification Bank Accounts: No agency or court will ever demand a citizen transfer money via RTGS/NEFT/UPI to an "RBI verification account", "security escrow account", or "temporary clearance fund" to prove their innocence.
3. Fake Seals / Emblems: Scammers frequently combine mismatched emblems (e.g. CBI + Interpol + Mumbai Police + Supreme Court emblem) on the same letterhead with forged digital signatures.
4. Fake Free Recharges & Cash Doles: Any message offering 84-day/1-year free recharge (Jio/Airtel) or cash gifts from PM Modi requiring forwarding to WhatsApp groups or clicking non-.gov.in domains is phishing.
5. Official Indian Gov Domains: Only domains ending in ".gov.in" or ".nic.in" are legitimate government portals.
6. Malicious APKs: APKs sent via WhatsApp named "Wedding_Card.apk", "Electricity_Bill.apk", "Challan.apk" are malicious droppers stealing SMS OTPs and accessing banking accounts.

Always output valid JSON conforming strictly to this format:
{
  "threat_level": "CRITICAL" | "SUSPICIOUS" | "SAFE",
  "threat_score": integer between 0 and 100,
  "category": "DIGITAL_ARREST" | "GREED_SCAM" | "MALICIOUS_APK" | "LEGITIMATE",
  "title_en": "Concise English Title",
  "title_hi": "Concise Hindi Title",
  "summary_en": "Clear 2-sentence summary in English explaining why this is a scam or safe.",
  "summary_hi": "Clear 2-sentence summary in Hindi explaining why this is a scam or safe.",
  "visual_anomalies": ["Any visual flaws detected in seals, stamps, letterheads, or formatting"],
  "legal_violations": ["Legal statutes violated like BNSS Section 41, PMLA, etc."],
  "reasons": ["Point 1", "Point 2", "Point 3"]
}
"""


class GeminiAnalyzer:
    """
    Connects to Google GenAI / Gemini 1.5 Flash when configured.
    """

    @classmethod
    def is_configured(cls, custom_key: Optional[str] = None) -> bool:
        key = custom_key or os.environ.get("GEMINI_API_KEY") or GEMINI_API_KEY
        return bool(key and key.strip())

    @classmethod
    async def analyze(
        cls,
        text: Optional[str] = None,
        image_bytes: Optional[bytes] = None,
        mime_type: Optional[str] = None,
        custom_key: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Perform analysis with Gemini 1.5 Flash multimodal engine.
        Returns parsed JSON or None if unavailable.
        """
        api_key = custom_key or os.environ.get("GEMINI_API_KEY") or GEMINI_API_KEY
        if not api_key:
            return None

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            contents = []

            # Add image if provided
            if image_bytes and mime_type:
                contents.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))

            # Add text prompt
            user_content = text if text else "Analyze this submitted evidence for cyber fraud, fake legal notices, or phishing."
            contents.append(user_content)

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=GEMINI_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )

            if response and response.text:
                parsed_json = json.loads(response.text)
                return parsed_json

        except Exception as e:
            logger.warning(f"Gemini API invocation failed or unavailable: {e}")
            return None

        return None
