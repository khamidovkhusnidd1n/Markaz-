import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Phone, Mail, MapPin, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { MENU_ITEMS, MenuItemType } from '../constants';
import { useApp } from '../context/AppContext';

const DesktopMenuItem = ({ item, level = 0 }: { item: MenuItemType, level?: number }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isExternal = item.path === 'external';
  
  // Recursively check if active
  const checkActive = (mi: MenuItemType): boolean => {
    if (mi.path === location.pathname && location.pathname !== '#') return true;
    if (mi.children) return mi.children.some(checkActive);
    return false;
  };
  const isActive = checkActive(item);

  const linkClasses = `flex items-center justify-between gap-1 text-sm font-medium transition-colors whitespace-nowrap px-2 xl:px-3 py-2 ${
    level === 0 
      ? (isActive ? 'text-blue-900 border-b-2 border-amber-500' : 'text-gray-600 hover:text-blue-700')
      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700 w-full px-4'
  }`;

  const content = (
    <>
      <span className="flex items-center gap-1">
        {level === 0 && item.icon} {item.label}
      </span>
      {isExternal && <ExternalLink size={14} className="ml-1" />}
      {hasChildren && level === 0 && <ChevronDown size={14} className="ml-1" />}
      {hasChildren && level > 0 && <ChevronRight size={14} className="ml-auto" />}
    </>
  );

  const AnchorOrLink = isExternal ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClasses}>
      {content}
    </a>
  ) : (
    <Link to={item.path || '#'} className={linkClasses}>
      {content}
    </Link>
  );

  if (!hasChildren) {
    return level === 0 ? AnchorOrLink : <li>{AnchorOrLink}</li>;
  }

  return (
    <div className={`group relative ${level > 0 ? 'w-full' : ''}`}>
      {AnchorOrLink}
      <ul className={`absolute z-50 hidden group-hover:block bg-white shadow-lg border border-gray-100 py-2 min-w-[260px] rounded-lg ${
        level === 0 ? 'top-full left-0 mt-0' : 'top-0 left-full -ml-1'
      }`}>
        {item.children!.map((child, idx) => (
          <DesktopMenuItem key={idx} item={child} level={level + 1} />
        ))}
      </ul>
    </div>
  );
};

const MobileMenuItem = ({ item, level = 0, closeMenu }: { item: MenuItemType, level?: number, closeMenu: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isExternal = item.path === 'external';

  const linkClasses = `flex items-center justify-between p-2 rounded transition-colors w-full text-left ${
    level === 0 ? 'hover:bg-gray-100 font-medium text-slate-800' : 'hover:bg-gray-50 text-sm text-gray-600'
  }`;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      if (!isExternal) closeMenu();
    }
  };

  const content = (
    <span className="flex items-center gap-2">
      {level === 0 && item.icon} {item.label}
    </span>
  );

  return (
    <div className={`w-full ${level > 0 ? 'pl-4 border-l-2 border-gray-100 ml-2 mt-1' : ''}`}>
      {isExternal ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClasses} onClick={() => closeMenu()}>
          {content} <ExternalLink size={16} />
        </a>
      ) : (
        <Link to={item.path || '#'} onClick={handleToggle} className={linkClasses}>
          {content}
          {hasChildren && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </Link>
      )}
      
      {hasChildren && isOpen && (
        <div className="flex flex-col gap-1 mt-1">
          {item.children!.map((child, idx) => (
            <MobileMenuItem key={idx} item={child} level={level + 1} closeMenu={closeMenu} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
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
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 py-4 flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img src={headerLogo} alt={`${siteName} logosi`} className="w-full h-full object-contain" />
            </div>
            <div className="max-w-[260px] sm:max-w-[320px] md:max-w-[380px] shrink-0">
              <h1 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold leading-tight text-blue-900 text-left">{siteName}</h1>
            </div>
          </Link>

          <nav className="hidden lg:flex flex-1 justify-end">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {MENU_ITEMS.map((item, idx) => (
                <DesktopMenuItem key={idx} item={item} />
              ))}
              
              <div className="flex items-center gap-1 ml-3 border-l pl-3 border-gray-200">
                <button className="px-2 py-1 text-[11px] font-bold rounded bg-blue-600 text-white">UZB</button>
                <button className="px-2 py-1 text-[11px] font-bold rounded text-gray-600 hover:text-blue-600 hover:bg-blue-50">RUS</button>
                <button className="px-2 py-1 text-[11px] font-bold rounded text-gray-600 hover:text-blue-600 hover:bg-blue-50">ENG</button>
              </div>
            </div>
          </nav>

          <button className="lg:hidden shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-6 flex flex-col gap-2 animate-slideDown max-h-[70vh] overflow-y-auto">
            {MENU_ITEMS.map((item, idx) => (
              <MobileMenuItem key={idx} item={item} closeMenu={() => setIsMenuOpen(false)} />
            ))}
            
            <div className="flex items-center gap-2 border-t pt-4 mt-2">
              <button className="px-3 py-1.5 text-xs font-bold rounded bg-blue-600 text-white">UZB</button>
              <button className="px-3 py-1.5 text-xs font-bold rounded text-gray-600 bg-gray-50">RUS</button>
              <button className="px-3 py-1.5 text-xs font-bold rounded text-gray-600 bg-gray-50">ENG</button>
            </div>
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
              <li><a href="/admin/" className="hover:text-amber-400">Admin kirish</a></li>
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
