# Project Context: Teslo Shop (Frontend)

## Overview
This is the frontend application for **Teslo Shop**, built with **Angular 19**. It is an e-commerce platform that includes authentication, an administration dashboard, and a public store interface.

## Tech Stack
- **Framework:** Angular 19
- **Styling:** Tailwind CSS, DaisyUI (configured with "night" theme)
- **Language:** TypeScript
- **State Management & Async:** RxJS
- **Build Tool:** Angular CLI (Webpack/Esbuild underlying)

## Architecture
The application follows a modular architecture with lazy loading:

### Core Modules (Lazy Loaded)
1.  **Auth (`/auth`):** Handles user login and registration.
    -   *Guards:* `NotAuthenticatedGuard` (prevents authenticated users from visiting login/register).
2.  **Admin (`/admin`):** Dashboard for managing products and other administrative tasks.
3.  **Store (`/`):** The main public-facing shopping experience.

### Key Configuration
-   **Routing:** Uses `HashLocationStrategy` (`useHash: true`).
-   **HTTP:** Configured with `provideHttpClient` and `withFetch`.
-   **Interceptors:**
    -   `AuthInterceptor`: Likely attaches tokens to outgoing requests.
    -   `LoggingInterceptor`: Logs HTTP activity.
-   **Environment:** Connects to a backend API (currently pointing to `https://nest-teslo-shop-4ifl.onrender.com/api`).

## Development & Usage

### Prerequisites
-   Node.js (Latest LTS recommended)
-   NPM

### Key Commands
| Command | Description |
| :--- | :--- |
| `npm start` / `ng serve` | Starts the development server at `http://localhost:4200/`. |
| `npm run build` / `ng build` | Builds the application for production to the `dist/` directory. |
| `npm test` / `ng test` | Runs unit tests via Karma. |
| `npm run watch` | Builds the application in watch mode. |

### Directory Structure Highlights
-   `src/app/auth`: Authentication logic, pages, and guards.
-   `src/app/admin-dashboard`: Admin features.
-   `src/app/store`: Public store pages (Home, Product, Cart).
-   `src/app/shared`: Reusable components, pipes, and directives.
-   `src/environments`: Environment configuration files.

## Conventions
-   **Styling:** Utility-first CSS using Tailwind. Custom animations defined in `tailwind.config.js`.
-   **Components:** Standalone components (implied by Angular 17+ defaults and project structure).
-   **Code Style:** Standard Angular coding guidelines.
