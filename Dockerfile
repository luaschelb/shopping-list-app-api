# Multi-stage Dockerfile for shopping-list-app-api
# Builder stage: install deps, generate Prisma client, build TypeScript
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install system deps needed by prisma/node modules (if any)
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates build-essential python3 && rm -rf /var/lib/apt/lists/*

# Copy package manifests first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) to allow prisma and TypeScript build
RUN npm install --no-audit --no-fund

# Copy source
COPY . .

# Generate Prisma client (if you use Prisma schema) and build TS
# If your Prisma setup requires env vars during generate, make sure to pass them
RUN npx prisma generate || true
RUN npm run build

# Remove dev dependencies to shrink size
RUN npm prune --production


# Runtime stage: copy only production artifacts
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production node_modules, compiled code and prisma schema (if needed at runtime)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./package.json

# Expose the port the app listens on
EXPOSE 3000

# Use non-root user (optional but recommended). Create user and use it.
RUN useradd --user-group --create-home --shell /bin/false appuser || true
USER appuser

# Start the app
CMD ["node", "dist/server.js"]
