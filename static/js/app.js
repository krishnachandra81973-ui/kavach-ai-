/**
 * Kavach AI - Production SaaS Frontend Controller
 * Cyber Scam, Digital Arrest & Malicious APK Shield
 * Full Bilingual (EN / हिन्दी) Translation Engine
 * Executive Obsidian Dark & Alabaster Light Modes
 * Interactive Validating Dropzone, Audio Suite & WhatsApp Simulator
 */

// Global State
let currentAnalysis = null;
let currentLanguage = 'en'; // 'en' or 'hi'
let selectedFile = null;
let currentSpeechUtterance = null;
let isAudioPlaying = false;
let audioDuration = 28; // Standard estimated duration in seconds
let audioCurrentSec = 0;
let audioTimer = null;
let tickerIndex = 0;

// Threat Telemetry Bulletins for Live Ticker
const THREAT_BULLETINS = [
  "🚨 [CBI EXTORTION] Maharashtra Cyber Cell warns: Fraudsters using fake arrest warrants on WhatsApp video calls.",
  "📱 [BANKING TROJAN] Malicious Wedding_Card.apk spreading via WhatsApp groups stealing bank OTPs (ClayRAT).",
  "⚡ [ELECTRICITY BILL] Fake SMS threatening power cutoff: Scammers prompting victims to install APKs.",
  "⚖️ [BNSS §41 STATUTE] Indian Supreme Court & BNSS 2023: Police NEVER conduct video call arrests or demand RBI transfers.",
  "🎁 [PHISHING ALERT] Fake PM Modi 84-day free 5G recharge traps harvesting citizen phone numbers.",
  "📞 [NATIONAL HELPLINE] Dial 1930 immediately or visit cybercrime.gov.in to report cyber financial extortion."
];

