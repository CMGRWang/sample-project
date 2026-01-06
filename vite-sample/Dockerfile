FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite 預設跑在 5173
EXPOSE 5173
# 使用 --host 讓 Docker 外面可以存取
CMD ["npm", "run", "dev", "--", "--host"]