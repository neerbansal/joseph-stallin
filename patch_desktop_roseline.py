with open('src/Desktop.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { WindowManager } from "./WindowManager";',
    'import { WindowManager } from "./WindowManager";\nimport { Roseline } from "./components/Roseline";'
)

# Insert Roseline before Floating Dock
content = content.replace(
    '{/* Floating Dock */}',
    '{/* Roseline Mascot */}\n      <Roseline spriteUrl="/roseline.png" />\n\n      {/* Floating Dock */}'
)

with open('src/Desktop.tsx', 'w') as f:
    f.write(content)
