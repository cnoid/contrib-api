FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# Set for legacy SSL issues
# ENV NODE_OPTIONS=--openssl-legacy-provider
# Uncomment to disable Node.js telemetry
# ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["npm", "start"]
