/* Headless UI check: renders the app, walks the demo journey, screenshots it. */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "/tmp/shots";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  const shot = async (name) => page.screenshot({ path: `${OUT}/${name}.png` });
  const tap = async (text) => {
    await page.locator(".chip, .cat, .result", { hasText: text }).first().click();
    await page.waitForTimeout(700);
  };

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await shot("1-home");

  // She speaks (typed here; the browser mic uses the exact same engine path)
  await page.fill('input[type="text"]', "எனக்கு வீட்டிலிருந்து தையல் தொழில் தொடங்க வேண்டும். அரசு உதவி கிடைக்குமா?");
  await page.click(".send-btn");
  await page.waitForTimeout(1200);
  await shot("2-first-question");

  await tap("🧵 தையல்");
  await shot("3-need");
  await tap("💰 பண உதவி / கடன்");
  await shot("4-age");
  await tap("ஆம்");
  await shot("5-prior-loan");
  await tap("இல்லை");
  await page.waitForTimeout(1000);
  await shot("6-results");

  await tap("பிரதமர் விஷ்வகர்மா திட்டம்");
  await page.waitForTimeout(1000);
  await shot("7-scheme-card");

  await tap("📋 வழிமுறை படிகள்");
  await page.waitForTimeout(1000);
  await shot("8-step-guide");

  await tap("அடுத்தது");
  await tap("அடுத்தது");
  await shot("9-step-3-otp-warning");

  await tap("அடுத்தது");
  await tap("அடுத்தது");
  await tap("அடுத்தது");
  await tap("அடுத்தது");
  await page.waitForTimeout(900);
  await shot("10-done");

  // Language switch resets to the home screen in Hindi
  await page.click(".lang-pill >> nth=1");
  await page.waitForTimeout(800);
  await shot("11-hindi-home");

  console.log("page errors:", errors.length ? errors : "none");
  await browser.close();
})();
