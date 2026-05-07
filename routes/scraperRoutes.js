import express from 'express';
import { scrapeHackerNews } from '../scraper/hackernewsScraper.js';

const router = express.Router();

router.post('/scrape', async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.status(200).json({
      message: 'Scraping completed successfully',
      count: stories.length,
      stories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
