FROM node:24-trixie-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build
RUN npm prune --omit=dev

FROM node:24-trixie-slim AS runtime
ARG PORT=3000
ARG ENV=production
LABEL description="SPARQL Murder Mystery | Web App"
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE $PORT
ENV NODE_ENV=${ENV}
ENV PORT=${PORT}
ENV HOST=0.0.0.0
ENTRYPOINT ["node", "build/index.js"]
