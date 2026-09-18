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
    <div className="min-h-screen bg-white">
      <div className="bg-rose-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-rose-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('art_gallery.back')}
          </Link>
          <span className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 block">{t('art_gallery.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-black">{t('art_gallery.title')}</h1>
          <p className="mt-4 text-lg text-rose-200 max-w-2xl">{t('art_gallery.subtitle')}</p>
        </div>
      </div>
      
      <section className="py-16">
        <ArtGallerySection items={artGallery} />
      </section>
    </div>
  );
};

export default ArtGallery;
