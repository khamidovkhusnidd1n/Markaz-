import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle, Monitor, BookOpen, Cpu, Grid, ChevronDown, ChevronLeft, ChevronRight, Play, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsModal } from '../components/NewsModal';
import { ImageModal } from '../components/ImageModal';
import { useApp } from '../context/AppContext';
import { getImageUrl, sanitizeHtml } from '../utils';
import { BackendAPI } from '../services/backend';

const DepartmentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { departments } = useApp();

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

  const dept = departments?.find(d => d.id.toString() === slug) || null;

  const [openSectionIdx, setOpenSectionIdx] = React.useState<number | null>(0);
  const [currentImgIdx, setCurrentImgIdx] = React.useState<number>(0);
    const [selectedPost, setSelectedPost] = React.useState<any | null>(null);
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);


  React.useEffect(() => {
    setOpenSectionIdx(0);
    window.scrollTo(0, 0);
  }, [slug]);

  const handlePostClick = (post: any) => {
    const allImages: { id: any, url: string, type: 'image' | 'video' }[] = [];
    
    // Asosiy rasm yoki video
    const mainVideoUrl = post.video || post.video_url;
    const mainImageUrl = post.image || post.image_url;
    
    if (mainVideoUrl) {
      allImages.push({ id: 'main_video', url: mainVideoUrl, type: 'video' });
    } else if (mainImageUrl) {
      allImages.push({ id: 'main_image', url: mainImageUrl, type: 'image' });
    }
    
    // Qo'shimcha rasm yoki videolar
    if (post.images && post.images.length > 0) {
      post.images.forEach((img: any) => {
        const videoUrl = img.video || img.video_url;
        const imageUrl = img.image || img.image_url;
        
        if (videoUrl) {
          allImages.push({ id: img.id, url: videoUrl, type: 'video' });
        } else if (imageUrl) {
          allImages.push({ id: img.id, url: imageUrl, type: 'image' });
        }
      });
    }

    // Optimistically update the UI if possible, or just set the state
    setSelectedPost({
      id: post.id,
      title: getLocalizedField(post, 'title'),
      date: post.date,
      content: getLocalizedField(post, 'content'),
      videoUrl: mainVideoUrl,
      image: mainImageUrl,
      images: allImages,
      views_count: (post.views_count || 0) + 1
    });
    
    // Call API in background
    BackendAPI.incrementDepartmentPostView(post.id).then(newCount => {
      // We could update the global state here if needed
      post.views_count = newCount;
    }).catch(console.error);
  };

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">{t('departments.no_departments')}</h2>
          <Link to="/" className="text-blue-700 font-semibold hover:underline">{t('departments.back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('departments.back')}
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
              {getIcon(dept.icon_name || '')}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{getLocalizedField(dept, 'name')}</h1>
          </div>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            {getLocalizedField(dept, 'description')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('departments.main_tasks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.department_tasks && dept.department_tasks.length > 0 ? (
                [...dept.department_tasks].sort((a, b) => a.order - b.order).map((taskObj, idx) => {
                  const taskText = getLocalizedField(taskObj, 'task_text');
                  if (!taskText.trim()) return null;
                  return (
                    <div
                      key={taskObj.id}
                      className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors duration-200 group border border-slate-200/80"
                    >
                      <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="text-slate-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(taskText) }} />
                    </div>
                  );
                })
              ) : (
                getLocalizedField(dept, 'tasks').split(/\r?\n/).map((task: string, idx: number) => {
                  if (!task.trim()) return null;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors duration-200 group border border-slate-200/80"
                    >
                      <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="text-slate-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(task) }} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Detailed Info */}
            {(() => {
              const target = typeof dept !== 'undefined' ? dept : currentTab;
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
                  <h3 className="text-xl font-bold text-gray-800 mb-6">{t('news.more_info')}</h3>
                  <div className={hasMedia ? "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start" : "w-full"}>
                    
                    {/* Detail Text & Accordion */}
                    <div className={hasMedia ? "lg:col-span-3 space-y-4" : "w-full"}>
                      {detailText && (
                        <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(detailText) }} />
                      )}

                      {dept.department_tasks && dept.department_tasks.filter((t: any) => getLocalizedField(t, 'title')).length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                          {[...dept.department_tasks].filter((t: any) => getLocalizedField(t, 'title')).sort((a: any, b: any) => a.order - b.order).map((task: any, idx: number) => {
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
                                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalizedField(task, 'task_text')) }} />
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
                                className="group block relative rounded-2xl overflow-hidden shadow-sm bg-slate-900 aspect-video flex items-center justify-center border border-slate-200"
                              >
                                {allImages[0] && (
                                  <img
                                    src={allImages[0]}
                                    alt={`Video thumbnail - ${i + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                                  />
                                )}
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
      <ImageModal 
        images={zoomedImage ? [zoomedImage] : []}
        initialIndex={0}
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
      />

      {/* Qilingan ishlar / Posts Section */}
      {(() => {
        const postsToDisplay = (dept.department_posts && dept.department_posts.length > 0)
          ? dept.department_posts
          : [];

        if (!postsToDisplay || postsToDisplay.length === 0) return null;
        const isAktDept = dept.id === 1 || (dept.name && dept.name.toLowerCase().includes('axborot'));

        return (
          <section className="container mx-auto px-4 sm:px-6 py-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {isAktDept ? "Amaliy natijalar va loyihalar" : "Hamkorliklar va tadbirlar"}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
                  {isAktDept ? "Bo‘lim tomonidan amalga oshirilgan ishlar" : t('department.works_and_partnerships')}
                </h2>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Jami: <span className="font-bold text-slate-800">{postsToDisplay.length} ta</span> amaliy ish
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {postsToDisplay.map((post: any) => {
                const postTitle = getLocalizedField(post, 'title');
                const postContent = getLocalizedField(post, 'content');
                const postImg = post.images?.[0]?.image_url || post.image || post.image_url;
                const hasVideo = post.video || post.video_url || post.images?.[0]?.video_url || post.images?.[0]?.video;

                return (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden text-left"
                  >
                    <div className="h-44 overflow-hidden bg-slate-100 w-full relative">
                      {hasVideo ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Play className="text-white opacity-80 w-12 h-12 group-hover:scale-110 transition-transform" />
                        </div>
                      ) : postImg ? (
                        <img
                          src={postImg}
                          alt={postTitle}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400">
                          <ImageOff size={36} strokeWidth={1.5} />
                          <span className="text-xs font-semibold">
                            {i18n.language?.startsWith('ru') ? 'Фото не загружено' : i18n.language?.startsWith('en') ? 'Image not uploaded' : 'Rasm yuklanmagan'}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 shadow-xs">
                        {post.date || "2026"}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                        {postTitle}
                      </h3>
                      <div
                        className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(postContent) }}
                      />
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                        <span>{t('news_list.read_more')}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })()}

      {selectedPost && (
        <NewsModal newsItem={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

    </div>
  );
};

export default DepartmentPage;
