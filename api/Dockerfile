# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ gcc libc-dev

COPY api/package.json api/pnpm-lock.yaml* ./

RUN corepack enable && \
    pnpm install --force --ignore-scripts && \
    pnpm rebuild @prisma/engines prisma better-sqlite3 esbuild msgpackr-extract protobufjs @google/genai

COPY api/ .

RUN pnpm exec prisma generate

RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache sqlite python3 make g++ gcc libc-dev

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./prisma.config.js


RUN mkdir -p /app/data

EXPOSE 8080
ENV DATABASE_URL=file:/app/data/production.db
ENV NODE_ENV=production
ENV OLLAMA_HOST=http://ollama:11434
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["sh", "-c", "./node_modules/.bin/prisma db push && node dist/index.js"]
