"""
Kavach AI - FastAPI Web Application
Cyber Scam, Digital Arrest & Malicious APK Shield
"""
import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.config import APP_NAME, APP_SUBTITLE, VERSION, LEGAL_STATUTES, CYBER_HELPLINE
from app.models.schemas import TextAnalysisRequest, AnalysisResponse
from app.engine.forensics import ForensicOrchestrator
from app.engine.gemini_analyzer import GeminiAnalyzer

# Initialize FastAPI application
app = FastAPI(
    title=APP_NAME,
    description=APP_SUBTITLE,
    version=VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Base directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# Ensure static & template folders exist
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Mount static files and Jinja2 templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


@app.get("/", response_class=HTMLResponse)
@app.get("/api", response_class=HTMLResponse)
async def serve_homepage(request: Request):
    """
    Renders the Kavach AI web interface.
    """
    gemini_ready = GeminiAnalyzer.is_configured()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "app_name": APP_NAME,
            "app_subtitle": APP_SUBTITLE,
            "version": VERSION,
            "gemini_ready": gemini_ready,
            "cyber_helpline": CYBER_HELPLINE,
        }
    )


@app.post("/api/analyze/text", response_model=AnalysisResponse)
@app.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text_endpoint(payload: TextAnalysisRequest):
    """
    Analyzes pasted text, SMS, WhatsApp forwards, or transcribed notices.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")

    result = await ForensicOrchestrator.analyze(
        text=payload.text,
        api_key=payload.api_key
    )
    return result


@app.post("/api/analyze/upload", response_model=AnalysisResponse)
@app.post("/analyze/upload", response_model=AnalysisResponse)
async def analyze_file_endpoint(
    file: UploadFile = File(...),
    text_prompt: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None)
):
    """
    Analyzes uploaded files: APK packages, notice screenshots, PDF/images, or receipts.
    """
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")

    result = await ForensicOrchestrator.analyze(
        text=text_prompt or file.filename,
        file_bytes=file_bytes,
        filename=file.filename,
        mime_type=file.content_type,
        api_key=api_key
    )
    return result


@app.get("/api/samples")
@app.get("/samples")
async def get_test_samples():
    """
    Provides pre-built realistic test samples for instant verification across all 3 pillars.
    """
    samples = [
        {
            "id": "sample_digital_arrest",
            "name": "Digital Arrest Fake CBI Notice",
            "category": "Pillar 1: Digital Arrest",
            "type": "text",
            "content": (
                "OFFICIAL WARRANT OF ARREST - CENTRAL BUREAU OF INVESTIGATION (CBI) & MUMBAI POLICE CYBER CELL.\n"
                "To: Citizen, We have intercepted an illegal parcel sent from Taiwan containing 140 grams MDMA and 5 fake passports in your name.\n"
                "A non-bailable warrant of arrest is issued under CrPC Section 41. You are placed under DIGITAL ARREST immediately.\n"
                "INSTRUCTIONS: Connect to Skype video call immediately for confidential interrogation. Keep camera on 24 hours. "
                "Do not inform family or legal counsel. To clear your name from money laundering charges, transfer refundable safety security deposit "
                "of Rs 2,50,000 to RBI Clearance Account within 2 hours. Failure will lead to immediate physical commando raid."
            )
        },
        {
            "id": "sample_free_recharge",
            "name": "Jio / PM Modi 84-Day Free Recharge",
            "category": "Pillar 2: Greed Scam",
            "type": "text",
            "content": (
                "🎉 PM Narendra Modi Free 5G Recharge Offer 2026! 🎉\n"
                "Government of India is giving 3 Months (84 Days) Free Recharge to all Jio, Airtel, and Vi users!\n"
                "Claim your free 5G unlimited recharge immediately before the offer expires tonight.\n"
                "Click here to activate: http://jio-free-5g-recharge.online/claim\n"
                "Note: Forward this message to 5 WhatsApp groups or 10 friends to unlock your free recharge voucher code instantly!"
            )
        },
        {
            "id": "sample_wedding_apk",
            "name": "Wedding Card Android Trojan Lure",
            "category": "Pillar 3: Malicious APK",
            "type": "apk_lure",
            "content": (
                "Namaste Uncle, our wedding card invitation and venue location photos are in this application. "
                "Please download and install Wedding_Card_Invitation.apk on your Android phone to view the wedding album and RSVP."
            ),
            "filename": "Wedding_Card_Invitation.apk"
        },
        {
            "id": "sample_legitimate",
            "name": "Legitimate Electricity Bill Payment Receipt",
            "category": "Safe / Legitimate",
            "type": "text",
            "content": (
                "Dear Consumer, your payment of Rs 1,420 for Consumer No 0098765432 has been received successfully on 12-Nov-2026. "
                "Transaction Reference: TXN9876543210. You can download the official tax invoice at https://delhipolice.gov.in or https://bsesdelhi.com. "
                "Thank you for using BSES Yamuna Power Limited."
            )
        }
    ]
    return {"samples": samples}


@app.get("/api/legal-rules")
@app.get("/legal-rules")
async def get_legal_rules():
    """
    Returns legal statutes and citizen rights under Indian law for awareness.
    """
    return {
        "statutes": LEGAL_STATUTES,
        "cyber_helpline": CYBER_HELPLINE,
        "cyber_portal": "https://cybercrime.gov.in",
        "golden_rules": [
            "1. Indian law DOES NOT permit arrest via video call (Skype, WhatsApp, Zoom).",
            "2. No police, CBI, ED, or judge ever asks you to transfer funds to any 'verification' bank account.",
            "3. Any demand to stay locked alone in your room on webcam is extortion, not lawful procedure.",
            "4. Legitimate government portals only use .gov.in or .nic.in domains.",
            "5. Never install APK files received on WhatsApp or SMS (e.g., Wedding Card, Electricity Bill)."
        ]
    }


@app.get("/api/health")
@app.get("/health")
async def health_check():
    """Health status endpoint."""
    return {
        "status": "healthy",
        "service": APP_NAME,
        "version": VERSION,
        "gemini_configured": GeminiAnalyzer.is_configured(),
        "fallback_engine": "Kavach Heuristic Engine Active",
    }


# ==============================================================================
# WHATSAPP CLOUD API / TWILIO WEBHOOK ENDPOINTS
# ==============================================================================
@app.get("/api/webhook/whatsapp")
@app.get("/webhook/whatsapp")
async def verify_whatsapp_webhook(request: Request):
    """
    Verification challenge handshake for Meta WhatsApp Cloud API Webhook.
    Meta sends GET request with hub.mode, hub.challenge, and hub.verify_token.
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge", "")

    expected_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "kavach_verify_token_2026")
    if mode == "subscribe" and token == expected_token:
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(content=challenge, status_code=200)

    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(content="Verification failed", status_code=403)


