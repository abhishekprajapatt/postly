import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Calendar, Edit3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import axios from 'axios';
import Avatar from 'react-avatar';

import useGetUserProfile from '@/hooks/useGetUserProfile';
import { getToggleFollowing } from '@/redux/userSlice';
import { tweetRefresh } from '@/redux/tweetSlice';
import EditProfile from './EditProfile';
import Tweet from './Tweet';
import Followers from './Followers';
import Following from './Following';

// Constants
const DEFAULT_PROFILE_IMAGE = 'https://avatar.iran.liara.run/public';
const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1200&h=400&fit=crop';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({ opacity: 1, y: 0, transition: { delay: index * 0.1 } }),
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [followersExpanded, setFollowersExpanded] = useState(false);
  const [followingExpanded, setFollowingExpanded] = useState(false);

  const { user, profile } = useSelector((store) => store.user || {});
  const { tweets } = useSelector((store) => store.tweet || {});
  const userTweets = useMemo(() => tweets?.filter((tweet) => tweet.userId === id) || [], [tweets, id]);

  useGetUserProfile(id);

  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following?.includes(id);

  const followOrUnfollowHandler = useCallback(async () => {
    try {
      const endpoint = profile?.isPrivate
        ? `/user/followrequest/${id}`
        : isFollowing
        ? `/user/unfollow/${id}`
        : `/user/follow/${id}`;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1${endpoint}`,
        { id: user?._id },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data.success) {
        if (!profile?.isPrivate) {
          dispatch(getToggleFollowing(id));
          dispatch(tweetRefresh());
        }
        toast.success(res.data.message || 'Follow status updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    }
  }, [id, user?._id, profile?.isPrivate, isFollowing, dispatch]);

  const likeOrDislikeHandler = useCallback(
    async (tweetId) => {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/like/${tweetId}`,
          { id: user?._id },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        if (res.data.success) {
          dispatch(tweetRefresh());
          toast.success(res.data.message || 'Like updated');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to like/unlike tweet');
      }
    },
    [user?._id, dispatch]
  );

  const deleteTweetHandler = useCallback(
    async (tweetId) => {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/delete/${tweetId}`,
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        if (res.data.success) {
          dispatch(tweetRefresh());
          toast.success(res.data.message || 'Tweet deleted');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete tweet');
      }
    },
    [dispatch]
  );

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

  const canViewProfile = !profile?.isPrivate || isOwnProfile || isFollowing;

  const toggleFollowersFollowing = useCallback(
    (type) => {
      const isFollowers = type === 'followers';
      const element = isFollowers ? '.followers-list' : '.following-list';
      const isExpanded = isFollowers ? followersExpanded : followingExpanded;
      if (isFollowers) setFollowersExpanded((prev) => !prev);
      else setFollowingExpanded((prev) => !prev);
      gsap.to(element, {
        height: isExpanded ? 0 : 'auto',
        opacity: isExpanded ? 0 : 1,
        duration: 0.3,
      });
    },
    [followersExpanded, followingExpanded]
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 border-x border-slate-600"
    >
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-900/80 border-b border-slate-600 p-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-slate-800"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-white">{profile?.name || 'User'}</h1>
            <p className="text-sm text-slate-400">{userTweets.length} posts</p>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="relative">
        <div className="h-48 md:h-64 relative overflow-hidden">
          <img
            src={profile?.bannerPicture || DEFAULT_BANNER_IMAGE}
            alt={`${profile?.name || 'User'}'s banner`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Avatar
                src={profile?.profilePicture || 'https://avatar.iran.liara.run/public'}
                size="128"
                round
                alt={`${profile?.name || 'User'}'s avatar`}
                className="border-4 overflow-hidden border-slate-900 bg-slate-900"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              {isOwnProfile ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditOpen(true)}
                  className="px-6 py-2 border border-slate-500 text-white rounded-full hover:bg-slate-800 flex items-center gap-2"
                  aria-label="Edit profile"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={followOrUnfollowHandler}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isFollowing
                      ? 'bg-slate-700 text-white hover:bg-red-600 border border-slate-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  aria-label={isFollowing ? `Unfollow ${profile?.name}` : profile?.isPrivate ? `Request to follow ${profile?.name}` : `Follow ${profile?.name}`}
                >
                  {isFollowing
                    ? 'Following'
                    : profile?.isPrivate
                    ? 'Request'
                    : 'Follow'}
                </motion.button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h1>
              <p className="text-slate-400">@{profile?.username || 'username'}</p>
            </div>

            {profile?.bio && <p className="text-white leading-relaxed">{profile.bio}</p>}

            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Joined {profile?.joinDate || 'Unknown'}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleFollowersFollowing('following')}
                className="text-white hover:underline"
                aria-label="View following"
              >
                <span className="font-bold">{profile?.following?.length || 0}</span>
                <span className="text-slate-400 ml-1">Following</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleFollowersFollowing('followers')}
                className="text-white hover:underline"
                aria-label="View followers"
              >
                <span className="font-bold">{profile?.followers?.length || 0}</span>
                <span className="text-slate-400 ml-1">Followers</span>
              </motion.button>
            </div>

            {/* Followers List */}
            <div className="followers-list h-0 overflow-hidden opacity-0">
              <Followers profileId={id} isOwnProfile={isOwnProfile} onClose={() => setFollowersExpanded(false)} toggleFollowersFollowing={toggleFollowersFollowing} />
            </div>

            {/* Following List */}
            <div className="following-list h-0 overflow-hidden opacity-0">
              <Following profileId={id} isOwnProfile={isOwnProfile} onClose={() => setFollowingExpanded(false)} toggleFollowersFollowing={toggleFollowersFollowing} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="border-t border-slate-600">
        <div className="sticky top-[73px] backdrop-blur-md bg-slate-900/80 border-b border-slate-600">
          <div className="flex">
            <button className="flex-1 p-4 text-center font-semibold text-white border-b-2 border-blue-500">
              Posts
            </button>
            <button className="flex-1 p-4 text-center font-semibold text-slate-400 hover:text-slate-300">
              Replies
            </button>
            <button className="flex-1 p-4 text-center font-semibold text-slate-400 hover:text-slate-300">
              Media
            </button>
          </div>
        </div>

        {canViewProfile ? (
          userTweets.length > 0 ? (
            userTweets.map((tweet, index) => (
              <motion.div
                key={tweet._id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Tweet
                  tweet={tweet}
                  onLike={likeOrDislikeHandler}
                  onDelete={deleteTweetHandler}
                  timeSince={timeSince}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-xl text-slate-400 mb-2">No posts yet</p>
              <p className="text-slate-500">
                {isOwnProfile ? 'Share your first thought!' : "This user hasn't posted anything yet."}
              </p>
            </motion.div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-slate-400">This profile is private</p>
            <p className="text-slate-500">Follow to see their posts</p>
          </motion.div>
        )}
      </div>

      {editOpen && <EditProfile user={profile} onClose={() => setEditOpen(false)} />}
    </motion.div>
  );
};

export default Profile;