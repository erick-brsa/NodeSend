import express from 'express';
import auth from '../middlewares/auth.js';
import { uploadFile, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

router.post('/', auth, uploadFile);

export default router;