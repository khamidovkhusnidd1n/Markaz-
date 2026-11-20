import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Mail, Image as ImageIcon, ArrowLeft, Building2, Users, UserCheck, X } from 'lucide-react';
import { sanitizeHtml } from '../utils';

type AboutSection = 'info' | 'structure' | 'leadership' | 'staff';

const VALID_SECTIONS: AboutSection[] = ['info', 'structure', 'leadership', 'staff'];

const getLocalizedPersonnel = (person: any, lang: string) => {
  if (!person) return null;
  const isEn = lang?.startsWith('en');
  const isRu = lang?.startsWith('ru');

  let position = person.position || '';
  if (isEn && person.position_en?.trim()) {
    position = person.position_en;
  } else if (isRu && person.position_ru?.trim()) {
    position = person.position_ru;
  } else if (person.position_translated?.trim()) {
    position = person.position_translated;
  }

  let duties = person.duties || '';
  if (isEn && person.duties_en?.trim()) {
    duties = person.duties_en;
  } else if (isRu && person.duties_ru?.trim()) {
    duties = person.duties_ru;
  } else if (person.duties_translated?.trim()) {
    duties = person.duties_translated;
  }

  let biography = person.biography || '';
  if (isEn && person.biography_en?.trim()) {
    biography = person.biography_en;
  } else if (isRu && person.biography_ru?.trim()) {
    biography = person.biography_ru;
  } else if (person.biography_translated?.trim()) {
    biography = person.biography_translated;
  }

  let receptionHours = person.receptionHours || '';
  if (receptionHours === 'Dushanbadan-Jumagacha' || receptionHours.toLowerCase().includes('dushanba')) {
    if (isEn) receptionHours = 'Monday - Friday';
    else if (isRu) receptionHours = 'Понедельник - Пятница';
    else receptionHours = 'Dushanbadan-Jumagacha';
  }

  return {
    ...person,
    position,
    duties,
    biography,
    receptionHours,
  };
};

const AboutPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const { t, i18n } = useTranslation();
  const { personnel, aboutContent } = useApp();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const selectedPersonRaw = personnel.find(p => String(p.id) === String(selectedPersonId));
  const selectedPerson = selectedPersonRaw ? getLocalizedPersonnel(selectedPersonRaw, i18n.language) : null;

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
    info: { label: t('about.tab_info'), icon: <Building2 size={20} />, color: 'from-slate-900 via-blue-950 to-blue-900' },
    structure: { label: t('about.tab_structure'), icon: <Building2 size={20} />, color: 'from-slate-900 via-blue-950 to-blue-900' },
    leadership: { label: t('about.tab_leadership'), icon: <UserCheck size={20} />, color: 'from-slate-900 via-blue-950 to-blue-900' },
    staff: { label: t('about.tab_staff'), icon: <Users size={20} />, color: 'from-slate-900 via-blue-950 to-blue-900' },
  };

  const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23e2e8f0"><rect width="100" height="100"/><circle cx="50" cy="36" r="18" fill="%2394a3b8"/><path d="M18 84c0-16 14-26 32-26s32 10 32 26" fill="%2394a3b8"/></svg>';

  const current = sectionMeta[activeSection];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${current.color} text-white py-14`}>
        <div className="container mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('departments.back')}
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
              {current.icon}
            </div>
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{t('about.title')}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{current.label}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {VALID_SECTIONS.map((sec) => {
              const meta = sectionMeta[sec];
              const isActive = activeSection === sec;
              return (
                <Link
                  key={sec}
                  to={`/about/${sec}`}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {meta.icon}
                  <span>{meta.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8 lg:p-10">

          {/* INFO */}
          {activeSection === 'info' && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 border-l-4 border-blue-800 pl-4">
                {t('about.history_title')}
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg prose prose-slate max-w-none">
                {aboutContent.history ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutContent.history) }} />
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-semibold text-sm">{t('about.no_data')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STRUCTURE */}
          {activeSection === 'structure' && (
            <div className="space-y-6">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 text-center">{t('about.structure_title')}</h2>
                <p className="text-slate-600 leading-relaxed mb-8 text-center text-base max-w-3xl mx-auto">
                  {t('about.structure_desc')}
                </p>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 p-4 lg:p-8">
                    <img
                      src="/structure.png"
                      alt={t('about.structure_img_alt')}
                      className="w-full h-auto object-contain"
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
            } gap-6 pt-4 mx-auto`}>
              {(activeSection === 'leadership' ? leadership : staff).length > 0
                ? (activeSection === 'leadership' ? leadership : staff).map(rawPerson => {
                  const person = getLocalizedPersonnel(rawPerson, i18n.language)!;
                  return (
                  <div 
                    key={person.id} 
                    className="group relative bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-blue-300 overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer"
                    onClick={() => setSelectedPersonId(String(person.id))}
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={person.photoUrl || DEFAULT_AVATAR}
                        alt={person.fullName}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center backdrop-blur-xs gap-3">
                        {person.email && (
                          <span className="text-xs font-medium flex items-center justify-center gap-2 w-full bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition-colors break-all">
                            <Mail size={14} className="shrink-0" /> {person.email}
                          </span>
                        )}
                        <span className="text-xs font-bold flex items-center justify-center gap-2 w-full bg-blue-700 p-2.5 rounded-xl hover:bg-blue-600 transition-colors uppercase tracking-wider">{t('news_list.read_more')}</span>
                      </div>
                    </div>
                    {/* Content below image */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col items-center text-center bg-white z-10">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug">{person.fullName}</h3>
                      <p className="text-blue-700 font-semibold text-xs sm:text-sm mb-2.5">{person.position}</p>
                      {person.duties && <div className="text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-3 [&>p]:inline [&>ul]:inline [&>li]:inline" dangerouslySetInnerHTML={{ __html: sanitizeHtml(person.duties) }} />}
                    </div>
                  </div>
                )
                })
                : (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-semibold text-sm">{t('about.no_data')}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Person Biography Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPersonId(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedPerson.fullName}</h3>
              <button 
                onClick={() => setSelectedPersonId(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img 
                  src={selectedPerson.photoUrl || DEFAULT_AVATAR} 
                  alt={selectedPerson.fullName} 
                  className="w-full md:w-1/3 aspect-[3/4] object-cover object-top rounded-xl border border-slate-200 shadow-xs bg-slate-100" 
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('about.position', 'Lavozimi')}</p>
                    <p className="text-base sm:text-lg font-bold text-blue-800 mt-0.5">{selectedPerson.position}</p>
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
                      {t('about.duties', i18n.language.startsWith('en') ? 'Job Duties' : i18n.language.startsWith('ru') ? 'Обязанности' : 'Lavozim vazifasi')}
                    </h4>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <div className="[&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPerson.duties) }} />
                    </div>
                  </div>
                )}

                {selectedPerson.biography && (
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                      {t('about.biography', i18n.language.startsWith('en') ? 'Biography' : i18n.language.startsWith('ru') ? 'Биография' : 'Biografiyasi')}
                    </h4>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <div className="[&>p]:mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPerson.biography) }} />
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

