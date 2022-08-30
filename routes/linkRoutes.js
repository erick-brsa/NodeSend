import express from 'express';
import { check } from 'express-validator';

import auth from '../middlewares/auth.js';
import { createLink, getAllLinks, hasPassword, getLink, verifyPassword } from '../controllers/linkController.js';

const router = express.Router();

router.post('/', 
    [
        check('name', 'Sube un archivo').not().isEmpty(),
        check('original_name', 'Sube un archivo').not().isEmpty()
    ], 
    auth, 
    createLink
);

router.get('/', getAllLinks)

router.get('/:url', hasPassword, getLink);

router.post('/:url', verifyPassword, getLink)

export default router;