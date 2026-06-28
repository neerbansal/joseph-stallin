import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ROSELINE_ASSETS,
  generateBiteWarning,
  DRAG_SHOUTS,
  pickKillAnimation,
  type KillAnimation,
} from "@/config/roseline.config";

// Fires window-level events so any component (like the terminal) can
// trigger Roseline behavior without prop-drilling.
//   window.dispatchEvent(new CustomEvent("roseline:kill"))
//   window.dispatchEvent(new CustomEvent("roseline:visit", { detail: theme }))

function useImageFallback(src: string) {
  const [ok, setOk] = useState(true);
  return {
    ok,
    onError: () => setOk(false),
    src,
  };
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

function RedParticles({ originX, originY }: { originX: number; originY: number }) {
  const particles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 220,
    y: Math.random() * -160 - 20,
    rotate: Math.random() * 360,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: originX, y: originY, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: originX + p.x,
            y: originY + p.y + 200,
            opacity: 0,
            scale: 0.4,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            position: "fixed",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#dc2626",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

export function Roseline() {
  const idle = useImageFallback(ROSELINE_ASSETS.idle);
  const head = useImageFallback(ROSELINE_ASSETS.head);
  const body = useImageFallback(ROSELINE_ASSETS.body);
  const anvil = useImageFallback(ROSELINE_ASSETS.anvil);

  const [shout, setShout] = useState<string | null>(null);
  const shoutTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragShoutInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [killing, setKilling] = useState<KillAnimation | null>(null);
  const [dead, setDead] = useState(false);
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fireShout = useCallback((text: string, ms = 1600) => {
    setShout(text);
    if (shoutTimeout.current) clearTimeout(shoutTimeout.current);
    shoutTimeout.current = setTimeout(() => setShout(null), ms);
  }, []);

  const handleDragStart = useCallback(() => {
    fireShout(DRAG_SHOUTS[Math.floor(Math.random() * DRAG_SHOUTS.length)], 5000);
    dragShoutInterval.current = setInterval(() => {
      fireShout(
        DRAG_SHOUTS[Math.floor(Math.random() * DRAG_SHOUTS.length)],
        1200
      );
    }, 900);
  }, [fireShout]);

  const handleDragEnd = useCallback(() => {
    if (dragShoutInterval.current) clearInterval(dragShoutInterval.current);
    fireShout(generateBiteWarning(), 3000);
  }, [fireShout]);

  // Listen for /kill roseline from the terminal.
  useEffect(() => {
    function onKill() {
      if (dead) return;
      const rect = containerRef.current?.getBoundingClientRect();
      setParticleOrigin({
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
      });
      const anim = pickKillAnimation();
      setKilling(anim);
      setTimeout(() => {
        setDead(true);
        setKilling(null);
      }, anim.duration);
      // Resurrect after a bit so the hackathon demo doesn't end with a corpse forever.
      setTimeout(() => setDead(false), anim.duration + 4000);
    }
    window.addEventListener("roseline:kill", onKill);
    return () => window.removeEventListener("roseline:kill", onKill);
  }, [dead]);

  useEffect(() => {
    return () => {
      if (shoutTimeout.current) clearTimeout(shoutTimeout.current);
      if (dragShoutInterval.current) clearInterval(dragShoutInterval.current);
    };
  }, []);

  if (dead) return null;

  return (
    <>
      <motion.div
        ref={containerRef}
        drag
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="fixed bottom-28 right-10 z-[60] cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }}
        whileDrag={{ scale: 1.08, rotate: -4 }}
        animate={killing && killing.id !== "anvil" ? { opacity: [1, 1, 0] } : !killing ? { y: [0, -6, 0] } : {}}
        transition={
          killing
            ? { duration: killing.duration / 1000 }
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AnimatePresence>
          {shout && !killing && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.85 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-3 py-1.5 text-xs font-bold text-red-400 shadow-xl"
            >
              {shout}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black/90 border-r border-b border-white/10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kill sequence rendering */}
        {killing?.id === "anvil" && (
          <motion.img
            src={anvil.ok ? anvil.src : undefined}
            onError={anvil.onError}
            initial={{ y: -400, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn", delay: 0.6 }}
            className="absolute -top-2 left-1/2 z-10 h-16 w-16 -translate-x-1/2"
            alt=""
            style={!anvil.ok ? { display: "none" } : undefined}
          />
        )}
        {killing?.id === "anvil" && !anvil.ok && (
          <motion.div
            initial={{ y: -400, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn", delay: 0.6 }}
            className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-5xl"
          >
            ⚒️
          </motion.div>
        )}

        {/* Decapitation: render head + body as two separately animated pieces */}
        {killing?.id === "decap" && (
          <div className="relative h-20 w-20">
            {body.ok || idle.ok ? (
              <motion.img
                src={body.ok ? body.src : idle.src}
                onError={body.onError}
                animate={{ y: [0, 4, 4] }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-contain"
                alt=""
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🐱
              </div>
            )}
            <motion.img
              src={head.ok ? head.src : idle.src}
              onError={head.onError}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              animate={{ y: 140, x: 60, rotate: 180, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeIn" }}
              className="absolute inset-0 h-full w-full object-contain"
              alt=""
              style={!head.ok && !idle.ok ? { display: "none" } : undefined}
            />
          </div>
        )}

        {/* Anvil drop: Roseline stays put, anvil falls on her (rendered above) */}
        {killing?.id === "anvil" &&
          (idle.ok ? (
            <img
              src={idle.src}
              onError={idle.onError}
              alt=""
              draggable={false}
              className="h-20 w-20 object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center text-5xl">
              🐱
            </div>
          ))}

        {/* Default idle state — not being killed */}
        {!killing &&
          (idle.ok ? (
            <img
              src={idle.src}
              onError={idle.onError}
              alt="Roseline"
              draggable={false}
              className="h-20 w-20 object-contain drop-shadow-xl"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center text-5xl">
              🐱
            </div>
          ))}
      </motion.div>

      {killing && (
        <RedParticles originX={particleOrigin.x} originY={particleOrigin.y} />
      )}
    </>
  );
}
