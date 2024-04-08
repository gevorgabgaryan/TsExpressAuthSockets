FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
