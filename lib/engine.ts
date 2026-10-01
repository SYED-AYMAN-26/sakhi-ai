/**
 * Sakhi AI — conversation engine
 * ---------------------------------------------------------------------------
 * A deterministic, testable state machine. It powers the whole demo WITHOUT
 * any API key, and Gemini (see lib/gemini.ts) is only used on top of it to
 * (a) understand free text when keyword matching is unsure, and
 * (b) re-explain a verified fact in even simpler words.
 *
 * Design rules baked in here:
 *  - ONE question at a time, never a form.
 *  - Never invent a scheme: if we cannot match something verified, we say so.
 *  - Never ask for OTP / PIN / password: safety notes are attached to steps.
 */

import { CATEGORIES, t, type Category, type Lang, type L } from "./i18n";
import { SCHEMES, getScheme, type Need, type Scheme, type Trade } from "./schemes";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Option {
  label: string;
  value: string;
  icon?: string;
}

export interface Slots {
  trade?: Trade | null;
  need?: Need | null;
  age18?: boolean | null;
  priorLoan?: boolean | null;
  workKind?: "wage" | "job" | "home" | null;
  eduWho?: "me" | "daughter" | "childSavings" | null;
  serviceKind?: "udyam" | "eshram" | "bank" | "other" | null;
  skillTrade?: Trade | null;
}

export type Stage =
  | "home"
  | "ask"
  | "results"
  | "scheme"
  | "guide"
  | "done"
  | "unknown";

export interface ConvState {
  lang: Lang;
  stage: Stage;
  intent: Category | null;
  slots: Slots;
  /** Questions she has already answered out of order (so we never re-ask). */
  skipped: string[];
  qIndex: number;
  results: string[];
  activeScheme: string | null;
  guideIndex: number;
  turns: number;
}

export interface CardPayload {
  id: string;
  name: string;
  ministry: string;
  tagline: string;
  gives: string[];
  eligibility: string[];
  documents: string[];
  caution?: string;
  verify: string;
  officialUrl: string;
  officialPortalName: string;
  reason: string;
  lastVerified: string;
}

export interface GuidePayload {
  index: number;
  total: number;
  text: string;
  detail?: string;
  expectsReport: boolean;
  title: string;
}

export interface EngineReply {
  state: ConvState;
  say: string;
  speak?: string;
  options: Option[];
  card: CardPayload | null;
  guide: GuidePayload | null;
  results: { id: string; name: string; reason: string; tagline: string }[] | null;
  notes: string[];
}

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

export function normalize(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[.,!?;()"'“”‘’।॥\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(text: string, words: string[]): boolean {
  const s = normalize(text);
  return words.some((w) => s.includes(normalize(w)));
}

function countHits(text: string, words: string[]): number {
  const s = normalize(text);
  let n = 0;
  for (const w of words) if (s.includes(normalize(w))) n++;
  return n;
}

/* ------------------------------------------------------------------ */
/* Keyword tables                                                      */
/* ------------------------------------------------------------------ */

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  work: [
    "வேலை", "வேலைக்கு", "வேலை செய்ய", "உத்தியோகம்", "சம்பளம்", "நாள் கூலி", "கூலி", "கூலிக்கு",
    "काम", "नौकरी", "मजदूरी", "मज़दूरी", "काम चाहिए",
    "job", "work", "wage", "employment", "nrega", "mgnrega", "daily wage",
  ],
  business: [
    "தொழில்", "தொழில் தொடங்க", "வியாபாரம்", "சம்பாதிக்க", "சம்பாதி", "வியாபாரி", "தொழில் முனைவோர்",
    "வீட்டில் சம்பாதி", "விற்க", "விற்பனை", "கடன்",
    "व्यापार", "रोज़गार", "रोजगार", "उद्यम", "कारोबार", "घर से कमाई", "कमाई", "काम शुरू", "काम करना", "घर से काम", "कर्ज़",
    "business", "self employment", "start a business", "earn money", "earn from home", "small business", "loan",
  ],
  education: [
    "கல்வி", "பள்ளி", "கல்லூரி", "படிப்பு", "உதவித்தொகை", "படிக்க",
    "पढ़ाई", "पढ़ना", "शिक्षा", "छात्रवृत्ति", "स्कूल", "कॉलेज",
    "education", "scholarship", "study", "school", "college", "fee",
  ],
  skill: [
    "பயிற்சி", "திறன்", "கற்க", "கற்க வேண்டும்", "படிக்க வேண்டும்",
    "कौशल", "प्रशिक्षण", "सीखना", "सीख",
    "skill", "training", "course", "learn", "apprentice",
  ],
  services: [
    "சேவை", "அட்டை", "பதிவு", "அரசு சேவை",
    "सेवा", "कार्ड", "रजिस्ट्रेशन", "पंजीकरण", "सरकारी सेवा",
    "registration", "card", "udyam", "eshram", "e-shram", "certificate",
  ],
  other: ["உதவி", "मदद", "help", "உதவ"],
};

const TRADE_KEYWORDS: Record<Trade, string[]> = {
  tailoring: [
    "தையல்", "தையல் கார்", "தையல்காரை", "நெசெல்", "ஊட்டு", "தையல் கல்வி",
    "सिलाई", "दर्जी", "टेलर", "कढ़ाई", "सिलाई मशीन", "डरज",
    "tailor", "tailoring", "stitching", "boutique", "kapda", "kapda business", "stitch",
  ],
  artisan: [
    "கைவினை", "தச்சு", "கூழை", "சவரி", "நெசவு", "கைவினைஞர்",
    "हस्तकला", "बढ़ई", "कारीगर", "जुलाहा", "मिट्टी",
    "artisan", "handicraft", "handloom", "weaver", "carpenter", "pottery", "craft",
  ],
  food: [
    "உணவு", "சமையல்", "அப்பளம்", "பலகாரம்", "ஊறுகாய்", "சமையல் காரு", "உணவு வியாபாரம்",
    "खाना", "खाना बनाना", "अचार", "पपड़", "मिठाई", "टिफ़िन",
    "food", "pickle", "papad", "tiffin", "catering", "sweet", "bakery", "cook",
  ],
  shop: [
    "கடை", "கடைக்காரர்", "தெரு வியாபாரி", "தெரு வியாபாரம்", "வியாபாரி", "விற்பனை",
    "दुकान", "स्ट्रीट वेंडर", "ठेले", "रीढ़ी",
    "shop", "store", "stall", "vendor", "rehri", "thela", "cart",
  ],
  beauty: [
    "அழகு", "அழகு சிகிச்சை", "பியூட்டி பார்லர்",
    "ब्यूटी", "सैलून", "ब्यूटी पार्लर",
    "beauty", "parlour", "parlor", "salon", "makeup",
  ],
  other: [],
};

const NEED_KEYWORDS: Record<Need, string[]> = {
  loan: [
    "கடன்", "பணம்", "பண உதவி", "கடன் வேண்டும்", "தொடக்கத் தொகை", "மானியம்",
    "ऋण", "कर्ज़", "कर्ज", "पैसा", "पैसे", "लोन",
    "loan", "money", "fund", "finance", "subsidy", "capital",
  ],
  training: [
    "பயிற்சி", "கற்க", "கற்க வேண்டும்", "படிக்க வேண்டும்", "கல்வி கற்க",
    "प्रशिक्षण", "सीखना", "सीखना चाहिए", "कौशल",
    "training", "learn", "course", "study a course",
  ],
  both: ["இரண்டும்", "दोनों", "both", "donon"],
  unknown: [],
};

const WORK_KIND_KEYWORDS: Record<string, string[]> = {
  wage: ["நாள் கூலி", "கூலி", "கிராம வேலை", "100 நாள்", "मजदूरी", "100 दिन", "गाँव में काम", "wage", "daily work"],
  job: ["உத்தியோகம்", "நிலையான வேலை", "நிறுவனம்", "नौकरी", "स्थायी काम", "job", "salary", "company"],
  home: ["வீட்டில்", "வீட்டிலிருந்து", "வீட்டிலேயே", "घर से", "घर पर", "home", "from home", "work from home"],
};

const YES_WORDS = ["ஆம்", "ஆமா", "ஆமாம்", "சரி", "உண்டு", "हाँ", "हां", "जी", "हांजी", "yes", "yep", "yeah", "sure", "correct", "true", "haan", "ha"];
const NO_WORDS = ["இல்லை", "இல்ல", "வேண்டாம்", "नहीं", "नही", "नह", "no", "nope", "not", "illa", "illai"];
const DONT_KNOW_WORDS = ["தெரியவில்லை", "தெரியாது", "பता नहीं", "पता नही", "नहीं पता", "don't know", "dont know", "not sure", "पता नहीं है"];

const SCHEME_ALIASES: Record<string, string[]> = {
  "pm-vishwakarma": ["விஷ்வகர்மா", "vishwakarma", "pm vishwakarma", "विश्वकर्मा"],
  pmegp: ["pmegp", "பி.எம்.இ.ஜி.பி", "पीएमईजीपी", "पीएम ईजीपी", "employment generation"],
  pmmy: ["mudra", "முத்ரா", "मुद्रा", "pmmY".toLowerCase(), "पीएमएमवाई", "शिशु", "किशोर", "तरुण", "shishu", "kishore", "tarun"],
  pmkvy: ["pmkvy", "பி.எம்.கே.வி.ஒய்", "पीएमकेवीवाई", "कौशल विकास", "skill india", "kaushal vikas"],
  "day-nrlm": ["shg", "சுய உதவிக் குழு", "आजीविका", "aajeevika", "nrlm", "नियरलम", "नेरलम", "दीनदय", "deen dayal", "deenodaya"],
  "mahila-ehaat": ["mahila ehaat", "மகளிர் இ-ஹாட்", "महिला ई-हाट", "ई-हाट", "e-haat", "ehaat"],
  udyam: ["udyam", "உத்யாம்", "उद्यम", "msme registration"],
  eshram: ["eshram", "e-shram", "இ-ச்ராம்", "ई-श्रम", "e shram"],
  mgnrega: ["nrega", "mgnrega", "மந்நிகா", "मनरेगा", "मनरेगा कार्ड", "job card"],
  "sukanya-samriddhi": ["sukanya", "சுகன்யா", "सुकन्या", "सुकन्या समृद्धि"],
  nsp: ["scholarship", "உதவித்தொகை", "छात्रवृत्ति", "nsp", "national scholarship"],
  pmsvanidhi: ["svanidhi", "स्वनिधि", "एस.वी.एन.इधि", "street vendor"],
  pmfme: ["pmfme", "पीएमएफएमई", "उणவு செயலாக்க", "food processing"],
};

/* ------------------------------------------------------------------ */
/* Detection                                                           */
/* ------------------------------------------------------------------ */

export interface Detection {
  category: Category | null;
  trade: Trade | null;
  need: Need | null;
  workKind: Slots["workKind"];
  yesno: "yes" | "no" | "unknown" | null;
  schemeId: string | null;
  score: number;
  /** How strongly the best-matching category matched (keyword hits). */
  catScore: number;
}

