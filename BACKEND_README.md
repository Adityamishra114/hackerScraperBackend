# Backend Documentation

## Overview

The backend is built with Node.js, Express, and MongoDB. It provides REST APIs for user authentication, story management, and Hacker News scraping.

**Quick Info:**
- **Port**: 5000
- **Runtime**: Node.js v14+
- **Database**: MongoDB
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Setup & Configuration](#setup--configuration)
4. [API Endpoints](#api-endpoints)
5. [Development](#development)
6. [Architecture](#architecture)

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`

## Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   └── storyController.js       # Story operations
├── middleware/
│   └── auth.js                  # JWT authentication
├── models/
│   ├── User.js                  # User schema
│   └── Story.js                 # Story schema
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── storyRoutes.js           # Story endpoints
│   └── scraperRoutes.js         # Scraper endpoints
├── scraper/
│   └── hackernewsScraper.js     # Hacker News scraper
├── utils/
│   └── tokenUtils.js            # JWT utilities
├── server.js                    # Express setup
├── package.json
├── .env                         # Environment variables
└── .env.example                 # Example .env
```

## Setup & Configuration

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed setup instructions and environment configuration.

## API Endpoints

See [BACKEND_API.md](./BACKEND_API.md) for complete API documentation with examples.

**Quick Reference:**
- Authentication: `POST /api/auth/register`, `POST /api/auth/login`
- Stories: `GET /api/stories`, `POST /api/stories/:id/bookmark`
- Scraper: `POST /api/scraper/scrape`

## Development

See [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md) for development best practices, common tasks, and debugging tips.

## Architecture

See [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for detailed architecture, data flow, and design patterns.

## Key Features

✅ **Authentication System**
- User registration with bcrypt password hashing
- JWT-based login with 7-day token expiration
- Protected routes with middleware verification

✅ **Web Scraper**
- Automated Hacker News scraping on server start
- Manual scrape trigger via API endpoint
- Extracts title, URL, points, author, timestamp

✅ **Story Management**
- Fetch stories with pagination
- Toggle bookmarks for authenticated users
- Get user-specific bookmarks

✅ **Security**
- Password hashing with bcryptjs
- JWT token verification
- CORS configuration
- Input validation

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hacker-news-scraper
JWT_SECRET=your_jwt_secret_key_change_this
NODE_ENV=development
```

See `.env.example` for template.

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Express | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| axios | HTTP client |
| cheerio | HTML parsing |
| dotenv | Environment config |
| nodemon | Dev auto-reload |

## Running in Production

1. Build dependencies: `npm install --production`
2. Set `NODE_ENV=production`
3. Use strong `JWT_SECRET`
4. Connect to MongoDB Atlas
5. Deploy to Heroku, Railway, or similar

## Support

For detailed guides:
- Setup: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- APIs: See [BACKEND_API.md](./BACKEND_API.md)
- Development: See [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md)
- Architecture: See [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
