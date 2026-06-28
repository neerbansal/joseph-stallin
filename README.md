# 🖥️ Invincible OS

> A browser-based desktop OS — built for a Hack Club hackathon, with absolutely zero chill.

Invincible OS is a fake-but-fully-functional desktop environment that runs entirely in your browser. Open apps in draggable windows, run real commands in a real interactive terminal, change themes on the fly, and try not to anger the resident mascot, Roseline, who bites.

## ✨ Features

- **Draggable window manager** — open, drag, and close app windows like a real OS, built with Framer Motion.
- **Real interactive terminal** — not a scripted demo. Type your own commands.
  - `/help` — list all commands
  - `/visit <theme>` — live-reskins the terminal background (america, japan, matrix, void, and growing) with autocomplete suggestions as you type
  - `/kill roseline` — triggers a random kill animation (anvil drop, decapitation, more on the way) with red particle effects
  - `/clear` — clear the terminal
- **Roseline** — a draggable pixel-cat mascot who frantically protests when you drag her around, and fires off one of 160,000+ combinatorially-generated bite warnings when you let go.
- **Spotlight-style search** — jump to apps or socials from one search bar in the dock.
- **In-app Documentation** — a hamburger-menu-driven docs modal (Who is the dev, future updates, terms, privacy) editable from a single config file — no code required to update.
- **Notes app** — quick scratchpad, because every OS needs one.
- **Fully config-driven customization** — Roseline's behavior, terminal themes, and docs content all live in `src/config/*.ts`. Edit a list, not a component.

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui patterns
- Framer Motion (window dragging, mascot animation, transitions)
- Tabler Icons

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 📂 Project Structure

```
src/
├── apps/              # Individual "apps" that live inside windows
│   ├── TerminalApp.tsx
│   └── NotesApp.tsx
├── components/
│   ├── Roseline.tsx         # The mascot
│   ├── Spotlight.tsx        # Search overlay
│   ├── DocumentationModal.tsx
│   └── ui/                  # Reusable primitives (dock, terminal shell, etc.)
├── config/
│   ├── roseline.config.ts   # Bite warnings, kill animations, drag shouts
│   ├── terminal.config.ts   # /visit themes, social links, terminal copy
│   └── docs.config.ts       # Documentation modal sections
├── Desktop.tsx        # The desktop shell — dock, icons, window manager
├── WindowManager.tsx  # Draggable window logic
├── LandingPage.tsx    # Pre-desktop landing screen
└── App.tsx
```

## 🎨 Customizing

Almost everything ships from config files, not component code:

- **New `/visit` theme?** Add an entry to `VISIT_THEMES` in `src/config/terminal.config.ts`.
- **New bite warning vocabulary?** Add words to the arrays in `src/config/roseline.config.ts` — the generator is combinatorial, so a few new words multiply into thousands of new combinations.
- **New kill animation?** Add an entry to `KILL_ANIMATIONS` in `roseline.config.ts`, then add the matching render branch in `Roseline.tsx`.
- **New documentation section?** Add an object to `DOC_SECTIONS` in `src/config/docs.config.ts` — it shows up in the hamburger menu automatically. See the comment at the bottom of that file for a worked example.

Image assets used by Roseline (`roseline.png`, `roseline-spray.png`, plus optional `roseline-head.png`, `roseline-body.png`, `anvil.png`) live in `public/assets/roseline/`. Every component that uses them falls back to an emoji placeholder if an image is missing, so the app never breaks waiting on art.

## 🔗 Links

- YouTube: [@realproneer1111](https://youtube.com/@realproneer1111)
- Instagram: [@duckiscutefr](https://www.instagram.com/duckiscutefr)

## 📜 License

Built for hackathon purposes. Do whatever, just don't make Roseline mad.
