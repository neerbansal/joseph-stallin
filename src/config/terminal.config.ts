// ============================================================================
// TERMINAL CONFIG — edit this file to add/change /visit themes & socials.
// ============================================================================
// To add a new /visit theme: copy one of the objects in VISIT_THEMES and
// change the fields. `command` is what the user types after "/visit ".
// `background` accepts any valid CSS background value (gradient, color, or
// url(...) if you add an image to /public/assets/themes/).

export interface VisitTheme {
  command: string; // e.g. "america" -> /visit america
  label: string; // shown in the autocomplete bar
  background: string; // CSS background value for the terminal body
  flagEmoji: string; // shown next to Roseline's little outfit
  outfitLabel: string; // flavor text describing Roseline's pixel outfit
  bootLines: string[]; // lines printed when the theme loads
}

export const VISIT_THEMES: VisitTheme[] = [
  {
    command: "america",
    label: "/visit america",
    background:
      "linear-gradient(160deg, #0a1f44 0%, #b22234 55%, #ffffff 100%)",
    flagEmoji: "🇺🇸",
    outfitLabel: "tiny pixel stars-and-stripes jacket",
    bootLines: ["loading freedom.exe", "Roseline is now wearing a flag. Bald eagle not included."],
  },
  {
    command: "japan",
    label: "/visit japan",
    background: "linear-gradient(160deg, #0c0c0c 0%, #bc002d 70%, #ffffff 100%)",
    flagEmoji: "🇯🇵",
    outfitLabel: "tiny pixel hachimaki headband",
    bootLines: ["konnichiwa.sh", "Roseline tied on a headband. She means business now."],
  },
  {
    command: "matrix",
    label: "/visit matrix",
    background: "linear-gradient(160deg, #000000 0%, #003300 60%, #00ff41 130%)",
    flagEmoji: "💊",
    outfitLabel: "tiny pixel sunglasses + trench coat",
    bootLines: ["wake up roseline...", "the dock has you."],
  },
  {
    command: "void",
    label: "/visit void",
    background: "radial-gradient(circle at 50% 30%, #1a1a2e 0%, #000000 80%)",
    flagEmoji: "🌌",
    outfitLabel: "tiny pixel astronaut helmet",
    bootLines: ["entering the void...", "Roseline floats. There is no gravity here. There is also no wifi."],
  },
  // Add more themes here. Minimum the terminal needs: command, label,
  // background. Everything else is optional flavor.
];

export function findTheme(command: string): VisitTheme | undefined {
  return VISIT_THEMES.find(
    (t) => t.command.toLowerCase() === command.toLowerCase().trim()
  );
}

// ----------------------------------------------------------------------------
// SOCIALS — change these once, they're used everywhere (dock, terminal, docs)
// ----------------------------------------------------------------------------
export const SOCIALS = {
  youtube: "https://youtube.com/@realproneer1111?si=_4XhVHpClJxh_BwK",
  instagram: "https://www.instagram.com/duckiscutefr?igsh=Y3ZhcnBubnJoenQ=",
  instagramHandle: "duckiscutefr",
  github: "#", // <- put your repo URL here
};

export const TERMINAL_COPY = {
  dmLine: "dm me for any features you want →",
  opsie:
    "opsie, it's like you haven't dm'd me for your custom commands. Here's what you can get: custom terminal background, font colour, Roseline customisation, more on insta ↓",
  visitAdvert: "request your own terminal customisation! On insta",
};
