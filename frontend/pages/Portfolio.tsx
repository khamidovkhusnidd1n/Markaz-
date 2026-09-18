import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, Eye, ThumbsUp, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { BackendAPI } from '../services/backend';
import { getImageUrl } from '../utils';

// Helper component for Image Carousel
const ImageCarousel = ({ images, containerClassName = "h-48 bg-gray-100 rounded-t-xl" }: { images: any[], containerClassName?: string }) => {
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
        alt="Loyiha rasmi"
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
      <div className="bg-gradient-to-r from-violet-700 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-200 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('portfolio.back')}
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3">{t('portfolio.title')}</h1>
          <p className="text-violet-200 text-lg max-w-2xl font-light">
            {t('portfolio.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Navigation Tabs */}
        {!selectedPedagogue && (
          <div className="flex border-b border-gray-200 mb-8 bg-white p-2 rounded-xl shadow-sm max-w-md">
            <button
              onClick={() => setActiveTab('pedagogues')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'pedagogues'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users size={18} />
              {t('portfolio.tab_pedagogues')}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'projects'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase size={18} />
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
              >
                <div className="h-40 bg-gradient-to-r from-violet-100 to-indigo-100 relative flex items-center justify-center group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors">
                  {pedagogue.image ? (
                    <img src={getImageUrl(pedagogue.image)} alt={getLocalizedField(pedagogue, 'full_name')} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover absolute -bottom-6" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-violet-500 text-white flex items-center justify-center text-3xl font-bold absolute -bottom-6">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="pt-10 p-6 flex-grow flex flex-col text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{getLocalizedField(pedagogue, 'full_name')}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 text-left italic">
                    {getLocalizedField(pedagogue, 'bio')}
                  </p>
                  <div className="mt-auto border-t pt-4 text-violet-600 font-semibold text-sm flex items-center justify-center gap-2">
                    <Briefcase size={16} />
                    {t('portfolio.project_count', { count: pedagogue.projects?.length || 0 })}
                  </div>
                </div>
              </div>
            ))}
            {(!pedagogues || pedagogues.length === 0) && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Users size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Pedagoglar hozircha yo'q.</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Pedagogue View */}
        {selectedPedagogue && (
          <div className="space-y-8 animate-fade-in">
            <button 
              onClick={() => setSelectedPedagogue(null)}
              className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <ArrowLeft size={16} /> {t('portfolio.back_btn')}
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-40 h-40 shrink-0">
                {selectedPedagogue.image ? (
                  <img src={getImageUrl(selectedPedagogue.image)} alt="profile" className="w-full h-full rounded-2xl object-cover shadow-sm" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-violet-100 flex items-center justify-center text-violet-400">
                    <User size={64} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{getLocalizedField(selectedPedagogue, 'full_name')}</h2>
                <div className="prose text-gray-600 max-w-none whitespace-pre-line leading-relaxed">
                  {getLocalizedField(selectedPedagogue, 'bio')}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-l-4 border-violet-600 pl-3">{t('portfolio.works_title')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedPedagogue.projects?.map((project: any) => {
                const fullProject = localProjects.find(p => p.id === project.id) || project;
                return (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                    onMouseEnter={() => handleView(project.id)}
                    onClick={() => setSelectedProject(fullProject)}
                  >
                    <ImageCarousel images={fullProject.images} />
                    <div className="p-5 flex-grow flex flex-col">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex-grow">{getLocalizedField(fullProject, 'title')}</h4>
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Eye size={16} />
                          <span>{fullProject.views_count}</span>
                        </div>
                        <button 
                          onClick={(e) => handleVote(e, fullProject.id)}
                          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                            votedProjects.has(fullProject.id)
                              ? 'bg-violet-100 text-violet-600'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsUp size={16} className={votedProjects.has(fullProject.id) ? 'fill-current' : ''} />
                          <span>{fullProject.votes_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!selectedPedagogue.projects || selectedPedagogue.projects.length === 0) && (
                <div className="col-span-full text-center py-12 text-gray-500">
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
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                  onMouseEnter={() => handleView(project.id)}
                  onClick={() => setSelectedProject(project)}
                >
                  <ImageCarousel images={project.images} />
                  <div className="p-5 flex-grow flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{getLocalizedField(project, 'title')}</h4>
                    <p className="text-sm text-violet-600 font-medium mb-4 flex-grow">
                      {t('portfolio.author_label')}: {pedagogue ? getLocalizedField(pedagogue, 'full_name') : t('portfolio.unknown')}
                    </p>
                    
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Eye size={16} />
                        <span>{project.views_count}</span>
                      </div>
                      <button 
                        onClick={(e) => handleVote(e, project.id)}
                        className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          votedProjects.has(project.id)
                            ? 'bg-violet-100 text-violet-600'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp size={16} className={votedProjects.has(project.id) ? 'fill-current' : ''} />
                        <span>{project.votes_count}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {localProjects.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">{t('portfolio.no_projects_short')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold">{getLocalizedField(selectedProject, 'title')}</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-red-500 transition-colors p-2 font-bold"
              >
                {t('portfolio.close_btn')}
              </button>
            </div>
            <div className="p-0 bg-slate-50 border-b border-gray-100">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <ImageCarousel 
                  images={selectedProject.images} 
                  containerClassName="h-[500px] w-full bg-slate-50"
                />
              ) : (
                <div className="w-full h-[500px] bg-slate-50 flex items-center justify-center">
                  <Briefcase size={64} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye size={20} />
                  <span className="font-medium">{selectedProject.views_count}</span>
                </div>
                <button 
                  onClick={(e) => handleVote(e, selectedProject.id)}
                  className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-full transition-colors ${
                    votedProjects.has(selectedProject.id)
                      ? 'bg-violet-100 text-violet-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp size={20} className={votedProjects.has(selectedProject.id) ? 'fill-current' : ''} />
                  <span>{selectedProject.votes_count}</span>
                </button>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{t('portfolio.description_title')}</h4>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
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
