FROM --platform=linux/amd64 node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 80

CMD [ "node", "index.js" ]
