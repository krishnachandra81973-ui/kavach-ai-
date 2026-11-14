# 🛡️ Kavach AI (कवच एआई)
### Cyber Scam, Digital Arrest & Malicious APK Shield for Indian Citizens

> Built for the **Google Startup Buildathon** and **Reppy Fellowship**, tailored specifically to protect Indian families, parents, and senior citizens from vernacular cyber extortion and banking trojans.

---

## 🌟 Key Capabilities

### 1. Detection Pillar 1 (Darr / Fear): Digital Arrest & Fake Police Notices
* **Indian Statutory Law (BNSS 2023 & CrPC):** Encodes legal reality that **no Indian police, CBI, ED, or court officer can ever arrest someone via video call** (Skype, WhatsApp, Zoom).
* **Clearance Account Trap Detection:** Flags illegal demands for money transfers to "RBI verification accounts" or "court clearance accounts".
* **Multi-Agency Stamp Forensics:** Detects fraudulent letterheads mixing unrelated agency logos (e.g., CBI + Interpol + Mumbai Police).

### 2. Detection Pillar 2 (Lalach / Greed): Free Recharge & Fake Cash Schemes
* **Telecom Scam Detection:** Pattern-matches fraudulent "3-Month (84-Day) Free 5G Recharge" offers falsely using PM Modi or telco brands (Jio, Airtel, Vi).
* **Domain & Gov TLD Audit:** Verifies URLs against official `.gov.in` and `.nic.in` registries, flagging suspicious TLDs (`.online`, `.xyz`, `.site`, `.top`).
* **Viral WhatsApp Trap Detection:** Detects coercive "forward to 5 groups / 10 friends to unlock reward" mechanisms.

### 3. Detection Pillar 3 (Malware): Malicious APK & Banking Trojan Detection
* **Deceptive Indian Lure Matching:** Detects WhatsApp malware droppers (`Wedding_Card.apk`, `Electricity_Bill_Update.apk`, `Challan_Payment.apk`).
* **Static Bytecode & Manifest Inspection:** Analyzes APK ZIP archives to detect banking trojan permissions (`RECEIVE_SMS`, `READ_SMS`, `BIND_ACCESSIBILITY_SERVICE`, `SYSTEM_ALERT_WINDOW`).
* **C2 Channel Detection:** Scans for embedded exfiltration endpoints (e.g., Telegram bot tokens `api.telegram.org/bot`).

### 4. Senior Citizen Friendly UX & Emergency SOS
* **Bilingual Speech Advisory:** Web Speech API audio in calm, reassuring Hindi or English so parents do not panic.
* **One-Tap WhatsApp Family SOS:** Pre-formats emergency advisory messages with the National Cyber Helpline (**1930**) to send to family members.
* **Dual-Engine Architecture:** Blends **Gemini 1.5 Flash** multimodal vision with an offline statutory heuristic engine that works 100% reliably even without an API key or internet.

---

## 📂 Project Structure

```
kavach-ai/
├── app/
│   ├── config.py             # Indian legal statutes, domains, and permission rules
│   ├── main.py               # FastAPI application and endpoints
│   ├── models/
│   │   └── schemas.py        # Typed Pydantic request/response schemas
│   └── engine/
│       ├── digital_arrest.py # Pillar 1: Digital Arrest & CrPC/BNSS rules
│       ├── greed_scams.py    # Pillar 2: Free recharge, domain audit & viral traps
│       ├── apk_analyzer.py   # Pillar 3: APK static ZIP & manifest inspector
│       ├── gemini_analyzer.py# Gemini 1.5 Flash multimodal integration
│       ├── speech_helper.py  # Spoken Hindi/English scripts & WhatsApp SOS
│       └── forensics.py      # Master forensic orchestrator
├── static/
│   ├── css/styles.css        # Responsive styling & threat meters
│   └── js/app.js             # Frontend controller & Web Speech API
├── templates/
│   └── index.html            # Clean, mobile-friendly interface
├── samples/                  # Realistic test payloads (text, APK, receipts)
│   ├── digital_arrest_notice.txt
│   ├── free_recharge_scam.txt
│   ├── legitimate_bill_notice.txt
│   └── Wedding_Card_Invitation.apk
├── tests/                    # 24 unit & integration tests
│   ├── test_digital_arrest.py
│   ├── test_greed_scams.py
│   ├── test_apk_analyzer.py
│   ├── test_edge_cases.py
│   └── test_api.py
├── docs/                     # Submission guides & architecture
│   ├── ARCHITECTURE.md
│   ├── STARTUP_BUILDATHON_SUBMISSION.md
│   └── REPPY_FELLOWSHIP_SUBMISSION.md
├── requirements.txt
├── pytest.ini
├── run.sh
└── README.md
```

---

## 🚀 Quick Start

### 1. Run Automated Test Suite
```bash
cd /home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai
.venv/bin/pytest -v
```
*(All 24 unit and integration tests run and pass in < 1 second).*

### 2. Start Web Application
```bash
./run.sh
```
Open **http://localhost:8000** in your browser.

### 3. Test Built-in Samples
Click on any of the preloaded sample buttons at the top of the dashboard:
* **Digital Arrest Warrant:** Observe the critical score, violated CrPC/BNSS statutes, and audio advisory.
* **84-Day Free Recharge:** Observe domain audit flags, viral forwarding warnings, and helpline recommendation.
* **Wedding Card APK:** Statically inspects the APK package, identifies declared SMS & accessibility permissions, and flags banking trojan risks.

---

## 📝 Submission Guides
* [Startup Buildathon Submission Guide](file:///home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai/docs/STARTUP_BUILDATHON_SUBMISSION.md)
* [Reppy Fellowship Submission Guide](file:///home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai/docs/REPPY_FELLOWSHIP_SUBMISSION.md)
* [Architecture Design Document](file:///home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai/docs/ARCHITECTURE.md)
