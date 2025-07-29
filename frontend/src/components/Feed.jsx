import React from 'react';
import CreateTweet from './CreateTweet';
import Tweet from './Tweet';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Feed = () => {
  const { tweets } = useSelector((store) => store.tweet);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 border-x border-slate-600 min-h-screen"
    >
      <CreateTweet />

      <div className="space-y-0">
        {tweets?.map((tweet, index) => (
          <motion.div
            key={tweet._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Tweet tweet={tweet} key={tweet._id} />
          </motion.div>
        ))}
      </div>

      {(!tweets || tweets?.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"></div>
          <p className="text-xl text-slate-400 mb-2">No posts yet</p>
          <p className="text-slate-500">Be the first to share something!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Feed;
