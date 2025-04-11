# Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy the rest of the application code
COPY frontend /app/frontend
COPY backend /app/backend

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build Tailwind (optional step if using static output)
RUN cd frontend && npm run build

# Start the backend
CMD ["node", "backend/app.js"]