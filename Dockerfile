FROM node:25-alpine AS build
WORKDIR /app

COPY backend/package*.json ./
RUN npm install
COPY backend/. .
RUN npm run build

FROM node:25-alpine AS prod
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev
EXPOSE 3001
CMD ["node", "dist/server.js"]


FROM node:20 AS frontend_builder
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

FROM node:23-slim AS frontend
RUN npm install -g serve
COPY --from=frontend_builder /frontend/dist /app/dist
EXPOSE 5173
CMD ["serve", "-s", "/app/dist", "-l", "5173"]
