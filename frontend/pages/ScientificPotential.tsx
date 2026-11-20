import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Award, GraduationCap, BookOpen, Users, TrendingUp, X, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ImageModal } from '../components/ImageModal';
import { sanitizeHtml } from '../utils';

const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e2e8f0"><rect width="100" height="100"/><circle cx="50" cy="36" r="18" fill="%2394a3b8"/><path d="M18 84c0-16 14-26 32-26s32 10 32 26" fill="%2394a3b8"/></svg>';

const ScientificPotential: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const { teachers = [], stats, personnel = [] } = useApp();

  // Use teachers if available, otherwise show personnel (leadership + staff) as scientific capacity
  const scientificStaff = (teachers || []).length > 0 ? teachers : (personnel || []).map(p => ({
    id: p.id,
    fullName: p.fullName,
    position: p.position,
    position_translated: (p as any).position_translated || p.position || '',
    degree: (p as any).degree || '',
    degree_translated: (p as any).degree_translated || '',
    title: (p as any).title || '',
    title_translated: (p as any).title_translated || '',
    awards: (p as any).awards || '',
    awards_translated: (p as any).awards_translated || '',
    biography: p.biography || '',
    biography_translated: (p as any).biography_translated || p.biography || '',
    photoUrl: p.photoUrl || '',
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 py-14 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('sci_potential.back')}
          </Link>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 block">
            {t('sci_potential.badge')}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('sci_potential.title')}</h1>
          <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl">{t('sci_potential.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users size={22} />, value: stats?.totalPedagogs || 0, label: t('sci_potential.stat_total'), style: 'bg-slate-100 text-slate-800 border-slate-200' },
            { icon: <GraduationCap size={22} />, value: stats?.professors || 0, label: t('sci_potential.stat_professors'), style: 'bg-blue-50 text-blue-800 border-blue-200' },
            { icon: <BookOpen size={22} />, value: stats?.dotsents || 0, label: t('sci_potential.stat_dotsents'), style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { icon: <TrendingUp size={22} />, value: (stats?.potential || 0) + '%', label: t('sci_potential.stat_potential'), style: 'bg-amber-50 text-amber-800 border-amber-200' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 ${stat.style} border rounded-xl flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{stat.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scientific Staff Grid */}
      <section className="container mx-auto px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('sci_potential.staff_title')}</h2>
        <p className="text-slate-500 mb-8 max-w-2xl text-sm sm:text-base">{t('sci_potential.staff_subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scientificStaff.length > 0 ? scientificStaff.map((teacher) => (
            <div 
              key={teacher.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200 hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                <img 
                  src={teacher.photoUrl || DEFAULT_AVATAR} 
                  alt={teacher.fullName} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                />
                {/* Badge for degree */}
                {teacher.degree && (
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 border border-white/15 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Award size={12} />
                    {teacher.degree_translated || teacher.degree}
                  </div>
                )}
              </div>
              <div className="p-5 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1 leading-snug">
                    {teacher.fullName}
                  </h3>
                  <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-1">
                    {teacher.position_translated || teacher.position}
                  </p>
                </div>
                {(teacher.title || teacher.awards) && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-1">
                    {teacher.title && (
                      <div>
                        <span className="font-semibold text-slate-400">{t('sci_potential.academic_title')}:</span>{' '}
                        <span className="text-slate-700 font-medium">{teacher.title_translated || teacher.title}</span>
                      </div>
                    )}
                    {teacher.awards && (
                      <div>
                        <span className="font-semibold text-slate-400">{t('sci_potential.awards')}:</span>{' '}
                        <span className="text-slate-700 font-medium">{teacher.awards_translated || teacher.awards}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 group-hover:text-blue-900 transition-colors">
                  <span>{t('sci_potential.view_details', "Batafsil / Biografiya")}</span>
                  <span className="text-sm transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Users size={44} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-base">{t('sci_potential.no_data')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Teacher Biography Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedTeacher.fullName}</h3>
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div 
                  className={`w-full md:w-1/3 relative group ${selectedTeacher.photoUrl ? 'cursor-pointer' : ''}`}
                  onClick={() => selectedTeacher.photoUrl && setZoomedImage(selectedTeacher.photoUrl)}
                >
                  <img 
                    src={selectedTeacher.photoUrl || DEFAULT_AVATAR} 
                    alt={selectedTeacher.fullName} 
                    className="w-full aspect-[4/5] object-cover object-top rounded-xl border border-slate-200 shadow-xs bg-slate-100" 
                  />
                  {selectedTeacher.photoUrl && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                      <div className="bg-white/90 text-slate-900 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
                        <ZoomIn size={20} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('sci_potential.position', 'Lavozimi')}</p>
                    <p className="text-base sm:text-lg font-bold text-blue-800 mt-0.5">{selectedTeacher.position_translated || selectedTeacher.position}</p>
                  </div>
                  
                  {selectedTeacher.degree && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('sci_potential.academic_degree', 'Ilmiy darajasi')}</p>
                      <p className="text-slate-900 font-medium mt-0.5">{selectedTeacher.degree_translated || selectedTeacher.degree}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.title && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('sci_potential.academic_title', 'Ilmiy unvoni')}</p>
                      <p className="text-slate-900 font-medium mt-0.5">{selectedTeacher.title_translated || selectedTeacher.title}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.awards && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('sci_potential.awards', 'Mukofotlari')}</p>
                      <p className="text-slate-900 font-medium mt-0.5">{selectedTeacher.awards_translated || selectedTeacher.awards}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {t('sci_potential.biography', 'Biografiyasi')}
                </h4>
                <div className="prose prose-slate max-w-none">
                  {selectedTeacher.biography_translated || selectedTeacher.biography ? (
                    (() => {
                      const bio = selectedTeacher.biography_translated || selectedTeacher.biography;
                      const hasHtml = /<[a-z][\s\S]*>/i.test(bio);
                      return hasHtml ? (
                        <div className="[&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>p]:mb-3 leading-relaxed text-slate-700 text-base" dangerouslySetInnerHTML={{ __html: sanitizeHtml(bio) }} />
                      ) : (
                        <div className="whitespace-pre-line text-slate-700 leading-relaxed text-base">{bio}</div>
                      );
                    })()
                  ) : (
                    <p className="text-slate-400 italic">{t('sci_potential.no_biography', 'Biografiya kiritilmagan.')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
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

export default ScientificPotential;
