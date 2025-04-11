# To finish Prisma setup in your backend, run:
cd backend
npm install prisma @prisma/client
npx prisma generate
npx prisma migrate dev --name init
