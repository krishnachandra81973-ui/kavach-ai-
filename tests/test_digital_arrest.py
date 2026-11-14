"""
Unit tests for Pillar 1: Digital Arrest & Fake Agency Notice Analyzer
"""
import pytest
from app.engine.digital_arrest import DigitalArrestAnalyzer
from app.models.schemas import ThreatLevel


def test_digital_arrest_detection_full_scam():
    text = (
        "This is Mumbai Police Cyber Crime Cell. An illegal parcel containing MDMA drugs "
        "has been seized under your name. You are placed under DIGITAL ARREST. "
        "Stay in your room on Skype video call with camera on. Do not inform family. "
        "Transfer Rs 2,00,000 to RBI verification account to clear your charges under CrPC Section 41."
    )
    result = DigitalArrestAnalyzer.analyze(text)
    assert result["is_digital_arrest"] is True
    assert result["score"] >= 75
    # Must violate BNSS / CrPC video arrest prohibition
    statute_names = [chk.rule_name for chk in result["legal_checks"]]
    assert "Prohibition of Video Arrest" in statute_names
    assert "No Fund Transfer for Legal Verification" in statute_names


def test_digital_arrest_video_extortion_only():
    text = "Join Skype video call now for confidential interrogation and stay in room camera on."
    result = DigitalArrestAnalyzer.analyze(text)
    assert any("Video Call" in ev.indicator for ev in result["evidence"])
    assert result["score"] >= 40


def test_legitimate_police_notice_no_false_positive():
    text = (
        "Delhi Police advisory: Citizens are requested to report lost mobile phones online at "
        "https://delhipolice.gov.in. Please do not visit police stations for lost property reports."
    )
    result = DigitalArrestAnalyzer.analyze(text)
    assert result["is_digital_arrest"] is False
    assert result["score"] < 40
