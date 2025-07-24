// import React, { useState } from 'react';
// import {
//   ArrowLeft,
//   BookMarked,
//   MessageSquareMore,
//   ThumbsUp,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Avatar from 'react-avatar';
// import { useDispatch, useSelector } from 'react-redux';
// import useGetUserProfile from '@/hooks/useGetUserProfile';
// import toast from 'react-hot-toast';
// import { getfollowingUpdate } from '@/redux/userSlice';
// import axios from 'axios';
// import { getRefresh } from '@/redux/tweetSlice';
// import EditProfile from './EditProfile';
// import { MdDeleteForever } from 'react-icons/md';

// const Profile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const [editOpen, setEditOpen] = useState(false);
//   const { user, profile } = useSelector((store) => store.user);
//   const { tweets } = useSelector((store) => store?.tweet);
//   const userTweets = tweets?.filter((tweet) => tweet.user?._id === user?.id);
//   useGetUserProfile(id);
//   const followOrUnfollowHandler = async () => {
//     if (user?.following?.includes(id)) {
//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/unfollow/${id}`,
//           { id: user?._id },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             withCredentials: true,
//           }
//         );
//         if (res?.data?.success) {
//           dispatch(getfollowingUpdate(id));
//           dispatch(getRefresh());
//           toast?.success(res?.data?.message);
//         }
//       } catch (error) {
//         console.log(error);
//         toast.error(error.response.data.message);
//       }
//     } else {
//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/follow/${id}`,
//           { id: user?._id },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             withCredentials: true,
//           }
//         );
//         if (res?.data?.success) {
//           dispatch(getfollowingUpdate(id));
//           dispatch(getRefresh());
//           toast?.success(res?.data?.message);
//         }
//       } catch (error) {
//         console.log(error);
//         toast.error(error.response.data.message);
//       }
//     }
//   };

//   const EditOpen = () => {
//     setEditOpen(!editOpen);
//   };

