// new 
import React from 'react';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchResults = ({ users }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full md:w-[50%] mx-auto border-x border-border p-4"
    >
      <h1 className="font-bold text-xl text-foreground mb-4">Search Results</h1>
      {users?.length > 0 ? (
        users.map((user) => (
          <motion.div
            key={user?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-card rounded-lg mb-2"
          >
            <div className="flex items-center gap-2">
              <Avatar
                src={user?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
                size="40"
                round={true}
              />
              <div>
                <p className="font-bold text-foreground">{user?.name}</p>
                <p className="text-secondary-foreground text-sm">@{user?.username}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="px-4 py-1 bg-primary text-primary-foreground rounded-full"
            >
              View Profile
            </motion.button>
          </motion.div>
        ))
      ) : (
        <p className="text-secondary-foreground">No users found</p>
      )}
    </motion.div>
  );
};

export default SearchResults;