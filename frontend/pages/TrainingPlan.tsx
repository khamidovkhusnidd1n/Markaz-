import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, Info, Search, Eye, FileText } from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';
import { backend } from '../services/backend';
import { TrainingPlanItem } from '../types';

const UZ_REGIONS = [
  { value: "Barchasi", key: "all" },
  { value: "Toshkent shahri", key: "tashkent_city" },
  { value: "Toshkent viloyati", key: "tashkent_region" },
  { value: "Sirdaryo viloyati", key: "sirdaryo" },
  { value: "Jizzax viloyati", key: "jizzakh" },
  { value: "Samarqand viloyati", key: "samarkand" },
  { value: "Qashqadaryo viloyati", key: "kashkadarya" },
  { value: "Surxondaryo viloyati", key: "surkhandarya" },
  { value: "Buxoro viloyati", key: "bukhara" },
  { value: "Navoiy viloyati", key: "navoi" },
  { value: "Xorazm viloyati", key: "khorezm" },
  { value: "Andijon viloyati", key: "andijan" },
  { value: "Namangan viloyati", key: "namangan" },
  { value: "Farg'ona viloyati", key: "fergana" },
  { value: "Qoraqalpog'iston Respublikasi", key: "karakalpakstan" }
];

const TrainingPlan: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { documents, aboutContent, trainingPlanRecords } = useApp();
  const location = useLocation();

  const regDocs = documents.filter((doc) => doc.category === 'regulatory');

  // PD Plans search state (UZCERT & OWASP Top 10 PII Protection)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRegion, setSearchRegion] = useState('Barchasi');
  const [pdSearchResults, setPdSearchResults] = useState<TrainingPlanItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const executeSearch = async (term: string, region: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 3) {
      setSearchError(t('training_plan.min_chars', "Qidiruv uchun kamida 3 ta belgi kiriting"));
      setPdSearchResults([]);
      setHasSearched(true);
      return;
    }
    setSearchError(null);
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await backend.searchTrainingPlan(trimmed, region);
      setPdSearchResults(results);
    } catch (err: any) {
      console.error(err);
      setSearchError(err?.message || t('common.error', "Xatolik yuz berdi"));
      setPdSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query && query.trim().length >= 3) {
      setSearchTerm(query);
      executeSearch(query, searchRegion);
    }
  }, [location.search]);

  const handlePdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm, searchRegion);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> {t('training_plan.back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{t('training_plan.title')}</h1>
          <p className="text-slate-300 text-base md:text-lg">{t('training_plan.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* PD Plans Search Section */}
            <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200">
              <h2 className="mb-6 flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-slate-900">
                <Search className="text-blue-700" size={22} /> {t('training_plan.search_title')}
              </h2>
              <form onSubmit={handlePdSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder={t('training_plan.search_placeholder')}
                  className="flex-grow rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {UZ_REGIONS.map(region => (
                    <option key={region.value} value={region.value}>
                      {t(`training_plan.regions.${region.key}`, region.value)}
                    </option>
                  ))}
                </select>
                <button type="submit" disabled={isLoading} className="rounded-xl bg-blue-800 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900 whitespace-nowrap disabled:opacity-50">
                  {isLoading ? t('common.loading', 'Yuklanmoqda...') : t('training_plan.search_btn')}
                </button>
              </form>
              {searchError && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  {searchError}
                </div>
              )}

              {hasSearched && (
                <div className="overflow-x-auto">
                  {pdSearchResults.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 uppercase text-gray-500 rounded-t-xl">
                        <tr>
                          <th className="border-b px-4 py-3">{t('training_plan.col_name')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_region')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_workplace')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_course')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_duration')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pdSearchResults.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-emerald-50">
                            <td className="px-4 py-4 font-medium text-gray-900">{item.fullName}</td>
                            <td className="px-4 py-4 text-gray-600">{item.region || '-'}</td>
                            <td className="px-4 py-4 text-gray-600">{item.workplace}</td>
                            <td className="px-4 py-4 text-gray-600">{item.courseName}</td>
                            <td className="px-4 py-4 text-gray-600">
                              {item.lastTrainingDate.replace(' 00:00:00', '') || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="rounded-xl bg-gray-50 py-10 text-center text-gray-500">
                      {t('training_plan.no_results')}
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="rounded-2xl border bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-blue-900">{t('students.regulatory_title')}</h2>
              <div className="space-y-4">
                {regDocs.length > 0 ? regDocs.map((doc) => (
                  <div key={doc.id} className="group flex items-center justify-between rounded-xl border bg-gray-50 p-4 transition-all hover:border-blue-300">
                    <div className="flex items-center gap-4">
                      {doc.coverImageUrl ? (
                        <img src={doc.coverImageUrl} alt={doc.title} className="h-16 w-12 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
                          <FileText size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{doc.title}</h4>
                        <p className="text-xs text-gray-500">{formatDate(doc.date, i18n.language)} {t('students.uploaded_suffix')}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewDoc(doc.fileUrl)} className="text-blue-600 hover:text-blue-800" title={t('common.view')}><Eye size={20} /></button>
                  </div>
                )) : (
                  <div className="rounded-xl border-2 border-dashed py-10 text-center text-gray-500">
                    {t('students.no_regulatory')}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="sticky top-24 rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-900">
                <Info className="text-amber-600" /> {t('students.notes_title')}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-amber-900">
                {aboutContent.studentNotes || t('students.notes_fallback')}
              </p>
            </div>
          </div>
        </div>
      </div>
      {viewDoc && <DocumentViewer url={viewDoc} onClose={() => setViewDoc(null)} />}
    </div>
  );
};

export default TrainingPlan;
