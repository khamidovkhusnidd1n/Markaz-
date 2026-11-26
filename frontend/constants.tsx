
import React from 'react';
import {
  Landmark,
  Network,
  UserCheck,
  UsersRound,
  ShieldAlert,
  MessageSquareText,
  FileCheck2,
  Layers,
  BarChart3,
  Workflow,
  Cpu,
  Globe2,
  GraduationCap,
  Sparkles,
  Scale,
  LibraryBig,
  BookOpenCheck,
  UserRoundCheck,
  CalendarRange,
  Palette,
  BadgeCheck,
  MonitorPlay,
  QrCode,
  FolderKanban,
  Newspaper,
  Megaphone,
  Images,
  Frame,
  Headset,
  Award,
  Building2,
} from 'lucide-react';

export const COLORS = {
  primary: '#0f172a', // Slate 900
  secondary: '#3b82f6', // Blue 500
  accent: '#f59e0b', // Amber 500
  success: '#10b981', // Emerald 500
  info: '#06b6d4', // Cyan 500
  chart: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
};

export type MenuItemType = {
  label: string;
  i18nKey?: string;
  path?: string;
  url?: string;
  icon?: React.ReactNode;
  children?: MenuItemType[];
};

export const MENU_ITEMS: MenuItemType[] = [
  {
    label: 'Markaz haqida',
    i18nKey: 'menu.about',
    icon: <Landmark size={17} strokeWidth={1.85} />,
    path: '#',
    children: [
      { label: 'Markaz haqida', path: '/about/info', i18nKey: 'menu.about', icon: <Building2 size={16} strokeWidth={1.85} /> },
      { label: 'Markaz tuzilmasi', path: '/about/structure', i18nKey: 'menu.structure', icon: <Network size={16} strokeWidth={1.85} /> },
      { label: 'Rahbariyat', path: '/about/leadership', i18nKey: 'menu.leadership', icon: <UserCheck size={16} strokeWidth={1.85} /> },
      { label: 'Markaziy apparat', path: '/about/staff', i18nKey: 'menu.staff', icon: <UsersRound size={16} strokeWidth={1.85} /> },
      { label: 'Korrupsiyaga qarshi kurash', path: '/anti-corruption', i18nKey: 'menu.anti_corruption', icon: <ShieldAlert size={16} strokeWidth={1.85} /> },
      { label: 'Virtual qabulxona', path: '/virtual-qabulxona/murojaat', i18nKey: 'menu.virtual_reception', icon: <MessageSquareText size={16} strokeWidth={1.85} /> },
      { label: 'Ariza yuborish', path: '/virtual-qabulxona/ariza', i18nKey: 'menu.submit_app', icon: <FileCheck2 size={16} strokeWidth={1.85} /> }
    ]
  },
  {
    label: "Bo'limlar",
    i18nKey: 'menu.departments',
    icon: <Layers size={17} strokeWidth={1.85} />,
    path: '#',
    children: [
      { label: 'Qayta tayyorlash va malaka oshirish monitoringi', path: '/departments/2', i18nKey: 'menu.monitoring', icon: <BarChart3 size={16} strokeWidth={1.85} /> },
      { label: "O'quv jarayonini tashkil etish", path: '/departments/3', i18nKey: 'menu.edu_process', icon: <Workflow size={16} strokeWidth={1.85} /> },
      { label: 'Matbuot va axborot texnologiyalari', path: '/departments/1', i18nKey: 'menu.it', icon: <Cpu size={16} strokeWidth={1.85} /> },
      { label: 'Xalqaro aloqalarni rivojlantirish', path: '/departments/4', i18nKey: 'menu.international', icon: <Globe2 size={16} strokeWidth={1.85} /> }
    ]
  },
  {
    label: "Ta'lim dasturlari",
    i18nKey: 'menu.programs',
    icon: <GraduationCap size={17} strokeWidth={1.85} />,
    children: [
      { label: 'Kurslar', path: '/courses', i18nKey: 'menu.courses', icon: <Sparkles size={16} strokeWidth={1.85} /> },
      { label: "O\u2018quv me\u2019yoriy hujjatlar", path: '/open-data?category=regulatory', i18nKey: 'menu.regulatory', icon: <Scale size={16} strokeWidth={1.85} /> },
      { label: 'Kutubxona', path: '/library', i18nKey: 'menu.library', icon: <LibraryBig size={16} strokeWidth={1.85} /> }
    ]
  },
  { label: 'Ilmiy jurnal', path: '/journal', icon: <BookOpenCheck size={17} strokeWidth={1.85} />, i18nKey: 'menu.journal' },
  {
    label: 'Tinglovchilar uchun',
    i18nKey: 'menu.for_listeners',
    icon: <UserRoundCheck size={17} strokeWidth={1.85} />,
    children: [
      { label: 'Malaka oshirish rejasi', path: '/training-plan', i18nKey: 'menu.training_plan', icon: <CalendarRange size={16} strokeWidth={1.85} /> },
      { label: 'Portfolio', path: '/portfolio', i18nKey: 'menu.portfolio', icon: <Palette size={16} strokeWidth={1.85} /> },
      { label: 'Reyestr (Sertifikatni tekshirish)', path: '/students', i18nKey: 'menu.registry', icon: <BadgeCheck size={16} strokeWidth={1.85} /> },
      { label: "Masofaviy ta'lim", path: 'external', url: 'https://mt.uzbamalaka.uz', i18nKey: 'menu.distance_edu', icon: <MonitorPlay size={16} strokeWidth={1.85} /> },
      { label: "Davomat tizimi", path: 'external', url: 'https://t.me/uzbadavomatbot', i18nKey: 'menu.attendance', icon: <QrCode size={16} strokeWidth={1.85} /> }
    ]
  },
  { label: "Ochiq ma'lumotlar", path: '/open-data', icon: <FolderKanban size={17} strokeWidth={1.85} />, i18nKey: 'menu.open_data' },
  {
    label: 'Media',
    i18nKey: 'menu.media',
    icon: <Newspaper size={17} strokeWidth={1.85} />,
    children: [
      { label: 'Yangiliklar', path: '/news?category=yangiliklar', i18nKey: 'menu.news', icon: <Newspaper size={16} strokeWidth={1.85} /> },
      { label: "E'lonlar", path: '/news?category=elonlar', i18nKey: 'menu.announcements', icon: <Megaphone size={16} strokeWidth={1.85} /> },
      { label: 'Fotogalereya', path: '/photo-gallery', i18nKey: 'menu.gallery', icon: <Images size={16} strokeWidth={1.85} /> },
      { label: 'Art Galereya', path: '/art-gallery', i18nKey: 'menu.art_gallery', icon: <Frame size={16} strokeWidth={1.85} /> },
      { label: "Bog'lanish uchun", path: '/?section=contact', i18nKey: 'menu.contact', icon: <Headset size={16} strokeWidth={1.85} /> }
    ]
  },
  {
    label: 'Ilmiy salohiyat',
    path: '/scientific-potential',
    icon: <Award size={17} strokeWidth={1.85} />,
    i18nKey: 'menu.sci_potential'
  }
];

