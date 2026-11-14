"""
Unit tests for Pillar 3: APK Static Analyzer & Banking Trojan Detector
"""
import os
import pytest
from app.engine.apk_analyzer import APKAnalyzer


def test_filename_social_engineering_heuristics():
    assert APKAnalyzer.check_filename_risk("Wedding_Invitation_Card.apk")["is_suspicious_name"] is True
    assert APKAnalyzer.check_filename_risk("Electricity_Bill_Update.apk")["is_suspicious_name"] is True
    assert APKAnalyzer.check_filename_risk("Challan_Payment.apk")["is_suspicious_name"] is True
    assert APKAnalyzer.check_filename_risk("Calculator.apk")["is_suspicious_name"] is False


def test_sample_apk_static_inspection():
    apk_path = "/home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai/samples/Wedding_Card_Invitation.apk"
    assert os.path.exists(apk_path)

    with open(apk_path, "rb") as f:
        data = f.read()

    result = APKAnalyzer.analyze_bytes(data, filename="Wedding_Card_Invitation.apk")
    assert result["is_malicious"] is True
    assert result["score"] >= 80

    meta = result["metadata"]
    assert meta.is_valid_zip is True
    assert meta.package_name == "com.clayrat.weddingstealer"

    # Verify dangerous permissions detected
    detected_perms = [p.permission for p in meta.dangerous_permissions]
    assert "android.permission.RECEIVE_SMS" in detected_perms
    assert "android.permission.READ_SMS" in detected_perms
    assert "android.permission.BIND_ACCESSIBILITY_SERVICE" in detected_perms

    # Verify classification
    assert "High-Threat Banking RAT" in meta.trojan_classification or "SMS Stealer" in meta.trojan_classification


def test_corrupt_or_empty_apk():
    result = APKAnalyzer.analyze_bytes(b"not_a_zip", filename="random_test.apk")
    assert result["metadata"].is_valid_zip is False
