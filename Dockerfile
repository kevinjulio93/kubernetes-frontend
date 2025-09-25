# Multi-stage Dockerfile for Vite + React + TypeScript
# Using Red Hat official images from registry.access.redhat.com

# Build Arguments for base images
ARG NODE_IMAGE=registry.access.redhat.com/ubi8/nodejs-16
ARG NGINX_IMAGE=registry.access.redhat.com/ubi8/nginx-120

# Builder stage
FROM ${NODE_IMAGE} AS builder
USER 0
WORKDIR /opt/app-root/src

# Install ALL dependencies (including devDependencies)
COPY --chown=1001:0 package*.json ./
RUN npm ci --silent --include=dev || npm install --silent

# Copy source files and configs
COPY --chown=1001:0 tsconfig*.json ./
COPY --chown=1001:0 vite.config.ts ./
COPY --chown=1001:0 src/ ./src/
COPY --chown=1001:0 public/ ./public/

# Ensure proper permissions and run build
RUN chown -R 1001:0 /opt/app-root/src && \
    chmod -R g+w /opt/app-root/src

USER 1001
RUN npm run build

# Runner stage
FROM ${NGINX_IMAGE}
USER 0

# Replace default nginx config
COPY --chown=1001:0 nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --chown=1001:0 --from=builder /opt/app-root/src/dist /usr/share/nginx/html

# Set correct permissions
RUN chown -R 1001:0 /usr/share/nginx/html && \
    chmod -R g+w /usr/share/nginx/html && \
    chown -R 1001:0 /var/log/nginx && \
    chown -R 1001:0 /var/lib/nginx && \
    chmod -R g+w /var/lib/nginx && \
    chmod -R g+w /var/log/nginx

# Switch back to non-root user
USER 1001

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
