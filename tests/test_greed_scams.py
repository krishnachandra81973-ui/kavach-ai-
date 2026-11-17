"""
Unit tests for Pillar 2: Greed Scam, Free Recharge & Phishing Analyzer
"""
import pytest
from app.engine.greed_scams import GreedScamAnalyzer


def test_free_recharge_scam():
    text = (
        "PM Narendra Modi giving 3 months free 5G recharge to all Jio users! "
        "Click http://jio-free-5g.online to activate now. "
        "Forward to 5 WhatsApp groups to unlock your free recharge."
    )
    result = GreedScamAnalyzer.analyze(text)
    assert result["is_greed_scam"] is True
    assert result["score"] >= 75
    assert len(result["matched_recharge"]) > 0
    assert len(result["matched_viral"]) > 0
    assert len(result["phishing_urls"]) > 0


def test_domain_auditing_phishing():
    # Mimics govt but on .online
    audit1 = GreedScamAnalyzer.audit_url("http://pmkisan-yojana.online/status")
    assert audit1["is_phishing"] is True
    assert audit1["is_official_gov"] is False

    # Mimics telecom on third party
    audit2 = GreedScamAnalyzer.audit_url("https://jio-recharge-free.xyz")
    assert audit2["is_phishing"] is True
    assert audit2["is_official_telco"] is False


def test_domain_auditing_legitimate():
    # Official Indian government portal
    audit_gov = GreedScamAnalyzer.audit_url("https://cybercrime.gov.in/report")
    assert audit_gov["is_phishing"] is False
    assert audit_gov["is_official_gov"] is True

    # Official telecom domain
    audit_telco = GreedScamAnalyzer.audit_url("https://www.jio.com/plans")
    assert audit_telco["is_phishing"] is False
    assert audit_telco["is_official_telco"] is True


def test_viral_forward_trap():
    text = "Share this with 10 friends on WhatsApp to win a free smartphone."
    result = GreedScamAnalyzer.analyze(text)
    assert len(result["matched_viral"]) > 0
    assert any("WhatsApp Forwarding" in ev.indicator for ev in result["evidence"])


def test_url_userinfo_and_port_parsing():
    """Verify URLs with embedded credentials and ports correctly extract hostname."""
    audit = GreedScamAnalyzer.audit_url("https://user:pass@jio-recharge.online:8080/claim")
    assert audit["domain"] == "jio-recharge.online"
    assert audit["is_phishing"] is True
    assert audit["mimics_telco"] is True
    assert audit["is_official_telco"] is False

