# Use the official Node.js LTS image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache for dependencies
COPY ./package.json /package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the entire project into the working directory
COPY ./ .

# Build the production-ready static files
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the default port Nginx listens on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
