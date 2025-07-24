import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { Image, Smile, MapPin, Calendar, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getIsActive, getRefresh } from '@/redux/tweetSlice';
import { motion } from 'framer-motion';

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
        dispatch(getRefresh());
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
    dispatch(getIsActive(true));
  };

  const activeFollowingHandler = () => {
    dispatch(getIsActive(false));
  };

  const isDisabled = !description.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className="fixed top-0 left-[17.5%] right-[33.5%] flex items-center justify-between border-b border-border bg-black">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={activeYouHandler}
          className={`w-full text-center p-4 font-bold text-foreground text-xl ${
            isActive ? 'border-b-4 border-blue-600' : ''
          } hover:bg-secondary/50 transition-colors`}
        >
          For You
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={activeFollowingHandler}
          className={`w-full text-center p-4 font-bold text-foreground text-xl ${
            !isActive ? 'border-b-4 border-blue-600' : ''
          } hover:bg-secondary/50 transition-colors`}
        >
          Following
        </motion.button>
      </motion.div>
      <div className="mt-[14%] flex space-x-4 bg-black/40 rounded-xl shadow-md shadow-gray-700 border border-gray-600 p-6 mb-6">
        <Avatar
          src={
            user?.avatar ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
          }
          size="50"
          round={true}
        />

        <div className="flex-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's happening?"
            className="w-full resize-none bg-black border-none outline-none text-xl placeholder-gray-500 min-h-[120px]"
            maxLength={280}
          />

          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/40 bg-opacity-75 text-white rounded-full flex items-center justify-center hover:bg-opacity-100 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
            <div className="flex items-center space-x-4">
              {/* Image Upload */}
              <label
                htmlFor="image-upload"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                title="Add photo"
              >
                <Image size={20} />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Just Icons for UI */}
              <button
                type="button"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Add emoji"
              >
                <Smile size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Add location"
              >
                <MapPin size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Schedule"
              >
                <Calendar size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`text-sm ${
                  description.length > 260 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {280 - description.length}
              </span>
              <button
                onClick={submitHandler}
                disabled={isDisabled}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  isDisabled
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  Post
                  <Send size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateTweet;
