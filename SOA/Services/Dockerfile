FROM node:15.14-alpine

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start"]
