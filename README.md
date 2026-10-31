# ClickWise — Your Safe Digital Companion & Learning Mirror

> **Build4Better Hackathon 2026 Submission**  
> **Event Date:** October 31, 2026 | **Build Window:** 9:00 AM – 5:00 PM PKT  
> **Platform:** Mobile Application (React Native / Expo)

---

## 📌 Project Overview

**ClickWise** is an interactive mobile learning sandbox and voice companion designed for older adults, parents, and non-technical individuals who feel intimidated by modern digital interfaces.

Instead of performing digital tasks on behalf of users or displaying passive video tutorials, **ClickWise provides a safe, interactive practice environment**. Users learn everyday digital skills—such as managing banking session logouts, troubleshooting video call permissions, filling out government forms, and spotting scam messages—through step-by-step visual guidance, bilingual voice prompts (English & Urdu), and zero risk of making costly mistakes.

---

## 🎯 Target Audience & Problem Addressed

### The Problem

Most software is designed for digital natives. Non-technical users often face severe friction:

1. **Banking Apps:** Unexpected session timeouts cause panic; confusing OTP/password requirements lead to anxiety or falling victim to fraud.
2. **Video Calls:** Mic/camera permission blocks and silent audio lead to frustration and isolation.
3. **Government Portals:** Dense jargon, unclear instructions, and fear of submitting incorrect information hinder access to essential public services.
4. **Scams & Phishing:** Aggressive urgency tactics, fake bank alerts, and deceptive links make it hard to distinguish legitimate communications from fraud.

### Our Solution

ClickWise empowers non-technical users to build genuine **digital confidence and independence** by transforming intimidating tasks into interactive, stress-free simulations with real-time visual overlays and empathetic voice feedback.

---

## ✨ Key Features & Capabilities

### 1. 🏦 Interactive Banking Practice Hub

- **Session Expiration Explainer:** Simulates real-time session timeouts and explains in plain language _why_ banks log users out (to protect funds).
- **Safe OTP & Login Practice:** Interactive sandbox to practice entering 6-digit SMS verification keys without real financial risk.
- **Security Guardrails:** Reassures users and continuously reinforces that official bank staff will _never_ request passwords or OTPs.

### 2. 📹 Video Call Pre-Flight Diagnostic

- **Permissions Helper:** Visual guide that points directly to device camera and microphone toggles.
- **Live Audio/Video Test:** Integrated preview box giving instant positive voice confirmation (_"Great! Your mic is working clearly"_).

### 3. 📝 Government Portal Form Helper

- **Plain-Language Jargon Translator:** Converts terms like _"Beneficiary CNIC"_ or _"Domicile"_ into simple Urdu/English cards.
- **Step-by-Step Flow:** Breaks multi-page forms into manageable single questions.
- **Pre-Submission Review:** Displays a clear review card reassuring the user that no data is submitted until they explicitly approve it.

### 4. 🛡️ Scam Shield & Visual Inspector (Standout AI Innovation)

- **Multimodal Screenshot Reasoning:** Powered by **Gemini 2.5 Flash**, users can upload screenshots or paste text from suspicious SMS messages or emails.
- **Dynamic Visual Hotspots:** Renders highlighted callout rings over red-flag areas (e.g., artificial urgency, suspicious web links, impersonation tactics).
- **Educational Explanations:** Explains _why_ a message looks dangerous rather than just giving a binary "scam" label.

### 5. 🌍 Accessibility & Inclusivity First

- **Bilingual Switch:** One-tap toggle between **English** and **Urdu (اردو)** across all text and voice prompts.
- **Large Typography & High Contrast:** Designed specifically for older eyes (minimum 20pt readable text, large touch targets).
- **Voice Assistance:** Native Speech Synthesis integration providing warm, reassuring audio guidance.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Framework:** React Native / Expo (Expo Router)
- **Styling & UI:** Tailwind CSS / React Native StyleSheet API
- **AI Engine:** Google Gemini 2.5 Flash (`@google/genai` SDK)
- **Voice Engine:** Web Speech API / Native Speech Synthesis
- **State & Localization:** React Context API (`LanguageContext`)
- **Icons & Assets:** Lucide React Native / Expo Vector Icons

