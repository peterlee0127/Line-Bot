FROM node:8-alpine
WORKDIR /usr/src/app

RUN apk add python
RUN apk add vips-dev fftw-dev build-base --update-cache \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/ \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/main

COPY . /usr/src/app
RUN npm install
RUN npm install pm2 -g
CMD export NODE_ENV=production
CMD export NODE_CLUSTER_SCHED_POLICY=rr
CMD node 
#CMD pm2 start --merge-logs --log-date-format="YYYY-MM-DD HH:mm Z" --cron "*/10 * * * *" -n lineBotImage getImage.js
#CMD node server.js
EXPOSE 8081
