import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/teams', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const team = await prisma.team.create({
      data: {
        name,
        users: {
          connect: { id: userId }
        }
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { teamId: team.id }
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
