/**
 * Sakhi AI — Verified resource database
 * ---------------------------------------------------------------------------
 * Every entry below was cross-checked against official Government of India
 * portals and reputable coverage. Nothing here is invented.
 *
 * `lastVerified` is the date the facts were last checked (hackathon build).
 * Sakhi ALWAYS shows the official link + a "please verify" note, because
 * scheme rules (limits, dates, subsidy %) change.
 *
 * IMPORTANT RULE FOR CONTRIBUTORS:
 *   Add a scheme ONLY if you can cite an official *.gov.in URL.
 *   Never invent a scheme name, benefit amount or eligibility rule.
 */

import type { Category, L } from "./i18n";

export type Trade = "tailoring" | "artisan" | "food" | "shop" | "beauty" | "other";
export type Need = "loan" | "training" | "both" | "unknown";

export interface GuideStep {
  text: L;
  detail?: L;
  /** If true, Sakhi asks the user to report what she sees and waits for her. */
  expectsReport?: boolean;
}

export interface Scheme {
  id: string;
  name: L;
  ministry: L;
  category: Category[];
  officialUrl: string;
  officialPortalName: string;
  tagline: L;
  gives: L[];
  eligibility: L[];
  documents: L[];
  steps: GuideStep[];
  /** Extra safety / caution note specific to this scheme. */
  caution?: L;
  verify: L;
  keywords: Record<string, string[]>;
  trades: Trade[];
  needs: Need[];
  reason: L;
  lastVerified: string;
}

