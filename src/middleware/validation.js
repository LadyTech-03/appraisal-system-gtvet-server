const Joi = require('joi');
  const { ROLE_VALUES } = require('../utils/roles');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req[property] = value;
    next();
  };
};

// User validation schemas
const userSchemas = {
  create: Joi.object({
    employeeId: Joi.string().required().messages({
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    name: Joi.string().required().messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
    role: Joi.string().valid(...ROLE_VALUES).required().messages({
      'any.only': `Invalid role. Valid roles: ${ROLE_VALUES.join(', ')}`,
      'any.required': 'Role is required'
    }),
    division: Joi.string().allow(''),
    unit: Joi.string().allow(null),
    position: Joi.string().allow(null),
    grade: Joi.string().allow(null),
    managerId: Joi.string().uuid().allow(null),
    phone: Joi.string().allow(null)
  }),

  update: Joi.object({
    employeeId: Joi.string(),
    email: Joi.string().email(),
    name: Joi.string(),
    role: Joi.string().valid(...ROLE_VALUES).messages({
      'any.only': `Invalid role. Valid roles: ${ROLE_VALUES.join(', ')}`
    }),
    division: Joi.string().allow(null),
    unit: Joi.string().allow(null),
    position: Joi.string().allow(null),
    grade: Joi.string().allow(null),
    managerId: Joi.string().uuid().allow(null),
    phone: Joi.string().allow(null),
    isActive: Joi.boolean()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.empty': 'New password is required',
      'any.required': 'New password is required'
    })
  })
};

// Authentication validation schemas
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
  })
};

// Appraisal validation schemas
const appraisalSchemas = {
  create: Joi.object({
    employeeId: Joi.string().uuid().required().messages({
      'string.uuid': 'Invalid employee ID',
      'any.required': 'Employee ID is required'
    }),
    appraiserId: Joi.string().uuid().required().messages({
      'string.uuid': 'Invalid appraiser ID',
      'any.required': 'Appraiser ID is required'
    }),
    periodStart: Joi.date().required().messages({
      'date.base': 'Invalid period start date',
      'any.required': 'Period start date is required'
    }),
    periodEnd: Joi.date().min(Joi.ref('periodStart')).required().messages({
      'date.base': 'Invalid period end date',
      'date.min': 'Period end date must be after start date',
      'any.required': 'Period end date is required'
    }),
    employeeInfo: Joi.object({
      title: Joi.string().required(),
      surname: Joi.string().required(),
      firstName: Joi.string().required(),
      otherNames: Joi.string().allow(''),
      gender: Joi.string().valid('Male', 'Female').required(),
      grade: Joi.string().required(),
      position: Joi.string().required(),
      unit: Joi.string().required(),
      appointmentDate: Joi.date().required()
    }).required(),
    appraiserInfo: Joi.object({
      title: Joi.string().required(),
      surname: Joi.string().required(),
      firstName: Joi.string().required(),
      otherNames: Joi.string().allow(''),
      position: Joi.string().required()
    }).required(),
    trainingReceived: Joi.array().items(
      Joi.object({
        institution: Joi.string().required(),
        date: Joi.date().required(),
        programme: Joi.string().required()
      })
    ).default([]),
    keyResultAreas: Joi.array().items(
      Joi.object({
        area: Joi.string().required(),
        targets: Joi.string().required(),
        resourcesRequired: Joi.string().allow('')
      })
    ).default([]),
    endOfYearReview: Joi.object({
      targets: Joi.array().default([]),
      totalScore: Joi.number().min(0).max(100).default(0),
      averageScore: Joi.number().min(0).max(100).default(0),
      weightedScore: Joi.number().min(0).max(100).default(0)
    }).required(),
    coreCompetencies: Joi.object().required(),
    nonCoreCompetencies: Joi.object().required(),
    overallAssessment: Joi.object({
      performanceScore: Joi.number().min(0).max(100).required(),
      coreCompetenciesScore: Joi.number().min(0).max(100).required(),
      nonCoreCompetenciesScore: Joi.number().min(0).max(100).required(),
      overallTotal: Joi.number().min(0).max(100).required(),
      overallPercentage: Joi.number().min(0).max(100).required(),
      overallRating: Joi.number().min(1).max(5).required(),
      ratingDescription: Joi.string().required()
    }).required()
  }),

  update: Joi.object({
    status: Joi.string().valid('draft', 'submitted', 'reviewed', 'closed'),
    employeeInfo: Joi.object(),
    appraiserInfo: Joi.object(),
    trainingReceived: Joi.array(),
    keyResultAreas: Joi.array(),
    midYearReview: Joi.object(),
    endOfYearReview: Joi.object(),
    coreCompetencies: Joi.object(),
    nonCoreCompetencies: Joi.object(),
    overallAssessment: Joi.object(),
    appraiserComments: Joi.string().allow(''),
    trainingDevelopmentPlan: Joi.string().allow(''),
    assessmentDecision: Joi.string().valid('outstanding', 'suitable', 'likely_ready', 'not_ready', 'unlikely'),
    appraiseeComments: Joi.string().allow(''),
    hodComments: Joi.string().allow(''),
    hodName: Joi.string().allow(''),
    hodSignature: Joi.string().allow(''),
    hodDate: Joi.date().allow(null),
    appraiserSignature: Joi.string().allow(''),
    appraiserSignatureDate: Joi.date().allow(null),
    appraiseeSignature: Joi.string().allow(''),
    appraiseeSignatureDate: Joi.date().allow(null)
  })
};

