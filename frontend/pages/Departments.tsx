import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Monitor, BookOpen, Cpu, Grid, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ImageModal } from '../components/ImageModal';
import { useApp } from '../context/AppContext';
import { getImageUrl } from '../utils';

const Departments: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { departments } = useApp();
  const hashTab = location.hash?.replace('#', '');
  
  const [activeTab, setActiveTab] = useState<number | string>('');
  const [openSectionIdx, setOpenSectionIdx] = useState<number | null>(0);
  const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);

  useEffect(() => {
    if (departments && departments.length > 0) {
      if (hashTab) {
        // try to find by some matching logic or just ID
        const matched = departments.find(d => d.id.toString() === hashTab);
        if (matched) {
          setActiveTab(matched.id);
        } else {
          setActiveTab(departments[0].id);
        }
      } else {
        setActiveTab(departments[0].id);
      }
    }
  }, [location.hash, departments]);

  useEffect(() => {
    setOpenSectionIdx(0);
    setCurrentImgIdx(0);
  }, [activeTab]);

  const currentTab = departments?.find(t => t.id === activeTab) || departments?.[0];

  const getLocalizedField = (obj: any, field: string) => {
    if (!obj) return '';
    const lang = i18n.language?.substring(0, 2);
    if (lang === 'ru' && obj[`${field}_ru`]) return obj[`${field}_ru`];
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    return obj[field] || '';
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor size={22} />;
      case 'BookOpen': return <BookOpen size={22} />;
      case 'Cpu': return <Cpu size={22} />;
      default: return <Grid size={22} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('departments.back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('departments.title')}</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            {t('departments.subtitle')}
          </p>
        </div>
      </div>

      {departments && departments.length > 0 ? (
        <>
          {/* Tabs */}
          <div className="container mx-auto px-4 -mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 overflow-x-auto">
              {departments.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color_classes || 'from-blue-600 to-blue-800'} text-white shadow-md scale-[1.02]`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {getIcon(tab.icon_name || '')}
                  <span className="hidden md:inline">{getLocalizedField(tab, 'name')}</span>
                  <span className="md:hidden">{getLocalizedField(tab, 'name').split(' ').slice(0, 2).join(' ')}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {currentTab && (
            <div className="container mx-auto px-4 py-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
                <div className={`bg-gradient-to-r ${currentTab.color_classes || 'from-blue-600 to-blue-800'} p-8 text-white`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {getIcon(currentTab.icon_name || '')}
                    </div>
                    <h2 className="text-2xl font-bold">{getLocalizedField(currentTab, 'name')}</h2>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed max-w-3xl whitespace-pre-line">
                    {getLocalizedField(currentTab, 'description')}
                  </p>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">{t('departments.main_tasks')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentTab.department_tasks && currentTab.department_tasks.length > 0 ? (
                      [...currentTab.department_tasks].sort((a, b) => a.order - b.order).map((taskObj, idx) => {
                        const taskText = getLocalizedField(taskObj, 'task_text');
                        if (!taskText.trim()) return null;
                        return (
                          <div
                            key={taskObj.id}
                            className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100"
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${currentTab.color_classes || 'from-blue-600 to-blue-800'} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                              {idx + 1}
                            </div>
                            <div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: taskText }} />
                          </div>
                        );
                      })
                    ) : null}
                  </div>

                  {/* Detailed Information Section */}
                  {(() => {
                    const target = currentTab;
                    const detailText = getLocalizedField(target, 'detail_text');
                    
                    // Gather all images
                    const allImages: string[] = [];
                    if (target.images && target.images.length > 0) {
                      [...target.images].sort((a, b) => a.order - b.order).forEach((img: any) => {
                        if (img.image_url) allImages.push(img.image_url);
                      });
                    }

                    // Gather all videos
                    const allVideos: string[] = [];
                    if (target.videos && target.videos.length > 0) {
                      [...target.videos].sort((a, b) => a.order - b.order).forEach((v: any) => {
                        if (v.video_url) allVideos.push(v.video_url);
                      });
                    }


                    const hasMedia = allImages.length > 0 || allVideos.length > 0;

                    if (!hasMedia && !detailText) return null;

                    return (
                      <div className="mt-10 pt-10 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Batafsil ma'lumot</h3>
                        <div className={hasMedia ? "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start" : "w-full"}>
                          
                          {/* Detail Text & Accordion */}
                          <div className={hasMedia ? "lg:col-span-3 space-y-4" : "w-full"}>
                            {detailText && (
                              <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />
                            )}

                            {target.department_tasks && target.department_tasks.filter((t: any) => getLocalizedField(t, 'title')).length > 0 && (
                              <div className="grid grid-cols-1 gap-4">
                                {[...target.department_tasks].filter((t: any) => getLocalizedField(t, 'title')).sort((a: any, b: any) => a.order - b.order).map((task: any, idx: number) => {
                                  const isOpen = openSectionIdx === idx;
                                  return (
                                    <div key={task.id} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 bg-white h-fit">
                                      <button
                                        onClick={() => setOpenSectionIdx(isOpen ? null : idx)}
                                        className={`w-full text-left p-5 font-bold text-base md:text-lg flex justify-between items-center transition-colors duration-300 gap-4 ${
                                          isOpen
                                            ? 'bg-blue-50/75 text-blue-900 border-b border-blue-100/50'
                                            : 'bg-white text-slate-800 hover:bg-slate-50'
                                        }`}
                                      >
                                        <span>{getLocalizedField(task, 'title')}</span>
                                        <span className={`transform transition-transform duration-300 text-blue-600 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                          <ChevronDown size={20} />
                                        </span>
                                      </button>
                                      {isOpen && (
                                        <div className="p-6 bg-white prose prose-blue max-w-none text-slate-600 leading-relaxed font-normal">
                                          <div dangerouslySetInnerHTML={{ __html: getLocalizedField(task, 'task_text') }} />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Media Right Column */}
                          {hasMedia && (
                            <div className="lg:col-span-2 space-y-6 w-full max-w-md mx-auto">
                              {allImages.length > 0 && (
                                <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-slate-50 p-2 flex items-center justify-center aspect-video lg:aspect-[4/3] w-full">
                                  <img
                                    src={allImages[currentImgIdx]}
                                    alt={`${getLocalizedField(target, 'name')} - ${currentImgIdx + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-xl transition-all duration-500"
                                  />
                                  {allImages.length > 1 && (
                                    <>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <ChevronLeft size={18} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <ChevronRight size={18} />
                                      </button>
                                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        {allImages.map((_, i) => (
                                          <button
                                            key={i}
                                            onClick={() => setCurrentImgIdx(i)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${currentImgIdx === i ? 'bg-white w-3' : 'bg-white/50'}`}
                                          />
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {allVideos.length > 0 && (
                                <div className="grid grid-cols-1 gap-4">
                                  {allVideos.map((videoUrl, i) => (
                                    <a
                                      key={i}
                                      href={videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block relative rounded-2xl overflow-hidden shadow-md bg-gray-900 aspect-video flex items-center justify-center border border-gray-100"
                                    >
                                      <img
                                        src={allImages[0] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'}
                                        alt={`Video thumbnail - ${i + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                                      />
                                      <PlayCircle size={56} className="text-white relative z-10 group-hover:scale-110 transition-transform shadow-sm" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center text-gray-500">
          {t('departments.no_departments')}
        </div>
      )}
      <ImageModal 
        images={zoomedImage ? [zoomedImage] : []}
        initialIndex={0}
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
      />
    </div>
  );
};

export default Departments;
