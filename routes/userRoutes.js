import express from 'express';
import { check } from 'express-validator';
import { createUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    createUser
);

export default router;