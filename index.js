import express from 'express';
import 'express-async-errors';
import { config } from './config/index.js';
import { auth } from './src/auth/index.js';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', auth.router);

app.use((err, req, res, next) => {
  if (err.name === 'TokenExpiredError') return res.status(401).json({ error: err.message });
  res.status(500).json({ error: err.message || 'An error occurred while processing the request' });
});

app.listen(config.app.port, () => {
  console.log(`Server is running on port: http://localhost:${config.app.port}`);
});
