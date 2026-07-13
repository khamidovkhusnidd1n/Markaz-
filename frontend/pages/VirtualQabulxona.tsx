import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BackendAPI } from '../services/backend';

const VirtualQabulxona: React.FC = () => {
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
          <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Qabul</span>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Virtual Qabulxona va Arizalar</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Markaz rahbariyatiga to'g'ridan-to'g'ri murojaat yo'llashingiz yoki o'quv kurslariga yozilish uchun onlayn ariza qoldirishingiz mumkin.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('murojaat')}
              className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'murojaat' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Murojaat yo'llash
            </button>
            <button
              onClick={() => setActiveTab('ariza')}
              className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'ariza' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Kursga ariza topshirish
            </button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Murojaatlar */}
          {activeTab === 'murojaat' && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6">Murojaat yo'llash</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await BackendAPI.createAppeal(appealForm);
                  await refreshData();
                  setSubmissionMessage("Murojaatingiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.");
                  setAppealForm({ full_name: '', appeal_type: 'murojaat', description: '', phone: '', email: '', telegram_link: '' });
                } catch (error) {
                  setSubmissionMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
                }
              }}
              className="grid gap-5"
            >
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200" value={appealForm.full_name} onChange={(e) => setAppealForm((p) => ({ ...p, full_name: e.target.value }))} placeholder="Murojaatchi F.I.SH" />
              <select className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.appeal_type} onChange={(e) => setAppealForm((p) => ({ ...p, appeal_type: e.target.value as any }))}>
                <option value="murojaat">Murojaat</option>
                <option value="shikoyat">Shikoyat</option>
                <option value="taklif">Taklif</option>
              </select>
              <textarea required className="min-h-[120px] rounded-xl border p-4 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none" value={appealForm.description} onChange={(e) => setAppealForm((p) => ({ ...p, description: e.target.value }))} placeholder="Murojaat matni" />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.phone} onChange={(e) => setAppealForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon raqami (+998...)" />
              <input type="email" className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.email} onChange={(e) => setAppealForm((p) => ({ ...p, email: e.target.value }))} placeholder="Elektron pochta (ixtiyoriy)" />
              <input className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-rose-500" value={appealForm.telegram_link} onChange={(e) => setAppealForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder="Telegram manzili (ixtiyoriy)" />
              <button className="rounded-xl bg-slate-900 hover:bg-rose-600 transition-colors px-6 py-4 mt-2 font-bold text-white shadow-lg shadow-rose-600/20">Murojaatni yuborish</button>
            </form>
          </div>
          )}
          
          {/* Arizalar */}
          {activeTab === 'ariza' && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6">Kursga ariza topshirish</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await BackendAPI.createApplication(applicationForm);
                  await refreshData();
                  setSubmissionMessage("Arizangiz muvaffaqiyatli qabul qilindi.");
                  setApplicationForm({ full_name: '', application_type: 'professional_development', workplace: '', direction: '', phone: '', telegram_link: '' });
                } catch (error) {
                  setSubmissionMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
                }
              }}
              className="grid gap-5"
            >
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.full_name} onChange={(e) => setApplicationForm((p) => ({ ...p, full_name: e.target.value }))} placeholder="Ariza beruvchi F.I.SH" />
              <select className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.application_type} onChange={(e) => setApplicationForm((p) => ({ ...p, application_type: e.target.value as any }))}>
                <option value="professional_development">Malaka oshirish kursi</option>
                <option value="retraining">Qayta tayyorlash kursi</option>
              </select>
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.workplace} onChange={(e) => setApplicationForm((p) => ({ ...p, workplace: e.target.value }))} placeholder="Asosiy ish joyi (yo'q bo'lsa 'yo'q' deb yozing)" />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.direction} onChange={(e) => setApplicationForm((p) => ({ ...p, direction: e.target.value }))} placeholder="Tanlangan yo'nalish" />
              <input required className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.phone} onChange={(e) => setApplicationForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon raqami" />
              <input className="rounded-xl border px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-500" value={applicationForm.telegram_link} onChange={(e) => setApplicationForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder="Telegram link (ixtiyoriy)" />
              <button className="rounded-xl bg-blue-700 hover:bg-blue-800 transition-colors px-6 py-4 mt-2 font-bold text-white shadow-lg shadow-blue-700/30">Arizani yuborish</button>
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
