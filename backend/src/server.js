import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import projectsRouter from './routes/projects.js';
import labelsRouter from './routes/labels.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.use('/projects', projectsRouter);
app.use('/labels', labelsRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/time_manager';
const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });


