#!/bin/bash
set -e

echo "📦 Starting LaunchPage Backend..."

# Wait for database to be available (retry for up to 30 seconds)
echo "🔄 Waiting for database connection..."
MAX_RETRIES=30
RETRY_INTERVAL=1
count=0

while [ $count -lt $MAX_RETRIES ]; do
  if npx prisma db push --accept-data-loss &>/dev/null; then
    echo "✅ Database connected!"
    break
  fi
  echo "⏳ Waiting for database... (Attempt $((count+1))/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
  count=$((count+1))
done

if [ $count -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database after $MAX_RETRIES attempts."
  exit 1
fi

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Start the application
echo "🚀 Starting the application..."
exec node app.js 