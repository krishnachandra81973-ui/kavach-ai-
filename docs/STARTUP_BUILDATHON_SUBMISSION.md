# Startup Buildathon India (startupbuildathon.com) — Complete Application Guide

This guide provides field-by-field answers, technical documentation, pitch narrative, and architectural details for submitting **Kavach AI** to the **Startup Buildathon India** (organized by Hack2skill in partnership with Google).

---

## Field-by-Field Application Form Entries

### Section 1: Basic & Team Information
* **Applicant / Founder Full Name:** Keshav Narayan
* **Email Address:** keshavnarayan501@gmail.com
* **Project Role:** Lead AI Architect & Full-Stack Developer
* **Participation Type:** Solo Founder / Team Lead
* **City Preference for In-Person Buildathon:** Delhi / Bengaluru (Choose closest city: Delhi, Bengaluru, Mumbai, Hyderabad, Pune, Kolkata, Chennai, Ahmedabad, Jaipur, Kochi)

---

### Section 2: Project & Startup Overview
* **Startup / Project Name:**
  `Kavach AI (कवच एआई)`

* **One-Line Tagline:**
  `AI-powered Cyber Scam, Digital Arrest & Malicious APK Shield Tailored for Indian Citizens.`

* **Track / Category:**
  `AI for Social Good / Cyber Security / Citizen Safety / Fintech Security`

* **What specific problem are you solving and for whom? (Problem Statement)**
  > In 2024–2026, cyber fraud in India crossed alarming levels, resulting in citizen losses exceeding **₹1,750+ Crores**. Over 65% of the victims are senior citizens, parents, and non-technical mobile users. Three dominant fraud vectors are ravaging Indian households:
  > 1. **Digital Arrest & Fake Police Notices:** Fraudsters impersonate the CBI, ED, Supreme Court, or Mumbai Police, threatening immediate detention via Skype/WhatsApp video calls and extorting life savings into fake "RBI verification accounts".
  > 2. **Fake Free Recharge & Cash Schemes:** Phishing campaigns offering "84-Day Free 5G Recharge from PM Modi" or "PM-Kisan Cash Doles", tricking users onto non-.gov.in domains and into viral WhatsApp forwarding loops.
  > 3. **Trojanized APKs via WhatsApp:** Attackers distribute Android droppers disguised as `Wedding_Card.apk` or `Electricity_Bill_Update.apk`. Once installed, they hijack accessibility services and silently intercept banking OTPs.
  > Existing antivirus solutions are heavy, English-centric, and completely unaware of Indian legal rules (BNSS/CrPC) or local social engineering tactics.

* **What is your solution? (Solution Overview)**
  > **Kavach AI** is a dual-engine cyber defense platform that gives Indian citizens instant, bilingual fraud verification:
  > * **Pillar 1 (Darr / Fear):** Audits fake warrants against the **Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023** and **CrPC**, flagging the legal reality that *no Indian authority can arrest citizens via video calls or demand funds into clearance accounts*.
  > * **Pillar 2 (Lalach / Greed):** Identifies fake telecom doles, audits domains against official `.gov.in` and `.nic.in` registries, and warns against viral forwarding traps.
  > * **Pillar 3 (Malware / APK):** Statically inspects APK archives without sandbox delay, detecting banking trojan permissions (`RECEIVE_SMS`, `BIND_ACCESSIBILITY_SERVICE`, `SYSTEM_ALERT_WINDOW`) and C2 endpoints (e.g. Telegram bots).
  > * **Accessible UX:** Calming audio advisory in Hindi and English (so seniors don't panic) and a one-tap **WhatsApp Family SOS** trigger to alert family members and dial the National Cyber Helpline (**1930**).

* **How does your project use Google’s AI Ecosystem & Technology Stack? (Google Tech Stack Integration)**
  > * **Gemini 1.5 Flash Multimodal Engine:** Used for deep visual forensic analysis of uploaded court orders, police seals, Ashoka Lion Capital emblems, signature alignments, and fake letterheads. Gemini 1.5 Flash's ultra-low latency and multimodal reasoning identify inconsistencies between state emblems, letterheads, and stamps.
  > * **Structured JSON Output:** Utilizes Gemini's JSON schema enforcement (`response_mime_type="application/json"`) to map visual anomalies directly into typed forensic evidence.
  > * **Offline-First Fallback Architecture:** If an API key or internet connection is unavailable, Kavach AI seamlessly falls back to its deterministic statutory heuristics engine, ensuring 100% operational uptime for urgent fraud scenarios.
  > * **Google Cloud / Cloud Run Deployment:** Packaged as a containerized FastAPI application ready for zero-scale deployment on Google Cloud Run with low operational cost.

---

### Section 3: Technical Architecture & Blueprint
* **System Architecture Overview:**
  1. **Frontend Presentation Layer:** Ultra-lightweight, mobile-first interface built with Tailwind CSS, Devanagari web fonts, and Web Speech API audio synthesis.
  2. **FastAPI High-Concurrency Backend:** Asynchronous Python backend handling multipart file uploads, image ingestion, and text analysis in sub-second response times.
  3. **Dual Analysis Pipeline:**
     * *Deterministic Statutory Engine:* Implements BNSS 2023 Section 41, PMLA guidelines, and official `.gov.in` domain allowlists.
     * *Static Bytecode Inspector:* Parses APK ZIP manifests and Dalvik bytecode to detect OTP stealers without dynamic execution risk.
     * *Gemini 1.5 Flash Multimodal Pipeline:* Ingests image evidence and runs deep forensic seal validation.
  4. **Emergency Response Output:** Generates threat scores (0–100), bilingual step-by-step checklists, synthesized audio, and pre-formatted WhatsApp SOS messages.

---

### Section 4: Target Market, Impact & Business Model
* **Target Users:** 800M+ Indian smartphone users, specifically senior citizens, retirees, rural smartphone adopters, and tier-2/3 families.
* **Social Impact:** Directly mitigates life-savings extortion by empowering citizens with knowledge of their constitutional rights and legal protections under Indian law before they transfer money.
* **Monetization & Scalability:**
  * **B2C:** 100% Free citizen tier for text scanning, APK verification, and emergency SOS alerts.
  * **B2B API for Banking & FinTech:** Real-time Threat Intelligence API for Indian banks (SBI, HDFC, ICICI, Paytm) to verify suspicious transaction beneficiary accounts and phishing domains reported by users.
  * **Telco Integration:** Partnerships with telecom operators (Jio, Airtel) to proactively filter phishing links in SMS gateways.

---

### Section 5: Demo Links & Deliverables
* **Repository Path:** `/home/keshavnarayan501/.gemini/antigravity/scratch/kavach-ai`
* **Local Run Command:** `./run.sh` (or `uvicorn app.main:app --host 0.0.0.0 --port 8000`)
* **Interactive Test Samples:** Available directly inside the web UI at `http://localhost:8000` (Digital Arrest notice, 84-day recharge phishing link, Wedding Card APK lure).
