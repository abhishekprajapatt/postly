import React, { useState, useCallback, useMemo } from 'react';
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Trash2,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

import { tweetRefresh } from '@/redux/tweetSlice';

// Constants
const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Animation variants
const articleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const commentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

const Tweet = ({ tweet = {} }) => {
  const { user } = useSelector((store) => store.user || {});
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(
    tweet?.like?.includes(user?._id) || false
  );
  const [isBookmarked, setIsBookmarked] = useState(
    tweet?.bookmarks?.includes(user?._id) || false
  );
  const [likeCount, setLikeCount] = useState(tweet?.like?.length || 0);
  const [bookmarkCount, setBookmarkCount] = useState(
    tweet?.bookmarks?.length || 0
  );

  // Memoized user details
  const userDetails = useMemo(
    () => tweet.userDetails?.[0] || {},
    [tweet.userDetails]
  );

  // Memoized timeSince function
  const timeSince = useCallback((timestamp) => {
    if (!timestamp) return 'Just now';
    const secondsPast = (Date.now() - Date.parse(timestamp)) / 1000;
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      if (secondsPast >= seconds) {
        const count = Math.floor(secondsPast / seconds);
        return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  }, []);

  // Memoized API handlers
  const apiRequest = useCallback(
    async (method, endpoint, data = {}) => {
      try {
        const res = await axios({
          method,
          url: `${API_BASE_URL}/api/v1${endpoint}`,
          data,
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(tweetRefresh());
          toast.success(res.data.message || 'Action successful');
          return true;
        }
        return false;
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
        return false;
      }
    },
    [dispatch]
  );

  const likeOrDislikeHandler = useCallback(async () => {
    const success = await apiRequest('put', `/tweet/like/${tweet._id}`, {
      id: user?._id,
    });
    if (success) {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    }
  }, [tweet._id, user?._id, isLiked, apiRequest]);

  const bookmarkHandler = useCallback(async () => {
    const success = await apiRequest('put', `/user/bookmark/${tweet._id}`, {
      id: user?._id,
    });
    if (success) {
      setIsBookmarked((prev) => !prev);
      setBookmarkCount((prev) => (isBookmarked ? prev - 1 : prev + 1));
    }
  }, [tweet._id, user?._id, isBookmarked, apiRequest]);

  const deleteTweetHandler = useCallback(async () => {
    await apiRequest('delete', `/tweet/delete/${tweet._id}`);
  }, [tweet._id, apiRequest]);

  const commentHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      const success = await apiRequest('post', `/tweet/comment/${tweet._id}`, {
        id: user?._id,
        comment: commentText,
      });
      if (success) setCommentText('');
    },
    [tweet._id, user?._id, commentText, apiRequest]
  );

  const shareHandler = useCallback(async () => {
    try {
      await navigator.share({
        title: 'Check out this post',
        text: tweet.description,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, [tweet.description]);

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  const isDisabled = !commentText.trim();

  return (
    <motion.article
      variants={articleVariants}
      initial="hidden"
      animate="visible"
      className="border-b border-slate-600 p-6 hover:bg-slate-800/20 transition-colors"
    >
      <div className="flex items-start space-x-4">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={userDetails.profilePicture || 'https://avatar.iran.liara.run/public'}
          alt={userDetails.name || 'User'}
          className="w-12 h-12 rounded-full object-cover border-2 border-slate-600 cursor-pointer"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-white truncate">
                {userDetails.name || 'User'}
              </h3>
              {userDetails.verified && (
                <BadgeCheck
                  className="w-5 h-5 text-blue-400 flex-shrink-0"
                  aria-label="Verified user"
                />
              )}
              <span className="text-slate-400 text-sm truncate">
                @{userDetails.username || 'username'}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 text-sm">
                {timeSince(tweet.createdAt)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-300 p-2 hover:bg-slate-700/50 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal size={16} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="mt-2">
            <p className="text-white leading-relaxed whitespace-pre-wrap">
              {tweet.description || ''}
            </p>
            {tweet.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <img
                  src={tweet.image}
                  alt="Tweet content"
                  className="w-full rounded-2xl object-cover max-h-96 border border-slate-600"
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={likeOrDislikeHandler}
              className={`flex items-center gap-2 p-2 rounded-full transition-colors group ${
                isLiked
                  ? 'text-red-500 hover:bg-red-500/10'
                  : 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
              }`}
              aria-label={isLiked ? 'Unlike tweet' : 'Like tweet'}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              <span className="text-sm">{likeCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleComments}
              className="flex items-center gap-2 p-2 rounded-full text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
              aria-label={showComments ? 'Hide comments' : 'Show comments'}
            >
              <MessageCircle size={20} />
              <span className="text-sm">{tweet.comment?.length || 0}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={shareHandler}
              className="flex items-center gap-2 p-2 rounded-full text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition-colors"
              aria-label="Share tweet"
            >
              <Share size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={bookmarkHandler}
              className={`flex items-center gap-2 p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-yellow-500 hover:bg-yellow-500/10'
                  : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark tweet'}
            >
              <Bookmark
                size={20}
                className={isBookmarked ? 'fill-current' : ''}
              />
              <span className="text-sm">{bookmarkCount}</span>
            </motion.button>

            {user?._id === tweet.userId && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={deleteTweetHandler}
                className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="Delete tweet"
              >
                <Trash2 size={20} />
              </motion.button>
            )}
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                variants={commentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-4 border-t border-slate-600 pt-4"
              >
                <form onSubmit={commentHandler} className="flex gap-3 mb-4">
                  <img
                    src={user?.profilePicture || DEFAULT_PROFILE_IMAGE}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Comment input"
                    />
                    <motion.button
                      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                      type="submit"
                      disabled={isDisabled}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        isDisabled
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                      aria-label="Submit comment"
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </form>

                {tweet.comment?.length > 0 ? (
                  tweet.comment.map((comment, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl mb-2"
                    >
                      <img
                        src={
                          comment.user?.profilePicture || 'https://avatar.iran.liara.run/public'
                        }
                        alt={comment.user?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-sm truncate">
                            {comment.user?.name || 'User'}
                          </p>
                          <p className="text-slate-400 text-xs truncate">
                            @{comment.user?.username || 'username'}
                          </p>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">
                          {comment.text}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center">
                    No comments yet
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

export default Tweet;
