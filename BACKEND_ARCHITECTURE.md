# Backend Architecture

## Overview

The backend follows an MVC (Model-View-Controller) architecture with clear separation of concerns. This guide explains the design patterns, data flow, and module relationships.

## Architecture Diagram

```
Request → Middleware (CORS) → Routes → Controllers → Models → Database
                                ↓           ↓
                            Authentication  Business Logic
                            Validation      Data Operations
```

## Layer Breakdown

### 1. Routes Layer

**Purpose:** Define API endpoints and HTTP methods

**Files:**
- `routes/authRoutes.js` - Authentication endpoints
- `routes/storyRoutes.js` - Story endpoints
- `routes/scraperRoutes.js` - Scraper endpoints

**Pattern:**
```javascript
router.post('/endpoint', middleware, controllerFunction);
router.get('/endpoint/:id', authMiddleware, controllerFunction);
```

### 2. Middleware Layer

**Purpose:** Process requests before they reach controllers

**Key Middleware:**
- `middleware/auth.js` - Verify JWT tokens and add user to request
- Built-in: express.json(), cors()

**Flow:**
```
Request → Auth Middleware (verify token) → Attach user → Continue
                                ↓
                          If invalid → Return 401 error
```

### 3. Controllers Layer

**Purpose:** Implement business logic for each endpoint

**Files:**
- `controllers/authController.js` - Handle registration, login
- `controllers/storyController.js` - Handle story operations

**Pattern:**
```javascript
export const endpoint = async (req, res) => {
  try {
    // Extract data
    const data = req.body;
    
    // Business logic
    const result = await Model.operation(data);
    
    // Return response
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 4. Models Layer

**Purpose:** Define data schemas and validation

**Files:**
- `models/User.js` - User schema
- `models/Story.js` - Story schema

**Schema Pattern:**
```javascript
const schema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    index: true,
  },
});

export default mongoose.model('ModelName', schema);
```

### 5. Database Layer

**Purpose:** Store and retrieve data

**Technology:** MongoDB
**ODM:** Mongoose (schema validation, query helpers)

## Data Models

### User Model

```javascript
{
  _id: ObjectId (auto-generated)
  name: String
  email: String (unique)
  password: String (hashed)
  bookmarks: [ObjectId] (array of Story IDs)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Story Model

```javascript
{
  _id: ObjectId (auto-generated)
  title: String
  url: String
  points: Number
  author: String
  postedAt: Date
  hackerId: String (unique, from Hacker News)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Authentication Flow

### Registration

```
1. User submits email, name, password
   ↓
2. Validate input (email format, password length)
   ↓
3. Check if email already registered
   ↓
4. Hash password with bcryptjs (10 rounds)
   ↓
5. Create user in database
   ↓
6. Generate JWT token
   ↓
7. Return token + user data
```

### Login

```
1. User submits email, password
   ↓
2. Find user by email
   ↓
3. Compare password with hash using bcryptjs
   ↓
4. If valid, generate JWT token
   ↓
5. Return token + user data
   ↓
6. Client stores token in localStorage
```

### Protected Requests

```
1. Client sends request with Authorization header
   ↓
2. Middleware extracts token from header
   ↓
3. Verify token with JWT_SECRET
   ↓
4. Extract user ID from token
   ↓
5. Attach user to request object
   ↓
6. Continue to controller
```

## API Request Flow

### Example: Get Bookmarks

```
GET /api/stories/bookmarks
Authorization: Bearer <token>
     ↓
routes/storyRoutes.js (route definition)
     ↓
middleware/auth.js (verify token, attach req.user)
     ↓
controllers/storyController.js (getBookmarks function)
     ↓
models/User.js (find user, populate bookmarks)
     ↓
Database (MongoDB query)
     ↓
Return bookmarks to client
```

### Code Flow Example

```javascript
// 1. Route definition
router.get('/bookmarks', authMiddleware, getBookmarks);

// 2. Middleware (auth.js)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  req.user = jwt.verify(token, JWT_SECRET);
  next(); // Continue to controller
};

