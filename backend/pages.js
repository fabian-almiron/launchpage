import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/pages', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const pages = await prisma.page.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pages', authMiddleware, requireRole(['editor', 'admin']), async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;
  try {
    const page = await prisma.page.create({
      data: {
        title,
        content,
        ownerId: userId
      }
    });
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pages/:id/versions', authMiddleware, requireRole(['editor', 'admin']), async (req, res) => {
  const { id } = req.params;
  const versions = await prisma.pageVersion.findMany({
    where: { pageId: id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(versions);
});

router.post('/pages/:id/restore', authMiddleware, requireRole(['editor', 'admin']), async (req, res) => {
  const { id } = req.params;
  const { versionId } = req.body;
  const version = await prisma.pageVersion.findUnique({ where: { id: versionId } });

  if (!version) return res.status(404).json({ error: "Version not found" });

  const updated = await prisma.page.update({
    where: { id },
    data: { content: version.content }
  });

  res.json({ message: "Page restored", page: updated });
});

export default router;
