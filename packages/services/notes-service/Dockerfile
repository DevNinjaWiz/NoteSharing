FROM node:18-alpine

WORKDIR /usr/src/app

COPY node_modules ./node_modules
COPY dist/packages/services/notes-service/main.js ./main.js

EXPOSE 3001

CMD ["node", "main.js"]