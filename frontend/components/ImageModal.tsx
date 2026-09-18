import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface ImageModalProps {
  images: (string | MediaItem)[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opened with a new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentItem = images[currentIndex];
  const isMediaItem = typeof currentItem === 'object' && currentItem !== null;
  const url = isMediaItem ? (currentItem as MediaItem).url : (currentItem as string);
  const type = isMediaItem ? (currentItem as MediaItem).type : 'image';

  const isYouTube = type === 'video' && (url.includes('youtube.com') || url.includes('youtu.be'));
  const embedUrl = isYouTube 
    ? url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : url;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
          >
            <ChevronLeft size={36} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
          >
            <ChevronRight size={36} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium bg-black/50 px-4 py-1.5 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}

      <div 
        className="relative w-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {type === 'video' ? (
          isYouTube ? (
            <iframe 
              key={currentIndex}
              src={embedUrl} 
              className="w-full max-w-5xl aspect-video rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video 
              key={currentIndex}
              src={getImageUrl(url)} 
              controls
              autoPlay
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          )
        ) : (
          <img 
            key={currentIndex}
            src={getImageUrl(url)} 
            alt={`Media ${currentIndex + 1}`} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
        )}
      </div>
    </div>
  );
};
