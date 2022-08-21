import express from 'express';
import { uploadFile, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

router.post('/', uploadFile);

router.delete('/:id', deleteFile);

export default router;