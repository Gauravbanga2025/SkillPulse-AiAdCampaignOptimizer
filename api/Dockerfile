# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package configurations relative to the root project build context
COPY api/package.json ./

RUN corepack enable && \
    pnpm install --force --ignore-scripts && \
    pnpm rebuild @prisma/engines prisma better-sqlite3 esbuild msgpackr-extract protobufjs @google/genai

# 🔑 FIX 1: Copy everything inside the api directory straight into the working folder
COPY api/ .

# Generate Prisma Client and compile TypeScript
RUN pnpm exec prisma generate
RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache sqlite python3 make g++ gcc libc-dev

# Inherit pristine dependencies and built JavaScript outputs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /app/data

EXPOSE 8080

# 🔑 FIX 2: Streamlined environment definitions (Bypassing local Ollama)
ENV DATABASE_URL=file:/app/data/production.db
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["sh", "-c", "./node_modules/.bin/prisma db push && node dist/index.js"]
