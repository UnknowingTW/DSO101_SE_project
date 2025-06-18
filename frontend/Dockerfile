FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Remove NODE_OPTIONS from the build script and run webpack directly
RUN sed -i 's/NODE_OPTIONS=--openssl-legacy-provider //g' package.json && npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]