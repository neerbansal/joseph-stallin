import re

with open('src/components/ui/terminal.tsx', 'r') as f:
    content = f.read()

# Add theme props
content = content.replace(
    'interface TerminalProps {',
    'interface TerminalProps {\n  themeBackground?: string;\n  themeTextColor?: string;'
)

content = content.replace(
    'export function Terminal({',
    'export function Terminal({\n  themeBackground = "bg-black",\n  themeTextColor = "text-white/80",'
)

content = content.replace(
    '"w-full h-full mx-auto overflow-hidden bg-black flex flex-col relative",',
    '"w-full h-full mx-auto overflow-hidden flex flex-col relative",\n        themeBackground,'
)

content = content.replace(
    'className="flex-1 p-4 font-mono text-sm overflow-y-auto text-white/80 pb-12 cursor-text"',
    'className={cn("flex-1 p-4 font-mono text-sm overflow-y-auto pb-12 cursor-text", themeTextColor)}'
)

with open('src/components/ui/terminal.tsx', 'w') as f:
    f.write(content)
