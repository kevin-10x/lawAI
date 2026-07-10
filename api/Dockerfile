FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
EXPOSE 8787
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "8787"]
