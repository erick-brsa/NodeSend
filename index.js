import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(express.json());
dotenv.config();

// Conectar a la base de datos
connectDB();

// Rutas de la app
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Puerto de la app
const port = process.env.PORT || 4000;

// Arrancar la app
app.listen(port, () => {
    console.log('Server on port 4000');
});
