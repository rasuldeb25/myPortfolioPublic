# --- Stage 1: Build the React App ---
FROM node:18-alpine as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (we will create this in Step 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime config script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

# Expose port 80 (standard web port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]