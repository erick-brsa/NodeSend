import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

export const createUser = async (req, res) => {
    // Mostrar mensajes de error de express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si el usuario existe
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Crear un nuevo usuario
    const newUser = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);        

    try {
        await newUser.save();
        return res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
        console.lof(error);
    }
};