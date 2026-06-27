with open('src/apps/TerminalApp.tsx', 'r') as f:
    content = f.read()

new_content = """import React, { useEffect, useState } from "react";
import { Terminal } from "@/components/ui/terminal";
import { visitThemes } from "@/terminal/visitConfig";

export function TerminalApp() {
  const [currentTheme, setCurrentTheme] = useState(visitThemes[0]);

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail && e.detail.theme) {
        setCurrentTheme(e.detail.theme);
      }
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
    };
  }, []);

  const handleVisit = (query?: string) => {
    // We emit visit-command to desktop.
    window.dispatchEvent(new CustomEvent('visit-command', { detail: { query } }));
  };

  return (
    <div className="w-full h-full min-w-[500px]">
      <Terminal
        onVisitCommand={handleVisit}
        themeBackground={currentTheme.terminalBackground}
        themeTextColor={currentTheme.terminalTextColor}
        className="h-full border-none rounded-none rounded-b-xl"
      />
    </div>
  );
}
"""

with open('src/apps/TerminalApp.tsx', 'w') as f:
    f.write(new_content)
