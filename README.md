# Sakhi AI 🧕
### *"Don't teach women how to use the internet. Teach the internet how to understand women."*

A **voice-first digital navigator** for rural, first-time women internet users in India.

A woman who has never used a government website — who may not know English, may not
read well, and has nobody to guide her — simply **speaks** what she needs in her own
language. Sakhi understands her intent, asks one simple question at a time, finds a
**verified** government scheme, explains it in her language, checks eligibility, lists
the documents, and then walks her through the application **one step at a time**.

> **PromptWars × HACKARENA** submission.

---

## ▶️ Run it (2 minutes)

```bash
cd sakhi-ai
npm install
npm run build
npm start          # http://localhost:3000
```

For development with hot reload:

```bash
npm run dev        # http://localhost:3000
```

**The full demo works with no API key and no internet-dependent services.**
Voice input uses the browser's built-in speech engine, so it needs Chrome/Edge
(and `localhost` or HTTPS — both are true in this preview).

### Optional: switch on Gemini

```bash
cp .env.example .env.local
# add your key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_key_here
```

With a key, Sakhi additionally:
1. uses Gemini to understand messy, dialect-heavy free speech when keyword matching is unsure, and
2. re-words **already-verified** facts into even simpler sentences ("💡 மேலும் விளக்கம்").

Gemini is **never** allowed to invent a scheme, amount or eligibility rule — it only
receives facts from our verified database. The UI badge shows
`✨ Gemini AI active` vs `📶 Offline mode (rule-based)`.

---

## 🎬 The demo journey (Tamil)

This is the one complete end-to-end journey to show the judges.

| Step | What happens |
|---|---|
| **1** | Home screen: **"வணக்கம்! உங்களுக்கு என்ன உதவி வேண்டும்?"** with a huge microphone button **🎤 பேசுங்கள்** and 6 picture categories. |
| **2** | She presses the mic and says: **"எனக்கு வீட்டிலிருந்து தையல் தொழில் தொடங்க வேண்டும். அரசு உதவி கிடைக்குமா?"** |
| **3** | Sakhi replies **in Tamil** and asks **one** question: *"நீங்கள் எந்த வகையான தொழிலைத் தொடங்க விரும்புகிறீர்கள்?"* with big buttons (🧵 தையல் / 🧺 கைவினை / 🍲 உணவு …). No forms. |
| **4** | *"உங்களுக்கு எது தேவை?"* → 💰 பண உதவி / கடன் |
| **5** | Smart eligibility questions, one at a time: *"உங்கள் வயது 18க்கு மேலா?"*, *"கடந்த 5 ஆண்டுகள் PMEGP/முத்ரா கடன் எடுத்தீர்களா?"* |
| **6** | Sakhi finds **5 verified options** and explains why each fits her. Top match: **பிரதமர் விஷ்வகர்மா திட்டம்** (free training, ₹15,000 toolkit, ₹1 lakh collateral-free loan at 5%). |
| **7** | The scheme card shows: what you get · who can apply · **document checklist (✓)** · official website · "please verify" note. |
| **8** | **📋 வழிமுறை படிகள்** → a step-by-step guide with a progress bar (**படி 1 / 7**), **அடுத்தது / பின் / மீண்டும் சொல் / மேலும் விளக்கம்**, and at the OTP step Sakhi asks *"திரையில் என்ன தெரிகிறது?"* and waits for her. |
| **9** | **✅ முடிந்தது!** — she has completed a real government application journey alone. |

Automated version of this journey: `node scripts/test-demo.mjs`
More scenarios (Hindi, English, other categories, honesty checks): `node scripts/test-scenarios.mjs`

Visual check (optional — `npm i -D playwright && npx playwright install chromium`, then
`node scripts/ui-check.mjs`) walks the entire journey in a headless browser and writes
screenshots to `/tmp/shots`.

### Other journeys that work out of the box
* "मुझे घर से सिलाई का काम शुरू करना है" (Hindi) → same journey in Hindi
* "I want to earn money from home" (English)
* 💼 வேலை → MGNREGA / e-Shram / DAY-NRLM
* 🎓 கல்வி → National Scholarship Portal / Sukanya Samriddhi
* 🛠️ திறன் பயிற்சி → PMKVY 4.0 (free training + certificate)
* 📄 அரசு சேவைகள் → Udyam registration / e-Shram / bank account
* Direct mention: "முத்ரா கடன் வேண்டும்", "PMKVY में सिलाई सीखनी है"

---

## 🧠 How it works

```
 She speaks (Tamil / Hindi / English)
        │  browser Speech-to-Text (Web Speech API)
        ▼
 ┌──────────────────────────────────────────────┐
 │  POST /api/sakhi  (Next.js route, Node.js)   │
 │                                              │
 │  1. lib/engine.ts  — deterministic state     │
 │     machine: intent → one question at a      │
 │     time → slots → matching → card → guide   │
 │                                              │
 │  2. lib/gemini.ts  — OPTIONAL Gemini layer   │
 │     (only for unclear speech / simpler       │
 │      re-wording of verified facts)           │
 │                                              │
 │  3. lib/schemes.ts — VERIFIED database       │
 │     13 schemes, every field cited to an      │
 │     official *.gov.in portal                 │
 └──────────────────────────────────────────────┘
        │
        ▼
 Sakhi answers in her language + speaks it aloud
        │  browser Speech Synthesis (ta-IN / hi-IN / en-IN)
        ▼
 Step-by-step guide with progress, Back / Next /
 Repeat / Explain-again
```

