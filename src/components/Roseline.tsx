import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { generateRoselineReply } from '../lib/ai';

interface RoselineProps {
  spriteUrl: string;
}

export function Roseline({ spriteUrl }: RoselineProps) {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  const handleDragStart = async () => {
    setIsDragging(true);
    const reply = await generateRoselineReply('drag');
    setBubbleText(reply);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Keep bubble for a short duration after dropping
    setTimeout(() => {
      setBubbleText(null);
    }, 3000);
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="absolute bottom-24 right-24 z-50 cursor-grab active:cursor-grabbing flex flex-col items-center"
      style={{ touchAction: 'none' }}
    >
      {/* Speech Bubble */}
      {bubbleText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute -top-16 bg-white dark:bg-neutral-800 text-black dark:text-white px-4 py-2 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 max-w-[200px] text-center text-sm font-medium z-50 whitespace-pre-wrap pointer-events-none"
        >
          {bubbleText}
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white dark:border-t-neutral-800"></div>
        </motion.div>
      )}

      {/* Mascot Image */}
      <img
        src={spriteUrl}
        alt="Roseline"
        className="h-48 object-contain drop-shadow-2xl pointer-events-none"
      />
    </motion.div>
  );
}
