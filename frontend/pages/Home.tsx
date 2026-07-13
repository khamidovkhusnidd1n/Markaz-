import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ChevronRight, Award, Users, GraduationCap, TrendingUp, Zap, ShieldCheck, CheckCircle2, XCircle, Globe, Palette, Gavel, FileText, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDPlanRecord } from '../types';

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

const Home: React.FC = () => {
  const { news, stats, pdPlans, aboutContent } = useApp();
  
  // Reestr state
  const [activeReestrTab, setActiveReestrTab] = useState<'mo' | 'qt'>('mo');
  const [docNumber, setDocNumber] = useState('');
  const [searchResult, setSearchResult] = useState<{status: 'idle' | 'found' | 'not_found', data?: PDPlanRecord}>({status: 'idle'});
  
  // News carousel state
  const [newsCarouselIndex, setNewsCarouselIndex] = useState(0);
  const newsCarouselSize = 4; // Large card + 3 small cards
  

  const [heroIndex, setHeroIndex] = useState(0);


  const heroImages = (aboutContent.heroImages || []).filter((item) => item.imageUrl);

  // News carousel effect
  useEffect(() => {
    if (news.length <= newsCarouselSize) return;
    const interval = setInterval(() => {
      setNewsCarouselIndex((prev) => (prev + 1) % (news.length - newsCarouselSize + 1));
    }, 32000); // 30-35 seconds
    return () => clearInterval(interval);
  }, [news.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const totalMalaka = stats.studentsCount.reduce((sum, item) => sum + item.count, 0);
  const totalQayta = stats.studentsCount.reduce((sum, item) => sum + item.retraining, 0);
  const totalOverall = totalMalaka + totalQayta;

  const distributionData = [
    { name: 'Malaka oshirish', value: totalMalaka, color: '#10b981' },
    { name: 'Qayta tayyorlash', value: totalQayta, color: '#3b82f6' },
  ];

  const yearlyData = stats.studentsCount.map(item => ({
    name: item.year,
    malaka: item.count,
    qayta: item.retraining
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
    { name: "Masofaviy ta'lim", url: "https://mt.uzbamalaka.uz/", icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { name: "Badiiy akademiya", url: "https://art-academy.uz/", icon: <Palette size={32} />, color: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { name: "MY.BIMM.UZ", url: "https://my.bimm.uz/home", icon: <ShieldCheck size={32} />, color: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { name: "LEX.UZ", url: "https://lex.uz/uz/", icon: <Gavel size={32} />, color: "bg-gradient-to-br from-red-500 to-rose-700" },
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
        <div className="absolute inset-0">
          <img 
            src={heroImages[heroIndex]?.imageUrl || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop"} 
            alt="Hero" 
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.25)' }}
          />
          {aboutContent.heroVideoUrl && (
            <a
              href={aboutContent.heroVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-6 top-6 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur"
            >
              Banner video
            </a>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-50"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-4xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold tracking-wide">Rasmiy veb-sahifa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              San'at orqali tafakkur, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Ta'lim</span> orqali taraqqiyot!
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
              Haqiqiy pedagog o‘quvchida ijodkorlikni tarbiyalaydi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="group px-8 py-4 bg-white text-slate-900 hover:bg-blue-500 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-white/20 flex items-center gap-3">
                Batafsil
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/students" className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 rounded-2xl font-bold transition-all duration-300">
                Tinglovchilar
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
            { label: 'Umumiy pedagoglar', value: stats.totalPedagogs, icon: <Users size={24} />, gradient: 'from-slate-700 to-slate-900' },
            { label: 'Professorlar', value: stats.professors, icon: <GraduationCap size={24} />, gradient: 'from-blue-500 to-indigo-600' },
            { label: 'Dotsentlar', value: stats.dotsents, icon: <Users size={24} />, gradient: 'from-emerald-500 to-teal-600' },
            { label: 'Akademiklar', value: stats.academics, icon: <Award size={24} />, gradient: 'from-amber-500 to-orange-600' },
            { label: 'Ilmiy salohiyat', value: `${stats.potential}%`, icon: <TrendingUp size={24} />, gradient: 'from-purple-500 to-pink-600' },
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
              <span className="text-sm font-bold text-blue-600">Online tekshiruv</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Hujjat haqiqiyligini tekshiring
            </h2>
            <p className="text-lg text-slate-500">
              Diplom yoki sertifikat turini tanlang va raqamni kiriting
            </p>
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
                <p className="font-black text-lg">Sertifikat (MO)</p>
                <p className="text-xs font-medium mt-1 opacity-70">Malaka oshirish</p>
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
                <p className="font-black text-lg">Diplom (QT)</p>
                <p className="text-xs font-medium mt-1 opacity-70">Qayta tayyorlash</p>
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
                    {activeReestrTab === 'mo' ? 'Sertifikat' : 'Diplom'} raqami
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
                >
                  Tekshirish
                </button>
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
                          }`}>
                            HAQIQIY
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { label: 'Hujjat turi', value: searchResult.data.recordType === 'QT' ? 'Qayta tayyorlash diplomi' : 'Malaka oshirish sertifikati' },
                            { label: 'Seriya va raqam', value: `${searchResult.data.series} ${searchResult.data.number}` },
                            { label: 'Ish joyi', value: searchResult.data.workplace || '-' },
                            { label: "Yo'nalishi", value: searchResult.data.courseType || '-' },
                            { label: "O'qish muddati", value: searchResult.data.duration || '-' },
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
                    <h4 className="text-xl font-black text-slate-900 mb-2">Ma'lumot topilmadi</h4>
                    <p className="text-slate-500 mb-4">Kiritilgan hujjat bazada mavjud emas</p>
                    <button 
                      onClick={() => setSearchResult({status: 'idle'})} 
                      className="text-red-600 font-bold text-sm hover:underline"
                    >
                      Qayta urinish
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section 
        ref={chartsReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-1000 ${
          chartsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6">Umumiy taqsimot</h3>
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
                <span className="text-sm text-slate-500">Jami</span>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              {distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6">Yillar kesimida</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Bar name="Malaka oshirish" dataKey="malaka" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar name="Qayta tayyorlash" dataKey="qayta" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* News Section - Featured + 3 Small */}
      <section 
        ref={newsReveal.ref}
        className={`container mx-auto px-6 py-16 transition-all duration-1000 ${
          newsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-12">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Yangiliklar</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">So'nggi yangiliklar</h2>
        </div>
        
        {news.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Featured Card - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const mainItem = news[newsCarouselIndex];
                return (
                  <Link 
                    to={`/news/${mainItem.id}`} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full"
                  >
                    <div className="relative h-96 overflow-hidden">
                      <img 
                        src={mainItem.images?.[0]?.imageUrl || mainItem.image || '/placeholder.jpg'} 
                        alt={mainItem.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      {mainItem.isImportant && (
                        <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase rounded-full flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Muhim
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <span className="text-sm font-medium text-slate-400">{mainItem.date}</span>
                      <h3 className="text-3xl font-black text-slate-900 mt-3 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {mainItem.title}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 text-base mb-6">{mainItem.content}</p>
                      <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
                        Batafsil <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {news.length > 1 && (() => {
                const secondaryItem = news[(newsCarouselIndex + 1) % news.length];
                return (
                  <Link
                    to={`/news/${secondaryItem.id}`}
                    className="group grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-md transition-all duration-500 hover:shadow-xl md:grid-cols-[280px_1fr]"
                  >
                    <div className="h-56 overflow-hidden bg-slate-200 md:h-full">
                      <img
                        src={secondaryItem.images?.[0]?.imageUrl || secondaryItem.image || '/placeholder.jpg'}
                        alt={secondaryItem.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-sm font-medium text-slate-400">{secondaryItem.date}</span>
                      <h3 className="mt-3 text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-600">
                        {secondaryItem.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-slate-600">{secondaryItem.content}</p>
                      <div className="mt-5 flex items-center gap-2 font-bold text-blue-600">
                        Batafsil <ChevronRight size={18} />
                      </div>
                    </div>
                  </Link>
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
                  <Link 
                    to={`/news/${item.id}`} 
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={item.images?.[0]?.imageUrl || item.image || '/placeholder.jpg'} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-slate-400">{item.date}</span>
                      <h4 className="text-base font-black text-slate-900 mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 line-clamp-1 text-xs">{item.content}</p>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          </div>
            <div className="flex justify-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 font-bold text-blue-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                Ko'proq <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Hozircha yangiliklar mavjud emas</p>
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
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Resurslar</span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">Foydali manzillar</h2>
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
              <div className={`w-16 h-16 ${link.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {link.icon}
              </div>
              <h3 className="text-sm font-black text-slate-900 text-center">{link.name}</h3>
            </a>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="mb-10">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aloqa</span>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Bizning manzil</h2>
        </div>
        <div className="grid gap-6 rounded-[2rem] bg-white p-4 shadow-lg lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 min-h-[320px]">
            {aboutContent.mapEmbedUrl ? (
              <iframe
                src={aboutContent.mapEmbedUrl}
                title="Google xarita"
                className="h-full min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-100 text-slate-500">
                Google xarita havolasi kiritilmagan
              </div>
            )}
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Manzil ma'lumotlari</p>
            <p className="mt-6 text-lg leading-8 text-slate-200">{aboutContent.address || "Manzil ma'lumotlari kiritilmagan."}</p>
            {aboutContent.contactInfo && (
              <p className="mt-6 text-sm leading-7 text-slate-300">{aboutContent.contactInfo}</p>
            )}
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
    </div>
  );
};

export default Home;