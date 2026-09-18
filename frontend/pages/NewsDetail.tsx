import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';
import { X, Calendar, User, Eye } from 'lucide-react';
import { getImageUrl } from '../utils';

const NewsDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { news } = useApp();
  
  const newsItem = news.find(n => String(n.id) === id);
  
  const allImages = React.useMemo(() => {
    if (!newsItem) return [];
    const imgs: string[] = [];
    if (newsItem.images && newsItem.images.length > 0) {
      newsItem.images.forEach(img => {
        if (img.imageUrl) imgs.push(img.imageUrl);
      });
    }
    if (imgs.length === 0 && newsItem.image) {
      imgs.push(newsItem.image);
    }
    return imgs.filter(Boolean);
  }, [newsItem]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  if (!newsItem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-800">{t('news_detail.not_found_title', 'Yangilik topilmadi')}</h1>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">Orqaga</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => navigate(-1)}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h3 className="text-2xl font-black text-slate-900 pr-8">{newsItem.title}</h3>
          <button 
            onClick={() => navigate(-1)}
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
              <img 
                src={allImages[0] ? getImageUrl(allImages[0]) : '/placeholder.jpg'} 
                alt={newsItem.title} 
                className="w-full aspect-square object-cover rounded-2xl shadow-sm" 
              />
            </div>
            
            {/* Right side: Meta Data */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Calendar size={14} /> Yuklangan sana
                </p>
                <p className="text-lg font-bold text-blue-600">{formatDate(newsItem.date, i18n.language)}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <User size={14} /> Muallif / Saytga yukladi
                </p>
                <p className="text-slate-800 font-bold">Markaz ma'muriyati</p>
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Eye size={14} /> Ko'rishlar
                </p>
                <p className="text-slate-800 font-bold">{newsItem.id ? Math.floor(Math.random() * 50) + 10 : 0} marta o'qildi</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-4">
            <h4 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Batafsil ma'lumot
            </h4>
            <div className="prose prose-slate prose-blue max-w-none prose-img:rounded-xl">
              {newsItem.content ? (
                <div dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-slate-400 italic">Ma'lumot kiritilmagan.</p>
              )}
            </div>
          </div>
          
          {/* If there are more images (gallery) */}
          {allImages.length > 1 && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Qo'shimcha rasmlar</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allImages.slice(1).map((img, idx) => (
                  <img 
                    key={idx}
                    src={getImageUrl(img)}
                    alt={`${newsItem.title} ${idx + 2}`}
                    className="w-full aspect-video object-cover rounded-xl shadow-sm border border-slate-100 hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
