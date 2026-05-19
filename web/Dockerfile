# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# FIX: Copy the specific WEB workspace dependencies manifests
COPY web/package.json web/pnpm-lock.yaml* ./
COPY package-requirements.txt ./requirements.txt

# Installs correct frontend packages
RUN pnpm install

COPY web/ .

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app ./
EXPOSE 3000

CMD ["pnpm", "run", "dev"]
