# Используем официальный Node.js образ
FROM node:18

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Открываем порт (если нужен)
EXPOSE 5001

# Запуск приложения
CMD ["node", "server.js"]