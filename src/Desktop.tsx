import React, { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";

import {
  IconBrandGithub,


  IconHome,

  IconTerminal2,
  IconNote,
} from "@tabler/icons-react";
import { WindowManager } from "./WindowManager";

const APPS = {
  terminal: { title: "Terminal", icon: "/assets/terminal.png" },
  notes: { title: "Notes", icon: "/assets/notes.png" },
};

export function Desktop() {
  const [openApps, setOpenApps] = useState<{ id: string; type: string }[]>([]);

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
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
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

      {/* Floating Dock */}
      <div className="absolute bottom-0 w-full flex justify-center pb-8">
        <FloatingDock items={dockLinks} />
      </div>
    </div>
  );
}
