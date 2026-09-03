FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . ./

ENV PORT=4001
EXPOSE 4001

CMD ["npm", "start"]