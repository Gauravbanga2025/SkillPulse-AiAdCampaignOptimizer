# ==========================================
# web/Dockerfile — FIXED PRODUCTION BUILD
# ==========================================

# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy dependency manifests first (layer caching)
COPY web/package.json web/pnpm-lock.yaml* ./
COPY package-requirements.txt ./requirements.txt

# Install all dependencies (including devDependencies needed for build)
RUN pnpm install

# Copy source code
COPY web/ .

# 🔑 FIX: Build the Next.js app for production
RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

# Copy the full built output from builder
COPY --from=builder /app ./

EXPOSE 3000

# 🔑 FIX: Run the production server, NOT the dev server
CMD ["pnpm", "run", "start"]
