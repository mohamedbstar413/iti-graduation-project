FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apk update
RUN apk add --no-cache mysql-client


EXPOSE 5000
CMD ["node", "app.js"]