# -----------------------
# Build stage: React app
# -----------------------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy the rest of the app source
    COPY . .
    
    # Set environment variables for build (optional)
    ARG REACT_APP_API_URL
    ENV REACT_APP_API_URL=$REACT_APP_API_URL
    
    # Build the React app
    RUN npm run build
    
    # -----------------------
    # Production stage: Nginx
    # -----------------------
    FROM nginx:alpine
    
    # Copy React build output to Nginx html folder
    COPY --from=builder /app/build /usr/share/nginx/html
    
    
    # Expose port 80
    EXPOSE 80
    
    # Start Nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]
    