import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, Clock, AlertCircle, XCircle, FileText, Copy, Check, Upload, ExternalLink, Loader2, Trash2, Eye, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { BackendAPI } from '../services/backend';
import { Application } from '../types';
import DocumentViewer from '../components/DocumentViewer';

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const VirtualQabulxona: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { refreshData } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const { tab: routeTab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<'murojaat' | 'ariza' | 'holat'>('murojaat');
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const lang = (i18n.language || 'uz').substring(0, 2) as 'uz' | 'ru' | 'en';

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    const params = new URLSearchParams(location.search);
    const tab = routeTab || params.get('tab') || hash;
    const qParam = params.get('q');

    if (tab === 'ariza' || tab === 'murojaat' || tab === 'holat') {
      setActiveTab(tab);
    }
    if (qParam) {
      setActiveTab('holat');
      setTrackQuery(qParam);
      handleTrackSearch(qParam);
    }
  }, [routeTab, location.hash, location.search]);

  const [appealForm, setAppealForm] = useState({
    full_name: '',
    appeal_type: 'murojaat' as 'murojaat' | 'shikoyat' | 'taklif',
    description: '',
    phone: '',
    email: '',
    telegram_link: '',
  });

  const [applicationForm, setApplicationForm] = useState({
    full_name: '',
    application_type: 'professional_development' as 'professional_development' | 'retraining',
    workplace: '',
    direction: '',
    diploma_specialty: '',
    phone: '',
    telegram_link: '',
  });

  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [diplomaSupplementFile, setDiplomaSupplementFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  // Per-file selection animation states (0..100)
  const [fileProgress, setFileProgress] = useState<{ diploma: number; supplement: number; portfolio: number }>({
    diploma: 0,
    supplement: 0,
    portfolio: 0,
  });

  // Form submit state & upload progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [createdAppNumber, setCreatedAppNumber] = useState('');
  const [copiedAppNum, setCopiedAppNum] = useState(false);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackResults, setTrackResults] = useState<Application[] | null>(null);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  const openFilePreview = (url?: string) => {
    if (!url) return;
    const lower = url.toLowerCase();
    if (lower.endsWith('.zip') || lower.endsWith('.rar')) {
      window.open(url, '_blank');
      return;
    }
    setPreviewDocUrl(url);
  };

  const triggerFileSelectAnimation = (key: 'diploma' | 'supplement' | 'portfolio', file: File | null) => {
    if (!file) {
      setFileProgress((prev) => ({ ...prev, [key]: 0 }));
      return;
    }
    setFileProgress((prev) => ({ ...prev, [key]: 20 }));
    setTimeout(() => setFileProgress((prev) => ({ ...prev, [key]: 65 })), 120);
    setTimeout(() => setFileProgress((prev) => ({ ...prev, [key]: 100 })), 280);
  };

  const handleTrackSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : trackQuery).trim();
    if (!q) return;
    setTrackLoading(true);
    setTrackError('');
    try {
      const results = await BackendAPI.trackApplication(q);
      setTrackResults(results);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : t('virtual_reception.error'));
      setTrackResults([]);
    } finally {
      setTrackLoading(false);
    }
  };

  const labels = {
    tabTrack: {
      uz: "Ariza holatini tekshirish",
      ru: "Проверить статус заявки",
      en: "Check Application Status",
    }[lang],
    diplomaPlaceholder: {
      uz: "Diplom bo'yicha ma'lumotingiz va mutaxassisligingiz (masalan: 60210500 - Rangtasvir)",
      ru: "Образование и специальность по диплому (например: 60210500 - Живопись)",
      en: "Education & specialty according to diploma (e.g., 60210500 - Painting)",
    }[lang],
    docsSectionTitle: {
      uz: "Hujjatlarni biriktirish (I-116-sonli buyruq bo'yicha)",
      ru: "Прикрепление документов (согласно приказу № I-116)",
      en: "Attach Documents (pursuant to Order No. I-116)",
    }[lang],
    diplomaFileLabel: {
      uz: "1. Diplom nusxasi (PDF yoki rasm)",
      ru: "1. Копия диплома (PDF или фото)",
      en: "1. Copy of Diploma (PDF or image)",
    }[lang],
    supplementFileLabel: {
      uz: "2. Diplom ilovasi — o'quv rejasidagi fanlar va soatlar (PDF yoki rasm)",
      ru: "2. Приложение к диплому — дисциплины и часы (PDF или фото)",
      en: "2. Diploma Supplement / Transcript — subjects & hours (PDF or image)",
    }[lang],
    portfolioFileLabel: {
      uz: "3. Ijodiy portfolio — 5–10 ta mualliflik ijodiy ishi (PDF, ZIP yoki rasm — turdosh/qisman turdosh yo'nalishlar uchun)",
      ru: "3. Творческое портфолио — 5–10 авторских работ (PDF, ZIP или фото — для смежных направлений)",
      en: "3. Creative Portfolio — 5–10 original works (PDF, ZIP or image — for related fields)",
    }[lang],
    chooseFile: {
      uz: "Fayl tanlash",
      ru: "Выбрать файл",
      en: "Choose file",
    }[lang],
    replaceFile: {
      uz: "Almashtirish",
      ru: "Заменить",
      en: "Replace",
    }[lang],
    fileReady: {
      uz: "Tayyor",
      ru: "Готово",
      en: "Ready",
    }[lang],
    uploadingText: {
      uz: "Ariza yuborilmoqda...",
      ru: "Отправка заявки...",
      en: "Submitting application...",
    }[lang],
    emptyFileWarning: {
      uz: "Tanlangan fayl bo'sh (0 KB). Iltimos, boshqa fayl tanlang.",
      ru: "Выбранный файл пуст (0 KB). Пожалуйста, выберите другой файл.",
      en: "Selected file is empty (0 KB). Please choose another file.",
    }[lang],
    uploadedFilesLabel: {
      uz: "Yuklangan hujjatlar:",
      ru: "Загруженные документы:",
      en: "Uploaded documents:",
    }[lang],
    diplomaShort: {
      uz: "Diplom nusxasi",
      ru: "Копия диплома",
      en: "Diploma copy",
    }[lang],
    supplementShort: {
      uz: "Diplom ilovasi",
      ru: "Приложение к диплому",
      en: "Diploma supplement",
    }[lang],
    portfolioShort: {
      uz: "Ijodiy portfolio",
      ru: "Творческое портфолио",
      en: "Creative portfolio",
    }[lang],
    trackTitle: {
      uz: "Ariza holati va baholash natijalarini tekshirish",
      ru: "Проверка статуса заявки и результатов оценивания",
      en: "Check Application Status & Evaluation Progress",
    }[lang],
    trackSubtitle: {
      uz: "O'zbekiston Badiiy akademiyasi raisining 2026-yil 23-sentabrdagi I-116-sonli buyrug'i asosida arizangiz qaysi bosqichda ekanligini va Ekspert komissiyasi baholash varaqasi natijalarini ariza raqami (masalan: QT-2026-0001) yoki telefon raqamingiz orqali tekshirishingiz mumkin.",
      ru: "Проверьте текущий этап рассмотрения вашей заявки и результаты оценочного листа Экспертной комиссии (согласно приказу № I-116 от 23 сентября 2026 г.) по номеру заявки (например: QT-2026-0001) или номеру телефона.",
      en: "Check your application stage and Expert Commission evaluation sheet results (pursuant to Order No. I-116 of September 23, 2026) using your application number (e.g., QT-2026-0001) or phone number.",
    }[lang],
    trackInputPlaceholder: {
      uz: "Ariza raqami (QT-2026-0001) yoki telefon raqamingiz (+998 90 123 45 67)",
      ru: "Номер заявки (QT-2026-0001) или номер телефона (+998 90 123 45 67)",
      en: "Application number (QT-2026-0001) or phone number (+998 90 123 45 67)",
    }[lang],
    trackButton: {
      uz: "Tekshirish",
      ru: "Проверить",
      en: "Check",
    }[lang],
    notFound: {
      uz: "Kiritilgan ariza raqami yoki telefon raqami bo'yicha ariza topilmadi. Ma'lumotlarni tekshirib qaytadan urinib ko'ring.",
      ru: "По указанному номеру заявки или телефона ничего не найдено. Проверьте данные и попробуйте снова.",
      en: "No application found matching the provided application number or phone number.",
    }[lang],
    appNumberLabel: {
      uz: "Sizning ariza raqamingiz",
      ru: "Номер вашей заявки",
      en: "Your Application Number",
    }[lang],
    saveAppNumberNote: {
      uz: "Ushbu ariza raqami yoki telefon raqamingiz orqali arizangiz ko'rib chiqilish jarayonini (progress) kuzatib borishingiz mumkin.",
      ru: "С помощью этого номера заявки или вашего телефона вы можете отслеживать ход рассмотрения заявки.",
      en: "You can track the review progress of your application using this application number or your phone number.",
    }[lang],
    checkNowBtn: {
      uz: "Ariza holatini ko'rish",
      ru: "Посмотреть статус заявки",
      en: "View Application Status",
    }[lang],
    stageTitle: {
      uz: "Ko'rib chiqish bosqichlari (Progress)",
      ru: "Этапы рассмотрения (Прогресс)",
      en: "Review Stages (Progress)",
    }[lang],
    scoreSheetTitle: {
      uz: "Ekspert komissiyasining baholash varaqasi (100 ballik tizim — 4-ilova)",
      ru: "Оценочный лист Экспертной комиссии (100-балльная система — Приложение 4)",
      en: "Expert Commission Evaluation Sheet (100-point scale — Annex 4)",
    }[lang],
    decisionScaleNote: {
      uz: "80–100 ball: Mos/Turdosh (to'g'ridan-to'g'ri qabul) • 60–79 ball: Shartli mos (suhbat/ijodiy sinov sharti bilan) • 0–59 ball: Mos emas (rad etiladi)",
      ru: "80–100 баллов: Соответствует (прямой приём) • 60–79 баллов: Условно соответствует (собеседование/творческий экзамен) • 0–59 баллов: Не соответствует",
      en: "80–100 pts: Compatible (direct admission) • 60–79 pts: Conditionally compatible (interview/creative test) • 0–59 pts: Incompatible",
    }[lang],
    appealRightNote: {
      uz: "Eslatma (6-bob): Ekspert komissiyasi xulosasidan norozi bo'lgan talabgor xulosa bilan tanishgan kundan boshlab 5 ish kuni ichida Apellyatsiya komissiyasiga ariza berish huquqiga ega.",
      ru: "Примечание (Глава 6): Кандидат, не согласный с заключением Экспертной комиссии, имеет право подать апелляцию в течение 5 рабочих дней.",
      en: "Note (Chapter 6): Applicants who disagree with the Expert Commission's conclusion have the right to file an appeal within 5 working days.",
    }[lang],
    commissionNoteLabel: {
      uz: "Komissiya xulosasi / Izoh:",
      ru: "Заключение комиссии / Примечание:",
      en: "Commission Conclusion / Note:",
    }[lang],
  };

  const renderAnimatedFileBox = (
    key: 'diploma' | 'supplement' | 'portfolio',
    labelText: string,
    file: File | null,
    setFile: (f: File | null) => void,
    accept: string,
    hint: string
  ) => {
    const pct = fileProgress[key];
    return (
      <div
        className={`rounded-xl border p-3.5 transition-all duration-300 ${
          file
            ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
            : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="block text-xs font-bold text-slate-800 leading-snug">
            {labelText}
          </label>
          {file && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 shrink-0 animate-fade-in">
              <CheckCircle2 size={12} className="text-emerald-600" />
              {labels.fileReady} ({formatFileSize(file.size)})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {file ? (
              <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
            ) : (
              <p className="text-xs text-slate-400">{hint}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {file && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  triggerFileSelectAnimation(key, null);
                }}
                className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 p-1.5 text-rose-600 transition-colors"
                title="O'chirish"
              >
                <Trash2 size={14} />
              </button>
            )}
            <label className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 cursor-pointer transition-colors">
              <Upload size={14} />
              {file ? labels.replaceFile : labels.chooseFile}
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const chosen = e.target.files?.[0] || null;
                  if (chosen && chosen.size === 0) {
                    setSubmissionError(labels.emptyFileWarning);
                    e.target.value = '';
                    return;
                  }
                  setSubmissionError('');
                  setFile(chosen);
                  triggerFileSelectAnimation(key, chosen);
                }}
              />
            </label>
          </div>
        </div>

        {/* Animated file progress bar */}
        {file && (
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  const getSteps = (app: Application) => {
    const st = app.status || 'pending';
    let currentStep = 0;
    if (st === 'pending') currentStep = 0;
    else if (st === 'in_progress') currentStep = 1;
    else if (st === 'commission_review' || st === 'creative_exam' || st === 'appeal') currentStep = 2;
    else if (st === 'resolved' || st === 'conditional_accepted' || st === 'rejected') currentStep = 3;

    const step4Title = st === 'rejected'
      ? ({ uz: "4. Yakuniy qaror: Rad etildi", ru: "4. Итоговое решение: Отклонено", en: "4. Final Decision: Rejected" }[lang])
      : st === 'conditional_accepted'
      ? ({ uz: "4. Yakuniy qaror: Shartli qabul qilindi", ru: "4. Итоговое решение: Условно принят", en: "4. Final Decision: Conditionally Accepted" }[lang])
      : st === 'resolved'
      ? ({ uz: "4. Yakuniy qaror: Qabul qilindi", ru: "4. Итоговое решение: Принят", en: "4. Final Decision: Accepted" }[lang])
      : ({ uz: "4. Ekspert komissiyasi yakuniy qarori", ru: "4. Итоговое решение комиссии", en: "4. Final Commission Decision" }[lang]);

    return {
      currentStep,
      isRejected: st === 'rejected',
      isConditional: st === 'conditional_accepted' || st === 'creative_exam',
      isResolved: st === 'resolved',
      steps: [
        {
          title: {
            uz: "1. Ariza va hujjatlar qabul qilindi",
            ru: "1. Заявка и документы приняты",
            en: "1. Application & Documents Received",
          }[lang],
          desc: {
            uz: "Talabgorning arizasi va biriktirilgan hujjatlari ro'yxatga olindi",
            ru: "Заявка и прикреплённые документы зарегистрированы",
            en: "Applicant's submission and attached documents are registered",
          }[lang],
        },
        {
          title: {
            uz: "2. Dastlabki tekshiruv (Muvofiqlik jadvali)",
            ru: "2. Первичная проверка (Таблица соответствия)",
            en: "2. Initial Verification (Compatibility Table)",
          }[lang],
          desc: {
            uz: "Diplom yo'nalishining 2 va 3-ilova muvofiqlik jadvaliga mosligi o'rganilmoqda",
            ru: "Проверка соответствия диплома таблицам Приложений 2 и 3",
            en: "Checking diploma alignment with Annex 2 & 3 tables",
          }[lang],
        },
        {
          title: {
            uz: "3. Ekspert komissiyasi baholashi (100 ballik tizim)",
            ru: "3. Оценка Экспертной комиссии (100-балльная система)",
            en: "3. Expert Commission Evaluation (100-point scale)",
          }[lang],
          desc: st === 'creative_exam'
            ? ({
                uz: "Qo'shimcha suhbat / amaliy ijodiy sinov jarayonida (5-bob)",
                ru: "Дополнительное собеседование / творческое испытание (Глава 5)",
                en: "Additional interview / practical creative test in progress (Chapter 5)",
              }[lang])
            : ({
                uz: "7 ta mezon va ijodiy portfolio bo'yicha baholash (4-ilova)",
                ru: "Оценка по 7 критериям и творческому портфолио (Приложение 4)",
                en: "Assessment across 7 criteria and creative portfolio (Annex 4)",
              }[lang]),
        },
        {
          title: step4Title,
          desc: {
            uz: "5-ilovaga muvofiq komissiya xulosasi rasmiylashtiriladi",
            ru: "Оформление заключения комиссии согласно Приложению 5",
            en: "Formalizing commission conclusion pursuant to Annex 5",
          }[lang],
        },
      ],
    };
  };

  const getCriteriaList = (app: Application) => [
    {
      num: 1,
      name: {
        uz: "O'quv rejasidagi fanlarning yaqinligi va mosligi (diplom ilovasi asosida)",
        ru: "Близость и соответствие дисциплин учебного плана (по приложению к диплому)",
        en: "Similarity and alignment of curriculum subjects (based on diploma transcript)",
      }[lang],
      max: 30,
      score: app.scoreSubjects || 0,
    },
    {
      num: 2,
      name: {
        uz: "Kasbiy kompetensiyalarning umumiyligi (kvalifikatsiya tavsifi asosida)",
        ru: "Общность профессиональных компетенций (по описанию квалификации)",
        en: "Commonality of professional competencies (based on qualification description)",
      }[lang],
      max: 20,
      score: app.scoreCompetencies || 0,
    },
    {
      num: 3,
      name: {
        uz: "Ijodiy kompetensiyalar va mahorat darajasi (baholanadigan yo'nalish bo'yicha)",
        ru: "Творческие компетенции и уровень мастерства (по направлению)",
        en: "Creative competencies and skill level (in the evaluated field)",
      }[lang],
      max: 20,
      score: app.scoreCreative || 0,
    },
    {
      num: 4,
      name: {
        uz: "Diplomda ko'rsatilgan kvalifikatsiya nomi",
        ru: "Наименование квалификации, указанное в дипломе",
        en: "Qualification title stated on the diploma",
      }[lang],
      max: 10,
      score: app.scoreQualification || 0,
    },
    {
      num: 5,
      name: {
        uz: "O'zlashtirilgan kreditlar (o'quv soatlari) hajmi",
        ru: "Объём освоенных кредитов (учебных часов)",
        en: "Volume of completed credits (academic hours)",
      }[lang],
      max: 10,
      score: app.scoreCredits || 0,
    },
    {
      num: 6,
      name: {
        uz: "Tegishli soha bo'yicha kasbiy ish staji (3 yilgacha — 3 ball, 3 yildan ortiq — 5 ball)",
        ru: "Профессиональный стаж работы в сфере (до 3 лет — 3 балла, свыше 3 лет — 5 баллов)",
        en: "Relevant professional work experience (up to 3 yrs — 3 pts, over 3 yrs — 5 pts)",
      }[lang],
      max: 5,
      score: app.scoreExperience || 0,
    },
    {
      num: 7,
      name: {
        uz: "Ijodiy portfolio sifati (badiiy-amaliy yo'nalishlar uchun)",
        ru: "Качество творческого портфолио (для художественно-прикладных направлений)",
        en: "Quality of creative portfolio (for applied art directions)",
      }[lang],
      max: 5,
      score: app.scorePortfolio || 0,
    },
  ];

  const getDecisionBadge = (app: Application) => {
    const decision = app.decisionType || 'pending';
    const status = app.status || 'pending';

    if (decision === 'direct_match' || decision === 'compatible' || status === 'resolved') {
      return {
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
        text: decision === 'direct_match'
          ? ({ uz: "To'g'ridan-to'g'ri mos — Qabul qilindi", ru: "Прямое соответствие — Принят", en: "Direct Match — Accepted" }[lang])
          : ({ uz: "MOS / TURDOSH (80–100 ball) — Qabul qilindi", ru: "СООТВЕТСТВУЕТ (80–100 баллов) — Принят", en: "COMPATIBLE (80–100 pts) — Accepted" }[lang]),
      };
    }
    if (decision === 'conditional' || status === 'conditional_accepted' || status === 'creative_exam') {
      return {
        color: 'bg-amber-50 text-amber-900 border-amber-200',
        icon: <AlertCircle size={18} className="text-amber-600 shrink-0" />,
        text: {
          uz: "SHARTLI MOS / QISMAN TURDOSH (60–79 ball) — Qo'shimcha suhbat yoki ijodiy sinov sharti bilan",
          ru: "УСЛОВНО СООТВЕТСТВУЕТ (60–79 баллов) — С условием собеседования или творческого испытания",
          en: "CONDITIONALLY COMPATIBLE (60–79 pts) — Subject to interview or creative test",
        }[lang],
      };
    }
    if (decision === 'incompatible' || status === 'rejected') {
      return {
        color: 'bg-rose-50 text-rose-800 border-rose-200',
        icon: <XCircle size={18} className="text-rose-600 shrink-0" />,
        text: {
          uz: "MOS EMAS (0–59 ball) — Qabul qilish rad etildi",
          ru: "НЕ СООТВЕТСТВУЕТ (0–59 баллов) — Отклонено",
          en: "INCOMPATIBLE (0–59 pts) — Rejected",
        }[lang],
      };
    }
    return {
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      icon: <Clock size={18} className="text-blue-700 shrink-0" />,
      text: app.statusDisplay || ({ uz: "Ko'rib chiqilmoqda", ru: "На рассмотрении", en: "Under Review" }[lang]),
    };
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <section className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">{t('virtual_reception.badge')}</span>
          <h1 className="mt-2 text-4xl font-black text-slate-900">{t('virtual_reception.title')}</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t('virtual_reception.subtitle')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1.5 flex flex-col sm:flex-row gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('murojaat');
                setSubmissionMessage('');
                setSubmissionError('');
                navigate('/virtual-qabulxona/murojaat', { replace: true });
              }}
              className={`px-5 py-3 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto ${
                activeTab === 'murojaat' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('virtual_reception.tab_appeal')}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ariza');
                setSubmissionMessage('');
                setSubmissionError('');
                navigate('/virtual-qabulxona/ariza', { replace: true });
              }}
              className={`px-5 py-3 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto ${
                activeTab === 'ariza' ? 'bg-blue-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('virtual_reception.tab_application')}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('holat');
                setSubmissionMessage('');
                setSubmissionError('');
                navigate('/virtual-qabulxona/holat', { replace: true });
              }}
              className={`px-5 py-3 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto flex items-center justify-center gap-2 ${
                activeTab === 'holat' ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Search size={16} />
              {labels.tabTrack}
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* 1. Murojaatlar */}
          {activeTab === 'murojaat' && (
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-6">
                {t('virtual_reception.appeal_title')}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setSubmissionError('');
                  setSubmissionMessage('');
                  try {
                    await BackendAPI.createAppeal(appealForm);
                    setCreatedAppNumber('');
                    setSubmissionMessage(t('virtual_reception.appeal_success'));
                    setAppealForm({ full_name: '', appeal_type: 'murojaat', description: '', phone: '', email: '', telegram_link: '' });
                    refreshData().catch(() => {});
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  } catch (error) {
                    setSubmissionError(error instanceof Error ? error.message : t('virtual_reception.error'));
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="grid gap-5"
              >
                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-slate-900" value={appealForm.full_name} onChange={(e) => setAppealForm((p) => ({ ...p, full_name: e.target.value }))} placeholder={t('virtual_reception.appeal_name_placeholder')} />
                <select className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-slate-900" value={appealForm.appeal_type} onChange={(e) => setAppealForm((p) => ({ ...p, appeal_type: e.target.value as any }))}>
                  <option value="murojaat">{t('virtual_reception.type_appeal')}</option>
                  <option value="shikoyat">{t('virtual_reception.type_complaint')}</option>
                  <option value="taklif">{t('virtual_reception.type_suggestion')}</option>
                </select>
                <textarea required className="min-h-[120px] rounded-xl border border-slate-300 p-4 bg-slate-50 focus:bg-white transition-colors outline-none focus:border-slate-900 resize-none" value={appealForm.description} onChange={(e) => setAppealForm((p) => ({ ...p, description: e.target.value }))} placeholder={t('virtual_reception.appeal_text_placeholder')} />
                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-slate-900" value={appealForm.phone} onChange={(e) => setAppealForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t('virtual_reception.phone_placeholder')} />
                <input type="email" className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-slate-900" value={appealForm.email} onChange={(e) => setAppealForm((p) => ({ ...p, email: e.target.value }))} placeholder={t('virtual_reception.email_placeholder')} />
                <input className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-slate-900" value={appealForm.telegram_link} onChange={(e) => setAppealForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder={t('virtual_reception.telegram_placeholder')} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 transition-colors px-6 py-4 mt-2 font-bold text-white flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {t('virtual_reception.appeal_submit')}
                </button>
              </form>
            </div>
          )}

          {/* 2. Kursga ariza topshirish */}
          {activeTab === 'ariza' && (
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-6">
                {t('virtual_reception.application_title')}
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  setUploadPercent(10);
                  setSubmissionMessage('');
                  setSubmissionError('');
                  try {
                    const created = await BackendAPI.createApplication({
                      ...applicationForm,
                      diploma_file: diplomaFile,
                      diploma_supplement_file: diplomaSupplementFile,
                      portfolio_file: portfolioFile,
                    });
                    const appNum = created.applicationNumber || `QT-2026-${String(created.id || 1).padStart(4, '0')}`;
                    setCreatedAppNumber(appNum);
                    setSubmissionMessage(t('virtual_reception.application_success'));
                    setApplicationForm({
                      full_name: '',
                      application_type: 'professional_development',
                      workplace: '',
                      direction: '',
                      diploma_specialty: '',
                      phone: '',
                      telegram_link: '',
                    });
                    setDiplomaFile(null);
                    setDiplomaSupplementFile(null);
                    setPortfolioFile(null);
                    setFileProgress({ diploma: 0, supplement: 0, portfolio: 0 });
                    refreshData().catch(() => {});
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  } catch (error) {
                    setCreatedAppNumber('');
                    setSubmissionError(error instanceof Error ? error.message : t('virtual_reception.error'));
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  } finally {
                    setIsSubmitting(false);
                    setTimeout(() => setUploadPercent(0), 600);
                  }
                }}
                className="grid gap-5"
              >
                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.full_name} onChange={(e) => setApplicationForm((p) => ({ ...p, full_name: e.target.value }))} placeholder={t('virtual_reception.application_name_placeholder')} />
                <select className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.application_type} onChange={(e) => setApplicationForm((p) => ({ ...p, application_type: e.target.value as any }))}>
                  <option value="professional_development">{t('virtual_reception.app_type_mo')}</option>
                  <option value="retraining">{t('virtual_reception.app_type_qt')}</option>
                </select>
                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.workplace} onChange={(e) => setApplicationForm((p) => ({ ...p, workplace: e.target.value }))} placeholder={t('virtual_reception.workplace_placeholder')} />
                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.direction} onChange={(e) => setApplicationForm((p) => ({ ...p, direction: e.target.value }))} placeholder={t('virtual_reception.direction_placeholder')} />
                <input className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.diploma_specialty} onChange={(e) => setApplicationForm((p) => ({ ...p, diploma_specialty: e.target.value }))} placeholder={labels.diplomaPlaceholder} />

                {/* Hujjatlarni yuklash bloki (Diplom, Diplom ilovasi, Ijodiy portfolio) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {labels.docsSectionTitle}
                  </p>

                  <div className="grid gap-3">
                    {renderAnimatedFileBox(
                      'diploma',
                      labels.diplomaFileLabel,
                      diplomaFile,
                      setDiplomaFile,
                      '.pdf,.jpg,.jpeg,.png,.webp',
                      'PDF, JPG, PNG'
                    )}
                    {renderAnimatedFileBox(
                      'supplement',
                      labels.supplementFileLabel,
                      diplomaSupplementFile,
                      setDiplomaSupplementFile,
                      '.pdf,.jpg,.jpeg,.png,.webp',
                      'PDF, JPG, PNG'
                    )}
                    {renderAnimatedFileBox(
                      'portfolio',
                      labels.portfolioFileLabel,
                      portfolioFile,
                      setPortfolioFile,
                      '.pdf,.zip,.rar,.jpg,.jpeg,.png,.webp',
                      'PDF, ZIP, RAR, JPG, PNG'
                    )}
                  </div>
                </div>

                <input required className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.phone} onChange={(e) => setApplicationForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t('virtual_reception.phone_placeholder')} />
                <input className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white outline-none focus:border-blue-800" value={applicationForm.telegram_link} onChange={(e) => setApplicationForm((p) => ({ ...p, telegram_link: e.target.value }))} placeholder={t('virtual_reception.telegram_placeholder')} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-800 hover:bg-blue-900 disabled:opacity-60 transition-colors px-6 py-4 mt-1 font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? labels.uploadingText : t('virtual_reception.application_submit')}
                </button>
              </form>
            </div>
          )}

          {/* 3. Ariza holatini tekshirish (Progress va 100 ballik baholash varaqasi) */}
          {activeTab === 'holat' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
                <div className="flex items-start gap-3 border-b border-slate-200 pb-4 mb-5">
                  <FileText className="text-blue-900 shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {labels.trackTitle}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {labels.trackSubtitle}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTrackSearch();
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    required
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder={labels.trackInputPlaceholder}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3.5 bg-slate-50 focus:bg-white outline-none focus:border-blue-900 text-slate-900 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={trackLoading}
                    className="rounded-xl bg-blue-900 hover:bg-blue-950 disabled:opacity-60 transition-colors px-6 py-3.5 font-bold text-white flex items-center justify-center gap-2 shrink-0"
                  >
                    {trackLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    {trackLoading ? '...' : labels.trackButton}
                  </button>
                </form>

                {trackError && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    {trackError}
                  </div>
                )}
              </div>

              {trackResults !== null && (
                trackResults.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                    {labels.notFound}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {trackResults.map((app) => {
                      const stepInfo = getSteps(app);
                      const criteria = getCriteriaList(app);
                      const badge = getDecisionBadge(app);
                      const hasScores = (app.totalScore || 0) > 0 || app.status === 'commission_review' || app.status === 'resolved' || app.status === 'conditional_accepted' || app.status === 'rejected';
                      const hasFiles = Boolean(app.diplomaFileUrl || app.diplomaSupplementFileUrl || app.portfolioFileUrl);

                      return (
                        <div key={app.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                          {/* Yuqori pasport paneli */}
                          <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded">
                                  {app.applicationNumber || `#${app.id}`}
                                </span>
                                <span className="text-xs text-slate-300 font-medium">
                                  {app.applicationType === 'retraining'
                                    ? t('virtual_reception.app_type_qt')
                                    : t('virtual_reception.app_type_mo')}
                                </span>
                              </div>
                              <h4 className="mt-2 text-lg sm:text-xl font-bold text-white">
                                {app.fullName}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                                {app.direction} {app.workplace ? `• ${app.workplace}` : ''}
                              </p>
                              {app.diplomaSpecialty && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Diplom: {app.diplomaSpecialty}
                                </p>
                              )}
                            </div>
                            {app.createdAt && (
                              <div className="text-left sm:text-right shrink-0">
                                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                                  {lang === 'ru' ? 'Дата подачи' : lang === 'en' ? 'Submitted on' : 'Topshirilgan sana'}
                                </span>
                                <span className="text-sm font-semibold text-slate-200 tabular-nums">
                                  {new Date(app.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ')}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-6 space-y-6">
                            {/* Joriy holat va komissiya xulosasi */}
                            <div className={`rounded-xl border px-4 py-3.5 flex items-start gap-3 ${badge.color}`}>
                              <div className="mt-0.5">{badge.icon}</div>
                              <div className="text-sm font-bold leading-snug">
                                {badge.text}
                              </div>
                            </div>

                            {/* Biriktirilgan hujjatlar */}
                            {hasFiles && (
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-600 mr-1">
                                  {labels.uploadedFilesLabel}
                                </span>
                                {app.diplomaFileUrl && (
                                  <button
                                    type="button"
                                    onClick={() => openFilePreview(app.diplomaFileUrl)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-300 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                                  >
                                    <Eye size={13} className="text-blue-800" />
                                    {labels.diplomaShort}
                                  </button>
                                )}
                                {app.diplomaSupplementFileUrl && (
                                  <button
                                    type="button"
                                    onClick={() => openFilePreview(app.diplomaSupplementFileUrl)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-300 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                                  >
                                    <Eye size={13} className="text-emerald-700" />
                                    {labels.supplementShort}
                                  </button>
                                )}
                                {app.portfolioFileUrl && (
                                  <button
                                    type="button"
                                    onClick={() => openFilePreview(app.portfolioFileUrl)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-amber-50 hover:border-amber-300 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                                  >
                                    {app.portfolioFileUrl.toLowerCase().match(/\.(zip|rar)$/) ? (
                                      <Download size={13} className="text-amber-700" />
                                    ) : (
                                      <Eye size={13} className="text-amber-700" />
                                    )}
                                    {labels.portfolioShort}
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Admin / Komissiya tomonidan talabgorga izoh (har doim ko'rinadi) */}
                            <div className={`rounded-xl border p-4 ${app.adminNote ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-slate-50/70'}`}>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                {labels.commissionNoteLabel}
                              </p>
                              <p className={`text-sm whitespace-pre-line leading-relaxed ${app.adminNote ? 'text-slate-900 font-medium' : 'text-slate-500 italic'}`}>
                                {app.adminNote || (
                                  lang === 'ru'
                                    ? 'Пока комментариев от комиссии нет. После проверки ваших документов здесь появится заключение или комментарий.'
                                    : lang === 'en'
                                    ? 'No comments from the commission yet. Once your documents are reviewed, the conclusion or feedback will appear here.'
                                    : "Hozircha komissiya tomonidan qo'shimcha izoh kiritilmagan. Hujjatlaringiz o'rganilgach, izoh yoki ko'rsatma shu yerda aks etadi."
                                )}
                              </p>
                            </div>

                            {/* 4-bosqichli Progress stepper */}
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                                {labels.stageTitle}
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stepInfo.steps.map((st, idx) => {
                                  const isDone = idx < stepInfo.currentStep || (idx === 3 && (stepInfo.isResolved || stepInfo.isConditional));
                                  const isCurrent = idx === stepInfo.currentStep;
                                  const isFailed = idx === 3 && stepInfo.isRejected;

                                  let boxClass = 'border-slate-200 bg-slate-50/70 text-slate-500';
                                  let dotClass = 'bg-slate-200 text-slate-600';
                                  if (isFailed) {
                                    boxClass = 'border-rose-300 bg-rose-50/70 text-rose-900';
                                    dotClass = 'bg-rose-600 text-white';
                                  } else if (isDone) {
                                    boxClass = 'border-emerald-200 bg-emerald-50/50 text-slate-900';
                                    dotClass = 'bg-emerald-600 text-white';
                                  } else if (isCurrent) {
                                    boxClass = 'border-blue-800 bg-blue-50/50 text-slate-900 ring-1 ring-blue-800/20';
                                    dotClass = 'bg-blue-900 text-white';
                                  }

                                  return (
                                    <div key={idx} className={`rounded-xl border p-3.5 transition-colors ${boxClass}`}>
                                      <div className="flex items-start gap-3">
                                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${dotClass}`}>
                                          {isDone ? '✓' : isFailed ? '✕' : idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                          <p className="text-xs sm:text-sm font-bold leading-snug">
                                            {st.title}
                                          </p>
                                          <p className="text-xs opacity-80 mt-1 leading-relaxed">
                                            {st.desc}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 100 ballik baholash varaqasi (4-ilova) */}
                            {(app.applicationType === 'retraining' || hasScores) && (
                              <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    {labels.scoreSheetTitle}
                                  </span>
                                  <span className="text-sm font-black text-blue-900 tabular-nums">
                                    {lang === 'ru' ? 'Итого:' : lang === 'en' ? 'Total:' : 'Jami:'} {app.totalScore || 0} / 100 {lang === 'ru' ? 'баллов' : lang === 'en' ? 'pts' : 'ball'}
                                  </span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                  {criteria.map((c) => (
                                    <div key={c.num} className="px-4 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                                      <div className="flex items-baseline gap-2.5 min-w-0">
                                        <span className="text-slate-400 font-semibold tabular-nums shrink-0">{c.num}.</span>
                                        <span className="text-slate-700 leading-snug">{c.name}</span>
                                      </div>
                                      <span className="font-semibold text-slate-900 tabular-nums shrink-0 whitespace-nowrap">
                                        {c.score} <span className="text-slate-400 font-normal">/ {c.max}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                                  {labels.decisionScaleNote}
                                </div>
                              </div>
                            )}

                            {/* Apellyatsiya eslatmasi */}
                            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                              {labels.appealRightNote}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {previewDocUrl && <DocumentViewer url={previewDocUrl} onClose={() => setPreviewDocUrl(null)} />}

        {/* Muvaffaqiyatli yoki xatolik xabari */}
        <div ref={feedbackRef}>
          {submissionError && (
            <div className="mt-8 max-w-2xl mx-auto rounded-2xl bg-rose-50 border border-rose-200 p-5 text-center shadow-sm flex items-center justify-center gap-3 text-rose-900 font-semibold">
              <AlertCircle size={20} className="text-rose-600 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {submissionMessage && (
            <div className="mt-8 max-w-2xl mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center shadow-sm">
              <p className="text-lg font-bold text-emerald-900">{submissionMessage}</p>
              {createdAppNumber && (
                <div className="mt-4 pt-4 border-t border-emerald-200/80 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {labels.appNumberLabel}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white border border-emerald-300 rounded-xl px-4 py-2.5">
                    <span className="font-mono text-xl font-black text-slate-900 tracking-wide">
                      {createdAppNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdAppNumber);
                        setCopiedAppNum(true);
                        setTimeout(() => setCopiedAppNum(false), 2000);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Nusxa olish"
                    >
                      {copiedAppNum ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-800 max-w-lg mx-auto leading-relaxed">
                    {labels.saveAppNumberNote}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('holat');
                        setTrackQuery(createdAppNumber);
                        setSubmissionMessage('');
                        navigate('/virtual-qabulxona/holat', { replace: true });
                        handleTrackSearch(createdAppNumber);
                      }}
                      className="mt-1 inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 transition-colors"
                    >
                      <Search size={14} />
                      {labels.checkNowBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VirtualQabulxona;
