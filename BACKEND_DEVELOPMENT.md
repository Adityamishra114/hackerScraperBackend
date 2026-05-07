# Backend Development Guide

## Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection setup
├── controllers/
│   ├── authController.js        # Authentication business logic
│   └── storyController.js       # Story operations business logic
├── middleware/
│   └── auth.js                  # JWT verification middleware
├── models/
│   ├── User.js                  # User MongoDB schema
│   └── Story.js                 # Story MongoDB schema
├── routes/
│   ├── authRoutes.js            # Auth endpoint definitions
│   ├── storyRoutes.js           # Story endpoint definitions
│   └── scraperRoutes.js         # Scraper endpoint definitions
├── scraper/
│   └── hackernewsScraper.js     # Web scraper implementation
├── utils/
│   └── tokenUtils.js            # JWT token generation/validation
└── server.js                    # Express app setup
```

## Architecture Pattern: MVC

**Models** → MongoDB schemas (User, Story)
**Controllers** → Business logic for routes
**Routes** → API endpoint definitions
**Middleware** → Authentication and validation

---

## Development Workflow

### 1. Starting Development

```bash
cd backend
npm run dev
```

Nodemon watches for file changes and auto-restarts server.

### 2. Adding a New API Endpoint

**Step 1: Create Controller Function**

File: `controllers/newController.js`
```javascript
export const myEndpoint = async (req, res) => {
  try {
    // Your logic here
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};
```

**Step 2: Create Route**

File: `routes/newRoutes.js`
```javascript
import express from 'express';
import { myEndpoint } from '../controllers/newController.js';

const router = express.Router();

router.get('/endpoint', myEndpoint);

export default router;
```

**Step 3: Register Route in server.js**

```javascript
import newRoutes from './routes/newRoutes.js';
app.use('/api/new', newRoutes);
```

### 3. Adding Protected Routes

Add `authMiddleware` to routes requiring authentication:

```javascript
import { authMiddleware } from '../middleware/auth.js';

// Protected route
router.post('/action', authMiddleware, controllerFunction);
```

The middleware adds `req.user.userId` to the request.

### 4. Modifying Database Models

File: `models/MyModel.js`
```javascript
const schema = new mongoose.Schema({
  existingField: String,
  newField: {
    type: String,
    default: 'value',
  },
});
```

Restart server after schema changes.

---

## Common Development Tasks

### Adding Error Handling

```javascript
try {
  const result = await MyModel.findById(id);
  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(result);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: error.message });
}
```

### Validating Input

```javascript
if (!email || !password) {
  return res.status(400).json({ message: 'All fields required' });
}

if (!email.includes('@')) {
  return res.status(400).json({ message: 'Invalid email format' });
}
```

### Working with Async/Await

```javascript
// Good - use async/await
const user = await User.findById(id);

// Avoid - .then() chains
User.findById(id).then(user => {
  // ...
});
```

### Database Queries

```javascript
// Find one
const user = await User.findById(id);
const user = await User.findOne({ email });

// Find many
const users = await User.find();
const users = await User.find({ role: 'admin' });

// Create
const newUser = await User.create(userData);

// Update
await User.findByIdAndUpdate(id, updateData);

// Delete
await User.findByIdAndDelete(id);
```

---

## Testing APIs

### Using Thunder Client (Recommended)

1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method and URL
4. Add body as JSON (for POST/PUT)
5. Add headers: `Authorization: Bearer <token>` for protected endpoints
6. Send request

### Using cURL

```bash
# GET request
curl http://localhost:5000/api/stories

# POST request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Protected request
curl http://localhost:5000/api/stories/bookmarks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Debugging

### Console Logging

```javascript
// Log variables
console.log('User:', user);
console.log('Error:', error.message);

// Use console.error for errors
console.error('Critical error:', error);

// Use console.table for arrays/objects
console.table(users);
```

### Check MongoDB Data

