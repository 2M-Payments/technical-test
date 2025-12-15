# Backend build stage
FROM node:20-alpine AS backend_build
WORKDIR /app

# Enable corepack to use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY backend/package.json backend/pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

COPY backend/. .
RUN pnpm run build

# Backend production stage
FROM node:20-alpine AS backend_prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=backend_build /app/dist ./dist
COPY --from=backend_build /app/package.json ./app/pnpm-lock.yaml ./

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

USER node
EXPOSE 8080
CMD ["node", "dist/server.js"]

# Frontend build stage
FROM node:20-alpine AS frontend_build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY frontend/ .
RUN pnpm run build

# Frontend production stage with nginx:WORKDIR name
FROM nginx:latest AS frontend_prod
COPY --from=frontend_build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
