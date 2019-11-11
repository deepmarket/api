# Taken from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/; see for documentation

FROM node
RUN mkdir -p /api
ENV MONGO_DATABASE_URL "mongodb://dm-mongo-0.dm-mongo-svc,dm-mongo-1.dm-mongo-svc,dm-mongo-2.dm-mongo-svc:27017/DeepShare?replicaSet=DmRS"
WORKDIR /api
COPY package.json /api
RUN npm install
COPY . /api
EXPOSE 8080
CMD ["npm", "start"]
