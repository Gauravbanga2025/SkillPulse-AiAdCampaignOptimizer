# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
# Install standard Linux native compilation tools for C++ bindings
RUN apk add --no-cache python3 make g++

RUN npm install -g pnpm

# Copy the specific API workspace dependencies manifests
COPY api/package.json api/pnpm-lock.yaml* ./
COPY package-requirements.txt ./requirements.txt

# This now installs matching v6.1.0 client engines smoothly
RUN pnpm install

# Bring in backend source code files
COPY api/ .

# Generate your production schema client
RUN npx prisma generate

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app ./
EXPOSE 8080

CMD ["pnpm", "run", "dev"]
