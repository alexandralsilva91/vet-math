# Vet Math — Professional Veterinary Calculator

**Vet Math** is a production-ready, high-performance veterinary medical calculator built for small animal practitioners. Starting as an MVP for Canine and Feline calculations, it is architected from day one to scale into a commercial application and seamlessly migrate to React Native.

---

## 🛠️ Tech Stack & Design System

- **Frontend**: React (Vite, TypeScript, React 19)
- **Styling**: Modern Vanilla CSS with a customized dark mode design system (featuring glassmorphism, responsive grid architecture, and smooth micro-animations).
- **Database**: Local JSON-based structural data (fully decoupled for eventual cloud syncing).

---

## 🏗️ Architecture & React Native Compatibility

To maximize code sharing when we migrate this codebase to React Native for iOS/Android apps:

1. **Decoupled Business Logic**: All medical dosing, unit conversions, and calculations live in pure TypeScript files inside `src/logic` and `src/services`. They have zero dependency on browser-specific components, rendering elements, or web APIs.
2. **State-Based Screen Router**: Instead of using heavy web-only routers like `react-router-dom` (which breaks in mobile environments), the app is structured using clean screen-state context routing in React. When transitioning to React Native, we can simply drop in `React Navigation` without rewriting page orchestration.
3. **Structured Schema**: The database model is structured to easily allow the addition of new species (e.g., Exotic Pets) or clinical indicators without modifying the calculation engine.

---

## 📁 Directory Structure

```
vet-calculator/
├── src/
│   ├── assets/          # Static assets (logos, icons)
│   ├── components/      # Reusable UI components (Buttons, inputs, layout elements)
│   ├── database/        # JSON database definitions and initial data schemas
│   ├── logic/           # Core medical calculations (dose range, unit conversions, CRIs)
│   ├── screens/         # Page components (SpeciesSelect, CategorySelect, calculator forms)
│   ├── services/        # LocalStorage helpers, authentication layers, DB queries
│   ├── types/           # Global TypeScript interfaces
│   ├── App.tsx          # Main entry screen coordinator (state router)
│   ├── index.css        # Core design system tokens (colors, font variables)
│   └── main.tsx         # React root mounting script
├── .gitignore           # File exclusion configurations
├── package.json         # Scripts and dependencies
└── tsconfig.json        # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

### 3. Check Formatting & Lints

```bash
npm run lint    # Lints files using ESLint
npm run format  # Formats files using Prettier
```

### 4. Build for Production

```bash
npm run build
```
