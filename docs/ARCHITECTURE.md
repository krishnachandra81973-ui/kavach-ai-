# Kavach AI — Technical Architecture & Forensic Design Document

## 1. Executive Summary & Mission
**Kavach AI** is an AI-powered Cyber Scam, Digital Arrest & Malicious APK Shield designed specifically for Indian citizens, parents, and senior citizens. In 2024–2026, Indian citizens lost over ₹1,750+ Crores to "Digital Arrest" extortion, fake police/CBI warrants, fake 84-day Jio free recharge viral loops, and banking trojans disguised as `Wedding_Card.apk` or `Electricity_Bill_Update.apk`.

Kavach AI provides immediate, deterministic statutory verification, deep visual forensic analysis (powered by **Gemini 1.5 Flash**), and static APK bytecode auditing—available online or completely offline via local heuristics.

---

## 2. The Three Detection Pillars

### Detection Pillar 1: Darr (Fear) — Digital Arrest & Fake Agency Notices
* **Indian Statutory Law Rules (BNSS 2023 & CrPC):**
  * **Rule 1 — No Arrest via Video Call:** Under the *Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023* (formerly CrPC Section 41), Indian law **does not authorize** any police, CBI, ED, NIA, or judicial officer to arrest, detain, or conduct trials over Skype, Zoom, or WhatsApp video calls.
  * **Rule 2 — Prohibition of Secret Clearance Account Transfers:** No agency, court, or the Reserve Bank of India ever demands fund transfers via RTGS/NEFT/IMPS/UPI to "verification accounts", "security deposits", or "clearance accounts" to prove innocence.
  * **Rule 3 — Protection of Liberty (Article 21):** Extorting a citizen to remain locked inside a room with their webcam running under threats of commando raids is unlawful confinement and extortion.
* **Forensic Mismatch Detection:** Detects forged letterheads combining conflicting emblems (e.g., CBI + Interpol + Mumbai Police on the same header), fake seals, and fabricated non-bailable warrants.

### Detection Pillar 2: Lalach (Greed) — Free Recharge & Fake Cash Doles
* **Fake Telecom Offers:** Flags fraudulent claims offering "3-Month (84-Day) Free 5G Recharge" from PM Narendra Modi or telecom operators (Jio, Airtel, Vi).
* **Domain & Gov TLD Verification:**
  * Legitimate Government of India portals **must end in `.gov.in` or `.nic.in`**.
  * Flagged phishing extensions: `.online`, `.xyz`, `.site`, `.top`, `.click`, `.buzz`, `.club`, etc.
  * Official telecom domains allowlist: `jio.com`, `airtel.in`, `myvi.in`, `bsnl.co.in`.
* **Viral WhatsApp Trap Detection:** Detects viral forwarding demands such as *"Forward this message to 5 WhatsApp groups or 10 friends to unlock your reward"*—a classic social-engineering data-harvesting lure.

### Detection Pillar 3: Malware (Apk) — Banking Trojans & Droppers
* **Deceptive Indian Social Engineering Lures:** Static pattern matching for filenames targeting Indian citizens via WhatsApp (`Wedding_Card.apk`, `Shaadi_Nimantran.apk`, `Electricity_Bill_Update.apk`, `Challan_Payment.apk`, `Bank_KYC.apk`).
* **Static Bytecode & Manifest Inspection:**
  * Parses APK ZIP structures without requiring execution in a dynamic sandbox.
  * Extracts declared Android permissions and maps them against high-risk banking trojan capabilities:
    * `RECEIVE_SMS` & `READ_SMS`: Intercepting 2-Factor Authentication Bank OTPs.
    * `BIND_ACCESSIBILITY_SERVICE`: Keystroke logging, automated screen clicks, and stealth permission auto-granting.
    * `SYSTEM_ALERT_WINDOW`: Drawing deceptive overlay phishing screens over genuine banking apps.
    * `REQUEST_INSTALL_PACKAGES`: Stealth background downloading of secondary payloads.
  * Identifies embedded Command & Control (C2) vectors (e.g., hardcoded Telegram Bot endpoints `api.telegram.org/bot` used by ClayRAT).

---

## 3. Dual-Engine Architecture (Gemini 1.5 Flash + Kavach Statutory Engine)

```
                            [ User Input ]
                   (Text / Screenshot / Notice / APK)
                                   |
                  +----------------+----------------+
                  |                                 |
        [ File Inspection ]                 [ Text Analysis ]
                  |                                 |
         +--------+--------+               +--------+--------+
         |                 |               |                 |
     [.apk File]     [Image / Doc]    [Pillar 1: Darr] [Pillar 2: Lalach]
   APK Static Zip     Gemini Vision   BNSS/CrPC Rules   Domain Audit
    Manifest Scan     Stamps/Emblems  Video Arrest Ext. Free Recharge
   Perms & Bytecode        |               |                 |
         |                 |               +--------+--------+
         +--------+--------+                        |
                  |                                 |
                  +----------------+----------------+
                                   |
                     [ Master Forensic Orchestrator ]
                     - Threat Level: CRITICAL / SUSP/ SAFE
                     - Threat Score: 0 to 100
                     - Legal Violations & Penal Code
                     - Dangerous Permissions & C2
                                   |
                  +----------------+----------------+
                  |                                 |
        [ Speech Advisory ]               [ WhatsApp Family SOS ]
       Calming Hindi + English            One-Tap Forward Message
       Web Speech Synthesis               Dial 1930 Helpline CTA
```

### Fallback & Offline Resilience
* When `GEMINI_API_KEY` is not present, Kavach AI activates the **Kavach Statutory & Static Heuristic Engine**, which executes at zero latency and 100% determinism.
* When `GEMINI_API_KEY` is present, it operates in **Hybrid Mode**, blending multimodal vision analysis (for OCR, stamp alignment, visual seal artifacts) with statutory legal rules.

---

## 4. Accessibility & Senior-Citizen UX
1. **Calming Audio Playback:** Senior citizens often panic when confronted with fake police notices. The bilingual speech synthesizer speaks in calm, reassuring Hindi or English:
   > *"सावधान! यह एक फर्जी पुलिस नोटिस और डिजिटल अरेस्ट की धोखाधड़ी है। भारतीय कानून में वीडियो कॉल पर कोई गिरफ्तारी नहीं होती है। किसी को पैसे न भेजें और तुरंत 1930 पर कॉल करें।"*
2. **One-Tap WhatsApp Family SOS:** Automatically generates a formatted WhatsApp advisory containing the detected fraud category, evidence, and national cyber helpline (1930), ready to be shared with family members.
3. **High-Contrast Threat Meter:** Immediate visual clarity (Green Safe, Amber Suspicious, Crimson Critical) with clear step-by-step instructions.
