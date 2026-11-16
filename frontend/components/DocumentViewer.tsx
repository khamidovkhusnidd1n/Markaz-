import React from 'react';
import { X, ExternalLink, Download, AlertCircle, FileText } from 'lucide-react';
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
  const isOffice = cleanPath.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/);

  let viewerUrl = url;
  if (isOffice) {
    // For DOCX, Excel, etc. use Microsoft Office Viewer
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  } else if (!isPdf) {
    // Fallback for others
    viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  const lang = (i18n.language || 'uz').substring(0, 2);

  const getOfficeNotice = () => {
    if (lang === 'ru') {
      return "Файлы Word/Office большого размера могут долго открываться в браузере. Рекомендуется скачать файл напрямую.";
    }
    if (lang === 'en') {
      return "Large Word/Office files may load slowly in the browser. Downloading directly is recommended.";
    }
    return "Hajmi katta Word/Office hujjatlari brauzerda sekin ochilishi yoki ochilmasligi mumkin. Faylni to'g'ridan-to'g'ri yuklab olib ochish tavsiya etiladi.";
  };

  const getDownloadText = () => {
    if (lang === 'ru') return "Скачать файл";
    if (lang === 'en') return "Download File";
    return "Faylni yuklab olish";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 ml-2">
            <FileText size={18} className="text-blue-600 shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{t('common.view_document')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              download 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm" 
              title={getDownloadText()}
            >
              <Download size={14} />
              <span className="hidden sm:inline">{getDownloadText()}</span>
            </a>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600" 
              title={t('common.view')}
            >
              <ExternalLink size={18} />
            </a>
            <button onClick={onClose} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-slate-600">
              <X size={18} />
            </button>
          </div>
        </div>

        {isOffice && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-amber-600 shrink-0" />
              <span>{getOfficeNotice()}</span>
            </div>
            <a 
              href={url} 
              download 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0 flex items-center gap-1"
            >
              <Download size={13} /> {getDownloadText()}
            </a>
          </div>
        )}

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
