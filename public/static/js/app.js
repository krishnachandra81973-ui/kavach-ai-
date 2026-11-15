/**
 * Kavach AI - Luxury Light Cream Frontend Controller
 * Cyber Scam, Digital Arrest & Malicious APK Shield
 * Full Bilingual (EN / हिन्दी) Translation Engine
 */

// Global State
let currentAnalysis = null;
let currentLanguage = 'en'; // 'en' or 'hi'
let selectedFile = null;
let currentSpeechUtterance = null;
let isAudioPlaying = false;

// Complete Bilingual Dictionary
const TRANSLATIONS = {
  en: {
    tagline: "National Cyber Scam, Digital Arrest & Malicious APK Shield",
    badge_national: "Built for Indian Citizens, Parents & Senior Citizens",
    hero_title: 'Don\'t Panic, Verify. Stop <span class="text-rose-600 underline decoration-rose-300 decoration-wavy">Digital Arrests</span> & WhatsApp Frauds.',
    hero_desc: "Instant forensic verification of fake police/CBI warrants under Indian statutory law (<strong>BNSS 2023 / CrPC</strong>), detection of fake <strong>5G recharge doles</strong>, and static security inspection of <strong>Wedding Card / Utility APK Trojans</strong> before they steal your bank OTPs.",
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
    tab_text: "Paste Text / WhatsApp",
    tab_file: "Upload Notice / APK",
    input_label: "Enter Message or Notice Text:",
    clear_btn: "Clear",
    placeholder_text: "Paste WhatsApp forward, SMS, threatening call transcript, or fake court notice text here...",
    upload_label: "Upload Suspicious File (.APK, Screenshot, Notice PDF):",
    upload_drop_title: "Click to select file or drag & drop here",
    upload_drop_sub: "Supports .apk (Trojan scan), .png, .jpg (Screenshots/Warrants), and .pdf",
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
    placeholder_desc: "Paste suspicious message text on the left or click any quick sample above to observe visual threat scoring, statutory legal checks, and bilingual audio warnings.",
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
    hero_title: 'घबराएं नहीं, जांचें। <span class="text-rose-600 underline decoration-rose-300 decoration-wavy">डिजिटल अरेस्ट</span> और व्हाट्सएप फ्रॉड से बचें।',
    hero_desc: "भारतीय कानून (<strong>BNSS 2023 / CrPC</strong>) के तहत फर्जी पुलिस/CBI वारंट की कानूनी जांच, फर्जी <strong>5G फ्री रिचार्ज</strong> का पर्दाफाश, और शादी के कार्ड वाली खतरनाक <strong>APK फाइलों</strong> से बैंक OTP की चोरी से संपूर्ण सुरक्षा।",
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
    tab_text: "मैसेज / नोटिस पेस्ट करें",
    tab_file: "नोटिस / APK फाइल अपलोड करें",
    input_label: "व्हाट्सएप मैसेज या नोटिस का टेक्स्ट डालें:",
    clear_btn: "साफ करें",
    placeholder_text: "व्हाट्सएप पर आया धमकी भरा मैसेज, फर्जी पुलिस नोटिस, या फ्री रिचार्ज का लिंक यहाँ पेस्ट करें...",
    upload_label: "संदिग्ध फाइल अपलोड करें (.APK, स्क्रीनशॉट, नोटिस PDF):",
    upload_drop_title: "फाइल चुनने के लिए क्लिक करें या यहाँ छोड़ें",
    upload_drop_sub: ".apk (वायरस जांच), .png, .jpg (स्क्रीनशॉट/वारंट), और .pdf समर्थित हैं",
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
    placeholder_desc: "बाईं ओर संदिग्ध मैसेज पेस्ट करें या ऊपर दिए गए उदाहरण पर क्लिक करके लाइव कानूनी जांच, स्कोर और हिन्दी ऑडियो चेतावनी देखें।",
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
const tabTextBtn = document.getElementById('tabTextBtn');
const tabFileBtn = document.getElementById('tabFileBtn');
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const fileSelectedDisplay = document.getElementById('fileSelectedDisplay');
const fileNameSpan = document.getElementById('fileNameSpan');
const clearFileBtn = document.getElementById('clearFileBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const charCountSpan = document.getElementById('charCountSpan');

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
const copyReportBtn = document.getElementById('copyReportBtn');
const resetScanBtn = document.getElementById('resetScanBtn');

const langEnBtn = document.getElementById('langEnBtn');
const langHiBtn = document.getElementById('langHiBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

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
    text: "Namaste Uncle, our wedding card invitation and venue location photos are in this application. " +
          "Please download and install Wedding_Card_Invitation.apk on your Android phone to view the wedding album and RSVP.",
    suggestedFilename: "Wedding_Card_Invitation.apk"
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
});

function setupEventListeners() {
  // Tab Switching
  if (tabTextBtn && tabFileBtn) {
    tabTextBtn.addEventListener('click', () => switchTab('text'));
    tabFileBtn.addEventListener('click', () => switchTab('file'));
  }

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
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-blue-500', 'bg-blue-50/50');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-500', 'bg-blue-50/50');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-500', 'bg-blue-50/50');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelected(e.target.files[0]);
      }
    });
  }

  if (clearFileBtn) {
    clearFileBtn.addEventListener('click', () => {
      selectedFile = null;
      if (fileInput) fileInput.value = '';
      if (fileSelectedDisplay) fileSelectedDisplay.classList.add('hidden');
    });
  }

  // Language Switchers
  if (langEnBtn && langHiBtn) {
    langEnBtn.addEventListener('click', () => setLanguage('en'));
    langHiBtn.addEventListener('click', () => setLanguage('hi'));
  }

  // Audio Buttons
  if (playAudioBtn) playAudioBtn.addEventListener('click', toggleAudioAdvisory);
  if (stopAudioBtn) stopAudioBtn.addEventListener('click', stopAudioAdvisory);

  // Copy Report Button
  if (copyReportBtn) {
    copyReportBtn.addEventListener('click', copyReportToClipboard);
  }

  // Reset Scan Button
  if (resetScanBtn) {
    resetScanBtn.addEventListener('click', resetScanView);
  }

  // Initialize SpeechSynthesis voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// --- BILINGUAL ENGINE ---
