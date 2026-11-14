/**
 * Kavach AI Frontend Controller
 * Handles UI events, tab switching, file drops, Web Speech API audio playback,
 * WhatsApp SOS formatting, and forensic results rendering.
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
const threatProgressBar = document.getElementById('threatProgressBar');
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
const langEnBtn = document.getElementById('langEnBtn');
const langHiBtn = document.getElementById('langHiBtn');

// Preloaded Samples
const SAMPLES = {
  sample_digital_arrest: {
    type: 'text',
    text: "OFFICIAL WARRANT OF ARREST - CENTRAL BUREAU OF INVESTIGATION (CBI) & MUMBAI POLICE CYBER CELL.\n" +
          "To: Citizen, We have intercepted an illegal parcel sent from Taiwan containing 140 grams MDMA and 5 fake passports in your name.\n" +
          "A non-bailable warrant of arrest is issued under CrPC Section 41. You are placed under DIGITAL ARREST immediately.\n" +
          "INSTRUCTIONS: Connect to Skype video call immediately for confidential interrogation. Keep camera on 24 hours. " +
          "Do not inform family or legal counsel. To clear your name from money laundering charges, transfer refundable safety security deposit " +
          "of Rs 2,50,000 to RBI Clearance Account within 2 hours. Failure will lead to immediate physical commando raid."
  },
  sample_free_recharge: {
    type: 'text',
    text: "🎉 PM Narendra Modi Free 5G Recharge Offer 2026! 🎉\n" +
          "Government of India is giving 3 Months (84 Days) Free Recharge to all Jio, Airtel, and Vi users!\n" +
          "Claim your free 5G unlimited recharge immediately before the offer expires tonight.\n" +
          "Click here to activate: http://jio-free-5g-recharge.online/claim\n" +
          "Note: Forward this message to 5 WhatsApp groups or 10 friends to unlock your free recharge voucher code instantly!"
  },
  sample_wedding_apk: {
    type: 'text',
    text: "Namaste Uncle, our wedding card invitation and venue location photos are in this application. " +
          "Please download and install Wedding_Card_Invitation.apk on your Android phone to view the wedding album and RSVP.",
    suggestedFilename: "Wedding_Card_Invitation.apk"
  },
  sample_legitimate: {
    type: 'text',
    text: "Dear Consumer, your payment of Rs 1,420 for Consumer No 0098765432 has been received successfully on 12-Nov-2026. " +
          "Transaction Reference: TXN9876543210. You can download the official tax invoice at https://delhipolice.gov.in or https://bsesdelhi.com. " +
          "Thank you for using BSES Yamuna Power Limited."
  }
};

// --- TAB SWITCHING ---
tabTextBtn.addEventListener('click', () => {
  tabTextBtn.classList.add('border-cyan-500', 'text-cyan-400');
  tabTextBtn.classList.remove('border-transparent', 'text-slate-400');
  tabFileBtn.classList.remove('border-cyan-500', 'text-cyan-400');
  tabFileBtn.classList.add('border-transparent', 'text-slate-400');
  textInputContainer.classList.remove('hidden');
  fileInputContainer.classList.add('hidden');
});

tabFileBtn.addEventListener('click', () => {
  tabFileBtn.classList.add('border-cyan-500', 'text-cyan-400');
  tabFileBtn.classList.remove('border-transparent', 'text-slate-400');
  tabTextBtn.classList.remove('border-cyan-500', 'text-cyan-400');
  tabTextBtn.classList.add('border-transparent', 'text-slate-400');
  fileInputContainer.classList.remove('hidden');
  textInputContainer.classList.add('hidden');
});

// --- FILE UPLOAD & DRAG/DROP ---
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-cyan-500', 'bg-cyan-950/20');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-cyan-500', 'bg-cyan-950/20');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-cyan-500', 'bg-cyan-950/20');
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    handleFileSelected(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    handleFileSelected(e.target.files[0]);
  }
});

function handleFileSelected(file) {
  selectedFile = file;
  fileNameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  fileSelectedDisplay.classList.remove('hidden');
}

clearFileBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  fileSelectedDisplay.classList.add('hidden');
});

// --- LANGUAGE SWITCHER ---
langEnBtn.addEventListener('click', () => {
  currentLanguage = 'en';
  langEnBtn.classList.add('bg-cyan-600', 'text-white', 'font-bold');
  langEnBtn.classList.remove('text-slate-300');
  langHiBtn.classList.remove('bg-cyan-600', 'text-white', 'font-bold');
  langHiBtn.classList.add('text-slate-300');
  if (currentAnalysis) renderAnalysis(currentAnalysis);
});

langHiBtn.addEventListener('click', () => {
  currentLanguage = 'hi';
  langHiBtn.classList.add('bg-cyan-600', 'text-white', 'font-bold');
  langHiBtn.classList.remove('text-slate-300');
  langEnBtn.classList.remove('bg-cyan-600', 'text-white', 'font-bold');
  langEnBtn.classList.add('text-slate-300');
  if (currentAnalysis) renderAnalysis(currentAnalysis);
});

// --- SAMPLE LOADER ---
function loadSample(sampleId) {
  const sample = SAMPLES[sampleId];
  if (!sample) return;

  // Switch to text mode
  tabTextBtn.click();
  textInput.value = sample.text;

  // Auto trigger scan for smooth demonstration
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
        alert("Please paste text or click one of the quick samples above.");
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
        alert("Please select or drop a file (.apk, .png, .jpg, .pdf).");
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
      throw new Error(err.detail || "Analysis request failed.");
    }

    const data = await response.json();
    currentAnalysis = data;
    renderAnalysis(data);

  } catch (err) {
    console.error("Scan error:", err);
    alert(`Error running scan: ${err.message}`);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    scanSpinner.classList.remove('hidden');
    scanBtnText.textContent = "Analyzing Forensic Signatures...";
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-75');
  } else {
    scanSpinner.classList.add('hidden');
    scanBtnText.textContent = "Run Kavach Forensic Scan";
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove('opacity-75');
  }
}

// --- RENDER ANALYSIS RESULT ---
function renderAnalysis(data) {
  resultPlaceholder.classList.add('hidden');
  resultCard.classList.remove('hidden');

  // Verdict Theme
  verdictBanner.className = "border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300";
  if (data.threat_level === 'CRITICAL') {
    verdictBanner.classList.add('threat-critical');
    threatProgressBar.className = "h-full bg-red-500 transition-all duration-700";
  } else if (data.threat_level === 'SUSPICIOUS') {
    verdictBanner.classList.add('threat-suspicious');
    threatProgressBar.className = "h-full bg-amber-500 transition-all duration-700";
  } else {
    verdictBanner.classList.add('threat-safe');
    threatProgressBar.className = "h-full bg-emerald-500 transition-all duration-700";
  }

  // Titles & Badge
  threatLevelBadge.textContent = `${data.threat_level} VERDICT`;
  verdictTitle.textContent = currentLanguage === 'hi' ? data.title_hi : data.title_en;
  engineBadge.textContent = `Engine: ${data.engine_used}`;

  // Threat Score display with bar animation
  threatScoreDisplay.textContent = data.threat_score;
  threatProgressBar.style.width = `${Math.max(5, data.threat_score)}%`;

  // Summaries
  summaryEn.textContent = data.summary_en;
  summaryHi.textContent = data.summary_hi;

  // Immediate Action Checklist
  actionsEnList.innerHTML = '';
  data.immediate_actions_en.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act;
    actionsEnList.appendChild(li);
  });

  actionsHiList.innerHTML = '';
  data.immediate_actions_hi.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act;
    actionsHiList.appendChild(li);
  });

  // Forensic Evidence
  evidenceList.innerHTML = '';
  if (data.evidence_list && data.evidence_list.length > 0) {
    data.evidence_list.forEach(ev => {
      const item = document.createElement('div');
      item.className = "p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col space-y-1";

      const badgeColor = ev.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border-red-500/30' :
                         ev.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-500/30' :
                         'bg-slate-800 text-slate-300 border-slate-700';

      item.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-100">${escapeHtml(ev.indicator)}</span>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeColor}">${ev.severity}</span>
        </div>
        <p class="text-slate-300 text-[11px]">${escapeHtml(ev.detail_en)}</p>
        <p class="text-amber-200/80 text-[11px] font-devanagari">${escapeHtml(ev.detail_hi)}</p>
      `;
      evidenceList.appendChild(item);
    });
  } else {
    evidenceList.innerHTML = `<p class="text-slate-500 italic">No malicious forensic indicators observed.</p>`;
  }

  // Legal Rule Violations (Pillar 1)
  if (data.legal_rule_violations && data.legal_rule_violations.length > 0) {
    legalSection.classList.remove('hidden');
    legalRulesList.innerHTML = '';
    data.legal_rule_violations.forEach(lr => {
      const card = document.createElement('div');
      card.className = "p-3 rounded-xl bg-red-950/30 border border-red-500/30 space-y-1";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-red-300">${escapeHtml(lr.rule_name)}</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-200 font-bold border border-red-500/40">VIOLATION</span>
        </div>
        <p class="text-[10px] font-semibold text-slate-400">Statute: ${escapeHtml(lr.statute)}</p>
        <p class="text-[11px] text-slate-200">${escapeHtml(lr.explanation_en)}</p>
        <p class="text-[11px] text-amber-200/90 font-devanagari">${escapeHtml(lr.explanation_hi)}</p>
      `;
      legalRulesList.appendChild(card);
    });
  } else {
    legalSection.classList.add('hidden');
  }

  // APK Findings (Pillar 3)
  if (data.apk_analysis) {
    apkSection.classList.remove('hidden');
    const apk = data.apk_analysis;
    let permsHtml = '';
    if (apk.dangerous_permissions && apk.dangerous_permissions.length > 0) {
      permsHtml = apk.dangerous_permissions.map(p => `
        <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-red-400">${escapeHtml(p.permission)}</span>
            <span class="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/30">${p.severity}</span>
          </div>
          <p class="text-slate-300 text-[11px]">${escapeHtml(p.description_en)}</p>
          <p class="text-amber-200/80 text-[11px] font-devanagari">${escapeHtml(p.description_hi)}</p>
        </div>
      `).join('');
    } else {
      permsHtml = `<p class="text-slate-400 italic">No declared high-risk permissions found.</p>`;
    }

    apkMetadataDetails.innerHTML = `
      <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div><span class="text-slate-500">File:</span> <strong class="text-slate-200">${escapeHtml(apk.filename)}</strong></div>
        <div><span class="text-slate-500">Classification:</span> <strong class="text-red-400">${escapeHtml(apk.trojan_classification || "Generic APK")}</strong></div>
        <div><span class="text-slate-500">Package:</span> <span class="font-mono text-slate-300">${escapeHtml(apk.package_name || "Unknown")}</span></div>
        <div><span class="text-slate-500">Size:</span> <span class="text-slate-300">${(apk.file_size_bytes / 1024).toFixed(1)} KB</span></div>
      </div>
      <div class="mt-2 space-y-2">
        <span class="font-semibold text-slate-300">Dangerous Permissions & Hooks:</span>
        <div class="space-y-1.5">${permsHtml}</div>
      </div>
    `;
  } else {
    apkSection.classList.add('hidden');
  }

  // WhatsApp SOS Trigger Link
  if (data.whatsapp_sos_text) {
    const encoded = encodeURIComponent(data.whatsapp_sos_text);
    whatsappSosBtn.href = `https://api.whatsapp.com/send?text=${encoded}`;
  }
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
    alert("Audio speech synthesis is not supported on your browser.");
    return;
  }

  window.speechSynthesis.cancel(); // clear queue

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.95; // calming and clear pace
  utterance.pitch = 1.0;

  // Pick Hindi or English voice if available
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
    audioIcon.textContent = '🔊';
    audioBtnText.textContent = "Playing Advisory...";
    stopAudioBtn.classList.remove('hidden');
  };

  utterance.onend = () => {
    resetAudioState();
  };

  utterance.onerror = () => {
    resetAudioState();
  };

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
  audioIcon.textContent = '🔊';
  audioBtnText.textContent = "Play Calming Audio (हिन्दी / EN)";
  stopAudioBtn.classList.add('hidden');
}

// Ensure voices load in Chromium
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
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
