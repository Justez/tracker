FROM node:8
WORKDIR /

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "app.js"]