import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const makeId = () => {
  const raw =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  return raw.replace(/[^\w-]/g, '');
};

const get = (store, key) => {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
};
const set = (store, key, val) => {
  try {
    store.setItem(key, val);
  } catch {
    /* private mode: ignore */
  }
};

// Public site ka har page view backend ko bhejta hai (admin login ho to skip)
const useTrackVisit = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (get(localStorage, 'adminToken')) return;

    let vid = get(localStorage, 'vid');
    const isNewBrowser = !vid;
    if (!vid) {
      vid = makeId();
      set(localStorage, 'vid', vid);
    }

    let sid = get(sessionStorage, 'sid');
    let firstOfSession = false;
    if (!sid) {
      sid = makeId();
      firstOfSession = true;
      set(sessionStorage, 'sid', sid);
      set(sessionStorage, 'ret', isNewBrowser ? '0' : '1'); // is session shuru hone se pehle aaya tha?
    }

    api
      .post('/track', {
        path: pathname,
        sid,
        vid,
        returning: get(sessionStorage, 'ret') === '1',
        referrer: firstOfSession ? document.referrer : '',
      })
      .catch(() => {});
  }, [pathname]);
};

export default useTrackVisit;