// 3. Controller (storyController.js)
export const getBookmarks = async (req, res) => {
  const userId = req.user.userId; // From middleware
  const user = await User.findById(userId).populate('bookmarks');
  res.json(user.bookmarks);
};
```

## Module Relationships

### Imports Map

```
server.js (entry point)
  ├── routes/* (route files)
  │   └── controllers/* (business logic)
  │       └── models/* (data schemas)
  └── middleware/* (auth verification)
      └── models/* (database queries)

utils/tokenUtils.js
  └── Used by authController.js (for JWT generation)

scraper/hackernewsScraper.js
  └── Imports models/Story.js (save data)
  └── Called by server.js on startup
```

### Dependency Injection Pattern

While the app doesn't use formal dependency injection, controllers depend on:
- Models (for database operations)
- Middleware (for request validation)
- Utils (for helper functions)

## Error Handling Strategy

### Error Hierarchy

```
Request Error
├── Client Error (4xx)
│   ├── 400 Bad Request (validation failed)
│   ├── 401 Unauthorized (auth failed)
│   └── 404 Not Found (resource missing)
└── Server Error (5xx)
    └── 500 Internal Server Error
```

### Error Handling Pattern

```javascript
try {
  // Validate input
  if (!input) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  
  // Database operation
  const result = await Model.operation();
  
  // Check if found
  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  // Success
  res.json(result);
  
} catch (error) {
  // Unexpected error
  console.error(error);
  res.status(500).json({ message: error.message });
}
```

## Scalability Considerations

### Current Architecture Strengths

✅ **Modular** - Easy to add new routes/controllers
✅ **Separation of Concerns** - Clear responsibility boundaries
✅ **Middleware Pattern** - Extensible authentication/validation
✅ **Database Ready** - Can add indexes, caching

### Future Improvements

1. **Caching Layer**
   - Add Redis for frequently accessed stories
   - Cache user bookmarks

2. **API Rate Limiting**
   - Prevent abuse of endpoints
   - Use express-rate-limit

3. **Request Validation**
   - Add express-validator for input validation
   - Create validation middleware

4. **Error Tracking**
   - Add Sentry or similar for error monitoring
   - Better error logging

5. **Background Jobs**
   - Use Bull or similar for async tasks
   - Schedule scraper at intervals

6. **API Documentation**
   - Add Swagger/OpenAPI
   - Auto-generate API docs

## Security Architecture

### Authentication & Authorization

**Authentication (Is user who they claim?)**
- JWT tokens issued on login
- Tokens verified on protected requests
- Token expires after 7 days

**Authorization (What can user do?)**
- Protected routes require valid token
- User can only access their own bookmarks

### Data Protection

**In Transit:**
- HTTPS (enforced in production)
- CORS headers configured

**At Rest:**
- Passwords hashed with bcryptjs
- JWT_SECRET secure (from environment)

**Database:**
- MongoDB Atlas IP whitelist
- Strong credentials

## Configuration Management

### Environment Variables

```
PORT=5000                    # Server port
MONGO_URI=mongodb://...      # Database connection
JWT_SECRET=random_string     # Token signing key
NODE_ENV=development         # Environment mode
```

### Configuration File (proposed)

```javascript
// config/env.js
export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiry: '7d',
  corsOrigin: 'http://localhost:3000',
};
```

## Performance Optimization

### Database Queries

**Use indexes:**
```javascript
email: { type: String, index: true }
```

**Pagination:**
```javascript
const skip = (page - 1) * limit;
Model.find().skip(skip).limit(limit);
```

**Lean queries:**
```javascript
// Returns plain object (faster)
const user = await User.findById(id).lean();
```

### API Response

**Pagination reduces payload:**
```json
{
  "stories": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

**Only return needed fields:**
```javascript
// Instead of returning all user data
User.findById(id).select('name email'); // Only these fields
```

## Testing Strategy (Recommended)

### Unit Tests

```javascript
// Test individual functions
describe('authController', () => {
  it('should register new user', async () => {
    // Test registration
  });
});
```

### Integration Tests

```javascript
// Test API endpoints
describe('POST /api/auth/register', () => {
  it('should return token on success', async () => {
    // Test full endpoint
  });
});
```

### Tools

- **Jest** - Test framework
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - Test database

## Deployment Architecture

### Development
```
Local Machine
├── Node.js server (localhost:5000)
├── MongoDB local instance
└── Frontend dev server (localhost:3000)
```

### Production
```
Cloud Provider (Heroku, Railway, AWS)
├── Node.js application
├── MongoDB Atlas (cloud database)
└── Environment variables
```

### CI/CD Pipeline (Optional)

```
Git Push
  ↓
GitHub Actions / GitLab CI
  ↓
Run Tests
  ↓
Build Docker Image
  ↓
Deploy to Production
```

## Next Steps

1. Review [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md) for coding guidelines
2. Check [BACKEND_API.md](./BACKEND_API.md) for endpoint details
3. Explore model files to understand data structures
4. Add new features following this architecture
