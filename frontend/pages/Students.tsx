import React, { useState } from 'react';
import { Download, Info, CheckCircle, Award, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PDPlanRecord } from '../types';

const Students: React.FC = () => {
  const { documents, aboutContent, pdPlans } = useApp();

  const [activeTab, setActiveTab] = useState<'mo' | 'qt'>('mo');
  const [docNumber, setDocNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{status: 'idle' | 'found' | 'not_found', data?: PDPlanRecord}>({status: 'idle'});

  const regDocs = documents.filter((doc) => doc.category === 'regulatory');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    const targetType = activeTab === 'mo' ? 'MO' : 'QT';
    const searchNum = docNumber.trim();
    
    // Filter by selected type (MO or QT)
    const typeRecords = pdPlans.filter(p => 
      (p.recordType || '').toUpperCase() === targetType ||
      (p.series || '').toUpperCase() === targetType
    );
    
    // Try exact match first
    let found = typeRecords.find(p => p.number.trim() === searchNum);
    
    // Try case-insensitive
    if (!found) {
      found = typeRecords.find(p => p.number.toLowerCase().trim() === searchNum.toLowerCase());
    }
    
    // Try ending match
    if (!found) {
      found = typeRecords.find(p => p.number.trim().endsWith(searchNum));
    }
    
    // Try contains
    if (!found) {
      found = typeRecords.find(p => p.number.includes(searchNum));
    }

    if (found) {
      setSearchResult({status: 'found', data: found});
    } else {
      setSearchResult({status: 'not_found'});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">Reestr (Sertifikat tekshirish)</h1>
          <p className="text-blue-200">Tinglovchilar uchun me'yoriy hujjatlar va sertifikatlar reestri.</p>
        </div>
      </div>

      <div className="container mx-auto -mt-10 grid grid-cols-1 gap-8 px-4 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          
          <section className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-900">
              <CheckCircle className="text-blue-600" /> Sertifikat va diplomlarni tekshirish
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
                Sertifikat (MO)
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
                Diplom (QT)
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                    {activeTab === 'mo' ? 'MO' : 'QT'}
                  </span>
                  <input
                    type="text"
                    placeholder="Seriya va raqam (Masalan, 000831)"
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
                  Tekshirish
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
                            Haqiqiy
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 font-medium">Hujjat turi</p>
                            <p className="font-bold text-gray-700">
                              {searchResult.data.recordType === 'QT' ? 'Qayta tayyorlash diplomi' : 'Malaka oshirish sertifikati'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">Seriya va raqam</p>
                            <p className="font-bold text-gray-700">{searchResult.data.series} {searchResult.data.number}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">Ish joyi</p>
                            <p className="font-bold text-gray-700">{searchResult.data.workplace || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">Yo'nalishi</p>
                            <p className="font-bold text-gray-700">{searchResult.data.courseType || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-medium">O'qish muddati</p>
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
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Ma'lumot topilmadi</h4>
                    <p className="text-gray-500 text-sm mb-3">Kiritilgan hujjat reestrda topilmadi. Iltimos, raqamni to'g'ri kiritganingizga ishonch hosil qiling.</p>
                    <button
                      onClick={() => setSearchResult({status: 'idle'})}
                      className="text-red-600 font-bold text-sm hover:underline"
                    >
                      Qayta urinish
                    </button>
                  </div>
                )}
              </div>
            )}

          </section>

          <section className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-blue-900">Me'yoriy hujjatlar</h2>
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
                      <p className="text-xs text-gray-500">{doc.date} da yuklangan</p>
                    </div>
                  </div>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <Download size={20} />
                  </a>
                </div>
              )) : (
                <div className="rounded-xl border-2 border-dashed py-10 text-center text-gray-500">
                  Davlat ta'lim talablari va dasturlar yuklanmoqda.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="sticky top-24 rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-900">
              <Info className="text-amber-600" /> Tinglovchilarga eslatma
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-amber-900">
              {aboutContent.studentNotes || "Tinglovchilar uchun eslatmalar admin panel orqali kiritiladi."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
