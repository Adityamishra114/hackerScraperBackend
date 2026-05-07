import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { scrapeHackerNews } from './scraper/hackernewsScraper.js';
import authRoutes from './routes/authRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import scraperRoutes from './routes/scraperRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scraper', scraperRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Initial Scrape on Server Start
const startServer = async () => {
  try {
    console.log('Starting initial scrape...');
    await scrapeHackerNews();
    console.log('Initial scrape completed');
  } catch (error) {
    console.error('Initial scrape failed:', error.message);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

export default app;
