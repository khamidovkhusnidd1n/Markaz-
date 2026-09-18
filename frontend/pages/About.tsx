
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Calendar, Mail, Image as ImageIcon } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { personnel, aboutContent } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'info' | 'structure' | 'leadership' | 'staff'>('info');

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash && ['info', 'structure', 'leadership', 'staff'].includes(hash)) {
      setActiveTab(hash as any);
    }
  }, [location.hash]);


  const leadership = personnel.filter(p => p.category === 'leadership');
  const staff = personnel.filter(p => p.category === 'staff');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center lg:text-left">{t('about.title')}</h1>
          <p className="text-blue-200 max-w-2xl text-center lg:text-left">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-2 mb-10 overflow-x-auto justify-center lg:justify-start">
          {[
            { id: 'info', label: t('about.tab_info') },
            { id: 'structure', label: t('about.tab_structure') },
            { id: 'leadership', label: t('about.tab_leadership') },
            { id: 'staff', label: t('about.tab_staff') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 lg:p-16 shadow-xl border border-gray-100 min-h-[500px]">
          {activeTab === 'info' && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-black mb-8 text-slate-900 border-l-4 border-blue-600 pl-4">{t('about.history_title')}</h2>
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

          {activeTab === 'structure' && (
            <div className="space-y-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-black mb-6 text-slate-900 text-center">{t('about.structure_title')}</h2>
                <p className="text-slate-600 leading-relaxed mb-12 text-center text-lg italic max-w-3xl mx-auto">
                  {aboutContent.structure || t('about.structure_desc_fallback')}
                </p>
                
                <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 p-4 lg:p-10 group">
                  {aboutContent.structureImage ? (
                    <img 
                      src={aboutContent.structureImage} 
                      alt={t('about.structure_img_alt')}
                      className="w-full h-auto object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-700" 
                    />
                  ) : (
                    <div className="p-32 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-4 border-dashed border-gray-100 rounded-[2.5rem]">
                      <ImageIcon size={80} className="mb-6 opacity-20" />
                      <p className="font-black uppercase tracking-[0.2em] text-sm">{t('about.structure_no_image')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'leadership' || activeTab === 'staff') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 pt-10 max-w-6xl mx-auto justify-center">
              {(activeTab === 'leadership' ? leadership : staff).length > 0 ? (activeTab === 'leadership' ? leadership : staff).map(person => (
                <div key={person.id} className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mb-8 shadow-2xl border-4 sm:border-8 border-white ring-1 ring-slate-100 shrink-0">
                    <img 
                      src={person.photoUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><circle cx="50" cy="50" r="50"/><circle cx="50" cy="35" r="20" fill="%2394a3b8"/><path d="M15 80c0-15 15-25 35-25s35 10 35 25" fill="%2394a3b8"/></svg>'} 
                      alt={person.fullName} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                    />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-3 px-2 leading-tight">
                    {person.fullName}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed px-6 max-w-xs mx-auto">
                    {person.position}
                  </p>
                  {person.duties && (
                    <p className="mt-4 text-sm leading-6 text-slate-500 px-6">
                      {person.duties}
                    </p>
                  )}
                  {activeTab === 'leadership' && person.biography && (
                    <p className="mt-3 text-sm leading-6 text-slate-500 px-6 line-clamp-3 text-ellipsis overflow-hidden">
                      {person.biography}
                    </p>
                  )}
                  
                  <div className="mt-6 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
                      <Phone size={12} /> {person.phone || t('about.phone_unknown')}
                    </span>
                    {person.email && (
                      <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
                        <Mail size={12} /> {person.email}
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
                      <Clock size={12} /> {person.receptionHours || t('about.hours_unknown')}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs italic">{t('about.no_data')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
