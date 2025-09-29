
// Appraisal statuses
const APPRAISAL_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  CLOSED: 'closed'
};

// Review statuses
const REVIEW_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved'
};

// Training record statuses
const TRAINING_STATUS = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Access request types
const ACCESS_REQUEST_TYPES = {
  APPRAISAL_ACCESS: 'appraisal_access',
  TEAM_ACCESS: 'team_access',
  ADMIN_ACCESS: 'admin_access'
};

// Access request statuses
const ACCESS_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Assessment decisions
const ASSESSMENT_DECISIONS = {
  OUTSTANDING: 'outstanding',
  SUITABLE: 'suitable',
  LIKELY_READY: 'likely_ready',
  NOT_READY: 'not_ready',
  UNLIKELY: 'unlikely'
};

// Competency types
const COMPETENCY_TYPES = {
  CORE: 'core',
  NON_CORE: 'non_core'
};

// Signature types
const SIGNATURE_TYPES = {
  APPRAISER: 'appraiser',
  APPRAISEE: 'appraisee',
  HOD: 'hod',
  HR: 'hr'
};

// File upload limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  APPRAISAL_NOT_FOUND: 'Appraisal not found',
  ACCESS_DENIED: 'Access denied',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  FILE_UPLOAD_ERROR: 'File upload error',
  EMAIL_SEND_ERROR: 'Email sending failed'
};

// Success messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  APPRAISAL_CREATED: 'Appraisal created successfully',
  APPRAISAL_UPDATED: 'Appraisal updated successfully',
  APPRAISAL_DELETED: 'Appraisal deleted successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// API response structure
const API_RESPONSE = {
  SUCCESS: {
    success: true,
    message: '',
    data: null
  },
  ERROR: {
    success: false,
    message: '',
    errors: []
  }
};

// Database table names
const TABLES = {
  USERS: 'users',
  APPRAISALS: 'appraisals',
  TRAINING_RECORDS: 'training_records',
  KEY_RESULT_AREAS: 'key_result_areas',
  MID_YEAR_REVIEWS: 'mid_year_reviews',
  END_YEAR_REVIEWS: 'end_year_reviews',
  COMPETENCIES: 'competencies',
  SIGNATURES: 'signatures',
  ACCESS_REQUESTS: 'access_requests'
};

// Cache keys
const CACHE_KEYS = {
  USER_STATS: 'user_stats',
  APPRAISAL_STATS: 'appraisal_stats',
  SYSTEM_HEALTH: 'system_health',
  USER_HIERARCHY: 'user_hierarchy'
};

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
};

// Email templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  APPRAISAL_NOTIFICATION: 'appraisal_notification',
  ACCESS_REQUEST: 'access_request'
};

// System configuration
const SYSTEM_CONFIG = {
  JWT_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 6,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

module.exports = {
  APPRAISAL_STATUS,
  REVIEW_STATUS,
  TRAINING_STATUS,
  ACCESS_REQUEST_TYPES,
  ACCESS_REQUEST_STATUS,
  ASSESSMENT_DECISIONS,
  COMPETENCY_TYPES,
  SIGNATURE_TYPES,
  UPLOAD_LIMITS,
  PAGINATION,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_RESPONSE,
  TABLES,
  CACHE_KEYS,
  CACHE_TTL,
  EMAIL_TEMPLATES,
  SYSTEM_CONFIG
};
