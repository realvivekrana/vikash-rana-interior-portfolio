import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import { DOC_TYPE_LABELS, fileUrl, formatBytes, formatDate } from '../../utils/format';

const DocumentCard = ({ doc }) => (
  <div className="bg-surface border border-line p-5 sm:p-6 h-full flex flex-col hover:border-gold/60 transition-colors">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 shrink-0 flex items-center justify-center border border-gold/40 text-gold text-xl">
        <FaFilePdf />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] uppercase tracking-wider text-gold border border-gold/50 px-1.5 py-0.5">
          {DOC_TYPE_LABELS[doc.type] || 'Document'}
        </span>
        <h3 className="font-serif text-lg text-white mt-2 break-words">{doc.title}</h3>
      </div>
    </div>

    {doc.description && <p className="text-neutral-400 text-sm leading-relaxed mt-4">{doc.description}</p>}

    <p className="text-neutral-600 text-xs mt-4">
      PDF{doc.file?.size ? ` · ${formatBytes(doc.file.size)}` : ''} · Updated {formatDate(doc.updatedAt)}
    </p>

    <div className="grid grid-cols-2 gap-3 mt-auto pt-5">
      <a
        href={fileUrl(doc._id, 'view')}
        target="_blank"
        rel="noreferrer"
        className="min-h-11 flex items-center justify-center gap-2 border border-line text-neutral-300 hover:border-gold hover:text-gold text-xs uppercase tracking-[0.15em] transition-colors"
      >
        <FaEye /> View
      </a>
      <a
        href={fileUrl(doc._id, 'download')}
        className="min-h-11 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black text-xs uppercase tracking-[0.15em] transition-colors"
      >
        <FaDownload /> Download
      </a>
    </div>
  </div>
);

export default DocumentCard;