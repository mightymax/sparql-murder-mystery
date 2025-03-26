ARG PORT=3000
ARG ENV=production
ARG ORIGIN=http://localhost:3000
FROM node:lts as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:lts
ARG PORT
ARG ENV
LABEL SPARQL Murder Mystery | Web App
WORKDIR /app
COPY --from=build /app/build /app
COPY --from=build /app/package*.json /app
RUN npm ci --omit dev
EXPOSE $PORT
ENV NODE_ENV=${ENV}
ENTRYPOINT [ "node", "index.js"]

