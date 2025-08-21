# 🚀 Spaceflight News

A modern React/Remix web application that displays the latest spaceflight news, mission updates, and space exploration stories from around the world.

## ✨ Features

- **Real-time Search** - Filter articles by title with instant results
- **Smart Sorting** - Sort by date (newest first) or alphabetically by title
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessibility First** - Full keyboard navigation, screen reader support, and WCAG compliance
- **Performance Optimized** - Lazy loading, intersection observer, and scroll optimization
- **Error Handling** - Comprehensive error boundaries and graceful fallbacks
- **Server-Side Rendering** - Fast initial loads with SER support

## 🛠 Tech Stack

- **Framework**: [Remix](https://remix.run/) (React-based full-stack framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Panda CSS](https://panda-css.com/) (CSS-in-JS)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd spaceflight-news
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Code Quality

```bash
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking
```

### Testing

```bash
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
npm run test:coverage  # Run tests with coverage report
```

### Styling

```bash
npm run panda:codegen  # Generate Panda CSS code
```

## 🏗 Project Structure

```
spaceflight-news/
├── app/
│   ├── components/          # React components
│   │   ├── ArticleCard.tsx
│   │   ├── ArticlesList.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   └── useIntersectionObserver.ts
│   ├── routes/             # Remix routes (file-based routing)
│   │   └── _index.tsx
│   ├── services/           # API service layer
│   │   └── spaceflight-api.ts
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── root.tsx            # Root component
├── test/                   # Test files
├── public/                 # Static assets
└── styled-system/          # Generated Panda CSS
```

## 🎯 Key Features Implementation

### Search & Filtering

- Real-time search with debounced input
- Case-insensitive title filtering
- Clear search functionality
- Maintains search state during sorting

### Sorting

- Sort by publication date (newest first)
- Sort alphabetically by title
- Toggle between sort modes
- Persistent sort preference

### Accessibility

- **WCAG 2.1 AA Compliant**
- Screen reader optimized
- Full keyboard navigation
- Skip navigation links
- High contrast mode support
- Reduced motion preferences
- Semantic HTML structure

### Performance

- Lazy image loading with intersection observer
- Responsive grid layout
- Optimized animations and transitions
- Hardware acceleration for smooth animations
- Optimized bundle size

## 🌐 API Integration

The application uses the [Spaceflight News API v4](https://api.spaceflightnewsapi.net/v4/docs/) to fetch articles.

### Error Handling

- Network failure recovery
- API rate limiting handling
- Graceful degradation
- User-friendly error messages
- Retry mechanisms

## 🧪 Testing

Comprehensive test suite with 190+ tests covering:

- **Unit Tests** - Components, hooks, utilities
- **Integration Tests** - User workflows, API interactions
- **Accessibility Tests** - ARIA attributes, keyboard navigation
- **Error Handling Tests** - Error boundaries, API failures

Run tests:

```bash
npm test                    # Watch mode
npm run test:run           # Single run
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates:

- `build/server` - Server-side code
- `build/client` - Client-side assets

### Environment Variables

No environment variables required - the app uses public APIs.

### Deployment Options

1. **Node.js Server**

   ```bash
   npm run build
   npm start
   ```

2. **Docker** (create Dockerfile):

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **Platform Deployments**
   - [Vercel](https://vercel.com/) - Zero config deployment
   - [Netlify](https://netlify.com/) - Automatic builds
   - [Railway](https://railway.app/) - Simple Node.js hosting
   - [Fly.io](https://fly.io/) - Global deployment

### Performance Optimization

The build is optimized for production with:

- Code splitting
- Asset optimization
- CSS minification
- Tree shaking
- Gzip compression ready

## 🔧 Configuration

### Panda CSS Configuration

The styling system is configured in `panda.config.ts`:

- Custom design tokens
- Responsive breakpoints
- Component presets
- Utility generation

### TypeScript Configuration

Strict TypeScript setup with:

- Path aliases (`~/` for app directory)
- Strict type checking
- Modern ES modules
- JSX support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/docs/)
- [Remix Documentation](https://remix.run/docs)
- [Panda CSS Documentation](https://panda-css.com/)
- [Vitest Documentation](https://vitest.dev/)
