module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_KEY,
  JWT_EXPIRES_IN: '24h',

  // Cookie Configuration
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },

  // Token Expiration Times
  EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour

  // Password Configuration
  BCRYPT_SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 8,

  // Judge0 Configuration
  JUDGE0_LANGUAGE_IDS: {
    'c++': 54,
    'java': 62,
    'javascript': 63
  },
  JUDGE0_MAX_RETRIES: 3,
  JUDGE0_POLL_INTERVAL: 1000, // ms

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // File Upload Limits
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_FORMATS: ['mp4', 'webm', 'avi', 'mov'],

  // Status Messages
  STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    WRONG: 'wrong',
    ERROR: 'error',
    TIMEOUT: 'timeout'
  },

  // Error Types
  ERROR_TYPES: {
    COMPILATION: 'compilation',
    RUNTIME: 'runtime',
    TIMEOUT: 'timeout',
    MEMORY_LIMIT: 'memory_limit'
  },

  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Difficulty Levels
  DIFFICULTY: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },

  // Tags
  TAGS: [
    'array',
    'linkedList',
    'graph',
    'dp',
    'string',
    'hash table',
    'math'
  ],

  // Supported Languages
  LANGUAGES: ['javascript', 'c++', 'java'],

  // Judge0 Status IDs
  JUDGE0_STATUS: {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR_SIGSEGV: 7,
    RUNTIME_ERROR_SIGXFSZ: 8,
    RUNTIME_ERROR_SIGFPE: 9,
    RUNTIME_ERROR_SIGABRT: 10,
    RUNTIME_ERROR_NZEC: 11,
    RUNTIME_ERROR_OTHER: 12,
    INTERNAL_ERROR: 13,
    EXEC_FORMAT_ERROR: 14
  },

  // Email Configuration
  EMAIL: {
    FROM_NAME: 'DSA Buddy',
    SUPPORT_EMAIL: 'support@dsabuddy.com'
  },

  // Redis Key Prefixes
  REDIS_PREFIXES: {
    TOKEN_BLACKLIST: 'token:',
    RATE_LIMIT: 'ratelimit:',
    SESSION: 'session:'
  }
};