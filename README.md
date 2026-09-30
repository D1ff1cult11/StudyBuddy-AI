<p align="center">
  <h1 align="center">StudyBuddy AI 🧠</h1>
</p>

<p align="center">
  <strong>Turn messy handwritten notes into smart, interactive flashcards in seconds.</strong><br>
  Built for the <em>RevenueCat Ship-a-ton 2026</em> (Next Gen Award).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/RevenueCat-F55F44?style=for-the-badge&logo=revenuecat&logoColor=white" alt="RevenueCat" />
</p>

---

## 🚀 The Vision
Students waste hundreds of hours manually copying notes into flashcards. **StudyBuddy AI** solves this by letting you snap a photo of your notes and instantly generating interactive, 3D-physics based flashcards using Google's Gemini AI. 

To build a sustainable business, StudyBuddy integrates **RevenueCat** to offer a premium subscription tier, unlocking unlimited AI scans, PDF exports, and spaced repetition analytics.

## ✨ Features
- 📸 **Magic Scan:** Simulates OCR and leverages the Gemini REST API to extract educational concepts from raw text.
- 🗂️ **Interactive Study Decks:** A beautiful, physics-based 3D flashcard swiping interface built with Framer Motion.
- 💾 **Local First:** Decks are persisted seamlessly into `localStorage` so you never lose your study materials.
- 💎 **Premium Paywall:** An integrated RevenueCat-inspired paywall flow offering a $29.99/year Pro tier.
- 🛡️ **PII Scrubbing:** Built-in Agent harness that scrubs emails and phone numbers before sending data to the LLM (Security-first principle).

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Vanilla CSS (Premium Dark Mode Glassmorphism)
- **Animations:** Framer Motion, Lucide React Icons
- **AI Backend:** Google Gemini 1.5 Flash API
- **Monetization UI:** RevenueCat (Simulated Checkout)

## 🏎️ Getting Started

### Prerequisites
- Node.js 18+
- (Optional) Google Gemini API Key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/studybuddy-ai.git
   cd studybuddy-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables**
   Rename `.env.example` to `.env` and add your Gemini API key (the app will fall back to mock data if no key is provided).
   \`\`\`env
   VITE_AI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Visit \`http://localhost:3000\` to see the app!

## 🏆 Hackathon Notes
This project was built following elite Agent OS principles (Immutability, PII scrubbing, Agent-First architecture). It leverages a premium, mobile-first design strategy suitable for a Vercel/Netlify SPA deployment.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
