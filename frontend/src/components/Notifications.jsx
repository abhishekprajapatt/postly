// new
import React from 'react';
import { useSelector } from 'react-redux';
import useGetNotifications from '@/hooks/useGetNotifications';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { tweetRefresh } from '@/redux/tweetSlice';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const { notifications } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useGetNotifications();

  const handleFollowRequest = async (notificationId, accept) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/notification/respond/${notificationId}`,
        { accept },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(tweetRefresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 border-x border-slate-600"
    >
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-md bg-slate-900/80 border-b border-slate-600 p-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-600">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-slate-800/20 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Notification Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* User Avatar */}
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={notification.user.profilePicture}
                alt={notification.user.name}
                className="w-10 h-10 rounded-full border-2 border-slate-600 cursor-pointer"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {notification.user.name}
                  </span>
                  <span className="text-slate-400">
                    @{notification.user.username}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 text-sm">
                    {notification.time}
                  </span>
                </div>

                <p className="text-slate-300 mb-2">{notification.content}</p>

                {notification.post && (
                  <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-600">
                    <p className="text-slate-300 text-sm">
                      {notification.post}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-12 h-12 text-slate-400" />
          </div>
          <p className="text-xl text-slate-400 mb-2">No notifications yet</p>
          <p className="text-slate-500">
            When you get notifications, they'll show up here.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Notifications;
