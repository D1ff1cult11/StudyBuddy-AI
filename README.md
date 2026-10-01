<p align="center">
  <h1 align="center">StudyBuddy AI 🧠⚡</h1>
</p>

<p align="center">
  <strong>Snap messy lecture notes → AI flashcards with Gemini Live voice tutoring, SuperMemo SM-2 spaced repetition, Canvas LMS sync, and RevenueCat Pro monetization.</strong><br>
  <em>Built by a 19-year-old student builder from India for the <strong>RevenueCat Ship-a-ton 2026 (Next Gen Award)</strong>.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tests-32%20Passing-brightgreen?style=for-the-badge&logo=vitest" alt="Vitest Tests" />
  <img src="https://img.shields.io/badge/RevenueCat-SDK%20v1.67-orange?style=for-the-badge&logo=revenuecat" alt="RevenueCat" />
  <img src="https://img.shields.io/badge/React%2019-Vite%208-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini%201.5-Multimodal%20Vision-purple?style=for-the-badge&logo=googlebard" alt="Gemini" />
  <img src="https://img.shields.io/badge/Capacitor%208-iOS%20%26%20Android-green?style=for-the-badge&logo=capacitor" alt="Capacitor" />
</p>

---

## 🎯 The Mission & Next Gen Story

As a **19-year-old student developer from India**, college life means managing massive syllabi, hundreds of lecture slides, and high-pressure exams. Watching classmates pull 3:00 AM all-nighters rereading textbooks only to suffer the brutal **70% 24-hour decay of the Ebbinghaus Forgetting Curve**, I decided to engineer a true learning operating system.

**StudyBuddy AI** bridges cognitive learning science (SuperMemo SM-2), on-device privacy (PII scrubbing), real-time conversational voice tutoring, and sustainable, student-friendly monetization powered by **RevenueCat** with Purchasing Power Parity (₹999/yr in India vs $29.99/yr globally).

---

## ✨ 10 Production Modules

1. 📸 **Multimodal Note Scanner** — Snap messy handwritten notes or textbook diagrams; Google Gemini 1.5 Flash vision extracts high-yield flashcards with mnemonics.
2. 💳 **RevenueCat Pro Monetization** — Integrated with `@revenuecat/purchases-js` with live entitlement checking (`pro`), dynamic offerings, Restore Purchases, and a 50% Off Student Pass.
3. 🎙️ **Gemini Live Voice Tutor** — Hands-free audio tutoring agent reading cards aloud, evaluating spoken recall, and delivering Socratic spoken feedback.
4. 🧠 **SuperMemo SM-2 Cognitive Engine** — 4-tier calibration (`Again`, `Hard`, `Good`, `Easy`) dynamically adjusting Ease Factors ($EF \ge 1.3$) and scheduling intervals.
5. 🛡️ **PII Security Shield** — Client-side regex scrubber sanitizing emails, Indian (+91 10-digit) & international phone numbers, and SSNs before LLM dispatch.
6. 🎓 **Canvas & Blackboard LMS Sync** — 1-click import of university course syllabi and modules with gradebook passback.
7. 🏟️ **Collaborative Study Arena** — Synchronized Pomodoro sprints with Supabase Realtime presence and global campus leaderboards (IIT, MIT, Stanford, Oxford).
8. 🧩 **AI Diagnostic Quiz** — Instant multiple-choice quizzes with explanations and mastery tracking.
9. 🎵 **Procedural Web Audio Engine** — Zero-asset, zero-latency micro-haptics synthesized purely via Web Audio API oscillators.
10. 📱 **Native Mobile Ready** — Configured with Capacitor 8 for immediate iOS and Android deployment.

---

## 🧪 Rigorous Automated Testing (32 / 32 Passing)

StudyBuddy AI follows strict Test-Driven Development (TDD) principles:

```bash
npm test
```

```
✓ src/__tests__/spaced-repetition.test.ts  (14 tests)  — SuperMemo SM-2 interval & EF math
✓ src/__tests__/ai-agent.test.ts           (7 tests)   — PII regex scrubbing & immutability
✓ src/__tests__/revenuecat.test.ts         (7 tests)   — Entitlements, offerings & fallbacks
✓ src/__tests__/supabase-realtime.test.ts  (4 tests)   — Realtime presence & broadcast
========================================================================================
Test Files  4 passed (4)
Tests       32 passed (32)
```

---

## 🛠️ Tech Architecture

```
src/
├── __tests__/              # 32 Vitest unit tests
│   ├── ai-agent.test.ts
│   ├── revenuecat.test.ts
│   ├── spaced-repetition.test.ts
│   └── supabase-realtime.test.ts
├── components/             # Reusable UI primitives & Navigation
│   ├── BottomNav.tsx
│   └── Onboarding.tsx
├── pages/                  # 8 Interconnected Core Pages
│   ├── Home.tsx            # Mastery stats & quick review
│   ├── Scan.tsx            # Multimodal camera & PII scrubbing
│   ├── Study.tsx           # 3D Framer Motion flashcard review
│   ├── Paywall.tsx         # RevenueCat Pro & Student Pass
│   ├── Library.tsx         # Decks management & Anki/MD export
│   ├── Quiz.tsx            # AI diagnostic quiz
│   ├── Arena.tsx           # Realtime collaborative study arena
│   └── LMSHub.tsx          # Canvas / Blackboard LTI sync
└── utils/                  # Core Business & Algorithmic Engines
    ├── ai-agent.ts         # Gemini Flash & PII sanitizer
    ├── audio.ts            # Procedural Web Audio synthesizer
    ├── revenuecat.ts       # @revenuecat/purchases-js Web SDK
    ├── spaced-repetition.ts# SuperMemo SM-2 implementation
    └── supabase-realtime.ts# Supabase Realtime presence
```

---

## 🏎️ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/D1ff1cult11/StudyBuddy-AI.git
cd StudyBuddy-AI

# 2. Install dependencies
npm install

# 3. Run unit tests
npm test

# 4. Start local development server
npm run dev

# 5. Build production bundle
npm run build
```

---

## 📄 License

MIT License — Created for the RevenueCat Ship-a-ton 2026.
