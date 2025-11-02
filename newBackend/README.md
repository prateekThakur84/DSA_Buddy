# DSA Buddy Backend - Restructured

A well-organized, scalable MERN stack backend for a DSA (Data Structures & Algorithms) problem-solving platform similar to LeetCode.

## 🚀 Features

- **User Authentication**: Email/Password + Google OAuth
- **Email Verification**: Secure account activation
- **Problem Management**: Create, update, and manage DSA problems
- **Code Submission**: Submit solutions in JavaScript, C++, and Java
- **Judge0 Integration**: Automated code testing and evaluation
- **AI Chatbot**: Get hints and explanations using Google Gemini
- **Video Solutions**: Upload and manage solution videos with Cloudinary
- **Redis Caching**: Token management and session storage
- **Role-Based Access**: User and Admin roles

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── constants.js
│   │   ├── database.config.js
│   │   ├── passport.config.js
│   │   └── redis.config.js
│   │
│   ├── controllers/         # Business logic
│   │   ├── auth.controller.js
│   │   ├── problem.controller.js
│   │   ├── submission.controller.js
│   │   ├── video.controller.js
│   │   └── ai.controller.js
│   │
│   ├── middleware/          # Custom middleware
│   │   └── auth.middleware.js
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── problem.model.js
│   │   ├── submission.model.js
│   │   └── video.model.js
│   │
│   ├── routes/              # API routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── problem.routes.js
│   │   ├── submission.routes.js
│   │   ├── ai.routes.js
│   │   └── video.routes.js
│   │
│   └── utils/               # Helper utilities
│       ├── email.util.js
│       ├── judge0.util.js
│       ├── validation.util.js
│       └── response.util.js
│
├── server.js                # Application entry point
├── package.json
├── .env.example
└── README.md
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Email**: Nodemailer
- **Code Execution**: Judge0 API
- **AI**: Google Gemini
- **Cloud Storage**: Cloudinary
- **Validation**: Validator.js

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECT_STRING=your_mongodb_connection_string

# JWT
JWT_KEY=your_jwt_secret_key

# Redis
REDIS_PASS=your_redis_password

# Judge0
JUDGE0_KEY=your_judge0_api_key

# Google Gemini AI
GEMINI_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

4. **Start the server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `GET /auth/verify-email` - Verify email address
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/check` - Check authentication status
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/google` - Google OAuth login
- `GET /auth/profile` - Get user profile (Protected)
- `PUT /auth/profile` - Update user profile (Protected)

### Problems (`/problem`)
- `POST /problem/create` - Create problem (Admin only)
- `GET /problem/getAllProblem` - Get all problems
- `GET /problem/problemById/:id` - Get problem by ID
- `PUT /problem/update/:id` - Update problem (Admin only)
- `DELETE /problem/delete/:id` - Delete problem (Admin only)
- `GET /problem/problemSolvedByUser` - Get user's solved problems
- `GET /problem/submittedProblem/:pid` - Get problem submissions

### Submissions (`/submission`)
- `POST /submission/submit/:id` - Submit code for problem
- `POST /submission/run/:id` - Run code against visible test cases

### AI Chatbot (`/ai`)
- `POST /ai/chat` - Chat with AI tutor

### Videos (`/video`)
- `GET /video/create/:problemId` - Generate upload signature (Admin only)
- `POST /video/save` - Save video metadata (Admin only)
- `DELETE /video/delete/:problemId` - Delete video (Admin only)

## 🧪 Testing

Check server health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-27T12:00:00.000Z",
  "environment": "development",
  "uptime": 123.456
}
```

## 🏗️ Code Organization

### Naming Conventions
- **Config files**: `*.config.js`
- **Models**: `*.model.js`
- **Controllers**: `*.controller.js`
- **Routes**: `*.routes.js`
- **Middleware**: `*.middleware.js`
- **Utils**: `*.util.js`

### Best Practices
- **Single Responsibility**: Each file has one clear purpose
- **DRY Principle**: No code duplication
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Input validation on all endpoints
- **Security**: JWT tokens, password hashing, input sanitization

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing (12 salt rounds)
- Token blacklisting with Redis
- HTTP-only cookies
- CORS configuration
- Input validation and sanitization
- Rate limiting ready
- Session management

## 📝 Migration from Old Structure

If you're migrating from the old flat structure:

1. **Backup your current code**
```bash
git checkout -b backup-old-structure
```

2. **Create new folder structure**
```bash
mkdir -p src/{config,controllers,middleware,models,routes,utils}
```

3. **Move files according to the new structure**
   - See `restructuring-docs.pdf` for detailed mapping

4. **Update all import paths**
   - Old: `require('./models/user')`
   - New: `require('./models/user.model')`

5. **Update `package.json` main entry**
```json
{
  "main": "server.js"
}
```

6. **Test thoroughly**

## 🐛 Common Issues

### Module not found
```
Error: Cannot find module './models/user'
```
**Solution**: Update import path to `./models/user.model.js`

### Redis connection failed
**Solution**: Ensure Redis is running and credentials are correct

### Judge0 API errors
**Solution**: Verify your Judge0 API key and rate limits

## 📚 Documentation

- **Full Documentation**: See `restructuring-docs.pdf`
- **Change Log**: See `refactoring_changes.csv`
- **API Documentation**: Coming soon (Swagger)

## 🤝 Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add JSDoc comments to functions
4. Test your changes thoroughly
5. Update documentation if needed

## 📄 License

MIT License

## 👥 Author

DSA Buddy Team

---

**Note**: This is the restructured version of the backend. All functionality remains the same - only the organization has improved for better maintainability and scalability.
