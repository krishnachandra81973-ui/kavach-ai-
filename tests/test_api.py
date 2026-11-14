"""
Integration tests for Kavach AI FastAPI Endpoints
"""
import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_homepage_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Kavach AI" in response.text
    assert "Digital Arrest" in response.text


def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Kavach AI"


def test_samples_endpoint():
    response = client.get("/api/samples")
    assert response.status_code == 200
    data = response.json()
    assert "samples" in data
    assert len(data["samples"]) >= 4


def test_legal_rules_endpoint():
    response = client.get("/api/legal-rules")
    assert response.status_code == 200
    data = response.json()
    assert "statutes" in data
    assert "golden_rules" in data
    assert data["cyber_helpline"] == "1930"


def test_analyze_text_digital_arrest():
    payload = {
        "text": (
            "URGENT: Central Bureau of Investigation CBI Cyber Cell notice. "
            "You are under DIGITAL ARREST for money laundering. Connect Skype video call "
            "with camera on immediately and transfer Rs 1,50,000 to RBI verification account."
        )
    }
    response = client.post("/api/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_level"] == "CRITICAL"
    assert data["category"] == "DIGITAL_ARREST"
    assert data["threat_score"] >= 75
    assert len(data["legal_rule_violations"]) > 0
    assert "1930" in data["whatsapp_sos_text"]


def test_analyze_text_free_recharge():
    payload = {
        "text": (
            "PM Modi free 84-day 5G recharge offer for all users! "
            "Visit http://free-5g-jio.online to activate now. "
            "Forward this message to 5 WhatsApp groups to claim."
        )
    }
    response = client.post("/api/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_level"] in ["CRITICAL", "SUSPICIOUS"]
    assert data["category"] == "GREED_SCAM"
    assert len(data["evidence_list"]) > 0


def test_analyze_text_empty_validation_error():
    response = client.post("/api/analyze/text", json={"text": "   "})
    assert response.status_code == 400


def test_analyze_file_upload_apk():
    apk_path = "/home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai/samples/Wedding_Card_Invitation.apk"
    with open(apk_path, "rb") as f:
        response = client.post(
            "/api/analyze/upload",
            files={"file": ("Wedding_Card_Invitation.apk", f, "application/vnd.android.package-archive")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["threat_level"] == "CRITICAL"
    assert data["category"] == "MALICIOUS_APK"
    assert data["apk_analysis"] is not None
    assert len(data["apk_analysis"]["dangerous_permissions"]) > 0
