FROM --platform=linux/amd64 node:16-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]