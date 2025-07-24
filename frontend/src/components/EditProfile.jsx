// import { useState } from "react";

// const EditProfile = ({ user, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     username: user?.username || "",
//     bio: user?.bio || "",
//     profilePicture: user?.profilePicture || "",
//     bannerPicture: user?.bannerPicture || "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     onUpdate(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col">
//       <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
//       <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
//       <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio"></textarea>
//       <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="Profile Picture URL" />
//       <input type="text" name="bannerPicture" value={formData.bannerPicture} onChange={handleChange} placeholder="Banner Picture URL" />
//       <button type="submit">Update Profile</button>
//     </form>
//   );
// };

// export default EditProfile;

// new 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProfile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    bannerPicture: user?.bannerPicture || '',
    isPrivate: user?.isPrivate || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/edit/${user?._id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        onUpdate(formData);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-card rounded-lg shadow-lg"
    >
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="p-2 bg-input border border-border rounded-lg text-foreground"
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="p-2 bg-input border border-border rounded-lg text-foreground"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
        className="p-2 bg-input border border-border rounded-lg text-foreground"
      />
      <input
        type="text"
        name="profilePicture"
        value={formData.profilePicture}
        onChange={handleChange}
        placeholder="Profile Picture URL"
        className="p-2 bg-input border border-border rounded-lg text-foreground"
      />
      <input
        type="text"
        name="bannerPicture"
        value={formData.bannerPicture}
        onChange={handleChange}
        placeholder="Banner Picture URL"
        className="p-2 bg-input border border-border rounded-lg text-foreground"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPrivate"
          checked={formData.isPrivate}
          onChange={handleChange}
          className="accent-primary"
        />
        <span className="text-foreground">Private Profile</span>
      </label>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="p-2 bg-primary text-primary-foreground rounded-lg font-bold"
      >
        Update Profile
      </motion.button>
    </motion.form>
  );
};

export default EditProfile;