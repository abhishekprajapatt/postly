import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Avatar from 'react-avatar';
import { Home, Search, Bell, User, LogOut, Twitter } from 'lucide-react';
import { getOtherUsers, getProfile, getUser } from '../redux/userSlice';

const navItemsConfig = [
  { icon: Home, path: '/', label: 'Home', key: 'home' },
  { icon: Search, path: '/search', label: 'Search', key: 'search' },
  {
    icon: Bell,
    path: '/notifications',
    label: 'Notifications',
    key: 'notifications',
  },
  { icon: Twitter, path: '/', label: 'Premimum', key: 'logo' },
  {
    icon: (user) => (
      <Avatar
        src={user?.avatar || `${import.meta.env.DEFAULT_PROFILE_IMAGE}`}
        size="40"
        round
        className="border border-white/20 shadow-xl shadow-black/40"
      />
    ),
    label: 'Profile',
    key: 'user',
    dynamicPath: (userId) => `/profile/${userId}`,
  },
  // { icon: User, label: 'Profile', key: 'profile', dynamicPath: (userId) => `/profile/${userId}` },
  { icon: LogOut, action: 'logout', label: 'Logout', key: 'logout' },
];

const LeftSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  // Logout handler with axios
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
        toast.success(res.data.message || 'Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  }, [dispatch, navigate]);

  // Memoize navigation items
  const navItems = React.useMemo(
    () =>
      navItemsConfig.map((item) => ({
        ...item,
        path: item.dynamicPath ? item.dynamicPath(user?._id || '') : item.path,
        action: item.action === 'logout' ? logoutHandler : undefined,
      })),
    [user?._id, logoutHandler]
  );

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: -300,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial="closed"
        animate={sidebarOpen || window.innerWidth >= 1024 ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed top-0 left-0 z-40 h-screen w-64 lg:w-72 glass-effect border-slate-600 ${
          sidebarOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 mb-8 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Postly</span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.path) navigate(item.path);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-800/50 rounded-xl transition-all duration-200 group"
                aria-label={item.label}
              >
                {typeof item.icon === 'function' ? (
                  item.key === 'logo' ? (
                    <Twitter className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  ) : (
                    item.icon(user)
                  )
                ) : (
                  <item.icon className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                )}
                <span className="text-slate-300 group-hover:text-white font-medium">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* User Profile */}
          {user && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 glass-effect rounded-xl border border-slate-600 cursor-pointer"
              onClick={() => {
                navigate(`/profile/${user._id}`);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={
                    user.avatar ||
                    `${import.meta.env.DEFAULT_PROFILE_IMAGE}`
                  }
                  size="48"
                  round
                  className="border-2 border-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-400 truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default LeftSidebar;
