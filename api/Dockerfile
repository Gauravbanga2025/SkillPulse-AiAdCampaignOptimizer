# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package files
COPY api/package.json api/pnpm-lock.yaml* ./

# Enable pnpm and allow required packages to build
RUN corepack enable && \
    pnpm config set onlyBuiltDependencies "better-sqlite3 prisma @prisma/engines esbuild msgpackr-extract protobufjs @google/genai" && \
    pnpm install --force

# Copy source code
COPY api/ .

# Generate Prisma client
RUN pnpm exec prisma generate

# Build TypeScript
RUN pnpm run build


# --- Production Runtime Stage ---
FROM node:22-alpine
WORKDIR /app

# Runtime dependencies
RUN apk add --no-cache sqlite python3 make g++ gcc libc-dev

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./prisma.config.js

# Rebuild native module for runtime
RUN npm rebuild better-sqlite3 --prefix /app

RUN mkdir -p /app/data

EXPOSE 8080

ENV DATABASE_URL=file:/app/data/production.db
ENV NODE_ENV=production
ENV OLLAMA_HOST=http://ollama:11434
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
