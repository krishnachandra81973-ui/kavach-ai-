"""
Pillar 3: Malicious APK & Banking Trojan Static Analyzer
Inspects APK ZIP structures, AndroidManifest.xml string pools, declared permissions,
and deceptive social engineering filenames (Wedding_Card.apk, Electricity_Bill.apk).
"""
import io
import re
import zipfile
from typing import Dict, Any, List, Set, Optional
from app.models.schemas import MaliciousPermission, APKMetadata, ForensicEvidence
from app.config import DANGEROUS_PERMISSIONS, SUSPICIOUS_APK_PATTERNS


class APKAnalyzer:
    """
    Static forensic analyzer for Android APK packages and deceptive droppers.
    """

    # High risk combinations that characterize Indian Banking Trojans (ClayRAT, Raccoon, SmsStealer)
    TROJAN_SIGNATURE_SETS = [
        {
            "name": "SMS-Banking OTP Interceptor",
            "required": {"android.permission.RECEIVE_SMS", "android.permission.READ_SMS"},
            "severity": "CRITICAL",
            "desc_en": "Trojan capability to intercept two-factor authentication (OTP) and bank transaction alerts.",
            "desc_hi": "बैंक ओटीपी और दो-चरणीय प्रमाणीकरण संदेशों को चोरी करने की गंभीर क्षमता।"
        },
        {
            "name": "Accessibility Service Screen Takeover",
            "required": {"android.permission.BIND_ACCESSIBILITY_SERVICE"},
            "severity": "CRITICAL",
            "desc_en": "Abuses Accessibility Services to observe user screen, log passwords, and auto-grant permissions.",
            "desc_hi": "एक्सेसिबिलिटी सेवा का दुरुपयोग करके स्क्रीन रिकॉर्डिंग और गुप्त पासवर्ड चोरी करने का प्रयास।"
        },
        {
            "name": "Phishing Overlay Trojan",
            "required": {"android.permission.SYSTEM_ALERT_WINDOW"},
            "severity": "HIGH",
            "desc_en": "Capable of rendering deceptive overlay screens over banking or UPI payment apps.",
            "desc_hi": "असली बैंक या UPI ऐप के ऊपर नकली स्क्रीन प्रदर्शित करके क्रेडेंशियल चुराने की क्षमता।"
        },
        {
            "name": "Stealth Dropper / Downloader",
            "required": {"android.permission.REQUEST_INSTALL_PACKAGES"},
            "severity": "HIGH",
            "desc_en": "Allows silent installation of secondary malicious payloads without Google Play vetting.",
            "desc_hi": "बिना गूगल प्ले सुरक्षा जांच के फोन में अतिरिक्त हानिकारक ऐप इंस्टॉल करने की क्षमता।"
        }
    ]

    @classmethod
    def extract_strings_from_bytes(cls, data: bytes, min_len: int = 4) -> List[str]:
        """
        Extract printable ASCII/UTF-8 strings from binary data (works on AXML binary XML, DEX, ARSC).
        """
        # Look for sequences of printable characters
        pattern = re.compile(rb"[\x20-\x7e]{" + str(min_len).encode() + rb",}")
        raw_matches = pattern.findall(data)
        extracted = []
        for match in raw_matches:
            try:
                decoded = match.decode("utf-8", errors="ignore").strip()
                if decoded:
                    extracted.append(decoded)
            except Exception:
                continue
        return extracted

    @classmethod
    def check_filename_risk(cls, filename: str) -> Dict[str, Any]:
        """
        Check if the APK filename mimics known social-engineering lures in India.
        """
        filename_str = str(filename) if filename else ""
        clean_name = filename_str.lower()
        is_suspicious_name = False
        matched_pattern = ""

        for pattern in SUSPICIOUS_APK_PATTERNS:
            if re.search(pattern, clean_name):
                is_suspicious_name = True
                matched_pattern = pattern
                break

        return {
            "is_suspicious_name": is_suspicious_name,
            "matched_pattern": matched_pattern,
        }

    @classmethod
    def analyze_bytes(cls, file_bytes: bytes, filename: str = "sample.apk") -> Dict[str, Any]:
        """
        Analyze APK raw bytes via static extraction.
        """
        filename_str = str(filename) if filename else "sample.apk"
        file_size = len(file_bytes)
        score = 0
        evidence: List[ForensicEvidence] = []
        dangerous_perms_found: List[MaliciousPermission] = []
        detected_indicators: List[str] = []
        package_name: Optional[str] = None
        is_valid_zip = False
        all_perms_found: Set[str] = set()

        # 1. Filename heuristic
        name_risk = cls.check_filename_risk(filename_str)
        if name_risk["is_suspicious_name"]:
            score += 35
            detected_indicators.append(f"Deceptive Indian Social Engineering Lure: {filename_str}")
            evidence.append(ForensicEvidence(
                indicator="Deceptive APK Lure (Wedding Card / Utility Scam)",
                severity="HIGH",
                detail_en=f"File name '{filename_str}' mimics deceptive lures (e.g. Wedding invitation, Electricity bill update, Challan payment) used to spread malware via WhatsApp.",
                detail_hi=f"फाइल का नाम '{filename_str}' शादी के निमंत्रण या बिजली बिल जैसे लोकप्रिय धोखे की नकल कर रहा है।"
            ))

        # 2. Check if valid ZIP / APK structure
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes), "r") as z:
                is_valid_zip = True
                namelist = z.namelist()

                # Verify core Android structures
                has_manifest = "AndroidManifest.xml" in namelist
                has_dex = any(name.endswith(".dex") for name in namelist)

                if has_manifest:
                    detected_indicators.append("Standard Android Manifest Found")
                if has_dex:
                    detected_indicators.append(f"Executable Dalvik Bytecode (.dex) Present ({sum(1 for n in namelist if n.endswith('.dex'))} files)")

                # Extract strings from AndroidManifest.xml
                manifest_strings: List[str] = []
                manifest_raw_text = ""
                if has_manifest:
                    manifest_data = z.read("AndroidManifest.xml")
                    manifest_strings = cls.extract_strings_from_bytes(manifest_data)
                    manifest_raw_text = manifest_data.decode("utf-8", errors="ignore")

                # Read and extract strings from all .dex files in the ZIP archive
                dex_strings: List[str] = []
                for name in namelist:
                    if name.endswith(".dex"):
                        try:
                            dex_data = z.read(name)
                            dex_strings.extend(cls.extract_strings_from_bytes(dex_data))
                        except Exception:
                            continue

                # Combine manifest strings and DEX bytecode strings
                strings_to_scan = manifest_strings + dex_strings
                if not strings_to_scan:
                    # Fallback to scanning first 2MB of entire archive
                    strings_to_scan = cls.extract_strings_from_bytes(file_bytes[:2_000_000])

                # Identify package name if present
                pkg_match = re.search(r'package="([^"]+)"', manifest_raw_text)
                if pkg_match:
                    package_name = pkg_match.group(1)
                else:
                    for s in strings_to_scan:
                        if re.match(r"^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*){2,}$", s):
                            if not package_name and not s.startswith("android.") and not s.startswith("java."):
                                package_name = s

                # Match dangerous permissions via regex across manifest and strings
                all_text_blobs = [manifest_raw_text] + strings_to_scan
                for blob in all_text_blobs:
                    found_perms = re.findall(r"android\.permission\.[A-Za-z0-9_]+", blob)
                    for perm in found_perms:
                        all_perms_found.add(perm)
                        if perm in DANGEROUS_PERMISSIONS:
                            perm_meta = DANGEROUS_PERMISSIONS[perm]
                            if not any(dp.permission == perm for dp in dangerous_perms_found):
                                dangerous_perms_found.append(MaliciousPermission(
                                    permission=perm,
                                    severity=perm_meta["severity"],
                                    description_en=perm_meta["description_en"],
                                    description_hi=perm_meta["description_hi"]
                                ))

                # Scan for Command & Control (C2) / Telegram bot strings
                combined_scan_text = (manifest_raw_text + " " + " ".join(strings_to_scan)).lower()
                if "api.telegram.org/bot" in combined_scan_text:
                    score += 35
                    detected_indicators.append("Hardcoded Telegram Bot C2 Communication Endpoint")
                    evidence.append(ForensicEvidence(
                        indicator="Telegram Bot Command & Control (C2)",
                        severity="CRITICAL",
                        detail_en="APK contains hardcoded Telegram Bot API endpoints used by attackers to exfiltrate stolen SMS OTPs.",
                        detail_hi="इस ऐप में टेलीग्राम बॉट का लिंक मिला है जिसका उपयोग ओटीपी चुराने के लिए किया जाता है।"
                    ))
                if any(k in combined_scan_text for k in ["smsprocessor", "smsreceiver", "smsforward"]):
                    detected_indicators.append("SMS Exfiltration Routine Found in Manifest/Code")

        except zipfile.BadZipFile:
            # File might not be a valid zip, or could be a raw text/script/corrupt APK
            detected_indicators.append("File is not a valid ZIP/APK archive (possibly disguised or truncated)")
            # If the filename ends with .apk or matches suspicious lures, it's already an alert
            if filename_str.lower().endswith(".apk"):
                score += 20
                evidence.append(ForensicEvidence(
                    indicator="Disguised or Non-Standard APK File",
                    severity="HIGH",
                    detail_en="File claims to be an APK application but lacks valid Android ZIP structure.",
                    detail_hi="फाइल APK होने का दावा करती है लेकिन वैध एंड्रॉइड संरचना मौजूद नहीं है।"
                ))

        # 3. Evaluate Trojan Signatures
        trojan_classification = None
        has_sms_stealer = "android.permission.RECEIVE_SMS" in all_perms_found or "android.permission.READ_SMS" in all_perms_found
        has_accessibility = "android.permission.BIND_ACCESSIBILITY_SERVICE" in all_perms_found
        has_overlay = "android.permission.SYSTEM_ALERT_WINDOW" in all_perms_found

        if has_sms_stealer and has_accessibility:
            trojan_classification = "High-Threat Banking RAT (SMS Theft + Full Screen Hijack)"
            score += 50
        elif has_sms_stealer:
            trojan_classification = "SMS Stealer Trojan (OTP Interceptor)"
            score += 40
        elif has_accessibility:
            trojan_classification = "Accessibility Spyware / RAT"
            score += 35
        elif dangerous_perms_found:
            trojan_classification = "Suspicious Utility with Elevated Privileges"
            score += 25

        # Add evidence for dangerous permissions found
        for dp in dangerous_perms_found:
            if dp.severity == "CRITICAL":
                score += 20
            elif dp.severity == "HIGH":
                score += 10
            evidence.append(ForensicEvidence(
                indicator=f"Dangerous Permission: {dp.permission.replace('android.permission.', '')}",
                severity=dp.severity,
                detail_en=dp.description_en,
                detail_hi=dp.description_hi
            ))

        score = min(score, 100)
        is_malicious = bool(score >= 50 or trojan_classification is not None)

        apk_metadata = APKMetadata(
            filename=filename_str,
            file_size_bytes=file_size,
            is_valid_zip=is_valid_zip,
            package_name=package_name or "Unknown / Obfuscated",
            dangerous_permissions=dangerous_perms_found,
            detected_indicators=detected_indicators,
            trojan_classification=trojan_classification,
        )

        return {
            "score": score,
            "is_malicious": is_malicious,
            "metadata": apk_metadata,
            "evidence": evidence,
        }
