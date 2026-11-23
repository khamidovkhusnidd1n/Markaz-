import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ArrowRight, BookOpen, Users, Trophy, ChevronLeft, ChevronRight, Play, Star, MapPin, Mail, Phone, Calendar, Search, ArrowUpRight, GraduationCap, Globe, Palette, ShieldCheck, Gavel, ClipboardList, Award, TrendingUp, Zap, CheckCircle2, XCircle, FileText, Briefcase, Clock, Send, UserCheck, ExternalLink, Download, Building2, Check, Filter, Sparkles, ImageOff } from 'lucide-react';
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

interface CountryPartnerInfo {
  id?: string | number;
  name: string;
  nameRu?: string;
  nameEn?: string;
  originalName?: string;
  country: string;
  city?: string;
  cityRu?: string;
  cityEn?: string;
  description: string;
  descriptionRu?: string;
  descriptionEn?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  departmentPostId?: number;
}

interface CountryProjectInfo {
  id?: string | number;
  title: string;
  titleRu?: string;
  titleEn?: string;
  partner: string;
  partnerRu?: string;
  partnerEn?: string;
  status: 'completed' | 'ongoing' | 'planned';
  statusDisplay: string;
  description: string;
  descriptionRu?: string;
  descriptionEn?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  departmentPostId?: number;
}

interface CountryDetailInfo {
  key: string;
  name: string;
  officialName: string;
  flagCode: string;
  flagUrl: string;
  partners: CountryPartnerInfo[];
  projects: CountryProjectInfo[];
}

