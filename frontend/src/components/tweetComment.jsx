import React from 'react';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';

const TweetComment = ({ comment }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 p-2 border-t border-border"
    >
      <Avatar
        src={comment?.user?.profilePicture || 'https://avatar.iran.liara.run/public'}
        size="40"
        round={true}
      />
      <div>
        <p className="font-bold text-foreground">{comment?.user?.name}</p>
        <p className="text-secondary-foreground text-sm">@{comment?.user?.username}</p>
        <p className="text-foreground">{comment?.text}</p>
      </div>
    </motion.div>
  );
};

export default TweetComment;