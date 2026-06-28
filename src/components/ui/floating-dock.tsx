import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
  mobileClassName?: string;
}

export function FloatingDock({ items, className, mobileClassName }: FloatingDockProps) {
  return (
    <div className={cn("fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:block", className)}>
      <div className="flex gap-4 items-end bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
        {items.map((item, idx) => (
          <DockIcon key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

function DockIcon({ item }: { item: DockItem }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (item.onClick) item.onClick();
    if (item.href && item.href !== "#") {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="relative cursor-pointer flex flex-col items-center justify-end"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.8 }}
            className="absolute -top-12 px-2 py-1 bg-black/80 border border-white/10 text-white/80 text-xs rounded-md whitespace-nowrap"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={{ width: hovered ? 56 : 48, height: hovered ? 56 : 48 }}
        className="flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
      >
        <div className="w-6 h-6 flex items-center justify-center text-white">
          {item.icon}
        </div>
      </motion.div>
    </div>
  );
}
