import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Avatar from 'react-avatar';
import { IoHome } from 'react-icons/io5';
import { FaStudiovinari } from "react-icons/fa";
import { Bell, Search, User, LogOut, Home } from 'lucide-react';
import { getOtherUsers, getProfile, getUser } from '@/redux/userSlice';

// Define navigation items with configurations
const navItemsConfig = [
  { icon: () => <FaStudiovinari size={40} />, path: '/', label: '', key: 'logo' },
  { icon: Home, path: '/', label: 'Home', key: 'home' },
  { icon: Search, path: '/search', label: 'Search', key: 'search' },
  {
    icon: Bell,
    path: '/notifications',
    label: 'Notifications',
    key: 'notifications',
  },
  {
    icon: User,
    label: 'Profile',
    key: 'profile',
    dynamicPath: (userId) => `/profile/${userId}`,
  },
  { icon: LogOut, action: 'logout', label: 'Logout', key: 'logout' },
  {
    icon: (user) => (
      <Avatar
        src={
          user?.avatar ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9dEhbjgmjNQc_JAJJYvv4waAPpHilh4Ps8A&s'
        }
        size={40}
        round
        className="border border-white/20 shadow-xl shadow-black/40"
      />
    ),
    label: 'You',
    key: 'user',
    dynamicPath: (userId) => `/profile/${userId}`,
  },
];

const LeftSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const logoutHandler = React.useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(getUser(null));
        dispatch(getOtherUsers(null));
        dispatch(getProfile(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  }, [dispatch, navigate]);

  const navItems = React.useMemo(
    () =>
      navItemsConfig.map((item) => ({
        ...item,
        path: item.dynamicPath ? item.dynamicPath(user?._id) : item.path,
        action: item.action === 'logout' ? logoutHandler : undefined,
      })),
    [user?._id, logoutHandler]
  );

  // Responsive sidebar: hidden on mobile unless toggled, always visible on md+
  // Backdrop for mobile drawer
  return (
    <>
      {/* Backdrop for mobile drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-200 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      />
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: sidebarOpen || window.innerWidth >= 768 ? 0 : -300,
          opacity: sidebarOpen || window.innerWidth >= 768 ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-black shadow-lg transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-[15%] md:block md:h-screen
        `}
        style={{ maxWidth: '100vw' }}
      >
        <nav className="flex flex-col items-start justify-start gap-6 p-4">
          {navItems.map((item) => (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (item.action) item.action();
                else navigate(item.path);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className="flex flex-row items-center gap-2 p-2 text-white hover:bg-gray-800 rounded-lg transition w-full"
              aria-label={item.label}
            >
              {typeof item.icon === 'function' ? (
                item.icon(user)
              ) : (
                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              )}
              <span className="text-sm capitalize whitespace-nowrap">
                {item.label}
              </span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default LeftSidebar;
