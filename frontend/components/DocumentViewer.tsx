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
  const isLexUz = url.includes('lex.uz');
  const isWebPage = isLexUz || (!cleanPath.match(/\.(pdf|docx?|xlsx?|pptx?)$/) && (url.startsWith('http://') || url.startsWith('https://')));

  // PDF bo'lsa brauzerning o'zida to'g'ridan-to'g'ri ochiladi
  // Boshqa formatlar uchun Google Docs fallback
  const viewerUrl = isPdf
    ? url
    : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  const downloadText = t('common.download_file');
  const openInTab = t('common.open_new_tab');

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
              title={t('common.close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Browser native PDF / Document viewer / External portal safe view */}
        {isWebPage ? (
          <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 shadow-xs">
              <ExternalLink size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {isLexUz ? t('document_viewer.lex_title') : t('document_viewer.external_title')}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
              {isLexUz ? t('document_viewer.lex_desc') : t('document_viewer.external_desc')}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>{isLexUz ? t('document_viewer.lex_btn') : openInTab}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        ) : (
          <div className="flex-1 bg-slate-100 w-full h-full relative">
            <iframe
              src={viewerUrl}
              className="absolute inset-0 w-full h-full border-0"
              title="Document Viewer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
