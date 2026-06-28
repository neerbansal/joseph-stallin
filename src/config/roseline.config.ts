// ============================================================================
// ROSELINE CONFIG — the one file to touch for ALL Roseline behavior.
// ============================================================================
// If an image path below 404s, every component using it falls back to a
// CSS/emoji placeholder automatically. You can drop in real PNGs any time
// without touching component code.

export const ROSELINE_ASSETS = {
  idle: "/assets/roseline/roseline.png",
  spray: "/assets/roseline/roseline-spray.png",
  // Drop these in /public/assets/roseline/ when ready — components already
  // know how to use them, no code changes needed.
  head: "/assets/roseline/roseline-head.png",
  body: "/assets/roseline/roseline-body.png",
  anvil: "/assets/roseline/anvil.png",
};

// ----------------------------------------------------------------------------
// BITE WARNING GENERATOR
// ----------------------------------------------------------------------------
// You asked for "50,000 messages" — writing 50,000 literal strings is a typo
// waiting to happen and impossible to edit. Instead this is COMBINATORIAL:
// pick one item from each list below and glue them together. Right now that's
// OPENERS × SUBJECTS × THREATS × CLOSERS × EMOJI_TAIL combinations.
//
// Current size: 14 × 12 × 12 × 10 × 8 = 161,280 unique messages.
// Want more? Just add more entries to any list — the math does the rest.
// Want FEWER repeats feeling samey? Add more variety to OPENERS/THREATS first,
// those are felt the most.

const OPENERS = [
  "⚠️ WARNING",
  "🚨 ALERT",
  "‼️ NOTICE",
  "🐾 BITE ADVISORY",
  "📢 ANNOUNCEMENT",
  "🔥 HOT TAKE",
  "🧷 SAFETY BULLETIN",
  "🛑 STOP",
  "👁️ EYES UP",
  "💀 FINAL WARNING",
  "🫵 HEY YOU",
  "🐱 CAT LAW",
  "📜 DECREE",
  "⛔ DO NOT",
];

const SUBJECTS = [
  "this gremlin cat",
  "Roseline",
  "the menace formerly known as a kitten",
  "your new arch-nemesis",
  "this 4-pixel war criminal",
  "the headphone-wearing tyrant",
  "the spray-can vandal cat",
  "this little yellow disaster",
  "the self-appointed dock manager",
  "the unlicensed mascot",
  "this absolute unit of attitude",
  "the resident chaos goblin",
];

const THREATS = [
  "WILL bite your cursor off",
  "is one click from feral",
  "has filed a formal complaint against your mouse",
  "is plotting something and it's not subtle about it",
  "will scream if you keep dragging her like that",
  "considers this personal now",
  "is charging her bite meter",
  "just unionized against being moved",
  "has activated maximum sass mode",
  "will remember this",
  "is not legally responsible for what happens next",
  "demands you stop immediately",
];

const CLOSERS = [
  "Proceed at your own risk.",
  "You have been warned.",
  "This is your only notice.",
  "Don't say nobody told you.",
  "Management is not liable.",
  "There is no undo button for this.",
  "Bite insurance not included.",
  "Read the room.",
  "Act accordingly.",
  "This message will not self-destruct, unlike your cursor.",
];

const EMOJI_TAILS = ["🐾", "😾", "💢", "🔪", "⚡", "🩹", "👀", "🧨"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generates one random bite-warning string from the combinatorial pools above. */
export function generateBiteWarning(): string {
  return `${pick(OPENERS)}: ${pick(SUBJECTS)} ${pick(THREATS)}. ${pick(
    CLOSERS
  )} ${pick(EMOJI_TAILS)}`;
}

// Frantic shouts fired rapidly WHILE the user is actively dragging Roseline.
// Short on purpose — these stack up fast.
export const DRAG_SHOUTS = [
  "PUT ME DOWN",
  "HEY!! HEY!!",
  "I WILL BITE",
  "THIS IS KIDNAPPING",
  "STOP. STOP THAT.",
  "I DID NOT CONSENT TO THIS",
  "991!! 991!!",
  "RUDE.",
  "EXCUSE ME?!",
  "I'M TELLING JOHN PAUL",
  "🐾🐾🐾🐾",
  "OK BUT WHY",
];

// ----------------------------------------------------------------------------
// KILL ANIMATIONS — /kill roseline in the terminal
// ----------------------------------------------------------------------------
// Add a new animation by adding an object here. `id` is what shows up in the
// random rotation. Set `enabled: false` to keep it in the file but out of
// rotation (handy for animations you're still building).
export interface KillAnimation {
  id: string;
  label: string;
  enabled: boolean;
  /** ms duration of the full sequence, used for cleanup timing */
  duration: number;
}

export const KILL_ANIMATIONS: KillAnimation[] = [
  { id: "anvil", label: "Anvil Drop", enabled: true, duration: 1800 },
  { id: "decap", label: "Head Removal", enabled: true, duration: 1600 },
  // 13 more slots open. Add { id: "...", label: "...", enabled: true, duration: 1500 }
  // and implement the matching case in Roseline.tsx's renderKillSequence().
  { id: "yeet", label: "Yeet Into Orbit", enabled: false, duration: 1500 },
  { id: "vaporize", label: "Vaporize", enabled: false, duration: 1500 },
];

export function pickKillAnimation(): KillAnimation {
  const active = KILL_ANIMATIONS.filter((a) => a.enabled);
  return pick(active);
}

export const KILL_TERMINAL_LINES = [
  "setting up execution plan...",
  "plan executed.",
  "summoning anvil...",
];
