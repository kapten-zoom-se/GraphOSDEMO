FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . ./

ENV PORT=4003
EXPOSE 4003

CMD ["npm", "start"]