**Option 1: MongoDB Compass (GUI)**
- Download from [mongodb.com](https://www.mongodb.com/products/compass)
- Connect to your database
- Browse collections visually

**Option 2: MongoDB Atlas Web Interface**
- Login to your Atlas account
- View collections in browser

**Option 3: MongoDB CLI**
```javascript
// In MongoDB shell
db.users.find()
db.stories.find()
```

### Debugging Tips

1. **Check Request/Response**
   ```javascript
   console.log('Request body:', req.body);
   console.log('Request headers:', req.headers);
   ```

2. **Debug Middleware**
   ```javascript
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.path}`);
     next();
   });
   ```

3. **Check Async Issues**
   ```javascript
   try {
     const data = await fetch(url);
   } catch (error) {
     console.error('Async error:', error);
   }
   ```

---

## Code Conventions

### Naming Conventions

**Files:**
- Controllers: `nameController.js` → `authController.js`
- Routes: `nameRoutes.js` → `authRoutes.js`
- Models: `PascalCase.js` → `User.js`, `Story.js`
- Middleware: `name.js` → `auth.js`

**Functions:**
- camelCase → `getUserData()`, `updateStory()`
- Constants: `UPPER_SNAKE_CASE` → `DB_CONNECTION_TIMEOUT`

**Variables:**
- camelCase → `userData`, `storyList`, `isAuthenticated`

### Code Style

**Use async/await:**
```javascript
// Good
const user = await User.findById(id);

// Avoid
User.findById(id).then(user => {});
```

**Error handling:**
```javascript
try {
  // operation
} catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ message: error.message });
}
```

**Meaningful names:**
```javascript
// Good
const userStories = await Story.find({ userId });

// Avoid
const data = await Story.find({ userId });
```

**Comments when necessary:**
```javascript
// Good - explains WHY
// Skip validation for guest users
if (isGuest) return null;

// Avoid - explains WHAT
// Check if user is guest
if (!user.isAuth) return null;
```

---

## Performance Optimization

### Database Optimization

```javascript
// Add indexes for frequently queried fields
// In your model:
const schema = new mongoose.Schema({
  email: {
    type: String,
    index: true,  // Add index
  },
});
```

### Pagination (Don't return all data)

```javascript
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

const stories = await Story.find()
  .skip(skip)
  .limit(limit);
```

### Lean Queries (Return plain objects, not Mongoose documents)

```javascript
// Faster - returns plain object
const user = await User.findById(id).lean();

// Slower - returns Mongoose document
const user = await User.findById(id);
```

---

## Security Best Practices

### Input Validation

```javascript
if (!req.body.email || !req.body.password) {
  return res.status(400).json({ message: 'Missing fields' });
}
```

### Password Security

```javascript
// Hash passwords before saving
const hashedPassword = await bcrypt.hash(password, 10);

// Compare on login
const isValid = await bcrypt.compare(password, user.password);
```

### JWT Security

```javascript
// Use strong secret
JWT_SECRET=your_very_strong_secret_key_32_chars_minimum

// Verify token on protected routes
const token = req.headers.authorization?.split(' ')[1];
jwt.verify(token, process.env.JWT_SECRET);
```

### Never Log Sensitive Data

```javascript
// Bad - logs password
console.log('User:', user);

// Good - logs only safe fields
console.log('User email:', user.email);
```

---

## Troubleshooting

### Server won't start

1. Check port isn't in use: `netstat -ano | findstr :5000`
2. Check `.env` file exists and has MONGO_URI
3. Check MongoDB connection string is valid

### Database connection fails

1. Ensure MongoDB is running
2. Check MONGO_URI in `.env`
3. For Atlas, check IP whitelist includes your IP

### Routes not working

1. Check route is registered in `server.js`
2. Check route path matches request URL
3. Check middleware order (auth must be before route handler)

### Authentication fails

1. Ensure token is passed correctly: `Authorization: Bearer <token>`
2. Check JWT_SECRET is set in `.env`
3. Check token isn't expired (7 day expiration)

---

## Next Steps

1. Read [BACKEND_API.md](./BACKEND_API.md) for API endpoint details
2. Read [BACKEND_SETUP.md](./BACKEND_SETUP.md) for environment setup
3. Read [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for detailed design
4. Start developing features!

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
