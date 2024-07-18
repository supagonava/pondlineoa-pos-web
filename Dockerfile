# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

COPY . .

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY .env.local .env.local

# Install dependencies
RUN yarn install

# Build the Next.js application
RUN yarn build
RUN yarn install serve

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist"]
