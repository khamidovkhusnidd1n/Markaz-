import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';
import { X, Calendar, User, Eye, ZoomIn, Share2 } from 'lucide-react';
import { getImageUrl } from '../utils';
import { NewsItem } from '../types';
import { MediaItem, ImageModal } from './ImageModal';

interface NewsModalProps {
  newsItem: NewsItem;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ newsItem, onClose }) => {
  const { t, i18n } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const allImages = React.useMemo(() => {
    const imgs: MediaItem[] = [];
    
    // Asosiy rasm (yoki video)
    if (newsItem.videoUrl) {
      imgs.push({ type: 'video', url: newsItem.videoUrl });
    } else if (newsItem.image) {
      imgs.push({ type: 'image', url: newsItem.image });
    }

    // Qo'shimcha rasmlar yoki videolar
    if (newsItem.images && newsItem.images.length > 0) {
      newsItem.images.forEach((img: any) => {
        if (img.type && img.url) {
          imgs.push({ type: img.type, url: img.url });
        } else if (img.videoUrl || img.video) {
          imgs.push({ type: 'video', url: img.videoUrl || img.video });
        } else if (img.imageUrl || img.image) {
          imgs.push({ type: 'image', url: img.imageUrl || img.image });
        } else if (typeof img === 'string') {
          imgs.push({ type: 'image', url: img });
        }
      });
    }

    // Agar asosiysi allaqachon qo'shilgan bo'lsa, takrorlanmasligi uchun
    const uniqueUrls = new Set<string>();
    return imgs.filter(item => {
      if (uniqueUrls.has(item.url)) return false;
      uniqueUrls.add(item.url);
      return true;
    });
  }, [newsItem]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      // If image modal is open, don't close the news modal
      if (e.key === 'Escape' && selectedImageIndex === null) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, selectedImageIndex]);

  // Handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      // Only unlock scroll if we're completely unmounting the NewsModal
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleShare = () => {
    const shareUrl = `https://uzbamalaka.uz/api/s/news/${newsItem.id}/`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Maxsus link nusxalandi! \nEndi uni Telegramga tashlasangiz sarlavhasi va rasmi bilan chiroyli chiqadi."))
      .catch(err => console.error('Xatolik:', err));
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
            <h3 className="text-2xl font-black text-slate-900 pr-8">{newsItem.title}</h3>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6 overflow-y-auto bg-white">
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              {/* Left side: Image */}
              <div className="w-full md:w-[40%] flex-shrink-0">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => allImages.length > 0 && setSelectedImageIndex(0)}
                >
                  <div className="w-full aspect-square bg-slate-100 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden">
                    {allImages[0]?.type === 'video' ? (
                      <div className="relative w-full h-full">
                        {allImages[0].url.includes('youtube.com') || allImages[0].url.includes('youtu.be') ? (
                          <iframe 
                            src={allImages[0].url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                            className="w-full h-full object-cover pointer-events-none" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            tabIndex={-1}
                          />
                        ) : (
                          <video src={getImageUrl(allImages[0].url)} className="w-full h-full object-cover pointer-events-none" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="bg-white/90 text-slate-900 p-3 rounded-full shadow-xl">
                            <ZoomIn size={24} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={allImages[0] ? getImageUrl(allImages[0].url) : '/placeholder.jpg'} 
                        alt={newsItem.title} 
                        className="w-full h-full object-contain p-2 transition-transform group-hover:scale-[1.02]" 
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                    <div className="bg-white/90 text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-xl">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side: Meta Data */}
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Calendar size={14} />{t('news.upload_date')}</p>
                  <p className="text-lg font-bold text-blue-600">{formatDate(newsItem.date, i18n.language)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <User size={14} /> {t('news.author')} / {t('news.uploaded_by_site')}
                  </p>
                  <p className="text-slate-800 font-bold">{t('news.administration')}</p>
                </div>
                
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Eye size={14} />{t('news.views')}</p>
                  <p className="text-slate-800 font-bold">{newsItem.views_count || 0} marta o'qildi</p>
                </div>

                <div className="pt-2">
                  <button onClick={handleShare} className="flex items-center justify-center gap-2 w-full hover:bg-blue-600 hover:text-white transition-colors bg-blue-50 px-4 py-2.5 rounded-xl text-blue-700 font-bold cursor-pointer" title="Ulashish">
                    <Share2 size={18} />
                    <span>Ulashish</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-4">
              <h4 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">{t('news.more_info')}</h4>
              <div className="prose prose-slate prose-blue max-w-none prose-img:rounded-xl">
                {newsItem.content ? (
                  <div dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="text-slate-400 italic">{t('news.no_info')}</p>
                )}
              </div>
            </div>
            
            {/* If there are more images (gallery) */}
            {allImages.length > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-4">{t('news.additional_images')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allImages.slice(1).map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImageIndex(idx + 1)}
                    >
                      <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                        {img.type === 'video' ? (
                          <div className="relative w-full h-full">
                            {img.url.includes('youtube.com') || img.url.includes('youtu.be') ? (
                              <iframe 
                                src={img.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                                className="w-full h-full object-cover pointer-events-none" 
                                tabIndex={-1}
                              />
                            ) : (
                              <video src={getImageUrl(img.url)} className="w-full h-full object-cover pointer-events-none" />
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={getImageUrl(img.url)}
                            alt={`${newsItem.title} ${idx + 2}`}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      {img.type !== 'video' && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                          <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ImageModal 
        images={allImages.map(img => ({ ...img, url: img.type === 'video' ? img.url : getImageUrl(img.url) }))}
        initialIndex={selectedImageIndex !== null ? selectedImageIndex : 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />
    </>
  );
};
