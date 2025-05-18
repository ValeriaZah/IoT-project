# Dockerfile

# 1. Базовый образ
FROM node:18

# 2. Установка рабочей директории
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь исходный код
COPY . .

# 6. Указываем порт (Render по умолчанию использует 10000+)
ENV PORT=5001

# 7. Запуск
CMD ["npm", "start"]