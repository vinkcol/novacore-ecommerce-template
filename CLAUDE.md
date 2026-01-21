# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (http://localhost:3002)
npm run build    # Production build
npm run start    # Start production server (port 3002)
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Architecture

**Foodie** is a Next.js 15 e-commerce application using the App Router, TypeScript, Redux Toolkit with Redux Saga, and Tailwind CSS. Firebase provides the backend (Firestore, Auth, Storage).

### Project Structure

The codebase follows **feature-based architecture** combined with **Atomic Design**:

- **`src/features/`** - Domain modules, each containing:
  - `redux/` - Slice, selectors, sagas, and thunks
  - `types/` - TypeScript interfaces
  - `components/` - Feature-specific components
  - Features: admin, auth, cart, categories, checkout, collections, configuration, orders, products, reports

- **`src/components/`** - Atomic Design hierarchy:
  - `atoms/` - Basic building blocks
  - `molecules/` - Combinations (ProductCard, CartItem, SearchBar)
  - `organisms/` - Complex sections (Header, Footer, ProductGrid)
  - `templates/` - Page layouts
  - `ui/` - Shadcn UI primitives

- **`src/redux/`** - Store configuration with Redux Saga middleware (`rootSaga.ts`, `rootReducer.ts`)

- **`src/lib/firebase/`** - Firebase configuration (Firestore, Auth, Storage)

- **`src/config/env.ts`** - Environment variables (Firebase config via `NEXT_PUBLIC_FIREBASE_*`)

### Key Patterns

- **Redux + Saga**: Slices for state, Sagas for async side effects. Use typed hooks: `useAppDispatch`, `useAppSelector`
- **Firebase Singleton**: `src/lib/firebase/config.ts` exports `db`, `auth`, `storage`
- **Styling**: Tailwind with CSS variables (HSL), dark mode via class strategy
- **Forms**: React Hook Form + Zod, or Formik + Yup
- **Utilities**: `cn()` for className merging, `formatPrice()` for COP currency in `src/lib/utils.ts`
- **Constants**: App-wide constants in `src/lib/constants.ts` (CURRENCY, LOCALE, ROUTES)

### Code Style

- Double quotes, semicolons required
- ES5 trailing commas, 2-space indentation, 80 char width
- Tailwind classes auto-sorted by prettier-plugin-tailwindcss
