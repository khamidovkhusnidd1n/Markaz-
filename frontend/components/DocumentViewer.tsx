import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  url: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<Props> = ({ url, onClose }) => {
  const { t, i18n } = useTranslation();
  if (!url) return null;

  const cleanPath = url.split('?')[0].toLowerCase();
  const isPdf = cleanPath.endsWith('.pdf');

  // PDF bo'lsa brauzerning o'zida to'g'ridan-to'g'ri ochiladi
  // Boshqa formatlar uchun Google Docs fallback
  const viewerUrl = isPdf
    ? url
    : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  const lang = (i18n.language || 'uz').substring(0, 2);
  const downloadText =
    lang === 'ru' ? 'Скачать файл' : lang === 'en' ? 'Download File' : 'Faylni yuklab olish';
  const openInTab =
    lang === 'ru' ? 'Открыть в новой вкладке' : lang === 'en' ? 'Open in new tab' : 'Yangi oynada ochish';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 ml-2">
            <FileText size={18} className="text-blue-600 shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">
              {t('common.view_document')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              title={downloadText}
            >
              <Download size={14} />
              <span className="hidden sm:inline">{downloadText}</span>
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              title={openInTab}
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">{openInTab}</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-slate-600"
              title={lang === 'ru' ? 'Закрыть' : lang === 'en' ? 'Close' : 'Yopish'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Browser native PDF / Document viewer */}
        <div className="flex-1 bg-slate-100 w-full h-full relative">
          <iframe
            src={viewerUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="Document Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
