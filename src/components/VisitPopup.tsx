import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { visitThemes, ThemeConfig } from '../terminal/visitConfig';

interface VisitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: ThemeConfig) => void;
}

export function VisitPopup({ isOpen, onClose, onApplyTheme }: VisitPopupProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredThemes = visitThemes
    .filter(theme => theme.name.toLowerCase().includes(searchQuery.toLowerCase()) || theme.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
          <div className="p-4 border-b border-neutral-700">
            <input
              type="text"
              placeholder="Search your command..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-600 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            {filteredThemes.length > 0 ? (
              filteredThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onApplyTheme(theme);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 text-white transition-colors flex flex-col"
                >
                  <span className="font-medium">{theme.name}</span>
                  <span className="text-xs text-neutral-400">/visit {theme.id}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-neutral-300">
                <p className="mb-4">Looks like your custom terminal isn't ready.</p>
                <p>DM me on Instagram.</p>
                <a
                  href="https://instagram.com/duckiscutefr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline font-medium my-2 block"
                >
                  duckiscutefr
                </a>
                <div className="text-sm text-neutral-400 text-left bg-neutral-800 p-3 rounded-lg mt-4">
                  <p className="font-semibold mb-1 text-neutral-300">You can request:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>custom backgrounds</li>
                    <li>custom font colours</li>
                    <li>Roseline customisation</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