// Complete Bilingual Dictionary
const TRANSLATIONS = {
  en: {
    tagline: "National Cyber Scam, Digital Arrest & Malicious APK Shield",
    badge_national: "Built for Indian Citizens, Parents & Senior Citizens",
    hero_title: 'Don\'t Panic, Verify. Stop <span class="text-rose-600 dark:text-rose-400 underline decoration-rose-400/40 decoration-wavy">Digital Arrests</span> & WhatsApp Frauds.',
    hero_desc: "Instant forensic verification of fake police/CBI warrants under Indian statutory law (<strong>BNSS 2023 / CrPC</strong>), detection of fake <strong>5G recharge doles</strong>, and static security inspection of <strong>Wedding Card / Utility APK Trojans</strong> before they steal your bank OTPs.",
    ticker_badge: "LIVE THREAT TICKER",
    stat_losses: "₹1,750+ Cr",
    stat_losses_title: "Extorted in India (2024–26)",
    stat_losses_sub: "Reported citizen losses",
    stat_law: "BNSS §41",
    stat_law_title: "Indian Law Encoded",
    stat_law_sub: "Prohibits video-call arrests",
    stat_engine: "< 0.2s",
    stat_engine_title: "Instant Heuristic Engine",
    stat_engine_sub: "100% offline-ready fallback",
    stat_free: "100% FREE",
    stat_free_title: "Citizen Defense Shield",
    stat_free_sub: "Public good initiative",
    samples_heading: "Try Real-Life Scam Samples:",
    samples_sub: "Click any card to auto-load and verify live",
    sample_1_btn: "Digital Arrest Notice",
    sample_1_tag: "CBI FAKE",
    sample_2_btn: "84-Day Free 5G Offer",
    sample_2_tag: "PHISHING",
    sample_3_btn: "Wedding Card .APK",
    sample_3_tag: "MALWARE",
    sample_4_btn: "BSES Bill Payment",
    sample_4_tag: "SAFE",
    workbench_title: "Investigate Threat Evidence",
    workbench_sub: "Pillar 1 (Darr), Pillar 2 (Lalach) & Pillar 3 (APK)",
    tab_text: "Text / Notice",
    tab_file: "Upload / APK",
    tab_sim: "WhatsApp Sim",
    input_label: "Enter Message or Notice Text:",
    clear_btn: "Clear",
    placeholder_text: "Paste WhatsApp forward, SMS, threatening call transcript, or fake court notice text here...",
    upload_label: "Upload Suspicious File (.APK, Screenshot, Notice PDF):",
    upload_drop_title: "Click to select file or drag & drop here",
    upload_drop_sub: "Supports .apk (Trojan scan), .png, .jpg (Screenshots/Warrants), and .pdf (Up to 30MB)",
    gemini_settings: "Gemini 1.5 Flash Settings",
    gemini_optional: "Optional",
    gemini_sub: "🛡️ <strong>Zero-Lag Offline Assurance:</strong> Even without an API key, Kavach AI's local heuristic engine performs 100% full statutory and APK forensic scans with sub-second response times.",
    scan_btn: "Run Kavach Forensic Scan",
    scanning_btn: "Scanning Cyber & Legal Signatures...",
    legal_card_title: "Indian Citizen Statutory Shields (BNSS & CrPC)",
    legal_rule_1: "<strong>No Video Call Arrests:</strong> Indian police/CBI never arrest or interrogate citizens over Skype, Zoom, or WhatsApp.",
    legal_rule_2: "<strong>No RBI Clearance Transfers:</strong> No official agency asks for deposits to secret verification bank accounts.",
    legal_rule_3: "<strong>Report Fraud Instantly:</strong> Dial <strong>1930</strong> or register complaint at <strong>cybercrime.gov.in</strong>.",
    placeholder_title: "Awaiting Threat Evidence",
    placeholder_desc: "Paste suspicious message text on the left, upload a file, or test via WhatsApp Simulator to observe visual threat scoring, statutory legal checks, and bilingual audio warnings.",
    placeholder_badge: "⚡ Ready for Instant Statutory Audit",
    audio_btn: "Play Calming Voice Advisory",
    audio_pause: "Pause Advisory",
    audio_stop: "⏹ Stop",
    btn_copy_report: "Copy Report",
    btn_whatsapp_sos: "WhatsApp SOS",
    title_immediate_actions: "Immediate Recommended Steps / तुरंत क्या करें:",
    title_forensic_evidence: "Forensic Indicators & Threat Patterns Detected:",
    title_legal_violations: "Indian Statutory Law Violations (BNSS 2023 / CrPC):",
    title_apk_audit: "APK Static Inspection & Trojan Permission Audit:",
    footer_text: "<strong>Kavach AI</strong> — Open-source Cyber Shield for Indian Citizens. Built for Google Buildathon & Hackathons."
  },
  hi: {
    tagline: "राष्ट्रीय साइबर फ्रॉड, डिजिटल अरेस्ट व खतरनाक APK सुरक्षा कवच",
    badge_national: "भारतीय नागरिकों, अभिभावकों और बुजुर्गों की सुरक्षा हेतु",
    hero_title: 'घबराएं नहीं, जांचें। <span class="text-rose-600 dark:text-rose-400 underline decoration-rose-400/40 decoration-wavy">डिजिटल अरेस्ट</span> और व्हाट्सएप फ्रॉड से बचें।',
    hero_desc: "भारतीय कानून (<strong>BNSS 2023 / CrPC</strong>) के तहत फर्जी पुलिस/CBI वारंट की कानूनी जांच, फर्जी <strong>5G फ्री रिचार्ज</strong> का पर्दाफाश, और शादी के कार्ड वाली खतरनाक <strong>APK फाइलों</strong> से बैंक OTP की चोरी से संपूर्ण सुरक्षा।",
    ticker_badge: "लाइव साइबर अलर्ट",
    stat_losses: "₹1,750+ करोड़",
    stat_losses_title: "भारत में ठगी (2024–26)",
    stat_losses_sub: "दर्ज की गई साइबर धोखाधड़ी",
    stat_law: "BNSS §41",
    stat_law_title: "भारतीय कानून सुरक्षित",
    stat_law_sub: "वीडियो कॉल पर गिरफ्तारी अवैध",
    stat_engine: "< 0.2s",
    stat_engine_title: "सुपरफास्ट जांच इंजन",
    stat_engine_sub: "100% ऑफलाइन कार्य प्रणाली",
    stat_free: "100% मुफ्त",
    stat_free_title: "नागरिक सुरक्षा कवच",
    stat_free_sub: "जनहित में पूर्णतः निशुल्क",
    samples_heading: "असली फ्रॉड के उदाहरण जांचें:",
    samples_sub: "किसी भी कार्ड पर क्लिक करके तुरंत लाइव जांच देखें",
    sample_1_btn: "फर्जी डिजिटल अरेस्ट नोटिस",
    sample_1_tag: "फर्जी CBI",
    sample_2_btn: "84 दिन का फ्री 5G ऑफर",
    sample_2_tag: "फिशिंग",
    sample_3_btn: "शादी का कार्ड .APK",
    sample_3_tag: "वायरस/मालवेयर",
    sample_4_btn: "बिजली बिल भुगतान रसीद",
    sample_4_tag: "सुरक्षित",
    workbench_title: "संदिग्ध संदेश या नोटिस की जांच करें",
    workbench_sub: "डर (Pillar 1), लालच (Pillar 2) और APK वायरस (Pillar 3)",
    tab_text: "टेक्स्ट / नोटिस",
    tab_file: "अपलोड / APK",
    tab_sim: "व्हाट्सएप सिम",
    input_label: "व्हाट्सएप मैसेज या नोटिस का टेक्स्ट डालें:",
    clear_btn: "साफ करें",
    placeholder_text: "व्हाट्सएप पर आया धमकी भरा मैसेज, फर्जी पुलिस नोटिस, या फ्री रिचार्ज का लिंक यहाँ पेस्ट करें...",
    upload_label: "संदिग्ध फाइल अपलोड करें (.APK, स्क्रीनशॉट, नोटिस PDF):",
    upload_drop_title: "फाइल चुनने के लिए क्लिक करें या यहाँ छोड़ें",
    upload_drop_sub: ".apk (वायरस जांच), .png, .jpg (स्क्रीनशॉट/वारंट), और .pdf (30MB तक) समर्थित हैं",
    gemini_settings: "Google Gemini 1.5 Flash सेटिंग्स",
    gemini_optional: "वैकल्पिक",
    gemini_sub: "🛡️ <strong>ऑफलाइन सुविधा:</strong> बिना किसी API key के भी कवच AI का लोकल इंजन 100% कानूनी और वायरस जांच तुरंत करता है।",
    scan_btn: "कवच फॉरेंसिक जांच शुरू करें",
    scanning_btn: "कानूनी व साइबर जांच जारी है...",
    legal_card_title: "भारतीय नागरिक कानूनी अधिकार (BNSS और CrPC)",
    legal_rule_1: "<strong>वीडियो कॉल पर कोई गिरफ्तारी नहीं:</strong> भारतीय पुलिस या CBI कभी भी Skype, Zoom या WhatsApp पर गिरफ्तारी नहीं करती।",
    legal_rule_2: "<strong>कोई सरकारी बैंक खाता ट्रांसफर नहीं:</strong> कोई भी असली एजेंसी जांच के नाम पर किसी खाते में पैसे नहीं मांगती।",
    legal_rule_3: "<strong>तुरंत शिकायत दर्ज करें:</strong> साइबर हेल्पलाइन नंबर <strong>1930</strong> डायल करें या <strong>cybercrime.gov.in</strong> पर जाएं।",
    placeholder_title: "जांच हेतु तैयार",
    placeholder_desc: "बाईं ओर संदिग्ध मैसेज पेस्ट करें, फाइल अपलोड करें, या व्हाट्सएप सिम्युलेटर चलाकर लाइव कानूनी जांच, स्कोर और हिन्दी ऑडियो चेतावनी देखें।",
    placeholder_badge: "⚡ तत्काल कानूनी जांच हेतु तत्पर",
    audio_btn: "हिन्दी में ऑडियो सलाह सुनें",
    audio_pause: "ऑडियो रोकें",
    audio_stop: "⏹ बंद करें",
    btn_copy_report: "रिपोर्ट कॉपी करें",
    btn_whatsapp_sos: "व्हाट्सएप SOS भेजें",
    title_immediate_actions: "तुरंत क्या करें / जरूरी कदम:",
    title_forensic_evidence: "जांच में पकड़े गए फर्जीवाड़े के संकेत:",
    title_legal_violations: "तोड़े गए भारतीय कानून (BNSS 2023 / CrPC):",
    title_apk_audit: "APK फाइल और खतरनाक परमिशन की जांच:",
    footer_text: "<strong>कवच एआई</strong> — भारतीय नागरिकों हेतु निशुल्क साइबर सुरक्षा कवच। गूगल बिल्डथॉन एवं हैकाथॉन हेतु निर्मित।"
  }
};

// DOM Elements
const textInputContainer = document.getElementById('textInputContainer');
const fileInputContainer = document.getElementById('fileInputContainer');
const whatsappSimContainer = document.getElementById('whatsappSimContainer');
const tabTextBtn = document.getElementById('tabTextBtn');
const tabFileBtn = document.getElementById('tabFileBtn');
const tabSimBtn = document.getElementById('tabSimBtn');

