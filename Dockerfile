FROM node:18-alpine

WORKDIR /app

# Install dependencies first for Docker caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server/server.js"]

