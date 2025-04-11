import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';
import { sendInviteEmail } from './email.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/teams/:id/invite', authMiddleware, async (req, res) => {
  const teamId = req.params.id;
  const { email } = req.body;

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const invite = await prisma.teamInvite.create({
      data: {
        email,
        teamId
      }
    });

    await sendInviteEmail(email, team.name);

    res.status(201).json({ message: 'Invite sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
