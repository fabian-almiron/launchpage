FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install OpenSSL libraries for ARM64 compatibility
RUN apk add --no-cache openssl

RUN npm install

COPY . .

# Generate Prisma client first
RUN npx prisma generate

# Set executable permission on entrypoint script
RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3001

# Use entrypoint script instead of direct command
ENTRYPOINT ["./scripts/docker-entrypoint.sh"] 