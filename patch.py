with open('src/WindowManager.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { NotesApp } from "./apps/NotesApp";',
    'import { NotesApp } from "./apps/NotesApp";\nimport { DocsApp } from "./components/DocsApp";'
)

content = content.replace(
    '      case "notes":\n        return <NotesApp />;',
    '      case "notes":\n        return <NotesApp />;\n      case "docs":\n        return <DocsApp />;'
)

content = content.replace(
    '      case "notes":\n        return "Notes";',
    '      case "notes":\n        return "Notes";\n      case "docs":\n        return "Documentation";'
)

with open('src/WindowManager.tsx', 'w') as f:
    f.write(content)
