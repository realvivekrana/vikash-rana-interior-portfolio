import { useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { img } from '../../utils/img';

// items: [{ url, title, category }]   index: abhi kaunsi photo khuli hai
// onClose(), onGo(dir) parent deta hai (parent hi history state sambhalta hai)
const Lightbox = ({ items, index, onClose, onGo }) => {
  const touchX = useRef(null);
  const count = items.length;
  const item = items[index];

  // Keyboard + page scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onGo(1);
      if (e.key === 'ArrowLeft') onGo(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onGo]);

  // Aage-peeche wali photo pehle se load kar lo, swipe smooth lage
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const n = items[(i + count) % count];
      if (n) new Image().src = img(n.url, 1600);
    });
  }, [index, items, count]);

  if (!item) return null;

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) onGo(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] right-3 h-11 w-11 flex items-center justify-center text-white text-2xl z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <FaTimes />
      </button>

      {count > 1 && (
        <>
          <button
            className="absolute left-1 md:left-8 h-12 w-12 flex items-center justify-center text-white text-2xl z-10"
            onClick={(e) => { e.stopPropagation(); onGo(-1); }}
            aria-label="Previous photo"
          ><FaChevronLeft /></button>
          <button
            className="absolute right-1 md:right-8 h-12 w-12 flex items-center justify-center text-white text-2xl z-10"
            onClick={(e) => { e.stopPropagation(); onGo(1); }}
            aria-label="Next photo"
          ><FaChevronRight /></button>
        </>
      )}

      <img
        key={item.url}
        src={img(item.url, 1600)}
        alt={item.title || item.category || ''}
        className="max-h-[80svh] max-w-[94vw] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-0 px-14 text-center pointer-events-none">
        {item.title && <p className="font-serif text-white text-base sm:text-lg truncate">{item.title}</p>}
        <p className="text-[11px] text-neutral-400 tracking-widest uppercase">
          {item.category}{count > 1 && ` · ${index + 1} / ${count}`}
        </p>
      </div>
    </div>
  );
};

export default Lightbox;