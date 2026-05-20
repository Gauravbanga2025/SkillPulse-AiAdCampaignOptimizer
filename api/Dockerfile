# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install standard Linux native compilation tools for C++ bindings
RUN apk add --no-cache python3 make g++
RUN npm install -g pnpm

# Copy the specific API workspace dependencies manifests
COPY api/package.json api/pnpm-lock.yaml* ./

# Install matching client dependencies smoothly
RUN pnpm install

# Bring in backend source code files
COPY api/ .

# 🔑 THE CRITICAL FIXES inside Builder Stage:
# 1. Generate your production schema client engine
RUN npx prisma generate

# 2. Compile TypeScript into the target JavaScript 'dist/' directory
RUN pnpm run build

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

# Copy built production targets and node_modules directly from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

# The base container runtime entry point (Terraform will still run args ["npm", "run", "start"])
CMD ["pnpm", "start"]
