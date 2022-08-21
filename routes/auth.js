import express from 'express';
import { check } from 'express-validator';
import { authUser, authenticatedUser } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/',
    [
        check('email', 'Ingresa un correo válido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty()
    ], 
    authUser
);

router.get('/', auth, authenticatedUser);
    
export default router;