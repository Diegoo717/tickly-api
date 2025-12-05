# ====================================
# Stage 1: Builder
# ====================================
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ====================================
# Stage 2: Production
# ====================================
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-3000}/api || exit 1

CMD ["node", "dist/main"]