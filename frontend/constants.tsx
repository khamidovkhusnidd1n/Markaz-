
import React from 'react';
import { 
  Home, Info, BookOpen, GraduationCap, 
  Database, Globe, Users
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
    icon: <Info size={18} />,
    path: '#',
    children: [
      { label: 'Markaz haqida', path: '/about/info', i18nKey: 'menu.about' },
      { label: 'Markaz tuzilmasi', path: '/about/structure', i18nKey: 'menu.structure' },
      { label: 'Rahbariyat', path: '/about/leadership', i18nKey: 'menu.leadership' },
      { label: 'Markaziy apparat', path: '/about/staff', i18nKey: 'menu.staff' },
      { label: 'Virtual qabulxona', path: '/virtual-qabulxona#murojaat', i18nKey: 'menu.virtual_reception' },
      { label: 'Ariza yuborish', path: '/virtual-qabulxona#ariza', i18nKey: 'menu.submit_app' }
    ]
  },
  {
    label: "Bo'limlar",
    i18nKey: 'menu.departments',
    icon: <Database size={18} />,
    path: '#',
    children: [
      { label: 'Qayta tayyorlash va malaka oshirish monitoringi', path: '/departments/2', i18nKey: 'menu.monitoring' },
      { label: "O'quv jarayonini tashkil etish", path: '/departments/3', i18nKey: 'menu.edu_process' },
      { label: 'Matbuot va axborot texnologiyalari', path: '/departments/1', i18nKey: 'menu.it' },
      { label: 'Xalqaro aloqalarni rivojlantirish', path: '/departments/4', i18nKey: 'menu.international' }
    ]
  },
  {
    label: "Ta'lim dasturlari",
    i18nKey: 'menu.programs',
    icon: <GraduationCap size={18} />,
    children: [
      { label: 'Kurslar', path: '/courses', i18nKey: 'menu.courses' },
      { label: "O\u2018quv me\u2019yoriy hujjatlar", path: '/open-data?category=regulatory', i18nKey: 'menu.regulatory' },
      { label: 'Kutubxona', path: '/library', i18nKey: 'menu.library' }
    ]
  },
  { label: 'Ilmiy jurnal', path: '/journal', icon: <BookOpen size={18} />, i18nKey: 'menu.journal' },
  {
    label: 'Tinglovchilar uchun',
    i18nKey: 'menu.for_listeners',
    icon: <Users size={18} />,
    children: [
      { label: 'Malaka oshirish rejasi', path: '/training-plan', i18nKey: 'menu.training_plan' },
      { label: 'Portfolio', path: '/portfolio', i18nKey: 'menu.portfolio' },
      { label: 'Reyestr (Sertifikatni tekshirish)', path: '/students', i18nKey: 'menu.registry' },
      { label: "Masofaviy ta'lim", path: 'external', url: 'https://mt.uzbamalaka.uz', i18nKey: 'menu.distance_edu' },
      { label: "Davomat tizimi", path: 'external', url: 'https://t.me/uzbadavomatbot', i18nKey: 'menu.attendance' }
    ]
  },
  { label: "Ochiq ma'lumotlar", path: '/open-data?category=open_data', icon: <Database size={18} />, i18nKey: 'menu.open_data' },
  {
    label: 'Media',
    i18nKey: 'menu.media',
    icon: <Globe size={18} />,
    children: [
      { label: 'Yangiliklar', path: '/news?category=yangiliklar', i18nKey: 'menu.news' },
      { label: "E'lonlar", path: '/news?category=elonlar', i18nKey: 'menu.announcements' },
      { label: 'Fotogalereya', path: '/photo-gallery', i18nKey: 'menu.gallery' },
      { label: 'Art Galereya', path: '/art-gallery', i18nKey: 'menu.art_gallery' },
      { label: "Bog'lanish uchun", path: '/#contact', i18nKey: 'menu.contact' }
    ]
  },
  {
    label: 'Ilmiy salohiyat',
    path: '/scientific-potential',
    icon: <Info size={18} />,
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
  ]
};
