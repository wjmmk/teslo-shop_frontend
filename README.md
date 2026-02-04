# 🚀 Teslo Shop (Frontend)

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4.12-515ada?style=for-the-badge&logo=daisyui)](https://daisyui.com/)

**Teslo Shop** is a modern, high-performance e-commerce platform built with **Angular 19**. It provides a complete shopping experience, featuring a public store, a dedicated administration dashboard, and robust authentication.

---

## 📸 Demo
![Project Preview](https://github.com/wjmmk/teslo-shop_frontend/blob/main/src/assets/images/View.png)

---

## ✨ Features

### 🛒 Storefront
- **Dynamic Product Catalog:** Browse products with real-time updates.
- **Advanced Filtering:** Filter products by category and gender.
- **Interactive Search:** Quickly find products with the integrated search bar.
- **Shopping Cart:** Manage items seamlessly with persistent state.
- **Product Details:** Detailed views with interactive carousels and size selection.

### 🔐 Authentication
- **Secure Login & Registration:** Full authentication flow with JWT support.
- **Protected Routes:** Advanced guards to ensure only authorized users access specific areas.
- **Auto-Login:** Session persistence for a better user experience.

### 🛠️ Admin Dashboard
- **Product Management:** Full CRUD operations for the product inventory.
- **Inventory Control:** Monitor stock levels and manage product metadata.
- **Role-Based Access:** Protected by administrative guards.

### 🤖 Smart Components
- **AI Chat Assistant:** Integrated support powered by Gemini for real-time assistance.

---

## 🛠️ Tech Stack

- **Framework:** [Angular 19](https://angular.dev/)
- **State Management:** RxJS (Reactive Programming)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) (Night Theme)
- **Routing:** Lazy loading with `HashLocationStrategy`.
- **HTTP Client:** Angular `provideHttpClient` with Interceptors (Auth, Logging).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/wjmmk/teslo-shop_frontend.git
   ```
2. Navigate to the project folder:
   ```bash
   cd teslo-shop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

---

## 📁 Project Structure

```
src/app/
├── admin-dashboard/  # Admin management features
├── auth/             # Login, register, and auth guards
├── products/         # Product components and services
├── shared/           # Reusable components, pipes, and interceptors
├── store/            # Public store layouts and pages
└── Utils/            # Helper functions
```

---

## 📄 Notes
This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3 and has been updated to Angular 19.