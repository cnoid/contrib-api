FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# Uncomment the following line if you need the legacy OpenSSL provider
# ENV NODE_OPTIONS=--openssl-legacy-provider

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["npm", "start"]
