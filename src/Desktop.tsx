import React, { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Terminal } from "@/components/ui/terminal";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
  IconNote,
  IconSearch,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBook,
} from "@tabler/icons-react";
import { WindowManager } from "./WindowManager";
import { Roseline } from "./components/Roseline";
import { VisitPopup } from "./components/VisitPopup";
import { visitThemes, ThemeConfig } from "./terminal/visitConfig";
import { useEffect } from "react";

const APPS = {
  terminal: { title: "Terminal", icon: "/assets/terminal.png" },
  notes: { title: "Notes", icon: "/assets/notes.png" },
};

export function Desktop() {
  const [openApps, setOpenApps] = useState<{ id: string; type: string }[]>([]);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(visitThemes[0]);

  useEffect(() => {
    const handleVisitCommand = (e: CustomEvent) => {
      const query = e.detail?.query?.trim();
      if (query) {
        const foundTheme = visitThemes.find(t => t.id === query);
        if (foundTheme) {
          applyTheme(foundTheme);
          return;
        }
      }
      setIsVisitOpen(true);
    };

    window.addEventListener('visit-command', handleVisitCommand as EventListener);
    return () => {
      window.removeEventListener('visit-command', handleVisitCommand as EventListener);
    };
  }, []);

  const applyTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
  };


  const openApp = (type: string) => {
    setOpenApps((prev) => {
      if (prev.some((app) => app.type === type)) return prev; // Already open
      return [...prev, { id: Math.random().toString(36).substr(2, 9), type }];
    });
  };

  const closeApp = (id: string) => {
    setOpenApps((prev) => prev.filter((app) => app.id !== id));
  };

  const dockLinks = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Terminal",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => openApp("terminal"),
    },
    {
      title: "Notes",
      icon: <IconNote className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => openApp("notes"),
    },
    {
      title: "Documentation",
      icon: <IconBook className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => openApp("docs"),
    },
    {
      title: "Search",
      icon: <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "YouTube",
      icon: <IconBrandYoutube className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://youtube.com",
    },
    {
      title: "Instagram",
      icon: <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://instagram.com/duckiscutefr",
    },
  ];

  return (
    <div className="relative h-screen w-screen bg-[url('/assets/wallpaper.jpg')] bg-cover bg-center overflow-hidden">
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-4">
        {Object.entries(APPS).map(([key, app]) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-white/10 transition"
            onClick={() => openApp(key)}
          >
            <img src={app.icon} alt={app.title} className="w-12 h-12 object-contain shadow-md" />
            <span className="text-white text-xs font-medium drop-shadow-md">{app.title}</span>
          </div>
        ))}
      </div>

      {/* Window Manager */}
      <WindowManager openApps={openApps} closeApp={closeApp} />

      {/* Roseline Mascot */}
      <Roseline spriteUrl={currentTheme.roselineSprite} />

      {/* Floating Dock */}
      <div className="absolute bottom-0 w-full flex justify-center pb-8">
        <FloatingDock items={dockLinks} />
      </div>
      <VisitPopup
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
        onApplyTheme={applyTheme}
      />
    </div>
  );
}
