import express from 'express';
import 'express-async-errors';
import { auth } from './features/auth/index.js';

export const app = express();

app.use(express.json());

app.use('/api/v1/auth', auth.router);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'An error occurred while processing the request' });
});
