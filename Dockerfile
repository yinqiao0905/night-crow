FROM node:latest
LABEL authors="qqm-home"

WORKDIR /app
#COPY package*.json /data/app
COPY . .

#RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install

CMD ["npm","start"]
