// ============================================================================
// DOCS CONFIG — every section in the hamburger menu / Documentation modal
// comes from this one array. Read the bottom of this file for how to add
// your own new section.
// ============================================================================
import { SOCIALS } from "./terminal.config";

export interface DocSection {
  id: string;
  title: string;
  emoji: string;
  // Each paragraph is one block of text. Keep it short, this isn't a novel.
  paragraphs: string[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "whoisdev",
    title: "WHOisDEV?",
    emoji: "🧑‍💻",
    paragraphs: [
      "Invincible OS is built by Ny — a hackathon builder who runs the YouTube channel realproneer1111 and posts as @duckiscutefr on Instagram.",
      `Find more of the chaos: ${SOCIALS.youtube}`,
    ],
  },
  {
    id: "future-updates",
    title: "Future Updates",
    emoji: "🚧",
    paragraphs: [
      "This section is meant to be edited every time you ship something. Treat it like a changelog the user actually wants to read.",
      "v1.1 — Roseline mascot, terminal /visit themes, kill animations.",
      "Coming soon — more /visit themes, more kill animations, custom terminal skins via DM.",
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    emoji: "📜",
    paragraphs: [
      "By using Invincible OS you agree that Roseline may bite, scream, or otherwise express her feelings about being dragged around the screen.",
      "This is a hackathon project. No uptime, durability, or emotional stability is guaranteed — Roseline's or yours.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    emoji: "🔒",
    paragraphs: [
      "This site does not collect, store, or sell personal data. Anything you type into the terminal stays in your browser.",
      "If a webcam feature is active on the landing page, video is processed locally and never uploaded anywhere.",
    ],
  },
];

// ----------------------------------------------------------------------------
// HOW TO ADD A NEW SECTION (read this, Ny)
// ----------------------------------------------------------------------------
// 1. Copy one of the objects above.
// 2. Give it a unique `id` (used internally, lowercase-with-dashes).
// 3. Set `title` (shown in the hamburger menu) and an `emoji`.
// 4. Fill `paragraphs` with one string per paragraph.
// 5. Save. That's it — HamburgerMenu.tsx and DocumentationModal.tsx both
//    just map over DOC_SECTIONS, so a new entry here shows up everywhere
//    automatically. No other file needs to change.
//
// Example:
// {
//   id: "credits",
//   title: "Credits",
//   emoji: "🙌",
//   paragraphs: ["Built with React, Vite, Tailwind, shadcn/ui, and Framer Motion."],
// }
