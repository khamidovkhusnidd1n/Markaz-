import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  Phone, 
  Scale, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  BookOpen,
  X,
  ImageOff,
  Calendar,
  Images,
  ChevronLeft,
  ChevronRight,
  Megaphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml } from '../utils';
import { AntiCorruptionPost } from '../types';
import { BackendAPI } from '../services/backend';
import { ImageModal } from '../components/ImageModal';
import DocumentViewer from '../components/DocumentViewer';

const INTERNAL_DOCS_FALLBACK: Record<string, { uz: string; ru: string; en: string }> = {
  internal: {
    uz: `O‘ZBEKISTON BADIIY AKADEMIYASI HUZURIDAGI MARKAZ XODIMLARINING KASBIY ODOB-AXLOQ QOIDALARI VA KORRUPSIYAGA QARSHI ICHKI SIYOSATI

1-BOB. UMUMIY QOIDALAR
1. Mazkur Qoidalar O‘zbekiston Respublikasining «Korrupsiyaga qarshi kurashish to‘g‘risida»gi Qonuni, «Manfaatlar to‘qnashuvi to‘g‘risida»gi Qonuni hamda Vazirlar Mahkamasining tegishli normativ hujjatlari asosida ishlab chiqilgan.
2. Qoidalarning maqsadi — Markazda korrupsiyaviy holatlarga nisbatan murosasiz munosabat («Nol toqat») muhitini shakllantirish, pedagogik va ma'muriy faoliyatning ochiqligi, shaffofligi hamda xolisligini ta'minlashdan iborat.
3. Mazkur qoidalar Markazning barcha xodimlari, professor-o‘qituvchilari, metodistlari va taklif etilgan mutaxassislari uchun majburiydir.

2-BOB. XIZMAT FAOLIYATIDAGI ASOSIY TAMOYILLAR
1. Qonuniylik: Barcha xizmat va o‘quv jarayonlari faqat O‘zbekiston Respublikasi qonunlari va normativ hujjatlari asosida amalga oshiriladi.
2. Xolislik va adolat: Tinglovchilarni qabul qilish, ularning bilimini baholash hamda attestatsiyadan o‘tkazishda har qanday subyektivizm, tanish-bilishchilik va guruhbozlik qat'iyan taqiqlanadi.
3. Shaffoflik: Tinglovchilarning o‘quv ko‘rsatkichlari, test natijalari va sertifikat berish jarayoni ochiq va raqamlashgan tizimda olib boriladi.
4. Manfaatlar to‘qnashuviga yo‘l qo‘ymaslik: Xodim shaxsiy manfaatlari va xizmat burchi o‘rtasida to‘qnashuv yuzaga kelishiga yo‘l qo‘ymasligi shart.

3-BOB. KORRUPSIYAVIY HOLATLARNING OLDINI OLISH
1. Markaz xodimlariga quyidagilar qat'iyan man etiladi:
— Tinglovchilardan, ularning vakillaridan yoki boshqa uchinchi shaxslardan xizmat vazifalarini bajarish yoki bajarmaslik evaziga har qanday moddiy qimmatliklar, pul mablag‘lari, sovg‘alar yoki bepul xizmatlarni talab qilish va qabul qilish;
— Kurslarga ro‘yxatga olish, oraliq yoki yakuniy baholash, test sinovlarida nohaq yordam ko‘rsatish evaziga tamagirlik qilish;
— O‘z xizmat mavqeidan shaxsiy yoki uchinchi shaxslar manfaati yo‘lida foydalanish;
— Tinglovchilarni pullik xususiy darslarga yoki Markaz doirasidan tashqari to‘lovlarga majburlash.
2. Har qanday sovg‘a taklif qilingan taqdirda, xodim uni rad etishi va 24 soat ichida komplayens-nazorat mas'uliga xabar berishi shart.

4-BOB. TINGLOVCHILAR VA XODIMLAR O‘RTASIDAGI MUNOSABATLAR
1. Xodimlar tinglovchilar bilan xushmuomala, xolis, ehtiromli va professional muloqot o‘rnatishi lozim.
2. Tinglovchilarning sha'ni, qadr-qimmati va huquqlarini kamsituvchi harakatlarga yo‘l qo‘yilmaydi.
3. Malaka oshirish yakunida sertifikatlar faqat o‘quv dasturini to‘liq o‘zlashtirgan va test mezonlariga javob bergan tinglovchilarga beriladi.

5-BOB. JAVOBGARLIK CHORALARI
1. Mazkur Kasbiy odob-axloq qoidalarini buzish xodimga nisbatan qat'iy intizomiy jazo (ogohlantirish, hayfsan, jarima yoki mehnat shartnomasini bekor qilish) qo‘llashga asos bo‘ladi.
2. Korrupsiyaviy huquqbuzarlik alomatlari aniqlangan taqdirda to‘plangan hujjatlar qonunchilikda belgilangan tartibda huquqni muhofaza qiluvchi organlarga yuboriladi.`,
    ru: `ПРАВИЛА ПРОФЕССИОНАЛЬНОЙ ЭТИКИ И ВНУТРЕННЯЯ АНТИКОРРУПЦИОННАЯ ПОЛИТИКА СОТРУДНИКОВ ЦЕНТРА

РАЗДЕЛ 1. ОБЩИЕ ПОЛОЖЕНИЯ
1. Настоящие Правила разработаны в соответствии с Законами Республики Узбекистан «О противодействии коррупции», «О конфликте интересов» и государственными стандартами этики служащих.
2. Цель Правил — формирование атмосферы абсолютной нетерпимости к коррупционным проявлениям («Нулевая терпимость»), обеспечение прозрачности, честности и объективности во всех учебных и аттестационных процессах Центра.
3. Соблюдение настоящих правил обязательно для каждого преподавателя, методиста и сотрудника Центра.

РАЗДЕЛ 2. КЛЮЧЕВЫЕ ПРИНЦИПЫ И ЗАПРЕТЫ
— Законность, открытость и профессиональная честность;
— Категорический запрет на требование или получение любых денежных средств, ценностей, подарков и услуг от слушателей;
— Недопущение фаворитизма, кумовства и субъективизма при тестировании и выдаче сертификатов;
— Обязательное декларирование и урегулирование любого потенциального конфликта интересов.

РАЗДЕЛ 3. ОТВЕТСТВЕННОСТЬ
Нарушение настоящих норм влечет дисциплинарные взыскания вплоть до прекращения трудового договора и передачи материалов в правоохранительные органы.`,
    en: `CODE OF PROFESSIONAL ETHICS AND INTERNAL ANTI-CORRUPTION POLICY OF THE CENTER

SECTION 1. GENERAL PROVISIONS
1. This Code establishes fundamental ethical standards and anti-corruption requirements for all faculty and administrative staff of the Center.
2. The Center enforces a strict Zero Tolerance policy against bribery, extortion, conflicts of interest, and biased evaluation.
3. All training and certification processes are conducted strictly according to objective, merit-based standards.

SECTION 2. CODE OF CONDUCT
— Rule of law and institutional integrity;
— Complete prohibition against accepting gifts, payments, or favors from students;
— Zero tolerance for favoritism, nepotism, and tampering with examination results;
— Mandatory reporting of any corruption attempts to the compliance officer.

SECTION 3. ENFORCEMENT
Violations result in immediate disciplinary measures up to dismissal and referral to authorized law enforcement agencies.`
  },
  memo: {
    uz: `KORRUPSIYA HOLATLARI HAQIDA XABAR BERISH TARTIBI VA HIMOYALASH KAFOLATLARI TO‘G‘RISIDA ESLATMA

1. KIMLAR MUROJAAT QILISHI MUMKIN?
Markazning har bir tinglovchisi, professor-o‘qituvchisi, xodimi hamda fuqarolar Markaz faoliyatida korrupsiyaviy holatlar, noqonuniy to‘lovlar talab qilinishi yoki vakolatni suiiste'mol qilish holatlariga duch kelganda murojaat qilish huquqiga ega.

2. RASMIY ALOQA VA MUROJAAT KANALLARI:
• Markazning to‘g‘ridan-to‘g‘ri ishonch telefoni: +998 77 363 38 36
• Rasmiy Telegram boti: https://t.me/uzbamalakamakebot
• Rasmiy elektron pochta: uzbahuzuridagimarkaz@gmail.com
• Korrupsiyaga qarshi kurashish agentligining Call-markazi: 1253
• Veb-sayt orqali onlayn murojaat: Saytning «Virtual qabulxona» bo‘limi

3. MUROJAATDA QUYIDAGILARNI KO‘RSATISH TAVSIYA ETILADI:
1. Qoidabuzarlik sodir etilgan sana, vaqt va joy;
2. Huquqbuzarlikda gumon qilinayotgan xodimning F.I.Sh. va lavozimi;
3. Noqonuniy xatti-harakatlarning aniq bayoni (pul talab qilish, imtihonda nohaqlik va h.k.);
4. Mavjud dalillar: fotosuratlar, audio/video yozuvlar, kvitansiyalar, yozishmalar skrinshoti.

4. MUROJAATCHINING HUQUQLARI VA DAVLAT HIMOYASI:
1. «Korrupsiyaga qarshi kurashish to‘g‘risida»gi Qonunning 28-moddasiga asosan korrupsiya haqida xabar bergan shaxs to‘liq davlat himoyasiga olinadi.
2. Xabar beruvchining shaxsiga doir barcha ma'lumotlar qat'iy maxfiy saqlanadi va oshkor etilmaydi.
3. Xabar bergan tinglovchi yoki xodimga nisbatan ta'qib, tahdid yoki o‘quv jarayonida bosim o‘tkazish qonun bilan qat'iyan taqiqlanadi.
4. Aniq faktlar ko‘rsatilgan anonim murojaatlar ham to‘liq o‘rganib chiqiladi.

5. KO‘RIB CHIQISH TARTIBI VA MUDDATLARI:
• Barcha murojaatlar 15 kun ichida komplayens-nazorat mas'ul xodimi tomonidan ko‘rib chiqiladi;
• Qo‘shimcha o‘rganish talab etilganda muddat 30 kungacha uzaytirilishi va murojaat etuvchiga rasmiy javob berilishi ta'minlanadi.`,
    ru: `ПАМЯТКА О ПОРЯДКЕ СООБЩЕНИЯ О ФАКТАХ КОРРУПЦИИ И ГАРАНТИЯХ ЗАЩИТЫ

1. КТО ВПРАВЕ ОБРАТИТЬСЯ:
Каждый слушатель курсов, педагог, сотрудник Центра и гражданин при обнаружении фактов вымогательства, взяточничества или злоупотребления служебным положением.

2. КАНАЛЫ СВЯЗИ:
• Горячая линия Центра: +998 77 363 38 36
• Официальный Telegram-бот: https://t.me/uzbamalakamakebot
• Официальный Email: uzbahuzuridagimarkaz@gmail.com
• Единый Call-центр Агентства по противодействию коррупции: 1253

3. ГОСУДАРСТВЕННЫЕ ГАРАНТИИ ЗАЩИТЫ:
В соответствии со статьей 28 Закона Республики Узбекистан «О противодействии коррупции», лица, сообщившие о коррупционных правонарушениях, находятся под защитой государства. Разглашение их персональных данных строго запрещено законом.`,
    en: `GUIDELINE ON REPORTING CORRUPTION INCIDENTS AND PROTECTION GUARANTEES

1. REPORTING CHANNELS:
• Hotline: +998 77 363 38 36
• Telegram Bot: https://t.me/uzbamalakamakebot
• Official Email: uzbahuzuridagimarkaz@gmail.com
• Anti-Corruption Agency Call Center: 1253

2. LEGAL PROTECTION GUARANTEES:
Pursuant to Article 28 of the Law 'On Combating Corruption', persons reporting corruption offenses are under full state protection. Whistleblower identity is kept strictly confidential.`
  }
};

