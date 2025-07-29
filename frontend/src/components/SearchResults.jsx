import React, { useState, useCallback, useMemo } from 'react';
import { Hash, Search, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from 'react-avatar';

// Constants
const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
const USER_TOPICS = [
  { tag: '#WebDevelopment', posts: '25.4K', trending: true },
  { tag: '#React', posts: '18.7K', trending: true },
  { tag: '#JavaScript', posts: '45.2K', trending: false },
  { tag: '#CSS', posts: '12.9K', trending: true },
  { tag: '#TypeScript', posts: '8.3K', trending: false },
];

const TABS = [
  { id: 'users', label: 'People', icon: Users },
  { id: 'topics', label: 'Topics', icon: Hash },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

const SearchResults = ({ users = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Memoized filtered data
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return USER_TOPICS.filter((topic) => topic.trending);
    return USER_TOPICS.filter((topic) =>
      topic.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Memoized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 border-x border-slate-600"
    >
      {/* Header with Search */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-900/80 border-b border-slate-600 p-4">
        <div className="flex items-center gap-4 mb-4">
          <Search className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Search</h1>
        </div>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for people, topics, or posts..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search for users or topics"
          />
        </div>
        <div className="flex mt-4 border-b border-slate-600">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              aria-label={`Switch to ${tab.label} tab`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Results */}
      <div className="p-4">
        {searchQuery === '' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Search Social</h2>
            <p className="text-slate-400 mb-8">Find people, topics, and conversations</p>
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {filteredTopics.map((topic, index) => (
                  <motion.div
                    key={topic.tag}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => handleNavigation(`/search?q=${topic.tag}`)}
                  >
                    <div>
                      <p className="font-semibold text-blue-400">{topic.tag}</p>
                      <p className="text-sm text-slate-400">{topic.posts} posts</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'users' && (
              <>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.div
                      key={user._id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                    >
                      <button
                        className="flex items-center gap-4 flex-1 text-left"
                        onClick={() => handleNavigation(`/profile/${user._id}`)}
                        aria-label={`View ${user.name || 'user'}'s profile`}
                      >
                        <Avatar
                          src={user.profilePicture || DEFAULT_PROFILE_IMAGE}
                          size="48"
                          round
                          alt={`${user.name || 'User'}'s avatar`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white truncate">
                              {user.name || 'User'}
                            </h3>
                            {user.verified && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-label="Verified user"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm truncate">@{user.username || 'username'}</p>
                          {user.bio && (
                            <p className="text-slate-300 text-sm truncate">{user.bio}</p>
                          )}
                          <p className="text-slate-500 text-xs">
                            {(user.followers || 0).toLocaleString()} followers
                          </p>
                        </div>
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigation(`/profile/${user._id}`)}
                        className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-slate-200 transition-colors"
                        aria-label={`View ${user.name || 'user'}'s profile`}
                      >
                        View
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-8"
                  >
                    <p className="text-slate-400">No users found for "{searchQuery}"</p>
                  </motion.div>
                )}
              </>
            )}
            {activeTab === 'topics' && (
              <>
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, index) => (
                    <motion.div
                      key={topic.tag}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => handleNavigation(`/search?q=${topic.tag}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-blue-400 text-lg">{topic.tag}</p>
                            {topic.trending && (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-slate-400">{topic.posts} posts</p>
                        </div>
                        <Hash className="w-6 h-6 text-slate-500" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-8"
                  >
                    <p className="text-slate-400">No topics found for "{searchQuery}"</p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResults;