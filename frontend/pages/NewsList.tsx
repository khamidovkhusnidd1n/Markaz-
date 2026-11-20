import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronRight, ImageOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';
import { NewsModal } from '../components/NewsModal';
import { NewsItem } from '../types';
import { BackendAPI } from '../services/backend';

const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() || '';

const NewsList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { news } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const idParam = searchParams.get('id');
  
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (idParam && news.length > 0) {
      const found = news.find((n: any) => String(n.id) === idParam);
      if (found && !selectedNews) {
        setSelectedNews(found);
      }
    }
  }, [idParam, news]);

  const filteredNews = useMemo(() => {
    return news.filter((item: any) => {
      if (categoryParam === 'elonlar') {
        const catName = String(item.category || "").toLowerCase();
        const catId1 = item.categoryId;
        
        
        const titleStr = String(item.title || "").toLowerCase();
        return Number(catId1) === 1 || catName.includes("lon") || titleStr.includes("lon");
      } else if (categoryParam === 'yangiliklar') {
        return !item.category && !item.categoryId;
      }
      return true;
    });
  }, [news, categoryParam]);

  const handleNewsClick = (item: NewsItem) => {
    const params = new URLSearchParams(location.search);
    params.set('id', String(item.id));
    navigate({ search: params.toString() }, { replace: true });

    setSelectedNews({
      ...item,
      views_count: (item.views_count || 0) + 1
    });
    BackendAPI.incrementNewsView(item.id).then(newCount => {
      item.views_count = newCount;
    }).catch(console.error);
  };

  const handleClose = () => {
    setSelectedNews(null);
    const params = new URLSearchParams(location.search);
    params.delete('id');
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{categoryParam === 'elonlar' ? t('news_list.announcements_badge') : t('news_list.badge')}</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl tracking-tight">{categoryParam === 'elonlar' ? t('news_list.announcements_title') : t('news_list.title')}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-base">
            {t('news_list.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {filteredNews.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNews.map((item) => {
              const imgUrl = item.images?.[0]?.imageUrl || item.image;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNewsClick(item)}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-blue-300 hover:shadow-md text-left flex flex-col"
                >
                  <div className="relative aspect-video sm:h-48 overflow-hidden bg-slate-100 w-full">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.title_translated || item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top sm:object-[center_15%] transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
                        <ImageOff size={32} strokeWidth={1.5} />
                        <span className="text-xs font-semibold">Rasm yuklanmagan</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Calendar size={14} /> {formatDate(item.date, i18n.language)}</p>
                    <h2 className="mt-2 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700 line-clamp-2 leading-snug">{item.title_translated || item.title}</h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3 flex-1">{stripHtml(item.content_translated || item.content)}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-blue-700">
                      {t('news_list.read_more')} <ChevronRight size={15} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center text-slate-500">
            {t('news_list.no_news')}
          </div>
        )}
      </section>
      
      {selectedNews && (
        <NewsModal newsItem={selectedNews} onClose={handleClose} />
      )}
    </div>
  );
};

export default NewsList;
