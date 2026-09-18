import React from 'react';
import { Download, FileText, Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const Journal: React.FC = () => {
  const { t } = useTranslation();
  const { journalIssues, journalSettings } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-900 py-8 text-white">
        <div className="container mx-auto px-4 sm:px-10">
          <div className="w-full">
            <h1 className="mb-6 text-3xl md:text-5xl font-bold">{t('journal.title')}</h1>
            <div 
              className="text-base md:text-lg leading-relaxed text-blue-100 text-justify space-y-4 [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: journalSettings.aboutJournal || t('journal.about_fallback') }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <h2 className="border-b pb-4 text-3xl font-bold text-gray-900">{t('journal.issues_title')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {journalIssues.length > 0 ? journalIssues.map((issue) => (
              <div key={issue.id} className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-blue-300">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                  <img src={issue.thumbnailUrl || 'https://picsum.photos/seed/doc/100/140'} alt={`${t('journal.issue_alt')} ${issue.year}`} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{t('journal.issue_label')} {issue.year}</h3>
                    <p className="text-sm text-gray-500">{issue.issueNumber || issue.year}</p>
                  </div>
                  <a href={issue.pdfUrl} download className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                    <Download size={14} /> {t('journal.download_pdf')}
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full rounded-2xl border-2 border-dashed py-12 text-center text-gray-500">
                {t('journal.no_issues')}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-blue-900">{t('journal.contact_title')}</h3>
            <div className="space-y-4 text-sm">
              {journalSettings.phone && <p className="flex items-center gap-3 text-gray-600"><Phone size={18} className="text-blue-600" /> {journalSettings.phone}</p>}
              {journalSettings.editorialAddress && <p className="flex items-center gap-3 text-gray-600"><MapPin size={18} className="text-blue-600" /> {journalSettings.editorialAddress}</p>}
              {journalSettings.email && <p className="flex items-center gap-3 text-gray-600"><Mail size={18} className="text-blue-600" /> {journalSettings.email}</p>}
              {journalSettings.telegramPrimary && <a href={journalSettings.telegramPrimary} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Send size={18} className="text-blue-600" /> {t('journal.telegram_1')}</a>}
              {journalSettings.telegramSecondary && <a href={journalSettings.telegramSecondary} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Send size={18} className="text-blue-600" /> {t('journal.telegram_2')}</a>}
              {journalSettings.instagram && <a href={journalSettings.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-pink-600"><Instagram size={18} className="text-pink-500" /> Instagram</a>}
              {journalSettings.facebook && <a href={journalSettings.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-700"><Facebook size={18} className="text-blue-600" /> Facebook</a>}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <h3 className="mb-4 text-xl font-bold text-amber-800">{t('journal.for_authors_title')}</h3>
              <div 
                className="text-sm text-amber-900 mb-4 space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: journalSettings.articleRulesText || t('journal.for_authors_fallback') }}
              />
            {journalSettings.articleRulesPdfUrl && (
              <a 
                href={journalSettings.articleRulesPdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs md:text-sm font-semibold text-white transition-colors hover:bg-amber-700 shadow-sm"
              >
                <FileText size={16} /> {t('journal.article_rules_pdf')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
