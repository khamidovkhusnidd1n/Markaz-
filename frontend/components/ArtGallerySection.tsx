import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ArtGalleryItem as ArtItem } from '../types';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';

interface ArtGallerySectionProps {
  items: ArtItem[];
}

const ArtGallerySection: React.FC<ArtGallerySectionProps> = ({ items }) => {
  const { t, i18n } = useTranslation();
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselSize = 4;

  useEffect(() => {
    if (items.length <= carouselSize) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % (items.length - carouselSize + 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [items.length]);

  const openModal = useCallback((item: ArtItem) => {
    setSelectedArt(item);
    setCarouselIndex(0);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedArt(null);
    setIsModalOpen(false);
    setCarouselIndex(0);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Art Gallery Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-pink-600 uppercase tracking-wider">{t('art_gallery_section.badge')}</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">{t('art_gallery_section.title')}</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
            {t('art_gallery_section.subtitle')}
          </p>
        </div>

        {/* Carousel Grid */}
        {items.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4 min-w-max lg:min-w-full lg:grid lg:grid-cols-1 lg:gap-6">
              {/* Desktop Grid - 4 columns */}
              <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:min-w-full">
                {items.slice(carouselIndex, carouselIndex + carouselSize).map((item, idx) => (
                  <ArtCard
                    key={item.id}
                    item={item}
                    onClick={() => openModal(item)}
                    delay={idx * 50}
                    viewLabel={t('art_gallery_section.view_btn')}
                  />
                ))}
              </div>

              {/* Mobile/Tablet - Horizontal scroll */}
              <div className="lg:hidden flex gap-6">
                {items.slice(carouselIndex, carouselIndex + carouselSize).map((item, idx) => (
                  <div key={item.id} className="flex-shrink-0 w-80 sm:w-96">
                    <ArtCard
                      item={item}
                      onClick={() => openModal(item)}
                      delay={idx * 50}
                      viewLabel={t('art_gallery_section.view_btn')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">{t('art_gallery_section.no_items')}</p>
          </div>
        )}
      </section>

      {/* Art Modal */}
      {isModalOpen && selectedArt && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleBackdropClick}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label={t('art_gallery_section.close')}
          >
            <X className="text-white" size={28} />
          </button>

          {/* Modal Content */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative flex items-center justify-center bg-black flex-1 overflow-auto">
              <img
                src={selectedArt.imageUrl}
                alt={selectedArt.title}
                className="max-h-full max-w-full object-contain p-4 animate-scale-in"
              />
            </div>

            {/* Details Section */}
            <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-8 text-white">
              <div className="max-w-2xl">
                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-black mb-2">
                  {selectedArt.title}
                </h3>

                {/* Author */}
                <p className="text-lg md:text-xl text-pink-400 font-semibold mb-4">
                  {selectedArt.author}
                </p>

                {/* Description */}
                {selectedArt.description && (
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-4">
                    {selectedArt.description}
                  </p>
                )}

                {/* Meta Info */}
                {selectedArt.createdAt && (
                  <p className="text-xs md:text-sm text-slate-400 mt-4">
                    {t('art_gallery_section.published')}: {formatDate(
                      selectedArt.createdAt,
                      i18n.language,
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.4s ease-out forwards; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

// Art Card Component
interface ArtCardProps {
  item: ArtItem;
  onClick: () => void;
  delay?: number;
  viewLabel: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ item, onClick, delay = 0, viewLabel }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer hover:-translate-y-2"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {item.title}
        </h3>

        {/* Author */}
        <p className="text-sm font-semibold text-pink-600 mb-3">
          {item.author}
        </p>

        {/* Description */}
        {item.description && (
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {item.description}
          </p>
        )}

        {/* View Button */}
        <button className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-sm flex items-center justify-center gap-2 group/btn">
          {viewLabel}
          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ArtGallerySection;
