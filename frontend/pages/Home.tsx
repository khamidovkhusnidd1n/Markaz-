import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ArrowRight, BookOpen, Users, Trophy, ChevronRight, Play, Star, MapPin, Mail, Phone, Calendar, Search, ArrowUpRight, GraduationCap, Globe, Palette, ShieldCheck, Gavel, ClipboardList, Award, TrendingUp, Zap, CheckCircle2, XCircle, FileText, Briefcase, Clock, Send, UserCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PDPlanRecord } from '../types';
import { NewsModal } from '../components/NewsModal';
import { getImageUrl, stripHtml } from '../utils';

// Animation hook for scroll reveal
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const formatDate = (dateStr: string | undefined, lang: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    if (lang === 'uz') {
      const uzbekMonths = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
      ];
      return `${d.getDate()} ${uzbekMonths[d.getMonth()]}, ${d.getFullYear()}`;
    }
    
    return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  } catch(e) {
    return dateStr;
  }
};

const Home: React.FC = () => {
  const { news, stats, pdPlans, aboutContent, artGallery, internationalPartners = [], internationalProjects = [] } = useApp();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.hash === '#contact' || params.get('section') === 'contact') {
      const element = document.getElementById('contact');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, location.search]);
  
  // Reestr state
  const [activeReestrTab, setActiveReestrTab] = useState<'mo' | 'qt'>('mo');
  const [docNumber, setDocNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{status: 'idle' | 'found' | 'not_found', data?: PDPlanRecord}>({status: 'idle'});
  
  const [newsCarouselIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // Statistics Modals state (1-modal va 2-modal oyna)
  const [activeStatsModal, setActiveStatsModal] = useState<'training' | 'international' | null>(null);
  const [intlModalTab, setIntlModalTab] = useState<'countries' | 'organizations' | 'projects'>('countries');
  
  const handleNewsClick = (item: any) => {
    setSelectedNews({
      ...item,
      views_count: (item.views_count || 0) + 1
    });
    import('../services/backend').then(({ BackendAPI }) => {
      BackendAPI.incrementNewsView(item.id).then(newCount => {
        item.views_count = newCount;
      }).catch(console.error);
    });
  };


  const artImages = (artGallery || []).filter((item) => item.imageUrl);
  const heroImages = artImages.length > 0 ? artImages : (aboutContent?.heroImages || []).filter((item) => item.imageUrl);

  // Hero carousel effect
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const defaultUzReportTexts: Record<string, string> = {
    section_badge: "KO'RSATKICHLAR VA HISOBOT",
    section_title: "Markaz faoliyati statistikasi",
    card1_badge: "O'quv faoliyati",
    card1_title: "Qayta tayyorlash va malaka oshirish faoliyati",
    card1_summary: "Mazkur markazda faoliyat davrida O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligining 284 nafar, Madaniyat vazirligining 740 nafar, Badiiy akademiya tasarrufidagi ta'lim muassasalaridan 578 nafar, kasbni rivojlantirishga yo'naltirilgan qisqa kurslarda 141 nafar, jami 1743 nafar pedagog va mutaxassis kadrlar malaka oshirishdi hamda 389 nafar pedagog kadrlar qayta tayyorlovdan o'tkazildi.",
    mo_total_label: "Jami malaka oshirganlar",
    mo_higher_edu_label: "Oliy ta'lim muassasalaridan",
    mo_culture_ministry_label: "O'zbekiston Respublikasi Madaniyat vazirligi tasarrufidagi ta'lim muassasalaridan",
    mo_art_academy_label: "O'zbekiston Badiiy akademiyasi tasarrufidagi ta'lim muassasalaridan",
    mo_short_courses_label: "Qisqa malaka oshirish kurslarida",
    qt_total_label: "Jami qayta tayyorlash kurslarida",
    qt_painting_label: "Rangtasvir (turlari bo'yicha)",
    qt_embroidery_label: "Badiiy kashtachilik usta-rassomi",
    qt_gold_embroidery_label: "Badiiy zardo'zlik usta-rassomi",
    card2_badge: "Xalqaro aloqalar",
    card2_title: "Xalqaro hamkorlik va xalqaro loyihalar",
    card2_summary: "Bugungi kunda Markaz tomonidan 10 ta xorijiy (Italiya, Xitoy, Gruziya, Belarus, Turkiya, Rossiya, Hindiston, Qozog'iston, Koreya, Ozarbayjon) mamlakatlarning 15 ta badiiy ta'limga ixtisoslashgan muassasalari bilan memorandumlar imzolandi va hamkorlik aloqalari yo'lga qo'yildi.",
    intl_countries_label: "Xorijiy mamlakatlar",
    intl_organizations_label: "Hamkor xorijiy tashkilotlar",
    intl_projects_label: "Xalqaro ilmiy-ijodiy loyihalar",
  };

  const resolveReportText = (backendVal: string | undefined, key: string): string => {
    const defUz = defaultUzReportTexts[key] || '';
    if (!backendVal || backendVal.trim() === '' || backendVal.trim() === defUz.trim()) {
      return t(`home.stats_report.${key}`, defUz);
    }
    return backendVal;
  };

  const translateCountryName = (countryName: string): string => {
    const lang = (i18n.language || 'uz').substring(0, 2);
    if (lang === 'uz') return countryName;
    const c = countryName.toLowerCase().trim();
    const translations: Record<string, { ru: string; en: string }> = {
      'italiya': { ru: 'Италия', en: 'Italy' },
      'xitoy': { ru: 'Китай', en: 'China' },
      'gruziya': { ru: 'Грузия', en: 'Georgia' },
      'belarus': { ru: 'Беларусь', en: 'Belarus' },
      'turkiya': { ru: 'Турция', en: 'Turkey' },
      'rossiya': { ru: 'Россия', en: 'Russia' },
      'hindiston': { ru: 'Индия', en: 'India' },
      "qozog'iston": { ru: 'Казахстан', en: 'Kazakhstan' },
      'qozogiston': { ru: 'Казахстан', en: 'Kazakhstan' },
      'koreya': { ru: 'Корея', en: 'South Korea' },
      'janubiy koreya': { ru: 'Южная Корея', en: 'South Korea' },
      'ozarbayjon': { ru: 'Азербайджан', en: 'Azerbaijan' },
      "o'zbekiston": { ru: 'Узбекистан', en: 'Uzbekistan' },
      'aqsh': { ru: 'США', en: 'USA' },
      'germaniya': { ru: 'Германия', en: 'Germany' },
      'fransiya': { ru: 'Франция', en: 'France' },
      'yaponiya': { ru: 'Япония', en: 'Japan' },
      'buyuk britaniya': { ru: 'Великобритания', en: 'United Kingdom' },
      'angliya': { ru: 'Англия', en: 'England' },
      'ispaniya': { ru: 'Испания', en: 'Spain' },
      "qirg'iziston": { ru: 'Кыргызстан', en: 'Kyrgyzstan' },
      'tojikiston': { ru: 'Таджикистан', en: 'Tajikistan' },
      'turkmaniston': { ru: 'Туркменистан', en: 'Turkmenistan' },
      'eron': { ru: 'Иран', en: 'Iran' },
      'misr': { ru: 'Египет', en: 'Egypt' },
      'malayziya': { ru: 'Малайзия', en: 'Malaysia' },
      'polsha': { ru: 'Польша', en: 'Poland' },
    };
    const match = translations[c];
    if (match) return lang === 'ru' ? match.ru : match.en;
    return countryName;
  };

  const rawMoHigherEdu = Number(stats?.reportDetails?.moHigherEdu ?? 284);
  const rawMoCultureMinistry = Number(stats?.reportDetails?.moCultureMinistry ?? 740);
  const rawMoArtAcademy = Number(stats?.reportDetails?.moArtAcademy ?? 578);
  const rawMoShortCourses = Number(stats?.reportDetails?.moShortCourses ?? 141);
  const computedMoSum = rawMoHigherEdu + rawMoCultureMinistry + rawMoArtAcademy + rawMoShortCourses;

  const rawQtPainting = Number(stats?.reportDetails?.qtPainting ?? 0);
  const rawQtEmbroidery = Number(stats?.reportDetails?.qtEmbroidery ?? 0);
  const rawQtGoldEmbroidery = Number(stats?.reportDetails?.qtGoldEmbroidery ?? 0);
  const computedQtSum = rawQtPainting + rawQtEmbroidery + rawQtGoldEmbroidery;

  const reportDetails = {
    sectionBadge: resolveReportText(stats?.reportDetails?.sectionBadge, 'section_badge'),
    sectionTitle: resolveReportText(stats?.reportDetails?.sectionTitle, 'section_title'),
    card1Badge: resolveReportText(stats?.reportDetails?.card1Badge, 'card1_badge'),
    card1Title: resolveReportText(stats?.reportDetails?.card1Title, 'card1_title'),
    card1Summary: resolveReportText(stats?.reportDetails?.card1Summary, 'card1_summary'),
    moTotalLabel: resolveReportText(stats?.reportDetails?.moTotalLabel, 'mo_total_label'),
    moTotal: computedMoSum > 0 ? computedMoSum : Number(stats?.reportDetails?.moTotal ?? 1743),
    moHigherEduLabel: resolveReportText(stats?.reportDetails?.moHigherEduLabel, 'mo_higher_edu_label'),
    moHigherEdu: rawMoHigherEdu,
    moCultureMinistryLabel: resolveReportText(stats?.reportDetails?.moCultureMinistryLabel, 'mo_culture_ministry_label'),
    moCultureMinistry: rawMoCultureMinistry,
    moArtAcademyLabel: resolveReportText(stats?.reportDetails?.moArtAcademyLabel, 'mo_art_academy_label'),
    moArtAcademy: rawMoArtAcademy,
    moShortCoursesLabel: resolveReportText(stats?.reportDetails?.moShortCoursesLabel, 'mo_short_courses_label'),
    moShortCourses: rawMoShortCourses,
    qtTotalLabel: resolveReportText(stats?.reportDetails?.qtTotalLabel, 'qt_total_label'),
    qtTotal: computedQtSum > 0 ? computedQtSum : Number(stats?.reportDetails?.qtTotal ?? 389),
    qtPaintingLabel: resolveReportText(stats?.reportDetails?.qtPaintingLabel, 'qt_painting_label'),
    qtPainting: rawQtPainting,
    qtEmbroideryLabel: resolveReportText(stats?.reportDetails?.qtEmbroideryLabel, 'qt_embroidery_label'),
    qtEmbroidery: rawQtEmbroidery,
    qtGoldEmbroideryLabel: resolveReportText(stats?.reportDetails?.qtGoldEmbroideryLabel, 'qt_gold_embroidery_label'),
    qtGoldEmbroidery: rawQtGoldEmbroidery,
    card2Badge: resolveReportText(stats?.reportDetails?.card2Badge, 'card2_badge'),
    card2Title: resolveReportText(stats?.reportDetails?.card2Title, 'card2_title'),
    card2Summary: resolveReportText(stats?.reportDetails?.card2Summary, 'card2_summary'),
    intlCountriesLabel: resolveReportText(stats?.reportDetails?.intlCountriesLabel, 'intl_countries_label'),
    intlCountriesCount: stats?.reportDetails?.intlCountriesCount ?? 10,
    intlCountriesList: stats?.reportDetails?.intlCountriesList || "Italiya\nXitoy\nGruziya\nBelarus\nTurkiya\nRossiya\nHindiston\nQozog'iston\nKoreya\nOzarbayjon",
    intlOrganizationsLabel: resolveReportText(stats?.reportDetails?.intlOrganizationsLabel, 'intl_organizations_label'),
    intlOrganizationsCount: stats?.reportDetails?.intlOrganizationsCount ?? 0,
    intlOrganizationsSummary: stats?.reportDetails?.intlOrganizationsSummary || "",
    intlOrganizationsList: stats?.reportDetails?.intlOrganizationsList || "",
    intlProjectsLabel: resolveReportText(stats?.reportDetails?.intlProjectsLabel, 'intl_projects_label'),
    intlProjectsCount: stats?.reportDetails?.intlProjectsCount ?? 0,
    intlProjectsList: stats?.reportDetails?.intlProjectsList || "",
  };

  const getCountryFlagUrl = (countryName: string): string | null => {
    const c = countryName.toLowerCase().trim();
    const map: Record<string, string> = {
      'italiya': 'it', 'italy': 'it', 'италия': 'it',
      'xitoy': 'cn', 'china': 'cn', 'китай': 'cn',
      'gruziya': 'ge', 'georgia': 'ge', 'грузия': 'ge',
      'belarus': 'by', 'belarussiya': 'by', 'беларусь': 'by',
      'turkiya': 'tr', 'turkey': 'tr', 'турция': 'tr',
      'rossiya': 'ru', 'russia': 'ru', 'россия': 'ru',
      'hindiston': 'in', 'india': 'in', 'индия': 'in',
      "qozog'iston": 'kz', 'qozogiston': 'kz', 'qozoqiston': 'kz', 'kazakhstan': 'kz', 'казахстан': 'kz',
      'koreya': 'kr', 'janubiy koreya': 'kr', 'korea': 'kr', 'корея': 'kr',
      'ozarbayjon': 'az', 'azerbaijan': 'az', 'азербайджан': 'az',
      "o'zbekiston": 'uz', 'uzbekistan': 'uz',
      'aqsh': 'us', 'usa': 'us',
      'germaniya': 'de', 'germany': 'de',
      'fransiya': 'fr', 'france': 'fr',
      'yaponiya': 'jp', 'japan': 'jp',
      'buyuk britaniya': 'gb', 'angliya': 'gb', 'uk': 'gb',
      'ispaniya': 'es', 'spain': 'es',
      "qirg'iziston": 'kg', 'kyrgyzstan': 'kg',
      'tojikiston': 'tj', 'tajikistan': 'tj',
      'turkmaniston': 'tm', 'turkmenistan': 'tm',
      'eron': 'ir', 'iran': 'ir',
      'misr': 'eg', 'egypt': 'eg',
      'malayziya': 'my', 'malaysia': 'my',
      'polsha': 'pl', 'poland': 'pl',
    };
    for (const [key, code] of Object.entries(map)) {
      if (c.includes(key)) {
        return `https://flagcdn.com/w40/${code}.png`;
      }
    }
    return null;
  };

  const countriesArray = reportDetails.intlCountriesList
    .split(/[\n,;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const customOrgsArray = reportDetails.intlOrganizationsList
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  const customProjectsArray = reportDetails.intlProjectsList
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  const displayedCountriesCount = countriesArray.length;
  const displayedOrgsCount = customOrgsArray.length;
  const displayedProjectsCount = customProjectsArray.length;

  const safeStudentsCount = stats?.studentsCount || [];
  const sumMalaka = safeStudentsCount.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const sumQayta = safeStudentsCount.reduce((sum, item) => sum + (Number(item.retraining) || 0), 0);
  const totalMalaka = reportDetails.moTotal > 0 ? reportDetails.moTotal : sumMalaka;
  const totalQayta = reportDetails.qtTotal > 0 ? reportDetails.qtTotal : sumQayta;
  const totalOverall = totalMalaka + totalQayta;

  const distributionData = [
    { name: t('home.charts_mo'), value: totalMalaka, color: '#10b981' },
    { name: t('home.charts_qt'), value: totalQayta, color: '#3b82f6' },
  ];

  const yearlyData = safeStudentsCount.map(item => ({
    name: item.year,
    malaka: item.count || 0,
    qayta: item.retraining || 0
  }));


  const handleReestrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    const targetType = activeReestrTab === 'mo' ? 'MO' : 'QT';
    const searchNum = docNumber.trim();
    
    // Filter by selected type (MO or QT)
    const typeRecords = pdPlans.filter(p => 
      (p.recordType || '').toUpperCase() === targetType ||
      (p.series || '').toUpperCase() === targetType
    );
    
    // Try exact match first
    let found = typeRecords.find(p => p.number.trim() === searchNum);
    
    // Try case-insensitive
    if (!found) {
      found = typeRecords.find(p => p.number.toLowerCase().trim() === searchNum.toLowerCase());
    }
    
    // Try ending match
    if (!found) {
      found = typeRecords.find(p => p.number.trim().endsWith(searchNum));
    }
    
    // Try contains
    if (!found) {
      found = typeRecords.find(p => p.number.includes(searchNum));
    }

    if (found) {
      setSearchResult({status: 'found', data: found});
    } else {
      setSearchResult({status: 'not_found'});
    }
  };

  const usefulLinks = [
    { name: t('home.links_distance_edu'), url: "https://mt.uzbamalaka.uz/", icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { name: t('home.links_art_academy'), url: "https://art-academy.uz/", image: "/logos/badiiy_akademiya.png" },
    { name: "MY.BIMM.UZ", url: "https://my.bimm.uz/home", image: "/logos/mybimm.png", cover: true },
    { name: "LEX.UZ", url: "https://lex.uz/uz/", image: "/logos/lexuz.png" },
    { name: t('home.links_forms'), url: "https://form.uzbamalaka.uz", icon: <ClipboardList size={32} />, color: "bg-gradient-to-br from-violet-500 to-purple-700" },
    { name: t('menu.attendance'), url: "https://davomat.uzbamalaka.uz/", icon: <UserCheck size={32} />, color: "bg-gradient-to-br from-emerald-500 to-green-700" },
  ];

  // Scroll reveal sections
  const statsReveal = useScrollReveal();
  const reestrReveal = useScrollReveal();
  const chartsReveal = useScrollReveal();
  const newsReveal = useScrollReveal();
  const linksReveal = useScrollReveal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[85vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black overflow-hidden">
          {heroImages.map((img, idx) => (
            <img 
              key={idx}
              src={getImageUrl(img.imageUrl)} 
              alt="Hero" 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${
                idx === heroIndex ? 'translate-x-0' : 
                idx === (heroIndex - 1 + heroImages.length) % heroImages.length ? '-translate-x-full' : 'translate-x-full'
              }`}
            />
          ))}
          {aboutContent?.heroVideoUrl && (
            <a
              href={aboutContent?.heroVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-6 top-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md border border-white/20 flex items-center gap-2 z-20"
            >
              <Play size={16} className="fill-white" /> {t('home.banner_video')}
            </a>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-white mt-10">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight drop-shadow-xl">
              {t('home.hero_title_1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-none">{t('home.hero_title_span')}</span> {t('home.hero_title_2')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl font-light">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-3">
                {t('home.details')}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/students" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2">
                <Users size={20} /> {t('home.listeners')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section 
        ref={statsReveal.ref}
        className={`container mx-auto px-6 -mt-20 relative z-20 transition-all duration-1000 ${
          statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: t('home.stats_total_pedagogs'), value: stats?.totalPedagogs || 0, icon: <Users size={24} />, gradient: 'from-slate-700 to-slate-900' },
            { label: t('home.stats_professors'), value: stats?.professors || 0, icon: <GraduationCap size={24} />, gradient: 'from-blue-500 to-indigo-600' },
            { label: t('home.stats_dotsents'), value: stats?.dotsents || 0, icon: <Users size={24} />, gradient: 'from-emerald-500 to-teal-600' },
            { label: t('home.stats_academics'), value: stats?.academics || 0, icon: <Award size={24} />, gradient: 'from-amber-500 to-orange-600' },
            { label: t('home.stats_potential'), value: `${stats?.potential || 0}%`, icon: <TrendingUp size={24} />, gradient: 'from-purple-500 to-pink-600' },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REESTR MODULE - with MO/QT Selection */}
      <section 
        ref={reestrReveal.ref}
        className={`container mx-auto px-6 py-24 transition-all duration-1000 ${
          reestrReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <FileText size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-600">{t('home.reestr_online_check')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t('home.reestr_title')}</h2>
            <p className="text-lg text-slate-500">{t('home.reestr_subtitle')}</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            {/* Type Selection Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-100">
              <button 
                onClick={() => { setActiveReestrTab('mo'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`relative py-6 px-6 text-center transition-all ${
                  activeReestrTab === 'mo' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all ${
                  activeReestrTab === 'mo' 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Award size={28} />
                </div>
                <p className="font-black text-lg">{t('students.tab_mo')}</p>
                <p className="text-xs font-medium mt-1 opacity-70">{t('home.charts_mo')}</p>
                {activeReestrTab === 'mo' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                )}
              </button>
              
              <button 
                onClick={() => { setActiveReestrTab('qt'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`relative py-6 px-6 text-center transition-all ${
                  activeReestrTab === 'qt' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all ${
                  activeReestrTab === 'qt' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Briefcase size={28} />
                </div>
                <p className="font-black text-lg">{t('students.tab_qt')}</p>
                <p className="text-xs font-medium mt-1 opacity-70">{t('home.charts_qt')}</p>
                {activeReestrTab === 'qt' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                )}
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleReestrSearch} className="p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {activeReestrTab === 'mo' ? t('home.reestr_cert_number_label') : t('home.reestr_diplom_number_label')}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg ${
                      activeReestrTab === 'mo' ? 'text-emerald-500' : 'text-blue-500'
                    }`}>
                      {activeReestrTab === 'mo' ? 'MO' : 'QT'}
                    </span>
                    <input 
                      type="text" 
                      placeholder="000831" 
                      className="w-full pl-16 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-700 font-bold text-xl outline-none focus:border-blue-500 transition-all"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className={`px-10 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl ${
                    activeReestrTab === 'mo' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30'
                  }`}
                >{t('students.search_btn')}</button>
              </div>
            </form>

            {/* Search Result */}
            {searchResult.status !== 'idle' && (
              <div className="px-8 pb-8 animate-fade-in-up">
                {searchResult.status === 'found' && searchResult.data ? (
                  <div className={`p-6 rounded-2xl ${
                    searchResult.data.recordType === 'QT' ? 'bg-blue-50' : 'bg-emerald-50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        searchResult.data.recordType === 'QT' ? 'bg-blue-500' : 'bg-emerald-500'
                      } text-white`}>
                        <CheckCircle2 size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h4 className="text-2xl font-black text-slate-900">{searchResult.data.fullName}</h4>
                          <span className={`px-3 py-1 text-white text-xs font-black rounded-full ${
                            searchResult.data.recordType === 'QT' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}>{t('home.result_valid')}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { label: t('home.result_doc_type'), value: searchResult.data.recordType === 'QT' ? t('home.result_qt_diploma') : t('home.result_mo_certificate') },
                            { label: t('home.result_series_number'), value: `${searchResult.data.series} ${searchResult.data.number}` },
                            { label: t('home.result_workplace'), value: searchResult.data.workplace || '-' },
                            { label: t('home.result_direction'), value: searchResult.data.courseType || '-' },
                            { label: t('home.result_duration'), value: searchResult.data.duration || '-' },
                          ].map((item, idx) => (
                            <div key={idx}>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">{item.label}</p>
                              <p className="text-sm font-bold text-slate-700">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-red-50 rounded-2xl text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500 text-white flex items-center justify-center">
                      <XCircle size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{t('sci_potential.no_data')}</h4>
                    <p className="text-slate-500 mb-4">{t('home.result_not_found_desc')}</p>
                    <button 
                      onClick={() => setSearchResult({status: 'idle'})} 
                      className="text-red-600 font-bold text-sm hover:underline"
                    >{t('students.retry')}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ALOHIDA BO'LIM: Markaz faoliyati statistikasi va xalqaro aloqalar (Umumiy taqsimotdan yuqorida) */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="container mx-auto px-6">
          {/* Bo'lim sarlavhasi */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800 mb-2">
                {reportDetails.sectionBadge}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {reportDetails.sectionTitle}
              </h2>
            </div>

            {/* Yuqori tezkor ko'rsatkichlar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setActiveStatsModal('training')}
                className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm text-left transition-colors"
              >
                <p className="text-[11px] font-semibold text-slate-500">{t('home.charts_mo')}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {reportDetails.moTotal} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_person')}</span>
                </p>
              </button>
              <button
                type="button"
                onClick={() => setActiveStatsModal('training')}
                className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 border-l-4 border-l-blue-600 shadow-sm text-left transition-colors"
              >
                <p className="text-[11px] font-semibold text-slate-500">{t('home.charts_qt')}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {reportDetails.qtTotal} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_person')}</span>
                </p>
              </button>
              <button
                type="button"
                onClick={() => { setIntlModalTab('countries'); setActiveStatsModal('international'); }}
                className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-600 shadow-sm text-left transition-colors"
              >
                <p className="text-[11px] font-semibold text-slate-500">{reportDetails.intlCountriesLabel}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {displayedCountriesCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                </p>
              </button>
              <button
                type="button"
                onClick={() => { setIntlModalTab('organizations'); setActiveStatsModal('international'); }}
                className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 border-l-4 border-l-slate-700 shadow-sm text-left transition-colors"
              >
                <p className="text-[11px] font-semibold text-slate-500">{reportDetails.intlOrganizationsLabel}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {displayedOrgsCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                </p>
              </button>
            </div>
          </div>

          {/* 2 ta Asosiy Panel: O'quv faoliyati va Xalqaro aloqalar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Chap panel (7 ustun): O'quv faoliyati */}
            <div
              onClick={() => setActiveStatsModal('training')}
              className="lg:col-span-7 group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        {reportDetails.card1Badge}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {reportDetails.card1Title}
                      </h3>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-200 group-hover:border-slate-900 transition-colors shrink-0">
                      {t('home.stats_report.detail_modal_btn')} <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {reportDetails.card1Summary && (
                    <p className="mb-6 text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-slate-300 whitespace-pre-line">
                      {reportDetails.card1Summary}
                    </p>
                  )}

                  {/* Ikki ustunli jadval ko'rinishidagi taqsimot */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* 1-ustun: Malaka oshirish */}
                    <div className="md:col-span-7 bg-slate-50/70 rounded-xl p-5 border border-slate-200/80">
                      <div className="flex items-baseline justify-between pb-3 mb-3 border-b border-slate-200">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">{t('home.stats_report.direction_1')}</span>
                          <h4 className="font-bold text-slate-900 text-base">{reportDetails.moTotalLabel}</h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-bold text-emerald-700 tabular-nums">{reportDetails.moTotal}</span>
                          <span className="ml-1 text-xs text-slate-500">{t('home.stats_report.unit_person')}</span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-200/70">
                        {[
                          { label: reportDetails.moHigherEduLabel, val: reportDetails.moHigherEdu },
                          { label: reportDetails.moCultureMinistryLabel, val: reportDetails.moCultureMinistry },
                          { label: reportDetails.moArtAcademyLabel, val: reportDetails.moArtAcademy },
                          { label: reportDetails.moShortCoursesLabel, val: reportDetails.moShortCourses },
                        ].map((row, idx) => {
                          const pct = reportDetails.moTotal > 0 ? Math.round((row.val / reportDetails.moTotal) * 100) : 0;
                          return (
                            <div key={idx} className="py-2.5 first:pt-1 last:pb-0">
                              <div className="flex items-center justify-between gap-3 text-xs md:text-sm">
                                <span className="text-slate-700 leading-snug">{row.label}</span>
                                <span className="font-bold text-slate-900 shrink-0 tabular-nums">
                                  {row.val} <span className="font-normal text-slate-500 text-xs">{t('home.stats_report.unit_person')}</span>
                                </span>
                              </div>
                              <div className="w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mt-1.5">
                                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2-ustun: Qayta tayyorlash */}
                    <div className="md:col-span-5 bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between pb-3 mb-3 border-b border-slate-200">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">{t('home.stats_report.direction_2')}</span>
                            <h4 className="font-bold text-slate-900 text-base">{reportDetails.qtTotalLabel}</h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-2xl font-bold text-blue-700 tabular-nums">{reportDetails.qtTotal}</span>
                            <span className="ml-1 text-xs text-slate-500">{t('home.stats_report.unit_person')}</span>
                          </div>
                        </div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{t('home.stats_report.by_directions')}</p>
                        <div className="divide-y divide-slate-200/70">
                          {[
                            { label: reportDetails.qtPaintingLabel, val: reportDetails.qtPainting },
                            { label: reportDetails.qtEmbroideryLabel, val: reportDetails.qtEmbroidery },
                            { label: reportDetails.qtGoldEmbroideryLabel, val: reportDetails.qtGoldEmbroidery },
                          ].map((qtRow, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs md:text-sm">
                              <span className="text-slate-700 leading-snug">{qtRow.label}</span>
                              {qtRow.val > 0 && (
                                <span className="font-bold text-slate-900 shrink-0 tabular-nums">
                                  {qtRow.val} <span className="font-normal text-slate-500 text-xs">{t('home.stats_report.unit_person')}</span>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">{t('home.stats_report.total_coverage')}</span>
                        <span className="text-base font-bold text-slate-900 tabular-nums">
                          {reportDetails.moTotal + reportDetails.qtTotal} {t('home.stats_report.unit_person')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                  <span>{t('home.stats_report.open_all_directions')}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* O'ng panel (5 ustun): Xalqaro aloqalar */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 flex flex-col justify-between">
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
                        {reportDetails.card2Badge}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                        {reportDetails.card2Title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIntlModalTab('countries'); setActiveStatsModal('international'); }}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-200 hover:border-slate-900 transition-colors shrink-0"
                    >
                      {t('home.stats_report.detail_modal_btn')} <ArrowUpRight size={14} />
                    </button>
                  </div>

                  {reportDetails.card2Summary && (
                    <p className="mb-6 text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-slate-300 whitespace-pre-line">
                      {reportDetails.card2Summary}
                    </p>
                  )}

                  {/* 3 ta Ko'rsatkich qatori */}
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => { setIntlModalTab('countries'); setActiveStatsModal('international'); }}
                      className="w-full text-left group/btn flex items-center justify-between px-4 py-3.5 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                          <Globe size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover/btn:text-blue-800 transition-colors">
                            {reportDetails.intlCountriesLabel}
                          </p>
                          <p className="text-xs text-slate-500">{t('home.stats_report.view_countries_list')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xl font-bold text-slate-900 tabular-nums">
                          {displayedCountriesCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                        </span>
                        <ChevronRight size={16} className="text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIntlModalTab('organizations'); setActiveStatsModal('international'); }}
                      className="w-full text-left group/btn flex items-center justify-between px-4 py-3.5 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover/btn:text-blue-800 transition-colors">
                            {reportDetails.intlOrganizationsLabel}
                          </p>
                          <p className="text-xs text-slate-500">{t('home.stats_report.memorandum_institutions')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xl font-bold text-slate-900 tabular-nums">
                          {displayedOrgsCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                        </span>
                        <ChevronRight size={16} className="text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIntlModalTab('projects'); setActiveStatsModal('international'); }}
                      className="w-full text-left group/btn flex items-center justify-between px-4 py-3.5 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                          <Trophy size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover/btn:text-blue-800 transition-colors">
                            {reportDetails.intlProjectsLabel}
                          </p>
                          <p className="text-xs text-slate-500">{t('home.stats_report.view_projects_list')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xl font-bold text-slate-900 tabular-nums">
                          {displayedProjectsCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                        </span>
                        <ChevronRight size={16} className="text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>

                  {/* Davlatlar bayroqlari ro'yxati */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('home.stats_report.partner_countries')}</p>
                      <span className="text-xs font-semibold text-slate-600">{displayedCountriesCount} {t('home.stats_report.unit_countries')}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {countriesArray.map((country, i) => {
                        const flagUrl = getCountryFlagUrl(country);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setIntlModalTab('countries'); setActiveStatsModal('international'); }}
                            className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200/80"
                          >
                            {flagUrl ? (
                              <img src={flagUrl} alt={country} className="w-5 h-3.5 object-cover rounded-[2px] shrink-0 border border-slate-200" />
                            ) : (
                              <Globe size={13} className="text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">{translateCountryName(country)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setIntlModalTab('countries'); setActiveStatsModal('international'); }}
                  className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <span>{t('home.stats_report.open_intl_modal')}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Diagrammalar: Umumiy taqsimot va Yillar kesimida (yuqoridagi ko'rsatkichlar bilan bir-biriga bog'langan) */}
          <div 
            ref={chartsReveal.ref}
            className={`mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 ${
              chartsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('home.charts_distribution')}</h3>
            <div className="relative h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                    {distributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-4xl font-black text-slate-900">{totalOverall}</span>
                <span className="text-sm text-slate-500">{t('home.charts_total')}</span>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              {distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('home.charts_by_years')}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Bar name={t('home.charts_mo')} dataKey="malaka" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar name={t('home.charts_qt')} dataKey="qayta" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* MODAL: Qayta tayyorlash va malaka oshirish faoliyati */}
      {activeStatsModal === 'training' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveStatsModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">{reportDetails.card1Badge}</span>
                  <h3 className="text-xl md:text-2xl font-black">{reportDetails.card1Title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveStatsModal(null)}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {reportDetails.card1Summary && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {reportDetails.card1Summary}
                </div>
              )}

              {/* Section 1: Malaka oshirish */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                  <span className="text-lg md:text-xl font-black text-slate-900">{reportDetails.moTotalLabel}:</span>
                  <span className="text-2xl md:text-3xl font-black text-emerald-600">{reportDetails.moTotal} {t('home.stats_report.unit_person')}</span>
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">{t('home.stats_report.including')}</p>
                <div className="space-y-3">
                  {[
                    { label: reportDetails.moHigherEduLabel, val: reportDetails.moHigherEdu, color: "bg-emerald-500" },
                    { label: reportDetails.moCultureMinistryLabel, val: reportDetails.moCultureMinistry, color: "bg-teal-500" },
                    { label: reportDetails.moArtAcademyLabel, val: reportDetails.moArtAcademy, color: "bg-cyan-500" },
                    { label: reportDetails.moShortCoursesLabel, val: reportDetails.moShortCourses, color: "bg-blue-500" },
                  ].map((item, idx) => {
                    const pct = reportDetails.moTotal > 0 ? Math.round((item.val / reportDetails.moTotal) * 100) : 0;
                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="text-sm md:text-base font-semibold text-slate-800">- {item.label}</span>
                          <span className="text-base md:text-lg font-black text-slate-900 shrink-0">{item.val} {t('home.stats_report.unit_person')}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Qayta tayyorlash */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                  <span className="text-lg md:text-xl font-black text-slate-900">{reportDetails.qtTotalLabel}:</span>
                  <span className="text-2xl md:text-3xl font-black text-blue-600">{reportDetails.qtTotal} {t('home.stats_report.unit_person')}</span>
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">{t('home.stats_report.including')}</p>
                <div className="space-y-3">
                  {[
                    { label: reportDetails.qtPaintingLabel, val: reportDetails.qtPainting },
                    { label: reportDetails.qtEmbroideryLabel, val: reportDetails.qtEmbroidery },
                    { label: reportDetails.qtGoldEmbroideryLabel, val: reportDetails.qtGoldEmbroidery },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                      <span className="text-sm md:text-base font-semibold text-slate-800">- {item.label}</span>
                      <span className="text-base md:text-lg font-black text-blue-700 shrink-0">
                        {item.val > 0 ? `${item.val} ${t('home.stats_report.unit_person')}` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xalqaro hamkorlik va xalqaro loyihalar */}
      {activeStatsModal === 'international' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveStatsModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">{reportDetails.card2Badge}</span>
                  <h3 className="text-xl md:text-2xl font-black">{reportDetails.card2Title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveStatsModal(null)}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* Interactive Tabs */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setIntlModalTab('countries')}
                className={`p-3 rounded-2xl font-bold text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${
                  intlModalTab === 'countries'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                }`}
              >
                <span>{displayedCountriesCount} {t('home.stats_report.unit_count')} {reportDetails.intlCountriesLabel.toLowerCase()}</span>
              </button>
              <button
                type="button"
                onClick={() => setIntlModalTab('organizations')}
                className={`p-3 rounded-2xl font-bold text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${
                  intlModalTab === 'organizations'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
                }`}
              >
                <span>{displayedOrgsCount} {t('home.stats_report.unit_count')} {reportDetails.intlOrganizationsLabel.toLowerCase()}</span>
              </button>
              <button
                type="button"
                onClick={() => setIntlModalTab('projects')}
                className={`p-3 rounded-2xl font-bold text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${
                  intlModalTab === 'projects'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                <span>{displayedProjectsCount} {t('home.stats_report.unit_count')} {reportDetails.intlProjectsLabel.toLowerCase()}</span>
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {intlModalTab === 'countries' && (
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">
                    {reportDetails.intlCountriesLabel} ({displayedCountriesCount} {t('home.stats_report.unit_count')}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {countriesArray.map((country, idx) => {
                      const flagUrl = getCountryFlagUrl(country);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-bold text-slate-800 shadow-sm"
                        >
                          {flagUrl ? (
                            <img src={flagUrl} alt={country} className="w-8 h-6 object-cover rounded shadow-sm shrink-0 border border-slate-200" />
                          ) : (
                            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <span className="text-sm md:text-base">{translateCountryName(country)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {intlModalTab === 'organizations' && (
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">
                    {reportDetails.intlOrganizationsLabel} ({displayedOrgsCount} {t('home.stats_report.unit_count')}):
                  </h4>
                  {reportDetails.intlOrganizationsSummary && (
                    <p className="text-sm text-slate-600 mb-4 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 whitespace-pre-line">
                      {reportDetails.intlOrganizationsSummary}
                    </p>
                  )}
                  <div className="space-y-3">
                    {customOrgsArray.length > 0 ? (
                      customOrgsArray.map((orgName, idx) => (
                        <div key={`custom-org-${idx}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm md:text-base">{orgName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                        {t('home.stats_report.no_data_zero')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {intlModalTab === 'projects' && (
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-4">
                    {reportDetails.intlProjectsLabel} ({displayedProjectsCount} {t('home.stats_report.unit_count')}):
                  </h4>
                  <div className="space-y-3">
                    {customProjectsArray.length > 0 ? (
                      customProjectsArray.map((projName, idx) => (
                        <div key={`custom-proj-${idx}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm md:text-base">{projName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                        {t('home.stats_report.no_data_zero')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* News Section - Featured + 3 Small */}
      <section 
        ref={newsReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-1000 ${
          newsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-12">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{t('news_list.badge')}</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">{t('home.news_title')}</h2>
        </div>
        
        {news.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Featured Card - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const mainItem = news[newsCarouselIndex];
                return (
                  <button onClick={() => handleNewsClick(mainItem)} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 w-full text-left flex flex-col">
                    <div className="relative w-full overflow-hidden shrink-0 aspect-video md:aspect-[21/9]">
                      <img 
                        src={mainItem.images?.[0]?.imageUrl || mainItem.image || '/placeholder.jpg'} 
                        alt={mainItem.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                      {mainItem.isImportant && (
                        <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase rounded-full flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>{t('news_detail.important')}</div>
                      )}
                    </div>
                    <div className="p-8 flex-1">
                      <span className="text-sm font-medium text-slate-400">{formatDate(mainItem.date, i18n.language)}</span>
                      <h3 className="text-3xl font-black text-slate-900 mt-3 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {mainItem.title}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 text-base mb-6">{stripHtml(mainItem.content)}</p>
                      <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all mt-auto">{t('news_list.read_more')}<ChevronRight size={20} />
                      </div>
                    </div>
                  </button>
                );
              })()}

              {news.length > 1 && (() => {
                const secondaryItem = news[(newsCarouselIndex + 1) % news.length];
                return (
                  <button onClick={() => handleNewsClick(secondaryItem)} className="group flex flex-col md:flex-row overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-md transition-all duration-500 hover:shadow-xl text-left w-full">
                    <div className="relative w-full h-64 md:h-auto md:min-h-[250px] md:w-2/5 shrink-0 overflow-hidden">
                      <img
                        src={secondaryItem.images?.[0]?.imageUrl || secondaryItem.image || '/placeholder.jpg'}
                        alt={secondaryItem.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 md:w-3/5 flex flex-col justify-center">
                      <span className="text-sm font-medium text-slate-400">{formatDate(secondaryItem.date, i18n.language)}</span>
                      <h3 className="mt-3 text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-600">
                        {secondaryItem.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-slate-600">{stripHtml(secondaryItem.content)}</p>
                      <div className="mt-5 flex items-center gap-2 font-bold text-blue-600">{t('news_list.read_more')}<ChevronRight size={18} />
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>

            {/* Small Cards - Right Side */}
            <div className="flex flex-col gap-6">
              {(() => {
                const smallCards = [
                  news[(newsCarouselIndex + 2) % news.length],
                  news[(newsCarouselIndex + 3) % news.length],
                  news[(newsCarouselIndex + 4) % news.length]
                ].filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index);
                return smallCards.map((item, idx) => (
                  <button onClick={() => handleNewsClick(item)} key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 text-left w-full flex flex-col">
                    <div className="relative w-full aspect-video overflow-hidden">
                      <img 
                        src={item.images?.[0]?.imageUrl || item.image || '/placeholder.jpg'} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-xs font-medium text-slate-400">{formatDate(item.date, i18n.language)}</span>
                      <h4 className="text-base font-black text-slate-900 mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 line-clamp-1 text-xs">{stripHtml(item.content)}</p>
                    </div>
                  </button>
                ));
              })()}
            </div>
          </div>
            <div className="flex justify-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 font-bold text-blue-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50"
              >{t('home.news_more_btn')}<ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">{t('home.news_no_news')}</p>
          </div>
        )}
      </section>

      {/* Useful Links Section */}
      <section
        ref={linksReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-1000 ${
          linksReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{t('home.links_resources')}</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">{t('home.links_useful')}</h2>
          </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {usefulLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {link.image ? (
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 bg-white overflow-hidden border border-slate-100`}>
                  <img src={link.image} alt={link.name} className={`w-full h-full ${link.cover ? 'object-cover' : 'object-contain p-1'}`} />
                </div>
              ) : (
                <div className={`w-16 h-16 ${link.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {link.icon}
                </div>
              )}
              <h3 className="text-sm font-black text-slate-900 text-center">{link.name}</h3>
            </a>
          ))}
        </div>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-6 pb-20">
        <div className="mb-10">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('home.contact_badge')}</span>
          <h2 className="mt-2 text-4xl font-black text-slate-900">{t('home.contact_our_address')}</h2>
        </div>
        <div className="grid gap-6 rounded-[2rem] bg-white p-4 shadow-lg lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.2224424363363!2d69.18002367657989!3d41.279141071286395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae895563fd58cd%3A0x2cf0b7618d787b0f!2sO&#39;zBA%20huzuridagi%20Markaz!5e0!3m2!1suz!2s!4v1711200000000!5m2!1suz!2s"
              title={t('home.contact_map_title')}
              className="h-full min-h-[400px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-8 text-white flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400 mb-6">{t('home.contact_info_title')}</p>
              
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-900 rounded-xl text-blue-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-450 text-slate-400">{t('home.contact_our_address')}</h4>
                    <p className="mt-1 text-sm text-slate-200 leading-relaxed">
                      {aboutContent?.address || t('layout.address_fallback')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-900 rounded-xl text-blue-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-450 text-slate-400">{t('home.contact_phones')}</h4>
                    <p className="mt-1 text-sm text-slate-200">
                      <a href="tel:+998773633836" className="hover:text-blue-450 transition-colors hover:text-blue-400 font-semibold">(+998 77) 363-38-36</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-900 rounded-xl text-blue-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-450 text-slate-400">{t('home.contact_emails')}</h4>
                    <p className="mt-1 text-sm text-slate-200 flex flex-col gap-0.5">
                      <a href="mailto:uzbamalakamarkaz@umail.uz" className="hover:text-blue-450 transition-colors hover:text-blue-400">uzbamalakamarkaz@umail.uz</a>
                      
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-900 rounded-xl text-blue-400 shrink-0">
                    <Send size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-450 text-slate-400">{t('home.contact_telegrams')}</h4>
                    <p className="mt-1 text-sm text-slate-200 flex flex-wrap gap-x-4 gap-y-1">
                      <a href="https://t.me/Uzbamarkaz_jurnali" target="_blank" rel="noopener noreferrer" className="hover:text-blue-450 transition-colors hover:text-blue-400">@Uzbamarkaz_jurnali</a>
                      <a href="https://t.me/badiiytalimvapedagogika" target="_blank" rel="noopener noreferrer" className="hover:text-blue-450 transition-colors hover:text-blue-400">@badiiytalimvapedagogika</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start border-t border-slate-800 pt-5 mt-5">
              <div className="p-3 bg-slate-900 rounded-xl text-blue-400 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('home.contact_work_hours')}</h4>
                <p className="mt-1 text-sm text-slate-200 font-semibold">{t('home.contact_work_hours_value')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Custom CSS for animations */}
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes scroll-down {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(8px); opacity: 0.5; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
          .animate-fade-in { animation: fade-in-up 0.5s ease-out forwards; }
          .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
          .animate-scroll-down { animation: scroll-down 1.5s ease-in-out infinite; }
        `}</style>

        {selectedNews && (
          <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />
        )}
    </div>
  );
};

export default Home;