export const SCHEMES: Scheme[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "pm-vishwakarma",
    name: {
      ta: "பிரதமர் விஷ்வகர்மா திட்டம்",
      hi: "प्रधानमंत्री विश्वकर्मा योजना",
      en: "PM Vishwakarma Yojana",
    },
    ministry: {
      ta: "சிறு, நடுத்தர தொழில் அமைச்சகம் (MSME)",
      hi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय (MSME)",
      en: "Ministry of MSME",
    },
    category: ["business", "skill", "services"],
    officialUrl: "https://pmvishwakarma.gov.in",
    officialPortalName: "pmvishwakarma.gov.in",
    tagline: {
      ta: "பாரம்பரியத் தொழிலாளர்களுக்கு — இலவச பயிற்சி, ₹15,000 கருவி உதவி, பாதுகாப்பு இல்லாத கடன் ₹1 லட்சம் (வட்டி 5%)",
      hi: "पारंपरिक कारीगरों के लिए — मुफ़्त प्रशिक्षण, ₹15,000 टूलकिट सहायता, ₹1 लाख का बिना गिरवी का लोन (ब्याज 5%)",
      en: "For traditional artisans — free training, ₹15,000 toolkit grant, ₹1 lakh collateral-free loan (5% interest)",
    },
    gives: [
      {
        ta: "இலவச அடிப்படை பயிற்சி (5–7 நாட்கள்). பயிற்சிக்கு நாளுக்கு ₹500 கிடைக்கும்.",
        hi: "मुफ़्त बुनियादी प्रशिक्षण (5–7 दिन)। प्रशिक्षण के दौरान रोज़ ₹500 मिलेंगे।",
        en: "Free basic training (5–7 days). You get ₹500 per day during training.",
      },
      {
        ta: "₹15,000 வரை கருவி (toolkit) உதவித்தொகை — திரும்பச் செலுத்த வேண்டாம்.",
        hi: "₹15,000 तक टूलकिट प्रोत्साहन — यह वापस नहीं करना होता।",
        en: "Toolkit incentive up to ₹15,000 — you never have to repay it.",
      },
      {
        ta: "முதல் கடன் ₹1 லட்சம் — பாதுகாப்பு (collateral) தேவை இல்லை, வட்டி ஆண்டுக்கு 5% மட்டும்.",
        hi: "पहला लोन ₹1 लाख — बिना गिरवी, ब्याज सिर्फ़ 5% सालाना।",
        en: "First loan ₹1 lakh — no collateral, only 5% interest per year.",
      },
      {
        ta: "நன்றாகச் செலுத்தினால் இரண்டாம் கடன் ₹2 லட்சம் வரை.",
        hi: "समय पर चुकाने पर दूसरा लोन ₹2 लाख तक।",
        en: "A second loan up to ₹2 lakh if you repay the first on time.",
      },
      {
        ta: "விஷ்வகர்மா அடையாள அட்டை — உங்கள் தொழிலுக்கு அதிகாரப்பூர்வ அங்கீகாரம்.",
        hi: "विश्वकर्मा आईडी कार्ड — आपके काम की सरकारी मान्यता।",
        en: "A Vishwakarma ID card — official recognition of your craft.",
      },
    ],
    eligibility: [
      {
        ta: "வயது 18 வது வயதுக்கு மேல்.",
        hi: "आयु 18 साल से अधिक।",
        en: "Age 18 years or above.",
      },
      {
        ta: "தையல் போன்ற 18 பாரம்பரியத் தொழில்களில் ஒன்றில் கைகளால் உழைப்பவர்.",
        hi: "सिलाई जैसे 18 पारंपरिक कामों में से एक में हाथों से काम करने वाले।",
        en: "Someone who works with their hands in one of 18 traditional trades (including tailoring).",
      },
      {
        ta: "கடந்த 5 ஆண்டுகளில் PMEGP, முத்ரா அல்லது PM SVANidhi கடன் எடுக்காதவர்.",
        hi: "पिछले 5 साल में PMEGP, मुद्रा या PM SVANidhi का लोन न लिया हो।",
        en: "You have not taken a PMEGP, MUDRA or PM SVANidhi loan in the last 5 years.",
      },
      {
        ta: "ஒரு குடும்பத்தில் (கணவர், மனைவி, அணாமா மக்கள்) ஒருவர் மட்டுமே பயன்படுத்தலாம்.",
        hi: "एक परिवार (पति, पत्नी, अविवाहित बच्चे) में सिर्फ़ एक व्यक्ति ले सकता है।",
        en: "Only one member per family (husband, wife, unmarried children).",
      },
      {
        ta: "பள்ளி அல்லது கல்லூரி படித்திருக்க வேண்டிய அவசியம் இல்லை.",
        hi: "स्कूल या कॉलेज पढ़ना ज़रूरी नहीं।",
        en: "No school or college qualification is required.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      {
        ta: "ஆதாருடன் இணைக்கப்பட்ட மொபைல் எண்",
        hi: "आधार से जुड़ा मोबाइल नंबर",
        en: "Mobile number linked to Aadhaar",
      },
      {
        ta: "வங்கிக் கணக்கு புத்தகம் அல்லது பாஸ்புக்",
        hi: "बैंक पासबुक",
        en: "Bank passbook",
      },
      { ta: "உங்கள் 2 புகைப்படங்கள்", hi: "आपकी 2 तस्वीरें", en: "2 passport photos" },
    ],
    steps: [
      {
        text: {
          ta: "pmvishwakarma.gov.in இணையதளத்தைத் திறங்கள். இணையம் இல்லையென்றால் அருகில் உள்ள சேவை மையத்திற்குச் (CSC) செல்லுங்கள்.",
          hi: "pmvishwakarma.gov.in वेबसाइट खोलें। इंटरनेट न हो तो नज़दीकी सेवा केंद्र (CSC) जाएँ।",
          en: "Open pmvishwakarma.gov.in. If you have no internet, go to your nearest Common Service Centre (CSC).",
        },
        detail: {
          ta: "CSC உதவியாளர் இலவசமாக பதிவு செய்ய உதவுவார். இணையதளத்தைத் திறக்கத் தெரியாவிட்டால் என்னிடம் மீண்டும் கேட்கவும்.",
          hi: "CSC सहायक मुफ़्त में रजिस्ट्रेशन में मदद करेंगे। वेबसाइट खोलना न आए तो मुझसे फिर पूछें।",
          en: "The CSC helper will register you for free. Ask me again if you cannot open the website.",
        },
      },
      {
        text: {
          ta: "முதல் திரையில் 'புதிய பயனர் பதிவு' (New User Registration) என்பதை அழுத்துங்கள்.",
          hi: "पहली स्क्रीन पर 'न्यू यूजर रजिस्ट्रेशन' दबाएँ।",
          en: "On the first screen, press 'New User Registration'.",
        },
      },
      {
        text: {
          ta: "உங்கள் மொபைல் எண்ணை உள்ளிட்டு, தொலைபேசியில் வரும் OTP-ஐயே நீங்களே நுழையுங்கள்.",
          hi: "अपना मोबाइल नंबर डालें और फ़ोन पर आया OTP खुद ही डालें।",
          en: "Enter your mobile number and type the OTP that arrives on your phone yourself.",
        },
        expectsReport: true,
        detail: {
          ta: "⚠️ OTP-ஐ வேறு யாருக்கும் சொல்ல வேண்டாம். அரசு அதிகாரிகள் கூட OTP கேட்க மாட்டார்கள்.",
          hi: "⚠️ OTP किसी को न बताएँ। सरकारी अफ़सर भी OTP नहीं मांगेंगे।",
          en: "⚠️ Never share the OTP with anyone. Even government officers will not ask for it.",
        },
      },
      {
        text: {
          ta: "ஆதார் எண்ணை நிரப்பி e-KYC-ஐ செய்யுங்கள். உங்கள் பெயர் ஆதாரில் உள்ளது போலவே எழுதுங்கள்.",
          hi: "आधार नंबर डालकर e-KYC करें। नाम आधार जैसा ही लिखें।",
          en: "Fill your Aadhaar number and complete e-KYC. Write your name exactly as on Aadhaar.",
        },
      },
      {
        text: {
          ta: "உங்கள் தையல் தொழிலின் விவரத்தை (எங்கே செய்கிறீர்கள், என்ன தைய் செய்கிறீர்கள்) எழுதுங்கள்.",
          hi: "अपने सिलाई काम का ब्यौरा लिखें (कहाँ करती हैं, क्या बनाती हैं)।",
          en: "Describe your tailoring work (where you work, what you stitch).",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "பதிவு எண் வந்ததும் அதை எழுதுங்கள் அல்லது புகைப்படம் எடுத்து வையுங்கள்.",
          hi: "रजिस्ट्रेशन नंबर आने पर लिख लें या फ़ोटो खींच लें।",
          en: "When the registration number appears, write it down or take a photo.",
        },
      },
      {
        text: {
          ta: "அடிப்படை பயிற்சியை முடித்த பிறகு ₹15,000 கருவி உதவியும் ₹1 லட்சம் கடனும் பெறலாம்.",
          hi: "बुनियादी प्रशिक्षण के बाद ₹15,000 टूलकिट और ₹1 लाख का लोन मिल सकता है।",
          en: "After basic training you can get the ₹15,000 toolkit and the ₹1 lakh loan.",
        },
      },
    ],
    caution: {
      ta: "இந்தத் திட்டத்தில் பதிவு செய்ய யாரும் கட்டணம் வசூலிக்க மாட்டார்கள். பணம் கேட்பவர் ஏமாற்றுபவர்.",
      hi: "इस योजना में रजिस्ट्रेशन के लिए कोई शुल्क नहीं लेता। पैसा मांगने वाला ठग है।",
      en: "Nobody will charge you a fee to register for this scheme. Anyone asking for money is a fraudster.",
    },
    verify: {
      ta: "விவரங்களை pmvishwakarma.gov.in இல் உறுதிப்படுத்துங்கள். திட்டக் காலம் 2028 மார்ச் 31 வரை என்று அறிவிக்கப்பட்டுள்ளது.",
      hi: "विवरण pmvishwakarma.gov.in पर पुष्टि करें। योजना अवधि 31 मार्च 2028 तक बताई गई है।",
      en: "Confirm details at pmvishwakarma.gov.in. The scheme period is notified up to 31 March 2028.",
    },
    keywords: {
      ta: ["தையல்", "தையல் கார்", "தையல்காரை", "விஷ்வகர்மா", "கருவி உதவி", "நெசெல்", "ஊட்டு"],
      hi: ["सिलाई", "दर्जी", "विश्वकर्मा", "टेलर", "कढ़ाई", "बढ़ई"],
      en: ["tailor", "tailoring", "vishwakarma", "stitching", "boutique", "artisan", "handloom", "weaver", "carpenter", "handicraft", "kapda", "kapda business"],
    },
    trades: ["tailoring", "artisan", "beauty"],
    needs: ["loan", "training", "both", "unknown"],
    reason: {
      ta: "தையல் ஒரு அங்கீகரிக்கப்பட்ட பாரம்பரியத் தொழில். உங்களுக்கு இலவச பயிற்சியும் பாதுகாப்பு இல்லாத கடனும் கிடைக்கும்.",
      hi: "सिलाई एक मान्यता प्राप्त पारंपरिक काम है। आपको मुफ़्त प्रशिक्षण और बिना गिरवी का लोन मिल सकता है।",
      en: "Tailoring is an approved traditional trade, so you can get free training and a collateral-free loan.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pmegp",
    name: {
      ta: "பிரதமர் வேலை உருவாக்கத் திட்டம் (PMEGP)",
      hi: "प्रधानमंत्री रोज़गार सृजन कार्यक्रम (PMEGP)",
      en: "Prime Minister's Employment Generation Programme (PMEGP)",
    },
    ministry: {
      ta: "சிறு, நடுத்தர தொழில் அமைச்சகம் — KVIC",
      hi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय — KVIC",
      en: "Ministry of MSME — KVIC",
    },
    category: ["business", "skill"],
    officialUrl: "https://pmegp.msme.gov.in",
    officialPortalName: "pmegp.msme.gov.in",
    tagline: {
      ta: "புதிய சிறு தொழிலுக்கு அரசு மானியம் (subsidy) மற்றும் வங்கிக் கடன்",
      hi: "नए छोटे व्यापार के लिए सरकारी सब्सिडी और बैंक लोन",
      en: "A government subsidy plus a bank loan for a new small business",
    },
    gives: [
      {
        ta: "பெண்களுக்கு கிராமப்புறத்தில் திட்ட செலவில் 35% வரை அரசு மானியம். நகரத்தில் 25%.",
        hi: "महिलाओं को ग्रामीण क्षेत्र में परियोजना लागत का 35% तक सब्सिडी। शहर में 25%।",
        en: "For women, a subsidy of up to 35% of project cost in rural areas (25% urban).",
      },
      {
        ta: "அதிகபட்ச திட்ட செலவு: உற்பத்தித் தொழிலுக்கு ₹50 லட்சம், சேவைத் தொழிலுக்கு ₹20 லட்சம்.",
        hi: "अधिकतम परियोजना लागत: निर्माण ₹50 लाख, सेवा ₹20 लाख।",
        en: "Maximum project cost: ₹50 lakh (manufacturing), ₹20 lakh (service).",
      },
      {
        ta: "₹10 லட்சம் வரை கடனுக்கு பாதுகாப்பு (collateral) தேவை இல்லை.",
        hi: "₹10 लाख तक के लोन के लिए गिरवी ज़रूरी नहीं।",
        en: "No collateral required for loans up to ₹10 lakh.",
      },
      {
        ta: "உங்கள் சொந்த பங்கு பெண்களுக்கு 5% மட்டும்.",
        hi: "आपकी अपनी हिस्सेदारी महिलाओं के लिए सिर्फ़ 5%।",
        en: "Your own contribution is only 5% for women.",
      },
    ],
    eligibility: [
      { ta: "வயது 18 வது வயதுக்கு மேல்.", hi: "आयु 18 साल से अधिक।", en: "Age 18 or above." },
      {
        ta: "புதிதாகத் தொடங்கும் தொழில் மட்டும் — ஏற்கனவே இயங்கும் தொழிலுக்கு அல்ல.",
        hi: "सिर्फ़ नया व्यापार — चालू व्यापार के लिए नहीं।",
        en: "Only a brand-new unit, not an existing business.",
      },
      {
        ta: "திட்ட செலவு ₹10 லட்சத்திற்கு மேல் இருந்தால் 8வது தரம் படித்திருக்க வேண்டும்.",
        hi: "₹10 लाख से ज़्यादा लागत पर 8वीं पास होना ज़रूरी।",
        en: "For project cost above ₹10 lakh you must have passed class 8.",
      },
      {
        ta: "ஒருவருக்கு ஒரே ஒரு அரசு மானியத் திட்டம் கிடைக்கும்.",
        hi: "एक व्यक्ति को सिर्फ़ एक सब्सिडी योजना मिल सकती है।",
        en: "One person can get only one government subsidy scheme.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "பான் அட்டை", hi: "पैन कार्ड", en: "PAN card" },
      {
        ta: "வங்கிக் கணக்கு புத்தகம்",
        hi: "बैंक पासबुक",
        en: "Bank passbook",
      },
      { ta: "முகவரி சான்று", hi: "पते का प्रमाण", en: "Address proof" },
      {
        ta: "சாதி / சிறப்பு வகை சான்று (இருந்தால்)",
        hi: "जाति / विशेष श्रेणी प्रमाणपत्र (अगर है)",
        en: "Caste / special category certificate (if any)",
      },
      {
        ta: "திட்ட அறிக்கை (DPR) — உங்கள் தொழில் திட்டம்",
        hi: "परियोजना रिपोर्ट (DPR)",
        en: "Detailed project report (DPR)",
      },
      { ta: "புகைப்படங்கள்", hi: "तस्वीरें", en: "Photographs" },
    ],
    steps: [
      {
        text: {
          ta: "pmegp.msme.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "pmegp.msme.gov.in वेबसाइट खोलें।",
          en: "Open pmegp.msme.gov.in.",
        },
      },
      {
        text: {
          ta: "'புதிய விண்ணப்பம்' (New Application) என்பதை அழுத்துங்கள்.",
          hi: "'न्यू अप्लिकेशन' दबाएँ।",
          en: "Press 'New Application'.",
        },
      },
      {
        text: {
          ta: "ஆதார் எண்ணை நிரப்பி, உங்கள் மொபைலுக்கு வரும் OTP-ஐயே நுழையுங்கள்.",
          hi: "आधार नंबर डालें और फ़ोन पर आया OTP खुद डालें।",
          en: "Enter your Aadhaar number and type the OTP sent to your phone yourself.",
        },
        expectsReport: true,
        detail: {
          ta: "⚠️ OTP-ஐ யாருக்கும் சொல்ல வேண்டாம்.",
          hi: "⚠️ OTP किसी को न बताएँ।",
          en: "⚠️ Never share the OTP with anyone.",
        },
      },
      {
        text: {
          ta: "உங்கள் மாநிலம், மாவட்டம், தொழில் வகை, திட்ட செலவு போன்ற விவரங்களை நிரப்புங்கள்.",
          hi: "राज्य, ज़िला, व्यापार का प्रकार, परियोजना लागत आदि भरें।",
          en: "Fill in your state, district, type of business and project cost.",
        },
        detail: {
          ta: "'திட்ட செலவு' என்றால் யந்திரங்கள், கருவிகள், இடம் ஆகியவற்றிற்கான மொத்தத் தேவை. கருவிகளுக்கு ₹30,000–₹60,000 போன்று எதிர்பார்க்கலாம்.",
          hi: "'परियोजना लागत' का मतलब मशीन, उपकरण, जगह की कुल लागत।",
          en: "'Project cost' means machines, tools and premises combined.",
        },
      },
      {
        text: {
          ta: "விண்ணப்ப எண்ணை சேமித்து அதை எழுத்தில் குறித்து வையுங்கள்.",
          hi: "आवेदन संख्या सेव करके लिख लें।",
          en: "Save the application number and write it down.",
        },
      },
      {
        text: {
          ta: "விண்ணப்பத்தை உங்கள் வங்கி அல்லது மாவட்ட தொழில் மையத்தில் (DIC) சமர்ப்பிக்கவும்.",
          hi: "आवेदन को अपने बैंक या ज़िला उद्यम केंद्र (DIC) में जमा करें।",
          en: "Submit the application at your bank or District Industries Centre (DIC).",
        },
      },
    ],
    caution: {
      ta: "PMEGP விண்ணப்பம் இலவசம். யாரும் 'வேகத்திற்குரிய அனுமதி' என்று பணம் கேட்கக் கூடாது.",
      hi: "PMEGP आवेदन मुफ़्त है। कोई 'जल्दी मंज़ूरी' के लिए पैसा न मांगे।",
      en: "PMEGP applications are free. Nobody may charge you for 'faster approval'.",
    },
    verify: {
      ta: "மானிய விகிதம் மற்றும் விதிமுறைகள் pmegp.msme.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "सब्सिडी दर और नियम pmegp.msme.gov.in पर पुष्टि करें।",
      en: "Confirm the subsidy rate and rules at pmegp.msme.gov.in.",
    },
    keywords: {
      ta: ["பி.எம்.இ.ஜி.பி", "pmegp", "மானியம்", "வேலை உருவாக்கம்", "சிறு தொழில்", "kviconline"],
      hi: ["pmegp", "सब्सिडी", "रोज़गार", "छोटा उद्यम", "खादी"],
      en: ["pmegp", "subsidy", "kviconline", "employment generation", "marging money"],
    },
    trades: ["tailoring", "artisan", "food", "shop", "beauty", "other"],
    needs: ["loan", "both", "unknown"],
    reason: {
      ta: "பெண்களுக்கு கிராமப்புற மானியம் 35% வரை — புதிய தொழிலுக்கு மிக நல்ல உதவி.",
      hi: "महिलाओं के लिए ग्रामीण सब्सिडी 35% तक — नए व्यापार के लिए बढ़िया मदद।",
      en: "Up to 35% rural subsidy for women — excellent support for a new business.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pmmy",
    name: {
      ta: "பிரதமர் முத்ரா யோஜனா (PMMY)",
      hi: "प्रधानमंत्री मुद्रा योजना (PMMY)",
      en: "Pradhan Mantri MUDRA Yojana (PMMY)",
    },
    ministry: {
      ta: "நிதி அமைச்சகம் — MUDRA Ltd.",
      hi: "वित्त मंत्रालय — MUDRA Ltd.",
      en: "Ministry of Finance — MUDRA Ltd.",
    },
    category: ["business"],
    officialUrl: "https://www.mudra.org.in",
    officialPortalName: "mudra.org.in / udyamimitra.in",
    tagline: {
      ta: "சிறு தொழிலுக்கு வங்கிக் கடன் — ₹50,000 முதல் ₹10 லட்சம் வரை, பாதுகாப்பு தேவை இல்லை",
      hi: "छोटे व्यापार के लिए बैंक लोन — ₹50,000 से ₹10 लाख तक, बिना गिरवी",
      en: "A bank loan for a small business — ₹50,000 up to ₹10 lakh, no collateral",
    },
    gives: [
      {
        ta: "சிஷு (Shishu): ₹50,000 வரை — கடன் கட்டணம் இல்லை.",
        hi: "शिशु: ₹50,000 तक — कोई प्रोसेसिंग फ़ी नहीं।",
        en: "Shishu: up to ₹50,000 — no processing fee.",
      },
      {
        ta: "கிஷோர் (Kishore): ₹50,000 முதல் ₹5 லட்சம் வரை.",
        hi: "किशोर: ₹50,000 से ₹5 लाख तक।",
        en: "Kishore: ₹50,000 up to ₹5 lakh.",
      },
      {
        ta: "தருண் (Tarun): ₹5 லட்சம் முதல் ₹10 லட்சம் வரை.",
        hi: "तरुण: ₹5 लाख से ₹10 लाख तक।",
        en: "Tarun: ₹5 lakh up to ₹10 lakh.",
      },
      {
        ta: "₹10 லட்சம் வரை கடனுக்கு பாதுகாப்பு தேவை இல்லை.",
        hi: "₹10 लाख तक के लोन के लिए गिरवी ज़रूरी नहीं।",
        en: "No collateral for loans up to ₹10 lakh.",
      },
    ],
    eligibility: [
      { ta: "வயது 18+ இந்திய குடிமகன்.", hi: "आयु 18+ भारतीय नागरिक।", en: "Indian citizen aged 18+." },
      {
        ta: "வியாபாரம், உற்பத்தி அல்லது சேவைத் தொழில்.",
        hi: "व्यापार, निर्माण या सेवा कारोबार।",
        en: "A trading, manufacturing or service activity.",
      },
      {
        ta: "புதியதோ வளர்ந்துகொண்டிருக்கும் தொழிலோ இருக்கலாம்.",
        hi: "नया या बढ़ता हुआ व्यापार दोनों चल सकते हैं।",
        en: "A new or growing micro-enterprise.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "பான் அட்டை", hi: "पैन कार्ड", en: "PAN card" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      { ta: "முகவரி சான்று", hi: "पते का प्रमाण", en: "Address proof" },
      {
        ta: "உங்கள் தொழிலின் விவரம்",
        hi: "आपके काम का ब्यौरा",
        en: "Details of your business activity",
      },
      {
        ta: "Udyam பதிவு சான்று (சில வங்கிகள் கேட்கும்)",
        hi: "उद्यम रजिस्ट्रेशन प्रमाणपत्र (कुछ बैंक माँग सकते हैं)",
        en: "Udyam registration certificate (some banks ask)",
      },
    ],
    steps: [
      {
        text: {
          ta: "உங்கள் வங்கிக் கிளைக்குச் செல்லுங்கள், அல்லது udyamimitra.in இணையதளத்தைத் திறங்கள்.",
          hi: "अने बैंक शाखा जाएँ, या udyamimitra.in वेबसाइट खोलें।",
          en: "Visit your bank branch, or open udyamimitra.in.",
        },
      },
      {
        text: {
          ta: "முத்ரா கடன் விண்ணப்பம் கேட்கவும் அல்லது 'விண்ணப்பி' (Apply) என்பதை அழுத்துங்கள்.",
          hi: "मुद्रा लोन आवेदन माँगें या 'Apply' दबाएँ।",
          en: "Ask for a MUDRA loan application, or press 'Apply'.",
        },
      },
      {
        text: {
          ta: "ஆதார், பான், வங்கிக் கணக்கு விவரங்களைக் கொடுங்கள்.",
          hi: "आधार, पैन, बैंक खाते का ब्यौरा दें।",
          en: "Give your Aadhaar, PAN and bank account details.",
        },
      },
      {
        text: {
          ta: "உங்கள் தொழில் எதற்கு என்பதை எளிய மொழியில் சொல்லுங்கள்.",
          hi: "अपने काम के बारे में आसान भाषा में बताएँ।",
          en: "Explain in simple words what your business is for.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "விண்ணப்ப நிலையை வங்கியிடம் கேட்டு அறியலாம்.",
          hi: "आवेदन की स्थिति बैंक से पूछकर जानें।",
          en: "Ask the bank about the status of your application.",
        },
      },
    ],
    caution: {
      ta: "⚠️ முத்ராவுக்கு எந்த முகவர்களும் இல்லை. கடன் வாங்கித் தந்து வைப்பதாகச் சொல்லி பணம் வசூலிக்கும் நபர் ஏமாற்றுபவர்.",
      hi: "⚠️ मुद्रा के कोई एजेंट नहीं होते। लोन दिलवाकर पैसा लेने वाला ठग है।",
      en: "⚠️ MUDRA has no agents. Anyone who takes money to 'get you a loan' is a fraudster.",
    },
    verify: {
      ta: "வட்டி விகிதம் வங்கியைப் பொறுத்து மாறும் — வங்கியிடம் கேட்கவும்.",
      hi: "ब्याज दर बैंक के अनुसार बदलती है — बैंक से पूछें।",
      en: "Interest rates vary by lender — ask your bank.",
    },
    keywords: {
      ta: ["முத்ரா", "mudra", "pmmY".toLowerCase(), "கடன்", "வங்கிக் கடன்", "udyamimitra"],
      hi: ["मुद्रा", "मुद्रा योजना", "pmmY".toLowerCase(), "कर्ज़", "बैंक लोन", "ऋण"],
      en: ["mudra", "pmmY".toLowerCase(), "udyamimitra", "business loan", "collateral free loan"],
    },
    trades: ["tailoring", "artisan", "food", "shop", "beauty", "other"],
    needs: ["loan", "both", "unknown"],
    reason: {
      ta: "வங்கியிலேயே எளிதாகக் கடன் பெறக்கூடிய வழி.",
      hi: "बैंक में आसानी से कर्ज़ मिलने का रास्ता।",
      en: "The easiest way to get a bank loan for your business.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pmkvy",
    name: {
      ta: "பிரதமர் கௌசல் விகாஸ் யோஜனா (PMKVY 4.0)",
      hi: "प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)",
      en: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    },
    ministry: {
      ta: "திறனாளி வளர்ச்சி அமைச்சகம் (MSDE)",
      hi: "कौशल विकास और उद्यमिता मंत्रालय (MSDE)",
      en: "Ministry of Skill Development & Entrepreneurship",
    },
    category: ["skill", "business"],
    officialUrl: "https://www.skillindiadigital.gov.in",
    officialPortalName: "skillindiadigital.gov.in",
    tagline: {
      ta: "இலவச திறன் பயிற்சி + அரசு அங்கீகாரம் பெற்ற சான்றிதழ்",
      hi: "मुफ़्त कौशल प्रशिक्षण + सरकारी मान्यता प्रमाणपत्र",
      en: "Free skill training plus a government-recognised certificate",
    },
    gives: [
      {
        ta: "பயிற்சிக்கான கட்டணம் இல்லை — அரசு பயிற்று மையத்திற்குச் செலுத்தும்.",
        hi: "प्रशिक्षण की फ़ीस नहीं — सरकार केंद्र को देती है।",
        en: "No training fee — the government pays the training centre.",
      },
      {
        ta: "சில படிப்புகளில் பயிற்சி நேரத்திற்குப் பணம் கிடைக்கும்.",
        hi: "कुछ पाठ्यक्रमों में प्रशिक्षण के दौरान भुगतान मिलता है।",
        en: "Some courses pay you during the training period.",
      },
      {
        ta: "NSQF சான்றிதழ் — இந்தியா முழுவதும் ஏற்றுக்கொள்ளப்படும்.",
        hi: "NSQF प्रमाणपत्र — पूरे भारत में मान्य।",
        en: "An NSQF certificate recognised across India.",
      },
      {
        ta: "பயிற்சிக்குப் பிறகு வேலை வாய்ப்பு உதவி.",
        hi: "प्रशिक्षण के बाद नौकरी में मदद।",
        en: "Placement help after training.",
      },
    ],
    eligibility: [
      {
        ta: "பெரும்பாலான படிப்புகளுக்கு வயது 15–45.",
        hi: "ज़्यादातर पाठ्यक्रमों के लिए आयु 15–45।",
        en: "Age 15–45 for most courses.",
      },
      {
        ta: "இந்திய குடிமகன்; ஆதார் மற்றும் வங்கிக் கணக்கு உள்ளவர்.",
        hi: "भारतीय नागरिक; आधार और बैंक खाता हो।",
        en: "Indian citizen with Aadhaar and a bank account.",
      },
      {
        ta: "நிரந்தரமாகப் பள்ளி/கல்லூரி படிக்கும் மாணவர்கள் அல்லாதவர்.",
        hi: "पूरी स्कूल/कॉलेज पढ़ रहे छात्र नहीं।",
        en: "Not a full-time school or college student.",
      },
      {
        ta: "பெண்கள், கிராம இளைஞர்களுக்கு முதன்மை.",
        hi: "महिलाओं और ग्रामीण युवाओं को प्राथमिकता।",
        en: "Priority for women and rural youth.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      {
        ta: "அடையாள / முகவரி சான்று",
        hi: "पहचान / पते का प्रमाण",
        en: "Identity / address proof",
      },
      { ta: "புகைப்படம்", hi: "तस्वीर", en: "Photograph" },
    ],
    steps: [
      {
        text: {
          ta: "skillindiadigital.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "skillindiadigital.gov.in वेबसाइट खोलें।",
          en: "Open skillindiadigital.gov.in.",
        },
      },
      {
        text: {
          ta: "'படிப்பைத் தேடு' பகுதியில் உங்கள் மாவட்டம் மற்றும் வேலைத் துறையைத் தேர்ந்தெடுங்கள்.",
          hi: "'कोर्स खोजें' में अपना ज़िला और काम का क्षेत्र चुनें।",
          en: "In 'Find a course', choose your district and job sector.",
        },
      },
      {
        text: {
          ta: "தையல் பயிற்சி போன்ற விருப்பமான படிப்பைத் தேர்ந்தெடுத்து 'பதிவு' செய்யுங்கள்.",
          hi: "सिलाई जैसा कोर्स चुनें और 'एनरोल' करें।",
          en: "Pick a course such as tailoring and press 'Enrol'.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "அல்லது இணையம் இல்லாவிட்டால் அருகில் உள்ள பி.எம்.கே.வி.ஒய். பயிற்று மையத்திற்கு நேரடியாகச் சென்று சேரலாம்.",
          hi: "या इंटरनेट न हो तो नज़दीकी PMKVY प्रशिक्षण केंद्र सीधे जाएँ।",
          en: "Or, with no internet, simply walk into a nearby PMKVY training centre.",
        },
      },
    ],
    verify: {
      ta: "படிப்புப் பட்டியல் மற்றும் மையங்கள் skillindiadigital.gov.in இல் உள்ளன.",
      hi: "कोर्स सूची और केंद्र skillindiadigital.gov.in पर हैं।",
      en: "The course list and centres are on skillindiadigital.gov.in.",
    },
    keywords: {
      ta: ["பி.எம்.கே.வி.ஒய்", "pmkvy", "பயிற்சி", "திறன்", "கற்க", "skill india", "படிப்பு"],
      hi: ["पीएमकेवीवाई", "pmkvy", "प्रशिक्षण", "कौशल", "सीखना", "स्किल इंडिया"],
      en: ["pmkvy", "skill", "training", "course", "skill india", "learn", "apprentice"],
    },
    trades: ["tailoring", "artisan", "food", "beauty", "other"],
    needs: ["training", "both", "unknown"],
    reason: {
      ta: "தையல் பயிற்சி PMKVY-ல் உள்ளது. கட்டணம் இல்லாமல் கற்கலாம்.",
      hi: "सिलाई प्रशिक्षण PMKVY में है। बिना फ़ीस सीख सकती हैं।",
      en: "Tailoring training is available under PMKVY, with no fee.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "mahila-ehaat",
    name: {
      ta: "மகளிர் இ-ஹாட் (Mahila e-Haat)",
      hi: "महिला ई-हाट (Mahila e-Haat)",
      en: "Mahila e-Haat",
    },
    ministry: {
      ta: "மகளிர் மற்றும் குழந்தை வளர்ச்சி அமைச்சகம்",
      hi: "महिला एवं बाल विकास मंत्रालय",
      en: "Ministry of Women & Child Development",
    },
    category: ["business"],
    officialUrl: "https://mahilaehaat-rmk.gov.in",
    officialPortalName: "mahilaehaat-rmk.gov.in",
    tagline: {
      ta: "பெண்கள் தயாரித்த பொருட்களை ஆன்லைனில் விற்கும் அரசு தளம் — இலவசம்",
      hi: "महिलाओं के बनिए हुए सामान की सरकारी ऑनलाइन मार्केट — मुफ़्त",
      en: "A free government marketplace to sell products made by women",
    },
    gives: [
      {
        ta: "இலவசமாக உங்கள் பொருட்களை ஆன்லைனில் பட்டியலிடலாம்.",
        hi: "मुफ़्त में अपने सामान को ऑनलाइन लिस्ट करें।",
        en: "List your products online for free.",
      },
      {
        ta: "நடுவிடைதாரர் இல்லை — வாங்குநர் நேரடியாகத் தொடர்பு கொள்வார்.",
        hi: "कोई बिचौलिया नहीं — खरीदार सीधे संपर्क करेंगे।",
        en: "No middlemen — buyers contact you directly.",
      },
      {
        ta: "பெண்கள் சுய உதவிக் குழுக்களும் சேரலாம்.",
        hi: "महिला स्वयं सहायता समूह भी जुड़ सकते हैं।",
        en: "Women's self-help groups can also join.",
      },
    ],
    eligibility: [
      {
        ta: "வயது 18+ பெண் தொழில்முனைவோர்.",
        hi: "आयु 18+ महिला उद्यमी।",
        en: "Woman entrepreneur aged 18+.",
      },
      {
        ta: "கையால் தயாரிக்கப்பட்ட பொருட்கள்.",
        hi: "हाथ से बने उत्पाद।",
        en: "Handmade or locally produced products.",
      },
      {
        ta: "தொழில் பதிவு (Udyam / GST / SHG) இருந்தால் நல்லது.",
        hi: "व्यापार पंजीकरण (उद्यम / GST / SHG) हो तो अच्छा।",
        en: "A business registration (Udyam / GST / SHG) helps.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "பான் அட்டை", hi: "पैन कार्ड", en: "PAN card" },
      { ta: "தொழில் பதிவு (இருந்தால்)", hi: "व्यापार पंजीकरण (अगर है)", en: "Business registration (if any)" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      {
        ta: "பொருட்களின் புகைப்படங்கள்",
        hi: "उत्पादों की तस्वीरें",
        en: "Photos of your products",
      },
    ],
    steps: [
      {
        text: {
          ta: "mahilaehaat-rmk.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "mahilaehaat-rmk.gov.in वेबसाइट खोलें।",
          en: "Open mahilaehaat-rmk.gov.in.",
        },
      },
      {
        text: {
          ta: "'புதிய பயனர் பதிவு' → 'தனிநிபர் பெண் தொழில்முனைவோர்' என்பதைத் தேர்ந்தெடுங்கள்.",
          hi: "'न्यू यूजर रजिस्ट्रेशन' → 'इंडिविजुअल वुमन एंटरप्रेन्योर' चुनें।",
          en: "Choose 'New User Registration' → 'Individual Woman Entrepreneur'.",
        },
      },
      {
        text: {
          ta: "மொபைல் எண் + OTP-ஐ நுழைத்து உங்கள் விவரங்களை நிரப்புங்கள்.",
          hi: "मोबाइल नंबर + OTP डालकर विवरण भरें।",
          en: "Enter your mobile number + OTP, then fill your details.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "உங்கள் தையல் பொருட்களை புகைப்படத்துடன் பட்டியலிடுங்கள்.",
          hi: "अपने सिलाई के सामानों को तस्वीर के साथ लिस्ट करें।",
          en: "List your tailoring products with photos.",
        },
      },
    ],
    caution: {
      ta: "இது அரசின் அதிகாரப்பூர்வ தளம். இதில் பட்டியலிடுவதற்குக் கட்டணம் இல்லை.",
      hi: "यह सरकारी आधिकारिक मंच है। लिस्टिंग का कोई शुल्क नहीं।",
      en: "This is the official government platform. Listing on it is free.",
    },
    verify: {
      ta: "பதிவு முறையை mahilaehaat-rmk.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "रजिस्ट्रेशन तरीका mahilaehaat-rmk.gov.in पर पुष्टि करें।",
      en: "Confirm the registration process at mahilaehaat-rmk.gov.in.",
    },
    keywords: {
      ta: ["மகளிர் இ-ஹாட்", "mahila ehaat", "விற்க", "விற்பனை", "ஆன்லைன் கடை", "சந்தை"],
      hi: ["महिला ई-हाट", "mahila ehaat", "बेचना", "ऑनलाइन बिक्री", "बाज़ार"],
      en: ["mahila ehaat", "sell online", "marketplace", "ehaat", "sell my products"],
    },
    trades: ["tailoring", "artisan", "food", "beauty", "other"],
    needs: ["unknown", "both", "training"],
    reason: {
      ta: "நீங்கள் தயாரித்த துணிகளை விற்க இலவச அரசு தளம்.",
      hi: "बनिए हुए कपड़े बेचने के लिए मुफ़्त सरकारी मंच।",
      en: "A free government platform to sell what you make.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "day-nrlm",
    name: {
      ta: "தீன்தயா அந்தியோதய யோஜனா — தேசிய ஊர் வாழ்வாதார அமைப்பு (DAY-NRLM / ஆஜீவிகா)",
      hi: "दीनदय अंत्योदय योजना — राष्ट्रीय ग्रामीण आजीविका मिशन (DAY-NRLM / आजीविका)",
      en: "Deendayal Antyodaya Yojana — National Rural Livelihood Mission (DAY-NRLM / Ajeevika)",
    },
    ministry: {
      ta: "கிராம வளர்ச்சி அமைச்சகம்",
      hi: "ग्रामीण विकास मंत्रालय",
      en: "Ministry of Rural Development",
    },
    category: ["business", "services", "skill"],
    officialUrl: "https://aajeevika.gov.in",
    officialPortalName: "aajeevika.gov.in",
    tagline: {
      ta: "பெண்கள் சுய உதவிக் குழுக்கள் (SHG) — குழு சேமிப்பு, கடன், தொழில் உதவி",
      hi: "महिला स्वयं सहायता समूह (SHG) — बचत, कर्ज़ और काम की मदद",
      en: "Women's self-help groups (SHG) — savings, credit and livelihood support",
    },
    gives: [
      {
        ta: "10–20 பேர் கொண்ட பெண்கள் குழுவை உருவாக்கலாம்.",
        hi: "10–20 महिलाओं का समूह बनाया जा सकता है।",
        en: "Form a women's group of 10–20 members.",
      },
      {
        ta: "குழுவுக்கு ₹15,000 சுழற்சி நிதி உதவி.",
        hi: "समूह को ₹15,000 चक्रियाँ निधि सहायता।",
        en: "A ₹15,000 revolving fund for the group.",
      },
      {
        ta: "₹3 லட்சம் வரை குழுக் கடன் (வட்டி மானுப்புடன்).",
        hi: "₹3 लाख तक समूह को कर्ज़ (ब्याज छूट के साथ)।",
        en: "Group loans up to ₹3 lakh with interest subvention.",
      },
      {
        ta: "இலவச பயிற்சி மற்றும் சந்தைப்படுத்தல் உதவி.",
        hi: "मुफ़्त प्रशिक्षण और बाज़ार से जोड़ने में मदद।",
        en: "Free training and market linkage support.",
      },
    ],
    eligibility: [
      {
        ta: "கிராமப்புறப் பெண்கள், வயது 18+.",
        hi: "ग्रामीण महिलाएँ, आयु 18+।",
        en: "Rural women aged 18+.",
      },
      {
        ta: "குழு 6 மாதம் செயல்பட வேண்டும் (சந்திப்பு, சேமிப்பு, கடன் தவணை).",
        hi: "समूह 6 महीने चले (बैठक, बचत, किस्त)।",
        en: "The group must run for 6 months (meetings, savings, repayments).",
      },
      {
        ta: "குழுவில் ஒரு வீட்டு நிலையத்தில் ஒருவர் மட்டும்.",
        hi: "एक घर से समूह में एक सदस्य।",
        en: "One member per household.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      {
        ta: "உறுப்பினர்களின் பட்டியல்",
        hi: "सदस्यों की सूची",
        en: "List of members",
      },
      {
        ta: "குழு சேமிப்புப் புத்தகம்",
        hi: "समूह बचत रजिस्टर",
        en: "Group savings register",
      },
    ],
    steps: [
      {
        text: {
          ta: "உங்கள் கிராம ப்லாக் மிஷன் அலுவலகம் (BMMU) அல்லது ஆஜீவிகா உதவியாளரைத் தொடர்பு கொள்ளுங்கள்.",
          hi: "अपने गाँव के ब्लॉक मिशन कार्यालय (BMMU) या आजीविका सहायक से संपर्क करें।",
          en: "Contact your village Block Mission Management Unit (BMMU) or an Ajeevika helper.",
        },
      },
      {
        text: {
          ta: "குழுவை உருவாக்கி, சந்திப்பும் சேமிப்பும் தொடங்குங்கள்.",
          hi: "समूह बनाकर बैठक और बचत शुरू करें।",
          en: "Form the group and start holding meetings and saving.",
        },
      },
      {
        text: {
          ta: "6 மாதம் குழு பழக்கப்பட்ட பிறகு வங்கிக் கடனுக்கு விண்ணப்பிக்கலாம்.",
          hi: "6 महीने बाद समूह बैंक कर्ज़ के लिए आवेदन कर सकता है।",
          en: "After 6 months the group can apply for a bank loan.",
        },
        expectsReport: true,
      },
    ],
    verify: {
      ta: "விவரங்களை aajeevika.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "विवरण aajeevika.gov.in पर पुष्टि करें।",
      en: "Confirm details at aajeevika.gov.in.",
    },
    keywords: {
      ta: ["சுய உதவிக் குழு", "shg", "ஆஜீவிகா", "aajeevika", "நேர்லம்", "nrlm", "குழு கடன்", "குழுவாக"],
      hi: ["स्वयं सहायता समूह", "shg", "आजीविका", "nrlm", "समूह कर्ज़", "महिला समूह"],
      en: ["shg", "self help group", "aajeevika", "nrlm", "group loan", "didhi", "lakhpati didi"],
    },
    trades: ["tailoring", "artisan", "food", "shop", "beauty", "other"],
    needs: ["loan", "training", "both", "unknown"],
    reason: {
      ta: "குழுவாகச் சேர்ந்து கடன் பெறுவது எளிது — வட்டி குறைவு.",
      hi: "समूह बनाकर कर्ज़ लेना आसान — ब्याज भी कम।",
      en: "Borrowing as a group is easier and cheaper.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pmfme",
    name: {
      ta: "பிரதமர் உணவுச் செயலாக்க சிறு தொழில் திட்டம் (PMFME)",
      hi: "प्रधानमंत्री Formalisation of Micro food processing Enterprises (PMFME)",
      en: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    },
    ministry: {
      ta: "உணவுச் செயலாக்கத் துறை அமைச்சகம்",
      hi: "खाद्य प्रसंस्करण उद्योग मंत्रालय",
      en: "Ministry of Food Processing Industries",
    },
    category: ["business", "skill"],
    officialUrl: "https://pmfme.gov.in",
    officialPortalName: "pmfme.gov.in",
    tagline: {
      ta: "வீட்டிலேயே உணவுச் செயலாக்கத் தொழில் தொடங்க 35% வரை அரசு மானியம்",
      hi: "घर से खाना बनने का छोटा कारोबार — 35% तक सरकारी सब्सिडी",
      en: "Start a food processing business from home — up to 35% government subsidy",
    },
    gives: [
      {
        ta: "திட்ட செலவில் 35% வரை அரசு மானியம் (ஒரு அலுகைக்கு அதிகபட்சம் ₹10 லட்சம்).",
        hi: "परियोजना लागत का 35% तक सब्सिडी (प्रति इकाई अधिकतम ₹10 लाख)।",
        en: "A subsidy of up to 35% of project cost (max ₹10 lakh per unit).",
      },
      {
        ta: "வங்கிக் கடன் உதவியுடன் வரும்.",
        hi: "बैंक लोन सहायता के साथ।",
        en: "Comes with bank credit support.",
      },
    ],
    eligibility: [
      { ta: "வயது 18+.", hi: "आयु 18+।", en: "Age 18+." },
      {
        ta: "உணவுச் செயலாக்க சிறு தொழில்.",
        hi: "खाना बनाने/पैकिंग का छोटा कारोबार।",
        en: "A micro food processing enterprise.",
      },
      {
        ta: "தனிநபர், சுய உதவிக் குழு அல்லது கூட்டுறவும் விண்ணப்பிக்கலாம்.",
        hi: "व्यक्ति, SHG या सहकारी समिति आवेदन कर सकती है।",
        en: "Individuals, SHGs and cooperatives can apply.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "பான் அட்டை", hi: "पैन कार्ड", en: "PAN card" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      { ta: "முகவரி சான்று", hi: "पते का प्रमाण", en: "Address proof" },
      { ta: "திட்ட அறிக்கை", hi: "परियोजना रिपोर्ट", en: "Project report" },
    ],
    steps: [
      {
        text: {
          ta: "pmfme.gov.in இணையதளத்தில் விண்ணப்பிக்கலாம்.",
          hi: "pmfme.gov.in वेबसाइट पर आवेदन करें।",
          en: "Apply on pmfme.gov.in.",
        },
      },
      {
        text: {
          ta: "இணையம் இல்லாவிட்டால் உங்கள் மாவட்டச் சேர்மேலாளர் அலுவலகத்தில் விண்ணப்பிக்கலாம்.",
          hi: "इंटरनेट न हो तो ज़िला कलेक्टर कार्यालय में आवेदन करें।",
          en: "With no internet, apply at your District Collector's office.",
        },
      },
      {
        text: {
          ta: "திட்ட அறிக்கையையும் ஆவணங்களையும் சமர்ப்பித்து, விண்ணப்ப எண்ணை எழுதுங்கள்.",
          hi: "परियोजना रिपोर्ट और कागज़ जमा करके आवेदन संख्या लिख लें।",
          en: "Submit the project report and documents, then note down the application number.",
        },
        expectsReport: true,
      },
    ],
    verify: {
      ta: "மானிய விவரங்களை pmfme.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "सब्सिडी विवरण pmfme.gov.in पर पुष्टि करें।",
      en: "Confirm subsidy details at pmfme.gov.in.",
    },
    keywords: {
      ta: ["உணவு", "சமையல்", "அப்பளம்", "பலகாரம்", "ஊறுகாய்", "pickle", "pmfme", "உணவுச் செயலாக்கம்"],
      hi: ["खाना", "अचार", "पपड़", "मिठाई", "pmfme", "खाद्य"],
      en: ["food business", "pickle", "papad", "sweet", "pmfme", "tiffin", "catering"],
    },
    trades: ["food"],
    needs: ["loan", "both", "training", "unknown"],
    reason: {
      ta: "வீட்டிலேயே உணவு தொழிலுக்கு 35% வரை மானியம்.",
      hi: "घर से खाना व्यापार के लिए 35% तक सब्सिडी।",
      en: "Up to 35% subsidy for a home food business.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pmsvanidhi",
    name: {
      ta: "பிரதமர் எஸ்.வி.என்.இதி திட்டம் (PM SVANidhi)",
      hi: "प्रधानमंत्री स्वनिधि योजना (PM SVANidhi)",
      en: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    },
    ministry: {
      ta: "குடியிருப்பு மற்றும் நகர்ப் பிரச்சினை அமைச்சகம்",
      hi: "आवास और शहरी मामले मंत्रालय",
      en: "Ministry of Housing & Urban Affairs",
    },
    category: ["business", "work"],
    officialUrl: "https://pmsvanidhi.mohua.gov.in",
    officialPortalName: "pmsvanidhi.mohua.gov.in",
    tagline: {
      ta: "தெரு வியாபாரிகளுக்கு ₹10,000 முதல் ₹50,000 வரை கடன்",
      hi: "स्ट्रीट वेंडर्स के लिए ₹10,000 से ₹50,000 तक का लोन",
      en: "Loans from ₹10,000 up to ₹50,000 for street vendors",
    },
    gives: [
      { ta: "முதல் கடன் ₹10,000.", hi: "पहला लोन ₹10,000।", en: "First loan ₹10,000." },
      {
        ta: "நன்றாகச் செலுத்தினால் ₹20,000, பிறகு ₹50,000 வரை.",
        hi: "समय पर चुकाने पर ₹20,000, फिर ₹50,000 तक।",
        en: "₹20,000 and then up to ₹50,000 if you repay on time.",
      },
      {
        ta: "வட்டி மானுப்பு உதவி உண்டு.",
        hi: "ब्याज में छूट मिलती है।",
        en: "Interest subvention is available.",
      },
    ],
    eligibility: [
      {
        ta: "தெரு வியாபாரி (கடை, விற்பனை, உணவு வியாபாரம்).",
        hi: "स्ट्रीट वेंडर (दुकान, बिक्री, खाना)।",
        en: "A street vendor (shop, selling, food).",
      },
      {
        ta: "1 மார்ச் 2020க்கு முன் தெரு வியாபாரியாக இருந்தவர்.",
        hi: "1 मार्च 2020 से पहले से वेंडर हो।",
        en: "You were a street vendor before 1 March 2020.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
      {
        ta: "தெரு வியாபாரம் சான்று அல்லது சுய அறிவிப்பு",
        hi: "वेंडिंग प्रमाण या स्व-घोषणा",
        en: "Vending certificate or self-declaration",
      },
      { ta: "புகைப்படம்", hi: "तस्वीर", en: "Photograph" },
    ],
    steps: [
      {
        text: {
          ta: "pmsvanidhi.mohua.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "pmsvanidhi.mohua.gov.in वेबसाइट खोलें।",
          en: "Open pmsvanidhi.mohua.gov.in.",
        },
      },
      {
        text: {
          ta: "'புதிய விண்ணப்பம்' என்பதை அழுத்தி ஆதார் + OTP-ஐ நுழையுங்கள்.",
          hi: "'न्यू अप्लिकेशन' दबाकर आधार + OTP डालें।",
          en: "Press 'New Application' and enter Aadhaar + OTP.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "வங்கி விவரத்தைக் கொடுத்து, மாவட்ட நகர்ப் பிரச்சினைக் குழுவிற்குச் சமர்ப்பிக்கவும்.",
          hi: "बैंक विवरण देकर ज़िला शहरी समिति को जमा करें।",
          en: "Give bank details and submit to the district urban committee.",
        },
      },
    ],
    verify: {
      ta: "விவரங்களை pmsvanidhi.mohua.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "विवरण pmsvanidhi.mohua.gov.in पर पुष्टि करें।",
      en: "Confirm details at pmsvanidhi.mohua.gov.in.",
    },
    keywords: {
      ta: ["எஸ்.வி.என்.இதி", "svanidhi", "தெரு வியாபாரி", "கடை"],
      hi: ["स्वनिधि", "svanidhi", "स्ट्रीट वेंडर", "ठेले वाला"],
      en: ["svanidhi", "street vendor", "rehri", "thela", "cart"],
    },
    trades: ["food", "shop", "other"],
    needs: ["loan", "both", "unknown"],
    reason: {
      ta: "தெரு வியாபாரிகளுக்கு சிறிய கடன் — வட்டி மானுப்புடன்.",
      hi: "स्ट्रीट वेंडर्स के लिए छोटा लोन — ब्याज छूट के साथ।",
      en: "A small loan for street vendors, with interest subvention.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "udyam",
    name: {
      ta: "உத்யாம் பதிவு (Udyam Registration)",
      hi: "उद्यम रजिस्ट्रेशन (Udyam)",
      en: "Udyam Registration",
    },
    ministry: {
      ta: "சிறு, நடுத்தர தொழில் அமைச்சகம்",
      hi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय",
      en: "Ministry of MSME",
    },
    category: ["services", "business"],
    officialUrl: "https://udyamregistration.gov.in",
    officialPortalName: "udyamregistration.gov.in",
    tagline: {
      ta: "சிறு தொழிலுக்கு இலவச அரசு பதிவுச் சான்றிதழ்",
      hi: "छोटे व्यापार के लिए मुफ़्त सरकारी पंजीकरण प्रमाणपत्र",
      en: "A free government registration certificate for a small business",
    },
    gives: [
      {
        ta: "பதிவுக்கு எந்தக் கட்டணமும் இல்லை.",
        hi: "पंजीकरण के लिए कोई शुल्क नहीं।",
        en: "No fee to register.",
      },
      {
        ta: "ஆன்லைனில் சில நிமிடங்களில் முடியும்.",
        hi: "ऑनलाइन कुछ मिनट में हो जाता है।",
        en: "Takes a few minutes online.",
      },
      {
        ta: "வங்கிக் கடன் மற்றும் பல திட்டங்களுக்குத் தேவை.",
        hi: "बैंक लोन और कई योजनाओं के लिए ज़रूरी।",
        en: "Needed for bank loans and many schemes.",
      },
    ],
    eligibility: [
      {
        ta: "உற்பத்தி, சேவை அல்லது வியாபாரத் தொழில்.",
        hi: "निर्माण, सेवा या व्यापार।",
        en: "A manufacturing, service or trading business.",
      },
      {
        ta: "ஆதார் + பான் எண் உள்ளவர்.",
        hi: "आधार + पैन नंबर हो।",
        en: "You have an Aadhaar and PAN.",
      },
      {
        ta: "GST இல்லாவிட்டாலும் பதிவு செய்யலாம்.",
        hi: "GST न हो तब भी पंजीकरण हो सकता है।",
        en: "You can register even without GST.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "பான் அட்டை", hi: "पैन कार्ड", en: "PAN card" },
      {
        ta: "தொழில் முகவரி விவரம்",
        hi: "व्यापार का पता",
        en: "Business address details",
      },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
    ],
    steps: [
      {
        text: {
          ta: "udyamregistration.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "udyamregistration.gov.in वेबसाइट खोलें।",
          en: "Open udyamregistration.gov.in.",
        },
      },
      {
        text: {
          ta: "ஆதார் எண்ணையும் OTP-ஐயும் நுழைத்து, தொழில் விவரத்தை நிரப்புங்கள்.",
          hi: "आधार और OTP डालकर व्यापार का ब्यौरा भरें।",
          en: "Enter Aadhaar + OTP and fill in your business details.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "Udyam சான்றிதழை பதிவிறக்கி எழுதுங்கள் — இது உங்கள் தொழிலின் அதிகாரப்பூர்வ அடையாளம்.",
          hi: "उद्यम प्रमाणपत्र डाउनलोड करके रखें — यह आपके काम की सरकारी पहचान है।",
          en: "Download and keep the Udyam certificate — it is the official ID of your business.",
        },
      },
    ],
    verify: {
      ta: "பதிவு முறையை udyamregistration.gov.in இல் உறுதிப்படுத்துங்கள்.",
      hi: "पंजीकरण तरीका udyamregistration.gov.in पर पुष्टि करें।",
      en: "Confirm the process at udyamregistration.gov.in.",
    },
    keywords: {
      ta: ["உத்யாம்", "udyam", "தொழில் பதிவு", "msme", "சிறு தொழில் பதிவு"],
      hi: ["उद्यम", "udyam", "व्यापार पंजीकरण", "msme"],
      en: ["udyam", "msme registration", "udyog aadhaar", "register my business"],
    },
    trades: ["tailoring", "artisan", "food", "shop", "beauty", "other"],
    needs: ["unknown", "loan", "both", "training"],
    reason: {
      ta: "உங்கள் தொழிலுக்கு அதிகாரப்பூர்வ அடையாளம் கிடைக்கும்.",
      hi: "आपके काम की सरकारी पहचान मिलेगी।",
      en: "Gives your business an official identity.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "eshram",
    name: {
      ta: "இ-ச்ராம் பதிவு (e-Shram)",
      hi: "ई-श्रम रजिस्ट्रेशन (e-Shram)",
      en: "e-Shram Registration",
    },
    ministry: {
      ta: "தொழிலாளர் மற்றும் வேலைவாய்ப்பு அமைச்சகம்",
      hi: "श्रम और रोज़गार मंत्रालय",
      en: "Ministry of Labour & Employment",
    },
    category: ["services", "work"],
    officialUrl: "https://eshram.gov.in",
    officialPortalName: "eshram.gov.in",
    tagline: {
      ta: "சட்டப்படி அங்கீகரிக்கப்படாத தொழிலாளர்களுக்கு அரசு தன்னறு அடையாள எண் (UAN) — இலவசம்",
      hi: "असंगठित मजदूरों के लिए सरकारी UAN नंबर — मुफ़्त",
      en: "A free government universal account number (UAN) for unorganised workers",
    },
    gives: [
      {
        ta: "அரசு அடையாள அட்டை (UAN எண்).",
        hi: "सरकारी पहचान (UAN नंबर)।",
        en: "A government identity number (UAN).",
      },
      {
        ta: "மற்ற திட்டங்களுக்குப் பயன்படும்.",
        hi: "अन्य योजनाओं में काम आएगा।",
        en: "Useful for other welfare schemes.",
      },
      {
        ta: "பதிவு இலவசம்.",
        hi: "पंजीकरण मुफ़्त है।",
        en: "Registration is free.",
      },
    ],
    eligibility: [
      {
        ta: "வயது 16–59 தொழிலாளர்.",
        hi: "आयु 16–59 मजदूर।",
        en: "A worker aged 16–59.",
      },
      {
        ta: "சட்டப்படி அங்கீகரிக்கப்படாத தொழில்.",
        hi: "असंगठित क्षेत्र में काम।",
        en: "Working in the unorganised sector.",
      },
      {
        ta: "ஆதார் + வங்கிக் கணக்கு.",
        hi: "आधार + बैंक खाता।",
        en: "Aadhaar and a bank account.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "மொபைல் எண்", hi: "मोबाइल नंबर", en: "Mobile number" },
      { ta: "வங்கிக் கணக்கு விவரம்", hi: "बैंक खाता विवरण", en: "Bank account details" },
    ],
    steps: [
      {
        text: {
          ta: "eshram.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "eshram.gov.in वेबसाइट खोलें।",
          en: "Open eshram.gov.in.",
        },
      },
      {
        text: {
          ta: "ஆதார் எண்ணையும் OTP-ஐயும் நுழைத்து உங்கள் தொழில் விவரத்தை நிரப்புங்கள்.",
          hi: "आधार और OTP डालकर अपने काम का ब्यौरा भरें।",
          en: "Enter Aadhaar + OTP and fill in your work details.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "UAN எண்ணை எழுதுங்கள் — இது உங்கள் வேலைக்கான அரசு அடையாளம்.",
          hi: "UAN नंबर लिख लें — यह आपके काम की सरकारी पहचान है।",
          en: "Write down the UAN number — it is the official ID of your work.",
        },
      },
    ],
    verify: {
      ta: "பதிவை eshram.gov.in இல் செய்யுங்கள்.",
      hi: "पंजीकरण eshram.gov.in पर करें।",
      en: "Register at eshram.gov.in.",
    },
    keywords: {
      ta: ["இ-ச்ராம்", "eshram", "தொழிலாளர் அட்டை", "uan"],
      hi: ["ई-श्रम", "eshram", "मजदूर कार्ड", "uan"],
      en: ["eshram", "e-shram", "labour card", "uan number", "worker card"],
    },
    trades: ["tailoring", "artisan", "food", "shop", "beauty", "other"],
    needs: ["unknown", "training", "loan", "both"],
    reason: {
      ta: "உங்கள் வேலைக்கு அரசு அடையாளம் கிடைக்கும்.",
      hi: "आपके काम की सरकारी पहचान मिलेगी।",
      en: "Your work gets an official government identity.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "mgnrega",
    name: {
      ta: "மகாத்மா காந்தி தேசிய கிராம ஒப்படைக்கும் உத்திரவாதத் திட்டம் (MGNREGA)",
      hi: "महात्मा गांधी राष्ट्रीय ग्रामीण रोज़गार गारंटी योजना (MGNREGA)",
      en: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
    },
    ministry: {
      ta: "கிராம வளர்ச்சி அமைச்சகம்",
      hi: "ग्रामीण विकास मंत्रालय",
      en: "Ministry of Rural Development",
    },
    category: ["work"],
    officialUrl: "https://nrega.nic.in",
    officialPortalName: "nrega.nic.in",
    tagline: {
      ta: "கிராமப்புறங்களில் ஆண்டுக்கு 100 நாட்கள் உத்திரவாத வேலை",
      hi: "गाँव में साल में 100 दिन का गारंटीशुदा काम",
      en: "100 days of guaranteed work per year in rural areas",
    },
    gives: [
      {
        ta: "ஒரு குடும்பத்திற்கு ஆண்டுக்கு 100 நாள் வேலை உத்திரவாதம்.",
        hi: "एक परिवार को साल में 100 दिन काम की गारंटी।",
        en: "100 days of guaranteed work per household per year.",
      },
      {
        ta: "வேலை கிடைக்காவிட்டால் பாதுகாப்பு தொகை கிடைக்கும்.",
        hi: "काम न मिले तो बेरोज़गारी भत्ता मिलता है।",
        en: "Unemployment allowance if work is not given.",
      },
      {
        ta: "நேரத்திற்குச் சம்பளம்.",
        hi: "दिन के हिसाब से मज़दूरी।",
        en: "Daily wages.",
      },
    ],
    eligibility: [
      {
        ta: "வயது 18+ கிராம இளைஞர்.",
        hi: "आयु 18+ ग्रामीण व्यक्ति।",
        en: "A rural adult aged 18+.",
      },
      {
        ta: "வேலை தேடும் வயது வந்தவர்.",
        hi: "काम चाहने वाला व्यक्ति।",
        en: "Someone willing to do manual work.",
      },
      {
        ta: "குடும்பத்தில் ஒருவர் மட்டும் வேலைக்குரியவர் அட்டை.",
        hi: "एक परिवार में एक जॉब कार्ड।",
        en: "One job card per household.",
      },
    ],
    documents: [
      { ta: "வயது / முகவரி சான்று", hi: "आयु / पते का प्रमाण", en: "Age / address proof" },
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      { ta: "புகைப்படம்", hi: "तस्वीर", en: "Photograph" },
    ],
    steps: [
      {
        text: {
          ta: "உங்கள் கிராம பஞ்சாயத்தைத் தொடர்பு கொள்ளுங்கள்.",
          hi: "अपने गाँव की पंचायत से संपर्क करें।",
          en: "Contact your village panchayat.",
        },
      },
      {
        text: {
          ta: "வேலைக்குரியவர் அட்டை (Job Card) பெறுவதற்கு விண்ணப்பியுங்கள்.",
          hi: "जॉब कार्ड बनवाने के लिए आवेदन करें।",
          en: "Apply for a Job Card.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "வேலை கேட்டு விண்ணப்பியுங்கள் — நாட்களை எழுத்தில் குறித்து வையுங்கள்.",
          hi: "काम माँगकर आवेदन करें — दिनों की गिनती रखें।",
          en: "Demand work in writing and keep a record of the days.",
        },
      },
    ],
    verify: {
      ta: "விவரங்களை nrega.nic.in அல்லது உங்கள் பஞ்சாயத்தில் கேட்கவும்.",
      hi: "विवरण nrega.nic.in या पंचायत से पूछें।",
      en: "Check nrega.nic.in or ask your panchayat.",
    },
    keywords: {
      ta: ["மந்நிகா", "nrega", "mgnrega", "100 நாள் வேலை", "நாள் கூலி", "கிராம வேலை"],
      hi: ["मनरेगा", "nrega", "mgnrega", "100 दिन काम", "मजदूरी", "ग्राम काम"],
      en: ["nrega", "mgnrega", "job card", "100 days work", "daily wage", "rural employment"],
    },
    trades: ["other"],
    needs: ["unknown", "loan", "both", "training"],
    reason: {
      ta: "கிராமத்திலேயே உத்திரவாத வேலை.",
      hi: "गाँव में ही गारंटीशुदा काम।",
      en: "Guaranteed work in your own village.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "sukanya-samriddhi",
    name: {
      ta: "சுகன்யா சமிரிதி யோஜனா",
      hi: "सुकन्या समृद्धि योजना",
      en: "Sukanya Samriddhi Yojana",
    },
    ministry: {
      ta: "நிதி அமைச்சகம் — தேசிய சேமிப்பு நிறுவனம்",
      hi: "वित्त मंत्रालय — राष्ट्रीय बचत संस्थान",
      en: "Ministry of Finance — National Savings Institute",
    },
    category: ["education"],
    officialUrl: "https://www.nsiindia.gov.in",
    officialPortalName: "nsiindia.gov.in / post office / bank",
    tagline: {
      ta: "பெண் குழந்தைக்கான அரசு சேமிப்புத் திட்டம் — அதிக வட்டி, வரி விலக்கு",
      hi: "बेटी के लिए सरकारी बचत योजना — ज़्यादा ब्याज, टैक्स छूट",
      en: "A government savings scheme for a girl child — high interest, tax benefits",
    },
    gives: [
      {
        ta: "வழக்கமான வட்டியை விட அதிக வட்டி.",
        hi: "आम ब्याज से ज़्यादा ब्याज।",
        en: "Higher interest than ordinary savings.",
      },
      {
        ta: "கல்வி, திருமணத்திற்குப் பணம் சேமிக்கலாம்.",
        hi: "पढ़ाई और शादी के लिए पैसा बचाएँ।",
        en: "Save for education and marriage.",
      },
      {
        ta: "வரி விலக்கு உண்டு.",
        hi: "टैक्स में छूट है।",
        en: "Tax benefits apply.",
      },
    ],
    eligibility: [
      {
        ta: "10 வயதுக்கு உள்ள பெண் குழந்தை.",
        hi: "10 साल से कम उम्र की बेटी।",
        en: "A girl child below 10 years of age.",
      },
      {
        ta: "ஒரு குடும்பத்திற்கு அதிகபட்சம் 2 கணக்குகள்.",
        hi: "एक परिवार में अधिकतम 2 खाते।",
        en: "Maximum two accounts per family.",
      },
      {
        ta: "பெற்றோர் அல்லது பாதுகாவலர் கணக்கைத் திறக்க வேண்டும்.",
        hi: "माता-पिता या अभिभावक खाता खोलें।",
        en: "A parent or guardian opens the account.",
      },
    ],
    documents: [
      {
        ta: "குழந்தையின் பிறப்புச் சான்று அல்லது ஆதார்",
        hi: "बच्चे का जन्म प्रमाणपत्र या आधार",
        en: "Child's birth certificate or Aadhaar",
      },
      { ta: "பெற்றோரின் ஆதார்", hi: "माता-पिता का आधार", en: "Parent's Aadhaar" },
      { ta: "முகவரி சான்று", hi: "पते का प्रमाण", en: "Address proof" },
      { ta: "புகைப்படம்", hi: "तस्वीर", en: "Photograph" },
    ],
    steps: [
      {
        text: {
          ta: "உங்கள் அருகில் உள்ள தபால் அலுவலகம் அல்லது வங்கிக்குச் செல்லுங்கள்.",
          hi: "अपने नज़दीकी डाकघर या बैंक जाएँ।",
          en: "Go to your nearest post office or bank.",
        },
      },
      {
        text: {
          ta: "'சுகன்யா சமிரிதி கணக்கு' விண்ணப்பம் கேட்கவும்.",
          hi: "'सुकन्या समृद्धि खाता' आवेदन माँगें।",
          en: "Ask for a 'Sukanya Samriddhi account' application.",
        },
      },
      {
        text: {
          ta: "படிவத்தை நிரப்பி ஆவணங்களைக் கொடுங்கள். ஆண்டுக்கு குறைந்தபட்சம் ₹250 சேமிக்க வேண்டும்.",
          hi: "फ़ॉर्म भरकर कागज़ दें। हर साल कम से कम ₹250 जमा करने होंगे।",
          en: "Fill the form and give the documents. You must deposit at least ₹250 a year.",
        },
        expectsReport: true,
      },
    ],
    verify: {
      ta: "தற்போதைய வட்டி விகிதத்தைத் தபால் அலுவலகம் அல்லது வங்கியில் கேட்கவும்.",
      hi: "मौजूदा ब्याज दर डाकघर या बैंक से पूछें।",
      en: "Ask the post office or bank for the current interest rate.",
    },
    keywords: {
      ta: ["சுகன்யா", "sukanya", "பெண் குழந்தை சேமிப்பு", "மகள் சேமிப்பு", "குழந்தை கணக்கு"],
      hi: ["सुकन्या", "sukanya", "बेटी बचत", "बेटी खाता"],
      en: ["sukanya", "girl child savings", "daughter savings", "beti bachao"],
    },
    trades: ["other"],
    needs: ["unknown", "loan", "both", "training"],
    reason: {
      ta: "உங்கள் மகளின் எதிர்காலத்திற்காக அரசு சேமிப்புத் திட்டம்.",
      hi: "आपकी बेटी के भविष्य के लिए सरकारी बचत योजना।",
      en: "A government savings scheme for your daughter's future.",
    },
    lastVerified: "2026-10-01",
  },

  /* ------------------------------------------------------------------ */
  {
    id: "nsp",
    name: {
      ta: "தேசிய உதவித்தொகை இணையதளம் (NSP)",
      hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)",
      en: "National Scholarship Portal (NSP)",
    },
    ministry: {
      ta: "மத்திய மற்றும் மாநில அரசுகள்",
      hi: "केंद्र और राज्य सरकारें",
      en: "Central & State Governments",
    },
    category: ["education"],
    officialUrl: "https://scholarships.gov.in",
    officialPortalName: "scholarships.gov.in",
    tagline: {
      ta: "பள்ளி, கல்லூரி கல்வி உதவித்தொகைக்கான ஒரே அரசு இணையதளம்",
      hi: "पढ़ाई की छात्रवृत्ति के लिए एक सरकारी पोर्टल",
      en: "One government portal for school and college scholarships",
    },
    gives: [
      {
        ta: "பல மத்திய, மாநில உதவித்தொகைகள் ஒரே இடத்தில்.",
        hi: "कई केंद्र और राज्य की छात्रवृत्ति एक जगह।",
        en: "Many central and state scholarships in one place.",
      },
      {
        ta: "ஆன்லைனில் ஒரே படிவம்.",
        hi: "ऑनलाइन एक ही फ़ॉर्म।",
        en: "A single online form.",
      },
      {
        ta: "பணம் நேரடியாக வங்கிக் கணக்குக்கு.",
        hi: "पैसा सीधे बैंक खाते में।",
        en: "Money goes straight to your bank account.",
      },
    ],
    eligibility: [
      {
        ta: "குடும்ப வருமான வரம்பிற்குள் இருப்பவர்.",
        hi: "परिवार की आय सीमा के भीतर हो।",
        en: "Family income within the prescribed limit.",
      },
      {
        ta: "படிப்பில் இருக்கும் மாணவர்.",
        hi: "पढ़ाई कर रहे छात्र।",
        en: "A student currently studying.",
      },
      {
        ta: "வங்கிக் கணக்கு ஆதாருடன் இணைக்கப்பட்டிருக்க வேண்டும்.",
        hi: "बैंक खाता आधार से जुड़ा हो।",
        en: "Bank account must be linked to Aadhaar.",
      },
    ],
    documents: [
      { ta: "ஆதார் அட்டை", hi: "आधार कार्ड", en: "Aadhaar card" },
      {
        ta: "மாணவரின் வங்கிக் கணக்கு",
        hi: "छात्र का बैंक खाता",
        en: "Student's bank account",
      },
      { ta: "வருமானச் சான்று", hi: "आय प्रमाणपत्र", en: "Income certificate" },
      { ta: "மதிப்பெண் அட்டை", hi: "अंकपत्र", en: "Marksheet" },
      {
        ta: "கல்லூரி / பள்ளி அனுமோதன சான்று",
        hi: "कॉलेज / स्कूल की मंज़ूरी",
        en: "College / school verification",
      },
    ],
    steps: [
      {
        text: {
          ta: "scholarships.gov.in இணையதளத்தைத் திறங்கள்.",
          hi: "scholarships.gov.in वेबसाइट खोलें।",
          en: "Open scholarships.gov.in.",
        },
      },
      {
        text: {
          ta: "'புதிய பயனர் பதிவு' செய்து, உங்கள் மாநிலம் மற்றும் வகையைத் தேர்ந்தெடுங்கள்.",
          hi: "'न्यू यूजर रजिस्ट्रेशन' करें और राज्य व श्रेणी चुनें।",
          en: "Do 'New User Registration', then choose your state and category.",
        },
      },
      {
        text: {
          ta: "படிவத்தை நிரப்பி, ஆவணங்களை பதிவேற்றம் செய்யுங்கள்.",
          hi: "फ़ॉर्म भरें और कागज़ अपलोड करें।",
          en: "Fill the form and upload the documents.",
        },
        expectsReport: true,
      },
      {
        text: {
          ta: "பள்ளி அல்லது கல்லூரியில் அனுமோதனை பெற்று, விண்ணப்ப நிலையைச் சரிபார்க்கவும்.",
          hi: "स्कूल/कॉलेज से मंज़ूरी कराकर आवेदन स्थिति देखें।",
          en: "Get verification from your school/college, then track the application.",
        },
      },
    ],
    verify: {
      ta: "உங்கள் மாநிலத்தின் உதவித்தொகைகளை scholarships.gov.in இல் பாருங்கள்.",
      hi: "अपने राज्य की छात्रवृत्ति scholarships.gov.in पर देखें।",
      en: "See your state's scholarships at scholarships.gov.in.",
    },
    keywords: {
      ta: ["உதவித்தொகை", "scholarship", "கல்வி உதவி", "படிப்பு உதவி", "nsp"],
      hi: ["छात्रवृत्ति", "scholarship", "पढ़ाई मदद", "nsp"],
      en: ["scholarship", "nsp", "study help", "fee reimbursement"],
    },
    trades: ["other"],
    needs: ["unknown", "training", "loan", "both"],
    reason: {
      ta: "கல்வி உதவித்தொகைக்கு ஒரே இணையதளம்.",
      hi: "छात्रवृत्ति के लिए एक ही पोर्टल।",
      en: "One portal for all education scholarships.",
    },
    lastVerified: "2026-10-01",
  },
];

export function getScheme(id: string | null | undefined): Scheme | undefined {
  if (!id) return undefined;
  return SCHEMES.find((s) => s.id === id);
}

export function allKeywords(): string[] {
  const out: string[] = [];
  for (const s of SCHEMES) for (const k of Object.values(s.keywords)) out.push(...k);
  return out;
}
