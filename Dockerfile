FROM node:12-alpine as base

WORKDIR /build

# Install packages
COPY "package.json" "./"
RUN npm install

# Build the proejct
COPY . .
RUN npm run build

# Create the server
FROM nginx as server
WORKDIR /app
COPY --from=base /build/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080