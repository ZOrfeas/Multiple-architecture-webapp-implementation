FROM node:15.14-alpine

WORKDIR /user/src/app

COPY build build

RUN npm install -g serve

EXPOSE 5000

CMD ["npx", "serve", "-s", "build"]