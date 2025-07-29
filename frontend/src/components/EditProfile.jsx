import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const EditProfile = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    bannerPicture: user?.bannerPicture || '',
    location: user?.location || '',
    website: user?.website || '',
    gender: user?.gender || '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bannerPhoto, setBannerPhoto] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'profilePhoto') setProfilePhoto(files[0]);
      else if (name === 'bannerPhoto') setBannerPhoto(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profilePhoto) formDataToSend.append('profilePhoto', profilePhoto);
    if (bannerPhoto) formDataToSend.append('bannerPhoto', bannerPhoto);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update/${user?._id}`,
        formDataToSend,
        { 
          headers: { 'Content-Type': 'multipart/form-data' }, 
          withCredentials: true 
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-600"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-white">
                <Camera size={16} />
                Profile Photo
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profilePhotoInput"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('profilePhotoInput').click()}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Change
                </button>
              </label>
            </div>
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-white">
                <Camera size={16} />
                Banner Photo
                <input
                  type="file"
                  name="bannerPhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="bannerPhotoInput"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('bannerPhotoInput').click()}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Change
                </button>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfile;