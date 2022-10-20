FROM node:latest

WORKDIR /opt/nextapp

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

EXPOSE 3000

CMD ["yarn", "setup", "&&", "yarn", "dev"]
