import React from 'react';
import { Download, Info, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Students: React.FC = () => {
  const { documents, aboutContent } = useApp();

  const regDocs = documents.filter((doc) => doc.category === 'regulatory');

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
              <CheckCircle className="text-blue-600" /> Sertifikat tekshirish (Tez kunda)
            </h2>
            <div className="rounded-xl bg-blue-50 py-12 text-center border border-blue-100">
              <p className="text-blue-800 mb-4 max-w-md mx-auto">Sertifikatning seriyasi va raqamini kiritish orqali uning haqiqiyligini tekshirish tizimi tez orada ishga tushadi.</p>
              <div className="flex justify-center gap-3 max-w-sm mx-auto opacity-50 pointer-events-none">
                <input type="text" placeholder="Seriya va raqam (Masalan, MO 123456)" className="flex-grow rounded-lg border px-4 py-2" />
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">Tekshirish</button>
              </div>
            </div>
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