//   const likeOrDislikeHandler = async (id) => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/like/${id}`,
//         { id: user?._id },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         dispatch(getRefresh());
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   const deleteTweetHandler = async (id) => {
//     try {
//       const res = await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/delete/${id}`,
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         dispatch(getRefresh());
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   function timeSince(timestamp) {
//     let time = Date.parse(timestamp);
//     let now = Date.now();
//     let secondsPast = (now - time) / 1000;
//     let suffix = 'ago';

//     let intervals = {
//       year: 31536000,
//       month: 2592000,
//       week: 604800,
//       day: 86400,
//       hour: 3600,
//       minute: 60,
//       second: 1,
//     };

//     for (let i in intervals) {
//       let interval = intervals[i];
//       if (secondsPast >= interval) {
//         let count = Math.floor(secondsPast / interval);
//         return `${count} ${i} ${count > 1 ? 's' : ''} ${suffix}`;
//       }
//     }
//   }
//   return (
//     <div className="md:w-[50%] w-full border-l border-r border-gray-200 mt-[-2rem] mb-12">
//       <div>
//         <div className="flex items-center py-2">
//           <div className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
//             <ArrowLeft onClick={() => navigate('/')} />
//           </div>
//           <div className="ml-2">
//             <h className="font-bold text-lg">{profile?.name || 'username'}</h>
//             <p className="text-gray-500 text-sm">{'20 posts'}</p>
//           </div>
//         </div>
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s"
//           alt="banner"
//           className="w-full h-[8rem] md:h-[14rem]"
//         />
//         <div className="relative -top-20 ml-2 border- border-white rounded-full">
//           <Avatar
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s"
//             className=""
//             round={true}
//           />
//           <div className="flex m-4">
//             <div className="w-[20rem] mx-2">
//               <div className="">
//                 <h1 className="font-bold text-xl">{profile?.name}</h1>
//                 <p className="">{`@${profile?.username}`}</p>
//               </div>
//               <p className="text-sm md:w-[20rem]">
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                 Adipisci, soluta!
//               </p>
//             </div>
//             <div className="text-right">
//               {profile?._id === user?._id ? (
//                 <button
//                   onClick={() => EditOpen(true)}
//                   className="px-4 py-1 rounded-full border border-gray-400 text-xs"
//                 >
//                   Edit Profile
//                 </button>
//               ) : (
//                 <button
//                   onClick={followOrUnfollowHandler}
//                   className="px-4 py-1 rounded-full border text-white bg-gray-800 hover:bg-gray-700 border-gray-400"
//                 >
//                   {user?.following?.includes(id) ? 'following' : 'follow'}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="mt-[-4rem]">
//           {userTweets?.map(
//             ({
//               _id,
//               userDetails,
//               description,
//               image,
//               like,
//               comment,
//               bookmarks,
//               createdAt,
//               userId,
//             }) => (
//               <div key={_id} className="border-t border-gray-200 p-4">
//                 <div className="flex">
//                   <Avatar
//                     src={
//                       userDetails?.[0]?.profilePic ||
//                       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
//                     }
//                     size="50"
//                     round={true}
//                   />
//                   <div className="ml-3 w-full">
//                     {/* User Info */}
//                     <div className="flex items-center">
//                       <h1 className="font-bold">{userDetails?.[0]?.name}</h1>
//                       <p className="text-gray-500 text-sm ml-2">
//                         @{userDetails?.[0]?.username} · {timeSince(createdAt)}
//                       </p>
//                     </div>
//                     <div className="my-3">
//                       <p>{description}</p>
//                     </div>
//                     {image && (
//                       <img
//                         className="w-full rounded-2xl"
//                         src={image}
//                         alt="Tweet"
//                       />
//                     )}
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex gap-2 items-center">
//                         <div
//                           onClick={() => likeOrDislikeHandler(_id)}
//                           className={`cursor-pointer p-2 hover:bg-blue-200 rounded-full ${
//                             like?.length ? 'bg-blue-300' : ''
//                           }`}
//                         >
//                           <ThumbsUp size={'25px'} />
//                         </div>
//                         <p>{like?.length || 0}</p>
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <div className="cursor-pointer p-2 hover:bg-blue-200 rounded-full">
//                           <MessageSquareMore size={'25px'} />
//                         </div>
//                         <p>{comment?.length || 0}</p>
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <div className="cursor-pointer p-2 hover:bg-green-200 rounded-full">
//                           <BookMarked size={'25px'} />
//                         </div>
//                         <p>{bookmarks?.length || 0}</p>
//                       </div>
//                       {user?._id === userId && (
//                         <div
//                           onClick={() => deleteTweetHandler(_id)}
//                           className="flex gap-2 items-center cursor-pointer p-2 hover:bg-red-200 rounded-full"
//                         >
//                           <MdDeleteForever size={'25px'} />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {editOpen && <EditProfile />}
//     </div>
//   );
// };

// export default Profile;


// new
import React, { useState } from 'react';
import { ArrowLeft, BookMarked, MessageSquareMore, ThumbsUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import toast from 'react-hot-toast';
import { getfollowingUpdate } from '@/redux/userSlice';
import axios from 'axios';
import { getRefresh } from '@/redux/tweetSlice';
import EditProfile from './EditProfile';
import { MdDeleteForever } from 'react-icons/md';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const { user, profile } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const userTweets = tweets?.filter((tweet) => tweet.userId === id);
  useGetUserProfile(id);

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

  const handleFollowerClick = () => {
    gsap.to('.followers-list', { height: 'auto', duration: 0.3 });
  };

  const handleFollowingClick = () => {
    gsap.to('.following-list', { height: 'auto', duration: 0.3 });
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
        return `${count} ${i} ${count > 1 ? 's' : ''} ${suffix}`;
      }
    }
  }

  const canViewProfile = profile?.isPrivate
    ? user?._id === id || user?.following?.includes(id)
    : true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full md:w-[50%] border-x border-border"
    >
      <div className="p-4">
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full hover:bg-secondary/50 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ArrowLeft />
          </motion.div>
          <div className="ml-4">
            <h1 className="font-bold text-xl text-foreground">{profile?.name || 'username'}</h1>
            <p className="text-secondary-foreground text-sm">{userTweets?.length || 0} posts</p>
          </div>
        </div>
        <img
          src={profile?.bannerPicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
          alt="banner"
          className="w-full h-[8rem] md:h-[14rem] object-cover rounded-lg"
        />
        <div className="relative -top-16 ml-4">
          <Avatar
            src={profile?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
            size="100"
            round={true}
            className="border-4 border-background"
          />
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="font-bold text-xl text-foreground">{profile?.name}</h1>
              <p className="text-secondary-foreground">@{profile?.username}</p>
              <p className="text-sm text-foreground mt-2">{profile?.bio}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={handleFollowerClick} className="text-secondary-foreground">
                  {profile?.followers?.length || 0} Followers
                </button>
                <button onClick={handleFollowingClick} className="text-secondary-foreground">
                  {profile?.following?.length || 0} Following
                </button>
              </div>
            </div>
            {profile?._id === user?._id ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditOpen(true)}
                className="px-4 py-1 rounded-full border border-border text-foreground"
              >
                Edit Profile
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={followOrUnfollowHandler}
                className="px-4 py-1 rounded-full bg-primary text-primary-foreground"
              >
                {user?.following?.includes(id) ? 'Following' : profile?.isPrivate ? 'Request to Follow' : 'Follow'}
              </motion.button>
            )}
          </div>
          <div className="followers-list h-0 overflow-hidden">
            {profile?.followers?.map((followerId) => (
              <div key={followerId} className="flex items-center gap-2 p-2" onClick={() => navigate(`/profile/${followerId}`)}>
                <Avatar size="40" round={true} />
                <p className="text-foreground">User {followerId}</p>
              </div>
            ))}
          </div>
          <div className="following-list h-0 overflow-hidden">
            {profile?.following?.map((followingId) => (
              <div key={followingId} className="flex items-center gap-2 p-2" onClick={() => navigate(`/profile/${followingId}`)}>
                <Avatar size="40" round={true} />
                <p className="text-foreground">User {followingId}</p>
              </div>
            ))}
          </div>
        </div>
        {editOpen && <EditProfile user={profile} onUpdate={() => setEditOpen(false)} />}
        {canViewProfile ? (
          <div className="mt-4">
            {userTweets?.map((tweet) => (
              <div key={tweet._id} className="border-t border-border p-4">
                <div className="flex">
                  <Avatar
                    src={profile?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'}
                    size="50"
                    round={true}
                  />
                  <div className="ml-3 w-full">
                    <div className="flex items-center">
                      <h1 className="font-bold text-foreground">{profile?.name}</h1>
                      <p className="text-secondary-foreground text-sm ml-2">
                        @{profile?.username} · {timeSince(tweet.createdAt)}
                      </p>
                    </div>
                    <div className="my-3">
                      <p>{tweet.description}</p>
                    </div>
                    {tweet.image && (
                      <img
                        className="w-full rounded-2xl"
                        src={tweet.image}
                        alt="Tweet"
                      />
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2 items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          onClick={() => likeOrDislikeHandler(tweet._id)}
                          className={`cursor-pointer p-2 hover:bg-primary/20 rounded-full ${tweet.like?.includes(user?._id) ? 'bg-primary/30' : ''}`}
                        >
                          <ThumbsUp size={25} />
                        </motion.div>
                        <p>{tweet.like?.length || 0}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="cursor-pointer p-2 hover:bg-primary/20 rounded-full"
                        >
                          <MessageSquareMore size={25} />
                        </motion.div>
                        <p>{tweet.comment?.length || 0}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="cursor-pointer p-2 hover:bg-green-200 rounded-full"
                        >
                          <BookMarked size={25} />
                        </motion.div>
                        <p>{tweet.bookmarks?.length || 0}</p>
                      </div>
                      {user?._id === tweet.userId && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          onClick={() => deleteTweetHandler(tweet._id)}
                          className="cursor-pointer p-2 hover:bg-red-200 rounded-full"
                        >
                          <MdDeleteForever size={25} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-secondary-foreground mt-4">This profile is private.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;