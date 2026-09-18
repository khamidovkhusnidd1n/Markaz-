import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { BackendAPI } from '../services/backend';

const VirtualQabulxona: React.FC = () => {
  const { t } = useTranslation();
  const { refreshData } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'murojaat' | 'ariza'>('murojaat');

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash === 'ariza' || hash === 'murojaat') {
      setActiveTab(hash as 'murojaat' | 'ariza');
    }
  }, [location.hash]);
  
  const [appealForm, setAppealForm] = useState({
    full_name: '',
    appeal_type: 'murojaat' as 'murojaat' | 'shikoyat' | 'taklif',
    description: '',
    phone: '',
    email: '',
    telegram_link: '',
  });
  
  const [applicationForm, setApplicationForm] = useState({
    full_name: '',
    application_type: 'professional_development' as 'professional_development' | 'retraining',
    workplace: '',
    direction: '',
    phone: '',
    telegram_link: '',
  });
  
  const [submissionMessage, setSubmissionMessage] = useState('');

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <section className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">{t('virtual_reception.badge')}</span>
          <h1 className="mt-2 text-4xl font-black text-slate-900">{t('virtual_reception.title')}</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t('virtual_reception.subtitle')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 flex flex-col sm:flex-row w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('murojaat')}
              className={`px-6 py-3 rounded-lg font-bold transition-colors w-full sm:w-auto ${activeTab === 'murojaat' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {t('virtual_reception.tab_appeal')}
            </button>
            <button
              onClick={() => setActiveTab('ariza')}
              className={`px-6 py-3 rounded-lg font-bold transition-colors w-full sm:w-auto ${activeTab === 'ariza' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {t('virtual_reception.tab_application')}
            </button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Murojaatlar */}
          {activeTab === 'murojaat' && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6">{t('virtual_reception.appeal_title')}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await BackendAPI.createAppeal(appealForm);
                  await refreshData();
                  setSubmissionMessage(t('virtual_reception.appeal_success'));
                  setAppealForm({ full_name: '', appeal_type: 'murojaat', description: '', phone: '', email: '', telegram_link: '' });
                } catch (error) {
                  setSubmissionMessage(error instanceof Error ? error.message : t('virtual_reception.error'));
                }
              }}
              className="grid gap-5"
            >
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200" value={appealForm.full_name} onChange={(e) => setAppealForm((p) => ({ ...p, full_name: e.target.value }))} placeholder={t('virtual_reception.appeal_name_placeholder')} />
              <select className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.appeal_type} onChange={(e) => setAppealForm((p) => ({ ...p, appeal_type: e.target.value as any }))}>
                <option value="murojaat">{t('virtual_reception.type_appeal')}</option>
                <option value="shikoyat">{t('virtual_reception.type_complaint')}</option>
                <option value="taklif">{t('virtual_reception.type_suggestion')}</option>
              </select>
              <textarea required className="min-h-[120px] rounded-xl border p-4 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none" value={appealForm.description} onChange={(e) => setAppealForm((p) => ({ ...p, description: e.target.value }))} placeholder={t('virtual_reception.appeal_text_placeholder')} />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.phone} onChange={(e) => setAppealForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t('virtual_reception.phone_placeholder')} />
              <input type="email" className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.email} onChange={(e) => setAppealForm((p) => ({ ...p, email: e.target.value }))} placeholder={t('virtual_reception.email_placeholder')} />
              <input className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.telegram_link} onChange={(e) => setAppealForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder={t('virtual_reception.telegram_placeholder')} />
              <button className="rounded-xl bg-slate-900 hover:bg-rose-600 transition-colors px-6 py-4 mt-2 font-bold text-white shadow-lg shadow-rose-600/20">{t('virtual_reception.appeal_submit')}</button>
            </form>
          </div>
          )}
          
          {/* Arizalar */}
          {activeTab === 'ariza' && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6">{t('virtual_reception.application_title')}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await BackendAPI.createApplication(applicationForm);
                  await refreshData();
                  setSubmissionMessage(t('virtual_reception.application_success'));
                  setApplicationForm({ full_name: '', application_type: 'professional_development', workplace: '', direction: '', phone: '', telegram_link: '' });
                } catch (error) {
                  setSubmissionMessage(error instanceof Error ? error.message : t('virtual_reception.error'));
                }
              }}
              className="grid gap-5"
            >
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.full_name} onChange={(e) => setApplicationForm((p) => ({ ...p, full_name: e.target.value }))} placeholder={t('virtual_reception.application_name_placeholder')} />
              <select className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.application_type} onChange={(e) => setApplicationForm((p) => ({ ...p, application_type: e.target.value as any }))}>
                <option value="professional_development">{t('virtual_reception.app_type_mo')}</option>
                <option value="retraining">{t('virtual_reception.app_type_qt')}</option>
              </select>
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.workplace} onChange={(e) => setApplicationForm((p) => ({ ...p, workplace: e.target.value }))} placeholder={t('virtual_reception.workplace_placeholder')} />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.direction} onChange={(e) => setApplicationForm((p) => ({ ...p, direction: e.target.value }))} placeholder={t('virtual_reception.direction_placeholder')} />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.phone} onChange={(e) => setApplicationForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t('virtual_reception.phone_placeholder')} />
              <input className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.telegram_link} onChange={(e) => setApplicationForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder={t('virtual_reception.telegram_placeholder')} />
              <button className="rounded-xl bg-blue-700 hover:bg-blue-800 transition-colors px-6 py-4 mt-2 font-bold text-white shadow-lg shadow-blue-700/30">{t('virtual_reception.application_submit')}</button>
            </form>
          </div>
          )}
        </div>
        
        {submissionMessage && (
          <div className="mt-8 max-w-2xl mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-4 text-center text-lg font-medium text-emerald-800 shadow-sm animate-fade-in">
            {submissionMessage}
          </div>
        )}
      </section>
    </div>
  );
};

export default VirtualQabulxona;
