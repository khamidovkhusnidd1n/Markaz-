import React from 'react';
import { Download, FileText, Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Journal: React.FC = () => {
  const { journalIssues, journalSettings } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-900 py-8 text-white">
        <div className="container mx-auto flex flex-col items-center gap-10 px-10 md:flex-row md:justify-between">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-5xl font-bold">Badiiy ta'lim va pedagogika</h1>
            <p className="mb-6 text-lg leading-relaxed text-blue-100">
              {journalSettings.aboutJournal || "Ushbu ilmiy jurnal san'at ta'limidagi so'nggi tadqiqotlar va pedagogik metodikalarni yoritib boradi."}
            </p>
            {journalSettings.articleRulesPdfUrl && (
              <a href={journalSettings.articleRulesPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition-all hover:bg-amber-600">
                <FileText size={20} /> Maqola berish tartibi (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <h2 className="border-b pb-4 text-3xl font-bold text-gray-900">Jurnal sonlari</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {journalIssues.length > 0 ? journalIssues.map((issue) => (
              <div key={issue.id} className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-blue-300">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                  <img src={issue.thumbnailUrl || 'https://picsum.photos/seed/doc/100/140'} alt={`Jurnal ${issue.year}`} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">Jurnal {issue.year}</h3>
                    <p className="text-sm text-gray-500">{issue.issueNumber ? `${issue.issueNumber}-son` : `${issue.year}-yil soni`}</p>
                  </div>
                  <a href={issue.pdfUrl} download className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                    <Download size={14} /> PDF yuklab olish
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full rounded-2xl border-2 border-dashed py-12 text-center text-gray-500">
                Hozircha raqamli arxiv mavjud emas.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-blue-900">Bog'lanish</h3>
            <div className="space-y-4 text-sm">
              {journalSettings.phone && <p className="flex items-center gap-3 text-gray-600"><Phone size={18} className="text-blue-600" /> {journalSettings.phone}</p>}
              {journalSettings.editorialAddress && <p className="flex items-center gap-3 text-gray-600"><MapPin size={18} className="text-blue-600" /> {journalSettings.editorialAddress}</p>}
              {journalSettings.email && <p className="flex items-center gap-3 text-gray-600"><Mail size={18} className="text-blue-600" /> {journalSettings.email}</p>}
              {journalSettings.telegramPrimary && <a href={journalSettings.telegramPrimary} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Send size={18} className="text-blue-600" /> Telegram 1</a>}
              {journalSettings.telegramSecondary && <a href={journalSettings.telegramSecondary} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Send size={18} className="text-blue-600" /> Telegram 2</a>}
              {journalSettings.instagram && <a href={journalSettings.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-pink-600"><Instagram size={18} className="text-pink-500" /> Instagram</a>}
              {journalSettings.facebook && <a href={journalSettings.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Facebook size={18} className="text-blue-600" /> Facebook</a>}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <h3 className="mb-4 text-xl font-bold text-amber-800">Mualliflarga</h3>
            <p className="whitespace-pre-wrap text-sm text-amber-900">
              {journalSettings.articleRulesText || "Maqola yuborish bo'yicha ko'rsatmalar kiritilmagan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
