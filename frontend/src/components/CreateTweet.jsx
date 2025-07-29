import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { Image, Smile, MapPin, Calendar, Send, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, tweetRefresh } from '@/redux/tweetSlice';
import { AnimatePresence, motion } from 'framer-motion';

const CreateTweet = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.tweet);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('id', user?._id);
      if (image) {
        formData.append('image', image);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tweet/createtweet`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(tweetRefresh());
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }

    setDescription('');
    setImage(null);
    setPreview(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

  const activeYouHandler = () => {
    dispatch(setIsActive(true));
  };

  const activeFollowingHandler = () => {
    dispatch(setIsActive(false));
  };

  const isDisabled = !description.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 border-b border-slate-600"
    >
      {/* Tab Navigation */}
      <div className="flex">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={activeYouHandler}
          className={`flex-1 text-center p-4 font-semibold transition-all ${
            isActive
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          For You
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={activeFollowingHandler}
          className={`flex-1 text-center p-4 font-semibold transition-all ${
            !isActive
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Following
        </motion.button>
      </div>

      {/* Create Tweet Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 border-b border-slate-600"
      >
        <div className="flex space-x-4">
          <Avatar
            src={
              user?.avatar ||
              `${import.meta.env.DEFAULT_PROFILE_IMAGE}`
            }
            size="48"
            round
            className="border-2 border-blue-500"
          />

          <div className="flex-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's happening?"
              className="w-full resize-none bg-transparent border-none outline-none text-xl placeholder-slate-400 min-h-[80px] text-white"
              maxLength={280}
            />

            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-4 relative"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-2xl border border-slate-600"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-slate-900/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                {/* Image Upload */}
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  htmlFor="image-upload"
                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors cursor-pointer"
                  title="Add photo"
                >
                  <Image size={20} />
                </motion.label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Other Action Buttons */}
                {[
                  { icon: Smile, title: 'Add emoji' },
                  { icon: MapPin, title: 'Add location' },
                  { icon: Calendar, title: 'Schedule' },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors"
                    title={action.title}
                  >
                    <action.icon size={20} />
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium ${
                    description.length > 260 ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {280 - description.length}
                </span>
                <motion.button
                  whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  onClick={submitHandler}
                  disabled={isDisabled}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isDisabled
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Post
                    <Send size={16} />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateTweet;