### The conversation engine (`lib/engine.ts`)
A small, testable state machine: `home → ask → results → scheme → guide → done`,
plus an honest `unknown` state. Rules baked in:

* **One question at a time.** Never a form. Buttons *and* voice both work.
* **Never lose her words.** If she answers a different question than the one asked
  (e.g. says "கடன்" when asked her age), Sakhi keeps the information, moves on, and
  never re-asks.
* **Never invent.** If nothing in the verified database matches, Sakhi says so
  plainly and points her to the nearest service centre / panchayat / block office.
* **Never scold.** If she is not understood, the same question is repeated in
  simpler words with big buttons.

### The verified database (`lib/schemes.ts`)
13 schemes, each with `lastVerified`, an official `*.gov.in` URL, and a "please
confirm on the official website" note, because subsidy percentages and dates change:

| Scheme | Portal | Verified for |
|---|---|---|
| பிரதமர் விஷ்வகர்மா திட்டம் (PM Vishwakarma) | pmvishwakarma.gov.in | tailoring & 17 other artisan trades: free training + ₹500/day stipend, ₹15,000 toolkit, ₹1 lakh collateral-free loan @5% |
| PMEGP | pmegp.msme.gov.in | new micro-enterprise: 35% rural subsidy for women (25% urban), max ₹50L/₹20L project cost |
| பிரதமர் முத்ரா யோஜனா (PMMY) | mudra.org.in / udyamimitra.in | Shishu ≤₹50k → Tarun ≤₹10L, collateral-free |
| PMKVY 4.0 | skillindiadigital.gov.in | free skill training + NSQF certificate |
| Mahila e-Haat | mahilaehaat-rmk.gov.in | free government marketplace for women's products |
| DAY-NRLM / आजीविका | aajeevika.gov.in | women's SHGs: revolving fund, group loans up to ₹3L |
| PMFME | pmfme.gov.in | home food business, up to 35% subsidy |
| PM SVANidhi | pmsvanidhi.mohua.gov.in | street vendor loans ₹10k→₹50k |
| Udyam Registration | udyamregistration.gov.in | free MSME registration |
| e-Shram | eshram.gov.in | unorganised worker UAN |
| MGNREGA | nrega.nic.in | 100 days guaranteed rural work |
| Sukanya Samriddhi | nsiindia.gov.in | girl-child savings |
| National Scholarship Portal | scholarships.gov.in | school/college scholarships |

**Rule for contributors: add a scheme only if you can cite an official `*.gov.in` URL.**

---

## 🛡️ Safety by design

* Sakhi **never** asks for OTP, password, ATM PIN, UPI PIN or bank PIN. A permanent
  banner says so: *"சகி OTP, பாஸ்வேர்டு, ATM PIN, UPI PIN-ஐ ஒருபோதும் கேட்காது."*
* Steps that involve an OTP carry the warning **"⚠️ OTP-ஐ வேறு யாருக்கும் சொல்ல வேண்டாம்.
  அரசு அதிகாரிகள் கூட OTP கேட்க மாட்டார்கள்."**
* Scheme-specific fraud warnings: *"முத்ராவுக்கு முகவர் இல்லை"*, *"PMEGP விண்ணப்பம் இலவசம்"*.
* Only official `*.gov.in` destinations are ever linked; no third-party or
  "fast approval" services.

## ♿ Accessibility

Mobile-first (max 480px), 18px base font, ≥7:1 contrast, 54–96px tap targets,
emoji + text on every control, `aria-live` message list, `aria-pressed` toggles,
visible focus rings, no pinch-zoom lock (`maximum-scale=5`), and **voice is always
available as an alternative to reading**.

---

## 🗂️ Project structure

```
sakhi-ai/
├── app/
│   ├── page.tsx               # entry
│   ├── layout.tsx             # metadata + viewport
│   ├── globals.css            # the whole design system (no UI framework)
│   └── api/sakhi/route.ts     # POST /api/sakhi — the brain endpoint
├── components/Sakhi.tsx       # voice + chat + cards + step guide
├── lib/
│   ├── i18n.ts                # Tamil / Hindi / English UI strings
│   ├── schemes.ts             # VERIFIED scheme database (tri-lingual)
│   ├── engine.ts              # conversation state machine
│   └── gemini.ts              # optional Gemini layer (intent + simplification)
├── scripts/test-demo.mjs      # the end-to-end demo journey
├── scripts/test-scenarios.mjs # languages, categories, honesty checks
└── .env.example
```

## 🚀 Deploy

```bash
npm run build && npm start     # any Node host
# or: vercel deploy            # set GEMINI_API_KEY in project env if you want it
```

## 🔭 What we would build next

1. **More languages** — the i18n layer is one file away from Marathi, Bengali, Telugu, Kannada.
2. **Offline/IVR fallback** — the same engine behind a phone number for women with no smartphone.
3. **Trusted helper mode** — a family member or ASHA worker can follow along on a second screen.
4. **Application status tracking** — Sakhi remembers the application number and checks back.
5. **Verified-data pipeline** — a small cron job that re-checks subsidy percentages on official portals and bumps `lastVerified`.
