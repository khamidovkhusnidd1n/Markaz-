import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Phone, Mail, MapPin, ChevronUp, ChevronDown, ChevronRight, Globe, MonitorPlay, Award, BookOpen, Scale, LayoutGrid, Landmark, LayoutDashboard, ClipboardList, UserCheck } from 'lucide-react';
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

  const linkClasses = `desktop-nav-link group/link flex items-center justify-between gap-1.5 transition-all duration-200 whitespace-nowrap ${
    level === 0 
      ? `font-semibold px-2 min-[1750px]:px-2.5 min-[1950px]:px-3 py-2 rounded-xl text-[11px] min-[1750px]:text-xs min-[1950px]:text-[13px] ${
          isActive
            ? 'bg-blue-50/90 text-blue-900 shadow-2xs ring-1 ring-blue-200/70'
            : 'text-slate-700 hover:text-blue-800 hover:bg-slate-100/80'
        }`
      : `w-full px-2.5 py-2 my-0.5 rounded-xl text-[13px] ${
          isActive
            ? 'bg-blue-50 text-blue-800 font-bold'
            : 'text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-800'
        }`
  }`;

  const label = item.i18nKey ? t(item.i18nKey) : item.label;

  const content = (
    <>
      <span className="flex items-center gap-2">
        {level === 0 && item.icon && (
          <span className={`inline-flex items-center justify-center transition-colors ${isActive ? 'text-blue-700' : 'text-blue-600/80 group-hover/link:text-blue-700'}`}>
            {item.icon}
          </span>
        )}
        {level > 0 && item.icon && (
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
            isActive
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 group-hover/link:bg-blue-600 group-hover/link:text-white'
          }`}>
            {item.icon}
          </span>
        )}
        <span>{label}</span>
      </span>
      {isExternal && <ExternalLink size={13} className="ml-1 shrink-0 text-slate-400 group-hover/link:text-blue-600 transition-colors" />}
      {hasChildren && level === 0 && <ChevronDown size={13} className="ml-0.5 shrink-0 text-slate-400 group-hover:rotate-180 group-hover:text-blue-700 transition-transform duration-200" />}
      {hasChildren && level > 0 && <ChevronRight size={14} className="ml-auto shrink-0 text-slate-400" />}
    </>
  );

  const isDummyPath = !item.path || item.path === '#';

  const AnchorOrLink = isExternal ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClasses}>
      {content}
    </a>
  ) : isDummyPath ? (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      className={`${linkClasses} cursor-pointer bg-transparent border-0`}
    >
      {content}
    </button>
  ) : (
    <Link to={item.path!} className={linkClasses}>
      {content}
    </Link>
  );

  if (!hasChildren) {
    return level === 0 ? AnchorOrLink : <li>{AnchorOrLink}</li>;
  }

  return (
    <div className={`group relative ${level > 0 ? 'w-full' : ''}`}>
      {AnchorOrLink}
      <ul className={`absolute z-50 hidden group-hover:flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/12 border border-slate-200/80 p-1.5 min-w-[260px] rounded-2xl overflow-hidden ${
        level === 0 ? 'top-full left-0 pt-2' : 'top-0 left-full -ml-1'
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

  const linkClasses = 'flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors w-full text-left touch-manipulation ' + (
    level === 0 ? 'hover:bg-slate-100 font-semibold text-slate-800 text-base' : 'hover:bg-slate-50 text-sm font-medium text-slate-600'
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
    <span className="flex items-center gap-2.5">
      {item.icon && (
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          level === 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {item.icon}
        </span>
      )}
      <span>{label}</span>
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
  const [isUsefulLinksOpen, setIsUsefulLinksOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col overflow-x-clip">
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
      <header className="bg-white shadow-md sticky top-0 z-50 flex flex-col w-full">
        <div className="bg-blue-600 text-white py-2 border-b border-blue-700 flex items-center w-full overflow-hidden">
          <div className="animate-seamless text-[10px] md:text-xs font-bold tracking-wider uppercase">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="mx-16 whitespace-nowrap">{t('layout.test_mode')}</span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[1920px] mx-auto px-3 lg:px-5 min-[1950px]:px-8 py-3.5 flex justify-between items-center gap-2 min-[1850px]:gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 2xl:w-11 2xl:h-11 min-[1850px]:w-12 min-[1850px]:h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img src={headerLogo} alt={t('layout.logo_alt', { name: siteName })} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 max-w-[210px] sm:max-w-[290px] md:max-w-[340px] 2xl:max-w-[190px] min-[1750px]:max-w-[230px] min-[1950px]:max-w-[270px]">
              <h1 className="text-[9px] sm:text-[11px] md:text-[12px] 2xl:text-[9.5px] min-[1750px]:text-[10.5px] min-[1950px]:text-[11.5px] font-bold leading-snug text-blue-900 text-left">{siteName}</h1>
            </div>
          </Link>

          <nav className="hidden 2xl:flex items-center justify-end gap-1 min-w-0 flex-1">
            <div className="desktop-nav-container flex items-center gap-0.5 min-[1750px]:gap-1 min-w-0">
              {MENU_ITEMS.map((item, idx) => (
                <DesktopMenuItem key={idx} item={item} />
              ))}
            </div>
            
            <div className="flex items-center gap-1 ml-1.5 min-[1850px]:ml-2 shrink-0">
              <button 
                onClick={() => setIsUsefulLinksOpen(true)}
                title={t('layout.useful_links', "Foydali havolalar")}
                className="rounded-lg bg-blue-900 hover:bg-blue-800 p-2 min-[1850px]:p-2.5 font-bold text-white shadow-sm transition-colors flex items-center justify-center mr-0.5 shrink-0"
              >
                <LayoutGrid size={18} />
              </button>
              
              <div className="desktop-nav-lang-container flex items-center gap-0.5 min-[1850px]:gap-1 border-l pl-1.5 min-[1850px]:pl-2 border-gray-200 shrink-0">
                <LangButton lang="uz" label="UZB" />
                <LangButton lang="ru" label="RUS" />
                <LangButton lang="en" label="ENG" />
              </div>
            </div>
          </nav>

          <button className="2xl:hidden shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="2xl:hidden bg-white border-t px-4 py-5 flex flex-col gap-2 animate-slideDown max-h-[82vh] overflow-y-auto overscroll-contain shadow-xl">
            <button 
              onClick={() => {
                setIsUsefulLinksOpen(true);
                setIsMenuOpen(false);
              }}
              className="rounded-xl bg-blue-900 hover:bg-blue-800 px-4 py-3 mb-2 font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <LayoutGrid size={18} />
              <span>{t('layout.useful_links', "Foydali havolalar")}</span>
            </button>
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
              <li><Link to="/anti-corruption" className="hover:text-amber-400 transition-colors">{t('menu.anti_corruption', 'Korrupsiyaga qarshi kurash')}</Link></li>
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
        .desktop-nav-link svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        @media (min-width: 1536px) and (max-width: 1750px) {
          .desktop-nav-link {
            font-size: 10.5px !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
            gap: 2px !important;
          }
          .desktop-nav-link svg {
            width: 13px !important;
            height: 13px !important;
          }
          .desktop-nav-container {
            gap: 2px !important;
          }
        }
      `}</style>

      {/* Foydali Havolalar Slide-over Drawer */}
      <div 
        className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isUsefulLinksOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={() => setIsUsefulLinksOpen(false)} 
        />
        <div 
          className={`relative w-full max-w-[380px] md:max-w-lg bg-white h-full shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col ${isUsefulLinksOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <Globe className="text-blue-700" size={20} />
              {t('layout.useful_links', "Foydali havolalar")}
            </h2>
            <button 
              onClick={() => setIsUsefulLinksOpen(false)} 
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Masofaviy ta'lim */}
              <a href="https://mt.uzbamalaka.uz" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <MonitorPlay size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-800">{t('home.links_distance_edu')}</span>
              </a>

              {/* Badiiy akademiya */}
              <a href="https://art-academy.uz/" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white group-hover:scale-105 transition-all">
                  <Landmark size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-800">{t('home.links_art_academy')}</span>
              </a>

              {/* MY.BIMM.UZ */}
              <a href="https://my.bimm.uz" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all">
                  <LayoutDashboard size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">MY.BIMM.UZ</span>
              </a>

              {/* LEX.UZ */}
              <a href="https://lex.uz" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all">
                  <Scale size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-800">LEX.UZ</span>
              </a>

              {/* Form uchun arizalar */}
              <a href="https://form.uzbamalaka.uz" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <ClipboardList size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-800">{t('home.links_forms')}</span>
              </a>

              {/* Davomat */}
              <a href="https://davomat.uzbamalaka.uz/" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <UserCheck size={22} strokeWidth={1.85} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">{t('menu.attendance')}</span>
              </a>
            </div>
          </div>
          
          <div className="p-5 md:p-6 bg-slate-50 border-t border-gray-100 text-center">
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.15em]">{t('layout.all_rights')}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
