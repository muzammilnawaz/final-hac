import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'; 

import { db } from './database/db.js';
import { notFound, errorHandler } from './Middleware/errorMiddleware.js'; 

import authRouter from './routes/auth.js';
import reportRoutes from './routes/reportRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';
import familyRoutes from './routes/familyRoutes.js'; 

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));


app.use(cookieParser());
app.use(express.json());
await db(); 

app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/reports', reportRoutes); 
app.use('/api/v1/vitals', vitalsRoutes); 
app.use('/api/v1/family', familyRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server Is running on port ${PORT}`);
});