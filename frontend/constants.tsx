
import React from 'react';
import { 
  Home, Info, BookOpen, GraduationCap, 
  Database, Globe 
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
    icon: <Info size={18} />,
    children: [
      { label: 'Markaz haqida', path: '/about' },
      { label: 'Markaz tuzilmasi', path: '/about#structure' },
      { label: 'Rahbariyat', path: '/about#leadership' },
      { label: 'Markaziy apparat', path: '/about#staff' },
      { label: 'Virtual qabulxona', path: '/virtual-qabulxona#murojaat' },
      { label: 'Ariza yuborish', path: '/virtual-qabulxona#ariza' }
    ]
  },
  {
    label: "Bo'limlar",
    icon: <Database size={18} />,
    children: [
      { label: 'Qayta tayyorlash va malaka oshirish monitoringi', path: '/departments#monitoring' },
      { label: "O\u2018quv jarayonini tashkil etish", path: '/departments#edu' },
      { label: 'Matbuot va axborot texnologiyalari', path: '/departments#it' },
      { label: 'Xalqaro aloqalarni rivojlantirish', path: '/international' }
    ]
  },
  {
    label: "Ta'lim dasturlari",
    icon: <GraduationCap size={18} />,
    children: [
      { label: 'Kurslar', path: '/courses' },
      { label: "O\u2018quv me\u2019yoriy hujjatlar", path: '/open-data' },
      { label: 'Kutubxona', path: '/library' }
    ]
  },
  { label: 'Ilmiy jurnal', path: '/journal', icon: <BookOpen size={18} /> },
  {
    label: 'Tinglovchilar uchun',
    icon: <GraduationCap size={18} />,
    children: [
      { label: 'Malaka oshirish rejasi', path: '/training-plan' },
      { label: 'Portfolio', path: '/portfolio' },
      { label: 'Reestr (Sertifikat tekshirish)', path: '/students' },
      { label: "Masofaviy ta\u2018lim", path: 'external', url: 'https://mt.uzbamalaka.uz' }
    ]
  },
  { label: "Ochiq ma'lumotlar", path: '/open-data', icon: <Database size={18} /> },
  {
    label: 'Media',
    icon: <Globe size={18} />,
    children: [
      { label: 'Yangiliklar', path: '/news' },
      { label: "E'lonlar", path: '/news' },
      { label: 'Fotogalereya', path: '/photo-gallery' },
      { label: 'Art Galereya', path: '/art-gallery' },
      { label: "Bog'lanish uchun", path: '/about#contact' }
    ]
  },
  {
    label: 'Salohiyat',
    icon: <Info size={18} />,
    children: [
      { label: 'Bizning ustozlar', path: '/teachers' },
      { label: 'Ilmiy salohiyat', path: '/about#potential' }
    ]
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
