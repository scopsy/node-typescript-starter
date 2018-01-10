FROM node:8.9.3-alpine

COPY . /www
WORKDIR /www

ENV NODE_ENV production
RUN npm install --production
RUN npm run build

CMD ["npm","start"]

EXPOSE 8888