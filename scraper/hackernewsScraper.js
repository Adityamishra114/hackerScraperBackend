import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

const HACKER_NEWS_URL = 'https://news.ycombinator.com';
const STORIES_TO_SCRAPE = 10;

const scrapeHackerNews = async () => {
  try {
    const response = await axios.get(HACKER_NEWS_URL);
    const $ = cheerio.load(response.data);

    const stories = [];
    const rows = $('tr.athing');

    rows.slice(0, STORIES_TO_SCRAPE).each((index, element) => {
      const titleElement = $(element).find('span.titleline > a').first();
      const title = titleElement.text();
      const url = titleElement.attr('href');

      const subtext = $(element).next('tr').find('span.subtext');
      const pointsText = subtext.find('span.score').text();
      const points = parseInt(pointsText) || 0;

      const authorElement = subtext.find('a.hnuser');
      const author = authorElement.text() || 'Unknown';

      const ageElement = subtext.find('span.age');
      const ageTitle = ageElement.attr('title');
      const parsedDate = new Date(ageTitle);
      const postedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const hackerId = $(element).attr('id');

      if (title && url) {
        stories.push({
          title,
          url,
          points,
          author,
          postedAt,
          hackerId,
        });
      }
    });

    // Save stories to database
    for (const story of stories) {
      await Story.updateOne(
        { hackerId: story.hackerId },
        story,
        { upsert: true }
      );
    }

    console.log(`Scraped and saved ${stories.length} stories`);
    return stories;
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw error;
  }
};

export { scrapeHackerNews };
