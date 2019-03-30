FROM node:8

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . /server/

EXPOSE 8081

CMD ["node", "app.js"]

WORKDIR /