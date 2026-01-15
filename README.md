# Vink Shop

Modern e-commerce web application built with Next.js, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- 🛍️ Full e-commerce functionality
- 🛒 Shopping cart with side panel
- 💳 Checkout flow with purchase simulation
- 🎨 Beautiful UI with Shadcn UI components
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🏗️ Feature-based architecture
- ⚛️ Atomic Design pattern
- 🔄 Redux Toolkit for state management
- 🎯 TypeScript for type safety

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router
├── components/           # Atomic Design components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── ui/              # Shadcn UI components
├── features/            # Feature-based modules
│   ├── products/
│   ├── cart/
│   └── checkout/
├── redux/               # Redux store configuration
├── data/                # JSON data files
├── lib/                 # Utilities
└── hooks/               # Custom hooks
```

## Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Architecture

This project follows a **feature-based** architecture combined with **Atomic Design** principles:

- Each feature (products, cart, checkout) contains its own API, components, Redux logic, and types
- Components are organized by complexity: atoms → molecules → organisms → templates → pages
- Pages are thin wrappers that connect templates to Redux
- Clear separation of concerns for maintainability and scalability

## License

MIT