```
+-----------------------------------------------------------------+
|                       ClickWise MOBILE APP                           |
+-----------------------------------------------------------------+
|   Bilingual UI / Voice Engine (English & Urdu - LanguageContext) |
+--------------------------------+--------------------------------+
|       PRACTICE SIMULATORS      |        AI SCAM SHIELD          |
|  - Simulated Banking Session   |  - Gemini 2.5 Flash Vision     |
|  - Pre-Call Diagnostics        |  - Multimodal Screenshot Scan   |
|  - Gov Form Plain Language     |  - Dynamic JSON Hotspots       |
+--------------------------------+--------------------------------+
```

---

## 🤖 Gemini AI Prompt Architecture

Gemini 2.5 Flash acts as ClickWise's core context reasoner for the Scam Shield module. It receives screenshots or raw text and returns a structured JSON payload for dynamic UI rendering.

### System Prompt Example

```text
You are ClickWise, an empathetic, clear, and reassuring AI assistant helping non-technical older adults understand technology.

RULES:
1. Speak in plain, warm, everyday language. Avoid technical jargon.
2. NEVER request, store, or ask users to input real passwords, PINs, or OTPs.
3. For scam analysis, break down suspicion factors into: Urgency, Impersonation, Suspicious Links, and Unsafe Requests.
4. Always provide responses in both English and Urdu.

Return JSON in the following format:
{
  "safetyRating": "SUSPICIOUS",
  "confidenceScore": 88,
  "explanationEn": "This message creates fake urgency by claiming your bank account will be blocked today.",
  "explanationUr": "یہ پیغام آپ کے بینک اکاؤنٹ کو بلاک کرنے کی جعلی دھمکی دے کر آپ کو پریشان کرنے کی کوشش کر رہا ہے۔",
  "hotspots": [
    {
      "element": "Urgent Action Text",
      "reasonEn": "Scammers use phrases like 'Immediately' to panic you.",
      "reasonUr": "جعلساز آپ کو گھبرانے کے لیے 'فوری طور پر' جیسے الفاظ استعمال کرتے ہیں۔"
    }
  ]
}
```

---

## ⚡ Setup & Local Execution Instructions

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn
- Expo Go app on iOS/Android (optional for mobile device testing)

### Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/YOUR_ORGANIZATION/clickwise.git
   cd clickwise
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Automated Architecture Setup (Windows PowerShell / Node):**

   ```powershell
   node setup.js
   ```

5. **Start the Development Server:**

   ```bash
   npx expo start
   ```

6. **View the App:**
   - Scan the QR code using the **Expo Go** app on your phone.
   - Or press `w` in the terminal to run in a web browser viewport.

---

## 🤖 AI Tools & Third-Party Credits Disclosure

In compliance with section 6 of the Build4Better Rulebook:

- **Google Gemini API (`gemini-2.5-flash`):** Used for multimodal screenshot inspection, scam reasoning, and structured JSON generation.
- **Expo Router & React Native:** Framework for mobile application structure and cross-platform layout.
- **AI Coding Assistants:** Used during ideation, architectural setup, and TypeScript interface definition.

---

## ⚠️ Known Limitations & Mocked Features

To fit the 8-hour hackathon build window without compromising security or usability:

1. **Simulated Banking Environment:** Real banking APIs are strictly simulated to ensure total safety and avoid handling real sensitive financial data.
2. **Preset Scam Screenshots:** Includes pre-configured real-world scam examples for reliable offline/demo presentation alongside live API uploads.
3. **Browser Permission Toggles:** Camera/Mic diagnostics simulate OS-level permission popups in the practice hub.

---

## 📌 Final Commit Identifier

- **Submitted Commit Hash:** `[INSERT_YOUR_FINAL_COMMIT_HASH_HERE]`
- **Submission Deadline:** October 31, 2026 @ 5:00 PM PKT

---

_Made with ❤️ for Build4Better Hackathon 2026 by Team ClickWise._
