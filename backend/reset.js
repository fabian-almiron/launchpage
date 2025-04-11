import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { sendInviteEmail } from './email.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.inviteToken.create({
      data: {
        email,
        teamId: user.teamId ?? '',
        token,
        status: 'password_reset',
        expiresAt
      }
    });

    const link = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;
    await sendInviteEmail(email, 'Password Reset', link);

    res.json({ message: 'Password reset link sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const invite = await prisma.inviteToken.findUnique({ where: { token } });
    if (!invite || invite.status !== 'password_reset' || new Date() > invite.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: invite.email },
      data: { password: hashed }
    });

    await prisma.inviteToken.update({
      where: { token },
      data: { status: 'used' }
    });

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
