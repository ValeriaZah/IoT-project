# Stage 1: Build frontend
FROM node:18 AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# Stage 2: Build backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
COPY --from=build-frontend /app/frontend/build ./frontend/build
CMD ["node", "src/server.js"]