const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const dropZoneError = document.getElementById('dropZoneError');
const dropZoneErrorMsg = document.getElementById('dropZoneErrorMsg');
const fileSelectedDisplay = document.getElementById('fileSelectedDisplay');
const fileTypeIcon = document.getElementById('fileTypeIcon');
const fileNameSpan = document.getElementById('fileNameSpan');
const fileSizeSpan = document.getElementById('fileSizeSpan');
const clearFileBtn = document.getElementById('clearFileBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const charCountSpan = document.getElementById('charCountSpan');
const loadSampleApkBtn = document.getElementById('loadSampleApkBtn');

const scanProgressContainer = document.getElementById('scanProgressContainer');
const scanProgressBar = document.getElementById('scanProgressBar');
const scanProgressText = document.getElementById('scanProgressText');
const scanProgressPercent = document.getElementById('scanProgressPercent');
const scanProgressStep = document.getElementById('scanProgressStep');

const analyzeBtn = document.getElementById('analyzeBtn');
const scanBtnText = document.getElementById('scanBtnText');
const scanSpinner = document.getElementById('scanSpinner');
const customApiKey = document.getElementById('customApiKey');

const resultPlaceholder = document.getElementById('resultPlaceholder');
const resultCard = document.getElementById('resultCard');
const verdictBanner = document.getElementById('verdictBanner');
const threatLevelBadge = document.getElementById('threatLevelBadge');
const verdictTitle = document.getElementById('verdictTitle');
const engineBadge = document.getElementById('engineBadge');
const threatScoreDisplay = document.getElementById('threatScoreDisplay');
const gaugeCircle = document.getElementById('gaugeCircle');
const summaryEn = document.getElementById('summaryEn');
const summaryHi = document.getElementById('summaryHi');
const actionsEnList = document.getElementById('actionsEnList');
const actionsHiList = document.getElementById('actionsHiList');
const evidenceList = document.getElementById('evidenceList');
const legalSection = document.getElementById('legalSection');
const legalRulesList = document.getElementById('legalRulesList');
const apkSection = document.getElementById('apkSection');
const apkMetadataDetails = document.getElementById('apkMetadataDetails');

const whatsappSosBtn = document.getElementById('whatsappSosBtn');
const playAudioBtn = document.getElementById('playAudioBtn');
const stopAudioBtn = document.getElementById('stopAudioBtn');
const audioIcon = document.getElementById('audioIcon');
const audioBtnText = document.getElementById('audioBtnText');
const audioWaveform = document.getElementById('audioWaveform');
const audioScrubberRow = document.getElementById('audioScrubberRow');
const audioScrubber = document.getElementById('audioScrubber');
const audioCurrentTime = document.getElementById('audioCurrentTime');
const audioTotalTime = document.getElementById('audioTotalTime');
const transcriptToggleBtn = document.getElementById('transcriptToggleBtn');
const transcriptCard = document.getElementById('transcriptCard');
const transcriptText = document.getElementById('transcriptText');

const copyReportBtn = document.getElementById('copyReportBtn');
const copyReportIcon = document.getElementById('copyReportIcon');
const copyReportText = document.getElementById('copyReportText');
const resetScanBtn = document.getElementById('resetScanBtn');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const langEnBtn = document.getElementById('langEnBtn');
const langHiBtn = document.getElementById('langHiBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
const threatTickerText = document.getElementById('threatTickerText');

// WhatsApp Simulator DOM
const simInput = document.getElementById('simInput');
const simSendBtn = document.getElementById('simSendBtn');
const simChatHistory = document.getElementById('simChatHistory');
const simTypingIndicator = document.getElementById('simTypingIndicator');
const simAttachApkBtn = document.getElementById('simAttachApkBtn');
const webhookJsonLog = document.getElementById('webhookJsonLog');
const copyJsonBtn = document.getElementById('copyJsonBtn');

const simChipCbi = document.getElementById('simChipCbi');
const simChipRecharge = document.getElementById('simChipRecharge');
const simChipApk = document.getElementById('simChipApk');
const simChipSafe = document.getElementById('simChipSafe');

// Preloaded Realistic Fraud Samples
const SAMPLES = {
  sample_digital_arrest: {
    name: "Digital Arrest Fake CBI Notice",
    text: "OFFICIAL WARRANT OF ARREST - CENTRAL BUREAU OF INVESTIGATION (CBI) & MUMBAI POLICE CYBER CELL.\n" +
          "To: Citizen, We have intercepted an illegal parcel sent from Taiwan containing 140 grams MDMA and 5 fake passports in your name.\n" +
          "A non-bailable warrant of arrest is issued under CrPC Section 41. You are placed under DIGITAL ARREST immediately.\n" +
          "INSTRUCTIONS: Connect to Skype video call immediately for confidential interrogation. Keep camera on 24 hours. " +
          "Do not inform family or legal counsel. To clear your name from money laundering charges, transfer refundable safety security deposit " +
          "of Rs 2,50,000 to RBI Clearance Account within 2 hours. Failure will lead to immediate physical commando raid."
  },
  sample_free_recharge: {
    name: "84-Day Free 5G Recharge Phishing",
    text: "🎉 PM Narendra Modi Free 5G Recharge Offer 2026! 🎉\n" +
          "Government of India is giving 3 Months (84 Days) Free Recharge to all Jio, Airtel, and Vi users!\n" +
          "Claim your free 5G unlimited recharge immediately before the offer expires tonight.\n" +
          "Click here to activate: http://jio-free-5g-recharge.online/claim\n" +
          "Note: Forward this message to 5 WhatsApp groups or 10 friends to unlock your free recharge voucher code instantly!"
  },
  sample_wedding_apk: {
    name: "Wedding Card Android Trojan Lure",
    filename: "Wedding_Card_Invitation.apk",
    text: "Namaste Uncle, our wedding card invitation and venue location photos are in this application. " +
          "Please download and install Wedding_Card_Invitation.apk on your Android phone to view the wedding album and RSVP."
  },
  sample_legitimate: {
    name: "Legitimate BSES Electricity Bill",
    text: "Dear Consumer, your payment of Rs 1,420 for Consumer No 0098765432 has been received successfully on 12-Nov-2026. " +
          "Transaction Reference: TXN9876543210. You can download the official tax invoice at https://delhipolice.gov.in or https://bsesdelhi.com. " +
          "Thank you for using BSES Yamuna Power Limited."
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateCharCount();
  applyLanguage(currentLanguage);
  startThreatTicker();
});

function setupEventListeners() {
  // Theme Switcher Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Segmented Tab Switching
  if (tabTextBtn) tabTextBtn.addEventListener('click', () => switchTab('text'));
  if (tabFileBtn) tabFileBtn.addEventListener('click', () => switchTab('file'));
  if (tabSimBtn) tabSimBtn.addEventListener('click', () => switchTab('simulator'));

  // Textarea input monitoring
  if (textInput) {
    textInput.addEventListener('input', updateCharCount);
  }

  // Clear text button
  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      textInput.value = '';
      updateCharCount();
      textInput.focus();
    });
  }

  // File Upload & Drag-and-drop
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', (e) => {
      // Don't trigger file selector if clicked on sample apk button
      if (e.target.closest('#loadSampleApkBtn')) return;
      fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-blue-500', 'bg-blue-500/10');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-500', 'bg-blue-500/10');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-500', 'bg-blue-500/10');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSelectFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndSelectFile(e.target.files[0]);
      }
    });
  }

  // One-click Load Sample Wedding_Card.apk Button inside dropzone
  if (loadSampleApkBtn) {
    loadSampleApkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadRealSampleApk();
    });
  }

  if (clearFileBtn) {
    clearFileBtn.addEventListener('click', () => {
      selectedFile = null;
      if (fileInput) fileInput.value = '';
      if (fileSelectedDisplay) fileSelectedDisplay.classList.add('hidden');
      if (dropZoneError) dropZoneError.classList.add('hidden');
    });
  }

  // Audio Suite Controls
  if (playAudioBtn) playAudioBtn.addEventListener('click', toggleAudioAdvisory);
  if (stopAudioBtn) stopAudioBtn.addEventListener('click', stopAudioAdvisory);
  if (audioScrubber) audioScrubber.addEventListener('input', handleAudioScrub);
  if (transcriptToggleBtn && transcriptCard) {
    transcriptToggleBtn.addEventListener('click', () => {
      transcriptCard.classList.toggle('hidden');
    });
  }

  // Copy Report Button with micro-state
  if (copyReportBtn) {
    copyReportBtn.addEventListener('click', copyReportToClipboard);
  }

  // Reset Scan Button
  if (resetScanBtn) {
    resetScanBtn.addEventListener('click', resetScanView);
  }

  // Language Switchers
  if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
  if (langHiBtn) langHiBtn.addEventListener('click', () => setLanguage('hi'));

  // WhatsApp Simulator Events
  if (simSendBtn) simSendBtn.addEventListener('click', handleSimSend);
  if (simInput) {
    simInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSimSend();
    });
  }
  if (simAttachApkBtn) {
    simAttachApkBtn.addEventListener('click', () => {
      simInput.value = "Namaste Uncle, our wedding invitation card is attached. Please install Wedding_Card_Invitation.apk";
      handleSimSend("Wedding_Card_Invitation.apk");
    });
  }
  if (simChipCbi) {
    simChipCbi.addEventListener('click', () => {
      simInput.value = SAMPLES.sample_digital_arrest.text;
      handleSimSend();
    });
  }
  if (simChipRecharge) {
    simChipRecharge.addEventListener('click', () => {
      simInput.value = SAMPLES.sample_free_recharge.text;
      handleSimSend();
    });
  }
  if (simChipApk) {
    simChipApk.addEventListener('click', () => {
      simInput.value = SAMPLES.sample_wedding_apk.text;
      handleSimSend("Wedding_Card_Invitation.apk");
    });
  }
  if (simChipSafe) {
    simChipSafe.addEventListener('click', () => {
      simInput.value = SAMPLES.sample_legitimate.text;
      handleSimSend();
    });
  }
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      if (!webhookJsonLog) return;
      navigator.clipboard.writeText(webhookJsonLog.textContent);
      showToast("✓ Webhook JSON copied to clipboard");
    });
  }

  // Preload SpeechSynthesis voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// --- THEME ENGINE ---
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('kavach_theme', 'light');
    showToast("Switched to Alabaster Light theme");
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('kavach_theme', 'dark');
    showToast("Switched to Obsidian Dark theme");
  }
}

