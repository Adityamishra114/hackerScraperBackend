import Story from '../models/Story.js';
import User from '../models/User.js';

const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments();

    res.status(200).json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    const storyId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
      await user.save();
      res.status(200).json({ message: 'Bookmark removed', bookmarks: user.bookmarks });
    } else {
      user.bookmarks.push(storyId);
      await user.save();
      res.status(200).json({ message: 'Bookmark added', bookmarks: user.bookmarks });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      options: {
        sort: { createdAt: -1 },
        skip,
        limit,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.bookmarks.length;

    res.status(200).json({
      bookmarks: user.bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllStories, getStoryById, toggleBookmark, getUserBookmarks };
