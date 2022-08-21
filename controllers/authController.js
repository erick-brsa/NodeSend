import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const authUser = async (req, res, next) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401).json({ message: 'El usuario no existe' });
        return next()
    }

    // Verificar password y autenticar el usuario

    if (bcrypt.compareSync(password, user.password)) {
        // Generar JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
        }, process.env.SECRET_KEY, {
            expiresIn: '8h'
        });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'El password es incorrecto' });
        return next()
    }
}

export const authenticatedUser = async (req, res, next) => {
    res.json({ user: req.user })
}
