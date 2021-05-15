FROM node:15.14-alpine

WORKDIR /user/src/app

COPY package*.json ./

# swap these two when the necessary
# dependencies are moved to production 
# ###########################
RUN npm install --only=prod
# RUN npm install 

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start"]
