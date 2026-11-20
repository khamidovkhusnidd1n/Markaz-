import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, Eye, ThumbsUp, ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { BackendAPI } from '../services/backend';
import { getImageUrl } from '../utils';

// Helper component for Image Carousel
const ImageCarousel = ({ images, containerClassName = "h-48 bg-gray-100 rounded-t-xl" }: { images: any[], containerClassName?: string }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center ${containerClassName}`}>
        <Briefcase size={48} className="text-gray-300" />
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative w-full group overflow-hidden ${containerClassName}`}>
      <img
        src={getImageUrl(images[currentIndex].image)}
        alt={t('common.project_image_alt')}
        className="w-full h-full object-contain transition-opacity duration-300"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pedagogues, pedagogueProjects } = useApp();
  const [activeTab, setActiveTab] = useState<'pedagogues' | 'projects'>('pedagogues');
  const [selectedPedagogue, setSelectedPedagogue] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [votedProjects, setVotedProjects] = useState<Set<number>>(new Set());
  const [viewedProjects, setViewedProjects] = useState<Set<number>>(new Set());

  // Load votes/views from localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem('votedProjects');
    if (savedVotes) setVotedProjects(new Set(JSON.parse(savedVotes)));
    
    const savedViews = localStorage.getItem('viewedProjects');
    if (savedViews) setViewedProjects(new Set(JSON.parse(savedViews)));
  }, []);

  // Sync projects state
  useEffect(() => {
    if (pedagogueProjects) {
      // Sort by votes initially
      setLocalProjects([...pedagogueProjects].sort((a, b) => b.votes_count - a.votes_count));
    }
  }, [pedagogueProjects]);

  const getLocalizedField = (obj: any, field: string) => {
    if (!obj) return '';
    const lang = i18n.language?.substring(0, 2);
    if (lang === 'ru' && obj[`${field}_ru`]) return obj[`${field}_ru`];
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    return obj[field] || '';
  };

  const handleVote = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    if (votedProjects.has(projectId)) return;

    try {
      const res = await BackendAPI.incrementProjectVote(projectId);
      setLocalProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, votes_count: res.data.votes_count } : p
      ).sort((a, b) => b.votes_count - a.votes_count));
      
      const newVoted = new Set(votedProjects).add(projectId);
      setVotedProjects(newVoted);
      localStorage.setItem('votedProjects', JSON.stringify(Array.from(newVoted)));
    } catch (err) {
      console.error('Vote failed', err);
    }
  };

  const handleView = async (projectId: number) => {
    if (viewedProjects.has(projectId)) return;

    try {
      const res = await BackendAPI.incrementProjectView(projectId);
      setLocalProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, views_count: res.data.views_count } : p
      ));
      
      const newViewed = new Set(viewedProjects).add(projectId);
      setViewedProjects(newViewed);
      localStorage.setItem('viewedProjects', JSON.stringify(Array.from(newViewed)));
    } catch (err) {
      console.error('View failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('portfolio.back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{t('portfolio.title')}</h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            {t('portfolio.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        {!selectedPedagogue && (
          <div className="flex border border-slate-200 mb-8 bg-white p-1.5 rounded-xl shadow-xs max-w-md">
            <button
              onClick={() => setActiveTab('pedagogues')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'pedagogues'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users size={16} />
              {t('portfolio.tab_pedagogues')}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'projects'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase size={16} />
              {t('portfolio.tab_projects_short')}
            </button>
          </div>
        )}

        {/* Tab Content: Pedagogues List */}
        {activeTab === 'pedagogues' && !selectedPedagogue && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedagogues?.map((pedagogue) => (
              <div 
                key={pedagogue.id} 
                onClick={() => setSelectedPedagogue(pedagogue)}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
              >
                <div className="h-32 bg-gradient-to-r from-slate-800 to-blue-900 relative flex items-center justify-center">
                  {pedagogue.image ? (
                    <img src={getImageUrl(pedagogue.image)} alt={getLocalizedField(pedagogue, 'full_name')} className="w-22 h-22 rounded-full border-4 border-white shadow-md object-cover absolute -bottom-6 bg-white" />
                  ) : (
                    <div className="w-22 h-22 rounded-full border-4 border-white shadow-md bg-slate-200 text-slate-600 flex items-center justify-center text-3xl font-bold absolute -bottom-6">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <div className="pt-10 p-5 flex-grow flex flex-col text-center">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">{getLocalizedField(pedagogue, 'full_name')}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 text-left leading-relaxed">
                    {getLocalizedField(pedagogue, 'bio')}
                  </p>
                  <div className="mt-auto border-t border-slate-100 pt-3.5 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                    <Briefcase size={15} />
                    {t('portfolio.project_count', { count: pedagogue.projects?.length || 0 })}
                  </div>
                </div>
              </div>
            ))}
            {(!pedagogues || pedagogues.length === 0) && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Users size={44} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">{t('portfolio.no_pedagogues')}</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Pedagogue View */}
        {selectedPedagogue && (
          <div className="space-y-8">
            <button 
              onClick={() => setSelectedPedagogue(null)}
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold text-sm transition-colors bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs"
            >
              <ArrowLeft size={16} /> {t('portfolio.back_btn')}
            </button>
            
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="w-36 h-36 shrink-0">
                {selectedPedagogue.image ? (
                  <img src={getImageUrl(selectedPedagogue.image)} alt="profile" className="w-full h-full rounded-2xl object-cover border border-slate-200 shadow-xs" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <User size={56} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{getLocalizedField(selectedPedagogue, 'full_name')}</h2>
                <div className="prose text-slate-600 max-w-none whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {getLocalizedField(selectedPedagogue, 'bio')}
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-5 border-l-4 border-blue-800 pl-3">{t('portfolio.works_title')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedPedagogue.projects?.map((project: any) => {
                const fullProject = localProjects.find(p => p.id === project.id) || project;
                return (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
                    onMouseEnter={() => handleView(project.id)}
                    onClick={() => setSelectedProject(fullProject)}
                  >
                    <ImageCarousel images={fullProject.images} />
                    <div className="p-5 flex-grow flex flex-col">
                      <h4 className="text-base font-bold text-slate-900 mb-4 flex-grow">{getLocalizedField(fullProject, 'title')}</h4>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                        <div className="flex items-center gap-1 text-slate-500 text-xs sm:text-sm">
                          <Eye size={15} />
                          <span>{fullProject.views_count}</span>
                        </div>
                        <button 
                          onClick={(e) => handleVote(e, fullProject.id)}
                          className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                            votedProjects.has(fullProject.id)
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp size={15} className={votedProjects.has(fullProject.id) ? 'fill-current' : ''} />
                          <span>{fullProject.votes_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!selectedPedagogue.projects || selectedPedagogue.projects.length === 0) && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  {t('portfolio.no_works')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: All Projects (Ranked) */}
        {activeTab === 'projects' && !selectedPedagogue && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localProjects.map((project) => {
              const pedagogue = pedagogues?.find(p => p.id == project.pedagogue);
              return (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
                  onMouseEnter={() => handleView(project.id)}
                  onClick={() => setSelectedProject(project)}
                >
                  <ImageCarousel images={project.images} />
                  <div className="p-5 flex-grow flex flex-col">
                    <h4 className="text-base font-bold text-slate-900 mb-1.5">{getLocalizedField(project, 'title')}</h4>
                    <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-4 flex-grow">
                      {t('portfolio.author_label')}: {pedagogue ? getLocalizedField(pedagogue, 'full_name') : t('portfolio.unknown')}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <div className="flex items-center gap-1 text-slate-500 text-xs sm:text-sm">
                        <Eye size={15} />
                        <span>{project.views_count}</span>
                      </div>
                      <button 
                        onClick={(e) => handleVote(e, project.id)}
                        className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          votedProjects.has(project.id)
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp size={15} className={votedProjects.has(project.id) ? 'fill-current' : ''} />
                        <span>{project.votes_count}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {localProjects.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Briefcase size={44} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">{t('portfolio.no_projects_short')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{getLocalizedField(selectedProject, 'title')}</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
                title={t('portfolio.close_btn')}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-0 bg-slate-50 border-b border-slate-200">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <ImageCarousel 
                  images={selectedProject.images} 
                  containerClassName="h-[460px] w-full bg-slate-50"
                />
              ) : (
                <div className="w-full h-[360px] bg-slate-50 flex items-center justify-center">
                  <Briefcase size={56} className="text-slate-300" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Eye size={18} />
                  <span className="font-medium">{selectedProject.views_count}</span>
                </div>
                <button 
                  onClick={(e) => handleVote(e, selectedProject.id)}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
                    votedProjects.has(selectedProject.id)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp size={18} className={votedProjects.has(selectedProject.id) ? 'fill-current' : ''} />
                  <span>{selectedProject.votes_count}</span>
                </button>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5">{t('portfolio.description_title')}</h4>
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {getLocalizedField(selectedProject, 'description') || t('portfolio.no_description')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Portfolio;