// --- LIVE THREAT TICKER ---
function startThreatTicker() {
  if (!threatTickerText) return;
  setInterval(() => {
    tickerIndex = (tickerIndex + 1) % THREAT_BULLETINS.length;
    threatTickerText.style.opacity = '0';
    setTimeout(() => {
      threatTickerText.textContent = THREAT_BULLETINS[tickerIndex];
      threatTickerText.style.opacity = '1';
    }, 250);
  }, 4500);
}

// --- BILINGUAL ENGINE ---
function setLanguage(lang) {
  currentLanguage = lang;
  
  if (lang === 'en') {
    langEnBtn.className = "px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition shadow-sm";
    langHiBtn.className = "px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold font-devanagari transition";
  } else {
    langHiBtn.className = "px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs font-devanagari transition shadow-sm";
    langEnBtn.className = "px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition";
  }

  applyLanguage(lang);

  if (currentAnalysis) {
    renderAnalysis(currentAnalysis);
  }

  showToast(lang === 'hi' ? "भाषा: हिन्दी सक्रिय की गई" : "Language: English active");
}

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  if (textInput && dict.placeholder_text) {
    textInput.placeholder = dict.placeholder_text;
  }
}

// --- TAB SWITCHER ---
function switchTab(mode) {
  const activeClass = "flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#161A26] text-slate-900 dark:text-white border border-black/[0.08] dark:border-white/[0.12] shadow-sm transition flex items-center justify-center space-x-1.5";
  const inactiveClass = "flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center space-x-1.5";

  tabTextBtn.className = mode === 'text' ? activeClass : inactiveClass;
  tabFileBtn.className = mode === 'file' ? activeClass : inactiveClass;
  tabSimBtn.className = mode === 'simulator' ? activeClass : inactiveClass;

  textInputContainer.classList.toggle('hidden', mode !== 'text');
  fileInputContainer.classList.toggle('hidden', mode !== 'file');
  whatsappSimContainer.classList.toggle('hidden', mode !== 'simulator');
}

