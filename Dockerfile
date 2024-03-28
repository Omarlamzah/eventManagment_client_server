# Use a Node.js base image with the desired version
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Build the Electron application and create the DMG file
RUN npm run build

# Expose any ports the app is expecting
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
