import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilePdf, FaDownload, FaStar, FaRegStar } from 'react-icons/fa';
import api from '../../api/axios';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import { DOC_TYPE_LABELS, fileUrl, formatBytes, formatDate } from '../../utils/format';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';

const MAX_MB = 10;

const DocumentForm = ({ doc, onClose, onSaved }) => {
  const isEdit = !!doc;
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: doc?.title || '',
      type: doc?.type || 'resume',
      description: doc?.description || '',
      order: doc?.order ?? 0,
      isActive: doc?.isActive ?? true,
      isPrimary: doc?.isPrimary ?? false,
    },
  });
  const type = watch('type');

  const pickFile = (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (f.type !== 'application/pdf') return setFileError('Only PDF files are allowed');
    if (f.size > MAX_MB * 1024 * 1024) return setFileError(`PDF must be smaller than ${MAX_MB} MB`);
    setFileError('');
    setFile(f);
  };

  const onSubmit = async (v) => {
    if (!isEdit && !file) return setFileError('Choose a PDF file');
    const fd = new FormData();
    fd.append('title', v.title);
    fd.append('type', v.type);
    fd.append('description', v.description);
    fd.append('order', Number(v.order) || 0);
    fd.append('isActive', v.isActive);
    fd.append('isPrimary', v.type === 'resume' ? v.isPrimary : false);
    if (file) fd.append('file', file);
    try {
      if (isEdit) await api.put(`/documents/${doc._id}`, fd);
      else await api.post('/documents', fd);
      toast.success(isEdit ? 'Document updated' : 'Document uploaded');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Title *</label>
        <input className={inputClass} placeholder="Vikash Rana - Resume 2026" {...register('title', { required: 'Title required' })} />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Type</label>
          <select className={inputClass} {...register('type')}>
            {Object.entries(DOC_TYPE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Display order</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea rows={3} maxLength={300} className={inputClass} {...register('description')} />
      </div>

      <div>
        <label className={labelClass}>PDF file {isEdit ? '(choose a new one to replace it)' : '*'}</label>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="cursor-pointer min-h-11 inline-flex items-center border border-line px-4 text-xs uppercase tracking-wider text-neutral-300 hover:border-gold hover:text-gold transition-colors">
            {file || isEdit ? 'Change' : 'Choose'} PDF
            <input type="file" accept="application/pdf" hidden onChange={pickFile} />
          </label>
          <span className="text-sm text-neutral-400 break-all min-w-0">
            {file ? `${file.name} (${formatBytes(file.size)})` : isEdit ? doc.file?.originalName || 'Current file' : 'No file chosen'}
          </span>
        </div>
        {fileError && <p className="text-red-400 text-xs mt-2">{fileError}</p>}
        <p className="text-neutral-600 text-xs mt-2">PDF only, max {MAX_MB} MB.</p>
      </div>

      <div className="space-y-1">
        {type === 'resume' && (
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
            <input type="checkbox" className="accent-gold h-4 w-4" {...register('isPrimary')} />
            Primary resume (the site's "Download Resume" button serves this file)
          </label>
        )}
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('isActive')} />
          Active (show on site)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Uploading...' : isEdit ? 'Update' : 'Upload'}
        </button>
      </div>
    </form>
  );
};

const ManageDocuments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(
    () =>
      api
        .get('/documents/admin/all')
        .then((res) => setItems(res.data.data))
        .catch(() => toast.error('Could not load documents'))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (d) => {
    if (!window.confirm(`Delete "${d.title}"? The file will be removed too.`)) return;
    try {
      await api.delete(`/documents/${d._id}`);
      toast.success('Document deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete');
    }
  };

  const toggleActive = async (d) => {
    try {
      const { data } = await api.put(`/documents/${d._id}`, { isActive: !d.isActive });
      setItems((list) => list.map((i) => (i._id === d._id ? data.data : i)));
      toast.success(data.data.isActive ? 'Document visible' : 'Document hidden');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const makePrimary = async (d) => {
    try {
      await api.put(`/documents/${d._id}`, { isPrimary: true });
      toast.success('Primary resume set');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const close = () => setModal(null);
  const totalDownloads = items.reduce((n, d) => n + (d.downloads || 0), 0);

  return (
    <div>
      <PageHeader
        title="Resume & PDFs"
        subtitle={`${items.length} files · ${totalDownloads} downloads`}
        action={<button onClick={() => setModal('new')} className={goldBtn}><FaPlus /> Upload PDF</button>}
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          There are no PDFs yet. Upload your resume first.
        </div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {items.map((d) => (
            <div key={d._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="h-12 w-12 shrink-0 flex items-center justify-center border border-gold/40 text-gold text-xl">
                  <FaFilePdf />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-medium break-words">{d.title}</h3>
                    <span className="text-[10px] text-gold border border-gold/50 px-1.5 py-0.5 uppercase">
                      {DOC_TYPE_LABELS[d.type]}
                    </span>
                    {d.isPrimary && (
                      <span className="text-[10px] text-black bg-gold px-1.5 py-0.5 uppercase">Primary</span>
                    )}
                    {!d.isActive && (
                      <span className="text-[10px] text-neutral-400 border border-line px-1.5 py-0.5 uppercase">Hidden</span>
                    )}
                  </div>
                  <p className="text-neutral-500 text-xs mt-1">
                    {formatBytes(d.file?.size)} · {formatDate(d.updatedAt)}
                  </p>
                  <p className="text-neutral-400 text-xs mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaDownload className="text-gold" /> {d.downloads || 0} downloads</span>
                    <span className="flex items-center gap-1"><FaEye className="text-gold" /> {d.views || 0} views</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 flex-wrap">
                {d.type === 'resume' && !d.isPrimary && (
                  <button
                    onClick={() => makePrimary(d)}
                    className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                    aria-label="Make primary"
                    title="Make primary resume"
                  >
                    <FaRegStar />
                  </button>
                )}
                {d.isPrimary && (
                  <span className="h-11 w-11 flex items-center justify-center border border-gold/50 text-gold" title="Primary resume">
                    <FaStar />
                  </span>
                )}
                <a
                  href={fileUrl(d._id, 'view')}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                  aria-label="Open PDF"
                  title="Open PDF (increases the view count)"
                >
                  <FaFilePdf />
                </a>
                <button
                  onClick={() => toggleActive(d)}
                  className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                  aria-label={d.isActive ? 'Hide' : 'Show'}
                >
                  {d.isActive ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button
                  onClick={() => setModal(d)}
                  className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => remove(d)}
                  className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-red-500 hover:text-red-400"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Upload PDF' : 'Edit Document'} onClose={close}>
          <DocumentForm
            key={modal === 'new' ? 'new' : modal._id}
            doc={modal === 'new' ? null : modal}
            onClose={close}
            onSaved={() => {
              close();
              load();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageDocuments;