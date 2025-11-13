# GEMINI.md

## Project Overview

This document outlines the architecture and development guidelines for the "Notes Sharing Platform." It now consists of an **Angular frontend application** using **NgRx Signal Store** for state management and a **Node.js backend API** for data persistence. The platform is designed to be a user-friendly web application that allows users to create, manage, and share personal notes.

The frontend is a modern Angular application that communicates with the Node.js backend. The previous microservice-based backend, Nx monorepo structure, Docker/Docker Compose setup, and Firebase integration have been removed.

**Note on Authentication:** For demonstration purposes, this project uses a custom, **insecure authentication system** that relies on an in-memory user store. This approach is **not recommended for production environments** due to significant security risks and lack of data persistence.

## Key Technologies

*   **Language:** TypeScript (Frontend), JavaScript (Backend)
*   **Frontend:** Angular (with Signals)
*   **State Management:** NgRx Signal Store
*   **Backend:** Node.js with Express.js
*   **Data Storage:** JSON file (for backend)
*   **Authentication:** Custom (insecure) in-memory authentication
*   **Styling:** SCSS

## Project Structure

The project is now structured as follows:

*   `src/`: Contains the Angular frontend application.
    *   `app/`: Main application logic, components, services, guards, and NgRx store definitions.
    *   `environments/`: Environment-specific configurations.
*   `backend/`: Contains the Node.js backend API.
    *   `index.js`: The main Express.js application.
    *   `db.json`: The JSON file used for data persistence.

## Building and Running

### Frontend

The frontend is a standard Angular CLI application.

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

### Backend

The backend is a Node.js application.

*   **Prerequisites:**
    *   Node.js installed.

*   **Installation:**
    ```bash
    cd backend
    npm install
    ```

*   **Run Development Server:**
    ```bash
    cd backend
    npm start
    ```
    This command starts the Node.js backend server on `http://localhost:3000/`.

## Development Conventions

*   **Architecture:** Adheres to Angular best practices and NgRx Signal Store patterns for the frontend, and Express.js conventions for the backend.
*   **Styling:** The project uses plain SCSS for styling. No third-party styling frameworks like Tailwind CSS or Bootstrap are used.
*   **Code Style:** Consistent code style settings are maintained.
*   **Linting:** ESLint is used for code quality and consistency.
