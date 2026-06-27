export interface ThemeConfig {
  id: string;
  name: string;
  terminalBackground: string;
  terminalTextColor: string;
  roselineSprite: string;
}

export const visitThemes: ThemeConfig[] = [
  {
    id: "default",
    name: "Default Theme",
    terminalBackground: "bg-black",
    terminalTextColor: "text-white/80",
    roselineSprite: "/roseline.png"
  },
  {
    id: "america",
    name: "America Theme",
    terminalBackground: "bg-blue-900",
    terminalTextColor: "text-red-400",
    roselineSprite: "/rosélinespray.png"
  },
  {
    id: "hacker",
    name: "Hacker Mode",
    terminalBackground: "bg-black",
    terminalTextColor: "text-green-500",
    roselineSprite: "/roseline.png"
  },
  {
    id: "light",
    name: "Light Mode",
    terminalBackground: "bg-white",
    terminalTextColor: "text-black",
    roselineSprite: "/roseline.png"
  }
];
