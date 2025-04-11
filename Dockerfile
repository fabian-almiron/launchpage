# Dockerfile for LaunchPage Builder
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and related files
COPY package*.json ./
COPY tailwind.config.js ./
COPY install.js ./
COPY LICENSE ./
COPY README.md ./

# Install dependencies with specific flags to avoid loops and increase verbosity
RUN npm install --no-fund --no-audit --verbose --loglevel=info

# Copy frontend directory
COPY frontend /app/frontend

# Make sure the dist directory exists
RUN mkdir -p /app/frontend/public/dist

# Build CSS with Tailwind
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]