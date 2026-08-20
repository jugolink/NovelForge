# Stage 1: Build the frontend web assets
FROM node:20 AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies, bypassing electron/electron-builder post-install issues
RUN npm install --ignore-scripts

# Copy the rest of the frontend source code
COPY . .

# Build the web assets (outputs to /app/dist as per vite config)
RUN npm run build --ignore-scripts

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
