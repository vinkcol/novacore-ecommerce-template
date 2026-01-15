# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Architecture

**Vink Shop** is a Next.js 15 e-commerce application using the App Router, TypeScript, Redux Toolkit, and Tailwind CSS.

### Project Structure

The codebase follows **feature-based architecture** combined with **Atomic Design**:

- **`src/features/`** - Domain modules (products, cart, checkout), each containing:
  - `api/` - Data fetching functions
  - `redux/` - Slice, selectors, and thunks
  - `types/` - TypeScript interfaces

- **`src/components/`** - Atomic Design hierarchy:
  - `atoms/` - Basic building blocks (Image, Price)
  - `molecules/` - Combinations (ProductCard, CartItem, SearchBar, QuantitySelector)
  - `organisms/` - Complex sections (Header, Footer, ProductGrid, CartPanel)
  - `templates/` - Page layouts (ContentLayout)
  - `ui/` - Shadcn UI primitives (Button, Input, Card, Badge, Label)

- **`src/redux/`** - Store configuration with typed hooks (`useAppDispatch`, `useAppSelector`)

- **`src/app/`** - Next.js App Router pages (thin wrappers connecting templates to Redux)

- **`src/data/`** - JSON data files (products.json, shop-content.json)

### Path Aliases

Configured in tsconfig.json:
- `@/*` → `./src/*`
- `@/components/*`, `@/features/*`, `@/redux/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/data/*`

### Key Patterns

- **Redux State**: Three slices - `products`, `cart`, `checkout` (see `src/redux/rootReducer.ts`)
- **Cart Persistence**: Cart items saved to localStorage (`vink-cart` key)
- **Styling**: Tailwind with CSS variables for theming (HSL color system), dark mode support via class strategy
- **Forms**: React Hook Form with Zod validation
- **Utilities**: `cn()` for className merging (clsx + tailwind-merge) in `src/lib/utils.ts`

### Code Style

- Double quotes for strings
- Semicolons required
- ES5 trailing commas
- 2-space indentation
- 80 character print width
- Tailwind classes auto-sorted by prettier-plugin-tailwindcss