const COUNTRY_DETAILS_DATA: Record<string, CountryDetailInfo> = {
  italiya: {
    key: 'italiya',
    name: 'Italiya',
    officialName: 'Italiya Respublikasi',
    flagCode: 'it',
    flagUrl: 'https://flagcdn.com/w80/it.png',
    partners: [
      {
        id: 'it-1',
        name: 'San’at va restavratsiya instituti – Palazzo Spinelli',
        nameRu: 'Институт искусства и реставрации – Palazzo Spinelli',
        nameEn: 'Institute for Art and Restoration – Palazzo Spinelli',
        originalName: 'Institute for Art and Restoration - Palazzo Spinelli',
        country: 'Italiya',
        city: 'Florensiya',
        cityRu: 'Флоренция',
        cityEn: 'Florence',
        description: 'Markaz direktori D.Shukurovning Florensiyaga tashrifi doirasida Palazzo Spinelli direktori Emanuele Amodei bilan imzolangan hamkorlik Memorandumi va Xalqaro loyihalar bo‘limi boshlig‘i Ketrin Burnett bilan uchrashuv. Madaniy merosni saqlash, san’at asarlarini restavratsiya qilish hamda professor-o‘qituvchilar almashinuvini ko‘zda tutadi.',
        descriptionRu: 'Меморандум о взаимном сотрудничестве, подписанный директором Центра Д. Шукуровым и директором Palazzo Spinelli Эмануэле Амодеи в ходе визита во Флоренцию, а также переговоры с руководителем международных проектов Кэтрин Бёрнетт.',
        descriptionEn: 'Memorandum of mutual cooperation signed by Center Director D. Shukurov and Palazzo Spinelli Director Emanuele Amodei in Florence, along with talks with Head of International Projects Catherine Burnett.',
        pdfUrl: '/media/uploads/memorandums/MoU_Italia.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image35.png',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image35.png',
          '/media/uploads/departmentpost/xh_image37.png',
          '/media/uploads/departmentpost/xh_image36.png',
          '/media/uploads/departmentpost/xh_image30.png',
        ],
        departmentPostId: 4,
      },
    ],
    projects: [],
  },
  xitoy: {
    key: 'xitoy',
    name: 'Xitoy',
    officialName: 'Xitoy Xalq Respublikasi',
    flagCode: 'cn',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    partners: [
      {
        id: 'cn-1',
        name: 'Hebei tasviriy san\'at akademiyasi',
        nameRu: 'Хэбэйская академия изящных искусств',
        nameEn: 'Hebei Academy of Fine Arts',
        originalName: 'Hebei Academy of Fine Arts',
        country: 'Xitoy',
        city: 'Xebey',
        cityRu: 'Хэбэй',
        cityEn: 'Hebei',
        description: 'Oʼzbekiston Badiiy akademiyasi huzuridagi Markaz hamda Xitoyning nufuzli Hebei tasviriy san\'at akademiyasi o\'rtasida ikki tomonlama ijodiy va ilmiy hamkorlik, qo‘shma dasturlar, ijodiy ustaxonalar va akademik almashinuv Memorandumi.',
        descriptionRu: 'Меморандум о международном научно-творческом сотрудничестве, совместных образовательных программах и академическом обмене между Центром при Академии художеств Узбекистана и Хэбэйской академией изящных искусств.',
        descriptionEn: 'Memorandum on international creative and academic cooperation, joint educational programs, workshops, and academic exchange between the Center under the Academy of Arts of Uzbekistan and Hebei Academy of Fine Arts.',
        pdfUrl: '/media/uploads/memorandums/Memorandum_Hebei_FAA.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image75.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image75.jpeg',
          '/media/uploads/departmentpost/xh_image76.jpeg',
          '/media/uploads/departmentpost/xh_image77.jpeg',
          '/media/uploads/departmentpost/xh_image78.jpeg',
        ],
        departmentPostId: 3,
      },
      {
        id: 'cn-2',
        name: 'Xubey tasviriy san\'at instituti (HIFA)',
        nameRu: 'Хубэйский институт изящных искусств (HIFA)',
        nameEn: 'Hubei Institute of Fine Arts (HIFA)',
        originalName: 'Hubei Institute of Fine Arts',
        country: 'Xitoy',
        city: 'Uxan, Xubey',
        cityRu: 'Ухань, Хубэй',
        cityEn: 'Wuhan, Hubei',
        description: 'Tasviriy san\'at yo\'nalishlarida ta\'lim, ilmiy-ijodiy ko\'rgazmalar va professor-o\'qituvchilar stajirovkasini tashkil etish bo\'yicha hamkorlik Memorandumi.',
        descriptionRu: 'Меморандум о сотрудничестве в области художественного образования, организации научно-творческих выставок и стажировок профессорско-преподавательского состава.',
        descriptionEn: 'Memorandum of cooperation on fine arts education, joint academic and creative exhibitions, and faculty internships.',
        pdfUrl: '/media/uploads/memorandums/Memorandum_HIFA.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image79.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image79.jpeg',
          '/media/uploads/departmentpost/xh_image80.jpeg',
          '/media/uploads/departmentpost/xh_image81.jpeg',
          '/media/uploads/departmentpost/xh_image82.jpeg',
          '/media/uploads/departmentpost/xh_image83.jpeg',
        ],
        departmentPostId: 1,
      },
      {
        id: 'cn-3',
        name: 'Markaziy Osiyo savdo-iqtisodiyot Qo‘mitasi (CAETC)',
        nameRu: 'Комитет торгово-экономического сотрудничества Центральной Азии (CAETC)',
        nameEn: 'Central Asia Economic and Trade Committee (CAETC)',
        originalName: 'Central Asia Economic and Trade Committee (CAETC)',
        country: 'Xitoy',
        city: 'Pekin',
        cityRu: 'Пекин',
        cityEn: 'Beijing',
        description: 'Madaniy-gumanitar sohalarda hamkorlik, xalqaro san\'at ko\'rgazmalari va ta\'lim forumlarini o‘tkazish bo‘yicha Memorandum.',
        descriptionRu: 'Меморандум о сотрудничестве в культурно-гуманитарной сфере, проведении международных художественных выставок и образовательных форумов.',
        descriptionEn: 'Memorandum on cultural and humanitarian cooperation, international art exhibitions, and educational forums.',
        pdfUrl: '/media/uploads/memorandums/China_CAETC.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/China_CAETC_page1.jpg',
        galleryUrls: [
          '/media/uploads/departmentpost/China_CAETC_page1.jpg',
        ],
        departmentPostId: 16,
      },
      {
        id: 'cn-4',
        name: 'Lanzhou universiteti Uels kolleji San’at maktabi',
        nameRu: 'Школа искусств Уэльского колледжа Университета Ланьчжоу',
        nameEn: 'Lanzhou University Wales College Art School',
        originalName: 'Lanzhou University Wales College Art School',
        country: 'Xitoy',
        city: 'Lanchjou',
        cityRu: 'Ланьчжоу',
        cityEn: 'Lanzhou',
        description: 'Markaz direktori D.Shukurov va San’at maktabi vakili Li Xualong tomonidan imzolangan Memorandum: o‘qituvchilar uchun qisqa muddatli amaliyotlar, qo‘shma malaka oshirish kurslari, xalqaro konferensiyalar va plenerlar tashkil etish.',
        descriptionRu: 'Меморандум, подписанный директором Центра Д. Шукуровым и представителем Школы искусств Ли Хуалуном: краткосрочные стажировки преподавателей, совместные курсы повышения квалификации, научные конференции и пленэры.',
        descriptionEn: 'Memorandum signed by Center Director D. Shukurov and Art School representative Li Hualong: short-term faculty internships, joint professional development courses, academic conferences, and plein-airs.',
        pdfUrl: '/media/uploads/memorandums/Memorandum_LANJOU_UNIVERSITETI_UELS_KOLLEJI_SANAT_MAKTABI_(XITOY).pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image101.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image101.jpeg',
          '/media/uploads/departmentpost/xh_image102.jpeg',
          '/media/uploads/departmentpost/xh_image103.jpeg',
          '/media/uploads/departmentpost/xh_image104.jpeg',
          '/media/uploads/departmentpost/xh_image105.jpeg',
          '/media/uploads/departmentpost/xh_image106.jpeg',
        ],
        departmentPostId: 17,
      },
    ],
    projects: [
      {
        id: 'cn-p1',
        title: '“Sharq san’ati va estetik ta’lim markazi” platformasi hamda “8+N” xalqaro oliy san’at maktablari forumi',
        titleRu: 'Платформа «Центр восточного искусства и эстетического образования» и международный форум «8+N»',
        titleEn: 'Joint Platform "Oriental Art and Aesthetic Education Center" & "8+N" International Higher Art Forum',
        partner: 'Xubey tasviriy san’at instituti (Xitoy)',
        partnerRu: 'Хубэйский институт изящных искусств (Китай)',
        partnerEn: 'Hubei Institute of Fine Arts (China)',
        status: 'ongoing',
        statusDisplay: 'Jarayonda',
        description: 'Delegatsiya a’zolarining Xubey tasviriy san’at institutida o‘tkazilgan “8+N” xalqaro oliy san’at maktablari asosiy ta’lim forumi hamda “2025 xalqaro talabalarning rasm ishlari ko‘rgazmasi”dagi ishtiroki va institut muzeyiga tashrifi.',
        descriptionRu: 'Участие делегации Центра в международном образовательном форуме художественных вузов «8+N» и выставке работ иностранных студентов 2025 года в Хубэйском институте изящных искусств.',
        descriptionEn: 'Participation of the Center delegation in the "8+N" International Higher Art Schools Education Forum and the "2025 International Student Art Exhibition" at Hubei Institute of Fine Arts.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image84.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image84.jpeg',
          '/media/uploads/departmentpost/xh_image85.jpeg',
          '/media/uploads/departmentpost/xh_image86.jpeg',
          '/media/uploads/departmentpost/xh_image87.jpeg',
          '/media/uploads/departmentpost/xh_image88.jpeg',
          '/media/uploads/departmentpost/xh_image89.jpeg',
        ],
      },
      {
        id: 'cn-p2',
        title: 'Xubey tasviriy san’at institutida ilmiy-ijodiy stajirovka va qo‘shma malaka oshirish dasturi',
        titleRu: 'Научно-творческая стажировка и совместная программа повышения квалификации в Хубэйском институте',
        titleEn: 'Academic and Creative Internship & Joint Professional Development Program at Hubei Institute of Fine Arts',
        partner: 'Xubey tasviriy san’at instituti (Xitoy)',
        partnerRu: 'Хубэйский институт изящных искусств (Китай)',
        partnerEn: 'Hubei Institute of Fine Arts (China)',
        status: 'ongoing',
        statusDisplay: 'Jarayonda',
        description: 'Markaz xodimlari hamda Respublika ixtisoslashtirilgan dizayn maktabi mutaxassislarining Xubey tasviriy san’at instituti Moda san’ati va Tasviriy san’at fakultetlaridagi stajirovkasi.',
        descriptionRu: 'Научно-творческая стажировка сотрудников Центра и специалистов Республиканской специализированной школы дизайна на факультетах моды и изобразительного искусства HIFA.',
        descriptionEn: 'Academic and creative internship of Center staff and Republican Specialized Design School specialists at the Fashion Art and Fine Arts faculties of HIFA.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image79.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image79.jpeg',
          '/media/uploads/departmentpost/xh_image80.jpeg',
          '/media/uploads/departmentpost/xh_image81.jpeg',
          '/media/uploads/departmentpost/xh_image82.jpeg',
          '/media/uploads/departmentpost/xh_image83.jpeg',
        ],
      },
      {
        id: 'cn-p3',
        title: '“NEW SILK ROAD ART JOURNEY” xalqaro konferensiyasi va stajirovkasi',
        titleRu: 'Международная конференция и стажировка «NEW SILK ROAD ART JOURNEY»',
        titleEn: 'International Conference and Internship "NEW SILK ROAD ART JOURNEY"',
        partner: 'Xubey tasviriy san’at instituti (Xitoy)',
        partnerRu: 'Хубэйский институт изящных искусств (Китай)',
        partnerEn: 'Hubei Institute of Fine Arts (China)',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Xubey tasviriy san’at institutida o‘tkazilgan “NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism” xalqaro konferensiyasida O‘zbekiston delegatsiyasi a’zolarining ma’ruzalar bilan ishtiroki.',
        descriptionRu: 'Выступление членов делегации Узбекистана на международной конференции «NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism» в г. Ухань.',
        descriptionEn: 'Presentations by the Uzbekistan delegation at the "NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism" at Hubei Institute of Fine Arts.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image90.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image90.jpeg',
          '/media/uploads/departmentpost/xh_image91.jpeg',
          '/media/uploads/departmentpost/xh_image92.jpeg',
          '/media/uploads/departmentpost/xh_image93.jpeg',
          '/media/uploads/departmentpost/xh_image94.jpeg',
          '/media/uploads/departmentpost/xh_image95.jpeg',
        ],
      },
      {
        id: 'cn-p4',
        title: '“Bir makon, bir yo‘l: Buyuk Ipak yo‘li chorrahasida kesishgan san’at” xalqaro ko‘rgazma va seminari',
        titleRu: 'Международная выставка и семинар «Один пояс, один путь: искусство на перекрёстке Великого Шёлкового пути»',
        titleEn: 'International Exhibition and Seminar "One Belt, One Road: Art Intersecting at the Crossroads of the Great Silk Road"',
        partner: 'O‘zBA huzuridagi Markaz, Respublika dizayn maktabi va Xitoy ijodkorlari',
        partnerRu: 'Центр при АХУз, Республиканская школа дизайна и художники Китая',
        partnerEn: 'Center under the Academy of Arts, Republican Design School & Chinese Artists',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: '12-oktabr kuni Respublika ixtisoslashtirilgan dizayn maktabida “Badiiy ta’limning zamonaviy tendensiyalari: O‘zbekiston va Xitoy tajribasi” mavzusidagi xalqaro ilmiy-amaliy seminar doirasida o‘tkazilgan Xitoy ijodkorlari badiiy asarlari ko‘rgazmasi.',
        descriptionRu: 'Выставка произведений китайских художников в Республиканской специализированной школе дизайна в рамках международного научно-практического семинара «Современные тенденции художественного образования: опыт Узбекистана и Китая».',
        descriptionEn: 'Exhibition of artworks by Chinese artists held at the Republican Specialized Design School within the international seminar "Contemporary Trends in Art Education: Experience of Uzbekistan and China".',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image114.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image114.jpeg',
          '/media/uploads/departmentpost/xh_image115.jpeg',
          '/media/uploads/departmentpost/xh_image116.jpeg',
          '/media/uploads/departmentpost/xh_image117.jpeg',
        ],
      },
    ],
  },
  gruziya: {
    key: 'gruziya',
    name: 'Gruziya',
    officialName: 'Gruziya Respublikasi',
    flagCode: 'ge',
    flagUrl: 'https://flagcdn.com/w80/ge.png',
    partners: [
      {
        id: 'ge-1',
        name: 'Batumi san’at ta’limi universiteti',
        nameRu: 'Батумский государственный университет искусств',
        nameEn: 'Batumi Art Teaching University',
        originalName: 'Batumi Art Teaching University',
        country: 'Gruziya',
        city: 'Batumi',
        cityRu: 'Батуми',
        cityEn: 'Batumi',
        description: 'Tasviriy va amaliy san’at ta’limi sohasida hamkorlik, qo‘shma plenerlar va o‘qituvchilar malakasini oshirish bo‘yicha Memorandum.',
        descriptionRu: 'Меморандум о сотрудничестве в сфере изобразительного и прикладного художественного образования, совместных пленэрах и повышении квалификации преподавателей.',
        descriptionEn: 'Memorandum on cooperation in fine and applied arts education, joint plein-air workshops, and faculty professional development.',
        pdfUrl: '/media/uploads/memorandums/MoU_Gruziya.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image58.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image58.jpeg',
          '/media/uploads/departmentpost/xh_image59.jpeg',
          '/media/uploads/departmentpost/xh_image60.jpeg',
          '/media/uploads/departmentpost/xh_image61.jpeg',
        ],
        departmentPostId: 10,
      },
    ],
    projects: [
      {
        id: 'ge-p1',
        title: 'Batumi san’at universitetiga xizmat safari va “Zamonaviy O‘zbekiston tasviriy san’ati” ilmiy seminari',
        titleRu: 'Визит в Батумский университет искусств и научный семинар «Современное изобразительное искусство Узбекистана»',
        titleEn: 'Official Visit to Batumi Art Teaching University and Seminar "Contemporary Fine Arts of Uzbekistan"',
        partner: 'Batumi san’at ta’limi universiteti (Gruziya)',
        partnerRu: 'Батумский государственный университет искусств (Грузия)',
        partnerEn: 'Batumi Art Teaching University (Georgia)',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Markaz, P.Benkov nomidagi rassomlik maktabi hamda Respublika dizayn maktabi xodimlarining Batumi shahriga xizmat safari va Markaz direktori D.Shukurovning universitet professor-o‘qituvchilari va talabalari uchun o‘tkazgan seminari.',
        descriptionRu: 'Рабочий визит сотрудников Центра и специализированных школ в г. Батуми и семинар директора Центра Д. Шукурова для преподавателей и студентов университета.',
        descriptionEn: 'Working visit of Center and specialized art schools staff to Batumi and seminar delivered by Center Director D. Shukurov for university faculty and students.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image58.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image58.jpeg',
          '/media/uploads/departmentpost/xh_image59.jpeg',
          '/media/uploads/departmentpost/xh_image60.jpeg',
          '/media/uploads/departmentpost/xh_image61.jpeg',
        ],
      },
    ],
  },
  belarus: {
    key: 'belarus',
    name: 'Belarus',
    officialName: 'Belarus Respublikasi',
    flagCode: 'by',
    flagUrl: 'https://flagcdn.com/w80/by.png',
    partners: [
      {
        id: 'by-1',
        name: 'Belarus davlat san’at akademiyasi',
        nameRu: 'Белорусская государственная академия искусств',
        nameEn: 'Belarusian State Academy of Arts',
        originalName: 'Belarusian State Academy of Arts',
        country: 'Belarus',
        city: 'Minsk',
        cityRu: 'Минск',
        cityEn: 'Minsk',
        description: 'Madaniy-ma’rifiy loyihalar, o‘qituvchilar malakasini oshirish, tasviriy va dizayn san’ati bo‘yicha qo‘shma ko‘rgazmalar tashkil etish Memorandumi.',
        descriptionRu: 'Меморандум о реализации культурно-просветительских проектов, повышении квалификации преподавателей и организации совместных выставок по изобразительному искусству и дизайну.',
        descriptionEn: 'Memorandum on cultural and educational projects, teacher professional development, and joint exhibitions in fine arts and design.',
        pdfUrl: '/media/uploads/memorandums/Memorandum_Belorus.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/Memorandum_Belorus_page1.jpg',
        galleryUrls: [
          '/media/uploads/departmentpost/Memorandum_Belorus_page1.jpg',
        ],
        departmentPostId: 15,
      },
    ],
    projects: [],
  },
  turkiya: {
    key: 'turkiya',
    name: 'Turkiya',
    officialName: 'Turkiya Respublikasi',
    flagCode: 'tr',
    flagUrl: 'https://flagcdn.com/w80/tr.png',
    partners: [
      {
        id: 'tr-1',
        name: 'Erzinjan Binali Yildirim universiteti',
        nameRu: 'Университет Эрзинджан Бинали Йылдырым',
        nameEn: 'Erzincan Binali Yıldırım University',
        originalName: 'Erzincan Binali Yıldırım University',
        country: 'Turkiya',
        city: 'Erzinjan',
        cityRu: 'Эрзинджан',
        cityEn: 'Erzincan',
        description: '2024-yil 25-iyulda imzolangan o‘zaro hamkorlik Memorandumi: tasviriy san’at va pedagogika sohalarida tajriba almashish, ilmiy konferensiyalar o‘tkazish va malaka oshirish.',
        descriptionRu: 'Меморандум о взаимном сотрудничестве от 25 июля 2024 года: обмен опытом в области изобразительного искусства и педагогики, проведение научных конференций и повышение квалификации.',
        descriptionEn: 'Memorandum of Cooperation signed on July 25, 2024: experience exchange in fine arts and pedagogy, joint academic conferences, and professional training.',
        pdfUrl: '/media/uploads/memorandums/MoU_Turkiya.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image54.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image54.jpeg',
          '/media/uploads/departmentpost/xh_image55.jpeg',
          '/media/uploads/departmentpost/xh_image56.jpeg',
          '/media/uploads/departmentpost/xh_image57.jpeg',
        ],
        departmentPostId: 13,
      },
      {
        id: 'tr-2',
        name: 'Recep Tayyip Erdoğan universiteti',
        nameRu: 'Университет Реджепа Тайипа Эрдогана',
        nameEn: 'Recep Tayyip Erdoğan University',
        originalName: 'Recep Tayyip Erdoğan University',
        country: 'Turkiya',
        city: 'Rize',
        cityRu: 'Ризе',
        cityEn: 'Rize',
        description: 'Ilmiy-ijodiy aloqalarni mustahkamlash, malaka oshirish dasturlarini amalga oshirish va qo‘shma san\'at loyihalari bo\'yicha Memorandum.',
        descriptionRu: 'Меморандум об укреплении научно-творческих связей, реализации программ повышения квалификации и совместных художественных проектов.',
        descriptionEn: 'Memorandum on strengthening academic and creative ties, professional development programs, and joint art projects.',
        pdfUrl: '/media/uploads/memorandums/Memorandum_Recep_Tayyip_Erdoğan_universiteti_Turkiya.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/Memorandum_Recep_Tayyip_Erdoğan_universiteti_Turkiya_page1.jpg',
        galleryUrls: [
          '/media/uploads/departmentpost/Memorandum_Recep_Tayyip_Erdoğan_universiteti_Turkiya_page1.jpg',
        ],
        departmentPostId: 14,
      },
    ],
    projects: [
      {
        id: 'tr-p1',
        title: 'Markaz delegatsiyasi va rassomlar guruhining Turkiyadagi Zamonaviy san’at muzeyiga ijodiy tashrifi',
        titleRu: 'Творческий визит делегации Центра и группы художников в Музей современного искусства в Турции',
        titleEn: 'Creative Visit of the Center Delegation and Artists Group to the Museum of Modern Art in Turkey',
        partner: 'Turkiya Zamonaviy san’at muzeyi va oliy ta’lim muassasalari',
        partnerRu: 'Музей современного искусства и высшие учебные заведения Турции',
        partnerEn: 'Museum of Modern Art and Higher Education Institutions of Turkey',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Markaz rahbari, xodimlari hamda bir guruh rassomlarning Turkiyaga tashrifi doirasida Zamonaviy san’at muzeyiga tashrif amalga oshirilib, zamonaviy rassomlar ijodi, yangi yo‘nalishlar va badiiy yechimlar yuzasidan tajriba almashildi.',
        descriptionRu: 'В рамках визита руководителя, сотрудников Центра и группы художников в Турцию состоялось посещение Музея современного искусства и изучение современных направлений и художественных решений.',
        descriptionEn: 'During the visit of Center leadership, staff, and artists to Turkey, the delegation visited the Museum of Modern Art to explore contemporary artistic directions and creative solutions.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image107.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image107.jpeg',
          '/media/uploads/departmentpost/xh_image108.jpeg',
          '/media/uploads/departmentpost/xh_image109.jpeg',
          '/media/uploads/departmentpost/xh_image110.jpeg',
          '/media/uploads/departmentpost/xh_image111.jpeg',
          '/media/uploads/departmentpost/xh_image112.jpeg',
          '/media/uploads/departmentpost/xh_image113.jpeg',
        ],
      },
    ],
  },
  rossiya: {
    key: 'rossiya',
    name: 'Rossiya',
    officialName: 'Rossiya Federatsiyasi',
    flagCode: 'ru',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
    partners: [
      {
        id: 'ru-1',
        name: 'A.L.Shtiglits nomidagi Sankt-Peterburg davlat san’at va sanoat akademiyasi',
        nameRu: 'Санкт-Петербургская государственная художественно-промышленная академия им. А.Л. Штиглица',
        nameEn: 'Saint Petersburg Stieglitz State Academy of Art and Design',
        originalName: 'Saint Petersburg Stieglitz State Academy of Art and Design',
        country: 'Rossiya',
        city: 'Sankt-Peterburg',
        cityRu: 'Санкт-Петербург',
        cityEn: 'Saint Petersburg',
        description: '2024-yil 18-iyul kuni imzolangan o‘zaro hamkorlik Memorandumi: amaliy san’at, monumental dizayn va restavratsiya yo‘nalishlarida qo‘shma dasturlar, ko‘rgazmalar hamda stajirovka va malaka oshirish kurslarini tashkil etish.',
        descriptionRu: 'Меморандум о взаимном сотрудничестве от 18 июля 2024 года: совместные программы, выставки, стажировки и курсы повышения квалификации в области прикладного искусства, монументального дизайна и реставрации.',
        descriptionEn: 'Memorandum of Cooperation signed on July 18, 2024: joint programs, exhibitions, internships, and professional development courses in applied arts, monumental design, and restoration.',
        pdfUrl: '/media/uploads/memorandums/MoU_Shtiglits.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image50.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image50.jpeg',
          '/media/uploads/departmentpost/xh_image51.jpeg',
          '/media/uploads/departmentpost/xh_image52.jpeg',
          '/media/uploads/departmentpost/xh_image53.jpeg',
        ],
        departmentPostId: 11,
      },
      {
        id: 'ru-2',
        name: 'Janubiy Federal universiteti (SFedU)',
        nameRu: 'Южный федеральный университет (ЮФУ)',
        nameEn: 'Southern Federal University (SFedU)',
        originalName: 'Southern Federal University',
        country: 'Rossiya',
        city: 'Rostov-na-Donu',
        cityRu: 'Ростов-на-Дону',
        cityEn: 'Rostov-on-Don',
        description: 'Pedagogik kadrlarning ilmiy salohiyatini oshirish, san’atshunoslik sohasida qo‘shma ilmiy tadqiqotlar bo‘yicha Memorandum.',
        descriptionRu: 'Меморандум о повышении научного потенциала педагогических кадров и проведении совместных научных исследований в области искусствоведения.',
        descriptionEn: 'Memorandum on enhancing academic capacity of educators and conducting joint research in art studies.',
        pdfUrl: '/media/uploads/memorandums/MoU_YuFU.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/MoU_YuFU_page1.jpg',
        galleryUrls: [
          '/media/uploads/departmentpost/MoU_YuFU_page1.jpg',
        ],
        departmentPostId: 12,
      },
    ],
    projects: [],
  },
  hindiston: {
    key: 'hindiston',
    name: 'Hindiston',
    officialName: 'Hindiston Respublikasi',
    flagCode: 'in',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    partners: [
      {
        id: 'in-1',
        name: 'Jawaharlal Nehru Architecture and Fine Arts University (JNAFAU)',
        nameRu: 'Университет архитектуры и изящных искусств имени Джавахарлала Неру (JNAFAU)',
        nameEn: 'Jawaharlal Nehru Architecture and Fine Arts University (JNAFAU)',
        originalName: 'JNAFAU, Hyderabad',
        country: 'Hindiston',
        city: 'Haydarobod',
        cityRu: 'Хайдарабад',
        cityEn: 'Hyderabad',
        description: 'Madaniyat va san’at ta’limi sohalarini rivojlantirish, xalqaro konferensiyalar, seminarlar, ko‘rgazmalar va loyihalarni amalga oshirish, pedagog va xodimlarning xalqaro akademik almashinuvini tashkil etish bo‘yicha ikki tomonlama Memorandum.',
        descriptionRu: 'Двусторонний Меморандум о развитии культурного и художественного образования, проведении международных конференций, семинаров, выставок и организации академического обмена преподавателями.',
        descriptionEn: 'Bilateral Memorandum on advancing art and cultural education, holding international conferences, seminars, and exhibitions, and organizing international faculty exchange.',
        pdfUrl: '/media/uploads/memorandums/MoU_Hindiston.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image7.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image7.jpeg',
          '/media/uploads/departmentpost/xh_image8.jpeg',
          '/media/uploads/departmentpost/xh_image9.jpeg',
          '/media/uploads/departmentpost/xh_image10.jpeg',
        ],
        departmentPostId: 5,
      },
    ],
    projects: [
      {
        id: 'in-p1',
        title: 'JNAFAU dotsenti Anand Rao va doktor Priti Samuktaning tashrifi hamda “Hindiston san’ati tarixi” seminari',
        titleRu: 'Визит доцента JNAFAU Ананда Рао и д-ра Прити Самукты и научный семинар «История искусства Индии»',
        titleEn: 'Visit of JNAFAU Assoc. Prof. Anand Rao & Dr. Priti Samyukta and Seminar "History of Indian Art"',
        partner: 'JNAFAU Tasviriy san’at kolleji (Hindiston)',
        partnerRu: 'Колледж изящных искусств JNAFAU (Индия)',
        partnerEn: 'College of Fine Arts, JNAFAU (India)',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Imzolangan Memorandum doirasida Hindistonning JNAFAU Tasviriy sanʼat kolleji dotsenti Anand Rao va doktor Priti Samuktaning Markazga tashrifi, tajriba almashish uchrashuvi hamda “Hindiston sanʼati tarixi” mavzusidagi ilmiy seminari.',
        descriptionRu: 'Встреча с доцентом Анандом Рао и доктором Прити Самуктой в Центре по вопросам реализации совместных выставок и проектов, а также научный семинар на тему «История искусства Индии».',
        descriptionEn: 'Cooperation meeting at the Center with Associate Professor Anand Rao and Dr. Priti Samyukta on joint exhibitions and projects, followed by the academic seminar "History of Indian Art".',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image18.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image18.jpeg',
          '/media/uploads/departmentpost/xh_image19.jpeg',
          '/media/uploads/departmentpost/xh_image20.jpeg',
          '/media/uploads/departmentpost/xh_image21.jpeg',
          '/media/uploads/departmentpost/xh_image22.jpeg',
        ],
      },
    ],
  },
  qozogiston: {
    key: 'qozogiston',
    name: "Qozog'iston",
    officialName: 'Qozog‘iston Respublikasi',
    flagCode: 'kz',
    flagUrl: 'https://flagcdn.com/w80/kz.png',
    partners: [
      {
        id: 'kz-1',
        name: 'Temirbek Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi',
        nameRu: 'Казахская национальная академия искусств имени Темирбека Жургенова',
        nameEn: 'Kazakh National Academy of Arts named after T. Zhurgenov',
        originalName: 'Kazakh National Academy of Arts named after T. Zhurgenov',
        country: "Qozog'iston",
        city: 'Almati',
        cityRu: 'Алматы',
        cityEn: 'Almaty',
        description: '29-noyabrdan 2-dekabrgacha Markaz direktori D.Shukurov va M.Sadikovaning Qozog‘iston Respublikasiga tashrifi davomida imzolangan hamkorlik Memorandumi va Akademiyaning 35 yillik yubiley ko‘rgazmasidagi ishtiroki.',
        descriptionRu: 'Меморандум о сотрудничестве, подписанный в ходе визита директора Центра Д. Шукурова и М. Садиковой в Алматы (29 ноября – 2 декабря), и участие в юбилейной выставке к 35-летию Академии.',
        descriptionEn: 'Memorandum of Cooperation signed during the visit of Center Director D. Shukurov and M. Sadikova to Almaty (Nov 29 – Dec 2) and participation in the Academy\'s 35th anniversary exhibition.',
        pdfUrl: '/media/uploads/memorandums/MoU_Jurgenov.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image39.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image39.jpeg',
          '/media/uploads/departmentpost/xh_image40.jpeg',
          '/media/uploads/departmentpost/xh_image41.jpeg',
          '/media/uploads/departmentpost/xh_image42.jpeg',
          '/media/uploads/departmentpost/xh_image43.jpeg',
          '/media/uploads/departmentpost/xh_image38.png',
        ],
        departmentPostId: 8,
      },
      {
        id: 'kz-2',
        name: 'Toraygirov universiteti',
        nameRu: 'Торайгыров университет',
        nameEn: 'Toraighyrov University',
        originalName: 'Toraighyrov University',
        country: "Qozog'iston",
        city: 'Pavlodar',
        cityRu: 'Павлодар',
        cityEn: 'Pavlodar',
        description: 'Pedagogik kadrlarni tayyorlash, akademik tajriba almashish va tasviriy san’at dasturlari bo‘yicha Memorandum.',
        descriptionRu: 'Меморандум о подготовке педагогических кадров, обмене академическим опытом и реализации программ по изобразительному искусству.',
        descriptionEn: 'Memorandum on teacher training, academic experience exchange, and fine arts educational programs.',
        pdfUrl: '/media/uploads/memorandums/MoU_Toraygirov.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/MoU_Toraygirov_page1.jpg',
        galleryUrls: [
          '/media/uploads/departmentpost/MoU_Toraygirov_page1.jpg',
        ],
        departmentPostId: 9,
      },
    ],
    projects: [
      {
        id: 'kz-p1',
        title: 'Qozog‘iston bilan hamkorlik Memorandumi asosida “Rangtasvir” xalqaro malaka oshirish kursi',
        titleRu: 'Международный курс повышения квалификации «Живопись» на основе Меморандума с Казахстаном',
        titleEn: 'International Professional Development Course in Painting under the Memorandum with Kazakhstan',
        partner: 'T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi',
        partnerRu: 'Казахская национальная академия искусств им. Т. Жургенова',
        partnerEn: 'Kazakh National Academy of Arts named after T. Zhurgenov',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Markaz delegatsiyasining Qozog‘iston Respublikasi Temirbek Jurgenov nomidagi Qozoq Milliy Badiiy akademiyasiga tashrifi davomida imzolangan hamkorlik Memorandumi asosida tashkil etilgan “Rangtasvir” xalqaro malaka oshirish kursi va sertifikatlar topshirish marosimi.',
        descriptionRu: 'Международный курс повышения квалификации по направлению «Живопись», организованный в Центре на основе Меморандума о сотрудничестве с Казахской национальной академией искусств им. Т. Жургенова, и вручение сертификатов.',
        descriptionEn: 'International professional development course in Painting organized at the Center under the Memorandum of Cooperation with the Kazakh National Academy of Arts named after T. Zhurgenov, and certificate ceremony.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image44.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image44.jpeg',
          '/media/uploads/departmentpost/xh_image45.jpeg',
          '/media/uploads/departmentpost/xh_image46.jpeg',
          '/media/uploads/departmentpost/xh_image47.jpeg',
          '/media/uploads/departmentpost/xh_image48.jpeg',
          '/media/uploads/departmentpost/xh_image49.jpeg',
        ],
      },
      {
        id: 'kz-p2',
        title: '“An’anaviy va zamonaviy kashtachilik san’ati” xalqaro ilmiy-amaliy seminari',
        titleRu: 'Международный научно-практический семинар «Искусство традиционной и современной вышивки»',
        titleEn: 'International Seminar "Traditional and Contemporary Embroidery Art"',
        partner: 'T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi',
        partnerRu: 'Казахская национальная академия искусств им. Т. Жургенова',
        partnerEn: 'Kazakh National Academy of Arts named after T. Zhurgenov',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Amaliy san’at ustalari va tadqiqotchilari ishtirokidagi mintaqaviy mahorat darsi va ilmiy seminar.',
        descriptionRu: 'Региональный мастер-класс и научный семинар с участием мастеров прикладного искусства и исследователей.',
        descriptionEn: 'Regional masterclass and academic seminar featuring applied art masters and researchers.',
      },
    ],
  },
  koreya: {
    key: 'koreya',
    name: 'Koreya',
    officialName: 'Koreya Respublikasi',
    flagCode: 'kr',
    flagUrl: 'https://flagcdn.com/w80/kr.png',
    partners: [
      {
        id: 'kr-1',
        name: 'Keimyung University (Tasviriy san’at kolleji)',
        nameRu: 'Университет Кемён (Колледж изящных искусств)',
        nameEn: 'Keimyung University (College of Fine Arts)',
        originalName: 'College of Fine Arts, Keimyung University',
        country: 'Janubiy Koreya',
        city: 'Tegu',
        cityRu: 'Тэгу',
        cityEn: 'Daegu',
        description: 'Badiiy ta’limni xalqaro miqyosda kengaytirish va akademik harakatchanlikni rivojlantirish maqsadida imzolangan Memorandum: pedagog va xodimlarning xalqaro akademik almashinuvi, qo‘shma ta’lim dasturlari hamda xalqaro ko‘rgazmalar.',
        descriptionRu: 'Меморандум о расширении художественного образования на международном уровне и развитии академической мобильности: обмен преподавателями, совместные образовательные программы и выставки.',
        descriptionEn: 'Memorandum on expanding art education internationally and fostering academic mobility: faculty exchange, joint educational programs, and international exhibitions.',
        pdfUrl: '/media/uploads/memorandums/MoU_Korea.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image12.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image12.jpeg',
          '/media/uploads/departmentpost/xh_image13.jpeg',
          '/media/uploads/departmentpost/xh_image14.jpeg',
          '/media/uploads/departmentpost/xh_image15.jpeg',
          '/media/uploads/departmentpost/xh_image16.jpeg',
          '/media/uploads/departmentpost/xh_image17.jpeg',
        ],
        departmentPostId: 6,
      },
    ],
    projects: [
      {
        id: 'kr-p1',
        title: 'Keimyung universiteti professorlari Kim Yun Hee va Jang Tae Mook seminari va mahorat darsi',
        titleRu: 'Семинар и мастер-класс профессоров Университета Кемён Ким Юн Хи и Чан Тхэ Мука',
        titleEn: 'Seminar and Masterclass by Keimyung University Professors Kim Yun Hee & Jang Tae Mook',
        partner: 'Keimyung University Tasviriy san’at kolleji (Janubiy Koreya)',
        partnerRu: 'Колледж изящных искусств Университета Кемён (Южная Корея)',
        partnerEn: 'College of Fine Arts, Keimyung University (South Korea)',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: '2025-yil 22-aprel kuni Markazda Koreya Respublikasi Keimyung universitetining Tasviriy san’at kolleji dekani Kim Yun Hee hamda Tasviriy san’at kafedrasi mudiri Jang Tae Mook tomonidan tinglovchilar uchun o‘tkazilgan xalqaro seminar va mahorat darsi.',
        descriptionRu: 'Международный семинар и мастер-класс для слушателей курсов Центра, проведённый 22 апреля 2025 года деканом Колледжа изящных искусств Ким Юн Хи и заведующим кафедрой профессором Чан Тхэ Муком.',
        descriptionEn: 'International seminar and masterclass for Center trainees conducted on April 22, 2025 by Dean Kim Yun Hee and Department Head Prof. Jang Tae Mook of Keimyung University.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image62.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image62.jpeg',
          '/media/uploads/departmentpost/xh_image63.jpeg',
          '/media/uploads/departmentpost/xh_image64.jpeg',
          '/media/uploads/departmentpost/xh_image65.jpeg',
          '/media/uploads/departmentpost/xh_image66.jpeg',
          '/media/uploads/departmentpost/xh_image67.jpeg',
        ],
      },
      {
        id: 'kr-p2',
        title: 'Keimyung universiteti professorlariga Markazning “Faxriy professori” unvonini topshirish marosimi',
        titleRu: 'Церемония присвоения профессорам Университета Кемён звания «Почётный профессор» Центра',
        titleEn: 'Ceremony Conferring the Title of "Honorary Professor" of the Center to Keimyung University Professors',
        partner: 'Keimyung University Tasviriy san’at kolleji (Janubiy Koreya)',
        partnerRu: 'Колледж изящных искусств Университета Кемён (Южная Корея)',
        partnerEn: 'College of Fine Arts, Keimyung University (South Korea)',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'Markaz Ilmiy-metodik kengashining qarori bilan O‘zbekiston va Janubiy Koreya o‘rtasidagi madaniyat-san’at va ta’lim sohasida xalqaro hamkorlikni rivojlantirishga qo‘shgan hissasi uchun dekan Kim Yun Hee va prof. Jang Tae Mookga Markazning faxriy professori unvoni berildi.',
        descriptionRu: 'Решением Научно-методического совета Центра за вклад в развитие международного сотрудничества между Узбекистаном и Южной Кореей декану Ким Юн Хи и профессору Чан Тхэ Муку присвоено звание почётного профессора Центра.',
        descriptionEn: 'By decision of the Scientific and Methodological Council, Dean Kim Yun Hee and Prof. Jang Tae Mook were awarded the title of Honorary Professor of the Center for their contribution to Uzbekistan–South Korea cooperation.',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image68.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image68.jpeg',
          '/media/uploads/departmentpost/xh_image69.jpeg',
          '/media/uploads/departmentpost/xh_image70.jpeg',
          '/media/uploads/departmentpost/xh_image71.jpeg',
          '/media/uploads/departmentpost/xh_image72.jpeg',
          '/media/uploads/departmentpost/xh_image73.jpeg',
          '/media/uploads/departmentpost/xh_image74.jpeg',
        ],
      },
    ],
  },
  ozarbayjon: {
    key: 'ozarbayjon',
    name: 'Ozarbayjon',
    officialName: 'Ozarbayjon Respublikasi',
    flagCode: 'az',
    flagUrl: 'https://flagcdn.com/w80/az.png',
    partners: [
      {
        id: 'az-1',
        name: 'Ozarbayjon davlat tasviriy san’at akademiyasi',
        nameRu: 'Азербайджанская государственная академия художеств',
        nameEn: 'Azerbaijan State Academy of Fine Arts',
        originalName: 'Azerbaijan State Academy of Fine Arts',
        country: 'Ozarbayjon',
        city: 'Boku',
        cityRu: 'Баку',
        cityEn: 'Baku',
        description: 'Markaz direktori D.Shukurov va Ozarbayjon Davlat rassomlik akademiyasi rektori Natiq Aliyev (Natiq Kamal oğlu Əliyev) tomonidan imzolangan hamkorlik Memorandumi: pedagog va xodimlarning xalqaro akademik almashinuvi, qo‘shma ta’lim dasturlari va ko‘rgazmalar.',
        descriptionRu: 'Меморандум о сотрудничестве, подписанный директором Центра Д. Шукуровым и ректором Азербайджанской государственной академии художеств Натиком Алиевым: международный академический обмен, совместные программы и выставки.',
        descriptionEn: 'Memorandum of Cooperation signed by Center Director D. Shukurov and Rector of Azerbaijan State Academy of Fine Arts Natiq Aliyev: international academic exchange, joint educational programs, and exhibitions.',
        pdfUrl: '/media/uploads/memorandums/MoU_Azerbayjan.pdf',
        thumbnailUrl: '/media/uploads/departmentpost/xh_image23.jpeg',
        galleryUrls: [
          '/media/uploads/departmentpost/xh_image23.jpeg',
          '/media/uploads/departmentpost/xh_image24.jpeg',
          '/media/uploads/departmentpost/xh_image25.jpeg',
          '/media/uploads/departmentpost/xh_image26.jpeg',
          '/media/uploads/departmentpost/xh_image27.jpeg',
          '/media/uploads/departmentpost/xh_image28.jpeg',
          '/media/uploads/departmentpost/xh_image29.jpeg',
        ],
        departmentPostId: 7,
      },
    ],
    projects: [
      {
        id: 'az-p1',
        title: 'Badiiy ta’lim pedagoglari uchun xalqaro malaka oshirish stajirovkasi (Boku)',
        titleRu: 'Международная стажировка повышения квалификации для педагогов художественного образования (Баку)',
        titleEn: 'International Professional Development Internship for Art Educators (Baku)',
        partner: 'Ozarbayjon davlat tasviriy san’at akademiyasi',
        partnerRu: 'Азербайджанская государственная академия художеств',
        partnerEn: 'Azerbaijan State Academy of Fine Arts',
        status: 'completed',
        statusDisplay: 'Yakunlangan',
        description: 'O‘zbekistonlik pedagog kadrlarning Boku shahrida o‘tkazilgan nufuzli kasbiy malaka oshirish stajirovkasi.',
        descriptionRu: 'Профессиональная стажировка повышения квалификации педагогических кадров Узбекистана в городе Баку.',
        descriptionEn: 'Professional development internship for Uzbek art educators conducted in Baku.',
      },
    ],
  },
};

