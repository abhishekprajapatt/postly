import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useOtherUsers from '@/hooks/useOtherUsers';
import { useSelector } from 'react-redux';
import useGetUserTweets from '@/hooks/useGetUserTweets';
import { AnimatePresence, motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useOtherUsers(user?._id);
  useGetUserTweets(user?._id);
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex w-full max-w-7xl mx-auto min-h-screen relative"
    >
      {/* Mobile Hamburger Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-800/80 backdrop-blur-sm text-white rounded-full shadow-lg border border-slate-600"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <motion.div
          animate={sidebarOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <LeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[22%] min-h-screen">
        <Outlet />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </motion.div>
  );
};

export default Home;
