/**
 * Sakhi AI — UI strings (Tamil / Hindi / English)
 * Tamil is the primary language of the demo journey.
 */

export type Lang = "ta" | "hi" | "en";

export type L = Record<Lang, string>;

export const LANGS: { id: Lang; label: string; full: string; speech: string }[] = [
  { id: "ta", label: "தமிழ்", full: "தமிழ்", speech: "ta-IN" },
  { id: "hi", label: "हिंदी", full: "हिन्दी", speech: "hi-IN" },
  { id: "en", label: "EN", full: "English", speech: "en-IN" },
];

export const UI: Record<string, L> = {
  appName: { ta: "சகி AI", hi: "सखी AI", en: "Sakhi AI" },
  appTagline: {
    ta: "உங்கள் டிஜிட்டல் நண்பன்",
    hi: "आपकी डिजिटल साथी",
    en: "Your digital friend",
  },

  greeting: {
    ta: "வணக்கம்! 🙏 உங்களுக்கு என்ன உதவி வேண்டும்?",
    hi: "नमस्ते! 🙏 आपकी क्या मदद चाहिए?",
    en: "Hello! 🙏 How can I help you?",
  },
  greetingSub: {
    ta: "பேசுங்கள், அல்லது கீழே ஒன்றைத் தேர்ந்தெடுங்கள்",
    hi: "बोलिए, या नीचे से कुछ चुनिए",
    en: "Speak, or pick one below",
  },
  micBig: { ta: "🎤 பேசுங்கள்", hi: "🎤 बोलिए", en: "🎤 Speak" },
  micHint: {
    ta: "பெரிய பொத்தானை அழுத்தி, உங்கள் தேவையைச் சொல்லுங்கள்",
    hi: "बड़े बटन को दबाकर अपनी ज़रूरत बताइए",
    en: "Press the big button and tell me what you need",
  },
  listening: {
    ta: "கேட்கிறேன்... நன்றாகப் பேசுங்கள்",
    hi: "सुन रही हूँ... धीरे बोलिए",
    en: "Listening... please speak",
  },
  tapToStop: { ta: "நிறுத்த அழுத்துங்கள்", hi: "रोकने के लिए दबाएँ", en: "Tap to stop" },
  typeHere: { ta: "இங்கே எழுதுங்கள்...", hi: "यहाँ लिखिए...", en: "Type here..." },
  send: { ta: "அனுப்பு", hi: "भेजें", en: "Send" },
  categoriesTitle: {
    ta: "என்ன உதவி வேண்டும்?",
    hi: "क्या मदद चाहिए?",
    en: "What do you need?",
  },
  speakAloud: { ta: "🔊 கேட்க", hi: "🔊 सुनें", en: "🔊 Listen" },
  thinking: {
    ta: "எண்ணுகிறேன்...",
    hi: "सोच रही हूँ...",
    en: "Thinking...",
  },
  restart: { ta: "🔄 மீண்டும் தொடங்கு", hi: "🔄 फिर से शुरू", en: "🔄 Start again" },
  voiceOn: { ta: "குரல் இயக்கு", hi: "आवाज़ चालू", en: "Voice on" },
  voiceOff: { ta: "குரல் நிறுத்து", hi: "आवाज़ बंद", en: "Voice off" },
  voiceNotSupported: {
    ta: "இந்த உலாவியில் குரல் உள்ளீடு இல்லை. கீழே எழுதி அனுப்பலாம்.",
    hi: "इस ब्राउज़र में आवाज़ इनपुट नहीं है। नीचे लिखकर भेजिए।",
    en: "Voice input is not supported in this browser. You can type below.",
  },
  micDenied: {
    ta: "மைக் அனுமதி தேவை. அனுமதி அளித்து மீண்டும் முயற்சிக்கவும், அல்லது எழுதுங்கள்.",
    hi: "माइक की अनुमति चाहिए। अनुमति देकर दोबारा कोशिश करें, या लिखिए।",
    en: "Microphone permission is needed. Allow it and try again, or type instead.",
  },
  aiModeGemini: {
    ta: "✨ Gemini AI இயக்கத்தில்",
    hi: "✨ Gemini AI चालू",
    en: "✨ Gemini AI active",
  },
  aiModeLocal: {
    ta: "📶 ஆஃப்லைன் பயன்முறை (ஆட்டோ-பதில்)",
    hi: "📶 ऑफ़लाइन मोड (स्वतः उत्तर)",
    en: "📶 Offline mode (rule-based)",
  },

  safetyTitle: { ta: "⚠️ பாதுகாப்பு", hi: "⚠️ सुरक्षा", en: "⚠️ Safety" },
  safetyText: {
    ta: "சகி OTP, பாஸ்வேர்டு, ATM PIN, UPI PIN ஆகியவற்றை ஒருபோதும் கேட்காது. சந்தேகமான இணைப்புகளை அழுத்த வேண்டாம். பணம் கேட்பவருக்கு கொடுக்க வேண்டாம்.",
    hi: "सखी कभी भी OTP, पासवर्ड, ATM PIN, UPI PIN नहीं मांगेगी। संदिग्ध लिंक न दबाएँ। पैसा मांगने वाले को पैसा न दें।",
    en: "Sakhi will never ask for OTP, password, ATM PIN or UPI PIN. Never tap suspicious links. Never pay anyone who asks for money.",
  },

  // Section headers on a scheme card
  whatYouGet: { ta: "என்ன கிடைக்கும்?", hi: "क्या मिलेगा?", en: "What you get" },
  whoCanApply: { ta: "யாருக்கு கிடைக்கும்?", hi: "कौन ले सकता है?", en: "Who can apply" },
  documents: { ta: "தேவையான ஆவணங்கள்", hi: "ज़रूरी कागज़", en: "Documents needed" },
  howToApply: { ta: "எப்படி விண்ணப்பிப்பது", hi: "कैसे आवेदन करें", en: "How to apply" },
  officialSite: { ta: "அதிகாரப்பூர்வ இணையதளம்", hi: "आधिकारिक वेबसाइट", en: "Official website" },
  verifyNote: {
    ta: "விதிமுறைகள் மாறக்கூடும். விண்ணப்பிப்பதற்கு முன் அதிகாரப்பூர்வ இணையதளத்தில் உறுதிப்படுத்துங்கள்.",
    hi: "नियम बदल सकते हैं। आवेदन से पहले आधिकारिक वेबसाइट पर पुष्टि करें।",
    en: "Rules can change. Please confirm on the official website before applying.",
  },
  ministry: { ta: "துறை", hi: "मंत्रालय", en: "Ministry" },
  matchReason: { ta: "ஏன் இது உங்களுக்குப் பொருத்தம்", hi: "यह आपके लिए क्यों उपयुक्त है", en: "Why this fits you" },
  whyFit: {
    ta: "உங்களுக்கு ஏன் பொருந்தும்",
    hi: "आपके लिए क्यों उपयुक्त",
    en: "Why it fits you",
  },
  alsoSee: { ta: "இதையும் பாருங்கள்", hi: "यह भी देखें", en: "Also see" },

  // Buttons / chips
  yes: { ta: "ஆம்", hi: "हाँ", en: "Yes" },
  no: { ta: "இல்லை", hi: "नहीं", en: "No" },
  dontKnow: { ta: "தெரியவில்லை", hi: "पता नहीं", en: "I don't know" },
  next: { ta: "அடுத்தது ➜", hi: "आगे ➜", en: "Next ➜" },
  back: { ta: "⬅ பின்", hi: "⬅ पीछे", en: "⬅ Back" },
  repeat: { ta: "🔁 மீண்டும் சொல்", hi: "🔁 दोबारा बोलें", en: "🔁 Say again" },
  explainMore: { ta: "💡 மேலும் விளக்கம்", hi: "💡 और समझाएँ", en: "💡 Explain more" },
  viewSteps: { ta: "📋 வழிமுறை படிகள்", hi: "📋 कदम देखें", en: "📋 See steps" },
  viewDocs: { ta: "📄 ஆவணங்கள்", hi: "📄 कागज़", en: "📄 Documents" },
  otherSchemes: { ta: "🔍 வேறு திட்டங்கள்", hi: "🔍 अन्य योजनाएँ", en: "🔍 Other schemes" },
  openSite: { ta: "🌐 இணையதளத்தைத் திற", hi: "🌐 वेबसाइट खोलें", en: "🌐 Open website" },
  done: { ta: "✅ முடிந்தது!", hi: "✅ हो गया!", en: "✅ Done!" },
  stepOf: { ta: "படி {n} / {total}", hi: "कदम {n} / {total}", en: "Step {n} / {total}" },
  tellMeScreen: {
    ta: "திரையில் என்ன தெரிகிறது? என்னிடம் சொல்லுங்கள்.",
    hi: "स्क्रीन पर क्या दिख रहा है? मुझे बताइए।",
    en: "What do you see on the screen? Tell me.",
  },

  // Fallback / honesty
  cannotVerify: {
    ta: "இதைப் பற்றிய என்னிடம் உறுதிப்பட்ட தகவல் இல்லை. தவறான தகவலைச் சொல்ல नான் விரும்பவில்லை. உங்கள் அருகில் உள்ள சேவை மையம், கிராம பஞ்சாயத்து அலுவலகம் அல்லது ப்லாக் அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள். மீண்டும் உங்களுக்கு உதவி தேவைப்படும் மற்றொரு சேவையைச் சொல்லுங்கள்.",
    hi: "इस बारे में मेरे पास पक्की जानकारी नहीं है। गलत जानकारी देना मैं नहीं चाहती। आपके पास के सेवा केंद्र, ग्राम पंचायत कार्यालय या ब्लॉक कार्यालय से संपर्क करें। किसी और सेवा में मदद चाहिए तो बताइए।",
    en: "I do not have verified information about this, and I do not want to give you wrong information. Please contact your nearest service centre, village panchayat office or block office. Tell me if you need help with anything else.",
  },
  verifying: {
    ta: "இதை நான் சரிபார்க்க வேண்டும் — உங்கள் பகுதி அலுவலகத்தில் உறுதிப்படுத்துங்கள்.",
    hi: "इसे मुझे जाँचना होगा — अपने क्षेत्र के कार्यालय में पुष्टि करें।",
    en: "This needs verification — please confirm with your local office.",
  },
  welcomeBack: {
    ta: "நன்றி! இப்போது நாம் படிப்படியாகச் செல்வோம்.",
    hi: "धन्यवाद! अब हम कदम-कदम में आगे बढ़ेंगे।",
    en: "Thank you! Now let us go step by step.",
  },
  allDone: {
    ta: "நீங்கள் இந்த வேலையை முடித்துவிட்டீர்கள்! 🎉 வேறு எதற்கு உதவி தேவை?",
    hi: "आपने यह काम पूरा कर लिया! 🎉 और किसी चीज़ में मदद चाहिए?",
    en: "You have finished this task! 🎉 What else can I help with?",
  },
  ageNote: {
    ta: "குறிப்பு: பெரும்பாலான திட்டங்களுக்கு 18 வயது தேவை. அந்த வயது வந்த பிறகு மீண்டும் வாருங்கள் — நான் காத்திருக்கிறேன்.",
    hi: "नोट: अधिकतर योजनाओं में 18 साल की आयु चाहिए। आयु आने पर फिर आइए — मैं इंतज़ार करूँगी।",
    en: "Note: most schemes require age 18. Please come back when you turn 18 — I will be waiting.",
  },
  priorLoanNote: {
    ta: "நீங்கள் ஏற்கனவே இதுபோன்ற கடன் எடுத்திருப்பதால், இந்தத் திட்டத்திற்கு இப்போது தகுதி இருக்காது. ஆனால் வேறு வழிகளுக்கு நான் உதவலாம்.",
    hi: "आपने पहले ऐसा ऋण ले लिया है, इसलिए इस योजना के लिए अभी पात्र नहीं हैं। लेकिन मैं अन्य रास्तों में मदद कर सकती हूँ।",
    en: "Since you have already taken a similar loan, you are not eligible for this scheme right now. But I can help with other options.",
  },
  askAnother: {
    ta: "மற்றொரு சேவைக்கு வந்துவிடுங்கள் — நான் உங்களுடன் இருக்கிறேன்.",
    hi: "किसी और सेवा के लिए आइए — मैं आपके साथ हूँ।",
    en: "Come for another service — I am with you.",
  },
  noMatchCategory: {
    ta: "சரி. உங்களுக்கு எந்த வகை உதவி வேண்டும்? கீழே ஒன்றைத் தேர்ந்தெடுங்கள்.",
    hi: "ठीक है। आपको किस तरह की मदद चाहिए? नीचे से चुनिए।",
    en: "Okay. What kind of help do you need? Please pick one below.",
  },
  iUnderstood: {
    ta: "புரிந்துகொண்டேன்.",
    hi: "समझ गई।",
    en: "I understand.",
  },
  tellMeMore: {
    ta: "மேலும் சொல்லுங்கள் — நான் நன்றாகக் கேட்கிறேன்.",
    hi: "और बताइए — मैं ध्यान से सुन रही हूँ।",
    en: "Tell me more — I am listening.",
  },
};

