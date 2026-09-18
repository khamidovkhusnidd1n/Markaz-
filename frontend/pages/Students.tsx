import React, { useState } from 'react';
import { CheckCircle, Award, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { PDPlanRecord } from '../types';

const Students: React.FC = () => {
  const { t } = useTranslation();
  const { pdPlans } = useApp();

  // Certificate check state
  const [activeTab, setActiveTab] = useState<'mo' | 'qt'>('mo');
  const [docNumber, setDocNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{status: 'idle' | 'found' | 'not_found', data?: PDPlanRecord}>({status: 'idle'});

  const handleCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    // Normalize input: remove spaces and upper case
    let searchVal = docNumber.trim().toUpperCase().replace(/\s+/g, '');
    let searchPrefix = activeTab === 'mo' ? 'MO' : 'QT';
    
    // Check if user explicitly typed a prefix (e.g. "QT 001261" while in "MO" tab)
    if (searchVal.startsWith('MO')) {
      searchPrefix = 'MO';
      searchVal = searchVal.substring(2);
      if (activeTab !== 'mo') setActiveTab('mo');
    } else if (searchVal.startsWith('QT')) {
      searchPrefix = 'QT';
      searchVal = searchVal.substring(2);
      if (activeTab !== 'qt') setActiveTab('qt');
    }
    
    // Remove leading zeros for flexible matching
    const searchNumStr = searchVal.replace(/^0+/, '');

    const found = pdPlans.find((item) => {
      if (item.recordType !== searchPrefix) return false;
      const itemNumStr = item.number ? item.number.replace(/^0+/, '') : '';
      return itemNumStr === searchNumStr || item.number === searchVal;
    });

    if (found) {
      setSearchResult({ status: 'found', data: found });
    } else {
      setSearchResult({ status: 'not_found' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">{t('students.title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('students.subtitle')}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Certificate Verification Section */}
          <section className="rounded-2xl bg-white p-8 shadow-lg border border-blue-100">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-900">
              <CheckCircle className="text-blue-600" /> {t('students.check_title')}
            </h2>
            
            {/* Tab buttons */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => { setActiveTab('mo'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
                  activeTab === 'mo'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award size={18} />
                {t('students.tab_mo')}
              </button>
              <button
                onClick={() => { setActiveTab('qt'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
                  activeTab === 'qt'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase size={18} />
                {t('students.tab_qt')}
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCertSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    {activeTab === 'mo' ? 'MO' : 'QT'}
                  </span>
                  <input
                    type="text"
                    placeholder={t('students.input_placeholder')}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className={`text-white px-6 py-2 rounded-lg font-bold transition-all ${
                    activeTab === 'mo'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {t('students.search_btn')}
                </button>
              </div>
            </form>

            {/* Results Display */}
            {searchResult.status !== 'idle' && (
              <div className="mt-6 border-t pt-6">
                {searchResult.status === 'found' && searchResult.data ? (
                  <div className={`p-6 rounded-xl ${
                    searchResult.data.recordType === 'QT' ? 'bg-blue-50 border border-blue-100' : 'bg-emerald-50 border border-emerald-100'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        searchResult.data.recordType === 'QT' ? 'bg-blue-500' : 'bg-emerald-500'
                      } text-white`}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <h4 className="text-xl font-bold text-gray-900">{searchResult.data.fullName}</h4>
                          <span className={`px-3 py-1 text-white text-xs font-bold rounded-full ${
                            searchResult.data.recordType === 'QT' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}>
                            {t('students.result_valid')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 font-medium">{t('students.doc_type')}</p>
                            <p className="font-bold text-gray-700">
                              {searchResult.data.recordType === 'QT' ? t('students.qt_diploma') : t('students.mo_certificate')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">{t('students.series_number')}</p>
                            <p className="font-bold text-gray-700">{searchResult.data.series} {searchResult.data.number}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">{t('students.workplace')}</p>
                            <p className="font-bold text-gray-700">{searchResult.data.workplace || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">{t('students.direction')}</p>
                            <p className="font-bold text-gray-700">{searchResult.data.courseType || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">{t('students.duration')}</p>
                            <p className="font-bold text-gray-700">{searchResult.data.duration || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500 text-white flex items-center justify-center">
                      <XCircle size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{t('students.not_found_title')}</h4>
                    <p className="text-gray-500 text-sm mb-3">{t('students.not_found_desc')}</p>
                    <button
                      onClick={() => setSearchResult({status: 'idle'})}
                      className="text-red-600 font-bold text-sm hover:underline"
                    >
                      {t('students.retry')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Students;
