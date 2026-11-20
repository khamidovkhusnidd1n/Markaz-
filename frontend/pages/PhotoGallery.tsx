import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GalleryItem } from '../types';

const PhotoGallery: React.FC = () => {
  const { t } = useTranslation();
  const { gallery } = useApp();
  
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const closeGalleryModal = () => {
    setSelectedGallery(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGalleryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const openGalleryModal = (item: GalleryItem) => {
    setSelectedGallery(item);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const nextImage = () => {
    if (!selectedGallery) return;
    const allImages = [{ imageUrl: selectedGallery.coverImageUrl, id: 'cover' }, ...selectedGallery.images];
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (!selectedGallery) return;
    const allImages = [{ imageUrl: selectedGallery.coverImageUrl, id: 'cover' }, ...selectedGallery.images];
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 py-14 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('photo_gallery.back')}
          </Link>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 block">{t('photo_gallery.badge')}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('photo_gallery.title')}</h1>
          <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl">{t('photo_gallery.subtitle')}</p>
        </div>
      </div>
      
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.length > 0 ? gallery.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openGalleryModal(item)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 cursor-pointer shadow-xs hover:shadow-lg border border-slate-200 transition-all duration-300"
            >
              <img 
                src={item.coverImageUrl} 
                alt={item.title || t('photo_gallery.gallery_alt')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-5 left-5 right-5">
                  {item.title && <p className="text-white font-bold text-base mb-1 truncate">{item.title}</p>}
                  <p className="text-amber-300 text-xs font-semibold">{item.images.length + 1} {t('photo_gallery.photo_count')}</p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                  <ImageIcon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <ImageIcon size={44} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-base">{t('photo_gallery.no_photos')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {selectedGallery && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeGalleryModal}
        >
          <button 
            onClick={closeGalleryModal}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="text-white" size={28} />
          </button>
          
          {selectedGallery.title && (
            <div className="absolute top-4 left-4 z-50">
              <h3 className="text-white text-xl font-bold">{selectedGallery.title}</h3>
            </div>
          )}

          {(() => {
            const allImages = [{ imageUrl: selectedGallery.coverImageUrl, id: 'cover' }, ...selectedGallery.images];
            return allImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <ChevronLeft className="text-white" size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
                >
                  <ChevronRight className="text-white" size={32} />
                </button>
              </>
            );
          })()}

          <div 
            className="relative w-full h-full flex items-center justify-center p-8 md:p-16"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const allImages = [{ imageUrl: selectedGallery.coverImageUrl, id: 'cover' }, ...selectedGallery.images];
              return (
                <img 
                  src={allImages[currentImageIndex].imageUrl} 
                  alt={t('photo_gallery.gallery_full_view')}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              );
            })()}
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {(() => {
              const allImages = [{ imageUrl: selectedGallery.coverImageUrl, id: 'cover' }, ...selectedGallery.images];
              return allImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                />
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
