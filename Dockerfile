# Multi-stage Dockerfile for Vite (React + TypeScript)
# Builder: installs dev deps, runs TypeScript build and Vite build
# Runner: lightweight nginx serving the built `dist` with SPA fallback

FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools (prefer npm ci if package-lock.json is present)
COPY package*.json ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .
RUN npm run build


# Runtime image: serve static files with nginx and enable SPA fallback
FROM nginx:alpine AS runner

# Replace default nginx config with simple SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