// --- FILE VALIDATION & SELECTION ---
const ALLOWED_EXTENSIONS = ['.apk', '.png', '.jpg', '.jpeg', '.pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

function validateAndSelectFile(file) {
  if (dropZoneError) dropZoneError.classList.add('hidden');

  if (!file) return;

  const fileName = file.name || "";
  const ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  const dottedExt = "." + ext;

  // Format validation
  if (!ALLOWED_EXTENSIONS.includes(dottedExt)) {
    showDropZoneError(`⚠️ Unsupported file format (${dottedExt || 'unknown'}). Kavach AI supports .apk, .png, .jpg, .jpeg, and .pdf documents.`);
    return;
  }

  // Size limit validation (30MB)
  if (file.size > MAX_FILE_SIZE) {
    showDropZoneError(`⚠️ File size exceeds the 30MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller sample.`);
    return;
  }

  handleFileSelected(file);
}

function showDropZoneError(msg) {
  if (dropZoneError && dropZoneErrorMsg) {
    dropZoneErrorMsg.textContent = msg;
    dropZoneError.classList.remove('hidden');
  }
  showToast(msg);
}

function handleFileSelected(file) {
  selectedFile = file;

  // Dynamic file type icons
  let icon = '📄';
  const nameLower = file.name.toLowerCase();
  if (nameLower.endsWith('.apk')) {
    icon = '🤖';
  } else if (nameLower.endsWith('.png') || nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg')) {
    icon = '🖼️';
  } else if (nameLower.endsWith('.pdf')) {
    icon = '📑';
  }

  if (fileTypeIcon) fileTypeIcon.textContent = icon;
  if (fileNameSpan) fileNameSpan.textContent = file.name;
  if (fileSizeSpan) {
    const kb = file.size / 1024;
    fileSizeSpan.textContent = kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  }
  if (fileSelectedDisplay) fileSelectedDisplay.classList.remove('hidden');
  if (dropZoneError) dropZoneError.classList.add('hidden');

  showToast(`Loaded file: ${file.name}`);
}

// One-Click Real Sample APK Loader
async function loadRealSampleApk() {
  try {
    showToast("Fetching genuine Wedding_Card_Invitation.apk sample...");
    const res = await fetch('/api/samples/Wedding_Card_Invitation.apk');
    if (!res.ok) throw new Error("Could not fetch sample APK binary.");
    const blob = await res.blob();
    const file = new File([blob], "Wedding_Card_Invitation.apk", { type: "application/vnd.android.package-archive" });
    validateAndSelectFile(file);
    showToast("✓ Authentic Trojan APK loaded into dropzone. Ready to scan!");
  } catch (err) {
    console.error("Error loading sample APK:", err);
    showToast(`Failed to load sample APK: ${err.message}`);
  }
}

function updateCharCount() {
  if (textInput && charCountSpan) {
    const len = textInput.value.length;
    charCountSpan.textContent = `${len} character${len === 1 ? '' : 's'}`;
  }
}

// --- SAMPLE SCENARIO RUNNER (BUG FIX FOR APK) ---
async function loadSample(sampleId) {
  // Clear any existing active selection rings
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-[#090A0F]');
  });

  const sample = SAMPLES[sampleId];
  if (!sample) return;

  // Highlight clicked sample button
  const activeBtn = document.getElementById(
    sampleId === 'sample_digital_arrest' ? 'sampleBtn1' :
    sampleId === 'sample_free_recharge' ? 'sampleBtn2' :
    sampleId === 'sample_wedding_apk' ? 'sampleBtn3' : 'sampleBtn4'
  );
  if (activeBtn) {
    activeBtn.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-[#090A0F]');
  }

  // CRITICAL FIX: Wedding Card .APK must trigger genuine APK Trojan analysis!
  if (sampleId === 'sample_wedding_apk') {
    switchTab('file');
    showToast("Loading authentic Wedding_Card_Invitation.apk for binary trojan inspection...");
    try {
      const res = await fetch('/api/samples/Wedding_Card_Invitation.apk');
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], "Wedding_Card_Invitation.apk", { type: "application/vnd.android.package-archive" });
        handleFileSelected(file);
      }
    } catch (e) {
      console.warn("Fallback to simulated file payload", e);
    }
    runScan();
    return;
  }

  // Text scenarios
  switchTab('text');
  if (textInput) {
    textInput.value = sample.text;
    updateCharCount();
  }

  showToast(`Loaded sample: ${sample.name}`);
  runScan();
}

// --- SCAN EXECUTION WITH VISUAL STAGING ---
async function runScan() {
  stopAudioAdvisory();

  const isTextMode = !textInputContainer.classList.contains('hidden');
  const isFileMode = !fileInputContainer.classList.contains('hidden');
  const apiKey = customApiKey ? customApiKey.value.trim() : '';

  setLoading(true);

  // If in file mode, animate multi-stage progress
  if (isFileMode && scanProgressContainer) {
    scanProgressContainer.classList.remove('hidden');
    animateScanStages();
  }

  try {
    let response;

    if (isTextMode) {
      const textVal = textInput.value.trim();
      if (!textVal) {
        showToast(currentLanguage === 'hi' ? "⚠️ कृपया मैसेज पेस्ट करें या ऊपर दिए उदाहरण पर क्लिक करें।" : "⚠️ Please paste some text or click a quick sample above.");
        setLoading(false);
        return;
      }

      response = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textVal, api_key: apiKey || null })
      });

    } else if (isFileMode) {
      if (!selectedFile) {
        showToast(currentLanguage === 'hi' ? "⚠️ कृपया कोई फाइल (.apk, .png, .jpg, .pdf) चुनें।" : "⚠️ Please select or drop a file (.apk, .png, .jpg, .pdf).");
        setLoading(false);
        if (scanProgressContainer) scanProgressContainer.classList.add('hidden');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      if (apiKey) formData.append('api_key', apiKey);

      response = await fetch('/api/analyze/upload', {
        method: 'POST',
        body: formData
      });
    }

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Analysis failed.");
    }

    const data = await response.json();
    currentAnalysis = data;
    renderAnalysis(data);

    // Smooth scroll down to result on mobile
    if (window.innerWidth < 1024 && resultCard) {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  } catch (err) {
    console.error("Scan error:", err);
    showToast(`❌ Scan Error: ${err.message}`);
  } finally {
    setLoading(false);
    if (scanProgressContainer) {
      setTimeout(() => scanProgressContainer.classList.add('hidden'), 800);
    }
  }
}

function animateScanStages() {
  if (!scanProgressBar || !scanProgressText || !scanProgressPercent || !scanProgressStep) return;

  // Stage 1: 35%
  scanProgressBar.style.width = '35%';
  scanProgressPercent.textContent = '35%';
  scanProgressText.textContent = "Stage 1/3: Verifying digital signature & headers...";
  scanProgressStep.textContent = "Step 1 of 3: ZIP manifest parsing";

  setTimeout(() => {
    // Stage 2: 70%
    if (scanProgressBar) {
      scanProgressBar.style.width = '70%';
      scanProgressPercent.textContent = '70%';
      scanProgressText.textContent = "Stage 2/3: Scanning Dalvik bytecode & legal statutory rules...";
      scanProgressStep.textContent = "Step 2 of 3: Permission heuristic audit";
    }
  }, 250);

  setTimeout(() => {
    // Stage 3: 100%
    if (scanProgressBar) {
      scanProgressBar.style.width = '100%';
      scanProgressPercent.textContent = '100%';
      scanProgressText.textContent = "Stage 3/3: Synthesizing threat telemetry & safety advisory...";
      scanProgressStep.textContent = "Step 3 of 3: Final forensic scoring";
    }
  }, 500);
}

