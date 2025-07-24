// new 
import React from 'react';
import { useSelector } from 'react-redux';
import useGetNotifications from '@/hooks/useGetNotifications';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getRefresh } from '@/redux/tweetSlice';

const Notifications = () => {
  const { notifications } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useGetNotifications();

  const handleFollowRequest = async (notificationId, accept) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/notification/respond/${notificationId}`,
        { accept },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(getRefresh());
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
      className="w-full md:w-[50%] mx-auto border-x border-border p-4"
    >
      <h1 className="font-bold text-xl text-foreground mb-4">Notifications</h1>
      {notifications?.length > 0 ? (
        notifications.map((notification) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-card rounded-lg mb-2"
          >
            <div className="flex items-center gap-2">
              <Avatar
                src={notification?.fromUser?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
                size="40"
                round={true}
              />
              <div>
                <p className="text-foreground">{notification?.fromUser?.name} sent you a follow request</p>
                <p className="text-secondary-foreground text-sm">@{notification?.fromUser?.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFollowRequest(notification._id, true)}
                className="px-4 py-1 bg-primary text-primary-foreground rounded-full"
              >
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFollowRequest(notification._id, false)}
                className="px-4 py-1 bg-secondary text-secondary-foreground rounded-full"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-secondary-foreground">No notifications</p>
      )}
    </motion.div>
  );
};

export default Notifications;