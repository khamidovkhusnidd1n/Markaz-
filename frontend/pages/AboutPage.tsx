import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Mail, Image as ImageIcon, ArrowLeft, Building2, Users, UserCheck, X } from 'lucide-react';

type AboutSection = 'info' | 'structure' | 'leadership' | 'staff';

const VALID_SECTIONS: AboutSection[] = ['info', 'structure', 'leadership', 'staff'];

const AboutPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const { t, i18n } = useTranslation();
  const { personnel, aboutContent } = useApp();
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  // Default to 'info' if no section
  const activeSection: AboutSection = VALID_SECTIONS.includes(section as AboutSection)
    ? (section as AboutSection)
    : 'info';

  // Redirect if invalid section
  if (section && !VALID_SECTIONS.includes(section as AboutSection)) {
    return <Navigate to="/about/info" replace />;
  }

  const leadership = personnel.filter(p => p.category === 'leadership');
  const staff = personnel.filter(p => p.category === 'staff');

  const sectionMeta: Record<AboutSection, { label: string; icon: React.ReactNode; color: string }> = {
    info: { label: t('about.tab_info'), icon: <Building2 size={20} />, color: 'from-blue-900 to-blue-700' },
    structure: { label: t('about.tab_structure'), icon: <Building2 size={20} />, color: 'from-indigo-900 to-indigo-700' },
    leadership: { label: t('about.tab_leadership'), icon: <UserCheck size={20} />, color: 'from-slate-800 to-slate-700' },
    staff: { label: t('about.tab_staff'), icon: <Users size={20} />, color: 'from-blue-800 to-blue-600' },
  };

  const current = sectionMeta[activeSection];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${current.color} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('departments.back')}
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {current.icon}
            </div>
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wider mb-1">{t('about.title')}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{current.label}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 lg:p-12">

          {/* INFO */}
          {activeSection === 'info' && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-black mb-8 text-slate-900 border-l-4 border-blue-600 pl-4">
                {t('about.history_title')}
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-6 text-lg prose prose-lg max-w-none">
                {aboutContent.history ? (
                  <div dangerouslySetInnerHTML={{ __html: aboutContent.history }} />
                ) : (
                  <div className="py-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs italic">{t('about.no_data')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STRUCTURE */}
          {activeSection === 'structure' && (
            <div className="space-y-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-black mb-6 text-slate-900 text-center">{t('about.structure_title')}</h2>
                <p className="text-slate-600 leading-relaxed mb-12 text-center text-lg italic max-w-3xl mx-auto font-medium">
                  {t('about.structure_desc')}
                </p>
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 p-4 lg:p-10 group">
                    <img
                      src="/structure.png"
                      alt={t('about.structure_img_alt')}
                      className="w-full h-auto object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-700"
                    />
                </div>
              </div>
            </div>
          )}

          {/* LEADERSHIP / STAFF */}
          {(activeSection === 'leadership' || activeSection === 'staff') && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
              (activeSection === 'leadership' ? leadership : staff).length === 3 ? 'lg:grid-cols-3 max-w-5xl' : 
              (activeSection === 'leadership' ? leadership : staff).length === 2 ? 'lg:grid-cols-2 max-w-3xl' : 
              (activeSection === 'leadership' ? leadership : staff).length === 1 ? 'lg:grid-cols-1 max-w-sm' : 
              'lg:grid-cols-4 max-w-7xl'
            } gap-6 pt-10 mx-auto`}>
              {(activeSection === 'leadership' ? leadership : staff).length > 0
                ? (activeSection === 'leadership' ? leadership : staff).map(person => (
                  <div 
                    key={person.id} 
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-6 cursor-pointer"
                    onClick={() => setSelectedPerson(person)}
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden shrink-0">
                      <img
                        src={person.photoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><circle cx="50" cy="50" r="50"/><circle cx="50" cy="35" r="20" fill="%2394a3b8"/><path d="M15 80c0-15 15-25 35-25s35 10 35 25" fill="%2394a3b8"/></svg>'}
                        alt={person.fullName}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-white text-center backdrop-blur-sm gap-3">

                        {person.email && (
                          <span className="text-xs font-medium flex items-center justify-center gap-2 w-full bg-white/10 p-2.5 rounded-xl backdrop-blur-md hover:bg-white/20 transition-colors break-all">
                            <Mail size={14} className="shrink-0" /> {person.email}
                          </span>
                        )}
                        
                      </div>
                    </div>
                    {/* Content below image */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col items-center text-center bg-white z-10">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{person.fullName}</h3>
                      <p className="text-blue-600 font-medium text-xs sm:text-sm mb-3">{person.position}</p>
                      {person.duties && <div className="text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3 [&>p]:inline [&>ul]:inline [&>li]:inline" dangerouslySetInnerHTML={{ __html: person.duties }} />}

                    </div>
                  </div>
                ))
                : (
                  <div className="col-span-full py-32 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs italic">{t('about.no_data')}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Person Biography Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">{selectedPerson.fullName}</h3>
              <button 
                onClick={() => setSelectedPerson(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img 
                  src={selectedPerson.photoUrl || 'https://via.placeholder.com/400x400?text=Xodim'} 
                  alt={selectedPerson.fullName} 
                  className="w-full md:w-1/3 aspect-[3/4] object-cover object-top rounded-2xl shadow-sm" 
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('about.position', 'Lavozimi')}</p>
                    <p className="text-lg font-bold text-blue-600">{selectedPerson.position}</p>
                  </div>
                  

                  
                  {selectedPerson.email && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('about.email', 'Elektron pochta')}</p>
                      <p className="text-slate-900 font-medium">{selectedPerson.email}</p>
                    </div>
                  )}
                  {selectedPerson.receptionHours && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('about.reception_hours', 'Ish vaqti')}</p>
                      <p className="text-slate-900 font-medium">{selectedPerson.receptionHours}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Duties and Biography Section */}
              <div className="space-y-6">
                {selectedPerson.duties && (
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                      {t('about.duties', i18n.language === 'en' ? 'Job Duties' : i18n.language === 'ru' ? 'Должностные обязанности' : 'Lavozim vazifasi')}
                    </h4>
                    <div className="prose prose-slate max-w-none">
                      <div className="[&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: selectedPerson.duties }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;
