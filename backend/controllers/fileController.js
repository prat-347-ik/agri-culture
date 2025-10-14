import File from '../models/file.js';
import cloudinary from '../config/cloudinary.js';

// Controller to handle file upload
export const uploadFile = async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Create new file
    const file = new File({
      name: req.body.name || req.file.originalname,
      url: result.secure_url,
      cloudinary_id: result.public_id,
    });

    // Save file to database
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while uploading' });
  }
};

// Controller to get all files
export const getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while fetching files' });
    }
}