function setLoading(isLoading) {
  if (!analyzeBtn) return;
  const dict = TRANSLATIONS[currentLanguage];
  if (isLoading) {
    scanSpinner.classList.remove('hidden');
    scanBtnText.textContent = dict.scanning_btn;
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-80', 'cursor-not-allowed');
  } else {
    scanSpinner.classList.add('hidden');
    scanBtnText.textContent = dict.scan_btn;
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove('opacity-80', 'cursor-not-allowed');
  }
}

// --- RENDER ANALYSIS RESULT ---
function renderAnalysis(data) {
  if (!resultPlaceholder || !resultCard) return;

  resultPlaceholder.classList.add('hidden');
  resultCard.classList.remove('hidden');

  // Verdict Theme Classes
  verdictBanner.className = "cream-panel rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-500";
  
  let themeClass = 'threat-safe-glow';
  let badgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
  let strokeColor = '#059669';

  if (data.threat_level === 'CRITICAL') {
    themeClass = 'threat-critical-glow';
    badgeColor = 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
    strokeColor = '#E11D48';
  } else if (data.threat_level === 'SUSPICIOUS') {
    themeClass = 'threat-suspicious-glow';
    badgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    strokeColor = '#D97706';
  }

  verdictBanner.classList.add(themeClass);

  // Threat Badge & Title
  const verdictWord = currentLanguage === 'hi' ? 
    (data.threat_level === 'CRITICAL' ? 'गंभीर फ्रॉड' : data.threat_level === 'SUSPICIOUS' ? 'संदिग्ध' : 'सुरक्षित') : 
    `${data.threat_level} VERDICT`;

  threatLevelBadge.className = `text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center space-x-1.5 border ${badgeColor}`;
  threatLevelBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${data.threat_level === 'CRITICAL' ? 'bg-rose-600 animate-ping' : 'bg-current'}"></span><span>${verdictWord}</span>`;
  
  verdictTitle.textContent = currentLanguage === 'hi' ? (data.title_hi || data.title_en) : data.title_en;
  engineBadge.textContent = `Engine: ${data.engine_used}`;

  // Circular Score Meter (Circumference of r=45 is 2 * Math.PI * 45 = 282.7)
  const score = Math.max(0, Math.min(100, data.threat_score));
  threatScoreDisplay.textContent = score;

  if (gaugeCircle) {
    const circumference = 282.7;
    const offset = circumference - (circumference * score / 100);
    gaugeCircle.style.stroke = strokeColor;
    gaugeCircle.style.strokeDashoffset = offset;
  }

  // Summaries
  summaryEn.textContent = data.summary_en;
  summaryHi.textContent = data.summary_hi;

  // Immediate Actions List
  actionsEnList.innerHTML = '';
  const actionsEn = data.immediate_actions_en || [];
  actionsEn.forEach(act => {
    const li = document.createElement('li');
    li.className = "flex items-start space-x-2 text-slate-700 dark:text-slate-300";
    li.innerHTML = `<span class="text-blue-600 dark:text-blue-400 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsEnList.appendChild(li);
  });

  actionsHiList.innerHTML = '';
  const actionsHi = data.immediate_actions_hi || [];
  actionsHi.forEach(act => {
    const li = document.createElement('li');
    li.className = "flex items-start space-x-2 text-slate-700 dark:text-slate-300 font-devanagari";
    li.innerHTML = `<span class="text-amber-600 dark:text-amber-400 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsHiList.appendChild(li);
  });

  // Forensic Evidence List
  evidenceList.innerHTML = '';
  if (data.evidence_list && data.evidence_list.length > 0) {
    data.evidence_list.forEach(ev => {
      const item = document.createElement('div');
      item.className = "p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] flex flex-col space-y-1.5 hover:border-slate-400 dark:hover:border-slate-500 transition";

      const evColor = ev.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' :
                      ev.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' :
                      'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30';

      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
            <span class="text-amber-500 font-bold">⚡</span>
            <span>${escapeHtml(ev.indicator)}</span>
          </span>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full border ${evColor}">${ev.severity}</span>
        </div>
        <p class="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">${escapeHtml(ev.detail_en)}</p>
        <p class="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-devanagari font-medium">${escapeHtml(ev.detail_hi)}</p>
      `;
      evidenceList.appendChild(item);
    });
  } else {
    evidenceList.innerHTML = `<div class="p-4 rounded-xl bg-black/5 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-slate-500 dark:text-slate-400 text-xs italic">No suspicious forensic indicators detected. Document appears clean.</div>`;
  }

  // Legal Rules Violations
  if (data.legal_rule_violations && data.legal_rule_violations.length > 0) {
    legalSection.classList.remove('hidden');
    legalRulesList.innerHTML = '';
    data.legal_rule_violations.forEach(lr => {
      const card = document.createElement('div');
      card.className = "p-4 rounded-2xl bg-white dark:bg-[#161A26] border border-rose-500/30 space-y-2 hover:border-rose-500/50 transition shadow-sm";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-rose-700 dark:text-rose-400 text-sm flex items-center space-x-1.5">
            <span>⚖️</span>
            <span>${escapeHtml(lr.rule_name)}</span>
          </span>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-500/30">STATUTORY VIOLATION</span>
        </div>
        <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400">Statute: <strong>${escapeHtml(lr.statute)}</strong></p>
        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(lr.explanation_en)}</p>
        <p class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-devanagari font-medium">${escapeHtml(lr.explanation_hi)}</p>
      `;
      legalRulesList.appendChild(card);
    });
  } else {
    legalSection.classList.add('hidden');
  }

  // APK Section
  if (data.apk_analysis) {
    apkSection.classList.remove('hidden');
    const apk = data.apk_analysis;
    let permsHtml = '';
    if (apk.dangerous_permissions && apk.dangerous_permissions.length > 0) {
      permsHtml = apk.dangerous_permissions.map(p => `
        <div class="p-3 rounded-xl bg-white dark:bg-[#161A26] border border-purple-500/30 space-y-1 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">${escapeHtml(p.permission)}</span>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">${p.severity}</span>
          </div>
          <p class="text-slate-700 dark:text-slate-300 text-xs">${escapeHtml(p.description_en)}</p>
          <p class="text-slate-800 dark:text-slate-200 text-xs font-devanagari font-medium">${escapeHtml(p.description_hi)}</p>
        </div>
      `).join('');
    } else {
      permsHtml = `<p class="text-slate-500 text-xs italic">No high-risk permissions found in manifest.</p>`;
    }

    apkMetadataDetails.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-[#161A26] border border-purple-500/30 text-xs shadow-sm">
        <div><span class="text-slate-500 dark:text-slate-400">File:</span> <strong class="text-slate-900 dark:text-white">${escapeHtml(apk.filename)}</strong></div>
        <div><span class="text-slate-500 dark:text-slate-400">Trojan Classification:</span> <strong class="text-rose-600 dark:text-rose-400">${escapeHtml(apk.trojan_classification || "Generic APK")}</strong></div>
        <div><span class="text-slate-500 dark:text-slate-400">Package:</span> <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(apk.package_name || "Unknown")}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">Size:</span> <span class="text-slate-700 dark:text-slate-300 font-semibold">${(apk.file_size_bytes / 1024).toFixed(1)} KB</span></div>
      </div>
      <div class="mt-3 space-y-2">
        <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">High-Risk Permissions & Hooks:</span>
        <div class="space-y-2">${permsHtml}</div>
      </div>
    `;
  } else {
    apkSection.classList.add('hidden');
  }

  // Transcript setup
  if (transcriptText) {
    transcriptText.textContent = currentLanguage === 'hi' ? data.speech_script_hi : data.speech_script_en;
  }

  // WhatsApp SOS Trigger Link
  if (data.whatsapp_sos_text && whatsappSosBtn) {
    const encoded = encodeURIComponent(data.whatsapp_sos_text);
    whatsappSosBtn.href = `https://api.whatsapp.com/send?text=${encoded}`;
  }
}

