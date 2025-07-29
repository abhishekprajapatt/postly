import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Avatar from 'react-avatar';

import { getToggleFollowing } from '@/redux/userSlice';
import { tweetRefresh } from '@/redux/tweetSlice';
import { X } from 'lucide-react';

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

const Following = ({ profileId, isOwnProfile, onClose,setFollowingExpanded, toggleFollowersFollowing }) => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((store) => store.user || {});
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const following = profile?.following || [];
  const isFollowingUser = (followingId) =>
    user?.following?.includes(followingId);

  const handleUnfollow = useCallback(
    async (followingId) => {
      if (isOwnProfile) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/v1/user/unfollow/${followingId}`,
            { id: user?._id },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          if (res.data.success) {
            dispatch(getToggleFollowing(followingId));
            dispatch(tweetRefresh());
            toast.success(res.data.message || 'Unfollowed successfully');
            if (onClose) onClose();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to unfollow');
        }
      }
    },
    [profileId, isOwnProfile, user?._id, dispatch, onClose]
  );

  const handleFollowUnfollow = useCallback(
    async (followingId) => {
      if (!isOwnProfile) {
        try {
          const endpoint = isFollowingUser(followingId)
            ? `/user/unfollow/${followingId}`
            : `/user/follow/${followingId}`;
          const res = await axios.post(
            `${API_BASE_URL}/api/v1${endpoint}`,
            { id: user?._id },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          if (res.data.success) {
            dispatch(getToggleFollowing(followingId));
            dispatch(tweetRefresh());
            toast.success(res.data.message || 'Follow status updated');
            if (onClose) onClose();
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Failed to update follow status'
          );
        }
      }
    },
    [isOwnProfile, user?._id, dispatch, onClose]
  );

  return (
    <div className="fixed flex flex-col items-center justify-center">
      <div className="space-y-2 mt-4 inset-0 bg-black p-4 max-h-[40%] ">
        <X onClick={() => toggleFollowersFollowing('following')} onClose={() => setFollowingExpanded(false)} className="text-white cursor-pointer" />
        <h3 className="font-semibold text-white">Following</h3>
        {following.length > 0 ? (
          following.slice(0, 5).map((followingId, index) => (
            <motion.div
              key={followingId}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer"
              onClick={() => (window.location.href = `/profile/${followingId}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={`${
                    'https://avatar.iran.liara.run/public'
                  }?w=40&h=40&fit=crop&crop=face&seed=${followingId}`}
                  size="40"
                  round
                  alt={`User ${followingId}'s avatar`}
                />
                <div>
                  <p className="text-white font-medium">User {followingId}</p>
                  <p className="text-slate-400 text-sm">@user{followingId}</p>
                </div>
              </div>
              {isOwnProfile && isFollowingUser(followingId) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnfollow(followingId);
                  }}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-red-600 text-white hover:bg-red-700"
                  aria-label={`Unfollow ${followingId}`}
                >
                  Unfollow
                </motion.button>
              )}
              {!isOwnProfile && !isFollowingUser(followingId) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowUnfollow(followingId);
                  }}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  aria-label={`Follow ${followingId}`}
                >
                  Follow
                </motion.button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">Not following anyone yet</p>
        )}
      </div>
    </div>
  );
};

export default Following;
