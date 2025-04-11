import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/teams/:teamId/users/:userId/role', authMiddleware, async (req, res) => {
  const { role } = req.body;
  const { teamId, userId } = req.params;

  const allowedRoles = ['admin', 'member', 'viewer'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.teamId !== teamId) {
      return res.status(404).json({ error: 'User not found in this team' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ message: 'Role updated', user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
