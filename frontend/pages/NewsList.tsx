import React, { useState, useMemo } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
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
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

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
    setSelectedNews({
      ...item,
      views_count: (item.views_count || 0) + 1
    });
    BackendAPI.incrementNewsView(item.id).then(newCount => {
      item.views_count = newCount;
    }).catch(console.error);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-[linear-gradient(135deg,#0f172a,#172554_45%,#2563eb)] text-white">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-200">{categoryParam === 'elonlar' ? t('news_list.announcements_badge') : t('news_list.badge')}</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{categoryParam === 'elonlar' ? t('news_list.announcements_title') : t('news')}</h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            {t('news_list.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        {filteredNews.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNews.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNewsClick(item)}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl text-left flex flex-col"
              >
                <div className="h-40 overflow-hidden bg-slate-200 w-full">
                  <img
                    src={item.images?.[0]?.imageUrl || item.image || '/placeholder.jpg'}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="flex items-center gap-2 text-sm text-slate-400"><Calendar size={16} /> {formatDate(item.date, i18n.language)}</p>
                  <h2 className="mt-3 text-xl font-black text-slate-900 transition-colors group-hover:text-blue-700 line-clamp-2">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3 flex-1">{stripHtml(item.content)}</p>
                  <div className="mt-5 flex items-center gap-2 font-bold text-blue-700">
                    {t('news_list.read_more')} <ChevronRight size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white px-6 py-20 text-center text-slate-500">
            {t('news_list.no_news')}
          </div>
        )}
      </section>
      
      {selectedNews && (
        <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
};

export default NewsList;
