FROM node:18-alpine

WORKDIR /usr/src/app

COPY dist/packages/services/auth-service/main.js ./main.js

EXPOSE 3001

CMD ["node", "main.js"]
