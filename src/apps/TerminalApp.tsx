import React from "react";
import { Terminal } from "@/components/ui/terminal";

export function TerminalApp() {
  return (
    <div className="w-full h-full min-w-[500px]">
      <Terminal
        commands={[
          "npx shadcn@latest init",
          "npm install motion",
          "npx shadcn@latest add button card",
          "Term Deez Nuts",
        ]}
        outputs={{
          0: [
            "✔ Preflight checks passed.",
            "✔ Created components.json",
            "✔ Initialized project.",
          ],
          1: ["added 1 package in 2s"],
          2: ["✔ Done. Installed button, card."],
        }}
        typingSpeed={45}
        delayBetweenCommands={1000}
        className="h-full border-none rounded-none rounded-b-xl"
      />
    </div>
  );
}
