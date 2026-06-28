import React, { useState, useRef, useEffect } from "react";
import { TerminalApp } from "./apps/TerminalApp";
import { NotesApp } from "./apps/NotesApp";
import { motion } from "framer-motion";

interface AppInstance {
  id: string;
  type: string;
}

interface WindowManagerProps {
  openApps: AppInstance[];
  closeApp: (id: string) => void;
}

export function WindowManager({ openApps, closeApp }: WindowManagerProps) {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const renderApp = (type: string) => {
    switch (type) {
      case "terminal":
        return <TerminalApp />;
      case "notes":
        return <NotesApp />;
      default:
        return <div className="p-4 text-white">App not found</div>;
    }
  };

  const getAppTitle = (type: string) => {
    switch (type) {
      case "terminal":
        return "Terminal";
      case "notes":
        return "Notes";
      default:
        return "Unknown App";
    }
  };

  return (
    <>
      {openApps.map((app, index) => (
        <DraggableWindow
          key={app.id}
          id={app.id}
          title={getAppTitle(app.type)}
          onClose={() => closeApp(app.id)}
          isActive={activeWindow === app.id}
          onFocus={() => setActiveWindow(app.id)}
          defaultPosition={{ x: 100 + index * 30, y: 100 + index * 30 }}
          sizeClassName={
            app.type === "terminal"
              ? "min-w-[560px] min-h-[560px]"
              : "min-w-[400px] min-h-[300px]"
          }
        >
          {renderApp(app.type)}
        </DraggableWindow>
      ))}
    </>
  );
}

interface DraggableWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition: { x: number; y: number };
  sizeClassName?: string;
}

function DraggableWindow({
  title,
  children,
  onClose,
  isActive,
  onFocus,
  defaultPosition,
  sizeClassName = "min-w-[400px] min-h-[300px]",
}: DraggableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={windowRef}
      drag
      dragMomentum={false}
      initial={defaultPosition}
      onMouseDown={onFocus}
      className={`absolute flex flex-col rounded-xl overflow-hidden border bg-black/80 backdrop-blur-md shadow-2xl ${sizeClassName} ${
        isActive ? "z-40 border-white/30" : "z-30 border-white/10"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* Title Bar (Draggable Handle) */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/10 cursor-grab active:cursor-grabbing border-b border-white/10">
        <div className="text-sm font-medium text-white/80">{title}</div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition"
          />
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition" />
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-1 cursor-default">
        {children}
      </div>
    </motion.div>
  );
}
