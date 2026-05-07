import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      default: 'Unknown',
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    hackerId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Story', storySchema);
