const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if user is admin
      if (!decoded.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
      
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Validation schemas
const proposalSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(5000).required(),
  category: Joi.string().valid(
    'Infrastructure',
    'Environment', 
    'Education',
    'Healthcare',
    'Transportation',
    'Safety',
    'Culture',
    'Technology',
    'Other'
  ).required(),
  budget: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(),
  targets: Joi.array().items(Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/)).optional(),
  values: Joi.array().items(Joi.string().pattern(/^\d+$/)).optional(),
  calldatas: Joi.array().items(Joi.string()).optional(),
  attachments: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    hash: Joi.string().required(),
    size: Joi.number().required()
  })).optional()
});

const voteSchema = Joi.object({
  support: Joi.number().valid(0, 1, 2).required(), // 0 = Against, 1 = For, 2 = Abstain
  reason: Joi.string().max(500).optional()
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

const userSchema = Joi.object({
  address: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  isAdmin: Joi.boolean().optional()
});

const zkProofSchema = Joi.object({
  identityHash: Joi.string().pattern(/^0x[a-fA-F0-9]{64}$/).required(),
  proof: Joi.string().required(),
  metadata: Joi.string().max(1000).optional()
});

// Validation middleware
const validateProposal = (req, res, next) => {
  const { error } = proposalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateVote = (req, res, next) => {
  const { error } = voteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateZKProof = (req, res, next) => {
  const { error } = zkProofSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Rate limiting middleware
const createRateLimit = (windowMs, maxRequests) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    userRequests.push(now);
    requests.set(key, userRequests);
    
    next();
  };
};

// CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details || err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  validateProposal,
  validateVote,
  validateComment,
  validateUser,
  validateZKProof,
  createRateLimit,
  corsOptions,
  errorHandler,
  requestLogger
};
