# AGENTS.md — Piano Princess

Hebrew RTL gamified piano practice tracker PWA for children.
Stack: TypeScript 5, React 19, Vite 7, Tailwind CSS v4, vite-plugin-pwa.

## Build & Dev Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview the production build locally
npx tsc --noEmit   # Type-check only (no lint/format tools configured)
```

There is no test runner, linter, or formatter configured. The only automated
check available is `npx tsc --noEmit` for type-checking. TypeScript strict mode
is enabled with `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch`, and `forceConsistentCasingInFileNames`.

## Project Structure

```
src/
  components/    # Reusable UI components (Celebration, LevelUpModal, MagicModal)
  data/          # Constants and static data (level thresholds, stickers, tasks)
  hooks/         # Custom React hooks (useGameState, useMagicContent)
  layout/        # Layout components (Header, BottomNav, StreakCard)
  lib/           # Utilities and services (sounds.ts — Web Audio API)
  pages/         # Page-level components (TasksPage, PianoPage, FunPage, StickersPage)
  types.ts       # Centralized domain type definitions
  App.tsx        # Root component with tab routing
  main.tsx       # React entry point
  index.css      # Global CSS: Tailwind import, custom animations, glass-morphism
```

## Code Style

### Formatting

- **2-space indentation** (no tabs)
- **Double quotes** for all strings
- **Semicolons** always present
- **Trailing commas** in multi-line constructs (objects, arrays, function args)
- Arrow function parameters are always parenthesized: `(x) => ...`
- No strict line length limit, but JSX breaks across lines when props are long

### Imports

Order imports in a single block (no blank lines between groups):

1. React / React hooks
2. Third-party libraries (e.g., `lucide-react`)
3. Local type imports (`import type { X } from ...`)
4. Local hooks, components, data, lib — grouped by directory

Always use separate `import type` statements for type-only imports:

```ts
import { useState, useCallback } from "react";
import { Crown, Star } from "lucide-react";
import type { Stats, Task } from "../types";
import { LEVEL_THRESHOLDS } from "../data/constants";
import { playTaskComplete } from "../lib/sounds";
```

### Components

- Use **`function` declarations** (not arrow functions) for all components and hooks
- Use **named exports** everywhere; only `App` uses `export default`
- Props are destructured inline in the function signature
- One exported component/hook per file; internal helpers stay in the same file unexported

```ts
interface TasksPageProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
}

export function TasksPage({ tasks, onTaskComplete }: TasksPageProps) {
  // ...
}
```

### Types

- Use `interface` for object shapes, `type` for unions and aliases
- Centralize domain types in `src/types.ts`
- Co-locate props interfaces in the component file (not exported)
- Generic type parameters on hooks: `useState<TabId>("tasks")`

### Naming Conventions

| Element              | Convention                    | Example                      |
|----------------------|-------------------------------|------------------------------|
| Component files      | PascalCase                    | `LevelUpModal.tsx`           |
| Page files           | PascalCase + `Page` suffix    | `TasksPage.tsx`              |
| Hook files           | camelCase + `use` prefix      | `useGameState.ts`            |
| Utility files        | camelCase                     | `sounds.ts`, `constants.ts`  |
| Components           | PascalCase                    | `StreakCard`                  |
| Hooks                | camelCase + `use` prefix      | `useGameState`               |
| Props interfaces     | PascalCase + `Props` suffix   | `HeaderProps`                |
| Constants            | SCREAMING_SNAKE_CASE          | `LEVEL_THRESHOLDS`           |
| State variables      | camelCase                     | `activeTab`, `showLevelUp`   |
| Boolean state        | `is`/`show`/`all` prefix      | `isPressed`, `showModal`     |
| Event handlers       | `handle` prefix               | `handleTaskComplete`         |
| Callback props       | `on` prefix                   | `onTabChange`, `onClose`     |
| Refs                 | camelCase + `Ref` suffix      | `tasksRef`, `processingRef`  |

### File Structure Within Modules

```
1. Imports
2. Local interfaces (props types)
3. Local constants (SCREAMING_SNAKE_CASE)
4. Internal helper functions/components (unexported)
5. Exported component/hook function
```

### State Management

- Custom hooks encapsulate related state; no external state libraries
- Return objects with `as const` for type narrowing
- Use `useCallback` for all handlers passed as props
- Lazy state initialization: `useState<Task[]>(() => loadInitialTasks())`
- Refs to avoid stale closures in callbacks
- `localStorage` for persistence, synced via `useEffect`
- Derived values computed inline (not stored in state)

### Error Handling

- Guard clauses with early returns instead of nested conditionals
- Silent catch for non-critical operations (audio playback)
- Nullish coalescing (`??`) for safe defaults
- Optional chaining for potentially null values
- No error boundaries in the codebase

### Styling (Tailwind CSS v4)

- Utility-first with classes directly in JSX
- Template literal concatenation for conditional classes (no `clsx` library):
  ```tsx
  className={`base-classes ${condition ? "active-classes" : "inactive-classes"}`}
  ```
- Tailwind v4 uses `@import "tailwindcss"` in CSS (not `@tailwind` directives)
- Custom animations defined in `index.css` (`.animate-fall`, `.glass-panel`, etc.)
- Class ordering: layout/position -> sizing -> spacing -> bg/colors -> border -> text -> effects -> transitions
- Color palette: pink/purple primary, yellow accents, green for success

### Hebrew / RTL

- All user-facing text is hardcoded Hebrew (no i18n)
- HTML has `dir="rtl"` and `lang="he"`
- Use `rtl:space-x-reverse` for horizontal spacing
- Use `text-right` for right-aligned text blocks
- Progress bars use `bg-gradient-to-l` (fills right-to-left)
- Piano keyboard overrides with `direction: "ltr"` (music is always LTR)
- Font: Heebo (Google Fonts, Hebrew-optimized)
- PWA manifest: `"dir": "rtl"`, `"lang": "he"`

### Path Aliases

TypeScript path alias configured but not currently used in codebase:
```json
"@/*" -> "./src/*"
```

### Deployment

Deployed to Vercel. No CI/CD pipelines or GitHub Actions configured.