// --- RESET SCAN VIEW ---
function resetScanView() {
  stopAudioAdvisory();
  currentAnalysis = null;
  if (textInput) textInput.value = '';
  selectedFile = null;
  if (fileInput) fileInput.value = '';
  if (fileSelectedDisplay) fileSelectedDisplay.classList.add('hidden');
  if (dropZoneError) dropZoneError.classList.add('hidden');
  if (scanProgressContainer) scanProgressContainer.classList.add('hidden');
  updateCharCount();

  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-[#090A0F]');
  });

  if (resultCard) resultCard.classList.add('hidden');
  if (resultPlaceholder) resultPlaceholder.classList.remove('hidden');

  showToast(currentLanguage === 'hi' ? "स्कैनर साफ कर दिया गया है।" : "Scan workbench cleared.");
}

// --- COPY REPORT TO CLIPBOARD (WITH MICRO-STATE) ---
function copyReportToClipboard() {
  if (!currentAnalysis) return;

  const textToCopy = currentAnalysis.whatsapp_sos_text || 
    `Kavach AI Verification Report\nVerdict: ${currentAnalysis.threat_level} (Score: ${currentAnalysis.threat_score}/100)\nCategory: ${currentAnalysis.category}\nNational Helpline: 1930\nhttps://cybercrime.gov.in`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    if (copyReportIcon && copyReportText) {
      copyReportIcon.textContent = '✓';
      copyReportText.textContent = 'Copied!';
      copyReportBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
      setTimeout(() => {
        copyReportIcon.textContent = '📋';
        copyReportText.textContent = TRANSLATIONS[currentLanguage].btn_copy_report;
        copyReportBtn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
      }, 2000);
    }
    showToast(currentLanguage === 'hi' ? "📋 रिपोर्ट क्लिपबोर्ड पर कॉपी हो गई!" : "📋 Report copied to clipboard! (Ready to paste or share)");
  }).catch(() => {
    showToast("Could not copy automatically. Please select text manually.");
  });
}

// --- EXECUTIVE AUDIO SUITE (PLAY / PAUSE / SCRUB / TIME) ---
function toggleAudioAdvisory() {
  if (isAudioPlaying) {
    pauseAudioAdvisory();
    return;
  }
  if (!currentAnalysis) return;

  const script = currentLanguage === 'hi' ? currentAnalysis.speech_script_hi : currentAnalysis.speech_script_en;
  if (!script) return;

  if (!('speechSynthesis' in window)) {
    showToast(currentLanguage === 'hi' ? "⚠️ आपके ब्राउज़र में ऑडियो स्पीच समर्थित नहीं है।" : "⚠️ Speech synthesis not supported on your browser.");
    return;
  }

  // Calculate approximate duration based on word count (~130 words/min)
  const words = script.split(/\s+/).length;
  audioDuration = Math.max(15, Math.round((words / 130) * 60));
  if (audioTotalTime) audioTotalTime.textContent = formatTime(audioDuration);

  // If resumed from pause, restart speech from current point or fresh
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (currentLanguage === 'hi') {
    utterance.lang = 'hi-IN';
    const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('hi-IN'));
    if (hiVoice) utterance.voice = hiVoice;
  } else {
    utterance.lang = 'en-IN';
    const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
    if (enVoice) utterance.voice = enVoice;
  }

  utterance.onstart = () => {
    isAudioPlaying = true;
    if (audioIcon) audioIcon.textContent = '⏸️';
    if (audioBtnText) audioBtnText.textContent = currentLanguage === 'hi' ? "ऑडियो रोकें" : "Pause Advisory";
    if (stopAudioBtn) stopAudioBtn.classList.remove('hidden');
    if (audioWaveform) audioWaveform.classList.remove('hidden');
    if (audioScrubberRow) audioScrubberRow.classList.remove('hidden');

    startAudioTimeline();
  };

  utterance.onend = resetAudioState;
  utterance.onerror = resetAudioState;

  currentSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function startAudioTimeline() {
  if (audioTimer) clearInterval(audioTimer);
  audioTimer = setInterval(() => {
    if (!isAudioPlaying) return;
    audioCurrentSec += 1;
    if (audioCurrentSec > audioDuration) {
      resetAudioState();
      return;
    }
    updateAudioDisplay();
  }, 1000);
}

function updateAudioDisplay() {
  if (audioCurrentTime) audioCurrentTime.textContent = formatTime(audioCurrentSec);
  if (audioScrubber) {
    const percent = Math.min(100, Math.round((audioCurrentSec / audioDuration) * 100));
    audioScrubber.value = percent;
  }
}

function handleAudioScrub(e) {
  const percent = parseInt(e.target.value, 10);
  audioCurrentSec = Math.round((percent / 100) * audioDuration);
  if (audioCurrentTime) audioCurrentTime.textContent = formatTime(audioCurrentSec);

  // If playing, restart utterance from approximate fraction
  if (isAudioPlaying && currentAnalysis) {
    toggleAudioAdvisory(); // pause
    setTimeout(() => toggleAudioAdvisory(), 100); // resume
  }
}

function pauseAudioAdvisory() {
  isAudioPlaying = false;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
  if (audioTimer) clearInterval(audioTimer);
  if (audioIcon) audioIcon.textContent = '▶️';
  if (audioBtnText) audioBtnText.textContent = currentLanguage === 'hi' ? "ऑडियो जारी रखें" : "Resume Advisory";
  if (audioWaveform) {
    document.querySelectorAll('.equalizer-bar').forEach(b => b.classList.add('paused'));
  }
}

function stopAudioAdvisory() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  resetAudioState();
}

