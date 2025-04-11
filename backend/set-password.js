import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/set-password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.userId;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
