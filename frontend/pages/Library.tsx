import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Library: React.FC = () => {
  const { t } = useTranslation();
  const { documents } = useApp();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('library.back')}
          </Link>
          <span className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2 block">{t('library.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-black">{t('library.title')}</h1>
          <p className="mt-4 text-lg text-blue-200 max-w-2xl">{t('library.subtitle')}</p>
        </div>
      </div>
      
      <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-w-7xl mx-auto">
          {documents.filter((item) => item.category === 'library').length > 0 ? (
            documents
              .filter((item) => item.category === 'library')
              .map((item) => (
                <a
                  key={item.id}
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[1.5rem] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="aspect-[3/4] bg-slate-100">
                    {item.coverImageUrl ? (
                      <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">{t('library.no_cover')}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-xs font-bold text-slate-900 leading-snug">{item.title}</p>
                  </div>
                </a>
              ))
          ) : (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-24 text-center text-slate-400">
              <p className="text-lg">{t('library.no_materials')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Library;
