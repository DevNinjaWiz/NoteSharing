# GEMINI.md

## Project Overview

This is an Angular web application built with TypeScript. Based on the file structure and configuration files (`angular.json`, `package.json`), it was generated using the Angular CLI. The project is set up with a standard Angular structure, including a root component (`app.ts`) and routing capabilities. The styling is configured to use SCSS.

**Key Technologies:**

*   **Framework:** Angular
*   **Language:** TypeScript
*   **Package Manager:** npm
*   **Testing:** Karma, Jasmine

## Building and Running

The following scripts are available in `package.json` to build, run, and test the application:

*   **Run development server:**
    ```bash
    npm start
    ```
    This will start a development server on `http://localhost:4200/`.

*   **Build for production:**
    ```bash
    npm run build
    ```
    This will build the application for production and output the artifacts to the `dist/` directory.

*   **Run unit tests:**
    ```bash
    npm test
    ```
    This will run the unit tests using the Karma test runner.

## Development Conventions

*   **Styling:** The project uses SCSS for styling, as indicated in `angular.json`.
*   **Code Style:** The `.editorconfig` file provides basic editor configuration for consistent whitespace and character encoding.
*   **Linting/Formatting:** While no explicit linting or formatting scripts are present in the `package.json` `scripts`, Angular projects typically use a linter. It's recommended to add a linting step to ensure code quality.
*   **Components:** New components are generated using the Angular CLI: `ng generate component <component-name>`.
