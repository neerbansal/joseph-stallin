with open('src/apps/TerminalApp.tsx', 'r') as f:
    content = f.read()

new_content = """import React from "react";
import { Terminal } from "@/components/ui/terminal";

export function TerminalApp() {
  const handleVisit = (query?: string) => {
    console.log("Visit command triggered with query:", query);
    // In the next step we will hook this up to the Theme context/Visit popup
    // For now we just emit a custom event that the Desktop/Visit component can listen to
    window.dispatchEvent(new CustomEvent('visit-command', { detail: { query } }));
  };

  return (
    <div className="w-full h-full min-w-[500px]">
      <Terminal
        onVisitCommand={handleVisit}
        className="h-full border-none rounded-none rounded-b-xl"
      />
    </div>
  );
}
"""

with open('src/apps/TerminalApp.tsx', 'w') as f:
    f.write(new_content)
