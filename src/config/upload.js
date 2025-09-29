const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
const UPLOAD_PATH = process.env.UPLOAD_PATH || './src/uploads';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(UPLOAD_PATH, 'signatures'),
    path.join(UPLOAD_PATH, 'documents'),
    path.join(UPLOAD_PATH, 'avatars')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize upload directories
ensureUploadDirs();

// Storage configuration for signatures
const signatureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_PATH, 'signatures'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `signature-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_PATH, 'documents'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `document-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_PATH, 'avatars'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

// Multer configurations
const uploadSignature = multer({
  storage: signatureStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file URL
const getFileUrl = (req, filePath) => {
  if (!filePath) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${path.relative(UPLOAD_PATH, filePath).replace(/\\/g, '/')}`;
};

module.exports = {
  uploadSignature,
  uploadDocument,
  uploadAvatar,
  deleteFile,
  getFileUrl,
  MAX_FILE_SIZE,
  UPLOAD_PATH
};