function resetAudioState() {
  isAudioPlaying = false;
  audioCurrentSec = 0;
  if (audioTimer) clearInterval(audioTimer);
  if (audioIcon) audioIcon.textContent = '🔊';
  if (audioBtnText) audioBtnText.textContent = currentLanguage === 'hi' ? "हिन्दी में ऑडियो सलाह सुनें" : "Play Calming Voice Advisory";
  if (stopAudioBtn) stopAudioBtn.classList.add('hidden');
  if (audioWaveform) {
    audioWaveform.classList.add('hidden');
    document.querySelectorAll('.equalizer-bar').forEach(b => b.classList.remove('paused'));
  }
  if (audioScrubber) audioScrubber.value = 0;
  if (audioCurrentTime) audioCurrentTime.textContent = '00:00';
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- ON-SCREEN WHATSAPP SIMULATOR ENGINE (R3) ---
async function handleSimSend(forcedFilename = null) {
  const text = simInput ? simInput.value.trim() : "";
  if (!text && !forcedFilename) return;

  // 1. Render Outgoing User Bubble
  renderSimUserMessage(text, forcedFilename);
  if (simInput) simInput.value = '';

  // 2. Show Animated Typing Indicator
  if (simTypingIndicator) simTypingIndicator.classList.remove('hidden');
  if (simChatHistory) simChatHistory.scrollTop = simChatHistory.scrollHeight;

  // 3. Dispatch Live HTTP POST to /api/webhook/whatsapp
  const requestPayload = {
    message: text,
    from: "+919876543210",
    filename: forcedFilename || null
  };

  updateWebhookInspectorLog("REQUEST (POST /api/webhook/whatsapp)", requestPayload);

  try {
    const res = await fetch('/api/webhook/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    updateWebhookInspectorLog("RESPONSE (200 OK)", data);

    // Hide typing indicator after slight realistic thinking pause
    setTimeout(() => {
      if (simTypingIndicator) simTypingIndicator.classList.add('hidden');
      renderSimBotMessage(data);
      if (simChatHistory) simChatHistory.scrollTop = simChatHistory.scrollHeight;
    }, 400);

  } catch (err) {
    console.error("Webhook simulator error:", err);
    if (simTypingIndicator) simTypingIndicator.classList.add('hidden');
    renderSimErrorMessage(err.message);
  }
}

function renderSimUserMessage(text, filename) {
  if (!simChatHistory) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bubble = document.createElement('div');
  bubble.className = "flex items-end justify-end space-x-1";
  
  let attachmentSnippet = "";
  if (filename) {
    attachmentSnippet = `
      <div class="p-2 rounded-lg bg-black/10 dark:bg-white/10 mb-1.5 flex items-center space-x-2 text-[11px] font-mono">
        <span>📎</span>
        <span class="font-bold underline">${escapeHtml(filename)}</span>
      </div>
    `;
  }

  bubble.innerHTML = `
    <div class="chat-bubble-out max-w-[85%] p-3 text-xs leading-relaxed">
      ${attachmentSnippet}
      <p class="whitespace-pre-line">${escapeHtml(text)}</p>
      <div class="flex items-center justify-end space-x-1 mt-1 text-[9px] text-[#54656F] dark:text-[#8696A0]">
        <span>${timeStr}</span>
        <span class="text-blue-500 font-bold">✓✓</span>
      </div>
    </div>
  `;

  simChatHistory.appendChild(bubble);
  simChatHistory.scrollTop = simChatHistory.scrollHeight;
}

function renderSimBotMessage(data) {
  if (!simChatHistory) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isCritical = data.threat_level === 'CRITICAL';
  const isSuspicious = data.threat_level === 'SUSPICIOUS';
  const badgeClass = isCritical ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40' :
                     isSuspicious ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40' :
                     'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40';

  const bubble = document.createElement('div');
  bubble.className = "flex items-start space-x-2";

  bubble.innerHTML = `
    <div class="chat-bubble-in max-w-[90%] p-3 text-xs leading-relaxed space-y-2 border border-black/[0.06] dark:border-white/[0.06]">
      <div class="flex items-center justify-between pb-1 border-b border-black/[0.08] dark:border-white/[0.08]">
        <span class="font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1 text-[11px]">
          <span>🛡️</span>
          <span>Kavach AI Bot</span>
        </span>
        <span class="text-[9px] font-black px-2 py-0.5 rounded-full border ${badgeClass}">
          ${data.threat_level} (${data.threat_score}/100)
        </span>
      </div>

      <p class="whitespace-pre-line font-sans">${escapeHtml(data.whatsapp_reply_message || data.summary_en)}</p>

      <div class="pt-2 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-wrap items-center gap-1.5">
        <a href="tel:1930" class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] flex items-center space-x-1 hover:bg-rose-700 transition">
          <span>📞</span>
          <span>Helpline 1930</span>
        </a>
        <button type="button" class="sync-verdict-btn px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center space-x-1 hover:bg-blue-700 transition">
          <span>⚡</span>
          <span>View Full Forensic Audit</span>
        </button>
      </div>

      <span class="text-[9px] text-[#54656F] dark:text-[#8696A0] text-right block">${timeStr}</span>
    </div>
  `;

  // Attach click listener to "View Full Forensic Audit" button to sync dashboard
  const syncBtn = bubble.querySelector('.sync-verdict-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      currentAnalysis = data;
      renderAnalysis(data);
      showToast("✓ Synchronized WhatsApp telemetry to main forensic dashboard!");
      if (window.innerWidth < 1024 && resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  simChatHistory.appendChild(bubble);
  simChatHistory.scrollTop = simChatHistory.scrollHeight;
}

function renderSimErrorMessage(errText) {
  if (!simChatHistory) return;
  const bubble = document.createElement('div');
  bubble.className = "flex items-start";
  bubble.innerHTML = `
    <div class="chat-bubble-in max-w-[85%] p-3 text-xs leading-relaxed bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-200">
      <p class="font-bold">❌ Webhook Error</p>
      <p>${escapeHtml(errText)}</p>
    </div>
  `;
  simChatHistory.appendChild(bubble);
  simChatHistory.scrollTop = simChatHistory.scrollHeight;
}

function updateWebhookInspectorLog(label, payload) {
  if (!webhookJsonLog) return;
  const timestamp = new Date().toISOString();
  const formatted = JSON.stringify(payload, null, 2);
  webhookJsonLog.textContent = `// [${timestamp}] ${label}\n${formatted}`;
}

// --- TOAST NOTIFICATION ---
let toastTimeout = null;
function showToast(msg) {
  if (!toastNotification || !toastMessage) return;
  toastMessage.textContent = msg;
  toastNotification.classList.remove('hidden');
  toastNotification.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove('show');
    setTimeout(() => toastNotification.classList.add('hidden'), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
