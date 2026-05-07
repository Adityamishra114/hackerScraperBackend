import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getUserBookmarks,
} from '../controllers/storyController.js';

const router = express.Router();

router.get('/', getAllStories);
router.get('/bookmarks', authMiddleware, getUserBookmarks);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', authMiddleware, toggleBookmark);

export default router;
