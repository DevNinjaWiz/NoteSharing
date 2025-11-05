# GEMINI.md

## Project Overview

This document outlines the architecture and development guidelines for the "Notes Sharing Platform," now a **frontend-only Angular application**. The platform is designed to be a user-friendly web application that allows users to create, manage, and securely share personal notes.

The frontend is a modern Angular application that directly interacts with **Firebase Firestore** for all data persistence. The previous microservice-based backend, Nx monorepo structure, and Docker/Docker Compose setup have been removed.

**Note on Authentication:** For demonstration purposes, this project uses a custom, **insecure authentication system** that directly interacts with a Firestore `users` collection. This approach is **not recommended for production environments** due to significant security risks. Firebase Authentication is the secure and recommended alternative.

## Key Technologies

*   **Language:** TypeScript
*   **Frontend:** Angular (with Signals)
*   **Database:** Firebase Firestore
*   **Authentication:** Custom (insecure) Firestore-based authentication
*   **Styling:** SCSS

## Project Structure

The project is now a standard Angular CLI application with the following structure:

*   `src/`: Contains the Angular frontend application.
    *   `app/`: Main application logic, components, services, and guards.
    *   `environments/`: Environment-specific configurations.
*   `scripts/`: Contains utility scripts, such as `set-env.js` for managing environment variables from `.env`.

## Building and Running

The project is now a standard Angular CLI application.

*   **Prerequisites:**
    *   Node.js and Angular CLI installed.
    *   A `.env` file in the project root with Firebase credentials (see `README.md` for details).

*   **Installation:**
    ```bash
    npm install
    ```

*   **Run Development Server:**
    ```bash
    npm start
    ```
    This command automatically generates environment files from `.env` and starts the Angular development server on `http://localhost:4200/`.

*   **Build for Production:**
    ```bash
    npm run build
    ```
    This command automatically generates environment files from `.env` and builds the application for production.

## Development Conventions

*   **Architecture:** Adheres to Angular best practices.
*   **Styling:** The project uses plain SCSS for styling. No third-party styling frameworks like Tailwind CSS or Bootstrap are used.
*   **Code Style:** Consistent code style settings are maintained.
*   **Linting:** ESLint is used for code quality and consistency.
