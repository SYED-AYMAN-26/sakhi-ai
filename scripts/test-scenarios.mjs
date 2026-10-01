/* Scenario tests: languages, direct mentions, categories, honesty, completion. */
const BASE = "http://localhost:3000/api/sakhi";

async function say(lang, state, text) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang, text, state }),
  });
  return res.json();
}

function line(label, d) {
  console.log(`\n👤 [${label}] ${d.say.split("\n")[0].slice(0, 110)}`);
  console.log(`   stage=${d.state.stage} intent=${d.state.intent} slots=${JSON.stringify(d.state.slots)}`);
  if (d.results) console.log(`   results=${d.results.map((r) => r.id).join(", ")}`);
  if (d.card) console.log(`   card=${d.card.id}`);
  if (d.guide) console.log(`   guide=${d.guide.index + 1}/${d.guide.total}`);
}

(async () => {
  console.log("=========== 1. DONE STAGE ===========");
  let s = null;
  let r = await say("ta", s, "தையல் தொழில்");
  r = await say("ta", r.state, "🧵 தையல்");
  r = await say("ta", r.state, "💰 பண உதவி / கடன்");
  r = await say("ta", r.state, "ஆம்");
  r = await say("ta", r.state, "இல்லை");
  r = await say("ta", r.state, "scheme:pm-vishwakarma");
  r = await say("ta", r.state, "action:steps");
  for (let i = 0; i < 7; i++) {
    r = await say("ta", r.state, "action:next");
    if (r.state.stage === "done") break;
  }
  line("finish", r);

  console.log("\n=========== 2. HINDI JOURNEY ===========");
  r = await say("hi", null, "मुझे घर से सिलाई का काम शुरू करना है, सरकारी मदद है?");
  line("hindi-1", r);
  r = await say("hi", r.state, "सिलाई");
  line("hindi-2", r);
  r = await say("hi", r.state, "कर्ज़");
  line("hindi-3", r);
  r = await say("hi", r.state, "हाँ");
  line("hindi-4", r);
  r = await say("hi", r.state, "नहीं");
  line("hindi-5", r);

  console.log("\n=========== 3. ENGLISH JOURNEY ===========");
  r = await say("en", null, "I want to earn money from home by stitching clothes");
  line("en-1", r);
  r = await say("en", r.state, "tailoring");
  line("en-2", r);
  r = await say("en", r.state, "loan");
  line("en-3", r);
  r = await say("en", r.state, "yes");
  line("en-4", r);
  r = await say("en", r.state, "no");
  line("en-5", r);

  console.log("\n=========== 4. DIRECT SCHEME MENTION ===========");
  r = await say("ta", null, "எனக்கு முத்ரா கடன் வேண்டும்");
  line("mudra-direct", r);
  r = await say("hi", null, "PMKVY में सिलाई सीखनी है");
  line("pmkvy-direct", r);

  console.log("\n=========== 5. CATEGORY TILES ===========");
  for (const c of ["cat:work", "cat:education", "cat:skill", "cat:services", "cat:other"]) {
    r = await say("ta", null, c);
    line(c, r);
  }

  console.log("\n=========== 6. HONESTY / UNVERIFIABLE ===========");
  r = await say("ta", null, "எனக்கு ஒரு புதையல் இயந்திரம் இலவசமாகக் கிடைக்குமா");
  line("unverifiable", r);
  r = await say("ta", null, "வணக்கம்");
  line("greeting", r);
  r = await say("ta", null, "OTTO என்னிடம் ஒன்று இல்லை");
  line("otp-mention", r);

  console.log("\n=========== 7. FOOD + SHOP + ARTISAN ===========");
  for (const [label, txt] of [
    ["food", "வீட்டில் அப்பளம் செய்து விற்க வேண்டும்"],
    ["shop", "தெரு வியாபாரம் செய்கிறேன், கடன் வேண்டும்"],
    ["artisan", "நான் கூழை செய்கிறேன், பயிற்சி வேண்டும்"],
  ]) {
    r = await say("ta", null, txt);
    line(`${label}-q1`, r);
    r = await say("ta", r.state, "other");
    line(`${label}-q2`, r);
    r = await say("ta", r.state, "ஆம்");
    line(`${label}-q3`, r);
    r = await say("ta", r.state, "இல்லை");
    line(`${label}-q4`, r);
  }
})();
