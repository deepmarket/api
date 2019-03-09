# See https://nodejs.org/en/docs/guides/nodejs-docker-webapp/ for documentation on containerizing node apps

FROM node:8

RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 8080
ENV MONGO_DATABASE_URL "mongodb://10.0.0.64:27017/DeepShare"
#RUN [ "npm", "start" ]