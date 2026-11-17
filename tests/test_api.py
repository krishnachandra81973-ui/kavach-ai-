"""
Integration tests for Kavach AI FastAPI Endpoints
"""
import os
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
    apk_path = os.path.join(os.path.dirname(__file__), "..", "samples", "Wedding_Card_Invitation.apk")
    assert os.path.exists(apk_path)
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


def test_download_sample_apk_endpoint():
    response = client.get("/api/samples/Wedding_Card_Invitation.apk")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.android.package-archive"
    assert len(response.content) > 0


def test_whatsapp_webhook_verification():
    # Successful challenge handshake
    response = client.get(
        "/api/webhook/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "kavach_verify_token_2026",
            "hub.challenge": "1158201444"
        }
    )
    assert response.status_code == 200
    assert response.text == "1158201444"

    # Failed handshake with invalid token
    bad_response = client.get(
        "/api/webhook/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong_token",
            "hub.challenge": "1158201444"
        }
    )
    assert bad_response.status_code == 403


def test_whatsapp_webhook_incoming_message():
    # Simulate Meta WhatsApp Cloud API incoming message
    payload = {
        "entry": [{
            "changes": [{
                "value": {
                    "messages": [{
                        "from": "919876543210",
                        "type": "text",
                        "text": {
                            "body": "CBI Cyber Cell Delhi: You are in Digital Arrest. Join Skype video call immediately."
                        }
                    }]
                }
            }]
        }]
    }
    response = client.post("/api/webhook/whatsapp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["threat_level"] in ["CRITICAL", "SUSPICIOUS"]
    assert data["category"] == "DIGITAL_ARREST"
    assert "1930" in data["whatsapp_reply_message"]
    assert "evidence_list" in data
    assert "legal_rule_violations" in data
    assert "summary_en" in data


def test_whatsapp_webhook_simulator_direct_json():
    # Direct simulator testing format
    payload = {
        "message": "PM Modi 84-day free 5G recharge offer! Click http://free-5g.online to claim. Forward to 5 groups.",
        "from": "+919876543210"
    }
    response = client.post("/api/webhook/whatsapp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["category"] == "GREED_SCAM"
    assert data["threat_score"] > 0
    assert "whatsapp_reply_message" in data
    assert len(data["evidence_list"]) > 0


def test_whatsapp_webhook_document_apk_attachment():
    # Meta WhatsApp Cloud API document attachment payload
    payload = {
        "entry": [{
            "changes": [{
                "value": {
                    "messages": [{
                        "from": "919876543210",
                        "type": "document",
                        "document": {
                            "filename": "Wedding_Card_Invitation.apk",
                            "caption": "Namaste, our wedding card invitation"
                        }
                    }]
                }
            }]
        }]
    }
    response = client.post("/api/webhook/whatsapp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["category"] == "MALICIOUS_APK"
    assert data["threat_level"] in ["CRITICAL", "SUSPICIOUS"]
    assert data["threat_score"] >= 50
    assert data["apk_analysis"] is not None


def test_whatsapp_webhook_simulator_apk_filename_payload():
    # Direct simulator testing format with filename
    payload = {
        "filename": "Electricity_Bill_Update.apk",
        "message": "Dear customer your power will be disconnected update your bill by installing apk",
        "from": "+919988776655"
    }
    response = client.post("/api/webhook/whatsapp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["category"] == "MALICIOUS_APK"
    assert data["threat_level"] in ["CRITICAL", "SUSPICIOUS"]
    assert data["threat_score"] >= 50
    assert data["apk_analysis"] is not None


def test_whatsapp_webhook_empty_payload():
    response = client.post("/api/webhook/whatsapp", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ignored"


