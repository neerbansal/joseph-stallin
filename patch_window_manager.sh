cat << 'PATCH' > window_manager.patch
<<<<<<< SEARCH
import { NotesApp } from "./apps/NotesApp";
=======
import { NotesApp } from "./apps/NotesApp";
import { DocsApp } from "./components/DocsApp";
>>>>>>> REPLACE
<<<<<<< SEARCH
      case "notes":
        return <NotesApp />;
=======
      case "notes":
        return <NotesApp />;
      case "docs":
        return <DocsApp />;
>>>>>>> REPLACE
<<<<<<< SEARCH
      case "notes":
        return "Notes";
=======
      case "notes":
        return "Notes";
      case "docs":
        return "Documentation";
>>>>>>> REPLACE
PATCH
patch src/WindowManager.tsx < window_manager.patch
