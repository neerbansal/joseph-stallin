with open('src/Desktop.tsx', 'r') as f:
    content = f.read()

# Make sure we add required icons for dock
content = content.replace(
    '  IconTerminal2,\n  IconNote,\n} from "@tabler/icons-react";',
    '  IconTerminal2,\n  IconNote,\n  IconSearch,\n  IconBrandYoutube,\n  IconBrandInstagram,\n  IconBook,\n} from "@tabler/icons-react";'
)

# Update dockLinks to only have Home, Terminal, Notes, Docs, Search, YouTube, Instagram
dock_links_replacement = """  const dockLinks = [
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
  ];"""

import re
content = re.sub(r'  const dockLinks = \[.*?\];', dock_links_replacement, content, flags=re.DOTALL)

with open('src/Desktop.tsx', 'w') as f:
    f.write(content)
