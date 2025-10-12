# 12MegaBlog Backend API

A modern Node.js/Express backend API for a blog application with Appwrite integration for authentication, database, and file storage.

## 🚀 Features

- **Authentication**: User registration/login with JWT tokens
- **Post Management**: CRUD operations for blog posts
- **File Upload**: Image upload with Appwrite Storage integration
- **Image Serving**: Optimized image delivery endpoints
- **Error Handling**: Global error handling with detailed logging
- **Security**: CORS, Helmet, input validation, and JWT protection
- **Logging**: Comprehensive request/response logging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT + Appwrite Auth
- **Database**: Appwrite Database
- **File Storage**: Appwrite Storage
- **Validation**: express-validator
- **File Upload**: multer
- **Security**: helmet, cors, bcryptjs

## 📦 Installation

1. **Clone and navigate to backend folder**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Setup below)

5. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Environment Setup

Create a `.env` file with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Appwrite Configuration
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=your_posts_collection_id
APPWRITE_BUCKET_ID=your_storage_bucket_id
```

## 📊 Appwrite Setup

### Database Schema (Posts Collection)
```json
{
  "title": "string",
  "content": "string", 
  "slug": "string",
  "status": "string",
  "userId": "string",
  "featuredImage": "string"
}
```

### Permissions
- **Posts Collection**: Users can create/update/delete own posts, Anyone can read
- **Storage Bucket**: Users can create/update/delete files, Anyone can read

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected, with file upload)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)

### Images
- `GET /api/images/:fileId` - View image (redirects to Appwrite)
- `GET /api/images/url/:fileId` - Get image URLs as JSON
- `GET /api/images/info/:fileId` - Get file metadata
- `GET /api/images/download/:fileId` - Download file

### Health
- `GET /` - API information
- `GET /health` - Health check

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Create Post with Image
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Blog Post" \
  -F "content=This is the post content" \
  -F "status=active" \
  -F "featuredImage=@/path/to/image.jpg"
```

### Get All Posts
```bash
curl http://localhost:5000/api/posts
```

## 🏗️ Project Structure

```
Backend/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── images.js
│   └── utils/               # Utilities
│       ├── upload.js
│       └── errors.js
├── uploads/                 # Temporary file storage
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js              # Main server file
└── TESTING_GUIDE.md       # Testing documentation
```

## 🔒 Security Features

- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure authentication
- **Validation**: Input validation and sanitization
- **File Upload**: Type and size restrictions
- **Error Handling**: No sensitive data exposure

## 📊 Logging & Monitoring

The application includes comprehensive logging:
- **Request Logging**: All incoming requests with details
- **Error Logging**: Detailed error information
- **Response Logging**: Status codes and response times
- **Color-coded**: 🟢 Success, 🔴 Error, 🟡 Warning, 🔵 Info

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Update `FRONTEND_URL` to production domain
3. Use production Appwrite project
4. Set secure JWT secret
5. Configure proper logging service
6. Set up SSL certificates
7. Add rate limiting
8. Configure monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the TESTING_GUIDE.md for detailed testing instructions
- Review environment variable configuration
- Verify Appwrite setup and permissions
- Check server logs for detailed error information
