import React, { useState, useEffect } from 'react';
import Auth from '../../public/assets/auth.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser } from '@/redux/userSlice';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
          input,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(getUser(res.data.user));
          navigate('/');
          toast.success(res.data.message);
          setInput({ email: '', password: '' });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
          input,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message);
          setInput({ name: '', username: '', email: '', password: '' });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-screen h-screen flex items-center justify-center bg-background"
    >
      <div className="md:flex items-center justify-evenly w-[80%]">
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="mb-8 md:mb-0"
        >
          <img src={Auth} alt="twitter logo" className="w-20 md:w-[250px] mx-auto" />
        </motion.div>
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className="w-full md:w-[400px] border border-gray-600 rounded-xl p-8 shadow-md shadow-gray-600"
        >
          <h1 className="font-bold text-3xl md:text-5xl text-foreground mb-5">Happening now</h1>
          <h2 className="font-bold text-xl text-secondary-foreground mb-4">
            {isLogin ? 'Login' : 'Signup'}
          </h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter Your Name"
                  className="focus:outline-none focus:ring-0 p-2 bg-input bg-black/60 shadow-sm shadow-gray-600 border-border border-gray-600 rounded-full text-foreground"
                />
                <input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={changeEventHandler}
                  placeholder="Enter Your Username"
                  className="focus:outline-none focus:ring-0 p-2 bg-input bg-black/60 shadow-sm shadow-gray-600 border-border border-gray-600 rounded-full text-foreground"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter Your Email"
              className="focus:outline-none focus:ring-0 p-2 bg-input bg-black/60 shadow-sm shadow-gray-600 border-border border-gray-600 rounded-full text-foreground"
            />
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter Your Password"
              className="focus:outline-none focus:ring-0 p-2 bg-input bg-black/60 shadow-sm shadow-gray-600 border-border border-gray-600 rounded-full text-foreground"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-500 text-white hover:bg-blue-600 text-primary-foreground rounded-full font-bold flex items-center justify-center"
            >
              {loading ? (
                <div className="flex gap-2 items-center">
                  <Loader2 className="mr-2 animate-spin" /> Please Wait
                </div>
              ) : (
                <>{isLogin ? 'Login' : 'Signup'}</>
              )}
            </motion.button>
            <p className="text-secondary-foreground">
              {isLogin ? 'Do not have an account?' : 'Already have an account?'}
              <span
                className="text-blue-600 hover:underline mx-1 cursor-pointer"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Signup' : 'Login'}
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;