# Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned after successful login or registration.

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Email already registered"
}
```

---

### Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

## Story Endpoints

### Get All Stories

**Endpoint:** `GET /stories`

**Description:** Fetch all stories with pagination

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Stories per page

**Example Request:**
```
GET /stories?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "stories": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Show HN: My Amazing Project",
      "url": "https://example.com",
      "points": 1250,
      "author": "username",
      "postedAt": "2024-01-15T10:30:00Z",
      "hackerId": "id123456",
      "createdAt": "2024-01-15T10:31:00Z",
      "updatedAt": "2024-01-15T10:31:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### Get Story by ID

**Endpoint:** `GET /stories/:id`

**Description:** Fetch a single story

**Path Parameters:**
- `id` - MongoDB story ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Show HN: My Amazing Project",
  "url": "https://example.com",
  "points": 1250,
  "author": "username",
  "postedAt": "2024-01-15T10:30:00Z",
  "hackerId": "id123456",
  "createdAt": "2024-01-15T10:31:00Z",
  "updatedAt": "2024-01-15T10:31:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Story not found"
}
```

---

### Toggle Bookmark

**Endpoint:** `POST /stories/:id/bookmark` ⚠️ **[Protected]**

**Description:** Add or remove a story from bookmarks

**Path Parameters:**
- `id` - MongoDB story ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK) - Bookmark Added:**
```json
{
  "message": "Bookmark added",
  "bookmarks": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

**Response (200 OK) - Bookmark Removed:**
```json
{
  "message": "Bookmark removed",
  "bookmarks": [
    "507f1f77bcf86cd799439011"
  ]
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "No token provided"
}
```

---

### Get User Bookmarks

**Endpoint:** `GET /stories/bookmarks` ⚠️ **[Protected]**

**Description:** Fetch all bookmarked stories for authenticated user

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Bookmarks per page

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /stories/bookmarks?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "bookmarks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Show HN: My Amazing Project",
      "url": "https://example.com",
      "points": 1250,
      "author": "username",
      "postedAt": "2024-01-15T10:30:00Z",
      "hackerId": "id123456"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

## Scraper Endpoints

### Manual Scrape

**Endpoint:** `POST /scraper/scrape`

**Description:** Manually trigger Hacker News scraper

**Response (200 OK):**
```json
{
  "message": "Scraping completed successfully",
  "count": 10,
  "stories": [
    {
      "title": "Show HN: My Project",
      "url": "https://example.com",
      "points": 1250,
      "author": "username",
      "postedAt": "2024-01-15T10:30:00Z",
      "hackerId": "id123456"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "message": "Scraping failed"
}
```

---

## Health Check

### Server Health

**Endpoint:** `GET /health`

**Description:** Check if server is running

**Response (200 OK):**
```json
{
  "message": "Server is running"
}
```

---

## Error Responses

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required or failed |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

### Common Error Responses

**400 - Bad Request**
```json
{
  "message": "All fields are required"
}
```

**401 - Unauthorized**
```json
{
  "message": "Invalid token"
}
```

**404 - Not Found**
```json
{
  "message": "Story not found"
}
```

**500 - Internal Server Error**
```json
{
  "message": "Internal server error"
}
```

---

## cURL Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Stories
```bash
curl http://localhost:5000/api/stories
```

### Get Bookmarks (with token)
```bash
curl http://localhost:5000/api/stories/bookmarks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Toggle Bookmark
```bash
curl -X POST http://localhost:5000/api/stories/507f1f77bcf86cd799439011/bookmark \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Manual Scrape
```bash
curl -X POST http://localhost:5000/api/scraper/scrape
```

---

## Response Examples

### Successful Authentication Flow

1. **Register**
   - POST /auth/register → returns token
   - Save token in localStorage

2. **Use Token**
   - Include token in Authorization header for protected requests

3. **Protected Request**
   - GET /stories/bookmarks with Authorization header

### Rate Limiting

Currently no rate limiting. Consider adding for production.

### Pagination Details

Both `/stories` and `/stories/bookmarks` support pagination:
- Default page size: 10 items
- Max page size: Configurable (currently 10)
- Total count provided in response

### Token Expiration

- JWT tokens expire after **7 days**
- User needs to login again after expiration
- Token included in response for automatic refresh

---

## API Testing Tools

- **Thunder Client** (VS Code Extension) - GUI for API testing
- **Postman** - Popular API testing tool
- **cURL** - Command-line HTTP client
- **Insomnia** - REST client

## Next Steps

1. Test endpoints using cURL or Postman
2. Read [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md) for code structure
3. Check [BACKEND_SETUP.md](./BACKEND_SETUP.md) for configuration
4. Review [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for design details
