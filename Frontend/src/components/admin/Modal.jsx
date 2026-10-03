import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ title, onClose, children, wide = false }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 flex justify-center overflow-y-auto p-4 md:p-8">
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} bg-surface border border-line h-fit my-4`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-serif text-xl text-white">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;