const crypto = require('crypto');
const moment = require('moment');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate UUID v4
const generateUUID = () => {
  return crypto.randomUUID();
};

// Hash string
const hashString = (str, algorithm = 'sha256') => {
  return crypto.createHash(algorithm).update(str).digest('hex');
};

// Format date
const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

// Parse date
const parseDate = (dateString, format = 'YYYY-MM-DD') => {
  return moment(dateString, format).toDate();
};

// Check if date is valid
const isValidDate = (date) => {
  return moment(date).isValid();
};

// Get date range
const getDateRange = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const days = end.diff(start, 'days');
  
  return {
    start: start.toDate(),
    end: end.toDate(),
    days
  };
};

// Calculate age
const calculateAge = (birthDate) => {
  return moment().diff(moment(birthDate), 'years');
};

// Format currency
const formatCurrency = (amount, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format number
const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Sanitize string
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Generate password
const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

// Calculate percentage
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Round to decimal places
const roundToDecimal = (number, decimals = 2) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Get file extension
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Check if file is image
const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

// Check if file is document
const isDocumentFile = (filename) => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
};

// Get file size in human readable format
const getFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Merge objects
const mergeObjects = (target, source) => {
  return { ...target, ...source };
};

// Remove undefined values from object
const removeUndefined = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// Group array by key
const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Sort array by key
const sortBy = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Paginate array
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit)
  };
};

// Delay execution
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function
const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await delay(delayMs * attempt);
    }
  }
};

module.exports = {
  generateRandomString,
  generateUUID,
  hashString,
  formatDate,
  parseDate,
  isValidDate,
  getDateRange,
  calculateAge,
  formatCurrency,
  formatNumber,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  generatePassword,
  calculatePercentage,
  roundToDecimal,
  getFileExtension,
  isImageFile,
  isDocumentFile,
  getFileSize,
  deepClone,
  mergeObjects,
  removeUndefined,
  groupBy,
  sortBy,
  paginate,
  delay,
  retry
};
