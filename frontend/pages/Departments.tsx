import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Monitor, BookOpen, Cpu, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  {
    id: 'monitoring',
    label: "Qayta tayyorlash va malaka oshirish monitoringi",
    icon: <Monitor size={22} />,
    color: 'from-blue-600 to-blue-800',
    description: "Pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish jarayonini monitoring qilish bo'limi.",
    tasks: [
      "Malaka oshirish kurslarini rejalashtirish va tashkil etish",
      "O'qituvchilar malakasini baholash va tahlil qilish",
      "Statistik ma'lumotlarni yig'ish va hisobotlar tayyorlash",
      "Qayta tayyorlash dasturlarini monitoring qilish",
    ],
  },
  {
    id: 'edu',
    label: "O'quv jarayonini tashkil etish",
    icon: <BookOpen size={22} />,
    color: 'from-emerald-600 to-emerald-800',
    description: "O'quv jarayonini tashkil etish, o'quv rejalari va dasturlarini ishlab chiqish bo'limi.",
    tasks: [
      "O'quv reja va dasturlarini ishlab chiqish",
      "Dars jadvallari va auditoriyalarni taqsimlash",
      "O'quv-uslubiy materiallarni tayyorlash",
      "Tinglovchilar bilan ishlash va ularning bilimini baholash",
    ],
  },
  {
    id: 'it',
    label: "Matbuot va axborot texnologiyalari",
    icon: <Cpu size={22} />,
    color: 'from-purple-600 to-purple-800',
    description: "Matbuot va axborot texnologiyalari bo'limi markaz faoliyatini axborot texnologiyalari bilan ta'minlash hamda ommaviy axborot vositalarida yoritish vazifasini bajaradi.",
    tasks: [
      "Markaz veb-saytini yuritish va yangilash",
      "Ijtimoiy tarmoqlarda markaz faoliyatini yoritish",
      "Axborot tizimlarini joriy etish va qo'llab-quvvatlash",
      "Masofaviy ta'lim platformasini boshqarish",
    ],
  },
];

const Departments: React.FC = () => {
  const location = useLocation();
  const hashTab = location.hash?.replace('#', '') || 'monitoring';
  const [activeTab, setActiveTab] = useState(hashTab);

  useEffect(() => {
    const h = location.hash?.replace('#', '');
    if (h && TABS.some(t => t.id === h)) {
      setActiveTab(h);
    }
  }, [location.hash]);

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Bo'limlar</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Markaz tarkibidagi bo'limlar va ularning asosiy vazifalari haqida ma'lumot.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-md scale-[1.02]`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.label.split(' ').slice(0, 2).join(' ')}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
          <div className={`bg-gradient-to-r ${currentTab.color} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                {currentTab.icon}
              </div>
              <h2 className="text-2xl font-bold">{currentTab.label}</h2>
            </div>
            <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
              {currentTab.description}
            </p>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Asosiy vazifalar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTab.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${currentTab.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{task}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm font-medium">
                📌 Batafsil ma'lumot uchun markaz ma'muriyatiga murojaat qilishingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
