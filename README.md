# Note Sharing Application

This project is a frontend-only Angular application that uses Firebase for backend services.

## Getting Started

### 1. Prerequisites

- Make sure you have Node.js and the Angular CLI installed.

### 2. Firebase Configuration

This project uses Firebase for its backend services. Your Firebase project credentials are required for the application to function.

**Important:** For security reasons, your Firebase credentials should **never** be committed to version control.

**Setup Steps:**

1.  **Create `.env` file (Optional, for local management):**
    You can create a `.env` file in the root of your project to store your Firebase credentials locally. A `.env.example` file is provided for reference. This file is ignored by Git.

    ```
    FIREBASE_API_KEY="YOUR_API_KEY"
    FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    FIREBASE_APP_ID="YOUR_APP_ID"
    ```

2.  **Populate `src/environments/environment.ts` and `src/environments/environment.prod.ts`:**
    The Angular application directly reads its Firebase configuration from these files. You must manually populate the `firebase` object within these files with your actual Firebase credentials.

    **Example `src/environments/environment.ts`:**

    ```typescript
    export const environment = {
      production: false,
      firebase: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      }
    };
    ```
    Ensure you replace `"YOUR_API_KEY"`, etc., with your actual values. Do the same for `environment.prod.ts` for production builds.

### 3. Installation

Install the project dependencies:

```bash
npm install
```

### 4. Development Server

To start the development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Building the Project

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Code scaffolding

To generate a new component, run:
```bash
ng generate component component-name
```
You can also use `ng generate` for `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, and `module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## 🚨 Security Warning 🚨

This project has been configured to use a **custom, insecure authentication system** for demonstration purposes, as requested. It does **not** use the recommended Firebase Authentication service.

To make this custom login system work, you must configure your Firestore security rules to be open, which is **extremely dangerous** and should never be done in a real application.

**Required Insecure Firestore Rules:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // This allows anyone to read and write to your entire database.
    // Only use this for this specific POC and with test data.
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

By using these rules, you are making your database publicly accessible. Anyone can read, write, or delete your data.