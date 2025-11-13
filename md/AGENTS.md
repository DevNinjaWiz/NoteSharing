# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the Angular 20 frontend. Key areas: `app/components` (standalone feature views such as `login`, `home`, `dashboard`), `app/store` (NgRx Signal Stores for auth/notes), `app/services` (HTTP adapters), and `styles.scss` for global theming.  
- `app/shared/components` collects reusable UI primitives; each component should be standalone, export through an `index.ts`, and expose model/input signals instead of legacy `@Input` setters.  
- `backend/` contains the Express API (`index.js`) plus `db.json` for local persistence.  
- Design references and specs live under `specification/`, while root-level `.md` files (`GEMINI.md`, `PROJECT_SUMMARY.md`) describe architecture and standards.

## Build, Test, and Development Commands
- `npm install` – install Angular workspace dependencies (run once at repo root).  
- `ng serve` – start the frontend dev server on http://localhost:4200 (expects backend running).  
- `cd backend && npm install && npm start` – install backend deps and boot the API at http://localhost:3000.  
- Tests are not yet automated; add unit specs under `src/app` with `ng test` once implemented.

## Coding Style & Naming Conventions
- Language: TypeScript (frontend) and JavaScript (backend). Use 2-space indentation in TS/HTML/SCSS and single quotes for strings.  
- Angular components must be standalone, expose all mutable state via Angular signals (e.g., `input()`, `model()`, `computed()`), and avoid classic `@Input` setters or `EventEmitter` outputs unless interacting with third-party APIs. Derived state should use `computed` rather than getters.  
- Signals should be read in templates via function-call syntax (`value()`), while derived CSS states belong in SCSS via CSS variables. Prefer readonly arrays/records for immutable lists.  
- Templates must use the latest Angular control-flow syntax (`@if`, `@else`, `@for`, `@switch`) instead of legacy `*ngIf`, `*ngFor`, etc., unless a third-party library forces otherwise.  
- Styling uses handcrafted SCSS (no Tailwind/Bootstrap); colocate component styles, keep selectors BEM-inspired (`.dashboard__sidebar`), and route theme toggles through CSS custom properties.  
- Linting uses ESLint (configured in `eslint.config.mjs`). Run `npm run lint` only after adding the script to `package.json`.

## Testing Guidelines
- Use Jasmine/Karma (Angular default) for component/unit tests, placing specs alongside the source (`*.spec.ts`).  
- Name tests after the unit under test (`dashboard.component.spec.ts`) and focus on store interactions plus template behaviors.  
- When implementing tests, document any required mock services.

## Commit & Pull Request Guidelines
- Follow the observed conventional style: `feat: ...`, `fix: ...`, `chore: ...`. Keep the summary imperative and under ~72 characters; add detail after a semicolon if needed.  
- Pull requests should describe intent, list major changes, include manual test notes, and link related issues. UI-impacting changes should attach screenshots or GIFs from `ng serve`.  
- Rebase before opening PRs to keep the history linear and avoid reverting user changes.
