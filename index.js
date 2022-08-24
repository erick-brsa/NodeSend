import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

app.use(express.json());
dotenv.config();

// Conectar a la base de datos
connectDB();

// Habilitar cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions))

// Rutas de la app
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/files', fileRoutes);

// Puerto de la app
const port = process.env.PORT || 4000;

// Arrancar la app
app.listen(port, () => {
    console.log('Server on port 4000');
});
