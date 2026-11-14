# Reppy Fellowship (fellowship.tryreppy.com) — Project Submission Guide

This document contains the complete project submission details, engineering architecture, and challenge deliverables for **Kavach AI** for the **Reppy Fellowship Project Submission** portal (`https://fellowship.tryreppy.com/` / `https://fellowship.tryreppy.com/submit-project`).

---

## 1. Project Information
* **Project Title:** Kavach AI (कवच एआई) — National Cyber Scam, Digital Arrest & Malicious APK Shield
* **Primary Track:** AI Engineering / Cyber Defense / Public Good Tech / Applied GenAI
* **Target Audience:** Indian citizens, senior citizens, parents, and smartphone users vulnerable to vernacular social engineering.
* **Core Technologies:** Python 3.13, FastAPI, Gemini 1.5 Flash (google-genai SDK), Static Bytecode Zip Inspector, Web Speech API, Tailwind CSS, Pytest.

---

## 2. Executive Pitch & Mission Statement
Indian families lose millions of rupees every week because scammers exploit **fear (Darr)** and **greed (Lalach)** through sophisticated vernacular scams:
1. **Digital Arrest Scams:** Scammers pose as police or CBI officers on video calls, falsely claiming contraband was found in an illegal parcel and coercing victims to transfer money to a "Reserve Bank of India clearance account".
2. **Fake Free Recharge Traps:** Viral messages offering "PM Modi 84-Day Free 5G Recharge" trap users into forwarding messages to 5 WhatsApp groups and entering credentials on phishing websites.
3. **Malicious Banking APKs:** WhatsApp messages disguised as wedding invitations (`Wedding_Card.apk`) or utility updates (`Electricity_Bill.apk`) secretly steal banking OTPs and hijack phone screens.

**Kavach AI** stops these attacks instantly by combining **Indian statutory legal rules (BNSS / CrPC)**, **Gemini 1.5 Flash multimodal forensics**, and **static APK permission inspection** with a calming bilingual audio interface and one-tap family SOS alert.

---

## 3. Challenge Deliverables & Implementation Details

### Deliverable 1: Detection Pillar 1 (Darr / Fear — Digital Arrest)
* **Statutory Rule Engine:** Encodes Section 41 of the *Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023* / CrPC into deterministic rules.
* **Ground Truth Validation:**
  * Indian law **prohibits arrests via video call (Skype/WhatsApp/Zoom)**.
  * No police, CBI, ED, or court officer is legally permitted to ask citizens for money transfers to "clearance accounts" or "RBI verification accounts".
  * Demands for private isolation under camera surveillance violate Article 21 (Right to Personal Liberty).
* **Multi-Agency Stamp Forensics:** Detects letterheads that inappropriately combine symbols (e.g., mixing CBI, Interpol, and state police seals on one fraudulent warrant).

### Deliverable 2: Detection Pillar 2 (Lalach / Greed — Free Recharge & Phishing)
* **Telecom Scam Detection:** Pattern-matches fake 84-day and 1-year free recharge offers falsely attributed to telecom operators (Jio, Airtel, Vi) or the Prime Minister.
* **Domain Verification:** Audits URLs against official `.gov.in` and `.nic.in` registries, instantly flagging disposable phishing extensions (`.online`, `.xyz`, `.site`, `.top`, `.click`, `.buzz`).
* **Viral Trap Identification:** Flags coercion to forward messages to 5 WhatsApp groups or 10 friends to unlock rewards.

### Deliverable 3: Detection Pillar 3 (Malware — Malicious APK Detection)
* **Static APK Analysis:** Inspects APK ZIP archives without requiring risky sandbox execution.
* **Manifest & Permission Scans:** Extracts declared permissions and flags high-risk banking trojan combinations:
  * `RECEIVE_SMS` + `READ_SMS`: Banking OTP theft.
  * `BIND_ACCESSIBILITY_SERVICE`: Keystroke logging and screen takeover.
  * `SYSTEM_ALERT_WINDOW`: Fake overlay login screens over banking apps.
* **Command & Control (C2) Extraction:** Detects embedded exfiltration endpoints (such as hardcoded Telegram Bot tokens `api.telegram.org/bot` used in ClayRAT).

### Deliverable 4: Multimodal Engine & Offline Fallback
* **Gemini 1.5 Flash:** Deep multimodal analysis for document stamps, visual seal alignment, and OCR anomaly detection.
* **100% Offline Fallback:** When no API key is configured, Kavach AI activates the local statutory heuristics engine with zero latency, ensuring uninterrupted citizen protection.

### Deliverable 5: Senior-Citizen Friendly UX & Audio Guidance
* **Bilingual Speech Advisory:** Built-in Web Speech API audio in calm, reassuring Hindi and English so non-tech users don't panic.
* **WhatsApp Family SOS Alert:** Automatically generates a one-click WhatsApp message warning family members and citing the National Cyber Helpline (**1930**).

---

## 4. Verification & Testing Record
* **Automated Test Suite:** 24 comprehensive unit and integration tests passing with 100% success rate.
* **Coverage:**
  * `test_digital_arrest.py`: Digital arrest warrants, video extortion, false-positive prevention on legitimate police advisories.
  * `test_greed_scams.py`: Free recharge scams, phishing domains, legitimate gov/telco allowlists, viral forward traps.
  * `test_apk_analyzer.py`: Social engineering lures, static APK inspection, permission extraction, C2 detection.
  * `test_api.py`: FastAPI endpoints (`/`, `/api/health`, `/api/samples`, `/api/legal-rules`, `/api/analyze/text`, `/api/analyze/upload`).
  * `test_edge_cases.py`: Hinglish messages, Devanagari Hindi text, legitimate promos, corrupt APK inputs, SOS formatting.

---

## 5. How to Run & Verify Locally
1. **Navigate to the Project Directory:**
   ```bash
   cd /home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai
   ```
2. **Execute Automated Tests:**
   ```bash
   .venv/bin/pytest -v
   ```
   *(All 24 tests execute in ~0.6 seconds).*
3. **Start the Web Application:**
   ```bash
   ./run.sh
   # Open http://localhost:8000 in your browser
   ```
4. **Try the Interactive Samples:**
   Click the buttons on the dashboard to test the Digital Arrest Warrant, 84-Day Free Recharge scam, and Wedding Card APK lure.
