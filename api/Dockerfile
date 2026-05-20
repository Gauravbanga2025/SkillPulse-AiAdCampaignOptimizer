# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package files
COPY api/package.json api/pnpm-lock.yaml* ./

# Install deps, then rebuild native/generated packages
RUN corepack enable && \
    pnpm install --force --ignore-scripts && \
    pnpm rebuild @prisma/engines prisma better-sqlite3 esbuild msgpackr-extract protobufjs @google/genai

COPY api/ .

# Generate Prisma client before building
RUN pnpm exec prisma generate

# Build the application
RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:22-alpine
WORKDIR /app

# sqlite + build tools needed to run the native better-sqlite3 binary
RUN apk add --no-cache sqlite python3 make g++ gcc libc-dev

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./prisma.config.js
# Rebuild better-sqlite3 native binary for this exact runtime environment
RUN npm rebuild better-sqlite3 --prefix /app

RUN mkdir -p /app/data

EXPOSE 8080
ENV DATABASE_URL=file:/app/data/production.db
ENV NODE_ENV=production
ENV OLLAMA_HOST=http://ollama:11434
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
