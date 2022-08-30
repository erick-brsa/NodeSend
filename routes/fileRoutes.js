import express from 'express';
import auth from '../middlewares/auth.js';
import { uploadFile, downloadFile, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

router.post('/', auth, uploadFile);

router.get('/:file', downloadFile, deleteFile)

export default router;