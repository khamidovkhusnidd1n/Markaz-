import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PlayCircle, Monitor, BookOpen, Cpu, Grid, ChevronDown, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsModal } from '../components/NewsModal';
import { ImageModal } from '../components/ImageModal';
import { useApp } from '../context/AppContext';
import { getImageUrl, sanitizeHtml } from '../utils';
import { BackendAPI } from '../services/backend';

const DEFAULT_AKT_POSTS = [
  {
    id: 101,
    title: "Markaz rasmiy veb-portali (uzbamalaka.uz) va raqamli ekotizimini ishlab chiqish hamda modernizatsiyalash",
    title_ru: "Разработка и модернизация официального веб-портала (uzbamalaka.uz) и цифровой экосистемы Центра",
    title_en: "Development and modernization of the Center official web portal (uzbamalaka.uz) and digital ecosystem",
    content: "<p>Markaz faoliyatini to'liq raqamlashtirish maqsadida zamonaviy veb-portal ishlab chiqildi. Portal orqali tinglovchilar uchun onlayn ro'yxatdan o'tish, shaxsiy kabinet, berilgan sertifikatlar haqiqiyligini tekshirish (reyestr), xalqaro hamkorliklar va virtual qabulxona kabi interaktiv xizmatlar yo'lga qo'yildi.</p><p>Veb-portal zamonaviy xavfsizlik standartlari, qidiruv tizimlari (SEO) va mobil moslashuvchanlik talablariga to'liq javob beradi.</p>",
    content_ru: "<p>В целях полной цифровизации деятельности Центра разработан современный веб-портал. Через портал внедрены такие интерактивные сервисы, как онлайн-регистрация слушателей, личный кабинет, проверка подлинности выданных сертификатов (реестр), международное сотрудничество и виртуальная приемная.</p>",
    content_en: "<p>In order to fully digitalize the Center's activities, a modern web portal was developed. Through the portal, interactive services such as online listener registration, personal account, certificate authenticity verification (registry), international cooperation and virtual reception were launched.</p>",
    image: "/media/uploads/departmentpost/3a0b18689e02494998a7d4ff08d3c0d0.png",
    image_url: "/media/uploads/departmentpost/3a0b18689e02494998a7d4ff08d3c0d0.png",
    date: "2026-09-10",
    views_count: 142
  },
  {
    id: 102,
    title: "O‘zBA Test platformasi va tinglovchilar bilimini avtomatlashtirilgan baholash tizimi",
    title_ru: "Тестовая платформа O'zBA и автоматизированная система оценки знаний слушателей",
    title_en: "O'zBA Testing platform and automated knowledge evaluation system",
    content: "<p>Pedagog va mutaxassis kadrlarning malaka oshirish kurslari yakunida ularning bilim va ko'nikmalarini xolis hamda shaffof baholash uchun maxsus avtomatlashtirilgan onlayn test sinovlari tizimi joriy etildi.</p><p>Tizim test savollari bankini boshqarish, vaqt nazorati, natijalarni avtomatik hisoblash va rasmiy hisobotlarni shakllantirish imkonini beradi.</p>",
    content_ru: "<p>Для объективной и прозрачной оценки знаний и навыков педагогических кадров по итогам курсов повышения квалификации внедрена специальная автоматизированная система онлайн-тестирования.</p>",
    content_en: "<p>For an objective and transparent assessment of knowledge and skills of pedagogical personnel, a specialized automated online testing platform was established.</p>",
    image: "/media/uploads/departmentpost/c0a7f2285bcd4f6a8d486842f0f63caa.png",
    image_url: "/media/uploads/departmentpost/c0a7f2285bcd4f6a8d486842f0f63caa.png",
    date: "2026-09-08",
    views_count: 98
  },
  {
    id: 103,
    title: "Axborot xavfsizligi, kiberxavfsizlik ekspertizasi va UZCERT talablariga muvofiqlashtirish",
    title_ru: "Информационная безопасность, экспертиза кибербезопасности и соответствие требованиям UZCERT",
    title_en: "Information security, cybersecurity audit and compliance with UZCERT standards",
    content: "<p>Markaz axborot tizimlari va ma'lumotlar bazalarini kiberxavflardan himoya qilish, SSL/TLS xavfsizlik shifrlashini o'rnatish, OWASP Top-10 standartlari hamda Kiberxavfsizlik markazi DUK (UZCERT) ekspertizasi talablariga to'liq moslashtirish ishlari amalga oshirildi.</p><p>Tizimda SQL injection, XSS, CSRF xavflariga qarshi kompleks himoya choralari joriy qilingan.</p>",
    content_ru: "<p>Проведены работы по защите информационных систем и баз данных Центра от киберугроз, установке сертификатов SSL/TLS, обеспечению стандартов OWASP Top-10 и полному соответствию требованиям ГУП Центр кибербезопасности (UZCERT).</p>",
    content_en: "<p>Comprehensive security works were carried out to protect information systems and databases, configure SSL/TLS encryption, and adhere to OWASP Top-10 and UZCERT cybersecurity standards.</p>",
    image: "/media/uploads/departmentpost/73b234bf5adc4f6fb193a39fc16eacd8.jpg",
    image_url: "/media/uploads/departmentpost/73b234bf5adc4f6fb193a39fc16eacd8.jpg",
    date: "2026-09-05",
    views_count: 115
  },
  {
    id: 104,
    title: "Multimedia kontentlari, rasmiy veb-sayt va ijtimoiy tarmoqlardagi sahifalarni professional yuritish",
    title_ru: "Мультимедийный контент, профессиональное ведение официального сайта и страниц в соцсетях",
    title_en: "Multimedia content production, professional management of official website and social media",
    content: "<p>Markazda o'tkazilayotgan barcha ta'lim dasturlari, ilmiy-amaliy anjumanlar, ijodiy ko'rgazmalar va xalqaro uchrashuvlar bo'yicha yuqori sifatli foto-video reportajlar tayyorlanib, rasmiy veb-sayt hamda Telegram, YouTube, Facebook va Instagram tarmoqlarida uzluksiz yoritib borilmoqda.</p>",
    content_ru: "<p>Осуществляется профессиональная фото- и видеосъемка всех учебных программ, научно-практических конференций, выставок и международных встреч с оперативной публикацией на сайте и в социальных сетях.</p>",
    content_en: "<p>High-quality photo and video materials are produced and published for all educational programs, scientific conferences, exhibitions and international events across the official site and social media channels.</p>",
    image: "/media/uploads/departmentpost/3b2a4a66159443d191f4ec22e3c2f07d.jpg",
    image_url: "/media/uploads/departmentpost/3b2a4a66159443d191f4ec22e3c2f07d.jpg",
    date: "2026-09-02",
    views_count: 164
  }
];

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

  console.log('DEPARTMENT:', dept?.name, 'POSTS:', dept?.department_posts);
  if (!dept) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('departments.no_departments')}</h2>
          <Link to="/" className="text-blue-600 hover:underline">{t('departments.back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${dept.color_classes || 'from-blue-900 to-blue-700'} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('departments.back')}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {getIcon(dept.icon_name || '')}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{getLocalizedField(dept, 'name')}</h1>
          </div>
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
            {getLocalizedField(dept, 'description')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{t('departments.main_tasks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.department_tasks && dept.department_tasks.length > 0 ? (
                [...dept.department_tasks].sort((a, b) => a.order - b.order).map((taskObj, idx) => {
                  const taskText = getLocalizedField(taskObj, 'task_text');
                  if (!taskText.trim()) return null;
                  return (
                    <div
                      key={taskObj.id}
                      className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dept.color_classes || 'from-blue-600 to-blue-800'} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                        {idx + 1}
                      </div>
                      <div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(taskText) }} />
                    </div>
                  );
                })
              ) : (
                getLocalizedField(dept, 'tasks').split(/\r?\n/).map((task: string, idx: number) => {
                  if (!task.trim()) return null;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${dept.color_classes || 'from-blue-600 to-blue-800'} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                        {idx + 1}
                      </div>
                      <div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(task) }} />
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
      <ImageModal 
        images={zoomedImage ? [zoomedImage] : []}
        initialIndex={0}
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
      />

      {/* Qilingan ishlar / Posts Section */}
      {(() => {
        const isAktDept = dept.id === 1 || (dept.name && dept.name.toLowerCase().includes('axborot'));
        const postsToDisplay = (dept.department_posts && dept.department_posts.length > 0)
          ? dept.department_posts
          : (isAktDept ? DEFAULT_AKT_POSTS : []);

        if (!postsToDisplay || postsToDisplay.length === 0) return null;

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
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium">
                          {t('common.no_image')}
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
