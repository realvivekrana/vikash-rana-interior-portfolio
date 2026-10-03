import { useEffect, useState } from 'react';
import api from '../api/axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get(url)
      .then((res) => {
        if (!ignore) {
          setData(res.data.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || 'Something went wrong');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;