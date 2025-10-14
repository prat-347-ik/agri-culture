import multer from 'multer';
import path from 'path';

// Multer config for file uploads
// This configuration stores files temporarily in memory before they are uploaded to Cloudinary
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    // Allow only jpg, jpeg, and png
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