const normalizeCountryKey = (countryName: string): string => {
  const c = (countryName || '').toLowerCase().trim();
  if (c.includes('ital')) return 'italiya';
  if (c.includes('xitoy') || c.includes('chin') || c.includes('китай')) return 'xitoy';
  if (c.includes('gruz') || c.includes('georg') || c.includes('груз')) return 'gruziya';
  if (c.includes('bela') || c.includes('бела')) return 'belarus';
  if (c.includes('turk') || c.includes('турц')) return 'turkiya';
  if (c.includes('ross') || c.includes('russ') || c.includes('рос')) return 'rossiya';
  if (c.includes('hind') || c.includes('ind') || c.includes('инд')) return 'hindiston';
  if (c.includes('qozo') || c.includes('kaza') || c.includes('каза')) return 'qozogiston';
  if (c.includes('kore') || c.includes('коре')) return 'koreya';
  if (c.includes('azar') || c.includes('ozar') || c.includes('азер')) return 'ozarbayjon';
  return c;
};

const getCountryDetail = (countryName: string): CountryDetailInfo | null => {
  const key = normalizeCountryKey(countryName);
  return COUNTRY_DETAILS_DATA[key] || null;
};

const getCountryPartnerCount = (countryName: string): number => {
  const data = getCountryDetail(countryName);
  return data ? data.partners.length : 1;
};

