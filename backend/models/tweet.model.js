import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: { type: String },
    like: {
      type: Array,
      default: [],
    },
    comment: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          text: { type: String, required: true },
          userDetails: {
            name: String,
            username: String,
            profilePicture: String,
          },
        },
      ],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userDetails: {
      name: String,
      username: String,
      profilePicture: String,
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model('Tweet', tweetSchema);