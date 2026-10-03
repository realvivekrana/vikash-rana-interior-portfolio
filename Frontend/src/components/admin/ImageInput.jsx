import { useEffect, useMemo } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';
import { labelClass } from '../../utils/ui';

const useObjectUrl = (file) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
};

const pickerClass =
  'cursor-pointer border border-line px-4 py-2 text-xs uppercase tracking-wider text-neutral-300 hover:border-gold hover:text-gold transition-colors';

// Single image
const ImageInput = ({ label, file, existing, onChange, wide = false }) => {
  const preview = useObjectUrl(file);
  const shown = preview || existing;

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <div className="flex items-center gap-4">
        <div
          className={`${wide ? 'h-24 w-40' : 'h-20 w-20'} bg-ink border border-line flex items-center justify-center overflow-hidden shrink-0`}
        >
          {shown ? (
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            <FaImage className="text-neutral-700 text-xl" />
          )}
        </div>
        <label className={pickerClass}>
          {shown ? 'Change' : 'Choose'} image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              onChange(e.target.files[0] || null);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
};

// Multiple images
export const MultiImageInput = ({ label, files, onChange }) => {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [urls]);

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u} className="relative h-20 w-20 border border-line overflow-hidden">
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(files.filter((_, idx) => idx !== i))}
              className="absolute top-0 right-0 bg-black/80 text-white p-1 text-xs"
            >
              <FaTimes />
            </button>
          </div>
        ))}
        <label className={`${pickerClass} h-20 w-20 flex items-center justify-center text-center`}>
          + Add
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              onChange([...files, ...Array.from(e.target.files)]);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageInput;