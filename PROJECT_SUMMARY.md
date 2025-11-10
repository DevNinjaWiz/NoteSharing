# Note Sharing Platform Summary

## Overview
This repository hosts a full-stack note sharing demo that pairs an Angular 20 frontend with a lightweight Node/Express API. The UI lets users register, log in, and access protected areas (home/dashboard). State is centralized with NgRx Signal Store, while the backend persists notes and users inside `backend/db.json` for easy local testing. The project intentionally keeps authentication simple and insecure for demo purposes, as highlighted in `GEMINI.md`.

## Architecture Snapshot
- **Frontend (src/):** Standalone Angular components (`login`, `register`, `home`, `dashboard`) wired together through `app.routes.ts` and bootstrapped via `app.config.ts` with router + HttpClient providers.
- **State Management:** `AuthStore` and `NotesStore` expose signals for user/session and note data, patching loading/error flags around AuthService/NoteService calls.
- **Backend (backend/):** `index.js` spins up Express with CORS, exposes `/api/register|login|logout` and CRUD operations under `/api/notes`, and reads/writes to `db.json`.
- **Shared Contracts:** Simple TypeScript interfaces (`AuthCredentials`, `User`, `Note`) keep services, stores, and components strongly typed.

## Development Workflow
1. **Frontend**
   - Install deps: `npm install`
   - Run dev server: `ng serve` (http://localhost:4200)
   - Build: `ng build`
2. **Backend**
   - From `backend/`: `npm install`
   - Start API: `npm start` (http://localhost:3000)

The front end expects the backend to run locally at port 3000, as configured inside the Angular services.

## Key Considerations
- Authentication relies on plaintext passwords stored in the JSON file—sufficient for demos only.
- Notes endpoints return data scoped by ID only; there is no per-user authorization layer yet.
- `README.md` still mentions an in-memory mock backend, so it should be updated to reflect the real Express service (see `GEMINI.md` for the authoritative docs).
- UI views for the dashboard/notes area are placeholders; wiring them to `NotesStore` would surface actual data.

## Suggested Next Steps
1. Update `README.md` to mirror the architecture documented in `GEMINI.md` and this summary.
2. Implement secure auth (hashed passwords, tokens/sessions) plus user-scoped note queries before production use.
3. Build out the dashboard UI with note listing/editing/sharing flows backed by `NotesStore` actions.
