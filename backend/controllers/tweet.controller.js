import sharp from 'sharp';
import { Tweet } from '../models/tweet.model.js';
import { User } from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';

export const CreateTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    const image = req.file;
    if (!description || !id) {
      return res.status(401).json({
        message: 'Fields are required!',
        success: false,
      });
    }

    let imageUrl = '';
    if (image) {
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpg;base64,${optimizedImageBuffer.toString('base64')}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrl = cloudResponse.secure_url;
    }

    const user = await User.findById(id).select('-password');
    const tweet = await Tweet.create({
      description,
      image: imageUrl,
      userId: id,
      userDetails: {
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });

    return res.status(200).json({
      message: 'Tweet created successfully',
      success: true,
      tweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const DeleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
        success: false,
      });
    }
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: 'Tweet deleted successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const LikeOrDislike = async (req, res) => {
  try {
    const loginUserId = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
        success: false,
      });
    }
    if (tweet.like.includes(loginUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loginUserId } });
      return res.status(200).json({
        message: 'Tweet disliked',
        success: true,
      });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loginUserId } });
      return res.status(200).json({
        message: 'Tweet liked',
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const CommentOnTweet = async (req, res) => {
  try {
    const { id: userId, comment } = req.body;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
        success: false,
      });
    }
    const user = await User.findById(userId).select('name username profilePicture');
    await Tweet.findByIdAndUpdate(tweetId, {
      $push: {
        comment: {
          user: userId,
          text: comment,
          userDetails: {
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
          },
        },
      },
    });
    return res.status(200).json({
      message: 'Comment added successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const loggedInUserTweets = await Tweet.find({ userId: id });
    const followingUserTweets = loggedInUser.following.length > 0
      ? await Promise.all(
          loggedInUser.following.map(async (otherUsersId) => {
            const user = await User.findById(otherUsersId);
            if (user.isPrivate && !user.followers.includes(id)) {
              return [];
            }
            return Tweet.find({ userId: otherUsersId });
          })
        )
      : [];

    return res.status(200).json({
      tweets: [...loggedInUserTweets, ...followingUserTweets.flat()],
      message: 'All tweets retrieved',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loginUser = await User.findById(id);
    if (!loginUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const followingUserTweets = loginUser.following.length > 0
      ? await Promise.all(
          loginUser.following.map(async (otherUsersId) => {
            const user = await User.findById(otherUsersId);
            if (user.isPrivate && !user.followers.includes(id)) {
              return [];
            }
            return Tweet.find({ userId: otherUsersId });
          })
        )
      : [];

    return res.status(200).json({
      tweets: followingUserTweets.flat(),
      message: 'Following tweets retrieved',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};