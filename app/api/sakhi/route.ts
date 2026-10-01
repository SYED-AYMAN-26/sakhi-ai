import { NextResponse } from "next/server";
import { newState, turn, type ConvState, type EngineReply } from "@/lib/engine";
import { geminiEnabled, geminiUnderstand, geminiSimplify } from "@/lib/gemini";
import { getScheme } from "@/lib/schemes";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGS: Lang[] = ["ta", "hi", "en"];

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const lang: Lang = LANGS.includes(body?.lang) ? body.lang : "ta";
  const text: string = typeof body?.text === "string" ? body.text : "";
  const incoming = (body?.state ?? {}) as Partial<ConvState>;

  // Stateless: the client always sends back the state it last received.
  let state: ConvState = {
    ...newState(lang),
    ...incoming,
    lang,
    slots: incoming.slots ?? {},
    skipped: incoming.skipped ?? [],
  };

  let reply: EngineReply = turn(state, text);
  state = reply.state;

  /* ---- Gemini layer 1: understand messy free text ------------------- */
  // Only when the deterministic engine could not classify anything.
  if (reply.state.stage === "unknown" && geminiEnabled() && text.trim().length > 1) {
    const hint = await geminiUnderstand(text, lang);
    if (hint && (hint.category || hint.trade || hint.need || hint.workKind)) {
      const retry = turn(state, text, hint);
      if (retry.state.stage !== "unknown") {
        reply = retry;
        state = retry.state;
      }
    }
  }

  /* ---- Gemini layer 2: "explain again, more simply" ----------------- */
  if (
    geminiEnabled() &&
    reply.state.stage === "scheme" &&
    reply.state.activeScheme &&
    (text === "action:explain" || text === "action:steps")
  ) {
    const scheme = getScheme(reply.state.activeScheme);
    if (scheme) {
      const bullets = [...scheme.gives.map((g) => g[lang]), ...scheme.eligibility.map((g) => g[lang])];
      const simple = await geminiSimplify(bullets, lang);
      if (simple) {
        reply = {
          ...reply,
          say: `${reply.say}\n\n💡 ${simple}`,
        };
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ...reply,
    ai: { gemini: geminiEnabled(), model: geminiEnabled() ? (process.env.GEMINI_MODEL || "gemini-1.5-flash") : null },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "Sakhi AI",
    gemini: geminiEnabled(),
    model: geminiEnabled() ? (process.env.GEMINI_MODEL || "gemini-1.5-flash") : null,
  });
}