@app.post("/api/webhook/whatsapp")
@app.post("/webhook/whatsapp")
async def handle_whatsapp_webhook(request: Request):
    """
    Receives forwarded WhatsApp messages / images / documents from Meta Cloud API or Twilio.
    Instantly runs the Kavach forensic engine and returns a structured fraud audit response.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    extracted_text = ""
    sender_phone = ""

    # Parse standard Meta WhatsApp Cloud API payload format
    try:
        entries = body.get("entry", [])
        if entries:
            changes = entries[0].get("changes", [])
            if changes:
                value = changes[0].get("value", {})
                messages = value.get("messages", [])
                if messages:
                    msg = messages[0]
                    sender_phone = msg.get("from", "")
                    if msg.get("type") == "text":
                        extracted_text = msg.get("text", {}).get("body", "")
                    elif msg.get("type") == "image":
                        extracted_text = msg.get("image", {}).get("caption", "WhatsApp Image forwarded for forensic audit")
                    elif msg.get("type") == "document":
                        extracted_text = msg.get("document", {}).get("filename", "WhatsApp Document")
    except Exception:
        pass

    # Direct testing or Twilio payload fallback
    if not extracted_text:
        extracted_text = body.get("text") or body.get("message") or body.get("Body") or ""
        sender_phone = body.get("from") or body.get("From") or sender_phone

    if not extracted_text.strip():
        return JSONResponse(
            content={"status": "ignored", "reason": "No text content found in WhatsApp payload"},
            status_code=200
        )

    # Run Kavach AI Forensic Engine
    orchestrator = ForensicOrchestrator()
    result = await orchestrator.analyze(text=extracted_text)

    return JSONResponse(
        content={
            "status": "success",
            "sender": sender_phone,
            "threat_level": result.threat_level.value,
            "threat_score": result.threat_score,
            "category": result.category.value,
            "whatsapp_reply_message": result.whatsapp_sos_text,
            "immediate_actions": result.immediate_actions_hi,
            "helpline": CYBER_HELPLINE,
            "portal": "https://cybercrime.gov.in"
        },
        status_code=200
    )

