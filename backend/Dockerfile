# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Render запускает этот файл как стартовый
CMD ["node", "src/server.js"]