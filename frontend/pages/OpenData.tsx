import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';
import { FileText, Download, Briefcase, TrendingUp, BarChart3, Database, FolderOpen } from 'lucide-react';

const OpenData: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { documents } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterCategory = searchParams.get('category');
  
  const getFileExtension = (url: string) => {
    if (!url) return 'FILE';
    const ext = url.split('.').pop()?.split('?')[0]?.toUpperCase() || 'FILE';
    return ext;
  };

  const categories = [
    { key: 'open_data', label: t('open_data.cat_open_data'), icon: <FolderOpen className="text-blue-600" />, headerClass: 'bg-blue-50' },
    { key: 'plan', label: t('open_data.cat_plan'), icon: <Briefcase className="text-green-600" />, headerClass: 'bg-green-50' },
    { key: 'regulatory', label: t('open_data.cat_regulatory'), icon: <TrendingUp className="text-amber-600" />, headerClass: 'bg-amber-50' },
  ];

  const displayedCategories = filterCategory 
    ? categories.filter(cat => cat.key === filterCategory)
    : categories;

  const getDocsByCategory = (category: string) => {
    return documents.filter(d => d.category === category);
  };

  const pageTitle = filterCategory === 'regulatory' 
    ? t('open_data.title_regulatory')
    : t('open_data.title_open_data');

  const pageDesc = filterCategory === 'regulatory'
    ? t('open_data.desc_regulatory')
    : t('open_data.desc_open_data');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-blue-200">{pageDesc}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Categories Overview - Only show if not filtered */}
        {!filterCategory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, i) => {
              const count = getDocsByCategory(cat.key).length;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900">{cat.label}</h3>
                  <p className="text-2xl font-black text-gray-800 mt-2">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('open_data.docs_count_suffix')}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Documents by Category */}
        {displayedCategories.map((cat) => {
          const catDocs = getDocsByCategory(cat.key);
          if (catDocs.length === 0) return null;
          
          return (
            <div key={cat.key} className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
              <div className={`flex items-center justify-between border-b p-6 ${cat.headerClass}`}>
                <div className="flex items-center gap-3">
                  {cat.icon}
                  <h2 className="text-xl font-bold text-gray-900">{cat.label}</h2>
                </div>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded-full font-medium">{catDocs.length} {t('open_data.count_suffix')}</span>
              </div>
              <div className="divide-y">
                {catDocs.map(doc => (
                  <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {doc.coverImageUrl ? (
                        <img src={doc.coverImageUrl} alt={doc.title} className="h-16 w-12 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{doc.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('open_data.date_label')}: {formatDate(doc.date, i18n.language)} | {t('open_data.format_label')}: {getFileExtension(doc.fileUrl)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {doc.fileUrl && (
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          download
                          className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Download size={18} /> {t('open_data.download')}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-20 text-center text-gray-500">
              <Database size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">{t('open_data.no_docs_title')}</h3>
              <p>{t('open_data.no_docs_desc')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenData;
