# Use an official node image as the base image
FROM node:14

# Set the working directory to /src
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the port your application runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]
