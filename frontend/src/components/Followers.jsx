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

const Followers = ({
  profileId,
  isOwnProfile,
  onClose,
  setFollowersExpanded,
  toggleFollowersFollowing,
}) => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((store) => store.user || {});
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const followers = profile?.followers || [];
  const isFollowingUser = (followerId) => user?.following?.includes(followerId);

  const handleRemoveFollower = useCallback(
    async (followerId) => {
      if (isOwnProfile) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/v1/user/removefollower/${profileId}`,
            { followerId },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          if (res.data.success) {
            dispatch(tweetRefresh());
            toast.success(res.data.message || 'Follower removed');
            if (onClose) onClose();
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Failed to remove follower'
          );
        }
      }
    },
    [profileId, isOwnProfile, dispatch, onClose]
  );

  const handleFollowUnfollow = useCallback(
    async (followerId) => {
      if (!isOwnProfile) {
        try {
          const endpoint = isFollowingUser(followerId)
            ? `/user/unfollow/${followerId}`
            : `/user/follow/${followerId}`;
          const res = await axios.post(
            `${API_BASE_URL}/api/v1${endpoint}`,
            { id: user?._id },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          if (res.data.success) {
            dispatch(getToggleFollowing(followerId));
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
      <div className="space-y-2 inset-0 mt-4 bg-black p-4 max-h-[40%] ">
        <X
          onClose={() => setFollowersExpanded(false)}
          onClick={() => toggleFollowersFollowing('followers')}
          className="text-white cursor-pointer"
        />

        <h3 className="font-semibold text-white">Followers</h3>
        {followers.length > 0 ? (
          followers.slice(0, 5).map((followerId, index) => (
            <motion.div
              key={followerId}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer"
              onClick={() => (window.location.href = `/profile/${followerId}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={`${
                    'https://avatar.iran.liara.run/public'
                  }?w=40&h=40&fit=crop&crop=face&seed=${followerId}`}
                  size="40"
                  round
                  alt={`User ${followerId}'s avatar`}
                />
                <div>
                  <p className="text-white font-medium">User {followerId}</p>
                  <p className="text-slate-400 text-sm">@user{followerId}</p>
                </div>
              </div>
              {isOwnProfile ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFollower(followerId);
                  }}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-red-600 text-white hover:bg-red-700"
                  aria-label={`Remove ${followerId} as follower`}
                >
                  Remove
                </motion.button>
              ) : (
                !isFollowingUser(followerId) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowUnfollow(followerId);
                    }}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    aria-label={`Follow ${followerId}`}
                  >
                    Follow
                  </motion.button>
                )
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">No followers yet</p>
        )}
      </div>
    </div>
  );
};

export default Followers;
