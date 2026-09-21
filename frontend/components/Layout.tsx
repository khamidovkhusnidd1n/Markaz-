import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Phone, Mail, MapPin, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { MENU_ITEMS, MenuItemType } from '../constants';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

const DesktopMenuItem = ({ item, level = 0 }: { item: MenuItemType, level?: number }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const hasChildren = item.children && item.children.length > 0;
  const isExternal = item.path === 'external';
  
  // Recursively check if active
  const checkActive = (mi: MenuItemType): boolean => {
    if (!mi.path || mi.path === '#' || mi.path === 'external') return mi.children ? mi.children.some(checkActive) : false;
    
    const currentFull = location.pathname + location.search;
    // If menu item path has query params, compare full path+query
    if (mi.path.includes('?')) {
      if (mi.path === currentFull) return true;
    } else if (mi.path.includes('#')) {
      const [p, h] = mi.path.split('#');
      if (p === location.pathname && location.hash === ('#' + h)) return true;
    } else {
      // Exact match or startsWith for dynamic sub-routes (e.g. /departments/2)
      if (mi.path === location.pathname) return true;
      if (mi.path.length > 1 && location.pathname.startsWith(mi.path + '/')) return true;
    }
    if (mi.children) return mi.children.some(checkActive);
    return false;
  };
  const isActive = checkActive(item);

  const linkClasses = `desktop-nav-link flex items-center justify-between gap-1 text-sm transition-colors whitespace-nowrap ${
    level === 0 
      ? `font-medium px-2 xl:px-3 py-2 ${isActive ? 'text-blue-900 border-b-2 border-amber-500' : 'text-gray-600 hover:text-blue-700'}`
      : `w-full px-3 py-2 my-0.5 rounded-md ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-700'}`
  }`;

  const label = item.i18nKey ? t(item.i18nKey) : item.label;

  const content = (
    <>
      <span className="flex items-center gap-1">
        {level === 0 && item.icon} {label}
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
      <ul className={`absolute z-50 hidden group-hover:flex flex-col bg-white shadow-xl border border-gray-100 p-1 min-w-[220px] rounded-xl overflow-hidden ${
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
  const { t } = useTranslation();
  const hasChildren = item.children && item.children.length > 0;
  const isExternal = item.path === 'external';

  const linkClasses = 'flex items-center justify-between p-2 rounded transition-colors w-full text-left ' + (
    level === 0 ? 'hover:bg-gray-100 font-medium text-slate-800' : 'hover:bg-gray-50 text-sm text-gray-600'
  );

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      if (!isExternal) closeMenu();
    }
  };

  const label = item.i18nKey ? t(item.i18nKey) : item.label;

  const content = (
    <span className="flex items-center gap-2">
      {level === 0 && item.icon} {label}
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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || 'uz';

  useEffect(() => {
    document.title = t('layout.site_title');
  }, [i18n.language, t]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const siteName = aboutContent.siteName || t('layout.site_name_fallback', "O'zbekiston Badiiy akademiyasi huzuridagi Badiiy ta'lim yo'nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi");
  const headerLogo = aboutContent.headerLogo || '/logo/uzba_markaz.png';
  const footerLogo = aboutContent.footerLogo || headerLogo;
  const addressText = aboutContent.address || t('layout.address_fallback', "Toshkent shahri, Uchtepa tumani, Chilonzor 26-daha, Shirin ko'cha, 1A");
  const contactText = aboutContent.contactInfo || 'uzbamalakamarkaz@umail.uz';

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

  const LangButton = ({ lang, label }: { lang: string, label: string }) => {
    const isActive = currentLang === lang;
    return (
      <button 
        onClick={() => changeLanguage(lang)}
        className={`px-2 py-1 text-[11px] font-bold rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
      >
        {label}
      </button>
    );
  };
  
  const MobileLangButton = ({ lang, label }: { lang: string, label: string }) => {
    const isActive = currentLang === lang;
    return (
      <button 
        onClick={() => { changeLanguage(lang); setIsMenuOpen(false); }}
        className={`px-3 py-1.5 text-xs font-bold rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 bg-gray-50'}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @keyframes seamless-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-seamless {
          display: flex;
          width: max-content;
          animation: seamless-marquee 25s linear infinite;
        }
      `}</style>
      <header className="bg-white shadow-md sticky top-0 z-50 flex flex-col">
        <div className="bg-blue-600 text-white py-2 border-b border-blue-700 flex items-center w-full overflow-hidden">
          <div className="animate-seamless text-[10px] md:text-xs font-bold tracking-wider uppercase">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="mx-16 whitespace-nowrap">{t('layout.test_mode')}</span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 py-4 flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img src={headerLogo} alt={t('layout.logo_alt', { name: siteName })} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 max-w-[200px] sm:max-w-[280px] md:max-w-[320px] max-[1850px]:max-w-[240px]">
              <h1 className="text-[9px] sm:text-[11px] md:text-[12px] max-[1850px]:text-[10px] font-bold leading-tight text-blue-900 text-left">{siteName}</h1>
            </div>
          </Link>

          <nav className="hidden 2xl:flex items-center gap-1 min-w-0">
            <div className="desktop-nav-container flex items-center gap-1">
              {MENU_ITEMS.map((item, idx) => (
                <DesktopMenuItem key={idx} item={item} />
              ))}
            </div>
            
            <div className="desktop-nav-lang-container flex items-center gap-1 ml-2 border-l pl-2 border-gray-200 shrink-0">
              <LangButton lang="uz" label="UZB" />
              <LangButton lang="ru" label="RUS" />
              <LangButton lang="en" label="ENG" />
            </div>
          </nav>

          <button className="2xl:hidden shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="2xl:hidden bg-white border-t px-4 py-6 flex flex-col gap-2 animate-slideDown max-h-[70vh] overflow-y-auto">
            {MENU_ITEMS.map((item, idx) => (
              <MobileMenuItem key={idx} item={item} closeMenu={() => setIsMenuOpen(false)} />
            ))}
            
            <div className="flex items-center gap-2 border-t pt-4 mt-2">
              <MobileLangButton lang="uz" label="UZB" />
              <MobileLangButton lang="ru" label="RUS" />
              <MobileLangButton lang="en" label="ENG" />
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
              <img src={footerLogo} alt={t('layout.logo_alt', { name: siteName })} className="h-12 w-12 rounded-full object-contain bg-white p-1 shrink-0" />
              <h3 className="text-sm font-bold text-slate-100 leading-snug">{siteName}</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              {t('layout.footer_description', "Badiiy ta'lim yo'nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi.")}
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-4 text-slate-100">{t('menu.contact', "Bog'lanish")}</h3>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-blue-400" /> {addressText}</li>
              <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-blue-400" /> (+99877) 363-38-36</li>
              <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-blue-400" /> {contactText}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold mb-4 text-slate-100">{t('layout.useful_links', "Foydali havolalar")}</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link to="/journal" className="hover:text-amber-400 transition-colors">{t('menu.journal', 'Ilmiy jurnal')}</Link></li>
              <li><a href="https://mt.uzbamalaka.uz" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">{t('menu.distance_edu', "Masofaviy ta'lim")}</a></li>
              <li><a href="https://reestr.uzbamalaka.uz" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">{t('menu.registry', "Diplom va sertifikatlar yagona reestri")}</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} {siteName}. {t('layout.all_rights')}
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
          aria-label={t('layout.scroll_top', "Tepaga o'tish")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-amber-500"
        >
          <ChevronUp size={22} />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label={t('layout.scroll_bottom', "Pastga o'tish")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition hover:translate-y-0.5 hover:bg-blue-900"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      <style>{`
        @media (min-width: 1536px) and (max-width: 1850px) {
          .desktop-nav-link {
            font-size: 11px !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
            gap: 2px !important;
          }
          .desktop-nav-link svg {
            width: 14px !important;
            height: 14px !important;
          }
          .desktop-nav-container {
            gap: 4px !important;
          }
          .desktop-nav-lang-container {
            margin-left: 6px !important;
            padding-left: 6px !important;
            gap: 2px !important;
          }
        }
      `}</style>
    </div>
  );
};
