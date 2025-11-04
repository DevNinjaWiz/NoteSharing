import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './api/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('Auth service is healthy');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
