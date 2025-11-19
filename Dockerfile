# Multi-stage build for AI Tarot Decision Assistant

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY src/frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY src/frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Setup Backend
FROM node:18-alpine AS backend-setup

WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy backend source
COPY src/backend/ ./src/backend/
COPY src/shared/ ./src/shared/

# Stage 3: Production Image
FROM node:18-alpine

WORKDIR /app

# Copy backend from backend-setup
COPY --from=backend-setup /app/node_modules ./node_modules
COPY --from=backend-setup /app/src ./src
COPY --from=backend-setup /app/package*.json ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./public

# Create data directory for JSON storage (fallback if no persistent disk)
RUN mkdir -p /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=4000
ENV DATA_DIR=/data

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Start server
CMD ["node", "src/backend/index-json.js"]