export const AntiCorruption: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { antiCorruption } = useApp();
  const lang = (i18n.language || 'uz').substring(0, 2);

  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'documents' | 'contact'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [postSearchQuery, setPostSearchQuery] = useState<string>('');
  const [activeDocUrl, setActiveDocUrl] = useState<string | null>(null);
  const [activeInternalDoc, setActiveInternalDoc] = useState<any | null>(null);
  const [selectedPost, setSelectedPost] = useState<AntiCorruptionPost | null>(null);
  const [currentModalImgIdx, setCurrentModalImgIdx] = useState<number>(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Helper to get localized field
  const getLoc = (obj: any, field: string): string => {
    if (!obj) return '';
    if (lang === 'ru' && obj[`${field}_ru`]) return obj[`${field}_ru`];
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    return obj[field] || '';
  };

  const getDocTextContent = (doc: any): string => {
    if (!doc) return '';
    const directContent = getLoc(doc, 'content') || doc.content;
    if (directContent && directContent.trim()) return directContent;

    const cat = doc.category || '';
    if (INTERNAL_DOCS_FALLBACK[cat]) {
      return (INTERNAL_DOCS_FALLBACK[cat] as any)[lang] || INTERNAL_DOCS_FALLBACK[cat].uz;
    }
    return getLoc(doc, 'description') || doc.description || '';
  };

  const content = antiCorruption?.content;
  const rawDocuments = antiCorruption?.documents || [];
  const rawPosts = antiCorruption?.posts || [];

  // Helper to collect all images for a post
  const getPostAllImages = (post: AntiCorruptionPost | null): string[] => {
    if (!post) return [];
    const imgs: string[] = [];
    const main = post.image_url || post.image;
    if (main) imgs.push(main);
    if (post.images && post.images.length > 0) {
      post.images.forEach(img => {
        const u = img.image_url || img.image;
        if (u && !imgs.includes(u)) imgs.push(u);
      });
    }
    return imgs;
  };

  const handleOpenPost = (post: AntiCorruptionPost) => {
    setSelectedPost(post);
    setCurrentModalImgIdx(0);
    BackendAPI.incrementAntiCorruptionPostView(post.id).catch(() => {});
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return rawPosts.filter(post => {
      if (postSearchQuery.trim()) {
        const query = postSearchQuery.toLowerCase();
        const title = (getLoc(post, 'title') || post.title || '').toLowerCase();
        const body = (getLoc(post, 'content') || post.content || '').toLowerCase();
        return title.includes(query) || body.includes(query);
      }
      return true;
    });
  }, [rawPosts, postSearchQuery, lang]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return rawDocuments.filter(doc => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (getLoc(doc, 'title') || doc.title || '').toLowerCase();
        const desc = (getLoc(doc, 'description') || doc.description || '').toLowerCase();
        const num = (doc.document_number || '').toLowerCase();
        return title.includes(query) || desc.includes(query) || num.includes(query);
      }
      return true;
    });
  }, [rawDocuments, selectedCategory, searchQuery, lang]);

  const categories = [
    { id: 'all', label: lang === 'ru' ? 'Все документы' : lang === 'en' ? 'All Documents' : 'Barcha hujjatlar' },
    { id: 'law', label: lang === 'ru' ? 'Законодательство' : lang === 'en' ? 'Laws & Decrees' : 'Qonun hujjatlari' },
    { id: 'internal', label: lang === 'ru' ? 'Внутренние акты' : lang === 'en' ? 'Internal Regulations' : 'Ichki nizomlar' },
    { id: 'report', label: lang === 'ru' ? 'Отчёты' : lang === 'en' ? 'Reports' : 'Hisobotlar' },
    { id: 'memo', label: lang === 'ru' ? 'Памятки' : lang === 'en' ? 'Guidelines & Memos' : 'Eslatmalar' },
  ];

  const pageTitle = getLoc(content, 'title') || (lang === 'ru' ? 'Противодействие коррупции' : lang === 'en' ? 'Anti-Corruption Compliance' : 'Korrupsiyaga qarshi kurash');
  
  // Official Center Contacts (guaranteed accurate, overrides any legacy placeholders)
  const OFFICIAL_PHONE = '+998 77 363 38 36';
  const OFFICIAL_EMAIL = 'uzbahuzuridagimarkaz@gmail.com';
  const OFFICIAL_BOT = 'https://t.me/uzbamalakamakebot';

  const rawPhone = content?.hotline_phone || '';
  const hotline = (rawPhone && !rawPhone.includes('273-00-59') && !rawPhone.includes('(71)')) ? rawPhone : OFFICIAL_PHONE;

  const agencyHotline = content?.agency_hotline || '1253';

  const rawEmail = content?.email || '';
  const email = (rawEmail && !rawEmail.includes('edu.uz') && !rawEmail.includes('umail.uz')) ? rawEmail : OFFICIAL_EMAIL;

  const rawBot = content?.telegram_bot || '';
  const telegramBot = (rawBot && rawBot.startsWith('https://t.me/')) ? rawBot : OFFICIAL_BOT;

  const rawOfficerPhone = content?.officer_phone || '';
  const officerPhone = (rawOfficerPhone && !rawOfficerPhone.includes('273-00-59') && !rawOfficerPhone.includes('(71)')) ? rawOfficerPhone : OFFICIAL_PHONE;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-semibold mb-6 border border-blue-400/30 backdrop-blur-sm">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>{lang === 'ru' ? 'Честность и прозрачность' : lang === 'en' ? 'Integrity and Transparency' : 'Halollik va Shaffoflik'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {pageTitle}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
              {lang === 'ru'
                ? 'Система мер по предупреждению и противодействию коррупции в Центре переподготовки и повышения квалификации при Академии художеств Узбекистана.'
                : lang === 'en'
                ? 'System of comprehensive measures for the prevention and combat of corruption at the Center under the Academy of Arts of Uzbekistan.'
                : 'O‘zbekiston Badiiy akademiyasi huzuridagi Markazda korrupsiyaviy holatlarning har qanday ko‘rinishiga nisbatan murosasiz muhitni ta’minlash tizimi.'}
            </p>

            {/* Quick Hotline Pill */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <PhoneCall size={18} />
                <span>{lang === 'ru' ? 'Горячая линия' : lang === 'en' ? 'Hotline' : 'Ishonch telefoni'}: {hotline}</span>
              </a>

              <Link
                to="/virtual-qabulxona/murojaat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all"
              >
                <Send size={18} className="text-blue-400" />
                <span>{lang === 'ru' ? 'Сообщить о факте коррупции' : lang === 'en' ? 'Report a violation' : 'Korrupsiya haqida xabar berish'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="flex justify-start sm:justify-center lg:justify-start gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 no-scrollbar px-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                activeTab === 'overview'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale size={16} />
              <span>{lang === 'ru' ? 'Политика и принципы' : lang === 'en' ? 'Policy & Goals' : 'Siyosat va tamoyillar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                activeTab === 'posts'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Megaphone size={16} />
              <span>{lang === 'ru' ? 'Мероприятия и дела' : lang === 'en' ? 'Events & Activities' : 'Tadbirlar va amaliy ishlar'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {rawPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                activeTab === 'documents'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText size={16} />
              <span>{lang === 'ru' ? 'Нормативные документы' : lang === 'en' ? 'Regulations & Laws' : 'Me’yoriy hujjatlar'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'documents' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {rawDocuments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                activeTab === 'contact'
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PhoneCall size={16} />
              <span>{lang === 'ru' ? 'Каналы связи и доверия' : lang === 'en' ? 'Reporting Channels' : 'Aloqa va ishonch kanallari'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        {/* TAB 1: OVERVIEW & POLICY */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Intro Content */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
                <ShieldAlert className="text-blue-700" size={24} />
                <span>{lang === 'ru' ? 'Антикоррупционная политика Центра' : lang === 'en' ? 'Center Anti-Corruption Policy' : 'Markazning korrupsiyaga qarshi siyosati'}</span>
              </h2>

              <div 
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(getLoc(content, 'intro_text') || (content?.intro_text || '')) 
                }}
              />

              {/* Policy Goals */}
              {((content && getLoc(content, 'policy_goals')) || content?.policy_goals) && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-blue-900">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>{lang === 'ru' ? 'Основные цели и задачи' : lang === 'en' ? 'Core Objectives and Tasks' : 'Asosiy maqsad va vazifalar'}</span>
                  </h3>
                  <div className="space-y-3">
                    {(getLoc(content, 'policy_goals') || content?.policy_goals || '').split(/\r?\n/).filter(line => line.trim()).map((goal, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{goal.replace(/^•\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Officer Card */}
            {content?.officer_name && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <UserCheck className="text-indigo-600" size={22} />
                  <span>{lang === 'ru' ? 'Ответственное лицо по комплаенс-контролю' : lang === 'en' ? 'Compliance Control Officer' : 'Komplayens-nazorat bo‘yicha mas’ul xodim'}</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {content.officer_photo_url ? (
                    <img
                      src={content.officer_photo_url}
                      alt={getLoc(content, 'officer_name')}
                      className="w-32 h-36 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <UserCheck size={44} />
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {getLoc(content, 'officer_name') || content.officer_name}
                    </h4>
                    <p className="text-sm font-medium text-slate-600">
                      {getLoc(content, 'officer_position') || content.officer_position}
                    </p>

                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Phone size={16} className="text-blue-600 shrink-0" />
                        <span>{officerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Clock size={16} className="text-blue-600 shrink-0" />
                        <span>{content.reception_hours || 'Dushanba - Juma: 09:00 - 17:00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POSTS / ACTIVITIES */}
        {activeTab === 'posts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Search bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="text-blue-700" size={20} />
                  <span>{lang === 'ru' ? 'Антикоррупционные мероприятия и публикации' : lang === 'en' ? 'Anti-Corruption Events and Articles' : 'Tadbirlar, seminarlar va amaliy ishlar'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ru' ? `Всего публикаций: ${rawPosts.length}` : lang === 'en' ? `Total posts: ${rawPosts.length}` : `Jami e'lon qilingan ishlar: ${rawPosts.length} ta`}
                </p>
              </div>

              {/* Search Field */}
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={postSearchQuery}
                  onChange={e => setPostSearchQuery(e.target.value)}
                  placeholder={lang === 'ru' ? 'Поиск публикации...' : lang === 'en' ? 'Search posts...' : 'Postlarni qidirish...'}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Posts Cards Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <Megaphone size={48} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">
                  {lang === 'ru' ? 'Публикации пока не добавлены' : lang === 'en' ? 'No posts yet' : 'Hozircha e’lon qilingan postlar mavjud emas'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ru' ? 'Новые материалы появятся здесь по мере проведения мероприятий' : lang === 'en' ? 'New event reports will appear here soon' : 'Yangi tadbirlar va amaliy ishlar bu yerda e’lon qilib boriladi'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => {
                  const title = getLoc(post, 'title') || post.title;
                  const postContent = getLoc(post, 'content') || post.content;
                  const allImgs = getPostAllImages(post);
                  const mainImg = allImgs[0];

                  return (
                    <div
                      key={post.id}
                      onClick={() => handleOpenPost(post)}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                    >
                      <div>
                        {/* Media Thumbnail */}
                        {mainImg ? (
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                            <img
                              src={mainImg}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {allImgs.length > 1 && (
                              <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                                <Images size={13} />
                                +{allImgs.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="relative aspect-[16/10] bg-slate-100/90 border-b border-slate-200/60 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 select-none">
                            <ImageOff size={34} strokeWidth={1.5} className="text-slate-300" />
                            <span className="text-xs font-semibold text-slate-400">
                              {lang === 'ru' ? 'Фото не загружено' : lang === 'en' ? 'Image not uploaded' : 'Rasm yuklanmagan'}
                            </span>
                          </div>
                        )}

                        {/* Content Preview */}
                        <div className="p-5">
                          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2.5">
                            <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-semibold border border-blue-100/60">
                              <Calendar size={13} />
                              {post.date || '2025'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Eye size={13} />
                              {post.views_count || 0}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                            {title}
                          </h4>

                          {postContent && (
                            <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {postContent}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="px-5 pb-5 pt-0">
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700 group-hover:text-blue-900 flex items-center gap-1.5 transition-colors">
                            <span>{lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'Read more' : 'Batafsil o‘qish'}</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ru' ? 'Поиск документа...' : lang === 'en' ? 'Search document...' : 'Hujjatni qidirish...'}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Document Cards List */}
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">
                  {lang === 'ru' ? 'Документы не найдены' : lang === 'en' ? 'No documents found' : 'Hujjatlar topilmadi'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ru' ? 'Попробуйте изменить параметры поиска' : lang === 'en' ? 'Try adjusting your search criteria' : 'Qidiruv parametrlarini o‘zgartirib ko‘ring'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map(doc => {
                  const title = getLoc(doc, 'title') || doc.title;
                  const desc = getLoc(doc, 'description') || doc.description;
                  const fileUrl = doc.file_url || doc.file;
                  const hasExternal = Boolean(doc.external_url);

                  const textContent = getDocTextContent(doc);
                  const isActualFile = Boolean(fileUrl && (fileUrl.split('?')[0].toLowerCase().endsWith('.pdf') || fileUrl.includes('/media/')));

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          if (hasExternal) {
                            window.open(doc.external_url, '_blank', 'noopener,noreferrer');
                          } else if (textContent) {
                            setActiveInternalDoc(doc);
                          } else if (isActualFile) {
                            setActiveDocUrl(fileUrl);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            doc.category === 'law'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                              : doc.category === 'internal'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          }`}>
                            {doc.document_number || (doc.category === 'law' ? 'Qonun' : 'Nizom')}
                          </span>

                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            {doc.date || '2025'}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h4>

                        {desc && (
                          <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {hasExternal && (
                            <a
                              href={doc.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold text-xs transition-colors border border-blue-200/60"
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink size={14} className="text-blue-600" />
                              <span>{lang === 'ru' ? 'Открыть на Lex.uz' : lang === 'en' ? 'Read on Lex.uz' : 'Lex.uz da to‘liq o‘qish'}</span>
                            </a>
                          )}

                          {textContent && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setActiveInternalDoc(doc);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors border border-emerald-200/60 cursor-pointer"
                            >
                              <BookOpen size={14} className="text-emerald-600" />
                              <span>{lang === 'ru' ? 'Читать текст' : lang === 'en' ? 'Read document' : 'Hujjat matnini o‘qish'}</span>
                            </button>
                          )}

                          {isActualFile && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setActiveDocUrl(fileUrl);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Eye size={14} className="text-blue-600" />
                              <span>{lang === 'ru' ? 'Просмотр (PDF)' : lang === 'en' ? 'Preview (PDF)' : 'Ko‘rish (PDF)'}</span>
                            </button>
                          )}
                        </div>

                        {isActualFile && (
                          <a
                            href={fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors ml-auto"
                            onClick={e => e.stopPropagation()}
                          >
                            <Download size={14} />
                            <span>Yuklab olish</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT & REPORTING */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Reporting Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotline 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                    <PhoneCall size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Горячая линия Центра' : lang === 'en' ? 'Center Hotline' : 'Markaz Ishonch telefoni'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Прямой телефон доверия' : lang === 'en' ? 'Direct reporting line' : 'To‘g‘ridan-to‘g‘ri ishonch raqami'}
                  </p>
                </div>
                <a
                  href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-black text-blue-900 hover:text-blue-700 transition-colors py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50"
                >
                  {hotline}
                </a>
              </div>

              {/* Agency Hotline 1253 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Call-центр Агентства' : lang === 'en' ? 'Agency Call Center' : 'Korrupsiyaga qarshi agentlik'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Республиканский колл-центр' : lang === 'en' ? 'Republican national call center' : 'Respublika qisqa raqami'}
                  </p>
                </div>
                <a
                  href={`tel:${agencyHotline}`}
                  className="text-2xl font-black text-amber-600 hover:text-amber-700 transition-colors py-2 px-3 rounded-xl bg-amber-50"
                >
                  {agencyHotline}
                </a>
              </div>

              {/* Online Form Button */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {lang === 'ru' ? 'Онлайн обращение' : lang === 'en' ? 'Online Reporting' : 'Onlayn murojaat'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'ru' ? 'Через виртуальную приёмную' : lang === 'en' ? 'Via Virtual Reception' : 'Virtual qabulxona orqali ariza'}
                  </p>
                </div>
                <Link
                  to="/virtual-qabulxona/murojaat"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all"
                >
                  <span>Murojaat yuborish</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Additional Contact Channels Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold">
                  {lang === 'ru' ? 'Конфиденциальность гарантируется' : lang === 'en' ? 'Confidentiality Guaranteed' : 'Murojaatchi shaxsi sir saqlanadi'}
                </h3>
                <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                  {lang === 'ru'
                    ? 'В соответствии с законодательством Республики Узбекистан, лицам, сообщившим о фактах коррупции, гарантируется правовая защита и государственная поддержка.'
                    : lang === 'en'
                    ? 'In accordance with national legislation, individuals reporting corruption violations are guaranteed legal protection and confidentiality.'
                    : 'O‘zbekiston Respublikasining «Korrupsiyaga qarshi kurashish to‘g‘risida»gi Qonuniga muvofiq, korrupsiyaviy huquqbuzarliklar haqida xabar bergan shaxslarning xavfsizligi va huquqiy himoyasi qonun bilan kafolatlanadi.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                {telegramBot && (
                  <a
                    href={telegramBot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <Send size={16} />
                    <span>Telegram Bot</span>
                  </a>
                )}

                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  <Mail size={16} />
                  <span>{email}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Internal Document Full-Text Modal */}
      {activeInternalDoc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveInternalDoc(null)}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <BookOpen size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activeInternalDoc.document_number || 'Ichki nizom'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-lg truncate mt-0.5">
                    {getLoc(activeInternalDoc, 'title') || activeInternalDoc.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveInternalDoc(null)}
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-slate-500 cursor-pointer"
                  title="Yopish"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Text */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white text-slate-800">
              {/* Center Official Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-3 border border-blue-100">
                  <ShieldCheck size={14} className="text-blue-700" />
                  <span>O‘zbekiston Badiiy akademiyasi huzuridagi Markaz</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug max-w-2xl mx-auto">
                  {getLoc(activeInternalDoc, 'title') || activeInternalDoc.title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <Clock size={13} />
                  <span>Qabul qilingan sana: {activeInternalDoc.date || '2025'}</span>
                </p>
              </div>

              {/* Text Body */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-700 font-normal">
                {getDocTextContent(activeInternalDoc)}
              </div>

              {/* Official Compliance Footer Box */}
              <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-600 shrink-0" />
                  <span>Ushbu hujjat ijrosi komplayens-nazorat xizmati tomonidan qat'iy nazorat qilinadi.</span>
                </div>
                <div className="font-semibold text-slate-800">
                  Ishonch telefoni: {hotline}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                onClick={() => setActiveInternalDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Megaphone size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <Calendar size={13} />
                      {selectedPost.date || '2025'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      {(selectedPost.views_count || 0) + 1} {lang === 'ru' ? 'просмотров' : lang === 'en' ? 'views' : 'ko‘rildi'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg truncate mt-0.5">
                    {getLoc(selectedPost, 'title') || selectedPost.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-slate-500 cursor-pointer"
                  title="Yopish"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-white text-slate-800">
              {/* Media Carousel / Gallery */}
              {(() => {
                const modalImages = getPostAllImages(selectedPost);
                if (modalImages.length === 0) return null;
                const activeImg = modalImages[currentModalImgIdx] || modalImages[0];

                return (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[460px] aspect-video sm:aspect-[16/10] w-full border border-slate-200 shadow-sm">
                      <img
                        src={activeImg}
                        alt={getLoc(selectedPost, 'title')}
                        className="max-w-full max-h-[460px] object-contain cursor-zoom-in transition-all duration-300"
                        onClick={() => setZoomedImage(activeImg)}
                      />
                      
                      {modalImages.length > 1 && (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setCurrentModalImgIdx(prev => (prev === 0 ? modalImages.length - 1 : prev - 1));
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setCurrentModalImgIdx(prev => (prev === modalImages.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-xs font-semibold">
                            {currentModalImgIdx + 1} / {modalImages.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails row */}
                    {modalImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                        {modalImages.map((imgUrl, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentModalImgIdx(i)}
                            className={`w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                              currentModalImgIdx === i ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Title & Date */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {getLoc(selectedPost, 'title') || selectedPost.title}
                </h2>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    <Calendar size={13} />
                    {selectedPost.date || '2025'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} />
                    {(selectedPost.views_count || 0) + 1} {lang === 'ru' ? 'просмотров' : lang === 'en' ? 'views' : 'ko‘rildi'}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-700 font-normal">
                {getLoc(selectedPost, 'content') || selectedPost.content}
              </div>

              {/* Hotline Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                  <span>Markazda korrupsiyaviy holatlarga nisbatan murosasiz munosabat amal qiladi.</span>
                </div>
                <div className="font-semibold text-slate-800">
                  Ishonch telefoni: {hotline}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <Link
                to="/virtual-qabulxona/murojaat"
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                <Send size={14} />
                <span>Murojaat yuborish</span>
              </Link>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      <ImageModal
        images={zoomedImage ? [zoomedImage] : []}
        initialIndex={0}
        isOpen={Boolean(zoomedImage)}
        onClose={() => setZoomedImage(null)}
      />

      {/* PDF Document Viewer Modal */}
      {activeDocUrl && (
        <DocumentViewer
          url={activeDocUrl}
          onClose={() => setActiveDocUrl(null)}
        />
      )}
    </div>
  );
};

export default AntiCorruption;
