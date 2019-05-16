# Taken from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/; see for documentation

FROM node:8

RUN mkdir -p /api

ENV MONGO_DATABASE_URL "mongodb://mongo:27017/DeepShare"

WORKDIR /api

COPY package.json /api

RUN npm install

COPY . /api

EXPOSE 8080

CMD ["npm", "start"]
#ENV MONGO_DATABASE_URL "mongodb://10.0.0.64:27017/DeepShare"
