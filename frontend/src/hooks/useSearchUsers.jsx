// new
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useSearchUsers = (query) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/search?query=${query}`,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          setResults(res?.data?.users);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    searchUsers();
  }, [query]);

  return results;
};

export default useSearchUsers;