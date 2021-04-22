FROM node:15.14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY dist dist
COPY ormconfig.js ormconfig.js

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
