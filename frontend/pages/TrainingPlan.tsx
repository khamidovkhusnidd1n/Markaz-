import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, Info, Search, Eye } from 'lucide-react';
import DocumentViewer from '../components/DocumentViewer';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../services/dateUtils';

const TrainingPlan: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { documents, aboutContent, pdPlans } = useApp();
  const location = useLocation();

  const regDocs = documents.filter((doc) => doc.category === 'regulatory');

  // PD Plans search state
  const [searchTerm, setSearchTerm] = useState('');
  const [pdSearchResults, setPdSearchResults] = useState<typeof pdPlans>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      const lowered = query.toLowerCase();
      const results = pdPlans.filter((item) =>
        item.fullName.toLowerCase().includes(lowered) ||
        item.workplace.toLowerCase().includes(lowered) ||
        item.courseType.toLowerCase().includes(lowered) ||
        (item.duration && item.duration.toLowerCase().includes(lowered))
      );
      setPdSearchResults(results);
      setHasSearched(true);
    }
  }, [location.search, pdPlans]);

  const handlePdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const lowered = searchTerm.trim().toLowerCase();
    if (!lowered) {
      setPdSearchResults([]);
      return;
    }
    setPdSearchResults(
      pdPlans.filter((item) =>
        item.fullName.toLowerCase().includes(lowered) ||
        item.workplace.toLowerCase().includes(lowered) ||
        item.courseType.toLowerCase().includes(lowered) ||
        (item.duration && item.duration.toLowerCase().includes(lowered))
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> {t('training_plan.back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('training_plan.title')}</h1>
          <p className="text-emerald-200 text-lg">{t('training_plan.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* PD Plans Search Section */}
            <section className="rounded-2xl bg-white p-8 shadow-sm border border-emerald-100">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-900">
                <Search className="text-emerald-600" /> {t('training_plan.search_title')}
              </h2>
              <form onSubmit={handlePdSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder={t('training_plan.search_placeholder')}
                  className="flex-grow rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="rounded-xl bg-emerald-700 px-8 py-3 font-bold text-white transition-colors hover:bg-emerald-800">
                  {t('training_plan.search_btn')}
                </button>
              </form>

              {hasSearched && (
                <div className="overflow-x-auto">
                  {pdSearchResults.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 uppercase text-gray-500 rounded-t-xl">
                        <tr>
                          <th className="border-b px-4 py-3">{t('training_plan.col_name')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_workplace')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_course')}</th>
                          <th className="border-b px-4 py-3">{t('training_plan.col_duration')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pdSearchResults.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-emerald-50">
                            <td className="px-4 py-4 font-medium text-gray-900">{item.fullName}</td>
                            <td className="px-4 py-4 text-gray-600">{item.workplace}</td>
                            <td className="px-4 py-4 text-gray-600">{item.courseType}</td>
                            <td className="px-4 py-4 text-gray-600">{item.duration || '-'}</td>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600">
                          <Download size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{doc.title}</h4>
                        <p className="text-xs text-gray-500">{formatDate(doc.date, i18n.language)} {t('students.uploaded_suffix')}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewDoc(doc.fileUrl)} className="text-blue-600 hover:text-blue-800" title="Ko'rish"><Eye size={20} /></button>
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
