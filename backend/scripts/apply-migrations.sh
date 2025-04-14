#!/bin/bash

echo "Waiting for database to become available..."
# Wait for database to be available
MAX_RETRIES=30
RETRY_INTERVAL=5
count=0

while [ $count -lt $MAX_RETRIES ]; do
  npx prisma db push --preview-feature 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "Database connected successfully!"
    break
  fi
  echo "Waiting for database connection... (Attempt $((count+1))/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
  count=$((count+1))
done

if [ $count -eq $MAX_RETRIES ]; then
  echo "Failed to connect to database after $MAX_RETRIES attempts."
  exit 1
fi

# Apply the migration
echo "Applying Domain model migration..."
npx prisma migrate dev --name add_domains_model

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Migration completed successfully." 