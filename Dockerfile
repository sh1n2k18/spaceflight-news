# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
# Copy package files
COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies for build)
RUN npm ci
# Copy source code
COPY . .
# Generate Panda CSS and build the app
RUN npm run build

# Production image
FROM base AS runner
# Set NODE_ENV
ENV NODE_ENV=production
# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

# Copy production dependencies
COPY --from=deps --chown=remix:nodejs /app/node_modules ./node_modules
# Copy built application
COPY --from=builder --chown=remix:nodejs /app/build ./build
COPY --from=builder --chown=remix:nodejs /app/public ./public
COPY --from=builder --chown=remix:nodejs /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Start the application
CMD ["npm", "start"]