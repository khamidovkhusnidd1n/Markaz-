import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Award, GraduationCap, BookOpen, Users, TrendingUp, X, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ImageModal } from '../components/ImageModal';

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
    position_translated: '',
    degree: '',
    degree_translated: '',
    title: '',
    title_translated: '',
    awards: '',
    awards_translated: '',
    photoUrl: p.photoUrl || '',
  }));

  const professors = (teachers || []).filter(t => {
    const deg = (t?.degree || '').toLowerCase();
    return deg.includes('doktor') || deg.includes('doctor') || deg.includes('профессор');
  });
  const dotsents = (teachers || []).filter(t => {
    const title = (t?.title || '').toLowerCase();
    return title.includes('dotsent') || title.includes('доцент');
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('sci_potential.back')}
          </Link>
          <span className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 block">
            {t('sci_potential.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-black">{t('sci_potential.title')}</h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl">{t('sci_potential.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users size={24} />, value: stats?.totalPedagogs || 0, label: t('sci_potential.stat_total'), color: 'bg-blue-500' },
            { icon: <GraduationCap size={24} />, value: stats?.professors || 0, label: t('sci_potential.stat_professors'), color: 'bg-emerald-500' },
            { icon: <BookOpen size={24} />, value: stats?.dotsents || 0, label: t('sci_potential.stat_dotsents'), color: 'bg-violet-500' },
            { icon: <TrendingUp size={24} />, value: (stats?.potential || 0) + '%', label: t('sci_potential.stat_potential'), color: 'bg-amber-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scientific Staff Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-slate-900 mb-2">{t('sci_potential.staff_title')}</h2>
        <p className="text-slate-500 mb-10 max-w-2xl">{t('sci_potential.staff_subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scientificStaff.length > 0 ? scientificStaff.map((teacher) => (
            <div 
              key={teacher.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                <img 
                  src={teacher.photoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><circle cx="50" cy="50" r="50"/><circle cx="50" cy="35" r="20" fill="%2394a3b8"/><path d="M15 80c0-15 15-25 35-25s35 10 35 25" fill="%2394a3b8"/></svg>'} 
                  alt={teacher.fullName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {/* Badge for degree */}
                {teacher.degree && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Award size={12} />
                    {teacher.degree_translated || teacher.degree}
                  </div>
                )}
              </div>
              <div className="p-6 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {teacher.fullName}
                  </h3>
                  <p className="text-blue-600 font-bold text-sm mb-1">
                    {teacher.position_translated || teacher.position}
                  </p>
                </div>
                {(teacher.title || teacher.awards) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-1">
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
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg">{t('sci_potential.no_data')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Teacher Biography Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">{selectedTeacher.fullName}</h3>
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div 
                  className="w-full md:w-1/3 relative group cursor-pointer"
                  onClick={() => setZoomedImage(selectedTeacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz')}
                >
                  <img 
                    src={selectedTeacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz'} 
                    alt={selectedTeacher.fullName} 
                    className="w-full aspect-square object-cover rounded-2xl shadow-sm transition-transform group-hover:scale-[1.02]" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                    <div className="bg-white/90 text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-xl">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.position', 'Lavozimi')}</p>
                    <p className="text-lg font-bold text-blue-600">{selectedTeacher.position_translated || selectedTeacher.position}</p>
                  </div>
                  
                  {selectedTeacher.degree && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.academic_degree', 'Ilmiy darajasi')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.degree_translated || selectedTeacher.degree}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.title && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.academic_title', 'Ilmiy unvoni')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.title_translated || selectedTeacher.title}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.awards && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.awards', 'Mukofotlari')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.awards_translated || selectedTeacher.awards}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {t('sci_potential.biography', 'Biografiyasi')}
                </h4>
                <div className="prose prose-slate max-w-none">
                  {selectedTeacher.biography_translated || selectedTeacher.biography ? (
                    <div dangerouslySetInnerHTML={{ __html: (selectedTeacher.biography_translated || selectedTeacher.biography).replace(/\n/g, '<br/>') }} />
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
