import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const SiteContext = createContext({ settings: null });

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        setSettings(res.data.data);
      })
      .catch(() => {});
  }, []);

  return <SiteContext.Provider value={{ settings }}>{children}</SiteContext.Provider>;
};

export const useSite = () => useContext(SiteContext);