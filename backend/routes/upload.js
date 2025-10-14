import express from 'express';
import upload from '../middleware/upload.js';
import { uploadFile, getFiles } from '../controllers/fileController.js';

const router = express.Router();

// Route to handle single file upload
// This endpoint expects a POST request with 'multipart/form-data'
// The file should be in a field named 'file'
router.post('/upload', upload.single('file'), uploadFile);

// Route to get a list of all uploaded files
router.get('/files', getFiles);

export default router;