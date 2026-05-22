# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package files
COPY api/package.json ./
COPY api/pnpm-lock.yaml* ./

# Create .npmrc to enable build scripts
RUN echo "enable-pre-post-scripts=true" > /root/.npmrc && \
    echo "script-shell=/bin/sh" >> /root/.npmrc

# Install dependencies
RUN corepack enable && \
    pnpm install --no-frozen-lockfile

COPY api/ .

# Generate Prisma client
RUN pnpm exec prisma generate

# Build the application
RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:22-alpine
WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache sqlite libc6-compat

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Create data directory for SQLite database
RUN mkdir -p /app/data

EXPOSE 8080

ENV DATABASE_URL=file:/app/data/production.db
ENV NODE_ENV=production
ENV OLLAMA_HOST=http://ollama:11434
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["node", "dist/index.js"]
