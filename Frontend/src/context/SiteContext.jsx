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
        const title = res.data.data?.seo?.title;
        if (title) document.title = title;
      })
      .catch(() => {});
  }, []);

  return <SiteContext.Provider value={{ settings }}>{children}</SiteContext.Provider>;
};

export const useSite = () => useContext(SiteContext);