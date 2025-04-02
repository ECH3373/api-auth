FROM node:20.10.0
WORKDIR /departments

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY . .
EXPOSE 3000

CMD ["npm", "start"]