import re

with open('src/components/ui/terminal.tsx', 'r') as f:
    content = f.read()

# Replace the static typing implementation with an interactive one
new_content = """import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  className?: string;
  onVisitCommand?: (query?: string) => void;
}

export function Terminal({
  className,
  onVisitCommand
}: TerminalProps) {
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on click anywhere in terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    let output: string[] = [];
    const parts = trimmedCmd.split(" ");
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case "/help":
        output = [
          "Available commands:",
          "  /help   - Show this help message",
          "  /about  - Info about this OS",
          "  /visit  - Open theme configuration",
          "  /clear  - Clear terminal screen",
          "  /date   - Show current date and time",
        ];
        break;
      case "/about":
        output = [
          "WebOS v1.0.0",
          "A React-based operating system simulation.",
          "Created to explore interactive web environments."
        ];
        break;
      case "/clear":
        setHistory([]);
        return;
      case "/date":
        output = [new Date().toString()];
        break;
      case "/visit":
        output = ["Opening theme configuration..."];
        if (onVisitCommand) {
          onVisitCommand(parts.slice(1).join(" "));
        }
        break;
      default:
        output = [`Command not found: ${baseCmd}. Type /help for available commands.`];
    }

    setHistory((prev) => [...prev, { command: trimmedCmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
      setInputValue("");
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        "w-full h-full mx-auto overflow-hidden bg-black flex flex-col relative",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-2 text-xs text-white/50 font-mono">bash</div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto text-white/80 pb-12 cursor-text"
      >
        <div className="mb-4 text-white/60">
          Welcome to WebOS Terminal. Type /help to see available commands.
        </div>

        {history.map((item, i) => (
          <div key={i} className="mb-4">
            <div className="flex gap-2">
              <span className="text-green-400">➜</span>
              <span className="text-blue-400">~</span>
              <span>{item.command}</span>
            </div>
            {item.output.length > 0 && (
              <div className="mt-1 text-white/60 whitespace-pre-wrap">
                {item.output.map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-2 items-center">
          <span className="text-green-400">➜</span>
          <span className="text-blue-400">~</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white/80 font-mono caret-white"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-2 bg-neutral-900 border-t border-white/10 text-center text-xs text-neutral-500">
        Made by <a href="https://instagram.com/duckiscutefr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer z-50 relative">@duckiscutefr</a>
      </div>
    </div>
  );
}
"""

with open('src/components/ui/terminal.tsx', 'w') as f:
    f.write(new_content)
