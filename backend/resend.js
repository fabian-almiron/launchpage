import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { sendInviteEmail } from './email.js';

const router = express.Router();
const prisma = new PrismaClient();

// Resend invite link for an expired or used token
router.post('/auth/resend-invite', async (req, res) => {
  const { email } = req.body;

  try {
    const oldInvite = await prisma.inviteToken.findFirst({
      where: {
        email,
        status: 'pending'
      },
      orderBy: { createdAt: 'desc' }
    });

    const expiredOrMissing = !oldInvite || new Date() > oldInvite.expiresAt;

    if (expiredOrMissing) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && user.teamId) {
        const newToken = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newInvite = await prisma.inviteToken.create({
          data: {
            email,
            teamId: user.teamId,
            token: newToken,
            expiresAt
          }
        });

        const inviteLink = `${process.env.FRONTEND_URL}/magic-login.html?token=${newToken}`;
        await sendInviteEmail(email, "Your team", inviteLink);

        return res.json({ message: 'New invite sent.' });
      }
    }

    res.status(400).json({ error: 'Active invite still valid or no user found.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
