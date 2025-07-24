// import React, { useEffect } from 'react';
// import LeftSidebar from './LeftSidebar';
// import RightSidebar from './RightSidebar';
// import { Outlet, useNavigate } from 'react-router-dom';
// import useOtherUsers from '@/hooks/useOtherUsers';
// import { useSelector } from 'react-redux';
// import useGetUserTweets from '@/hooks/useGetUserTweets';

// const Home = () => {
//   const { user } = useSelector((store) => store.user);
//   const navigate = useNavigate();

//   useOtherUsers(user?._id);
//   useGetUserTweets(user?._id);
//   return (
//     <div className="flex flex-col md:flex-row gap-4 justify-between md:w-[90%] mx-auto">
//       <LeftSidebar />
//       <Outlet/>
//       <RightSidebar/>
//     </div>
//   );
// };

// export default Home;

// new

import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Outlet } from 'react-router-dom';
import useOtherUsers from '@/hooks/useOtherUsers';
import { useSelector } from 'react-redux';
import useGetUserTweets from '@/hooks/useGetUserTweets';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useSelector((store) => store.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useOtherUsers(user?._id);
  useGetUserTweets(user?._id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-row w-full md:w-[90%] mx-auto h-screen"
    >
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-[100] bg-black text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Open sidebar"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <LeftSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <RightSidebar />
    </motion.div>
  );
};

export default Home;
