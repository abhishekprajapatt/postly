import React, { useState, useCallback, useMemo } from 'react';
import { Search, TrendingUp, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Avatar from 'react-avatar';

import useSearchUsers from '@/hooks/useSearchUsers';
import { getToggleFollowing, getRefreshUser } from '@/redux/userSlice';
// import { getfollowingUpdate,toggleFollowing, refreshUser } from '@/redux/userSlice';

// Constants
const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
const TRENDING_TOPICS = [
  { topic: '#SocialMedia', posts: '12.5K' },
  { topic: '#Technology', posts: '8.3K' },
  { topic: '#Design', posts: '5.7K' },
  { topic: '#React', posts: '4.2K' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const RightSidebar = () => {
  const navigate = useNavigate();
  const { user, profile, otherUsers } = useSelector(
    (store) => store?.user || {}
  );
  const dispatch = useSelector((store) => store.dispatch);
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useSearchUsers(searchQuery);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery || !otherUsers) return otherUsers?.slice(0, 3) || [];
    return otherUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, otherUsers]);

  // Memoized follow/unfollow handler
  const followOrUnfollowHandler = useCallback(
    async (userId) => {
      const url = profile?.isPrivate
        ? `/api/v1/user/followrequest/${userId}`
        : user?.following?.includes(userId)
        ? `/api/v1/user/unfollow/${userId}`
        : `/api/v1/user/follow/${userId}`;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}${url}`,
          { id: user?._id },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        if (res?.data?.success) {
          if (!profile?.isPrivate) {
            dispatch(getToggleFollowing(userId));
            dispatch(getRefreshUser());
          }
          toast.success(res?.data?.message || 'Action successful');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    },
    [user?._id, profile?.isPrivate, dispatch]
  );

  // Memoized navigate handler
  const handleProfileNavigation = useCallback(
    (userId) => navigate(`/profile/${userId}`),
    [navigate]
  );

  // Search input handler
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  if (!otherUsers) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden xl:block w-80 h-screen p-6 text-white"
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hidden xl:block w-80 h-screen p-4 space-y-4"
    >
      {/* Search Bar */}
      <div className="fixed z-10">
        <div className="flex items-center px-9 py-3 bg-slate-800/50 rounded-xl border border-slate-600">
          <Search size={20} className="text-slate-400 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent outline-none text-white w-full placeholder-slate-400"
            placeholder="Search users..."
            aria-label="Search users"
          />
        </div>
      </div>
      <div className="space-y-4 relative top-12">
        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Trending</h2>
          </div>
          <div className="space-y-3">
            {TRENDING_TOPICS.map((trend, index) => (
              <motion.div
                key={trend.topic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                onClick={() => navigate(`/search?q=${trend.topic}`)}
              >
                <p className="font-semibold text-blue-400">{trend.topic}</p>
                <p className="text-sm text-slate-400">{trend.posts} posts</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Who to Follow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              {searchQuery ? 'Search Results' : 'Who to follow'}
            </h2>
          </div>
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between"
                >
                  <button
                    className="flex items-center gap-3 flex-1"
                    onClick={() => handleProfileNavigation(user._id)}
                    aria-label={`View ${user.name}'s profile`}
                  >
                    <Avatar
                      src={user?.profilePicture || 'https://avatar.iran.liara.run/public'}
                      size="48"
                      round
                      alt={`${user.name}'s avatar`}
                    />
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm text-slate-400 truncate">
                        @{user.username || 'username'}
                      </p>
                    </div>
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => followOrUnfollowHandler(user._id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      user?.following?.includes(user._id)
                        ? 'bg-slate-700 text-white hover:bg-red-600 border border-slate-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {user?.following?.includes(user._id)
                      ? 'Following'
                      : profile?.isPrivate
                      ? 'Request'
                      : 'Follow'}
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400 text-center">No users found</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RightSidebar;
