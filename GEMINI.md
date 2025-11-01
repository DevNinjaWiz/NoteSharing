# GEMINI.md

## Project Overview

This document outlines the architecture and development guidelines for the "Notes Sharing Platform," a full-stack application built within an Nx-managed TypeScript monorepo. The platform is designed to be a secure, maintainable, and user-friendly web application that allows users to create, manage, and securely share personal notes.

The frontend is a modern Angular application, and the backend is a robust, microservice-based system powered by Node.js, Express, and MongoDB. An API Gateway serves as the single entry point for the frontend, routing requests to the appropriate backend services.

## Key Technologies

*   **Monorepo:** Nx
*   **Language:** TypeScript
*   **Frontend:** Angular (with Signals)
*   **Backend:** Node.js, Express
*   **Database:** MongoDB (with Mongoose)
*   **Architecture:** Microservices, 5-Layer Clean Architecture, SOLID Principles
*   **Containerization:** Docker, Docker Compose
*   **Styling:** SCSS

## Project Structure

The project is organized as an Nx monorepo with the following structure:

*   `apps/`: Contains the main applications.
    *   `org/`: The Angular frontend application.
*   `packages/`: Contains the backend microservices and shared libraries.
    *   `services/api-gateway/`: The API Gateway (Node.js/Express).
    *   `services/auth-service/`: The Authentication Service (Node.js/Express).
    *   `services/notes-service/`: The Notes Service (Node.js/Express).
    *   `services/sharing-service/`: The Sharing Service (Node.js/Express).
    *   `shared/`: Shared TypeScript code (DTOs, interfaces, etc.) used across the monorepo.

## Backend Microservices

The backend is composed of several independent microservices, each with a single responsibility:

*   **API Gateway (`api-gateway`):** A dedicated Node.js/Express application that serves as the single entry point for the Angular frontend. It handles request routing, aggregation, and cross-cutting concerns like JWT validation.
*   **Authentication Service (`auth-service`):** Responsible for all user identity and authentication logic, including user registration and login.
*   **Notes Service (`notes-service`):** Responsible for all personal note management, including all CRUD (Create, Read, Update, Delete) operations.
*   **Sharing Service (`sharing-service`):** Responsible for managing the logic of sharing and accessing shared notes.

## Building and Running

The development environment is managed using Docker and Docker Compose to replicate the production setup locally.

*   **Run Backend:**
    ```bash
    docker-compose up --build
    ```
    This command builds the images for all microservices, starts a container for each, and starts the MongoDB container. The entire backend will be running, with the API Gateway exposed on `http://localhost:3000`.

*   **Run Frontend:**
    ```bash
    nx serve org
    ```
    This will start the Angular development server on `http://localhost:4200/`. The application is configured to send all API requests to the API Gateway.

## Development Conventions

*   **Architecture:** All code should strictly adhere to SOLID principles, Object-Oriented Programming (OOP) concepts, and the 5-Layer Clean Architecture model for maximum maintainability, testability, and scalability.
*   **Styling:** The project uses plain SCSS for styling. No third-party styling frameworks like Tailwind CSS or Bootstrap are used.
*   **Code Style:** The `.editorconfig` and `.prettierrc` files provide consistent code style settings.
*   **Linting:** The project uses ESLint for code quality and consistency.