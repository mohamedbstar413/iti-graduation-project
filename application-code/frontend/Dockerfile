# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build-time ENV
#ARG REACT_APP_API_URL
#ENV REACT_APP_API_URL=$REACT_APP_API_URL

#RUN npm run build
#
## Production stage
#FROM nginx:alpine
#COPY --from=builder /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]