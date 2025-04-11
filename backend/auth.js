import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        plan: 'free',
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const getCurrentUserPlan = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    res.json({ email: user.email, plan: user.plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const passwordRequiredMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.password || user.password.length < 6) {
      return res.status(403).json({ requirePassword: true });
    }
    req.user = payload;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const requireAdmin = async (req, res, next) => {
  const userId = req.user?.userId;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requireRole = (roles) => {
  return async (req, res, next) => {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    next();
  };
};