export function detect(text: string): Detection {
  const s = normalize(text);

  // 1. Explicit scheme mention wins.
  for (const [id, words] of Object.entries(SCHEME_ALIASES)) {
    if (words.some((w) => s.includes(normalize(w)))) {
      const scheme = getScheme(id);
      return {
        category: scheme?.category[0] ?? null,
        trade: null,
        need: null,
        workKind: null,
        yesno: null,
        schemeId: id,
        score: 100,
        catScore: 100,
      };
    }
  }

  // 2. Yes / no / don't know.
  let yesno: Detection["yesno"] = null;
  if (has(s, YES_WORDS)) yesno = "yes";
  else if (has(s, NO_WORDS)) yesno = "no";
  else if (has(s, DONT_KNOW_WORDS)) yesno = "unknown";

  // 3. Category by keyword score.
  let best: Category | null = null;
  let bestScore = 0;
  for (const c of Object.keys(CATEGORY_KEYWORDS) as Category[]) {
    const score = countHits(s, CATEGORY_KEYWORDS[c]);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  // 4. Trade / need / work kind.
  let trade: Trade | null = null;
  let tradeScore = 0;
  for (const tr of Object.keys(TRADE_KEYWORDS) as Trade[]) {
    const score = countHits(s, TRADE_KEYWORDS[tr]);
    if (score > tradeScore) {
      tradeScore = score;
      trade = tr;
    }
  }
  if (tradeScore === 0) trade = null;

  let need: Need | null = null;
  let needScore = 0;
  for (const nd of Object.keys(NEED_KEYWORDS) as Need[]) {
    const score = countHits(s, NEED_KEYWORDS[nd]);
    if (score > needScore) {
      needScore = score;
      need = nd;
    }
  }
  if (needScore === 0) need = null;

  let workKind: Slots["workKind"] = null;
  for (const [k, words] of Object.entries(WORK_KIND_KEYWORDS)) {
    if (has(s, words)) {
      workKind = k as Slots["workKind"];
      break;
    }
  }

  return {
    category: best,
    trade,
    need,
    workKind,
    yesno,
    schemeId: null,
    score: bestScore + tradeScore + needScore,
    catScore: bestScore,
  };
}

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

interface QOption {
  value: string;
  label: L;
  icon?: string;
}

interface Question {
  id: string;
  ask: L;
  options: QOption[];
  freeText?: boolean;
  when?: (slots: Slots) => boolean;
}

const yn = (): QOption[] => [
  { value: "yes", label: { ta: "ஆம்", hi: "हाँ", en: "Yes" }, icon: "✅" },
  { value: "no", label: { ta: "இல்லை", hi: "नहीं", en: "No" }, icon: "❌" },
  {
    value: "unknown",
    label: { ta: "தெரியவில்லை", hi: "पता नहीं", en: "I don't know" },
    icon: "🤔",
  },
];

const QUESTIONS: Record<Category, Question[]> = {
  business: [
    {
      id: "trade",
      ask: {
        ta: "நீங்கள் எந்த வகையான தொழிலைத் தொடங்க விரும்புகிறீர்கள்?",
        hi: "आप किस तरह का व्यापार शुरू करना चाहती हैं?",
        en: "What kind of business do you want to start?",
      },
      freeText: true,
      options: [
        { value: "tailoring", label: { ta: "🧵 தையல்", hi: "🧵 सिलाई", en: "🧵 Tailoring" } },
        {
          value: "artisan",
          label: { ta: "🧺 கைவினை வேலை", hi: "🧺 हस्तकला", en: "🧺 Handicraft" },
        },
        { value: "food", label: { ta: "🍲 உணவு வியாபாரம்", hi: "🍲 खाना व्यापार", en: "🍲 Food business" } },
        { value: "shop", label: { ta: "🛒 கடை / தெரு வியாபாரம்", hi: "🛒 दुकान / ठेला", en: "🛒 Shop / street vending" } },
        {
          value: "beauty",
          label: { ta: "💅 அழகு சிகிச்சை", hi: "💅 ब्यूटी पार्लर", en: "💅 Beauty parlour" },
        },
        {
          value: "other",
          label: { ta: "✍️ வேறு (பேசிச் சொல்லுங்கள்)", hi: "✍️ कुछ और (बोलिए)", en: "✍️ Something else (tell me)" },
        },
      ],
    },
    {
      id: "need",
      ask: {
        ta: "உங்களுக்கு எது தேவை?",
        hi: "आपको क्या चाहिए?",
        en: "What do you need?",
      },
      options: [
        { value: "loan", label: { ta: "💰 பண உதவி / கடன்", hi: "💰 पैसा / कर्ज़", en: "💰 Money / loan" } },
        { value: "training", label: { ta: "📚 பயிற்சி", hi: "📚 प्रशिक्षण", en: "📚 Training" } },
        { value: "both", label: { ta: "🤝 இரண்டும்", hi: "🤝 दोनों", en: "🤝 Both" } },
        {
          value: "unknown",
          label: { ta: "🤔 தெரியவில்லை", hi: "🤔 पता नहीं", en: "🤔 I don't know" },
        },
      ],
    },
    {
      id: "age",
      ask: {
        ta: "உங்கள் வயது 18 வது வயதுக்கு மேலாக உள்ளதா?",
        hi: "क्या आपकी उम्र 18 साल से ज़्यादा है?",
        en: "Are you above 18 years of age?",
      },
      options: yn(),
    },
    {
      id: "priorLoan",
      ask: {
        ta: "கடந்த 5 ஆண்டுகளில் PMEGP, முத்ரா அல்லது PM SVANidhi-ல் கடன் எடுத்திருக்கிறீர்களா?",
        hi: "क्या पिछले 5 साल में PMEGP, मुद्रा या PM SVANidhi से कर्ज़ लिया है?",
        en: "In the last 5 years, have you taken a PMEGP, MUDRA or PM SVANidhi loan?",
      },
      options: yn(),
      when: (slots) =>
        slots.trade === "tailoring" || slots.trade === "artisan" || slots.trade === "beauty",
    },
  ],

  work: [
    {
      id: "workKind",
      ask: {
        ta: "எந்த வகை வேலை தேவை?",
        hi: "किस तरह का काम चाहिए?",
        en: "What kind of work do you need?",
      },
      freeText: true,
      options: [
        {
          value: "wage",
          label: { ta: "⛏️ கிராம வேலை / நாள் கூலி", hi: "⛏️ गाँव में काम / मजदूरी", en: "⛏️ Rural work / daily wages" },
        },
        {
          value: "job",
          label: { ta: "🏭 நிலையான வேலை", hi: "🏭 स्थायी नौकरी", en: "🏭 A steady job" },
        },
        {
          value: "home",
          label: { ta: "🏠 வீட்டிலேயே சம்பாதிக்க", hi: "🏠 घर से कमाई", en: "🏠 Earn from home" },
        },
      ],
    },
    {
      id: "age",
      ask: {
        ta: "உங்கள் வயது 18 வது வயதுக்கு மேலாக உள்ளதா?",
        hi: "क्या आपकी उम्र 18 साल से ज़्यादा है?",
        en: "Are you above 18 years of age?",
      },
      options: yn(),
    },
  ],

  skill: [
    {
      id: "skillTrade",
      ask: {
        ta: "எந்தத் துறையில் பயிற்சி வேண்டும்?",
        hi: "किस क्षेत्र में प्रशिक्षण चाहिए?",
        en: "Which area do you want training in?",
      },
      freeText: true,
      options: [
        { value: "tailoring", label: { ta: "🧵 தையல்", hi: "🧵 सिलाई", en: "🧵 Tailoring" } },
        {
          value: "artisan",
          label: { ta: "🧺 கைவினை வேலை", hi: "🧺 हस्तकला", en: "🧺 Handicraft" },
        },
        { value: "food", label: { ta: "🍲 உணவு / சமையல்", hi: "🍲 खाना / पाक", en: "🍲 Food / cooking" } },
        {
          value: "beauty",
          label: { ta: "💅 அழகு சிகிச்சை", hi: "💅 ब्यूटी", en: "💅 Beauty" },
        },
        {
          value: "computer",
          label: { ta: "💻 கம்ப்யூட்டர் / டிஜிட்டல்", hi: "💻 कंप्यूटर / डिजिटल", en: "💻 Computer / digital" },
        },
        {
          value: "other",
          label: { ta: "✍️ வேறு (பேசுங்கள்)", hi: "✍️ कुछ और (बोलिए)", en: "✍️ Something else (tell me)" },
        },
      ],
    },
    {
      id: "age",
      ask: {
        ta: "உங்கள் வயது 18 வது வயதுக்கு மேலாக உள்ளதா?",
        hi: "क्या आपकी उम्र 18 साल से ज़्यादा है?",
        en: "Are you above 18 years of age?",
      },
      options: yn(),
    },
  ],

  education: [
    {
      id: "eduWho",
      ask: {
        ta: "யாருக்கு உதவி வேண்டும்?",
        hi: "किसकी मदद चाहिए?",
        en: "Who needs help?",
      },
      freeText: true,
      options: [
        {
          value: "me",
          label: { ta: "🙋 எனக்கு (படிப்பு உதவித்தொகை)", hi: "🙋 मुझे (छात्रवृत्ति)", en: "🙋 Me (a scholarship)" },
        },
        {
          value: "daughter",
          label: { ta: "👧 என் மகளுக்கு", hi: "👧 मेरी बेटी के लिए", en: "👧 My daughter" },
        },
        {
          value: "childSavings",
          label: { ta: "🐖 குழந்தை சேமிப்பு கணக்கு", hi: "🐖 बच्चे की बचत", en: "🐖 Savings for my child" },
        },
      ],
    },
  ],

  services: [
    {
      id: "serviceKind",
      ask: {
        ta: "எந்த சேவை தேவை?",
        hi: "कौन सी सेवा चाहिए?",
        en: "Which service do you need?",
      },
      freeText: true,
      options: [
        {
          value: "udyam",
          label: { ta: "🏷️ தொழில் பதிவு (Udyam)", hi: "🏷️ व्यापार पंजीकरण (Udyam)", en: "🏷️ Business registration (Udyam)" },
        },
        {
          value: "eshram",
          label: { ta: "🪪 தொழிலாளர் அட்டை (e-Shram)", hi: "🪪 मजदूर कार्ड (e-Shram)", en: "🪪 Worker card (e-Shram)" },
        },
        {
          value: "bank",
          label: { ta: "🏦 வங்கிக் கணக்கு", hi: "🏦 बैंक खाता", en: "🏦 A bank account" },
        },
        {
          value: "other",
          label: { ta: "✍️ வேறு (பேசுங்கள்)", hi: "✍️ कुछ और (बोलिए)", en: "✍️ Something else (tell me)" },
        },
      ],
    },
  ],

  other: [
    {
      id: "freeText",
      ask: {
        ta: "சொல்லுங்கள் — உங்களுக்கு எந்த வகை உதவி வேண்டும்?",
        hi: "बताइए — आपको किस तरह की मदद चाहिए?",
        en: "Tell me — what kind of help do you need?",
      },
      freeText: true,
      options: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scheme matching                                                     */
/* ------------------------------------------------------------------ */

function rankSchemes(intent: Category, slots: Slots): Scheme[] {
  const out: Scheme[] = [];
  const push = (id: string, force = false) => {
    const s = getScheme(id);
    if (!s) return;
    const at = out.indexOf(s);
    if (at >= 0) {
      if (force) out.splice(at, 1), out.unshift(s);
      return;
    }
    if (force) out.unshift(s);
    else out.push(s);
  };
  const trade = slots.trade;
  const need = slots.need;
  const workKind = slots.workKind;
  const eduWho = slots.eduWho;
  const serviceKind = slots.serviceKind;
  const skillTrade = slots.skillTrade ?? slots.trade;

  const isBusiness = intent === "business" || (intent === "work" && workKind === "home");

  if (isBusiness) {
    if (trade === "tailoring") {
      push("pm-vishwakarma");
      push("pmkvy");
      push("pmegp");
      push("pmmy");
      push("mahila-ehaat");
      push("day-nrlm");
      push("udyam");
    } else if (trade === "artisan") {
      push("pm-vishwakarma");
      push("pmegp");
      push("pmmy");
      push("day-nrlm");
      push("mahila-ehaat");
      push("udyam");
    } else if (trade === "food") {
      push("pmfme");
      push("pmmy");
      push("pmegp");
      push("mahila-ehaat");
      push("day-nrlm");
      push("udyam");
    } else if (trade === "shop") {
      push("pmsvanidhi");
      push("pmmy");
      push("day-nrlm");
      push("udyam");
      push("eshram");
    } else if (trade === "beauty") {
      push("pmkvy");
      push("pmmy");
      push("pmegp");
      push("udyam");
    } else {
      push("pmegp");
      push("pmmy");
      push("day-nrlm");
      push("udyam");
    }

    // Re-rank by what she actually asked for.
    if (need === "training" || need === "both") push("pmkvy", true);
    if (need === "loan" || need === "both") {
      if (trade === "tailoring") push("pm-vishwakarma", true);
      else if (trade === "food") push("pmfme", true);
      else if (trade === "shop") push("pmsvanidhi", true);
      else push("pmegp", true);
    }
  } else if (intent === "work") {
    if (workKind === "wage") {
      push("mgnrega");
      push("eshram");
      push("day-nrlm");
    } else if (workKind === "job") {
      push("pmkvy");
      push("eshram");
      push("mgnrega");
    } else if (workKind === "home") {
      push("pm-vishwakarma");
      push("pmkvy");
      push("pmmy");
      push("mahila-ehaat");
    } else {
      push("pmkvy");
      push("mgnrega");
      push("eshram");
    }
  } else if (intent === "skill") {
    push("pmkvy");
    if (skillTrade === "tailoring" || skillTrade === "artisan" || skillTrade === "beauty") {
      push("pm-vishwakarma", true);
    }
    if (skillTrade === "food") push("pmfme");
    push("eshram");
  } else if (intent === "education") {
    if (eduWho === "me") {
      push("nsp");
    } else if (eduWho === "daughter") {
      push("sukanya-samriddhi");
      push("nsp");
    } else {
      push("sukanya-samriddhi");
      push("nsp");
    }
  } else if (intent === "services") {
    if (serviceKind === "udyam") {
      push("udyam");
      push("pmegp");
      push("pmmy");
    } else if (serviceKind === "eshram") {
      push("eshram");
      push("mgnrega");
      push("pmmy");
    } else if (serviceKind === "bank") {
      push("udyam");
      push("day-nrlm");
      push("pmmy");
    } else {
      push("udyam");
      push("eshram");
      push("day-nrlm");
    }
  }

  // Eligibility filters.
  if (slots.priorLoan === true) {
    const i = out.findIndex((s) => s.id === "pm-vishwakarma");
    if (i >= 0) out.splice(i, 1);
  }
  if (slots.age18 === false) {
    // Keep only schemes that accept under-18s.
    const allowed = out.filter((s) => s.id === "pmkvy" || s.id === "sukanya-samriddhi" || s.id === "nsp");
    if (allowed.length) return allowed;
  }

  return out.slice(0, 5);
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export function newState(lang: Lang): ConvState {
  return {
    lang,
    stage: "home",
    intent: null,
    slots: {},
    skipped: [],
    qIndex: 0,
    results: [],
    activeScheme: null,
    guideIndex: 0,
    turns: 0,
  };
}

function questionFor(intent: Category, slots: Slots, skipped: string[] = []): Question | null {
  const list = QUESTIONS[intent];
  for (const q of list) {
    if (skipped.includes(q.id)) continue;
    if (q.when && !q.when(slots)) continue;
    if (!answered(q.id, slots)) return q;
  }
  return null;
}

function answered(qid: string, slots: Slots): boolean {
  switch (qid) {
    case "trade":
      return !!slots.trade;
    case "skillTrade":
      return !!slots.skillTrade;
    case "need":
      return !!slots.need;
    case "age":
      return slots.age18 !== null && slots.age18 !== undefined;
    case "priorLoan":
      return slots.priorLoan !== null && slots.priorLoan !== undefined;
    case "workKind":
      return !!slots.workKind;
    case "eduWho":
      return !!slots.eduWho;
    case "serviceKind":
      return !!slots.serviceKind;
    default:
      return false;
  }
}

function categoryOptions(lang: Lang): Option[] {
  return CATEGORIES.map((c) => ({
    label: `${c.icon} ${c.label[lang]}`,
    value: `cat:${c.id}`,
  }));
}

function cardOf(scheme: Scheme, lang: Lang): CardPayload {
  return {
    id: scheme.id,
    name: scheme.name[lang],
    ministry: scheme.ministry[lang],
    tagline: scheme.tagline[lang],
    gives: scheme.gives.map((g) => g[lang]),
    eligibility: scheme.eligibility.map((g) => g[lang]),
    documents: scheme.documents.map((g) => g[lang]),
    caution: scheme.caution?.[lang],
    verify: scheme.verify[lang],
    officialUrl: scheme.officialUrl,
    officialPortalName: scheme.officialPortalName,
    reason: scheme.reason[lang],
    lastVerified: scheme.lastVerified,
  };
}

function guideOf(scheme: Scheme, index: number, lang: Lang): GuidePayload {
  const step = scheme.steps[index];
  return {
    index,
    total: scheme.steps.length,
    text: step.text[lang],
    detail: step.detail?.[lang],
    expectsReport: !!step.expectsReport,
    title: scheme.name[lang],
  };
}

function parseAnswer(
  text: string,
  q: Question,
  lang: Lang,
): { slots: Partial<Slots>; matched: boolean } {
  const s = normalize(text);
  const d = detect(text);

  // Direct option match by value.
  for (const opt of q.options) {
    const labels = Object.values(opt.label).map((l) => normalize(l));
    if (labels.some((l) => s.includes(l) || l.includes(s)) && s.length > 1) {
      return { slots: applyValue(q.id, opt.value, d), matched: true };
    }
    if (s === normalize(opt.value)) {
      return { slots: applyValue(q.id, opt.value, d), matched: true };
    }
  }

  // Yes / no / don't know — only for questions that really offer them.
  const isYesNo =
    q.options.some((o) => o.value === "yes") && q.options.some((o) => o.value === "no");
  if (isYesNo) {
    if (d.yesno === "yes") return { slots: applyValue(q.id, "yes", d), matched: true };
    if (d.yesno === "no") return { slots: applyValue(q.id, "no", d), matched: true };
    if (d.yesno === "unknown") return { slots: applyValue(q.id, "unknown", d), matched: true };
  }
  // "உங்களுக்கு எது தேவை?" answered with a plain yes/no: yes → money,
  // no → training (the most useful reading for a first-time user).
  if (q.id === "need") {
    if (d.yesno === "yes") return { slots: { need: "loan" }, matched: true };
    if (d.yesno === "no") return { slots: { need: "training" }, matched: true };
    if (d.yesno === "unknown") return { slots: { need: "unknown" }, matched: true };
  }

  // Free-text slot extraction.
  const extracted: Partial<Slots> = {};
  if (q.id === "trade" || q.id === "skillTrade") {
    if (d.trade) {
      extracted[q.id === "trade" ? "trade" : "skillTrade"] = d.trade;
      if (q.id === "trade" && d.need) extracted.need = d.need;
      return { slots: extracted, matched: true };
    }
  }
  if (q.id === "need" && d.need) return { slots: { need: d.need }, matched: true };
  if (q.id === "workKind") {
    if (d.workKind) return { slots: { workKind: d.workKind }, matched: true };
    // She answered with a craft ("தையல்", "सिलाई") → she wants to earn from home.
    if (d.trade) return { slots: { workKind: "home", trade: d.trade }, matched: true };
  }
  if (q.id === "serviceKind" && d.schemeId) {
    if (d.schemeId === "udyam") return { slots: { serviceKind: "udyam" }, matched: true };
    if (d.schemeId === "eshram") return { slots: { serviceKind: "eshram" }, matched: true };
  }
  if (q.id === "eduWho") {
    if (has(s, ["மகள்", "மகளுக்கு", "बेटी", "बेटी के लिए", "daughter", "girl child"]))
      return { slots: { eduWho: "daughter" }, matched: true };
    if (has(s, ["குழந்தை", "சேமிப்பு", "बचत", "savings", "बच्चे"]))
      return { slots: { eduWho: "childSavings" }, matched: true };
    if (has(s, ["எனக்கு", "मुझे", "me", "myself", "என் படிப்பு", "मेरी पढ़ाई"]))
      return { slots: { eduWho: "me" }, matched: true };
  }
  return { slots: extracted, matched: false };
}

function applyValue(qid: string, value: string, d: Detection): Partial<Slots> {
  switch (qid) {
    case "trade":
      return {
        trade: value as Trade,
        need: d.need ?? (value === "tailoring" ? null : null),
      };
    case "skillTrade":
      return { skillTrade: value as Trade };
    case "need":
      return { need: value as Need };
    case "age":
      return { age18: value === "yes" ? true : value === "no" ? false : null };
    case "priorLoan":
      return { priorLoan: value === "yes" ? true : value === "no" ? false : null };
    case "workKind":
      return { workKind: value as Slots["workKind"] };
    case "eduWho":
      return { eduWho: value as Slots["eduWho"] };
    case "serviceKind":
      return { serviceKind: value as Slots["serviceKind"] };
    default:
      return {};
  }
}

/**
 * She answered a DIFFERENT question than the one we asked (very common when
 * someone is talking, not filling a form). Keep whatever she told us instead
 * of throwing it away, and move on.
 */
function extractLoose(text: string, d: Detection): Partial<Slots> {
  const out: Partial<Slots> = {};
  const lower = normalize(text);
  if (d.trade) out.trade = d.trade;
  if (d.need) out.need = d.need;
  if (d.workKind) out.workKind = d.workKind;
  if (d.yesno === "yes" || d.yesno === "no") out.age18 = d.yesno === "yes";
  if (has(lower, ["மகள்", "मेरी बेटी", "daughter", "girl child", "बेटी"])) out.eduWho = "daughter";
  if (has(lower, ["உத்யாம்", "udyam", "उद्यम", "msme"])) out.serviceKind = "udyam";
  if (has(lower, ["இ-ச்ராம்", "eshram", "e-shram", "ई-श्रम"])) out.serviceKind = "eshram";
  if (has(lower, ["சுய உதவிக் குழு", "shg", "आजीविका", "nrlm", "self help group"])) {
    // a group request is a livelihood request
    if (!out.trade) out.trade = "other";
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Main turn                                                           */
/* ------------------------------------------------------------------ */

export interface Hint {
  category?: Category | null;
  trade?: Trade | null;
  need?: Need | null;
  workKind?: Slots["workKind"];
}

export function turn(state: ConvState, userText: string, hint?: Hint): EngineReply {
  const lang = state.lang;
  const next: ConvState = { ...state, slots: { ...state.slots }, turns: state.turns + 1 };
  const notes: string[] = [];
  const text = (userText || "").trim();
  const d = detect(text);
  const lower = normalize(text);

  const reply = (
    say: string,
    options: Option[],
    extra: Partial<EngineReply> = {},
  ): EngineReply => ({
    state: next,
    say,
    options,
    card: extra.card ?? null,
    guide: extra.guide ?? null,
    results: extra.results ?? null,
    notes,
  });

  /* ---------------- HOME ---------------- */
  if (next.stage === "home") {
    // Category tile
    const catTile = CATEGORIES.find((c) => `cat:${c.id}` === lower);
    if (catTile) {
      next.intent = catTile.id;
      next.slots = {};
      next.qIndex = 0;
      return startIntent(next, catTile.id, notes);
    }
    const intent =
      (hint?.category ?? d.category) ??
      (d.score >= 2 ? d.category : null);
    if (intent && intent !== "other") {
      next.intent = intent;
      next.slots = {};
      return startIntent(next, intent, notes);
    }
    if (d.schemeId) {
      return openSchemeResults(next, d.schemeId, notes);
    }
    // A greeting is not a request — answer it warmly and show the menu.
    if (has(lower, ["வணக்கம்", "வாழ்த்து", "नमस्ते", "नमस्कार", "राम राम", "hello", "hi ", "namaste", "good morning", "good evening"])) {
      return reply(t("greeting", lang), categoryOptions(lang), {});
    }
    // She named a craft ("தையல்", "अप्पलम्") without saying "business":
    // that is a livelihood request, so start the business journey.
    if (!intent && d.trade) {
      next.intent = "business";
      next.slots = { trade: d.trade };
      return startIntent(next, "business", notes);
    }
    if (intent === "other" || d.category === "other" || text.length > 0) {
      next.stage = "unknown";
      return reply(t("cannotVerify", lang), categoryOptions(lang), {});
    }
    return reply(t("greeting", lang), categoryOptions(lang), {});
  }

  /* ---------------- ASK ---------------- */
  if (next.stage === "ask") {
    const intent = next.intent!;
    const q = questionFor(intent, next.slots, next.skipped ?? []);

    // User wants to change topic / restart.
    if (has(lower, ["மீண்டும் தொடங்க", "फिर से शुरू", "start again", "restart", "மீண்டும்", "शुरू से"])) {
      return home(next, notes);
    }

    // "வேறு உதவி" — she describes her need in her own words.
    if (q && q.id === "freeText") {
      const newIntent = hint?.category ?? d.category;
      if (newIntent && newIntent !== "other") {
        next.intent = newIntent;
        next.slots = {};
        return startIntent(next, newIntent, notes);
      }
      if (d.schemeId) return openSchemeResults(next, d.schemeId, notes);
      if (text.length > 1) {
        next.stage = "unknown";
        return {
          state: next,
          say: t("cannotVerify", lang),
          options: categoryOptions(lang),
          card: null,
          guide: null,
          results: null,
          notes,
        };
      }
      return askQuestion(next, q, notes);
    }

    // A different, clearly stated topic is only considered AFTER we have
    // tried to read the message as an answer to the pending question.
    if (!q) {
      return showResults(next, notes);
    }

    const parsed = parseAnswer(text, q, lang);
    if (parsed.matched) {
      Object.assign(next.slots, parsed.slots);
      const nxt = questionFor(intent, next.slots, next.skipped ?? []);
      if (nxt) {
        return askQuestion(next, nxt, notes);
      }
      return showResults(next, notes);
    }

    // She answered a different question than the one we asked. Keep the
    // information, skip this question, and continue — never lose her words.
    const loose = extractLoose(text, d);
    if (Object.keys(loose).length > 0) {
      Object.assign(next.slots, loose);
      if (!next.skipped.includes(q.id)) next.skipped = [...next.skipped, q.id];
      const nxt = questionFor(intent, next.slots, next.skipped);
      if (nxt) return askQuestion(next, nxt, notes);
      return showResults(next, notes);
    }

    // A clear, strong signal for a different topic → switch journeys.
    const newCat = hint?.category ?? d.category;
    if (
      newCat &&
      newCat !== intent &&
      d.catScore >= 2 &&
      d.score >= 3 &&
      !has(lower, ["ஆம்", "இல்லை", "உதவி", "help", "मदद"])
    ) {
      next.intent = newCat;
      next.slots = {};
      next.skipped = [];
      next.qIndex = 0;
      return startIntent(next, newCat, notes);
    }

    // Could not understand the answer → repeat the same question, more simply.
    return askQuestion(
      next,
      q,
      notes,
      {
        ta: "மன்னிக்கவும், எனக்கு சரியாகப் புரியவில்லை. எளிதாகச் சொல்லுங்கள் — அல்லது கீழே உள்ள பொத்தானை அழுத்துங்கள்.",
        hi: "माफ़ कीजिए, मुझे ठीक से समझ नहीं आया। आसान में बताइए — या नीचे का बटन दबाएँ।",
        en: "Sorry, I did not understand. Please say it simply — or press a button below.",
      } as L,
    );
  }

  /* ---------------- RESULTS ---------------- */
  if (next.stage === "results") {
    if (lower.startsWith("scheme:")) {
      const id = lower.slice("scheme:".length);
      return openScheme(next, id, notes);
    }
    if (lower.startsWith("cat:")) {
      const id = lower.slice(4) as Category;
      next.intent = id;
      next.slots = {};
      return startIntent(next, id, notes);
    }
    // She spoke a scheme name instead of tapping.
    if (d.schemeId) return openScheme(next, d.schemeId, notes);
    const intent = hint?.category ?? d.category;
    if (intent && d.score >= 2 && intent !== next.intent) {
      next.intent = intent;
      next.slots = {};
      return startIntent(next, intent, notes);
    }
    // Treat as a pick by name.
    const byName = next.results
      .map((id) => getScheme(id))
      .find((s) => s && Object.values(s.name).some((n) => lower.includes(normalize(n))));
    if (byName) return openScheme(next, byName.id, notes);

    return showResults(next, notes, {
      ta: "கீழே உள்ள திட்டங்களில் ஒன்றைத் தேர்ந்தெடுங்கள். அல்லது நீங்கள் எதைப் பற்றி அறிய விரும்புகிறீர்கள் என்று சொல்லுங்கள்.",
      hi: "नीचे दी गई योजनाओं में से एक चुनें। या बताएँ कि किस बारे में जानना चाहती हैं।",
      en: "Please pick one of the schemes below, or tell me what you want to know.",
    } as L);
  }

  /* ---------------- SCHEME ---------------- */
  if (next.stage === "scheme") {
    const scheme = getScheme(next.activeScheme);
    if (!scheme) return home(next, notes);
    if (lower === "action:restart" || has(lower, ["மீண்டும் தொடங்க", "फिर से शुरू", "start again", "restart"]))
      return home(next, notes);
    if (lower === "action:steps" || has(lower, ["வழிமுறை", "படி", "कदम", "steps", "how to apply", "apply"])) {
      next.stage = "guide";
      next.guideIndex = 0;
      const g = guideOf(scheme, 0, lang);
      return reply(
        `${t("howToApply", lang)} — ${t("stepOf", lang, { n: 1, total: g.total })}\n\n${g.text}`,
        guideOptions(lang, g),
        { guide: g },
      );
    }
    if (lower === "action:docs" || has(lower, ["ஆவண", "कागज़", "documents", "paper", "document"])) {
      const docs = scheme.documents.map((doc) => `✓ ${doc[lang]}`).join("\n");
      return reply(
        `📄 ${t("documents", lang)}\n\n${docs}${scheme.caution ? `\n\n⚠️ ${scheme.caution[lang]}` : ""}`,
        schemeOptions(lang),
        { card: cardOf(scheme, lang) },
      );
    }
    if (lower === "action:other" || has(lower, ["வேறு திட்ட", "अन्य योजना", "other scheme", "more options"])) {
      return showResults(next, notes);
    }
    if (lower === "action:explain") {
      return reply(
        `${t("iUnderstood", lang)} ${t("tellMeMore", lang)}`,
        schemeOptions(lang),
        { card: cardOf(scheme, lang) },
      );
    }
    if (lower.startsWith("scheme:")) return openScheme(next, lower.slice(7), notes);
    if (d.schemeId) return openScheme(next, d.schemeId, notes);
    if (has(lower, ["முதன்மை", "होम", "home", "menu"])) return home(next, notes);
    // Default: re-show the card.
    return reply(openSchemeText(scheme, lang), schemeOptions(lang), { card: cardOf(scheme, lang) });
  }

  /* ---------------- GUIDE ---------------- */
  if (next.stage === "guide") {
    const scheme = getScheme(next.activeScheme);
    if (!scheme) return home(next, notes);
    if (lower === "action:restart" || has(lower, ["மீண்டும் தொடங்க", "फिर से शुरू", "start again", "restart"]))
      return home(next, notes);

    const g = guideOf(scheme, next.guideIndex, lang);

    if (lower === "action:repeat") {
      return reply(
        `${t("stepOf", lang, { n: g.index + 1, total: g.total })}\n\n${g.text}${g.detail ? `\n\n${g.detail}` : ""}`,
        guideOptions(lang, g),
        { guide: g },
      );
    }
    if (lower === "action:back") {
      next.guideIndex = Math.max(0, next.guideIndex - 1);
      const g2 = guideOf(scheme, next.guideIndex, lang);
      return reply(
        `${t("stepOf", lang, { n: g2.index + 1, total: g2.total })}\n\n${g2.text}${g2.detail ? `\n\n${g2.detail}` : ""}`,
        guideOptions(lang, g2),
        { guide: g2 },
      );
    }
    if (lower === "action:explain") {
      return reply(
        `${t("iUnderstood", lang)} ${t("tellMeMore", lang)}\n\n${g.detail ?? g.text}`,
        guideOptions(lang, g),
        { guide: g },
      );
    }
    if (lower === "action:next" || lower === "action:finish") {
      return advanceGuide(next, scheme, notes);
    }
    if (lower.startsWith("scheme:")) return openScheme(next, lower.slice(7), notes);

    // Any spoken words while we are waiting for her to report the screen.
    if (g.expectsReport && text.length > 1) {
      return advanceGuide(next, scheme, notes, t("welcomeBack", lang));
    }
    // Otherwise treat as a question: acknowledge and stay on this step.
    return reply(
      `${t("iUnderstood", lang)} ${t("tellMeMore", lang)}\n\n${g.text}${g.detail ? `\n\n${g.detail}` : ""}`,
      guideOptions(lang, g),
      { guide: g },
    );
  }

  /* ---------------- DONE / UNKNOWN ---------------- */
  if (next.stage === "done" || next.stage === "unknown") {
    if (lower.startsWith("cat:")) {
      const id = lower.slice(4) as Category;
      next.intent = id;
      next.slots = {};
      return startIntent(next, id, notes);
    }
    const intent = hint?.category ?? d.category;
    if (intent && intent !== "other" && d.score >= 1) {
      next.intent = intent;
      next.slots = {};
      return startIntent(next, intent, notes);
    }
    if (d.schemeId) return openSchemeResults(next, d.schemeId, notes);
    return home(next, notes);
  }

  return home(next, notes);
}

/* ------------------------------------------------------------------ */
/* Helpers used by turn()                                              */
/* ------------------------------------------------------------------ */

function home(state: ConvState, notes: string[]): EngineReply {
  const lang = state.lang;
  state.stage = "home";
  state.intent = null;
  state.slots = {};
  state.results = [];
  state.activeScheme = null;
  state.guideIndex = 0;
  return {
    state,
    say: t("greeting", lang),
    options: categoryOptions(lang),
    card: null,
    guide: null,
    results: null,
    notes,
  };
}

function startIntent(state: ConvState, intent: Category, notes: string[]): EngineReply {
  const lang = state.lang;
  state.stage = "ask";
  state.intent = intent;
  state.slots = {};
  state.qIndex = 0;
  const q = questionFor(intent, state.slots, state.skipped ?? []);
  if (!q) {
    // No questions needed (e.g. "other") → go straight to results / unknown.
    const ranked = rankSchemes(intent, state.slots);
    if (ranked.length) return showResults(state, notes);
    state.stage = "unknown";
    return {
      state,
      say: t("cannotVerify", lang),
      options: categoryOptions(lang),
      card: null,
      guide: null,
      results: null,
      notes,
    };
  }
  return askQuestion(state, q, notes);
}

function askQuestion(
  state: ConvState,
  q: Question,
  notes: string[],
  prefix?: L,
): EngineReply {
  const lang = state.lang;
  state.stage = "ask";
  const options: Option[] = q.options.map((o) => ({
    label: o.label[lang],
    value: o.value,
    icon: o.icon,
  }));
  const say = `${prefix ? `${prefix[lang]}\n\n` : ""}${q.ask[lang]}`;
  return { state, say, options, card: null, guide: null, results: null, notes };
}

function showResults(
  state: ConvState,
  notes: string[],
  prefix?: L,
): EngineReply {
  const lang = state.lang;
  const intent = state.intent ?? "business";
  const ranked = rankSchemes(intent, state.slots);
  state.stage = "results";
  state.results = ranked.map((s) => s.id);

  if (!ranked.length) {
    state.stage = "unknown";
    return {
      state,
      say: t("cannotVerify", lang),
      options: categoryOptions(lang),
      card: null,
      guide: null,
      results: null,
      notes,
    };
  }

  if (state.slots.age18 === false) {
    notes.push(t("ageNote", lang));
  }
  if (state.slots.priorLoan === true) {
    notes.push(t("priorLoanNote", lang));
  }

  const results = ranked.map((s) => ({
    id: s.id,
    name: s.name[lang],
    reason: s.reason[lang],
    tagline: s.tagline[lang],
  }));

  const intro =
    prefix?.[lang] ??
    ({
      ta: `நல்லது! உங்களுக்குப் பொருந்தும் ${ranked.length} அரசு வழிகளைக் கண்டறிந்தேன். அறிய ஒன்றைத் தேர்ந்தெடுங்கள் 👇`,
      hi: `बढ़िया! आपके लिए ${ranked.length} सरकारी रास्ते मिले। जानने के लिए एक चुनें 👇`,
      en: `Great! I found ${ranked.length} government options that fit you. Pick one to learn more 👇`,
    } as L)[lang];

  const options: Option[] = ranked.map((s) => ({
    label: `${s.name[lang]}`,
    value: `scheme:${s.id}`,
  }));
  options.push({ label: t("otherSchemes", lang), value: "cat:other" });

  return {
    state,
    say: intro,
    options,
    card: null,
    guide: null,
    results,
    notes,
  };
}

function openScheme(state: ConvState, id: string, notes: string[]): EngineReply {
  const lang = state.lang;
  const scheme = getScheme(id);
  state.stage = "scheme";
  state.activeScheme = id;
  state.guideIndex = 0;
  if (!scheme) {
    state.stage = "unknown";
    return {
      state,
      say: t("cannotVerify", lang),
      options: categoryOptions(lang),
      card: null,
      guide: null,
      results: null,
      notes,
    };
  }
  return {
    state,
    say: openSchemeText(scheme, lang),
    options: schemeOptions(lang),
    card: cardOf(scheme, lang),
    guide: null,
    results: null,
    notes,
  };
}

function openSchemeResults(state: ConvState, id: string, notes: string[]): EngineReply {
  // User named a scheme directly: show a short list so she keeps control.
  const scheme = getScheme(id)!;
  const lang = state.lang;
  state.stage = "results";
  state.intent = scheme.category[0];
  const ranked = rankSchemes(scheme.category[0], {});
  state.results = [id, ...ranked.map((s) => s.id).filter((x) => x !== id)].slice(0, 5);
  const results = state.results.map((sid) => getScheme(sid)!).map((s) => ({
    id: s.id,
    name: s.name[lang],
    reason: s.reason[lang],
    tagline: s.tagline[lang],
  }));
  return {
    state,
    say: {
      ta: `நல்லது — ${scheme.name[lang]} பற்றிப் பேசுகிறோம். இதற்கு மாற்று வழிகளும் உள்ளன. மேலும் அறிய ஒன்றைத் தேர்ந்தெடுங்கள் 👇`,
      hi: `ठीक है — ${scheme.name[lang]} की बात कर रहे हैं। इसके विकल्प भी हैं। एक चुनें 👇`,
      en: `Okay — let us talk about ${scheme.name[lang]}. There are alternatives too. Pick one 👇`,
    }[lang],
    options: state.results.map((sid) => ({
      label: getScheme(sid)!.name[lang],
      value: `scheme:${sid}`,
    })),
    card: null,
    guide: null,
    results,
    notes,
  };
}

function openSchemeText(scheme: Scheme, lang: Lang): string {
  return (
    {
      ta: `✅ ${scheme.name[lang]}\n\n${scheme.tagline[lang]}\n\n${t("whyFit", lang)}: ${scheme.reason[lang]}`,
      hi: `✅ ${scheme.name[lang]}\n\n${scheme.tagline[lang]}\n\n${t("whyFit", lang)}: ${scheme.reason[lang]}`,
      en: `✅ ${scheme.name[lang]}\n\n${scheme.tagline[lang]}\n\n${t("whyFit", lang)}: ${scheme.reason[lang]}`,
    } as L
  )[lang];
}

function schemeOptions(lang: Lang): Option[] {
  return [
    { label: t("viewSteps", lang), value: "action:steps" },
    { label: t("viewDocs", lang), value: "action:docs" },
    { label: t("explainMore", lang), value: "action:explain" },
    { label: t("otherSchemes", lang), value: "action:other" },
    { label: t("restart", lang), value: "action:restart" },
  ];
}

function guideOptions(lang: Lang, g: GuidePayload): Option[] {
  const opts: Option[] = [];
  if (g.index > 0) opts.push({ label: t("back", lang), value: "action:back" });
  const isLast = g.index >= g.total - 1;
  opts.push({
    label: isLast ? t("done", lang) : t("next", lang),
    value: isLast ? "action:finish" : "action:next",
  });
  opts.push({ label: t("repeat", lang), value: "action:repeat" });
  opts.push({ label: t("explainMore", lang), value: "action:explain" });
  return opts;
}

function advanceGuide(
  state: ConvState,
  scheme: Scheme,
  notes: string[],
  prefix?: string,
): EngineReply {
  const lang = state.lang;
  state.guideIndex += 1;
  if (state.guideIndex >= scheme.steps.length) {
    state.stage = "done";
    return {
      state,
      say: `${prefix ? `${prefix}\n\n` : ""}${t("allDone", lang)}`,
      options: categoryOptions(lang),
      card: null,
      guide: null,
      results: null,
      notes,
    };
  }
  const g = guideOf(scheme, state.guideIndex, lang);
  return {
    state,
    say: `${prefix ? `${prefix}\n\n` : ""}${t("stepOf", lang, { n: g.index + 1, total: g.total })}\n\n${g.text}${
      g.detail ? `\n\n${g.detail}` : ""
    }`,
    options: guideOptions(lang, g),
    card: null,
    guide: g,
    results: null,
    notes,
  };
}

/** Schemes that can be surfaced from a free-text mention, in priority order. */
export const SCHEME_IDS = SCHEMES.map((s) => s.id);
