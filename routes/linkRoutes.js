import express from 'express';
import auth from '../middlewares/auth.js';
import {
    createLink
} from '../controllers/linkController.js';
import { check } from 'express-validator';

const router = express.Router();

router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty()
], auth, createLink);

export default router;