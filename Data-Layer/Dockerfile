FROM node:12.22.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY dist dist
COPY ormconfig.json ormconfig.json

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
