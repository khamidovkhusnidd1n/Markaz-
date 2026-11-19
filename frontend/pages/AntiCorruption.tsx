import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  Phone, 
  Scale, 
  Eye, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml } from '../utils';
import DocumentViewer from '../components/DocumentViewer';

export const AntiCorruption: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { antiCorruption } = useApp();
  const lang = (i18n.language || 'uz').substring(0, 2);

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'contact'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDocUrl, setActiveDocUrl] = useState<string | null>(null);

  // Helper to get localized field
  const getLoc = (obj: any, field: string): string => {
    if (!obj) return '';
    if (lang === 'ru' && obj[`${field}_ru`]) return obj[`${field}_ru`];
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    return obj[field] || '';
  };

  const content = antiCorruption?.content;
  const rawDocuments = antiCorruption?.documents || [];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return rawDocuments.filter(doc => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (getLoc(doc, 'title') || doc.title || '').toLowerCase();
        const desc = (getLoc(doc, 'description') || doc.description || '').toLowerCase();
        const num = (doc.document_number || '').toLowerCase();
        return title.includes(query) || desc.includes(query) || num.includes(query);
      }
      return true;
    });
  }, [rawDocuments, selectedCategory, searchQuery, lang]);

  const categories = [
    { id: 'all', label: lang === 'ru' ? 'Все документы' : lang === 'en' ? 'All Documents' : 'Barcha hujjatlar' },
    { id: 'law', label: lang === 'ru' ? 'Законодательство' : lang === 'en' ? 'Laws & Decrees' : 'Qonun hujjatlari' },
    { id: 'internal', label: lang === 'ru' ? 'Внутренние акты' : lang === 'en' ? 'Internal Regulations' : 'Ichki nizomlar' },
    { id: 'report', label: lang === 'ru' ? 'Отчёты' : lang === 'en' ? 'Reports' : 'Hisobotlar' },
    { id: 'memo', label: lang === 'ru' ? 'Памятки' : lang === 'en' ? 'Guidelines & Memos' : 'Eslatmalar' },
  ];

  const pageTitle = getLoc(content, 'title') || (lang === 'ru' ? 'Противодействие коррупции' : lang === 'en' ? 'Anti-Corruption Compliance' : 'Korrupsiyaga qarshi kurash');
  const hotline = content?.hotline_phone || '+998 77 363 38 36';
  const agencyHotline = content?.agency_hotline || '1253';
  const email = content?.email || 'uzbahuzuridagimarkaz@gmail.com';
  const telegramBot = content?.telegram_bot || 'https://t.me/uzbamalakamakebot';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-semibold mb-6 border border-blue-400/30 backdrop-blur-sm">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>{lang === 'ru' ? 'Честность и прозрачность' : lang === 'en' ? 'Integrity and Transparency' : 'Halollik va Shaffoflik'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {pageTitle}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
              {lang === 'ru'
                ? 'Система мер по предупреждению и противодействию коррупции в Центре переподготовки и повышения квалификации при Академии художеств Узбекистана.'
                : lang === 'en'
                ? 'System of comprehensive measures for the prevention and combat of corruption at the Center under the Academy of Arts of Uzbekistan.'
                : 'O‘zbekiston Badiiy akademiyasi huzuridagi Markazda korrupsiyaviy holatlarning har qanday ko‘rinishiga nisbatan murosasiz muhitni ta’minlash tizimi.'}
            </p>

            {/* Quick Hotline Pill */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <PhoneCall size={18} />
                <span>{lang === 'ru' ? 'Горячая линия' : lang === 'en' ? 'Hotline' : 'Ishonch telefoni'}: {hotline}</span>
              </a>

              <Link
                to="/virtual-qabulxona/murojaat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all"
              >
                <Send size={18} className="text-blue-400" />
                <span>{lang === 'ru' ? 'Сообщить о факте коррупции' : lang === 'en' ? 'Report a violation' : 'Korrupsiya haqida xabar berish'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center sm:justify-start gap-2 overflow-x-auto py-3 no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale size={16} />
              <span>{lang === 'ru' ? 'Политика и принципы' : lang === 'en' ? 'Policy & Goals' : 'Siyosat va tamoyillar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'documents'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText size={16} />
              <span>{lang === 'ru' ? 'Нормативные документы' : lang === 'en' ? 'Regulations & Laws' : 'Me’yoriy hujjatlar'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'documents' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {rawDocuments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PhoneCall size={16} />
              <span>{lang === 'ru' ? 'Каналы связи и доверия' : lang === 'en' ? 'Reporting Channels' : 'Aloqa va ishonch kanallari'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        {/* TAB 1: OVERVIEW & POLICY */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Zero Tolerance Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200/70 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
                <AlertTriangle size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {lang === 'ru' ? 'Принцип нулевой терпимости (Zero Tolerance)' : lang === 'en' ? 'Zero Tolerance Principle' : '«Nol toqat» (Zero Tolerance) tamoyili'}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {lang === 'ru'
                    ? 'Центр категорически не приемлет любые формы коррупции, взяточничества, конфликта интересов и вымогательства при приёме, обучении, аттестации слушателей и выдаче сертификатов.'
                    : lang === 'en'
                    ? 'The Center strictly rejects all forms of corruption, bribery, conflicts of interest, and extortion during admission, training, testing, and certificate issuance.'
                    : 'Markaz qayta tayyorlash va malaka oshirish kurslariga qabul, dars jarayonlari, test sinovlari hamda sertifikat berishda korrupsiya, tamagirlik, tanish-bilishchilik va manfaatlar to‘qnashuvining har qanday shaklini qat’iyan rad etadi.'}
                </p>
              </div>
            </div>

            {/* Intro Content */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
                <ShieldAlert className="text-blue-700" size={24} />
                <span>{lang === 'ru' ? 'Антикоррупционная политика Центра' : lang === 'en' ? 'Center Anti-Corruption Policy' : 'Markazning korrupsiyaga qarshi siyosati'}</span>
              </h2>

              <div 
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(getLoc(content, 'intro_text') || (content?.intro_text || '')) 
                }}
              />

              {/* Policy Goals */}
              {((content && getLoc(content, 'policy_goals')) || content?.policy_goals) && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-blue-900">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>{lang === 'ru' ? 'Основные цели и задачи' : lang === 'en' ? 'Core Objectives and Tasks' : 'Asosiy maqsad va vazifalar'}</span>
                  </h3>
                  <div className="space-y-3">
                    {(getLoc(content, 'policy_goals') || content?.policy_goals || '').split(/\r?\n/).filter(line => line.trim()).map((goal, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{goal.replace(/^•\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Officer Card */}
            {content?.officer_name && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <UserCheck className="text-indigo-600" size={22} />
                  <span>{lang === 'ru' ? 'Ответственное лицо по комплаенс-контролю' : lang === 'en' ? 'Compliance Control Officer' : 'Komplayens-nazorat bo‘yicha mas’ul xodim'}</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {content.officer_photo_url ? (
                    <img
                      src={content.officer_photo_url}
                      alt={getLoc(content, 'officer_name')}
                      className="w-32 h-36 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <UserCheck size={44} />
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {getLoc(content, 'officer_name') || content.officer_name}
                    </h4>
                    <p className="text-sm font-medium text-slate-600">
                      {getLoc(content, 'officer_position') || content.officer_position}
                    </p>

                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Phone size={16} className="text-blue-600 shrink-0" />
                        <span>{content.officer_phone || hotline}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Clock size={16} className="text-blue-600 shrink-0" />
                        <span>{content.reception_hours || 'Dushanba - Juma: 09:00 - 17:00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ru' ? 'Поиск документа...' : lang === 'en' ? 'Search document...' : 'Hujjatni qidirish...'}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Document Cards List */}
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">
                  {lang === 'ru' ? 'Документы не найдены' : lang === 'en' ? 'No documents found' : 'Hujjatlar topilmadi'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ru' ? 'Попробуйте изменить параметры поиска' : lang === 'en' ? 'Try adjusting your search criteria' : 'Qidiruv parametrlarini o‘zgartirib ko‘ring'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map(doc => {
                  const title = getLoc(doc, 'title') || doc.title;
                  const desc = getLoc(doc, 'description') || doc.description;
                  const fileUrl = doc.file_url || doc.file;
                  const hasExternal = Boolean(doc.external_url);

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            doc.category === 'law'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                              : doc.category === 'internal'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          }`}>
                            {doc.document_number || (doc.category === 'law' ? 'Qonun' : 'Nizom')}
                          </span>

                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            {doc.date || '2025'}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h4>

                        {desc && (
                          <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {fileUrl ? (
                          <button
                            type="button"
                            onClick={() => setActiveDocUrl(fileUrl)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                          >
                            <Eye size={15} />
                            <span>{lang === 'ru' ? 'Просмотр (PDF)' : lang === 'en' ? 'Preview (PDF)' : 'Ko‘rish (PDF)'}</span>
                          </button>
                        ) : hasExternal ? (
                          <a
                            href={doc.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                          >
                            <ExternalLink size={15} />
                            <span>Lex.uz da ko‘rish</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Ichki hujjat</span>
                        )}

                        {fileUrl && (
                          <a
                            href={fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <Download size={14} />
                            <span>Yuklab olish</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT & REPORTING */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Reporting Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotline 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                    <PhoneCall size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Горячая линия Центра' : lang === 'en' ? 'Center Hotline' : 'Markaz Ishonch telefoni'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Прямой телефон доверия' : lang === 'en' ? 'Direct reporting line' : 'To‘g‘ridan-to‘g‘ri ishonch raqami'}
                  </p>
                </div>
                <a
                  href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-black text-blue-900 hover:text-blue-700 transition-colors py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50"
                >
                  {hotline}
                </a>
              </div>

              {/* Agency Hotline 1253 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Call-центр Агентства' : lang === 'en' ? 'Agency Call Center' : 'Korrupsiyaga qarshi agentlik'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Республиканский колл-центр' : lang === 'en' ? 'Republican national call center' : 'Respublika qisqa raqami'}
                  </p>
                </div>
                <a
                  href={`tel:${agencyHotline}`}
                  className="text-2xl font-black text-amber-600 hover:text-amber-700 transition-colors py-2 px-3 rounded-xl bg-amber-50"
                >
                  {agencyHotline}
                </a>
              </div>

              {/* Online Form Button */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Онлайн обращение' : lang === 'en' ? 'Online Reporting' : 'Onlayn murojaat'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Через виртуальную приёмную' : lang === 'en' ? 'Via Virtual Reception' : 'Virtual qabulxona orqali ariza'}
                  </p>
                </div>
                <Link
                  to="/virtual-qabulxona/murojaat"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all"
                >
                  <span>Murojaat yuborish</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Additional Contact Channels Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold">
                  {lang === 'ru' ? 'Конфиденциальность гарантируется' : lang === 'en' ? 'Confidentiality Guaranteed' : 'Murojaatchi shaxsi sir saqlanadi'}
                </h3>
                <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                  {lang === 'ru'
                    ? 'В соответствии с законодательством Республики Узбекистан, лицам, сообщившим о фактах коррупции, гарантируется правовая защита и государственная поддержка.'
                    : lang === 'en'
                    ? 'In accordance with national legislation, individuals reporting corruption violations are guaranteed legal protection and confidentiality.'
                    : 'O‘zbekiston Respublikasining «Korrupsiyaga qarshi kurashish to‘g‘risida»gi Qonuniga muvofiq, korrupsiyaviy huquqbuzarliklar haqida xabar bergan shaxslarning xavfsizligi va huquqiy himoyasi qonun bilan kafolatlanadi.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                {telegramBot && (
                  <a
                    href={telegramBot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <Send size={16} />
                    <span>Telegram Bot</span>
                  </a>
                )}

                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  <Mail size={16} />
                  <span>{email}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDF Document Viewer Modal */}
      {activeDocUrl && (
        <DocumentViewer
          url={activeDocUrl}
          onClose={() => setActiveDocUrl(null)}
        />
      )}
    </div>
  );
};

export default AntiCorruption;
