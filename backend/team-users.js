import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/teams/:id/users', authMiddleware, async (req, res) => {
  const teamId = req.params.id;

  try {
    const users = await prisma.user.findMany({
      where: { teamId },
      select: {
        id: true,
        email: true,
        role: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { email: 'asc' }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
