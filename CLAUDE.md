# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 web application called "Spaceflight News" that displays news articles from the Spaceflight News API. It's built with TypeScript, Vite, and uses Panda CSS for styling.

## Essential Commands

**Development:**
```bash
npm run dev          # Start development server with Panda CSS generation
npm run build        # Build for production
npm start           # Start production server
```

**Code Quality:**
```bash
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking
```

**Testing:**
```bash
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
npm run test:coverage  # Run tests with coverage
```

**Styling:**
```bash
npm run panda:codegen  # Generate Panda CSS code
```

## Architecture

**Tech Stack:**
- React Router v7 (React full-stack framework)
- TypeScript
- Vite (build tool)
- Panda CSS (CSS-in-JS styling)
- Vitest (testing)
- Radix UI components

**Key Directories:**
- `app/components/` - React components (ArticleCard, ArticlesList, SearchBar, etc.)
- `app/routes/` - React Router v7 file-based routes
- `app/services/` - API service layer for external data fetching
- `app/types/` - TypeScript interfaces and type definitions
- `app/hooks/` - Custom React hooks (useIntersectionObserver)
- `app/utils/` - Utility functions
- `test/` - Test files
- `styled-system/` - Generated Panda CSS files

**Entry Points:**
- `app/root.tsx` - Root component with layout and error boundaries
- `app/routes/_index.tsx` - Main page route with article listing
- `app/entry.client.tsx` & `app/entry.server.tsx` - Client/server entries

**Patterns Used:**
- Server-side rendering with React Router v7 loaders
- Component-based architecture with reusable UI components
- Service layer for API interactions
- Custom hooks for shared logic
- Comprehensive TypeScript typing
- Error boundaries for graceful error handling

## Important Notes

- The project uses **Panda CSS**, not Tailwind (despite old README mentioning Tailwind)
- Always run `panda cssgen` before building/developing (included in scripts)
- Uses Spaceflight News API v4 for data
- Implements search, filtering, and sorting functionality
- Includes comprehensive error handling and loading states
- Node.js >=20.0.0 required

## Deployment

**Build Process:**
```bash
npm run build  # Creates build/server and build/client directories
npm start      # Runs production server
```

**No Environment Variables Required** - uses public APIs only

**Deployment Options:**
- Vercel/Netlify for zero-config deployment
- Docker with Node.js 20 Alpine
- Railway/Fly.io for simple hosting
- Traditional Node.js server deployment

**Performance Features:**
- Server-side rendering with React Router v7
- Code splitting and tree shaking
- Optimized bundle size
- Gzip compression ready
- Lazy loading and performance optimizations built-in