/**
 * Kavach AI - Ultra-Modern Frontend Controller
 * Cyber Scam, Digital Arrest & Malicious APK Shield
 */

// Global State
let currentAnalysis = null;
let currentLanguage = 'en'; // 'en' or 'hi'
let selectedFile = null;
let currentSpeechUtterance = null;
let isAudioPlaying = false;

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
      dropZone.classList.add('border-cyan-400', 'bg-cyan-950/40');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-cyan-400', 'bg-cyan-950/40');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-cyan-400', 'bg-cyan-950/40');
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

// --- TAB SWITCHER ---
function switchTab(mode) {
  if (mode === 'text') {
    tabTextBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm transition flex items-center justify-center space-x-2";
    tabFileBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition flex items-center justify-center space-x-2";
    textInputContainer.classList.remove('hidden');
    fileInputContainer.classList.add('hidden');
  } else {
    tabFileBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm transition flex items-center justify-center space-x-2";
    tabTextBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition flex items-center justify-center space-x-2";
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

// --- LANGUAGE SWITCHER ---
function setLanguage(lang) {
  currentLanguage = lang;
  if (lang === 'en') {
    langEnBtn.className = "px-3 py-1 rounded-md bg-cyan-600 text-white font-bold text-xs transition shadow";
    langHiBtn.className = "px-3 py-1 rounded-md text-slate-300 hover:text-white text-xs font-medium transition";
  } else {
    langHiBtn.className = "px-3 py-1 rounded-md bg-cyan-600 text-white font-bold text-xs transition shadow";
    langEnBtn.className = "px-3 py-1 rounded-md text-slate-300 hover:text-white text-xs font-medium transition";
  }
  if (currentAnalysis) {
    renderAnalysis(currentAnalysis);
  }
  showToast(lang === 'hi' ? "भाषा: हिन्दी सेट की गई" : "Language: English active");
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
        showToast("⚠️ Please paste some text or click a quick sample above.");
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
        showToast("⚠️ Please select or drop a file (.apk, .png, .jpg, .pdf).");
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
  if (isLoading) {
    scanSpinner.classList.remove('hidden');
    scanBtnText.textContent = "Scanning Cyber & Legal Signatures...";
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-80', 'cursor-not-allowed');
  } else {
    scanSpinner.classList.add('hidden');
    scanBtnText.textContent = "Run Kavach Forensic Scan";
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
  verdictBanner.className = "glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-500";
  
  let themeClass = 'threat-safe-glow';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let strokeColor = '#10b981';

  if (data.threat_level === 'CRITICAL') {
    themeClass = 'threat-critical-glow';
    badgeColor = 'bg-red-500/20 text-red-200 border-red-500/50';
    strokeColor = '#ef4444';
  } else if (data.threat_level === 'SUSPICIOUS') {
    themeClass = 'threat-suspicious-glow';
    badgeColor = 'bg-amber-500/20 text-amber-200 border-amber-500/50';
    strokeColor = '#f59e0b';
  }

  verdictBanner.classList.add(themeClass);

  // Threat Badge & Title
  threatLevelBadge.className = `text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center space-x-1.5 border ${badgeColor}`;
  threatLevelBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${data.threat_level === 'CRITICAL' ? 'bg-red-400 animate-ping' : 'bg-current'}"></span><span>${data.threat_level} VERDICT</span>`;
  
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
    li.className = "flex items-start space-x-2 text-slate-200";
    li.innerHTML = `<span class="text-cyan-400 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsEnList.appendChild(li);
  });

  actionsHiList.innerHTML = '';
  data.immediate_actions_hi.forEach(act => {
    const li = document.createElement('li');
    li.className = "flex items-start space-x-2 text-amber-200 font-devanagari";
    li.innerHTML = `<span class="text-amber-400 font-bold">›</span><span>${escapeHtml(act)}</span>`;
    actionsHiList.appendChild(li);
  });

  // Forensic Evidence List
  evidenceList.innerHTML = '';
  if (data.evidence_list && data.evidence_list.length > 0) {
    data.evidence_list.forEach(ev => {
      const item = document.createElement('div');
      item.className = "p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col space-y-1.5 hover:border-slate-700 transition";

      const evColor = ev.severity === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border-red-500/40' :
                      ev.severity === 'HIGH' ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                      'bg-slate-800 text-slate-300 border-slate-700';

      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-white text-sm flex items-center space-x-2">
            <span class="text-cyan-400">⚡</span>
            <span>${escapeHtml(ev.indicator)}</span>
          </span>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full border ${evColor}">${ev.severity}</span>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(ev.detail_en)}</p>
        <p class="text-amber-200/90 text-xs leading-relaxed font-devanagari">${escapeHtml(ev.detail_hi)}</p>
      `;
      evidenceList.appendChild(item);
    });
  } else {
    evidenceList.innerHTML = `<div class="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs italic">No suspicious forensic indicators detected. Document appears clean.</div>`;
  }

  // Legal Rules Violations
  if (data.legal_rule_violations && data.legal_rule_violations.length > 0) {
    legalSection.classList.remove('hidden');
    legalRulesList.innerHTML = '';
    data.legal_rule_violations.forEach(lr => {
      const card = document.createElement('div');
      card.className = "p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2 hover:border-red-500/50 transition";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-red-300 text-sm flex items-center space-x-1.5">
            <span>⚖️</span>
            <span>${escapeHtml(lr.rule_name)}</span>
          </span>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-red-900/60 text-red-200 font-extrabold border border-red-500/50">STATUTORY VIOLATION</span>
        </div>
        <p class="text-[11px] font-mono text-slate-400">Statute: <strong>${escapeHtml(lr.statute)}</strong></p>
        <p class="text-xs text-slate-200 leading-relaxed">${escapeHtml(lr.explanation_en)}</p>
        <p class="text-xs text-amber-200/90 leading-relaxed font-devanagari">${escapeHtml(lr.explanation_hi)}</p>
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
        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-red-400">${escapeHtml(p.permission)}</span>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">${p.severity}</span>
          </div>
          <p class="text-slate-300 text-xs">${escapeHtml(p.description_en)}</p>
          <p class="text-amber-200/80 text-xs font-devanagari">${escapeHtml(p.description_hi)}</p>
        </div>
      `).join('');
    } else {
      permsHtml = `<p class="text-slate-400 text-xs italic">No high-risk permissions found in manifest.</p>`;
    }

    apkMetadataDetails.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
        <div><span class="text-slate-500">File:</span> <strong class="text-white">${escapeHtml(apk.filename)}</strong></div>
        <div><span class="text-slate-500">Trojan Classification:</span> <strong class="text-red-400">${escapeHtml(apk.trojan_classification || "Generic APK")}</strong></div>
        <div><span class="text-slate-500">Package:</span> <span class="font-mono text-cyan-300">${escapeHtml(apk.package_name || "Unknown")}</span></div>
        <div><span class="text-slate-500">Size:</span> <span class="text-slate-300">${(apk.file_size_bytes / 1024).toFixed(1)} KB</span></div>
      </div>
      <div class="mt-3 space-y-2">
        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">High-Risk Permissions & Hooks:</span>
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

  showToast("Scan workbench cleared.");
}

// --- COPY REPORT TO CLIPBOARD ---
function copyReportToClipboard() {
  if (!currentAnalysis) return;

  const textToCopy = currentAnalysis.whatsapp_sos_text || 
    `Kavach AI Verification Report\nVerdict: ${currentAnalysis.threat_level} (Score: ${currentAnalysis.threat_score}/100)\nCategory: ${currentAnalysis.category}\nNational Helpline: 1930\nhttps://cybercrime.gov.in`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("📋 Report copied to clipboard! (Ready to paste or share)");
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
    showToast("⚠️ Speech synthesis not supported on your browser.");
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
    if (audioBtnText) audioBtnText.textContent = "Pause Advisory";
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
  if (audioBtnText) audioBtnText.textContent = "Play Calming Voice Advisory";
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