export const INITIAL_STATS = {
  totalPedagogs: 41,
  professors: 12,
  dotsents: 24,
  academics: 5,
  potential: 78,
  studentsCount: [
    { year: '2020', count: 380, retraining: 90 },
    { year: '2021', count: 450, retraining: 120 },
    { year: '2022', count: 520, retraining: 150 },
    { year: '2023', count: 610, retraining: 180 },
    { year: '2024', count: 580, retraining: 195 },
  ],
  retrainingCount: [
    { year: '2021', count: 120 },
    { year: '2022', count: 150 },
    { year: '2023', count: 180 },
    { year: '2024', count: 195 },
  ],
  reportDetails: {
    moTotal: 1743,
    moHigherEdu: 284,
    moCultureMinistry: 740,
    moArtAcademy: 578,
    moShortCourses: 141,
    qtTotal: 389,
    qtPainting: 0,
    qtEmbroidery: 0,
    qtGoldEmbroidery: 0,
    intlCountriesCount: 10,
    intlCountriesList: "Italiya\nXitoy\nGruziya\nBelarus\nTurkiya\nRossiya\nHindiston\nQozog'iston\nKoreya\nOzarbayjon",
    intlOrganizationsCount: 17,
    intlOrganizationsList: "Javoharlal Neru arxitektura va tasviriy san’at universiteti (Hindiston)\nKeimyung universiteti Tasviriy san’at kolleji (Janubiy Koreya)\nOzarbayjon davlat tasviriy san’at akademiyasi (Ozarbayjon)\nSan’at va restavratsiya instituti – Palazzo Spinelli (Italiya)\nTemirbek Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi (Qozog‘iston)\nToraygirov universiteti (Qozog‘iston)\nBatumi san’at ta’limi universiteti (Gruziya)\nA.L.Shtiglits nomidagi Sankt-Peterburg davlat san’at va sanoat akademiyasi (Rossiya)\nJanubiy Federal universiteti (Rossiya)\nErzinjan Binali Yildirim universiteti (Turkiya)\nRecep Tayyip Erdoğan universiteti (Turkiya)\nBelarus davlat san’at akademiyasi (Belarussiya)\nMarkaziy Osiyo savdo-iqtisodiyot Qo‘mitasi (Xitoy)\nXubey tasviriy san’at instituti (Xitoy)\nHebei tasviriy san’at akademiyasi (Xitoy)\nLanzhou universiteti Uels kolleji San’at maktabi (Xitoy)\nToshkent Kimyo xalqaro universiteti (O‘zbekiston)",
    intlProjectsCount: 10,
    intlProjectsList: "“Rangtasvir simfoniyasi” xalqaro qo‘shma ko‘rgazmasi va ilmiy seminar (Gruziya)\n“Yonma-yon” o‘zbek va turk ijodkorlarining yirik pleneri va qo‘shma ko‘rgazmasi (Turkiya)\n“Sharq san’ati va estetik ta’lim markazi” qo‘shma platformasi (Xitoy)\n“Rangtasvir” yo‘nalishida xalqaro qo‘shma malaka oshirish kursi (Xitoy)\n“NEW SILK ROAD ART JOURNEY” xalqaro konferensiyasi va malaka oshirish stajirovkasi (Xitoy)\n“O‘zbekiston milliy liboslar ko‘rgazmasi” (Xitoy)\nBadiiy ta’lim pedagoglari uchun xalqaro malaka oshirish stajirovkasi (Ozarbayjon)\nQozog‘istonlik pedagoglar uchun “Rangtasvir” malaka oshirish kursi (Qozog‘iston)\n“An’anaviy va zamonaviy kashtachilik san’ati” xalqaro ilmiy-amaliy seminari (Qozog‘iston)\n“An’anaviy va zamonaviy uslublarning uyg‘unligi” xalqaro konferensiyasi (Hindiston)",
  }
};
