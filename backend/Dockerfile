# Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Укажем порт, который слушает Express
ENV PORT=5001

# Исправленный путь:
CMD ["node", "src/server.js"]