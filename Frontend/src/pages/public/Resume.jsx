import { Link } from 'react-router-dom';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Seo from '../../components/common/Seo';
import SectionTitle from '../../components/common/SectionTitle';
import DocumentCard from '../../components/common/DocumentCard';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';
import { fileUrl, formatBytes, formatDate } from '../../utils/format';

const Resume = () => {
  const { data: main, loading } = useFetch('/documents/resume');
  const { data: resumes } = useFetch('/documents?type=resume');
  const others = (resumes || []).filter((d) => d._id !== main?._id);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="Resume" description="Download the latest resume." />
      <SectionTitle eyebrow="Profile" title="Resume" subtitle="Experience, projects and credentials in one PDF." />

      {loading ? (
        <Loader />
      ) : !main ? (
        <p className="text-center text-neutral-500">Resume will be uploaded soon.</p>
      ) : (
        <Reveal>
          <div className="max-w-3xl mx-auto bg-surface border border-gold/40 p-6 sm:p-10 text-center">
            <div className="h-16 w-16 mx-auto flex items-center justify-center border border-gold/50 text-gold text-3xl">
              <FaFilePdf />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mt-6 break-words">{main.title}</h2>
            {main.description && <p className="text-neutral-400 mt-3 leading-relaxed">{main.description}</p>}
            <p className="text-neutral-600 text-xs mt-4">
              PDF{main.file?.size ? ` · ${formatBytes(main.file.size)}` : ''} · Updated {formatDate(main.updatedAt)}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href={fileUrl(main._id, 'download')}
                className="min-h-12 px-9 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <FaDownload /> Download Resume
              </a>
              <a
                href={fileUrl(main._id, 'view')}
                target="_blank"
                rel="noreferrer"
                className="min-h-12 px-9 flex items-center justify-center gap-2 border border-line text-neutral-300 hover:border-gold hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <FaEye /> View Online
              </a>
            </div>
          </div>
        </Reveal>
      )}

      {others.length > 0 && (
        <div className="mt-16">
          <h3 className="font-serif text-2xl text-white text-center mb-8">Other versions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((d) => (
              <DocumentCard key={d._id} doc={d} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-14">
        <Link to="/skills" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light py-2">See my skills →</Link>
        <Link to="/pdfs" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light py-2">More PDFs →</Link>
      </div>
    </section>
  );
};

export default Resume;