import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  url: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<Props> = ({ url, onClose }) => {
  const { t } = useTranslation();
  if (!url) return null;

  const isPdf = url.toLowerCase().endsWith('.pdf');
  const isOffice = url.toLowerCase().match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/);

  let viewerUrl = url;
  if (isOffice) {
    // For DOCX, Excel, etc. use Microsoft Office Viewer
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  } else if (!isPdf) {
    // Fallback for others
    viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 ml-2">Hujjatni ko'rish</h3>
          <div className="flex items-center gap-2">
            <a href={url} target="_blank" rel="noopener noreferrer" download className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600" title="Yuklab olish">
              <ExternalLink size={20} />
            </a>
            <button onClick={onClose} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>
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
