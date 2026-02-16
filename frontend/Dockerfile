# Stage 1 — Build
FROM node:24-slim AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json .
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2 — Serve
FROM nginx:alpine

# Copy built files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]