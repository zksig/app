FROM node:latest

WORKDIR /opt/nextapp

COPY scripts ./
COPY package*.json ./
COPY yarn.lock ./

RUN yarn config set network-timeout 600000 
RUN yarn

EXPOSE 3000

ENTRYPOINT ./scripts/start.sh
