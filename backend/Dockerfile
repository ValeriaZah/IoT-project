# Используем Node.js v18
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшиеся файлы
COPY . .

# Указываем порт, который слушает сервер (важно для Render)
EXPOSE 5001

# Стартуем сервер
CMD ["node", "src/server.js"]