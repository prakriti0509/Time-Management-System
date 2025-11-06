import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const items = await Project.find({ userId: req.user.id }).sort({ createdAt: 1 });
  res.json(items);
});

router.post('/', requireAuth, body('name').isString().notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Project.create({ userId: req.user.id, name: req.body.name });
  res.status(201).json(item);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Project.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
});

export default router;


