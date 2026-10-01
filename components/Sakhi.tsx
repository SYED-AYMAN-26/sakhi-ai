"use client";

/**
 * Sakhi AI — main interface
 * ---------------------------------------------------------------------------
 * A voice-first, mobile-first screen for a first-time internet user:
 *  - Tamil / Hindi / English (auto-answered in the same language)
 *  - big microphone button + typing as an alternative
 *  - one simple question at a time (never a form)
 *  - verified scheme cards, document checklists, step-by-step guide
 *  - permanent safety strip, and Sakhi NEVER asks for OTP / PIN / password
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, LANGS, t, type Lang } from "@/lib/i18n";
import {
  newState,
  type CardPayload,
  type ConvState,
  type GuidePayload,
  type Option,
} from "@/lib/engine";

interface Msg {
  id: number;
  from: "sakhi" | "user";
  text: string;
}

interface ResultItem {
  id: string;
  name: string;
  reason: string;
  tagline: string;
}

const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;

export default function Sakhi() {
  const [lang, setLang] = useState<Lang>("ta");
  const [state, setState] = useState<ConvState>(() => newState("ta"));
  const [messages, setMessages] = useState<Msg[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [card, setCard] = useState<CardPayload | null>(null);
  const [guide, setGuide] = useState<GuidePayload | null>(null);
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [notes, setNotes] = useState<string[]>([]);

  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<"gemini" | "local">("local");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const mainRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const idRef = useRef(1);
  // Always call the freshest send() from inside the speech callback.
  const sendRef = useRef<(t: string) => Promise<void>>(async () => {});

  const speechLang = useMemo(
    () => LANGS.find((l) => l.id === lang)?.speech ?? "ta-IN",
    [lang],
  );

  /* ---------------- speech synthesis ---------------- */

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", load);
  }, []);

  const speak = useCallback(
    (raw: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      try {
        const clean = raw.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();
        if (!clean) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = speechLang;
        u.rate = 0.9;
        u.pitch = 1;
        const match = voices.find((v) =>
          (v.lang || "").toLowerCase().startsWith(speechLang.slice(0, 2)),
        );
        if (match) u.voice = match;
        window.speechSynthesis.speak(u);
      } catch {
        /* speaking is a bonus, never a blocker */
      }
    },
    [speechLang, voices],
  );

  /* ---------------- speech recognition ---------------- */

  const startListening = useCallback(() => {
    setError(null);
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError(t("voiceNotSupported", lang));
      return;
    }
    try {
      const rec = new SR();
      rec.lang = speechLang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => setListening(true);
      rec.onresult = (e: any) => {
        const said = e?.results?.[0]?.[0]?.transcript;
        if (said) void sendRef.current(said);
      };
      rec.onerror = (e: any) => {
        setListening(false);
        if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
          setError(t("micDenied", lang));
        }
      };
      rec.onend = () => setListening(false);
      recRef.current = rec;
      rec.start();
    } catch {
      setError(t("voiceNotSupported", lang));
    }
  }, [lang, speechLang]);

  const stopListening = useCallback(() => {
    try {
      recRef.current?.stop?.();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  /* ---------------- conversation ---------------- */

  const push = useCallback((from: Msg["from"], body: string) => {
    idRef.current += 1;
    setMessages((m) => [...m, { id: idRef.current, from, text: body }]);
  }, []);

  const applyReply = useCallback(
    (data: any) => {
      if (data?.state) setState(data.state as ConvState);
      if (typeof data?.say === "string" && data.say.trim()) push("sakhi", data.say);
      setOptions(Array.isArray(data?.options) ? data.options : []);
      setCard(data?.card ?? null);
      setGuide(data?.guide ?? null);
      setResults(Array.isArray(data?.results) ? data.results : null);
      setNotes(Array.isArray(data?.notes) ? data.notes : []);
      setAiMode(data?.ai?.gemini ? "gemini" : "local");
      if (voiceOn && typeof data?.say === "string") speak(data.say);
    },
    [push, speak, voiceOn],
  );

  const send = useCallback(
    async (raw: string, display?: string) => {
      const body = (raw || "").trim();
      if (!body || busy) return;
      // Show her the words/button she chose, never the internal command.
      push("user", (display || body).trim());
      setText("");
      setOptions([]);
      setBusy(true);
      try {
        const res = await fetch("/api/sakhi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang, text: body, state }),
        });
        const data = await res.json();
        applyReply(data);
      } catch {
        setError(
          lang === "ta"
            ? "இணைப்பு பிரச்சினை. மீண்டும் முயற்சிக்கவும்."
            : lang === "hi"
              ? "कनेक्शन में दिक्कत। दोबारा कोशिश करें।"
              : "Connection problem. Please try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [applyReply, busy, lang, push, state],
  );

  sendRef.current = send;

  // Keep the newest message in view.
  useEffect(() => {
    const el = mainRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, options, card, guide, busy]);

  const reset = useCallback(() => {
    setMessages([]);
    setState(newState(lang));
    setOptions([]);
    setCard(null);
    setGuide(null);
    setResults(null);
    setNotes([]);
    setError(null);
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* noop */
    }
  }, [lang]);

  const switchLang = (id: Lang) => {
    if (id === lang) return;
    setLang(id);
    setMessages([]);
    setState(newState(id));
    setOptions([]);
    setCard(null);
    setGuide(null);
    setResults(null);
    setNotes([]);
  };

  const atHome = messages.length === 0;

  /* ---------------- render ---------------- */

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            ச
          </span>
          <span>
            {t("appName", lang)}
            <small>{t("appTagline", lang)}</small>
          </span>
        </div>
        <div className="langs" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.id}
              className="lang-pill"
              aria-pressed={l.id === lang}
              onClick={() => switchLang(l.id)}
              lang={l.speech}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <div className="safety" role="note">
        <span aria-hidden="true">⚠️</span>
        <span>
          <b>{t("safetyTitle", lang)}</b> {t("safetyText", lang)}
        </span>
      </div>

      <main className="main" ref={mainRef} aria-live="polite">
        {atHome && (
          <div className="hero">
            <div className="avatar" aria-hidden="true">
              🧕
            </div>
            <h1>{t("greeting", lang)}</h1>
            <p>{t("greetingSub", lang)}</p>
            <button
              className={`mic-btn${listening ? " listening" : ""}`}
              onClick={() => (listening ? stopListening() : startListening())}
              aria-label={t("micBig", lang)}
            >
              {listening ? `⏹ ${t("tapToStop", lang)}` : t("micBig", lang)}
            </button>
            <p className="hint">{t("micHint", lang)}</p>
            <h2 className="section-title">{t("categoriesTitle", lang)}</h2>
            <div className="cats">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className="cat"
                  onClick={() => send(`cat:${c.id}`, `${c.icon} ${c.label[lang]}`)}
                >
                  <span className="icon" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="label">{c.label[lang]}</span>
                  <span className="desc">{c.desc[lang]}</span>
                </button>
              ))}
            </div>
            <p className="footer">
              {t("appName", lang)} · {t("safetyTitle", lang)}: {t("safetyText", lang)}
            </p>
          </div>
        )}

        {!atHome &&
          messages.map((m) => (
            <div key={m.id} className={`bubble-row ${m.from}`}>
              {m.from === "sakhi" && (
                <>
                  <span className="face" aria-hidden="true">
                    🧕
                  </span>
                  <div className="bubble sakhi">{m.text}</div>
                  <button
                    className="replay"
                    onClick={() => speak(m.text)}
                    aria-label={t("speakAloud", lang)}
                    title={t("speakAloud", lang)}
                  >
                    🔊
                  </button>
                </>
              )}
              {m.from === "user" && <div className="bubble user">{m.text}</div>}
            </div>
          ))}

        {busy && (
          <div className="typing" aria-live="polite">
            {t("thinking", lang)}
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {notes.map((n, i) => (
          <div className="note" key={i}>
            {n}
          </div>
        ))}

        {results && results.length > 0 && (
          <div className="options" style={{ marginTop: 4 }}>
            {results.map((r) => (
              <button
                key={r.id}
                className="result"
                onClick={() => send(`scheme:${r.id}`, r.name)}
              >
                <div className="name">{r.name}</div>
                <div className="why">{r.reason}</div>
                <div className="open">
                  {t("whyFit", lang)} ➜ {r.tagline}
                </div>
              </button>
            ))}
          </div>
        )}

        {card && (
          <div className="card">
            <h3>{card.name}</h3>
            <p className="tagline">{card.tagline}</p>
            <div className="reason">
              <b>{t("matchReason", lang)}:</b> {card.reason}
            </div>
            <section>
              <h4>{t("whatYouGet", lang)}</h4>
              <ul>
                {card.gives.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>{t("whoCanApply", lang)}</h4>
              <ul>
                {card.eligibility.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>{t("documents", lang)}</h4>
              <ul className="checklist">
                {card.documents.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </section>
            {card.caution && <div className="caution">⚠️ {card.caution}</div>}
            <a
              className="official"
              href={card.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 {t("officialSite", lang)}: {card.officialPortalName}
            </a>
            <p className="verify">🔎 {card.verify}</p>
            <p className="verified">
              ✔ {t("ministry", lang)}: {card.ministry} · {t("verifyNote", lang)}
            </p>
          </div>
        )}

        {guide && (
          <div className="card">
            <div className="guide-head">
              <span className="badge">
                {t("stepOf", lang, { n: guide.index + 1, total: guide.total })}
              </span>
              <span className="guide-title">{guide.title}</span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={guide.total}
              aria-valuenow={guide.index + 1}
            >
              <div style={{ width: `${((guide.index + 1) / guide.total) * 100}%` }} />
            </div>
            <p className="guide-text">{guide.text}</p>
            {guide.detail && <p className="guide-detail">💡 {guide.detail}</p>}
            {guide.expectsReport && (
              <p className="guide-report">👉 {t("tellMeScreen", lang)}</p>
            )}
          </div>
        )}

        {!atHome && options.length > 0 && (
          <div className="options">
            {options
              // When the rich result cards are on screen, don't repeat them as chips.
              .filter((o) => !(results && results.length > 0 && o.value.startsWith("scheme:")))
              .map((o, i) => (
              <button
                key={`${o.value}-${i}`}
                className="chip"
                onClick={() => send(o.value, o.label)}
              >
                {o.icon && <span aria-hidden="true">{o.icon}</span>}
                <span>{o.label}</span>
              </button>
            ))}
            <button className="chip ghost" onClick={reset}>
              {t("restart", lang)}
            </button>
          </div>
        )}
      </main>

      <footer className="composer">
        <button
          className={`mic-btn${listening ? " listening" : ""}`}
          onClick={() => (listening ? stopListening() : startListening())}
          aria-label={t("micBig", lang)}
        >
          {listening ? `⏹ ${t("tapToStop", lang)}` : t("micBig", lang)}
        </button>
        <div className="text-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(text);
            }}
            placeholder={t("typeHere", lang)}
            aria-label={t("typeHere", lang)}
            enterKeyHint="send"
          />
          <button className="send-btn" onClick={() => send(text)} disabled={busy}>
            {t("send", lang)}
          </button>
        </div>
        <div className="composer-meta">
          <button
            className="voice-toggle"
            aria-pressed={voiceOn}
            onClick={() => setVoiceOn((v) => !v)}
          >
            {voiceOn ? `🔊 ${t("voiceOn", lang)}` : `🔇 ${t("voiceOff", lang)}`}
          </button>
          <span>{aiMode === "gemini" ? t("aiModeGemini", lang) : t("aiModeLocal", lang)}</span>
        </div>
      </footer>
    </div>
  );
}