export type Category = "work" | "business" | "education" | "skill" | "services" | "other";

export const CATEGORIES: {
  id: Category;
  icon: string;
  label: L;
  desc: L;
}[] = [
  {
    id: "work",
    icon: "💼",
    label: { ta: "வேலை", hi: "काम", en: "Work" },
    desc: {
      ta: "உத்தியோகம் / நாள் கூலி",
      hi: "नौकरी / मजदूरी",
      en: "Job / daily wages",
    },
  },
  {
    id: "business",
    icon: "🏪",
    label: { ta: "தொழில்", hi: "व्यापार", en: "Business" },
    desc: {
      ta: "சிறு தொழில் தொடங்க",
      hi: "छोटा व्यापार शुरू करें",
      en: "Start a small business",
    },
  },
  {
    id: "education",
    icon: "🎓",
    label: { ta: "கல்வி", hi: "शिक्षा", en: "Education" },
    desc: {
      ta: "உதவித்தொகை / சேமிப்பு",
      hi: "छात्रवृत्ति / बचत",
      en: "Scholarship / savings",
    },
  },
  {
    id: "skill",
    icon: "🛠️",
    label: { ta: "திறன் பயிற்சி", hi: "कौशल प्रशिक्षण", en: "Skill training" },
    desc: {
      ta: "இலவச படிப்பு",
      hi: "मुफ़्त सीखें",
      en: "Free learning",
    },
  },
  {
    id: "services",
    icon: "📄",
    label: { ta: "அரசு சேவைகள்", hi: "सरकारी सेवाएँ", en: "Govt services" },
    desc: {
      ta: "அட்டை / பதிவு",
      hi: "कार्ड / रजिस्ट्रेशन",
      en: "Card / registration",
    },
  },
  {
    id: "other",
    icon: "❓",
    label: { ta: "வேறு உதவி", hi: "और मदद", en: "Other help" },
    desc: {
      ta: "வேறு ஏதாவது",
      hi: "कुछ और",
      en: "Something else",
    },
  },
];

export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = UI[key];
  if (!entry) return key;
  let out = entry[lang] ?? entry.en;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return out;
}