const Home: React.FC = () => {
  const { news, stats, pdPlans, aboutContent, artGallery, departments = [], internationalPartners = [], internationalProjects = [] } = useApp();
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [partnerPhotoIdx, setPartnerPhotoIdx] = useState<Record<string, number>>({});
  const [partnerLightbox, setPartnerLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setIntlModalTab('countries');
    setActiveStatsModal('international');
  };

  const handleOpenAllInternational = (tab: 'countries' | 'organizations' | 'projects' = 'countries') => {
    setSelectedCountry(null);
    setIntlModalTab(tab);
    setActiveStatsModal('international');
  };
  
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

  const getCountryOfficialName = (countryName: string): string => {
    const lang = (i18n.language || 'uz').substring(0, 2);
    const key = normalizeCountryKey(countryName);
    const map: Record<string, { uz: string; ru: string; en: string }> = {
      'italiya': { uz: 'Italiya Respublikasi', ru: 'Итальянская Республика', en: 'Italian Republic' },
      'xitoy': { uz: 'Xitoy Xalq Respublikasi', ru: 'Китайская Народная Республика', en: "People's Republic of China" },
      'gruziya': { uz: 'Gruziya Respublikasi', ru: 'Грузия', en: 'Georgia' },
      'belarus': { uz: 'Belarus Respublikasi', ru: 'Республика Беларусь', en: 'Republic of Belarus' },
      'turkiya': { uz: 'Turkiya Respublikasi', ru: 'Турецкая Республика', en: 'Republic of Turkey' },
      'rossiya': { uz: 'Rossiya Federatsiyasi', ru: 'Российская Федерация', en: 'Russian Federation' },
      'hindiston': { uz: 'Hindiston Respublikasi', ru: 'Республика Индия', en: 'Republic of India' },
      'qozogiston': { uz: "Qozog'iston Respublikasi", ru: 'Республика Казахстан', en: 'Republic of Kazakhstan' },
      'koreya': { uz: 'Koreya Respublikasi', ru: 'Республика Корея', en: 'Republic of Korea' },
      'ozarbayjon': { uz: 'Ozarbayjon Respublikasi', ru: 'Азербайджанская Республика', en: 'Republic of Azerbaijan' },
      'malayziya': { uz: 'Malayziya', ru: 'Малайзия', en: 'Malaysia' },
    };
    if (map[key]) {
      return map[key][lang as 'uz' | 'ru' | 'en'] || map[key].uz;
    }
    return translateCountryName(countryName);
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
    .filter(s => Boolean(s) && !s.toLowerCase().includes('malay'));

  const customOrgsArray = reportDetails.intlOrganizationsList
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  const customProjectsArray = reportDetails.intlProjectsList
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  const isRuLang = (i18n.language || 'uz').startsWith('ru');
  const isEnLang = (i18n.language || 'uz').startsWith('en');

  const allLocalizedPartnersFromData = Object.values(COUNTRY_DETAILS_DATA).flatMap(c =>
    c.partners.map(p => {
      const pName = isRuLang ? (p.nameRu || p.name) : isEnLang ? (p.nameEn || p.originalName || p.name) : p.name;
      const cName = translateCountryName(c.name);
      return `${pName} (${cName})`;
    })
  );

  const allLocalizedProjectsFromData = Object.values(COUNTRY_DETAILS_DATA).flatMap(c =>
    c.projects.map(p => {
      const pTitle = isRuLang ? (p.titleRu || p.title) : isEnLang ? (p.titleEn || p.title) : p.title;
      const pPartner = isRuLang ? (p.partnerRu || p.partner) : isEnLang ? (p.partnerEn || p.partner) : p.partner;
      return `${pTitle} (${pPartner})`;
    })
  );

  const displayedCountriesCount = countriesArray.length;
  const orgsToDisplay = allLocalizedPartnersFromData;
  const displayedOrgsCount = orgsToDisplay.length;

  const projectsToDisplay = allLocalizedProjectsFromData;
  const displayedProjectsCount = projectsToDisplay.length;

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
    { name: t('home.links_distance_edu'), url: "https://mt.uzbamalaka.uz/", icon: <Globe size={28} />, color: "bg-blue-900" },
    { name: t('home.links_art_academy'), url: "https://art-academy.uz/", image: "/logos/badiiy_akademiya.png" },
    { name: "MY.BIMM.UZ", url: "https://my.bimm.uz/home", image: "/logos/mybimm.png", cover: true },
    { name: "LEX.UZ", url: "https://lex.uz/uz/", image: "/logos/lexuz.png" },
    { name: t('home.links_forms'), url: "https://form.uzbamalaka.uz", icon: <ClipboardList size={28} />, color: "bg-indigo-900" },
    { name: t('menu.attendance'), url: "https://davomat.uzbamalaka.uz/", icon: <UserCheck size={28} />, color: "bg-emerald-700" },
  ];

  // Scroll reveal sections
  const statsReveal = useScrollReveal();
  const reestrReveal = useScrollReveal();
  const chartsReveal = useScrollReveal();
  const newsReveal = useScrollReveal();
  const linksReveal = useScrollReveal();

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[540px] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-slate-950 overflow-hidden">
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
              className="absolute right-6 top-6 rounded-xl bg-slate-900/75 hover:bg-slate-900 transition-colors px-4 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-sm border border-white/20 flex items-center gap-2 z-20"
            >
              <Play size={15} className="fill-white" /> {t('home.banner_video')}
            </a>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-900/20 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-[1.15] tracking-tight">
              {t('home.hero_title_1')} <br/>
              <span className="text-amber-400">{t('home.hero_title_span')}</span> {t('home.hero_title_2')}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl font-normal">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link to="/about/info" className="group px-7 py-3.5 bg-blue-700 text-white hover:bg-blue-800 rounded-xl font-bold transition-colors shadow-md flex items-center gap-2.5 text-sm sm:text-base">
                {t('home.details')}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/students" className="px-7 py-3.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm sm:text-base">
                <Users size={18} /> {t('home.listeners')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section 
        ref={statsReveal.ref}
        className={`container mx-auto px-6 -mt-14 relative z-20 transition-all duration-700 ${
          statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: t('home.stats_total_pedagogs'), value: stats?.totalPedagogs || 0, icon: <Users size={22} />, iconStyle: 'bg-slate-100 text-slate-800 border-slate-200' },
            { label: t('home.stats_professors'), value: stats?.professors || 0, icon: <GraduationCap size={22} />, iconStyle: 'bg-blue-50 text-blue-800 border-blue-200' },
            { label: t('home.stats_dotsents'), value: stats?.dotsents || 0, icon: <Users size={22} />, iconStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { label: t('home.stats_academics'), value: stats?.academics || 0, icon: <Award size={22} />, iconStyle: 'bg-amber-50 text-amber-800 border-amber-200' },
            { label: t('home.stats_potential'), value: `${stats?.potential || 0}%`, icon: <TrendingUp size={22} />, iconStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-11 h-11 ${stat.iconStyle} border rounded-xl flex items-center justify-center mb-3.5`}>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tabular-nums">{stat.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REESTR MODULE - with MO/QT Selection */}
      <section 
        ref={reestrReveal.ref}
        className={`container mx-auto px-6 py-20 transition-all duration-700 ${
          reestrReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/60 rounded-full mb-4">
              <FileText size={16} className="text-blue-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">{t('home.reestr_online_check')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('home.reestr_title')}</h2>
            <p className="text-base text-slate-600">{t('home.reestr_subtitle')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
            {/* Type Selection Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-200">
              <button 
                onClick={() => { setActiveReestrTab('mo'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`relative py-5 px-4 sm:px-6 text-center transition-all ${
                  activeReestrTab === 'mo' 
                    ? 'bg-emerald-50/70 text-emerald-900' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2.5 rounded-xl flex items-center justify-center transition-all ${
                  activeReestrTab === 'mo' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <Award size={24} />
                </div>
                <p className="font-bold text-base sm:text-lg">{t('students.tab_mo')}</p>
                <p className="text-xs font-medium mt-0.5 opacity-75">{t('home.charts_mo')}</p>
                {activeReestrTab === 'mo' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700"></div>
                )}
              </button>
              
              <button 
                onClick={() => { setActiveReestrTab('qt'); setSearchResult({status: 'idle'}); setDocNumber(''); }}
                className={`relative py-5 px-4 sm:px-6 text-center transition-all ${
                  activeReestrTab === 'qt' 
                    ? 'bg-blue-50/70 text-blue-900' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2.5 rounded-xl flex items-center justify-center transition-all ${
                  activeReestrTab === 'qt' 
                    ? 'bg-blue-800 text-white shadow-sm' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <Briefcase size={24} />
                </div>
                <p className="font-bold text-base sm:text-lg">{t('students.tab_qt')}</p>
                <p className="text-xs font-medium mt-0.5 opacity-75">{t('home.charts_qt')}</p>
                {activeReestrTab === 'qt' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
                )}
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleReestrSearch} className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {activeReestrTab === 'mo' ? t('home.reestr_cert_number_label') : t('home.reestr_diplom_number_label')}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-base ${
                      activeReestrTab === 'mo' ? 'text-emerald-700' : 'text-blue-800'
                    }`}>
                      {activeReestrTab === 'mo' ? 'MO' : 'QT'}
                    </span>
                    <input 
                      type="text" 
                      placeholder="000831" 
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-lg outline-none focus:bg-white focus:border-blue-700 transition-all"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className={`px-8 py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-colors shadow-sm ${
                    activeReestrTab === 'mo' 
                      ? 'bg-emerald-700 hover:bg-emerald-800' 
                      : 'bg-blue-800 hover:bg-blue-900'
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
                onClick={() => handleOpenAllInternational('countries')}
                className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-600 shadow-sm text-left transition-colors"
              >
                <p className="text-[11px] font-semibold text-slate-500">{reportDetails.intlCountriesLabel}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {displayedCountriesCount} <span className="text-xs font-normal text-slate-500">{t('home.stats_report.unit_count')}</span>
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAllInternational('organizations')}
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
                      onClick={() => handleOpenAllInternational('countries')}
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
                      onClick={() => handleOpenAllInternational('countries')}
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
                      onClick={() => handleOpenAllInternational('organizations')}
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
                      onClick={() => handleOpenAllInternational('projects')}
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
                  <div className="mt-6 pt-5 border-t border-slate-200/80">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                          <Globe size={14} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t('home.stats_report.partner_countries')}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                        {displayedCountriesCount} {t('home.stats_report.unit_countries')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {countriesArray.map((country, i) => {
                        const flagUrl = getCountryFlagUrl(country);
                        const partnerCount = getCountryPartnerCount(country);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="group relative px-3 py-2.5 rounded-xl bg-slate-50/90 hover:bg-white text-slate-800 hover:text-blue-700 text-xs font-semibold transition-all duration-200 flex items-center justify-between border border-slate-200 hover:border-blue-400 hover:shadow-sm"
                            title={
                              isRuLang
                                ? `${translateCountryName(country)}: посмотреть сотрудничество и меморандумы`
                                : isEnLang
                                  ? `${translateCountryName(country)}: view cooperation and memorandums`
                                  : `${translateCountryName(country)}: hamkorlik va memorandumlarini ko'rish`
                            }
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {flagUrl ? (
                                <img
                                  src={flagUrl}
                                  alt={country}
                                  className="w-5 h-3.5 object-cover rounded shadow-xs shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <Globe size={14} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                              )}
                              <span className="truncate">{translateCountryName(country)}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-700 border border-slate-200/60 group-hover:border-blue-200 transition-colors">
                                {partnerCount}
                              </span>
                              <ChevronRight size={12} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {i18n.language?.startsWith('ru')
                        ? 'Нажмите на страну, чтобы посмотреть меморандумы и проекты'
                        : i18n.language?.startsWith('en')
                        ? 'Click on a country to view signed memorandums and projects'
                        : "Davlat ustiga bosing — tegishli memorandum va loyihalarni ko'ring"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAllInternational('countries')}
                  className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 group"
                >
                  <span className="group-hover:text-blue-700 transition-colors">{t('home.stats_report.open_intl_modal')}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 group-hover:text-blue-700 transition-all" />
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
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('home.charts_distribution')}</h3>
            <div className="relative h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300} initialDimension={{ width: 400, height: 300 }}>
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
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('home.charts_by_years')}</h3>
            <div className="h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300} initialDimension={{ width: 400, height: 300 }}>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveStatsModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 text-white shadow-inner">
                  <Globe size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                      {reportDetails.card2Badge}
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[11px] text-blue-200/90 hidden sm:inline">
                      {isRuLang ? 'Официальное сотрудничество' : isEnLang ? 'Official Partnerships' : 'Rasmiy hamkorliklar'}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    {reportDetails.card2Title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/departments/4"
                  onClick={() => setActiveStatsModal(null)}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                >
                  <span>{isRuLang ? 'Страница отдела' : isEnLang ? 'Department Page' : "Bo'lim sahifasi"}</span>
                  <ArrowUpRight size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveStatsModal(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label={isRuLang ? 'Закрыть' : isEnLang ? 'Close' : 'Yopish'}
                >
                  <XCircle size={22} />
                </button>
              </div>
            </div>

            {/* Davlatlar filtri bar (gorizontal scroll bilan) */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {isRuLang ? 'Выберите страну-партнёра:' : isEnLang ? 'Select a partner country:' : 'Hamkor davlatni tanlang:'}
                </span>
                {selectedCountry && (
                  <button
                    type="button"
                    onClick={() => setSelectedCountry(null)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1"
                  >
                    <span>
                      {isRuLang ? `Все страны (${countriesArray.length})` : isEnLang ? `All countries (${countriesArray.length})` : `Barcha davlatlar (${countriesArray.length})`}
                    </span>
                    <span className="text-slate-400">&times;</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCountry(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedCountry === null
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Globe size={13} />
                  <span>{isRuLang ? 'Все' : isEnLang ? 'All' : 'Barchasi'}</span>
                </button>
                {countriesArray.map((c, i) => {
                  const flagUrl = getCountryFlagUrl(c);
                  const isSelected = selectedCountry && normalizeCountryKey(selectedCountry) === normalizeCountryKey(c);
                  const partnerCount = getCountryPartnerCount(c);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30 font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {flagUrl && (
                        <img src={flagUrl} alt={c} className="w-4 h-3 object-cover rounded-[2px] shrink-0 border border-black/10" />
                      )}
                      <span>{translateCountryName(c)}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {partnerCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              {selectedCountry ? (() => {
                const cDetail = getCountryDetail(selectedCountry);
                if (!cDetail) {
                  return (
                    <div className="text-center py-12 text-slate-500">
                      <p>
                        {isRuLang ? 'Информация по данной стране не найдена.' : isEnLang ? 'No information found for this country.' : "Ushbu davlat bo'yicha ma'lumot topilmadi."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedCountry(null)}
                        className="mt-3 text-xs font-bold text-blue-600 underline"
                      >
                        {isRuLang ? 'Вернуться ко всем странам' : isEnLang ? 'Return to all countries' : 'Barcha davlatlarga qaytish'}
                      </button>
                    </div>
                  );
                }

                const flagUrl = getCountryFlagUrl(cDetail.name);

                return (
                  <div className="space-y-6 animate-fade-in">
                    {/* Davlat sarlavhasi kartochkasi */}
                    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {flagUrl && (
                          <div className="w-14 h-10 rounded-xl overflow-hidden shadow-md border border-slate-200 shrink-0">
                            <img src={flagUrl} alt={cDetail.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {isRuLang ? 'Страна-партнёр' : isEnLang ? 'Partner Country' : 'Hamkor Davlat'}
                            </span>
                            <span className="text-xs text-slate-500">{getCountryOfficialName(cDetail.name)}</span>
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 mt-1">
                            {translateCountryName(cDetail.name)}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:self-center">
                        <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                          <span className="text-[11px] font-bold text-slate-500 block uppercase">
                            {isRuLang ? 'Учреждения' : isEnLang ? 'Institutions' : 'Muassasalar'}
                          </span>
                          <span className="text-lg font-black text-blue-700">
                            {isRuLang || isEnLang ? cDetail.partners.length : `${cDetail.partners.length} ta`}
                          </span>
                        </div>
                        <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                          <span className="text-[11px] font-bold text-slate-500 block uppercase">
                            {isRuLang ? 'Проекты' : isEnLang ? 'Projects' : 'Loyihalar'}
                          </span>
                          <span className="text-lg font-black text-indigo-700">
                            {isRuLang || isEnLang ? cDetail.projects.length : `${cDetail.projects.length} ta`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hamkor tashkilotlar va Memorandumlar */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-blue-700" />
                          <h5 className="text-base sm:text-lg font-bold text-slate-900">
                            {isRuLang
                              ? `Партнёрские вузы и организации (${cDetail.partners.length})`
                              : isEnLang
                                ? `Partner Universities & Organizations (${cDetail.partners.length})`
                                : `Hamkor oliygoh va tashkilotlar (${cDetail.partners.length} ta)`}
                          </h5>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                          {isRuLang ? 'Подписанные меморандумы' : isEnLang ? 'Signed Memorandums' : 'Imzolangan Memorandumlar'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {cDetail.partners.map((partner, idx) => {
                          const partnerName = isRuLang
                            ? (partner.nameRu || partner.name)
                            : isEnLang
                              ? (partner.nameEn || partner.originalName || partner.name)
                              : partner.name;
                          const partnerCity = isRuLang
                            ? (partner.cityRu || partner.city)
                            : isEnLang
                              ? (partner.cityEn || partner.city)
                              : partner.city;
                          const partnerDesc = isRuLang
                            ? (partner.descriptionRu || partner.description)
                            : isEnLang
                              ? (partner.descriptionEn || partner.description)
                              : partner.description;

                          const partnerKey = String(partner.id || `${cDetail.key}-${idx}`);
                          const intlDept = departments?.find((d: any) => Number(d.id) === 4);
                          const liveDeptPost = partner.departmentPostId && intlDept?.posts
                            ? intlDept.posts.find((p: any) => Number(p.id) === Number(partner.departmentPostId))
                            : null;
                          const liveGallery: string[] = [];
                          if (liveDeptPost) {
                            const mainImg = liveDeptPost.image || liveDeptPost.image_url;
                            if (mainImg) liveGallery.push(getImageUrl(mainImg));
                            if (Array.isArray(liveDeptPost.images)) {
                              liveDeptPost.images.forEach((im: any) => {
                                const u = im?.image || im?.image_url;
                                if (u) {
                                  const fullU = getImageUrl(u);
                                  if (!liveGallery.includes(fullU)) liveGallery.push(fullU);
                                }
                              });
                            }
                          }
                          const galleryList = liveGallery.length > 0
                            ? liveGallery
                            : ((partner.galleryUrls && partner.galleryUrls.length > 0)
                                ? partner.galleryUrls
                                : (partner.thumbnailUrl ? [partner.thumbnailUrl] : []));
                          const activePhotoIdx = galleryList.length > 0
                            ? ((partnerPhotoIdx[partnerKey] || 0) % galleryList.length)
                            : 0;
                          const activePhotoUrl = galleryList[activePhotoIdx] || partner.thumbnailUrl;

                          return (
                            <div
                              key={partner.id || idx}
                              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5"
                            >
                              {/* Hamkorlik uchrashuvi va tadbirlar fotogalereyasi */}
                              {activePhotoUrl && (
                                <div className="md:w-52 shrink-0 flex flex-col gap-2">
                                  <div
                                    onClick={() => setPartnerLightbox({ images: galleryList, index: activePhotoIdx, title: partnerName })}
                                    className="relative w-full h-44 md:h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group cursor-pointer"
                                  >
                                    <img
                                      src={activePhotoUrl}
                                      alt={partnerName}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                    {galleryList.length > 1 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPartnerPhotoIdx(prev => ({
                                              ...prev,
                                              [partnerKey]: (activePhotoIdx - 1 + galleryList.length) % galleryList.length
                                            }));
                                          }}
                                          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
                                          aria-label="Oldingi rasm"
                                        >
                                          <ChevronLeft size={15} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPartnerPhotoIdx(prev => ({
                                              ...prev,
                                              [partnerKey]: (activePhotoIdx + 1) % galleryList.length
                                            }));
                                          }}
                                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
                                          aria-label="Keyingi rasm"
                                        >
                                          <ChevronRight size={15} />
                                        </button>
                                      </>
                                    )}
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold backdrop-blur-xs">
                                      {activePhotoIdx + 1} / {galleryList.length}
                                    </div>
                                  </div>

                                  {galleryList.length > 1 && (
                                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                                      {galleryList.slice(0, 5).map((thumbUrl, tIdx) => (
                                        <button
                                          key={tIdx}
                                          type="button"
                                          onClick={() => setPartnerPhotoIdx(prev => ({ ...prev, [partnerKey]: tIdx }))}
                                          className={`relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                            activePhotoIdx === tIdx
                                              ? 'border-blue-600 ring-1 ring-blue-400'
                                              : 'border-slate-200 opacity-70 hover:opacity-100'
                                          }`}
                                        >
                                          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                                          {tIdx === 4 && galleryList.length > 5 && (
                                            <span
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setPartnerLightbox({ images: galleryList, index: 4, title: partnerName });
                                              }}
                                              className="absolute inset-0 bg-slate-900/75 text-white text-[10px] font-bold flex items-center justify-center"
                                            >
                                              +{galleryList.length - 5}
                                            </span>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Muassasa ma'lumotlari */}
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      <ShieldCheck size={12} /> {isRuLang ? 'Официальный партнёр' : isEnLang ? 'Official Partner' : 'Rasmiy Hamkor'}
                                    </span>
                                    {partnerCity && (
                                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                                        <MapPin size={12} className="text-slate-400" /> {partnerCity}
                                      </span>
                                    )}
                                  </div>

                                  <h6 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    {partnerName}
                                  </h6>
                                  {partner.originalName && partner.originalName !== partnerName && (
                                    <p className="text-xs font-medium text-slate-500 italic mt-0.5">
                                      {partner.originalName}
                                    </p>
                                  )}

                                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                                    {partnerDesc}
                                  </p>
                                </div>

                                {/* Tugmalar: Fotogalereya, PDF ko'rish & Bo'lim sahifasi */}
                                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                                  {galleryList.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => setPartnerLightbox({ images: galleryList, index: activePhotoIdx, title: partnerName })}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
                                    >
                                      <span>
                                        {isRuLang
                                          ? `Фотогалерея (${galleryList.length})`
                                          : isEnLang
                                            ? `Photo Gallery (${galleryList.length})`
                                            : `Fotogalereya (${galleryList.length} ta rasm)`}
                                      </span>
                                    </button>
                                  )}

                                  {partner.pdfUrl && (
                                    <a
                                      href={partner.pdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                                    >
                                      <FileText size={14} />
                                      <span>
                                        {isRuLang ? 'Открыть меморандум (PDF)' : isEnLang ? 'View Memorandum (PDF)' : "Memorandumni ko'rish (PDF)"}
                                      </span>
                                      <ArrowUpRight size={13} />
                                    </a>
                                  )}

                                  <Link
                                    to="/departments/4"
                                    onClick={() => setActiveStatsModal(null)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                  >
                                    <span>
                                      {isRuLang ? 'Смотреть на странице отдела' : isEnLang ? 'View on International Department page' : "Xalqaro bo'lim sahifasida ko'rish"}
                                    </span>
                                    <ChevronRight size={13} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Xalqaro loyihalar */}
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2">
                          <Trophy size={18} className="text-indigo-600" />
                          <h5 className="text-base sm:text-lg font-bold text-slate-900">
                            {isRuLang
                              ? `Международные проекты (${cDetail.projects.length})`
                              : isEnLang
                                ? `International Projects (${cDetail.projects.length})`
                                : `Xalqaro loyihalar (${cDetail.projects.length} ta)`}
                          </h5>
                        </div>
                      </div>

                      {cDetail.projects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {cDetail.projects.map((proj, pIdx) => {
                            const projTitle = isRuLang
                              ? (proj.titleRu || proj.title)
                              : isEnLang
                                ? (proj.titleEn || proj.title)
                                : proj.title;
                            const projDesc = isRuLang
                              ? (proj.descriptionRu || proj.description)
                              : isEnLang
                                ? (proj.descriptionEn || proj.description)
                                : proj.description;
                            const projPartner = isRuLang
                              ? (proj.partnerRu || proj.partner)
                              : isEnLang
                                ? (proj.partnerEn || proj.partner)
                                : proj.partner;
                            const projStatusLabel = proj.status === 'ongoing'
                              ? (isRuLang ? 'В процессе' : isEnLang ? 'Ongoing' : 'Jarayonda')
                              : (isRuLang ? 'Завершён' : isEnLang ? 'Completed' : 'Yakunlangan');

                            const projKey = String(proj.id || `proj-${cDetail.key}-${pIdx}`);
                            const projGallery = (proj.galleryUrls && proj.galleryUrls.length > 0)
                              ? proj.galleryUrls
                              : (proj.thumbnailUrl ? [proj.thumbnailUrl] : []);
                            const activeProjPhotoIdx = projGallery.length > 0
                              ? ((partnerPhotoIdx[projKey] || 0) % projGallery.length)
                              : 0;
                            const activeProjPhotoUrl = projGallery[activeProjPhotoIdx] || proj.thumbnailUrl;

                            return (
                              <div
                                key={proj.id || pIdx}
                                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
                              >
                                {activeProjPhotoUrl && (
                                  <div className="md:w-52 shrink-0 flex flex-col gap-2">
                                    <div
                                      onClick={() => setPartnerLightbox({ images: projGallery, index: activeProjPhotoIdx, title: projTitle })}
                                      className="relative w-full h-44 md:h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group cursor-pointer"
                                    >
                                      <img
                                        src={activeProjPhotoUrl}
                                        alt={projTitle}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      {projGallery.length > 1 && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPartnerPhotoIdx(prev => ({
                                                ...prev,
                                                [projKey]: (activeProjPhotoIdx - 1 + projGallery.length) % projGallery.length
                                              }));
                                            }}
                                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
                                            aria-label="Oldingi rasm"
                                          >
                                            <ChevronLeft size={15} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPartnerPhotoIdx(prev => ({
                                                ...prev,
                                                [projKey]: (activeProjPhotoIdx + 1) % projGallery.length
                                              }));
                                            }}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
                                            aria-label="Keyingi rasm"
                                          >
                                            <ChevronRight size={15} />
                                          </button>
                                        </>
                                      )}
                                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold backdrop-blur-xs">
                                        {activeProjPhotoIdx + 1} / {projGallery.length}
                                      </div>
                                    </div>

                                    {projGallery.length > 1 && (
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                                        {projGallery.slice(0, 5).map((thumbUrl, tIdx) => (
                                          <button
                                            key={tIdx}
                                            type="button"
                                            onClick={() => setPartnerPhotoIdx(prev => ({ ...prev, [projKey]: tIdx }))}
                                            className={`relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                              activeProjPhotoIdx === tIdx
                                                ? 'border-indigo-600 ring-1 ring-indigo-400'
                                                : 'border-slate-200 opacity-70 hover:opacity-100'
                                            }`}
                                          >
                                            <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                                            {tIdx === 4 && projGallery.length > 5 && (
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setPartnerLightbox({ images: projGallery, index: 4, title: projTitle });
                                                }}
                                                className="absolute inset-0 bg-slate-900/75 text-white text-[10px] font-bold flex items-center justify-center"
                                              >
                                                +{projGallery.length - 5}
                                              </span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                                          proj.status === 'ongoing'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}>
                                          {projStatusLabel}
                                        </span>
                                        <h6 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                          {projTitle}
                                        </h6>
                                      </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                                      {projDesc}
                                    </p>
                                  </div>

                                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                      <span className="font-semibold text-slate-700">
                                        {isRuLang ? 'Партнёр:' : isEnLang ? 'Partner:' : 'Hamkor:'}
                                      </span>
                                      <span>{projPartner}</span>
                                    </div>

                                    {projGallery.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => setPartnerLightbox({ images: projGallery, index: activeProjPhotoIdx, title: projTitle })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
                                      >
                                        <span>
                                          {isRuLang
                                            ? `Фотогалерея (${projGallery.length})`
                                            : isEnLang
                                              ? `Photo Gallery (${projGallery.length})`
                                              : `Fotogalereya (${projGallery.length} ta rasm)`}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                          {isRuLang
                            ? 'В рамках подписанного официального Меморандума с данной страной осуществляется постоянное академическое сотрудничество.'
                            : isEnLang
                              ? 'Ongoing academic cooperation and joint activities are carried out under the official Memorandum signed with this country.'
                              : 'Ushbu davlat bilan imzolangan rasmiy Memorandum doirasida doimiy akademik aloqalar va hamkorlik ishlari amalga oshirilmoqda.'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })() : (
                /* BARCHASI TANLANGANDA */
                <div className="space-y-6">
                  {/* Interactive Sub-Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setIntlModalTab('countries')}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                        intlModalTab === 'countries'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Globe size={15} />
                      <span>
                        {isRuLang
                          ? `${displayedCountriesCount} стран`
                          : isEnLang
                            ? `${displayedCountriesCount} countries`
                            : `${displayedCountriesCount} ta davlat`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntlModalTab('organizations')}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                        intlModalTab === 'organizations'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Briefcase size={15} />
                      <span>
                        {isRuLang
                          ? `${displayedOrgsCount} учреждений`
                          : isEnLang
                            ? `${displayedOrgsCount} institutions`
                            : `${displayedOrgsCount} ta muassasa`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntlModalTab('projects')}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                        intlModalTab === 'projects'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Trophy size={15} />
                      <span>
                        {isRuLang
                          ? `${displayedProjectsCount} проектов`
                          : isEnLang
                            ? `${displayedProjectsCount} projects`
                            : `${displayedProjectsCount} ta loyiha`}
                      </span>
                    </button>
                  </div>

                  {intlModalTab === 'countries' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base sm:text-lg font-black text-slate-900">
                          {reportDetails.intlCountriesLabel} ({isRuLang ? `${displayedCountriesCount} стран` : isEnLang ? `${displayedCountriesCount} countries` : `${displayedCountriesCount} ta davlat`}):
                        </h4>
                        <span className="text-xs text-slate-500">
                          {isRuLang ? 'Выберите для просмотра подробностей' : isEnLang ? 'Select to view details' : "Tafsilotlarni ko'rish uchun tanlang"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {countriesArray.map((country, idx) => {
                          const flagUrl = getCountryFlagUrl(country);
                          const cData = getCountryDetail(country);
                          const partnerCount = cData ? cData.partners.length : 1;
                          const projectCount = cData ? cData.projects.length : 0;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedCountry(country)}
                              className="group p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 text-left transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                {flagUrl ? (
                                  <img src={flagUrl} alt={country} className="w-10 h-7 object-cover rounded-md shadow-xs shrink-0 border border-slate-200 group-hover:scale-105 transition-transform" />
                                ) : (
                                  <div className="w-10 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                    {idx + 1}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors block truncate">
                                    {translateCountryName(country)}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {isRuLang
                                      ? `${partnerCount} учрежд.${projectCount > 0 ? ` · ${projectCount} проект.` : ''}`
                                      : isEnLang
                                        ? `${partnerCount} ${partnerCount === 1 ? 'institution' : 'institutions'}${projectCount > 0 ? ` · ${projectCount} ${projectCount === 1 ? 'project' : 'projects'}` : ''}`
                                        : `${partnerCount} ta muassasa ${projectCount > 0 ? `· ${projectCount} ta loyiha` : ''}`}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 shrink-0">
                                <span className="hidden sm:inline">
                                  {isRuLang ? 'Открыть' : isEnLang ? 'View' : "Ko'rish"}
                                </span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {intlModalTab === 'organizations' && (
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 mb-4">
                        {reportDetails.intlOrganizationsLabel} ({isRuLang ? `${displayedOrgsCount} учреждений` : isEnLang ? `${displayedOrgsCount} institutions` : `${displayedOrgsCount} ta muassasa`}):
                      </h4>
                      {reportDetails.intlOrganizationsSummary && !isRuLang && !isEnLang && (
                        <p className="text-sm text-slate-600 mb-4 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 whitespace-pre-line">
                          {reportDetails.intlOrganizationsSummary}
                        </p>
                      )}
                      <div className="space-y-3">
                        {orgsToDisplay.length > 0 ? (
                          orgsToDisplay.map((orgName: string, idx: number) => {
                            let matchedFlag: string | null = null;
                            for (const c of countriesArray) {
                              const trC = translateCountryName(c).toLowerCase();
                              if (orgName.toLowerCase().includes(c.toLowerCase()) || orgName.toLowerCase().includes(trC)) {
                                matchedFlag = getCountryFlagUrl(c);
                                break;
                              }
                            }
                            return (
                              <div key={`custom-org-${idx}`} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  {matchedFlag ? (
                                    <img src={matchedFlag} alt="flag" className="w-7 h-5 object-cover rounded shadow-xs shrink-0 border border-slate-200" />
                                  ) : (
                                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                      {idx + 1}
                                    </span>
                                  )}
                                  <span className="font-bold text-slate-900 text-sm md:text-base truncate">{orgName}</span>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 shrink-0">
                                  {isRuLang ? 'Меморандум' : 'Memorandum'}
                                </span>
                              </div>
                            );
                          })
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
                      <h4 className="text-base sm:text-lg font-black text-slate-900 mb-4">
                        {reportDetails.intlProjectsLabel} ({isRuLang ? `${displayedProjectsCount} проектов` : isEnLang ? `${displayedProjectsCount} projects` : `${displayedProjectsCount} ta loyiha`}):
                      </h4>
                      <div className="space-y-4">
                        {Object.values(COUNTRY_DETAILS_DATA).flatMap(c => c.projects.map(p => ({ ...p, countryName: c.name }))).map((proj, idx) => {
                          const projTitle = isRuLang
                            ? (proj.titleRu || proj.title)
                            : isEnLang
                              ? (proj.titleEn || proj.title)
                              : proj.title;
                          const projDesc = isRuLang
                            ? (proj.descriptionRu || proj.description)
                            : isEnLang
                              ? (proj.descriptionEn || proj.description)
                              : proj.description;
                          const projPartner = isRuLang
                            ? (proj.partnerRu || proj.partner)
                            : isEnLang
                              ? (proj.partnerEn || proj.partner)
                              : proj.partner;
                          const projGallery = (proj.galleryUrls && proj.galleryUrls.length > 0)
                            ? proj.galleryUrls
                            : (proj.thumbnailUrl ? [proj.thumbnailUrl] : []);
                          const projKey = String(proj.id || `all-proj-${idx}`);
                          const activeProjPhotoIdx = projGallery.length > 0
                            ? ((partnerPhotoIdx[projKey] || 0) % projGallery.length)
                            : 0;
                          const activeProjPhotoUrl = projGallery[activeProjPhotoIdx] || proj.thumbnailUrl;

                          return (
                            <div key={`all-proj-${idx}`} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 flex flex-col md:flex-row gap-4 shadow-xs transition-all">
                              {activeProjPhotoUrl && (
                                <div
                                  onClick={() => setPartnerLightbox({ images: projGallery, index: activeProjPhotoIdx, title: projTitle })}
                                  className="relative md:w-44 h-40 md:h-32 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900 cursor-pointer group"
                                >
                                  <img
                                    src={activeProjPhotoUrl}
                                    alt={projTitle}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  {projGallery.length > 1 && (
                                    <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold">
                                      {projGallery.length} {isRuLang ? 'фото' : isEnLang ? 'photos' : 'ta rasm'}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                      {isRuLang ? 'Международная программа' : isEnLang ? 'International Program' : 'Xalqaro dastur'}
                                    </span>
                                  </div>
                                  <h6 className="font-bold text-slate-900 text-sm md:text-base leading-snug">{projTitle}</h6>
                                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{projDesc}</p>
                                </div>
                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">
                                    <strong className="text-slate-700">{isRuLang ? 'Партнёр:' : isEnLang ? 'Partner:' : 'Hamkor:'}</strong> {projPartner}
                                  </span>
                                  {projGallery.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => setPartnerLightbox({ images: projGallery, index: 0, title: projTitle })}
                                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors"
                                    >
                                      {isRuLang
                                        ? `Фотогалерея (${projGallery.length})`
                                        : isEnLang
                                          ? `Photo Gallery (${projGallery.length})`
                                          : `Fotogalereya (${projGallery.length} ta rasm)`}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <Link
                to="/departments/4"
                onClick={() => setActiveStatsModal(null)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors"
              >
                <Globe size={14} />
                <span>
                  {isRuLang
                    ? 'Полная информация отдела развития международных связей'
                    : isEnLang
                      ? 'Full details of the International Relations Department'
                      : "Xalqaro aloqalarni rivojlantirish bo'limi to'liq ma'lumotlari"}
                </span>
                <ChevronRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setActiveStatsModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors ml-auto shadow-xs"
              >
                {isRuLang ? 'Закрыть' : isEnLang ? 'Close' : 'Yopish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox for International Partner Photo Gallery */}
      {partnerLightbox && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setPartnerLightbox(null)}
        >
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-sm sm:text-base font-bold">{partnerLightbox.title}</h4>
              <span className="text-xs text-slate-400">
                {partnerLightbox.index + 1} / {partnerLightbox.images.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPartnerLightbox(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <XCircle size={22} />
            </button>
          </div>

          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={partnerLightbox.images[partnerLightbox.index]}
              alt={partnerLightbox.title}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {partnerLightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setPartnerLightbox(prev =>
                      prev
                        ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }
                        : null
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPartnerLightbox(prev =>
                      prev
                        ? { ...prev, index: (prev.index + 1) % prev.images.length }
                        : null
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {partnerLightbox.images.length > 1 && (
            <div
              className="w-full max-w-4xl pt-3 flex items-center justify-center gap-2 overflow-x-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {partnerLightbox.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPartnerLightbox(prev => (prev ? { ...prev, index: idx } : null))}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    partnerLightbox.index === idx
                      ? 'border-blue-500 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* News Section - Featured + 3 Small */}
      <section 
        ref={newsReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-700 ${
          newsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mb-10">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">{t('news_list.badge')}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{t('home.news_title')}</h2>
        </div>
        
        {news.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Featured Card - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const mainItem = news[newsCarouselIndex];
                const mainImg = mainItem.images?.[0]?.imageUrl || mainItem.image;
                return (
                  <button onClick={() => handleNewsClick(mainItem)} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 w-full text-left flex flex-col">
                    <div className="relative w-full overflow-hidden shrink-0 aspect-video md:aspect-[16/9] bg-slate-100">
                      {mainImg ? (
                        <img 
                          src={mainImg} 
                          alt={mainItem.title} 
                          loading="lazy" 
                          decoding="async" 
                          className="absolute inset-0 w-full h-full object-cover object-top sm:object-[center_15%] group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                          <ImageOff size={36} strokeWidth={1.5} />
                          <span className="text-xs font-semibold">Rasm yuklanmagan</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                      {mainItem.isImportant && (
                        <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>{t('news_detail.important')}</div>
                      )}
                    </div>
                    <div className="p-6 sm:p-8 flex-1">
                      <span className="text-xs font-semibold text-slate-400">{formatDate(mainItem.date, i18n.language)}</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                        {mainItem.title}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 text-sm sm:text-base mb-5 leading-relaxed">{stripHtml(mainItem.content)}</p>
                      <div className="flex items-center gap-1.5 text-blue-700 text-sm font-bold group-hover:gap-2.5 transition-all mt-auto">{t('news_list.read_more')}<ChevronRight size={18} />
                      </div>
                    </div>
                  </button>
                );
              })()}

              {news.length > 1 && (() => {
                const secondaryItem = news[(newsCarouselIndex + 1) % news.length];
                const secImg = secondaryItem.images?.[0]?.imageUrl || secondaryItem.image;
                return (
                  <button onClick={() => handleNewsClick(secondaryItem)} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg text-left w-full">
                    <div className="relative w-full aspect-video overflow-hidden shrink-0 bg-slate-100">
                      {secImg ? (
                        <img
                          src={secImg}
                          alt={secondaryItem.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                          <ImageOff size={36} strokeWidth={1.5} />
                          <span className="text-xs font-semibold">Rasm yuklanmagan</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-center">
                      <span className="text-xs font-semibold text-slate-400">{formatDate(secondaryItem.date, i18n.language)}</span>
                      <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-700 leading-snug">
                        {secondaryItem.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-3 text-sm text-slate-600 leading-relaxed">{stripHtml(secondaryItem.content)}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-700">{t('news_list.read_more')}<ChevronRight size={18} />
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
                  news[(newsCarouselIndex + 4) % news.length],
                  news[(newsCarouselIndex + 5) % news.length]
                ].filter((item, index, array) => Boolean(item) && array.findIndex((entry) => entry.id === item.id) === index);
                return smallCards.map((item) => {
                  const smImg = item.images?.[0]?.imageUrl || item.image;
                  return (
                    <button onClick={() => handleNewsClick(item)} key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 text-left w-full flex flex-col">
                      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                        {smImg ? (
                          <img 
                            src={smImg} 
                            alt={item.title} 
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
                            <ImageOff size={28} strokeWidth={1.5} />
                            <span className="text-[11px] font-semibold">Rasm yuklanmagan</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <span className="text-xs font-medium text-slate-400">{formatDate(item.date, i18n.language)}</span>
                        <h4 className="text-base font-bold text-slate-900 mt-1 mb-1.5 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-slate-500 line-clamp-1 text-xs">{stripHtml(item.content)}</p>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
            <div className="flex justify-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-blue-400 hover:text-blue-800"
              >{t('home.news_more_btn')}<ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">{t('home.news_no_news')}</p>
          </div>
        )}
      </section>

      {/* Useful Links Section */}
      <section
        ref={linksReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-700 ${
          linksReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mb-10">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">{t('home.links_resources')}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{t('home.links_useful')}</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {usefulLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              {link.image ? (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3.5 bg-white overflow-hidden border border-slate-200">
                  <img src={link.image} alt={link.name} className={`w-full h-full ${link.cover ? 'object-cover' : 'object-contain p-1.5'}`} />
                </div>
              ) : (
                <div className={`w-14 h-14 ${link.color} text-white rounded-xl flex items-center justify-center mb-3.5 shadow-xs`}>
                  {link.icon}
                </div>
              )}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-800 text-center leading-snug transition-colors">{link.name}</h3>
            </a>
          ))}
        </div>
      </section>

      <section id="contact" className="container mx-auto px-6 pb-20">
        <div className="mb-8">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">{t('home.contact_badge')}</span>
          <h2 className="mt-1.5 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t('home.contact_our_address')}</h2>
        </div>
        <div className="grid gap-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
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
                      <a href="mailto:uzbahuzuridagimarkaz@gmail.com" className="hover:text-blue-450 transition-colors hover:text-blue-400 font-semibold">uzbahuzuridagimarkaz@gmail.com</a>
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
                      <a href="https://t.me/uzbamalakamakebot" target="_blank" rel="noopener noreferrer" className="hover:text-blue-450 transition-colors hover:text-blue-400 font-semibold">@uzbamalakamakebot</a>
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
