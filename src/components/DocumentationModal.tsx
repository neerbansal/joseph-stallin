import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DOC_SECTIONS } from "@/config/docs.config";

export function DocumentationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeId, setActiveId] = useState(DOC_SECTIONS[0]?.id);
  const [navOpen, setNavOpen] = useState(false); // hamburger toggle on mobile widths

  const active = DOC_SECTIONS.find((s) => s.id === activeId) ?? DOC_SECTIONS[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
          >
            {/* Hamburger button — visible always, toggles the section nav as a slide-over on small widths */}
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:bg-white/10 md:hidden"
              aria-label="Toggle sections menu"
            >
              ☰
            </button>

            {/* Sidebar nav (the "hamburger menu" sections) */}
            <div
              className={`absolute inset-y-0 left-0 z-10 w-56 shrink-0 border-r border-white/10 bg-black/60 p-3 transition-transform md:relative md:translate-x-0 ${
                navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              }`}
            >
              <div className="mb-3 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                Documentation
              </div>
              {DOC_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveId(s.id);
                    setNavOpen(false);
                  }}
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                    s.id === active.id
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-14 md:pt-8">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
              <h2 className="mb-4 text-2xl font-bold text-white">
                {active.emoji} {active.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-white/70">
                {active.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