function setLanguage(lang) {
  currentLanguage = lang;
  
  if (lang === 'en') {
    langEnBtn.className = "px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold text-xs transition shadow-sm";
    langHiBtn.className = "px-3 py-1.5 rounded-lg text-stone-700 hover:text-stone-950 text-xs font-semibold font-devanagari transition";
  } else {
    langHiBtn.className = "px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold text-xs font-devanagari transition shadow-sm";
    langEnBtn.className = "px-3 py-1.5 rounded-lg text-stone-700 hover:text-stone-950 text-xs font-semibold transition";
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

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Update placeholder
  if (textInput && dict.placeholder_text) {
    textInput.placeholder = dict.placeholder_text;
  }
}

// --- TAB SWITCHER ---
function switchTab(mode) {
  if (mode === 'text') {
    tabTextBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-stone-900 border border-[#E0D7C9] shadow-sm transition flex items-center justify-center space-x-2";
    tabFileBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition flex items-center justify-center space-x-2";
    textInputContainer.classList.remove('hidden');
    fileInputContainer.classList.add('hidden');
  } else {
    tabFileBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-stone-900 border border-[#E0D7C9] shadow-sm transition flex items-center justify-center space-x-2";
    tabTextBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition flex items-center justify-center space-x-2";
    fileInputContainer.classList.remove('hidden');
    textInputContainer.classList.add('hidden');
  }
}

function handleFileSelected(file) {
  selectedFile = file;
  if (fileNameSpan && fileSelectedDisplay) {
    fileNameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    fileSelectedDisplay.classList.remove('hidden');
  }
  showToast(`Selected file: ${file.name}`);
}

function updateCharCount() {
  if (textInput && charCountSpan) {
    const len = textInput.value.length;
    charCountSpan.textContent = `${len} character${len === 1 ? '' : 's'}`;
  }
}

// --- SAMPLE LOADER ---
function loadSample(sampleId) {
  const sample = SAMPLES[sampleId];
  if (!sample) return;

  switchTab('text');
  if (textInput) {
    textInput.value = sample.text;
    updateCharCount();
  }

  showToast(`Loaded sample: ${sample.name}`);
  runScan();
}

// --- SCAN EXECUTION ---
async function runScan() {
  stopAudioAdvisory();

  const isTextMode = !textInputContainer.classList.contains('hidden');
  const apiKey = customApiKey ? customApiKey.value.trim() : '';

  setLoading(true);

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

    } else {
      if (!selectedFile) {
        showToast(currentLanguage === 'hi' ? "⚠️ कृपया कोई फाइल (.apk, .png, .jpg, .pdf) चुनें।" : "⚠️ Please select or drop a file (.apk, .png, .jpg, .pdf).");
        setLoading(false);
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
  }
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

  // Verdict Theme
  verdictBanner.className = "cream-panel rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-500";
  
  let themeClass = 'threat-safe-glow';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let strokeColor = '#059669';

  if (data.threat_level === 'CRITICAL') {
    themeClass = 'threat-critical-glow';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    strokeColor = '#E11D48';
  } else if (data.threat_level === 'SUSPICIOUS') {
    themeClass = 'threat-suspicious-glow';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    strokeColor = '#D97706';
  }

  verdictBanner.classList.add(themeClass);

  // Threat Badge & Title
  const verdictWord = currentLanguage === 'hi' ? 
    (data.threat_level === 'CRITICAL' ? 'गंभीर फ्रॉड' : data.threat_level === 'SUSPICIOUS' ? 'संदिग्ध' : 'सुरक्षित') : 
    `${data.threat_level} VERDICT`;

  threatLevelBadge.className = `text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center space-x-1.5 border ${badgeColor}`;
  threatLevelBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${data.threat_level === 'CRITICAL' ? 'bg-rose-600 animate-ping' : 'bg-current'}"></span><span>${verdictWord}</span>`;
  
  verdictTitle.textContent = currentLanguage === 'hi' ? data.title_hi : data.title_en;
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

  // Actions List
  actionsEnList.innerHTML = '';
  data.immediate_actions_en.forEach(act => {
    const li = document.createElement('li');
    li.className = "flex items-start space-x-2 text-stone-700";
    li.innerHTML = `<span class="text-blue-600 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsEnList.appendChild(li);
  });

  actionsHiList.innerHTML = '';
  data.immediate_actions_hi.forEach(act => {
    const li = document.createElement('li');
    li.className = "flex items-start space-x-2 text-stone-800 font-devanagari";
    li.innerHTML = `<span class="text-amber-700 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsHiList.appendChild(li);
  });

  // Forensic Evidence List
  evidenceList.innerHTML = '';
  if (data.evidence_list && data.evidence_list.length > 0) {
    data.evidence_list.forEach(ev => {
      const item = document.createElement('div');
      item.className = "p-4 rounded-2xl bg-[#FDFBF7] border border-[#E9E2D8] flex flex-col space-y-1.5 hover:border-stone-400 transition";

      const evColor = ev.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      ev.severity === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-stone-100 text-stone-800 border-stone-200';

      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-stone-900 text-sm flex items-center space-x-2">
            <span class="text-amber-600 font-bold">⚡</span>
            <span>${escapeHtml(ev.indicator)}</span>
          </span>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full border ${evColor}">${ev.severity}</span>
        </div>
        <p class="text-stone-700 text-xs leading-relaxed">${escapeHtml(ev.detail_en)}</p>
        <p class="text-stone-800 text-xs leading-relaxed font-devanagari font-medium">${escapeHtml(ev.detail_hi)}</p>
      `;
      evidenceList.appendChild(item);
    });
  } else {
    evidenceList.innerHTML = `<div class="p-4 rounded-xl bg-[#FDFBF7] border border-[#E9E2D8] text-stone-500 text-xs italic">No suspicious forensic indicators detected. Document appears clean.</div>`;
  }

  // Legal Rules Violations
  if (data.legal_rule_violations && data.legal_rule_violations.length > 0) {
    legalSection.classList.remove('hidden');
    legalRulesList.innerHTML = '';
    data.legal_rule_violations.forEach(lr => {
      const card = document.createElement('div');
      card.className = "p-4 rounded-2xl bg-white border border-rose-200 space-y-2 hover:border-rose-300 transition shadow-sm";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-rose-900 text-sm flex items-center space-x-1.5">
            <span>⚖️</span>
            <span>${escapeHtml(lr.rule_name)}</span>
          </span>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold border border-rose-300">STATUTORY VIOLATION</span>
        </div>
        <p class="text-[11px] font-mono text-stone-500">Statute: <strong>${escapeHtml(lr.statute)}</strong></p>
        <p class="text-xs text-stone-700 leading-relaxed">${escapeHtml(lr.explanation_en)}</p>
        <p class="text-xs text-stone-800 leading-relaxed font-devanagari font-medium">${escapeHtml(lr.explanation_hi)}</p>
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
        <div class="p-3 rounded-xl bg-white border border-purple-200 space-y-1 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-purple-900">${escapeHtml(p.permission)}</span>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">${p.severity}</span>
          </div>
          <p class="text-stone-700 text-xs">${escapeHtml(p.description_en)}</p>
          <p class="text-stone-800 text-xs font-devanagari font-medium">${escapeHtml(p.description_hi)}</p>
        </div>
      `).join('');
    } else {
      permsHtml = `<p class="text-stone-500 text-xs italic">No high-risk permissions found in manifest.</p>`;
    }

    apkMetadataDetails.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-purple-200 text-xs shadow-sm">
        <div><span class="text-stone-500">File:</span> <strong class="text-stone-900">${escapeHtml(apk.filename)}</strong></div>
        <div><span class="text-stone-500">Trojan Classification:</span> <strong class="text-rose-600">${escapeHtml(apk.trojan_classification || "Generic APK")}</strong></div>
        <div><span class="text-stone-500">Package:</span> <span class="font-mono text-blue-700 font-semibold">${escapeHtml(apk.package_name || "Unknown")}</span></div>
        <div><span class="text-stone-500">Size:</span> <span class="text-stone-700 font-semibold">${(apk.file_size_bytes / 1024).toFixed(1)} KB</span></div>
      </div>
      <div class="mt-3 space-y-2">
        <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">High-Risk Permissions & Hooks:</span>
        <div class="space-y-2">${permsHtml}</div>
      </div>
    `;
  } else {
    apkSection.classList.add('hidden');
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
  updateCharCount();

  if (resultCard) resultCard.classList.add('hidden');
  if (resultPlaceholder) resultPlaceholder.classList.remove('hidden');

  showToast(currentLanguage === 'hi' ? "स्कैनर साफ कर दिया गया है।" : "Scan workbench cleared.");
}

// --- COPY REPORT TO CLIPBOARD ---
function copyReportToClipboard() {
  if (!currentAnalysis) return;

  const textToCopy = currentAnalysis.whatsapp_sos_text || 
    `Kavach AI Verification Report\nVerdict: ${currentAnalysis.threat_level} (Score: ${currentAnalysis.threat_score}/100)\nCategory: ${currentAnalysis.category}\nNational Helpline: 1930\nhttps://cybercrime.gov.in`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(currentLanguage === 'hi' ? "📋 रिपोर्ट क्लिपबोर्ड पर कॉपी हो गई!" : "📋 Report copied to clipboard! (Ready to paste or share)");
  }).catch(() => {
    showToast("Could not copy automatically. Please select text manually.");
  });
}

// --- WEB SPEECH API (Audio Advisory) ---
function toggleAudioAdvisory() {
  if (isAudioPlaying) {
    stopAudioAdvisory();
    return;
  }
  if (!currentAnalysis) return;

  const script = currentLanguage === 'hi' ? currentAnalysis.speech_script_hi : currentAnalysis.speech_script_en;
  if (!script) return;

  if (!('speechSynthesis' in window)) {
    showToast(currentLanguage === 'hi' ? "⚠️ आपके ब्राउज़र में ऑडियो स्पीच समर्थित नहीं है।" : "⚠️ Speech synthesis not supported on your browser.");
    return;
  }

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
  };

  utterance.onend = resetAudioState;
  utterance.onerror = resetAudioState;

  currentSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopAudioAdvisory() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  resetAudioState();
}

function resetAudioState() {
  isAudioPlaying = false;
  if (audioIcon) audioIcon.textContent = '🔊';
  if (audioBtnText) audioBtnText.textContent = currentLanguage === 'hi' ? "हिन्दी में ऑडियो सलाह सुनें" : "Play Calming Voice Advisory";
  if (stopAudioBtn) stopAudioBtn.classList.add('hidden');
  if (audioWaveform) audioWaveform.classList.add('hidden');
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
