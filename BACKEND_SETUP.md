# Backend Setup Guide

## Prerequisites

- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn package manager
- Text editor or IDE (VS Code recommended)

## Installation Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages from `package.json`.

### Step 2: Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/hacker-news-scraper

# Authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### Step 3: Database Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition ([Instructions](https://docs.mongodb.com/manual/installation/))
2. Start MongoDB:

```bash
mongod
```

3. Verify connection in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/hacker-news-scraper
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string from Atlas dashboard
4. Update `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hacker-news-scraper
```

Replace `username` and `password` with your Atlas credentials.

### Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB connected successfully
Starting initial scrape...
Scraped and saved 10 stories
Initial scrape completed
```

## Environment Variables Explained

### Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port number |
| `NODE_ENV` | development | Environment mode |

### Database Configuration

| Variable | Example | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/...` | MongoDB connection string |

### Authentication

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for signing JWT tokens (use strong random string) |

## Verification Checklist

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] MongoDB running (if local): `mongod` command works
- [ ] Dependencies installed: `node_modules/` folder exists
- [ ] `.env` file created with values
- [ ] Server starts without errors: `npm run dev`
- [ ] Can access `http://localhost:5000/api/health`

## Available Scripts

### Development

```bash
npm run dev
```

Starts server with nodemon (auto-restarts on file changes).

### Production Build

```bash
npm start
```

Starts server without nodemon.

### Install Packages

```bash
npm install <package-name>
```

### Remove Packages

```bash
npm uninstall <package-name>
```

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Start MongoDB: `mongod`
2. Check MONGO_URI in `.env`
3. Ensure MongoDB service is running

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Kill process on port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Change PORT in `.env` to different port

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loaded

1. Ensure `.env` file is in `backend/` directory (not root)
2. Restart server after changing `.env`
3. Check `.env` syntax (no quotes around values usually)

## Security Considerations for Production

1. **JWT_SECRET**
   - Use strong random string (32+ characters)
   - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Never commit to git

2. **Database**
   - Use MongoDB Atlas for cloud database
   - Enable network access whitelist
   - Use strong credentials

3. **Environment**
   - Set `NODE_ENV=production`
   - Keep `.env` file secure
   - Don't log sensitive data

4. **CORS**
   - Set frontend URL in production
   - Update in `server.js`

## Next Steps

1. Read [BACKEND_API.md](./BACKEND_API.md) for API documentation
2. Read [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md) for development tips
3. Start the server and test endpoints
4. Check [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for code structure

## Support

For specific help:
- API endpoints: [BACKEND_API.md](./BACKEND_API.md)
- Development: [BACKEND_DEVELOPMENT.md](./BACKEND_DEVELOPMENT.md)
- Architecture: [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
