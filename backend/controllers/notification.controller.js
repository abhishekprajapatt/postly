import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

export const createFollowRequest = async (req, res) => {
  try {
    const { id: fromUserId } = req.body;
    const { id: toUserId } = req.params;

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (toUser.followers.includes(fromUserId)) {
      return res.status(400).json({
        message: 'Already following this user',
        success: false,
      });
    }

    const notification = await Notification.create({
      fromUser: fromUserId,
      toUser: toUserId,
      type: 'follow_request',
    });

    await User.findByIdAndUpdate(toUserId, {
      $push: { followRequests: notification._id },
    });

    return res.status(200).json({
      message: 'Follow request sent',
      success: true,
      notification,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

export const respondToFollowRequest = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const { accept } = req.body;

    const notification = await Notification.findById(notificationId).populate('fromUser toUser');
    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
        success: false,
      });
    }

    if (accept) {
      await User.findByIdAndUpdate(notification.toUser._id, {
        $push: { followers: notification.fromUser._id },
        $pull: { followRequests: notificationId },
      });
      await User.findByIdAndUpdate(notification.fromUser._id, {
        $push: { following: notification.toUser._id },
      });
      notification.status = 'accepted';
    } else {
      notification.status = 'rejected';
      await User.findByIdAndUpdate(notification.toUser._id, {
        $pull: { followRequests: notificationId },
      });
    }

    await notification.save();

    return res.status(200).json({
      message: `Follow request ${accept ? 'accepted' : 'rejected'}`,
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

export const getNotifications = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const notifications = await Notification.find({ toUser: userId, status: 'pending' })
      .populate('fromUser', 'name username profilePicture')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      notifications,
      message: 'Notifications retrieved successfully',
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