import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIALS } from "@/config/terminal.config";

interface SpotlightItem {
  label: string;
  hint?: string;
  action: () => void;
}

export function Spotlight({
  open,
  onClose,
  onOpenApp,
}: {
  open: boolean;
  onClose: () => void;
  onOpenApp: (type: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const items: SpotlightItem[] = [
    { label: "Open Terminal", hint: "app", action: () => onOpenApp("terminal") },
    { label: "Open Notes", hint: "app", action: () => onOpenApp("notes") },
    {
      label: "YouTube — realproneer1111",
      hint: "link",
      action: () => window.open(SOCIALS.youtube, "_blank"),
    },
    {
      label: "Instagram — @duckiscutefr",
      hint: "link",
      action: () => window.open(SOCIALS.instagram, "_blank"),
    },
  ];

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 pt-[18vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps & links..."
              className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
            <div className="max-h-64 overflow-y-auto border-t border-white/10 p-1">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-white/40">No results.</div>
              )}
              {filtered.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                >
                  {item.label}
                  {item.hint && (
                    <span className="text-xs text-white/30">{item.hint}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
