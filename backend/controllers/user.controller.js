import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: 'All fields are required',
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: 'User already exists',
        success: false,
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    await User.create({
      name,
      username,
      email,
      password: hashPassword,
      isPrivate: false,
    });

    return res.status(200).json({
      message: 'Account created successfully',
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Incorrect email',
        success: false,
      });
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Incorrect password',
        success: false,
      });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });
    return res
      .status(201)
      .cookie('token', token, { expiresIn: '1d', httpOnly: true })
      .json({
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          followers: user.followers,
          following: user.following,
          isPrivate: user.isPrivate,
        },
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

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie('token', '', { expires: new Date(Date.now()) })
      .json({
        message: 'Logout successful',
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

export const bookmarks = async (req, res) => {
  try {
    const loginUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loginUserId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }
    if (user.bookmarks.includes(tweetId)) {
      await User.findByIdAndUpdate(loginUserId, {
        $pull: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: 'Bookmark removed',
        success: true,
      });
    } else {
      await User.findByIdAndUpdate(loginUserId, {
        $push: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: 'Bookmark saved',
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

export const editProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, username, bio, profilePicture, bannerPicture, isPrivate } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bannerPicture) user.bannerPicture = bannerPicture;
    if (typeof isPrivate !== 'undefined') user.isPrivate = isPrivate;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bannerPicture: user.bannerPicture,
        followers: user.followers,
        following: user.following,
        isPrivate: user.isPrivate,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        success: false,
      });
    }
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bannerPicture: user.bannerPicture,
        followers: user.followers,
        following: user.following,
        isPrivate: user.isPrivate,
        bio: user.bio,
      },
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

export const getOthersUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const otherUsers = await User.find({ _id: { $ne: id } }).select('-password');
    if (!otherUsers) {
      return res.status(401).json({
        message: 'No other users found',
        success: false,
      });
    }
    return res.status(200).json({
      otherUsers: otherUsers.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        isPrivate: user.isPrivate,
      })),
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

export const follow = async (req, res) => {
  try {
    const loginUserId = req.body.id;
    const otherUserId = req.params.id;
    const loginUser = await User.findById(loginUserId);
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (otherUser.followers.includes(loginUserId)) {
      return res.status(400).json({
        message: `Already following ${otherUser.name}`,
        success: false,
      });
    }

    if (otherUser.isPrivate) {
      return res.status(403).json({
        message: 'Private profile, follow request required',
        success: false,
      });
    }

    await otherUser.updateOne({ $push: { followers: loginUserId } });
    await loginUser.updateOne({ $push: { following: otherUserId } });

    return res.status(200).json({
      message: `${loginUser.name} followed ${otherUser.name}`,
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

export const unfollow = async (req, res) => {
  try {
    const loginUserId = req.body.id;
    const otherUserId = req.params.id;
    const loginUser = await User.findById(loginUserId);
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (!loginUser.following.includes(otherUserId)) {
      return res.status(400).json({
        message: `Not following ${otherUser.name}`,
        success: false,
      });
    }

    await otherUser.updateOne({ $pull: { followers: loginUserId } });
    await loginUser.updateOne({ $pull: { following: otherUserId } });

    return res.status(200).json({
      message: `${loginUser.name} unfollowed ${otherUser.name}`,
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

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: 'Search query is required',
        success: false,
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    return res.status(200).json({
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        isPrivate: user.isPrivate,
      })),
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