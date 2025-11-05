# GEMINI.md

## Project Overview

This document outlines the architecture and development guidelines for the "Notes Sharing Platform," now a **frontend-only Angular application** using **NgRx Signal Store** for state management. The platform is designed to be a user-friendly web application that allows users to create, manage, and share personal notes.

The frontend is a modern Angular application that uses an **in-memory mock** for backend services, simulating API calls through NgRx effects. The previous microservice-based backend, Nx monorepo structure, Docker/Docker Compose setup, and Firebase integration have been removed.

**Note on Authentication:** For demonstration purposes, this project uses a custom, **insecure authentication system** that relies on an in-memory user store. This approach is **not recommended for production environments** due to significant security risks and lack of data persistence.

## Key Technologies

*   **Language:** TypeScript
*   **Frontend:** Angular (with Signals)
*   **State Management:** NgRx Signal Store
*   **Authentication:** Custom (insecure) in-memory authentication
*   **Styling:** SCSS

## Project Structure

The project is now a standard Angular CLI application with the following structure:

*   `src/`: Contains the Angular frontend application.
    *   `app/`: Main application logic, components, services, guards, and NgRx store definitions.
    *   `environments/`: Environment-specific configurations.

## Building and Running

The project is now a standard Angular CLI application.

*   **Prerequisites:**
    *   Node.js and Angular CLI installed.

*   **Installation:**
    ```bash
    npm install
    ```

*   **Run Development Server:**
    ```bash
    ng serve
    ```
    This command starts the Angular development server on `http://localhost:4200/`.

*   **Build for Production:**
    ```bash
    ng build
    ```
    This command builds the application for production.

## Development Conventions

*   **Architecture:** Adheres to Angular best practices and NgRx Signal Store patterns.
*   **Styling:** The project uses plain SCSS for styling. No third-party styling frameworks like Tailwind CSS or Bootstrap are used.
*   **Code Style:** Consistent code style settings are maintained.
*   **Linting:** ESLint is used for code quality and consistency.