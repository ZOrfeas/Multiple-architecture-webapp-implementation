FROM node:15.14-alpine

WORKDIR /user/src/app

#COPY package*.json ./

RUN npm install serve
COPY build build

#RUN npm install
#RUN npm install chokidar

#COPY . .

EXPOSE 5000

CMD ["npx", "serve", "-s", "build"]
#CMD ["npm", "run", "start"]
