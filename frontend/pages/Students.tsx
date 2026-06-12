import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Info, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Students: React.FC = () => {
  const { pdPlans, documents, aboutContent } = useApp();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof pdPlans>([]);
  const [hasSearched, setHasSearched] = useState(false);

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
        item.duration.toLowerCase().includes(lowered)
      );
      setSearchResults(results);
      setHasSearched(true);
    }
  }, [location.search, pdPlans]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const lowered = searchTerm.trim().toLowerCase();
    if (!lowered) {
      setSearchResults([]);
      return;
    }
    setSearchResults(
      pdPlans.filter((item) =>
        item.fullName.toLowerCase().includes(lowered) ||
        item.workplace.toLowerCase().includes(lowered) ||
        item.courseType.toLowerCase().includes(lowered) ||
        item.duration.toLowerCase().includes(lowered)
      )
    );
  };

  const regDocs = documents.filter((doc) => doc.category === 'regulatory');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">Tinglovchilar uchun</h1>
          <p className="text-blue-200">Malaka oshirish rejalari, me'yoriy hujjatlar va foydali eslatmalar.</p>
        </div>
      </div>

      <div className="container mx-auto -mt-10 grid grid-cols-1 gap-8 px-4 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-900">
              <Search className="text-amber-500" /> Malaka oshirish rejasidan qidirish
            </h2>
            <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="F.I.SH yoki ish joyini kiriting..."
                className="flex-grow rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="rounded-xl bg-blue-700 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-800">
                Qidirish
              </button>
            </form>

            {hasSearched && (
              <div className="overflow-x-auto">
                {searchResults.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500">
                      <tr>
                        <th className="border-b px-4 py-3">F.I.SH</th>
                        <th className="border-b px-4 py-3">Ish joyi</th>
                        <th className="border-b px-4 py-3">Kurs</th>
                        <th className="border-b px-4 py-3">Muddat</th>
                        <th className="border-b px-4 py-3">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {searchResults.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-blue-50">
                          <td className="px-4 py-4 font-medium text-gray-900">{item.fullName}</td>
                          <td className="px-4 py-4 text-gray-600">{item.workplace}</td>
                          <td className="px-4 py-4 text-gray-600">{item.courseType}</td>
                          <td className="px-4 py-4 text-gray-600">{item.duration || '-'}</td>
                          <td className="px-4 py-4">
                            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                              {item.series} {item.number}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="rounded-xl bg-gray-50 py-10 text-center text-gray-500">
                    Kechirasiz, bunday ma'lumot topilmadi.
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
