# docker run --run -d -p 9999:9999 rrr/api
FROM node:12.16.2-alpine3.11
COPY . /usr/src/telegram
EXPOSE 3000
WORKDIR /usr/src/telegram
CMD ["sh", "start.sh"]