// Training record validation schemas
const trainingRecordSchemas = {
  create: Joi.object({
    userId: Joi.string().uuid().required().messages({
      'string.uuid': 'Invalid user ID',
      'any.required': 'User ID is required'
    }),
    institution: Joi.string().required().messages({
      'string.empty': 'Institution is required',
      'any.required': 'Institution is required'
    }),
    programme: Joi.string().required().messages({
      'string.empty': 'Programme is required',
      'any.required': 'Programme is required'
    }),
    startDate: Joi.date().required().messages({
      'date.base': 'Invalid start date',
      'any.required': 'Start date is required'
    }),
    endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
    durationHours: Joi.number().min(0).allow(null),
    cost: Joi.number().min(0).allow(null),
    fundingSource: Joi.string().allow(''),
    status: Joi.string().valid('planned', 'ongoing', 'completed', 'cancelled').default('completed'),
    certificateUrl: Joi.string().uri().allow(''),
    notes: Joi.string().allow('')
  }),

  update: Joi.object({
    institution: Joi.string(),
    programme: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date().allow(null),
    durationHours: Joi.number().min(0).allow(null),
    cost: Joi.number().min(0).allow(null),
    fundingSource: Joi.string().allow(''),
    status: Joi.string().valid('planned', 'ongoing', 'completed', 'cancelled'),
    certificateUrl: Joi.string().uri().allow(''),
    notes: Joi.string().allow('')
  })
};

// Access request validation schemas
const accessRequestSchemas = {
  create: Joi.object({
    targetUserId: Joi.string().uuid().allow(null),
    requestType: Joi.string().valid('appraisal_access', 'team_access', 'admin_access').required().messages({
      'any.only': 'Invalid request type',
      'any.required': 'Request type is required'
    }),
    reason: Joi.string().required().messages({
      'string.empty': 'Reason is required',
      'any.required': 'Reason is required'
    }),
    expiresAt: Joi.date().min('now').allow(null)
  }),

  review: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required().messages({
      'any.only': 'Status must be approved or rejected',
      'any.required': 'Status is required'
    }),
    reviewNotes: Joi.string().allow('')
  })
};

// Query parameter validation schemas
const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    search: Joi.string().allow(''),
    sort: Joi.string().valid('created_at', 'updated_at', 'name', 'email').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  userFilters: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    role: Joi.string(),
    division: Joi.string(),
    unit: Joi.string(),
    isActive: Joi.boolean().default(true),
    search: Joi.string().allow('')
  }),

  appraisalFilters: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    employeeId: Joi.string().uuid(),
    appraiserId: Joi.string().uuid(),
    status: Joi.string().valid('draft', 'submitted', 'reviewed', 'closed'),
    periodStart: Joi.date(),
    periodEnd: Joi.date(),
    search: Joi.string().allow('')
  })
};

// Export validation middleware
module.exports = {
  validate,
  userSchemas,
  authSchemas,
  appraisalSchemas,
  trainingRecordSchemas,
  accessRequestSchemas,
  querySchemas
};
