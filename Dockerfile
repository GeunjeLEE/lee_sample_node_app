FROM node:12.16.1-alpine

COPY ./src /sample

WORKDIR /sample

RUN npm install forever -g

EXPOSE 3000
