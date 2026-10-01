/**
 * Sakhi AI — Gemini integration (optional)
 * ---------------------------------------------------------------------------
 * Sakhi works fully WITHOUT a key: the deterministic engine in lib/engine.ts
 * handles the entire demo journey. Gemini is layered on top for two things:
 *
 *  1. geminiUnderstand() — when keyword matching is unsure, Gemini classifies
 *     free, messy, dialect-heavy speech (Tamil/Hindi/English) into intent.
 *  2. geminiSimplify()  — re-words VERIFIED facts from our own database into
 *     even simpler sentences. Gemini is never allowed to invent facts: it only
 *     receives facts we already verified.
 *
 * Set GEMINI_API_KEY in .env.local to switch this on.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Category, Lang } from "./i18n";
import type { Hint } from "./engine";
import type { Need, Trade } from "./schemes";

type WorkKind = NonNullable<Hint["workKind"]>;

const CATEGORIES: Category[] = ["work", "business", "education", "skill", "services", "other"];
const TRADES: Trade[] = ["tailoring", "artisan", "food", "shop", "beauty", "other"];
const NEEDS: Need[] = ["loan", "training", "both", "unknown"];
const WORK_KINDS: WorkKind[] = ["wage", "job", "home"];

const apiKey = process.env.GEMINI_API_KEY || "";
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export const geminiEnabled = (): boolean => Boolean(apiKey);

let clientInstance: GoogleGenerativeAI | null = null;
function client(): GoogleGenerativeAI {
  if (!clientInstance) clientInstance = new GoogleGenerativeAI(apiKey);
  return clientInstance;
}

const LANG_NAME: Record<Lang, string> = {
  ta: "Tamil (தமிழ்)",
  hi: "Hindi (हिन्दी)",
  en: "English",
};

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("gemini timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

function firstDefined<T extends string>(value: unknown, allowed: T[]): T | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return (allowed as string[]).includes(v) ? (v as T) : null;
}

/* ------------------------------------------------------------------ */
/* 1. Intent understanding                                             */
/* ------------------------------------------------------------------ */

export async function geminiUnderstand(text: string, lang: Lang): Promise<Hint | null> {
  if (!apiKey || !text || text.trim().length < 2) return null;
  try {
    const model = client().getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
    });

    const prompt = `You are the language-understanding layer of "Sakhi", a voice assistant for
rural Indian women with very low digital literacy and little or no English.

The user speaks ${LANG_NAME[lang]}. She may use village dialect words, mixed
language, half-finished sentences, or speak as if to a friend.

Your ONLY job is to classify what she wants. Never invent a government scheme,
benefit, amount or fact. If you are unsure, use null.

Return ONLY JSON in this shape:
{
  "category": ${JSON.stringify(CATEGORIES)},
  "trade": ${JSON.stringify(TRADES)},
  "need": ${JSON.stringify(NEEDS)},
  "workKind": ${JSON.stringify(WORK_KINDS)},
  "confidence": 0.0
}

Meanings:
- work      = she wants a job or daily-wage labour
- business  = she wants to start or grow a small business / earn money
- education = school, college, scholarship, or savings for a child
- skill     = she wants free training in a trade
- services  = she wants a government card, registration or certificate
- other     = anything else

trade: tailoring / artisan / food / shop / beauty / other (null if unknown)
need: loan (money), training, both, unknown (null if unknown)
workKind: wage (daily labour), job (steady job), home (earn from home)

User message (${LANG_NAME[lang]}):
"""${text}"""`;

    const res = await withTimeout(model.generateContent(prompt), 8000);
    const data = JSON.parse(res.response.text() || "{}");

    return {
      category: firstDefined(data.category, CATEGORIES),
      trade: firstDefined(data.trade, TRADES),
      need: firstDefined(data.need, NEEDS),
      workKind: firstDefined(data.workKind, WORK_KINDS),
    };
  } catch (err) {
    console.error("[sakhi][gemini] understand failed:", (err as Error)?.message ?? err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* 2. Simpler explanations of already-verified facts                   */
/* ------------------------------------------------------------------ */

export async function geminiSimplify(bullets: string[], lang: Lang): Promise<string | null> {
  if (!apiKey || !bullets.length) return null;
  try {
    const model = client().getGenerativeModel({
      model: modelName,
      generationConfig: { temperature: 0.3 },
    });

    const prompt = `You are Sakhi, explaining a government scheme to a rural woman with very
low literacy in ${LANG_NAME[lang]}.

Rewrite the VERIFIED facts below into at most 3 short, very simple sentences
in ${LANG_NAME[lang]} only. Use everyday village words, short sentences, no
English jargon. Reading level: class 5.

STRICT RULES:
- Do NOT add any new fact, number, date, name, promise or scheme.
- Do NOT say she is definitely eligible.
- If a fact is unclear, leave it out.
- If the facts are not in ${LANG_NAME[lang]}, translate them faithfully.

VERIFIED FACTS:
${bullets.map((b) => `- ${b}`).join("\n")}`;

    const res = await withTimeout(model.generateContent(prompt), 8000);
    const out = (res.response.text() || "").trim();
    return out.length ? out.slice(0, 600) : null;
  } catch (err) {
    console.error("[sakhi][gemini] simplify failed:", (err as Error)?.message ?? err);
    return null;
  }
}
