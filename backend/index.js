import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { db } from './database/db.js';
import path from 'path';

import { notFound, errorHandler } from './middleware/errorMiddleware.js'; 

import authRouter from './routes/auth.js';
import reportRoutes from './routes/reportRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';
import familyRoutes from './routes/familyRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend ka Sahi URL
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
await db(); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/reports', reportRoutes); 
app.use('/api/v1/vitals', vitalsRoutes);
app.use('/api/v1/family', familyRoutes); 

app.use(notFound);

app.use(errorHandler);



const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './frontend/dist')));


const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server Is running on port ${PORT}`);
});





