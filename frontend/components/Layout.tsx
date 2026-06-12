import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Phone, Mail, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const location = useLocation();
  const { aboutContent } = useApp();

  const siteName = aboutContent.siteName || "O'zbekiston Badiiy akademiyasi huzuridagi Badiiy ta'lim yo'nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi";
  const headerLogo = aboutContent.headerLogo || '/logo/uzba_markaz.png';
  const footerLogo = aboutContent.footerLogo || headerLogo;
  const addressText = aboutContent.address || "Toshkent shahri, Uchtepa tumani, Chilonzor 26-daha, Shirin ko'cha, 1A";
  const contactText = aboutContent.contactInfo || 'uzbahuzuridagimarkaz@gmail.com';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButtons(window.scrollY > 240);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> (+99877) 363-38-36</span>
            <span className="flex items-center gap-1"><Mail size={12} /> {contactText}</span>
          </div>
          <div className="flex gap-4" />
        </div>
      </div>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img src={headerLogo} alt={`${siteName} logosi`} className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block max-w-[320px]">
              <h1 className="text-sm font-bold leading-tight text-blue-900">{siteName}</h1>
            </div>
          </Link>

          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex gap-6">
              {MENU_ITEMS.map((item) => (
                item.path === 'external' ? (
                  <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium hover:text-blue-700 transition-colors">
                    {item.label} <ExternalLink size={14} />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`text-sm font-medium hover:text-blue-700 transition-colors ${location.pathname === item.path ? 'text-blue-900 border-b-2 border-amber-500' : 'text-gray-600'}`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-white/95 px-2 py-1 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>

          <button className="lg:hidden shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-6 flex flex-col gap-4 animate-slideDown">
            <div className="pb-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-3">Tilni tanlang:</div>
              <div className="flex justify-center gap-2">
                <LanguageSwitcher />
              </div>
            </div>

            {MENU_ITEMS.map((item) => (
              item.path === 'external' ? (
                <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                >
                  {item.icon} {item.label}
                </Link>
              )
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src={footerLogo} alt={`${siteName} logosi`} className="h-12 w-12 rounded-full object-contain bg-white p-1" />
              <h3 className="text-xl font-bold">{siteName}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Badiiy ta'lim yo'nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Bog'lanish</h3>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="flex items-center gap-2"><MapPin size={16} /> {addressText}</li>
              <li className="flex items-center gap-2"><Phone size={16} /> (+99877) 363-38-36</li>
              <li className="flex items-center gap-2"><Mail size={16} /> {contactText}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Foydali havolalar</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link to="/journal" className="hover:text-amber-400">Ilmiy jurnal</Link></li>
              <li><a href="https://mt.uzbamalaka.uz" target="_blank" rel="noreferrer" className="hover:text-amber-400">Masofaviy ta'lim</a></li>
              <li><a href="https://reestr.uzbamalaka.uz" target="_blank" rel="noreferrer" className="hover:text-amber-400">Diplom va sertifikatlar yagona reestri</a></li>
              <li><Link to="/admin" className="hover:text-amber-400">Admin kirish</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} {siteName}. Barcha huquqlar himoyalangan.
        </div>
      </footer>

      <div
        className={`fixed bottom-6 right-6 z-[60] flex flex-col gap-3 transition-all duration-300 ${
          showScrollButtons ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Tepaga o'tish"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-amber-500"
        >
          <ChevronUp size={22} />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Pastga o'tish"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition hover:translate-y-0.5 hover:bg-blue-900"
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>
  );
};
