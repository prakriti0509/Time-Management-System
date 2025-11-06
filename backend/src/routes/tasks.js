import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const q = req.query.q?.toString() || '';
  const where = { userId: req.user.id };
  if (q) where.title = { $regex: new RegExp(q, 'i') };
  const items = await Task.find(where).sort({ orderIndex: 1, createdAt: 1 });
  res.json(items);
});

router.post(
  '/',
  requireAuth,
  body('title').isString().notEmpty(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('status').optional().isIn(['OPEN', 'DONE']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = { ...req.body, userId: req.user.id };
    const item = await Task.create(data);
    res.status(201).json(item);
  }
);

router.get('/:id', requireAuth, async (req, res) => {
  const item = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.put(
  '/:id',
  requireAuth,
  body('title').optional().isString().notEmpty(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('status').optional().isIn(['OPEN', 'DONE']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  }
);

router.delete('/:id', requireAuth, async (req, res) => {
  const item = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// Save Pomodoro session
router.post('/:id/pomodoro', requireAuth, async (req, res) => {
  const { startedAt, endedAt, durationMins } = req.body || {};
  const item = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.pomodoroSessions.push({ startedAt, endedAt, durationMins });
  await item.save();
  res.json(item);
});

// Simple AI: pick 3 by priority and due date proximity
router.get('/suggest/top3', requireAuth, async (req, res) => {
  const items = await Task.find({ userId: req.user.id, status: 'OPEN' });
  const weight = (p) => ({ LOW: 1, MEDIUM: 2, HIGH: 3 }[p] || 1);
  const daysUntil = (d) => {
    if (!d) return 14; // no due date → low urgency
    const diff = (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Math.max(-7, Math.min(30, diff));
  };
  const score = (t) => weight(t.priority) * 10 - daysUntil(t.dueDate);
  const top3 = items
    .map((t) => ({ t, s: score(t) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.t);
  res.json({ items: top3 });
});

export default router;


