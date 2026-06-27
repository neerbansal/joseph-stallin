with open('src/Desktop.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { Roseline } from "./components/Roseline";',
    'import { Roseline } from "./components/Roseline";\nimport { VisitPopup } from "./components/VisitPopup";\nimport { visitThemes, ThemeConfig } from "./terminal/visitConfig";\nimport { useEffect } from "react";'
)

# Add state and effect inside Desktop
state_code = """
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(visitThemes[0]);

  useEffect(() => {
    const handleVisitCommand = (e: CustomEvent) => {
      const query = e.detail?.query?.trim();
      if (query) {
        const foundTheme = visitThemes.find(t => t.id === query);
        if (foundTheme) {
          applyTheme(foundTheme);
          return;
        }
      }
      setIsVisitOpen(true);
    };

    window.addEventListener('visit-command', handleVisitCommand as EventListener);
    return () => {
      window.removeEventListener('visit-command', handleVisitCommand as EventListener);
    };
  }, []);

  const applyTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
  };
"""

content = content.replace(
    '  const [openApps, setOpenApps] = useState<{ id: string; type: string }[]>([]);',
    '  const [openApps, setOpenApps] = useState<{ id: string; type: string }[]>([]);' + state_code
)

# Update Roseline to use theme sprite
content = content.replace(
    '<Roseline spriteUrl="/roseline.png" />',
    '<Roseline spriteUrl={currentTheme.roselineSprite} />'
)

# Add VisitPopup before final div
content = content.replace(
    '    </div>\n  );\n}',
    '      <VisitPopup \n        isOpen={isVisitOpen}\n        onClose={() => setIsVisitOpen(false)}\n        onApplyTheme={applyTheme}\n      />\n    </div>\n  );\n}'
)

with open('src/Desktop.tsx', 'w') as f:
    f.write(content)
