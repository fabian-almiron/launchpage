import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { sendInviteEmail } from './email.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/teams/:id/magic-invite', async (req, res) => {
  const { email } = req.body;
  const teamId = req.params.id;

  try {
    const token = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const invite = await prisma.inviteToken.create({
      data: {
        email,
        teamId,
        token,
        expiresAt: expires
      }
    });

    const inviteLink = `${process.env.FRONTEND_URL}/magic-login.html?token=${token}`;
    await sendInviteEmail(email, "Your team", inviteLink);

    res.json({ message: 'Magic invite sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/magic-login', async (req, res) => {
  const { token } = req.body;
  try {
    const invite = await prisma.inviteToken.findUnique({ where: { token } });
    if (!invite || invite.status !== 'pending' || new Date() > invite.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    let user = await prisma.user.findUnique({ where: { email: invite.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: invite.email,
          password: '',
          role: 'member',
          teamId: invite.teamId
        }
      });
    } else {
      await prisma.user.update({
        where: { email: invite.email },
        data: {
          teamId: invite.teamId,
          role: 'member'
        }
      });
    }

    await prisma.inviteToken.update({
      where: { token },
      data: { status: 'used' }
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    const authToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token: authToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
