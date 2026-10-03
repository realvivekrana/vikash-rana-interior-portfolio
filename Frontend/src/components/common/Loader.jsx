import { useEffect, useState } from 'react';

// 6 second se zyada lage to batao ki free server jag raha hai
const Loader = () => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-24 px-6 text-center" role="status" aria-live="polite">
      <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      {slow && (
        <p className="text-neutral-500 text-sm max-w-xs">
          Waking up the server, this can take up to a minute the first time. Thanks for waiting!
        </p>
      )}
    </div>
  );
};

export default Loader;