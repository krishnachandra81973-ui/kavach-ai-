"""
Pydantic schemas for Kavach AI requests, responses, and forensic reports.
"""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ThreatLevel(str, Enum):
    CRITICAL = "CRITICAL"      # Score >= 75: Severe scam / dangerous malware
    SUSPICIOUS = "SUSPICIOUS"  # Score 40-74: High risk indicators, proceed with caution
    SAFE = "SAFE"              # Score < 40: Normal message / legitimate official resource


class ThreatCategory(str, Enum):
    DIGITAL_ARREST = "DIGITAL_ARREST"    # Pillar 1: Fake Police/CBI/Supreme Court, Video Call Arrest, Extortion
    GREED_SCAM = "GREED_SCAM"            # Pillar 2: Fake Free Recharge, Fake Cash Doles, Phishing URLs, Viral Forwards
    MALICIOUS_APK = "MALICIOUS_APK"      # Pillar 3: Banking Trojans, Wedding/Bill APKs, SMS Stealers
    LEGITIMATE = "LEGITIMATE"            # No malicious indicator detected


class LegalRuleCheck(BaseModel):
    statute: str
    rule_name: str
    violated: bool
    explanation_en: str
    explanation_hi: str


class MaliciousPermission(BaseModel):
    permission: str
    severity: str
    description_en: str
    description_hi: str


class APKMetadata(BaseModel):
    filename: str
    file_size_bytes: int
    is_valid_zip: bool
    package_name: Optional[str] = None
    dangerous_permissions: List[MaliciousPermission] = Field(default_factory=list)
    detected_indicators: List[str] = Field(default_factory=list)
    trojan_classification: Optional[str] = None


class ForensicEvidence(BaseModel):
    indicator: str
    severity: str  # HIGH, CRITICAL, MEDIUM, LOW
    detail_en: str
    detail_hi: str


class AnalysisResponse(BaseModel):
    threat_level: ThreatLevel
    threat_score: int = Field(ge=0, le=100)
    category: ThreatCategory
    title_en: str
    title_hi: str
    summary_en: str
    summary_hi: str
    evidence_list: List[ForensicEvidence] = Field(default_factory=list)
    legal_rule_violations: List[LegalRuleCheck] = Field(default_factory=list)
    apk_analysis: Optional[APKMetadata] = None
    immediate_actions_en: List[str] = Field(default_factory=list)
    immediate_actions_hi: List[str] = Field(default_factory=list)
    speech_script_en: str
    speech_script_hi: str
    whatsapp_sos_text: str
    engine_used: str
    emergency_helpline: str = "1930"
    official_portal: str = "https://cybercrime.gov.in"


class TextAnalysisRequest(BaseModel):
    text: str
    api_key: Optional[str] = None
