import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquareMore,
  BookMarked,
  BadgeCheck,
  MoreHorizontal,
  Send,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
// import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getRefresh } from '@/redux/tweetSlice';
import axios from 'axios';
import { motion } from 'framer-motion';
import TweetComment from './tweetComment';

const Tweet = ({ tweet }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const likeOrDislikeHandler = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/like/${id}`,
        { id: user?._id },
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

  const bookmarkHandler = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bookmark/${id}`,
        { id: user?._id },
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

  const deleteTweetHandler = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/delete/${id}`,
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

  const commentHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/comment/${
          tweet?._id
        }`,
        { id: user?._id, comment: commentText },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(getRefresh());
        toast.success('Comment added');
        setCommentText('');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function timeSince(timestamp) {
    let time = Date.parse(timestamp);
    let now = Date.now();
    let secondsPast = (now - time) / 1000;
    let suffix = 'ago';
    let intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };
    for (let i in intervals) {
      let interval = intervals[i];
      if (secondsPast >= interval) {
        let count = Math.floor(secondsPast / interval);
        return `${count} ${i}${count > 1 ? 's' : ''} ${suffix}`;
      }
    }
  }

  const isDisabled = !commentText.trim();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 rounded-xl shadow-md shadow-gray-700 border border-gray-600 transition-shadow p-6"
    >
      <div className="flex items-start space-x-3">
        <img
          src={
            tweet?.userDetails[0]?.profilePicture ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
          }
          alt={tweet?.userDetails[0]?.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-600 truncate">
              {tweet?.userDetails[0]?.name}
            </h3>
            {tweet?.userDetails[0]?.verified && (
              <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
            <span className="text-gray-500 text-sm">
              @{tweet?.userDetails[0]?.username}
            </span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {timeSince(tweet?.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="leading-relaxed whitespace-pre-wrap">
              {tweet?.description}
            </p>
            <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {tweet?.image && (
            <div className="mt-4">
              <img
                src={tweet?.image}
                alt="Tweet content"
                className="w-full border border-gray-600 rounded-xl object-cover max-h-96"
              />
            </div>
          )}

          <div className="flex items-center justify-between my-4">
            <div className="flex gap-2 items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => likeOrDislikeHandler(tweet?._id)}
                className={`cursor-pointer p-2 hover:bg-primary/20 rounded-full ${
                  tweet?.like?.includes(user?._id) ? 'bg-red-600' : ''
                }`}
              >
                <Heart size={20} />
              </motion.div>
              <p className="font-bold text-md">{tweet?.like?.length || 0}</p>
            </div>

            <div className="flex gap-2 items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowComments(!showComments)}
                className="cursor-pointer p-2 hover:bg-primary/20 rounded-full"
              >
                <MessageCircle size={20} />
              </motion.div>
              <p>{tweet?.comment?.length || 0}</p>
            </div>

            <div className="flex gap-2 items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => bookmarkHandler(tweet?._id)}
                className={`cursor-pointer p-2 rounded-full ${
                  tweet?.bookmarks?.includes(user?._id) ? 'bg-green-600' : ''
                }`}
              >
                <Bookmark size={20} />
              </motion.div>
              <p>{tweet?.bookmarks?.length || 0}</p>
            </div>

            {user?._id === tweet?.userId && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => deleteTweetHandler(tweet?._id)}
                className="cursor-pointer p-2 rounded-full"
              >
                <MdDeleteForever size={20} />
              </motion.div>
            )}
          </div>

          {showComments && (
            <div className="mt-4">
              <form onSubmit={commentHandler} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="p-2 text-black bg-input border border-border rounded-lg text-foreground w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    isDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Comment
                    <Send size={16} />
                  </div>
                </motion.button>
              </form>
              {tweet?.comment?.map((comment, index) => (
                <TweetComment key={index} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default Tweet;
