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
        src={comment?.user?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
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