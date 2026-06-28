import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  commands: string[];
  outputs: Record<number, string[]>;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  className?: string;
}

export function Terminal({
  commands,
  outputs,
  typingSpeed = 50,
  delayBetweenCommands = 1000,
  className,
}: TerminalProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([]);

  useEffect(() => {
    if (currentCommandIndex >= commands.length) return;

    const command = commands[currentCommandIndex];
    if (isTyping) {
      if (currentText.length < command.length) {
        const timeout = setTimeout(() => {
          setCurrentText(command.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 300);
        return () => clearTimeout(timeout);
      }
    } else {
      setHistory((prev) => [
        ...prev,
        { command, output: outputs[currentCommandIndex] || [] },
      ]);
      setCurrentText("");
      const timeout = setTimeout(() => {
        setCurrentCommandIndex((prev) => prev + 1);
        setIsTyping(true);
      }, delayBetweenCommands);
      return () => clearTimeout(timeout);
    }
  }, [
    currentCommandIndex,
    currentText,
    isTyping,
    commands,
    outputs,
    typingSpeed,
    delayBetweenCommands,
  ]);

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-2 text-xs text-white/50 font-mono">bash</div>
      </div>
      <div className="p-4 font-mono text-sm min-h-[300px] text-white/80">
        {history.map((item, i) => (
          <div key={i} className="mb-4">
            <div className="flex gap-2">
              <span className="text-green-400">➜</span>
              <span className="text-blue-400">~</span>
              <span>{item.command}</span>
            </div>
            {item.output.length > 0 && (
              <div className="mt-1 text-white/60">
                {item.output.map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        {currentCommandIndex < commands.length && (
          <div className="flex gap-2">
            <span className="text-green-400">➜</span>
            <span className="text-blue-400">~</span>
            <span>
              {currentText}
              <span className="animate-pulse bg-white/60 w-2 h-4 inline-block ml-1 align-middle" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
