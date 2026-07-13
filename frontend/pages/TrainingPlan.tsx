import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TrainingPlan: React.FC = () => {
  const { pdPlans } = useApp();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Malaka oshirish rejasi</h1>
          <p className="text-emerald-200 text-lg">Yillik malaka oshirish kurslari jadvali.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="rounded-2xl bg-white p-8 shadow-lg border border-emerald-100">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-900">
              <Search className="text-emerald-600" /> Malaka oshirish rejasidan qidirish
            </h2>
            <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="F.I.SH yoki ish joyini kiriting..."
                className="flex-grow rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="rounded-xl bg-emerald-700 px-8 py-3 font-bold text-white transition-colors hover:bg-emerald-800">
                Qidirish
              </button>
            </form>

            {hasSearched && (
              <div className="overflow-x-auto">
                {searchResults.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500 rounded-t-xl">
                      <tr>
                        <th className="border-b px-4 py-3">F.I.SH</th>
                        <th className="border-b px-4 py-3">Ish joyi</th>
                        <th className="border-b px-4 py-3">Kurs</th>
                        <th className="border-b px-4 py-3">Muddat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {searchResults.map((item) => (
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
                    Kechirasiz, bunday ma'lumot topilmadi.
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

export default TrainingPlan;
