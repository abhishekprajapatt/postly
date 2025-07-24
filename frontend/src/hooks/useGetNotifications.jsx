// new 
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getNotifications } from '@/redux/userSlice';

const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/notification/${user?._id}`,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(getNotifications(res?.data?.notifications));
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      }
    };
    if (user?._id) {
      fetchNotifications();
    }
  }, [user, dispatch]);
};

export default useGetNotifications;