import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VISIT_THEMES,
  findTheme,
  SOCIALS,
  TERMINAL_COPY,
} from "@/config/terminal.config";
import { ROSELINE_ASSETS } from "@/config/roseline.config";

interface Line {
  type: "input" | "output" | "advert";
  text: string;
}

const HELP_TEXT = [
  "Available commands:",
  "  /help                show this list",
  "  /visit <theme>        change the terminal theme (try '/visit' alone to see options)",
  "  /kill roseline        ... you know what this does",
  "  /clear                clear the terminal",
  "",
  "Type /visit and start typing a theme name to see live suggestions above.",
];

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Invincible OS terminal — type /help to get started." },
  ]);
  const [input, setInput] = useState("");
  const [background, setBackground] = useState<string>("#000000");
  const [flag, setFlag] = useState<string | null>(null);
  const [sprayOk, setSprayOk] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = useCallback((type: Line["type"], text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  }, []);

  // Live suggestions for "/visit ..." typed but not yet submitted.
  const showVisitBar = input.trim().toLowerCase().startsWith("/visit");
  const visitQuery = input.trim().slice(6).trim().toLowerCase();
  const visitMatches = VISIT_THEMES.filter((t) =>
    t.command.toLowerCase().includes(visitQuery)
  ).slice(0, 5);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    push("input", trimmed);

    const lower = trimmed.toLowerCase();

    if (lower === "/help") {
      HELP_TEXT.forEach((l) => push("output", l));
      return;
    }

    if (lower === "/clear") {
      setLines([]);
      return;
    }

    if (lower === "/kill roseline") {
      push("output", "setting up execution plan...");
      push("output", "plan executed.");
      push("output", "summoning anvil...");
      window.dispatchEvent(new CustomEvent("roseline:kill"));
      return;
    }

    if (lower.startsWith("/visit")) {
      const arg = trimmed.slice(6).trim();
      if (!arg) {
        push(
          "output",
          `search your command — available: ${VISIT_THEMES.map((t) => t.command).join(", ")}`
        );
        return;
      }
      const theme = findTheme(arg);
      if (!theme) {
        push("output", TERMINAL_COPY.opsie);
        push("advert", SOCIALS.instagram);
        return;
      }
      setBackground(theme.background);
      setFlag(theme.flagEmoji);
      theme.bootLines.forEach((l) => push("output", l));
      push("output", `Roseline is now wearing: ${theme.outfitLabel}`);
      push("advert", TERMINAL_COPY.visitAdvert);
      window.dispatchEvent(new CustomEvent("roseline:visit", { detail: theme }));
      return;
    }

    push(
      "output",
      `command not found: ${trimmed} — type /help (yes, "Term Deez Nuts" was never a real command, sorry)`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  return (
    <div
      className="relative flex h-full min-w-[560px] aspect-square flex-col font-mono text-sm text-white/90 transition-colors duration-500"
      style={{ background }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <div className="ml-2 text-xs text-white/50">invincible-shell</div>
        {flag && <div className="ml-auto text-base">{flag}</div>}
      </div>

      {/* Autocomplete bar for /visit */}
      <AnimatePresence>
        {showVisitBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10 bg-black/60"
          >
            <div className="px-4 py-1.5 text-[11px] uppercase tracking-wide text-white/40">
              search your command
            </div>
            <div className="max-h-[120px] overflow-y-auto px-2 pb-2">
              {visitMatches.length > 0 ? (
                visitMatches.map((t) => (
                  <div
                    key={t.command}
                    className="cursor-pointer rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                    onClick={() => {
                      setInput(`/visit ${t.command}`);
                      inputRef.current?.focus();
                    }}
                  >
                    {t.label}{" "}
                    <span className="text-white/30">{t.flagEmoji}</span>
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-xs text-white/50">
                  {TERMINAL_COPY.opsie}{" "}
                  <a
                    href={SOCIALS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-pink-400 hover:text-pink-300"
                  >
                    @{SOCIALS.instagramHandle}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollback */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {lines.map((l, i) =>
          l.type === "input" ? (
            <div key={i} className="flex gap-2">
              <span className="text-green-400">➜</span>
              <span className="text-blue-400">~</span>
              <span>{l.text}</span>
            </div>
          ) : l.type === "advert" ? (
            <div key={i} className="mt-0.5 text-pink-400">
              {l.text.startsWith("http") ? (
                <a href={l.text} target="_blank" rel="noreferrer" className="underline">
                  {TERMINAL_COPY.visitAdvert} → @{SOCIALS.instagramHandle}
                </a>
              ) : (
                l.text
              )}
            </div>
          ) : (
            <div key={i} className="mt-0.5 text-white/60">
              {l.text}
            </div>
          )
        )}
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-4 py-2">
        <span className="text-green-400">➜</span>
        <span className="text-blue-400">~</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent outline-none placeholder:text-white/30"
          placeholder="/help"
          spellCheck={false}
        />
      </form>

      {/* DM footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-black/50 px-4 py-1.5 text-[11px] text-white/40">
        <span>{TERMINAL_COPY.dmLine}</span>
        <a
          href={SOCIALS.instagram}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-pink-400 hover:text-pink-300"
        >
          @{SOCIALS.instagramHandle}
        </a>
      </div>

      {/* Roseline's spray can, resting in the corner */}
      <div className="pointer-events-none absolute bottom-9 left-1 h-12 w-12 opacity-90">
        {sprayOk ? (
          <img
            src={ROSELINE_ASSETS.spray}
            onError={() => setSprayOk(false)}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🧴</div>
        )}
      </div>
    </div>
  );
}
