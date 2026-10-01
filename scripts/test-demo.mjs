/* End-to-end demo-journey test for the Sakhi AI engine (no browser needed). */
const BASE = "http://localhost:3000/api/sakhi";

async function say(state, text) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang: "ta", text, state }),
  });
  const data = await res.json();
  return data;
}

function show(label, data) {
  console.log("\n==================================================");
  console.log(`👤 ${label}`);
  console.log("--------------------------------------------------");
  console.log(`🤖 ${data.say}`);
  if (data.options?.length) {
    console.log(`   [chips] ${data.options.map((o) => o.label).join(" | ")}`);
  }
  if (data.results?.length) {
    console.log(`   [results] ${data.results.map((r) => r.name).join(" | ")}`);
  }
  if (data.card) console.log(`   [card] ${data.card.name} — docs: ${data.card.documents.join(", ")}`);
  if (data.guide) console.log(`   [guide] step ${data.guide.index + 1}/${data.guide.total}: ${data.guide.text}`);
  if (data.notes?.length) console.log(`   [notes] ${data.notes.join(" || ")}`);
  console.log(`   [stage] ${data.state.stage}`);
}

(async () => {
  let state = null;

  const turn1 = await say(state, "எனக்கு வீட்டிலிருந்து தையல் தொழில் தொடங்க வேண்டும். அரசு உதவி கிடைக்குமா?");
  show("எனக்கு வீட்டிலிருந்து தையல் தொழில் தொடங்க வேண்டும். அரசு உதவி கிடைக்குமா?", turn1);
  state = turn1.state;

  const turn2 = await say(state, "🧵 தையல்");
  show("🧵 தையல்", turn2);
  state = turn2.state;

  const turn3 = await say(state, "💰 பண உதவி / கடன்");
  show("💰 பண உதவி / கடன்", turn3);
  state = turn3.state;

  const turn4 = await say(state, "ஆம்");
  show("ஆம் (வயது 18+)", turn4);
  state = turn4.state;

  const turn5 = await say(state, "இல்லை");
  show("இல்லை (முன் கடன் இல்லை)", turn5);
  state = turn5.state;

  const turn6 = await say(state, "scheme:pm-vishwakarma");
  show("scheme:pm-vishwakarma", turn6);
  state = turn6.state;

  const turn7 = await say(state, "action:steps");
  show("action:steps", turn7);
  state = turn7.state;

  for (let i = 0; i < 8; i++) {
    const r = await say(state, i === 1 || i === 4 ? "திரையில் OTP வந்திருக்கிறது" : "action:next");
    show(i === 1 || i === 4 ? "திரையில் OTP வந்திருக்கிறது" : "action:next", r);
    state = r.state;
    if (r.state.stage === "done") break;
  }

  // Safety / honesty checks
  const unknown = await say(state, "நான் ஒரு ராக்கெட்டை வேண்டும்");
  show("நான் ஒரு ராக்கெட்டை வேண்டும் (unverifiable)", unknown);

  const restart = await say(unknown.state, "action:restart");
  show("restart", restart);
})();
