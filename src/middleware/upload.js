const { uploadSignature, uploadDocument, uploadAvatar, deleteFile, getFileUrl } = require('../config/upload');

// Middleware for signature uploads
const uploadSignatureMiddleware = (fieldName = 'signature') => {
  return (req, res, next) => {
    const upload = uploadSignature.single(fieldName);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Signature upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      if (req.file) {
        req.file.url = getFileUrl(req, req.file.path);
      }
      
      next();
    });
  };
};

// Middleware for document uploads
const uploadDocumentMiddleware = (fieldName = 'document') => {
  return (req, res, next) => {
    const upload = uploadDocument.single(fieldName);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Document upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      if (req.file) {
        req.file.url = getFileUrl(req, req.file.path);
      }
      
      next();
    });
  };
};

// Middleware for avatar uploads
const uploadAvatarMiddleware = (fieldName = 'avatar') => {
  return (req, res, next) => {
    const upload = uploadAvatar.single(fieldName);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Avatar upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      if (req.file) {
        req.file.url = getFileUrl(req, req.file.path);
      }
      
      next();
    });
  };
};

// Middleware for multiple file uploads
const uploadMultipleMiddleware = (fieldName = 'files', maxCount = 5) => {
  return (req, res, next) => {
    const upload = uploadDocument.array(fieldName, maxCount);
    
    upload(req, res, (err) => {
      if (err) {
        console.error('Multiple file upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          file.url = getFileUrl(req, file.path);
        });
      }
      
      next();
    });
  };
};

// Middleware to validate file type
const validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    const file = req.file || (req.files && req.files[0]);
    
    if (!file) {
      return next();
    }
    
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete uploaded file
      deleteFile(file.path);
      
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    next();
  };
};

// Middleware to validate file size
const validateFileSize = (maxSizeInMB = 10) => {
  return (req, res, next) => {
    const file = req.file || (req.files && req.files[0]);
    
    if (!file) {
      return next();
    }
    
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      // Delete uploaded file
      deleteFile(file.path);
      
      return res.status(400).json({
        success: false,
        message: `File size exceeds ${maxSizeInMB}MB limit`
      });
    }
    
    next();
  };
};

// Middleware to clean up uploaded files on error
const cleanupUploads = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If response is an error, clean up uploaded files
    if (res.statusCode >= 400) {
      const files = req.files || (req.file ? [req.file] : []);
      files.forEach(file => {
        if (file.path) {
          deleteFile(file.path);
        }
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Helper middleware to get file URL
const getFileUrlMiddleware = (req, res, next) => {
  if (req.file) {
    req.file.url = getFileUrl(req, req.file.path);
  }
  
  if (req.files) {
    req.files.forEach(file => {
      file.url = getFileUrl(req, file.path);
    });
  }
  
  next();
};

// Middleware to handle file deletion
const deleteFileMiddleware = (req, res, next) => {
  const filePath = req.body.filePath || req.params.filePath;
  
  if (!filePath) {
    return res.status(400).json({
      success: false,
      message: 'File path is required'
    });
  }
  
  const deleted = deleteFile(filePath);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'File not found or could not be deleted'
    });
  }
  
  res.json({
    success: true,
    message: 'File deleted successfully'
  });
};

module.exports = {
  uploadSignatureMiddleware,
  uploadDocumentMiddleware,
  uploadAvatarMiddleware,
  uploadMultipleMiddleware,
  validateFileType,
  validateFileSize,
  cleanupUploads,
  getFileUrlMiddleware,
  deleteFileMiddleware
};
