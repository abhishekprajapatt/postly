import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';

import { motion } from 'framer-motion';
import useSearchUsers from '@/hooks/useSearchUsers';

const RightSidebar = () => {
  const { user, profile, otherUsers } = useSelector(
    (store) => store?.user || {}
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useSearchUsers(searchQuery);

  const followOrUnfollowHandler = async () => {
    if (profile?.isPrivate) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followrequest/${id}`,
          { id: user?._id },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          toast.success('Follow request sent');
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      try {
        const res = await axios.post(
          user?.following?.includes(id)
            ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/unfollow/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/follow/${id}`,
          { id: user?._id },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(getfollowingUpdate(id));
          dispatch(getRefresh());
          toast.success(res?.data?.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  if (!otherUsers) return <div className="text-foreground">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden md:block w-[30%] mx-auto mt-4 px-4"
    >
      <div className="flex items-center p-2 bg-card rounded-full border border-border">
        <Search size={20} className="text-secondary-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none px-2 text-foreground w-full"
          placeholder="Search users..."
        />
      </div>
      {searchQuery ? (
        <div className="my-4 p-4 bg-card rounded-2xl">
          <h1 className="font-bold text-lg text-foreground">Search Results</h1>
          {searchResults?.length > 0 ? (
            searchResults.map((user) => (
              <motion.div
                key={user?._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between my-2"
              >
                <button
                  className="flex items-center space-x-3"
                  onClick={() => navigate(`/profile/${user?._id}`)}
                >
                  <Avatar
                    src={
                      user?.profilePicture ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
                    }
                    size="40"
                    round={true}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semiboldtruncate">{user?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      @{user?.username}
                    </p>
                  </div>
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                  View Profile
                </motion.button>
              </motion.div>
            ))
          ) : (
            <p className="text-secondary-foreground">No users found</p>
          )}
        </div>
      ) : (
        <div className="bg-black/40 rounded-xl shadow-md shadow-gray-700 border border-gray-600 overflow-hidden mt-4">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="mr-2" size={20} />
              Who to follow
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {otherUsers?.map((user) => (
              <div
                key={user?._id}
                className="flex items-center justify-between"
              >
                <button
                  className="flex items-start space-x-3"
                  onClick={() => navigate(`/profile/${user?._id}`)}
                >
                  <Avatar
                    src={
                      user?.profilePicture ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
                    }
                    size="40"
                    round={true}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{user?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      @{user?.username}
                    </p>
                  </div>
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={followOrUnfollowHandler}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                  {user?.following?.includes(id)
                    ? 'Following'
                    : profile?.isPrivate
                    ? 'Request to Follow'
                    : 'Follow'}
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RightSidebar;
