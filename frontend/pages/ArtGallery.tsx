import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArtGallerySection from '../components/ArtGallerySection';

const ArtGallery: React.FC = () => {
  const { t } = useTranslation();
  const { artGallery } = useApp();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 py-14 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('art_gallery.back')}
          </Link>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 block">{t('art_gallery.badge')}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('art_gallery.title')}</h1>
          <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl">{t('art_gallery.subtitle')}</p>
        </div>
      </div>
      
      <section className="py-10">
        <ArtGallerySection items={artGallery} />
      </section>
    </div>
  );
};

export default ArtGallery;
