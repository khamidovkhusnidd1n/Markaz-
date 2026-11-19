import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, BookOpen, Search, Download, Eye, FileText, FolderOpen, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DocumentViewer from '../components/DocumentViewer';

const Library: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { documents } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const getFileExtension = (url: string) => {
    if (!url) return 'PDF';
    const ext = url.split('.').pop()?.split('?')[0]?.toUpperCase() || 'PDF';
    return ext;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'regulatory':
        return "O'quv-me'yoriy qo'llanma";
      case 'library':
        return "Elektron adabiyot";
      case 'plan':
        return "O'quv rejasi";
      case 'open_data':
        return "Ochiq ta'limiy ma'lumot";
      default:
        return "O'quv materiali";
    }
  };

  const categories = [
    { key: 'all', label: "Barcha adabiyotlar", count: documents.length },
    { key: 'regulatory', label: "O‘quv-me’yoriy qo‘llanmalar", count: documents.filter(d => d.category === 'regulatory').length },
    { key: 'open_data', label: "Ochiq ta'limiy ma'lumotlar", count: documents.filter(d => d.category === 'open_data').length },
    { key: 'library', label: "Elektron kutubxona", count: documents.filter(d => d.category === 'library').length },
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      // Search match
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 py-16 text-white shadow-md">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} /> {t('library.back')}
          </Link>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {t('library.badge')}
            </span>
            <span className="text-xs text-blue-300 font-medium">
              Jami: {documents.length} ta o‘quv adabiyoti va qo‘llanma
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('library.title')}</h1>
          <p className="mt-4 text-base md:text-lg text-blue-200 max-w-2xl leading-relaxed">
            {t('library.subtitle')}
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Adabiyot yoki qo‘llanma nomini qidiring..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200/70 text-sm rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all shadow-sm"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition-colors"
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-200">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDocuments.map((item) => {
              const fileExt = getFileExtension(item.fileUrl);
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden text-left"
                >
                  {/* Book / Document Cover */}
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-950 p-5 text-white flex flex-col justify-between relative overflow-hidden group-hover:from-blue-900 group-hover:to-indigo-900 transition-colors">
                        <div className="absolute -right-6 -bottom-6 opacity-10 text-white pointer-events-none">
                          <BookOpen size={110} />
                        </div>
                        <div className="flex items-center justify-between z-10">
                          <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded text-amber-300">
                            {fileExt}
                          </span>
                          <span className="text-[11px] text-blue-200 font-semibold">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <div className="my-auto py-2 z-10">
                          <p className="text-xs sm:text-sm font-bold line-clamp-3 leading-snug text-white">
                            {item.title}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200 z-10">
                          <span>O‘zBA Markazi</span>
                          <BookOpen size={14} />
                        </div>
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                      {fileExt}
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1.5">
                        {getCategoryLabel(item.category)}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setViewDoc(item.fileUrl)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-colors"
                      >
                        <Eye size={14} />
                        <span>O‘qish</span>
                      </button>
                      <a
                        href={item.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                        title="Yuklab olish"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 px-6 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <BookMarked size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Materiallar topilmadi</h3>
            <p className="text-xs text-slate-500 mb-4">
              {searchQuery ? `"${searchQuery}" bo‘yicha hech qanday adabiyot topilmadi.` : t('library.no_materials')}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Qidiruvni tozalash
              </button>
            )}
          </div>
        )}
      </section>

      {/* Document Viewer Modal */}
      {viewDoc && (
        <DocumentViewer url={viewDoc} onClose={() => setViewDoc(null)} />
      )}
    </div>
  );
};

export default Library;
