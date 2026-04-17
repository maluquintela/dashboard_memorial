# Repository Guidelines

## Project Structure & Module Organization

This is a Vite, React, and TypeScript single-page dashboard for TecPred memorial generation.

- `src/main.tsx` mounts the React app.
- `src/App.tsx` provides the application shell.
- `src/pages/Dashboard.tsx` owns the main dashboard workflow and page composition.
- `src/components/` contains reusable UI components such as `UploadPanel`, `GeneratedList`, and `ProjectDetail`.
- `src/services/api.ts` centralizes backend HTTP calls.
- `src/types/index.ts` defines shared TypeScript contracts.
- `src/theme.ts` and `src/tecpred-theme.css` hold TecPred visual tokens and utility classes.
- `public/` stores static browser assets.

There is currently no dedicated `tests/` directory.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript project checks and creates a production build.
- `npm run lint` runs ESLint across the repository.
- `npm run preview` serves the production build locally.

Run commands from the repository root.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Prefer explicit interfaces for component props, as seen in `UploadPanelProps` and `ProjectDetailProps`.

Use 2-space indentation, single quotes, and semicolons where the surrounding file uses them. Component files use `PascalCase.tsx`; hooks should use `useThing.ts`; shared constants should use `SCREAMING_SNAKE_CASE` only for true constants.

Keep API logic in `src/services/api.ts`, shared domain types in `src/types/`, and brand styling in `src/theme.ts` or `src/tecpred-theme.css`.

## Testing Guidelines

No test runner is configured yet. For now, validate changes with:

```bash
npm run lint
npm run build
```

When adding tests, prefer colocated files named `ComponentName.test.tsx` or domain tests named `thing.test.ts`. Use React Testing Library or Vitest if a test stack is introduced.

## Commit & Pull Request Guidelines

Git history currently uses short imperative messages, including Conventional Commit style such as:

```txt
feat: dashboard Memorial TecPred (React, Vite, paleta e layout)
```

Prefer concise commit messages in the form `type: summary`, for example `docs: add contributor guide` or `fix: handle memorial API errors`.

Pull requests should include a clear description, linked issue when applicable, screenshots for UI changes, and notes about verification commands run.

## Security & Configuration Tips

Configure the backend URL with `VITE_API_URL` in `.env`. Use `.env.example` as the template and do not commit private environment files or credentials.
