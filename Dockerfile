# Socket Recorder
# Version: 1.0.0
# Author: Ethan

FROM jrottenberg/ffmpeg:4.4-alpine AS FFmpeg
FROM node:16-alpine
COPY --from=FFmpeg / /

ARG NODE_ENV=development
ENV NODE_ENV={NODE_ENV}

ENV LANG=C.UTF-8 \
  DEBIAN_FRONTEND=noninteractive

RUN apk update && apk upgrade && apk add --no-cache --update ca-certificates \
  tzdata \
  nodejs \
  npm

ENV TZ Asia/Tokyo
RUN ln -snf /usr/share/zoninfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm i -g pm2

WORKDIR /usr/src/recorder

RUN mkdir /usr/src/recorder/files

COPY package*.json ./

RUN npm i

COPY ./src ./src
COPY ./ssl ./ssl
COPY ./public ./public

CMD ["pm2-runtime", "src/server.js"]
