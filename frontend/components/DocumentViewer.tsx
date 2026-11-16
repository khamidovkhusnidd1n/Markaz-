import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Download, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  url: string;
  onClose: () => void;
}

// Fayl hajmini HEAD request orqali tekshirish
async function getFileSizeMB(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const cl = res.headers.get('content-length');
    if (cl) return Math.round(parseInt(cl) / (1024 * 1024));
    return null;
  } catch {
    return null;
  }
}

const LARGE_FILE_MB = 20; // 20MB dan katta bo'lsa download-only

const DocumentViewer: React.FC<Props> = ({ url, onClose }) => {
  const { t, i18n } = useTranslation();
  const [sizeMB, setSizeMB] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  const cleanPath = url.split('?')[0].toLowerCase();
  const isPdf = cleanPath.endsWith('.pdf');
  const isOffice = !!cleanPath.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/);
  const fileName = url.split('/').pop() || 'jurnal.pdf';

  useEffect(() => {
    if (!url) return;
    setChecking(true);
    getFileSizeMB(url).then(mb => {
      setSizeMB(mb);
      setChecking(false);
    });
  }, [url]);

  if (!url) return null;

  const lang = (i18n.language || 'uz').substring(0, 2);

  const getText = (uz: string, ru: string, en: string) =>
    lang === 'ru' ? ru : lang === 'en' ? en : uz;

  const downloadText = getText("Faylni yuklab olish", "Скачать файл", "Download File");
  const isLarge = isOffice || (sizeMB !== null && sizeMB >= LARGE_FILE_MB);

  let viewerUrl = url;
  if (!isLarge) {
    if (isOffice) {
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    } else if (!isPdf) {
      viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
  }

  // Header (har doim ko'rsatiladi)
  const header = (
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
        >
          <Download size={14} />
          <span className="hidden sm:inline">{downloadText}</span>
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
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {header}

        {/* Tekshirilmoqda */}
        {checking ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-sm font-medium">
              {getText("Faylingizni olyapmiz...", "Загружаем файл...", "Loading file...")}
            </p>
            <p className="text-xs text-slate-400">
              {getText("Birpas kutib turing, faylingizni internetdan yuklayapmiz", "Подождите, загружаем файл из интернета", "Please wait while we load the file")}
            </p>
          </div>
        ) : isLarge ? (
          /* Katta fayl — download-only */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText size={36} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2">
                {getText("Fayl hajmi katta", "Файл слишком большой", "File is too large")}
              </h2>
              <p className="text-slate-500 text-sm max-w-md">
                {getText(
                  `Bu fayl hajmi${sizeMB ? ` ${sizeMB} MB` : ''} bo'lib, brauzerda ochib bo'lmaydi. Iltimos, faylni yuklab oling.`,
                  `Размер файла${sizeMB ? ` ${sizeMB} МБ` : ''} слишком велик для просмотра в браузере. Пожалуйста, скачайте файл.`,
                  `This file${sizeMB ? ` (${sizeMB} MB)` : ''} is too large to open in the browser. Please download it.`
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md text-sm"
              >
                <Download size={18} />
                {downloadText}
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-sm"
              >
                <X size={18} />
                {getText("Yopish", "Закрыть", "Close")}
              </button>
            </div>
            {sizeMB && (
              <p className="text-xs text-slate-400">
                {getText("Fayl nomi", "Имя файла", "File name")}: {fileName} &bull; {sizeMB} MB
              </p>
            )}
          </div>
        ) : (
          /* Oddiy fayl — iframe viewer */
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
