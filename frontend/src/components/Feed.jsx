// import React from 'react';
// import CreateTweet from './CreateTweet';
// import Tweet from './Tweet';
// import { useSelector } from 'react-redux';

// const Feed = () => {
//   const { tweets } = useSelector((store) => store.tweet);
//   console.log('tweets',tweets)
//   return (
//     <div className="w-[100%] mx-auto border border-gray-200">
//       <div className="">
//         <CreateTweet />
//         {tweets?.map((tweet) => {
//           return <Tweet key={tweet?._id} tweet={tweet}/>;
//         })}
//       </div>
//     </div>
//   );
// };

// export default Feed;

// new
import React from 'react';
import CreateTweet from './CreateTweet';
import Tweet from './Tweet';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Feed = () => {
  const { tweets } = useSelector((store) => store.tweet);

  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   className="flex-1 border-x border-border lg:overflow-y-auto lg:h-screen px-1 sm:px-2 md:px-4"
    // >
    //   <CreateTweet />
    //   {tweets?.map((tweet) => (
    //     <Tweet key={tweet?._id} tweet={tweet} />
    //   ))}
    // </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 border-x w-auto border-border lg:overflow-y-auto lg:h-screen px-1 sm:px-2 md:px-4"
    >
      <CreateTweet />

      <div className="space-y-6 mb-[4%]">
        {tweets?.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            // onLike={onLike}
            // onShare={onShare}
          />
        ))}
      </div>

      {tweets?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No posts yet. Be the first to share something!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Feed;
