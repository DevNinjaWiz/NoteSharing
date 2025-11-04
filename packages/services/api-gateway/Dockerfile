FROM node:18-alpine

WORKDIR /usr/src/app

COPY node_modules ./node_modules
COPY dist/packages/services/api-gateway/main.js ./main.js

EXPOSE 3000

CMD ["node", "main.js"]