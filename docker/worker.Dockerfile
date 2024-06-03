# a pseudo dockerfile, has not been tested yet
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs --save-dev
COPY . .
RUN npx rollup --config rollup.config.js

FROM node:18
WORKDIR /app
RUN npm install workerd@beta
COPY --from=build-stage /app/index.js ./
COPY config.capnp ./

EXPOSE 8080
CMD ["./node_modules/.bin/workerd", "serve", "config.capnp"]
