import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Brush,
  FileText,
  Globe2,
  GraduationCap,
  Image,
  Info,
  Library,
  Mail,
  Phone,
  Newspaper,
  Send,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { BackendAPI } from '../services/backend';
import { useApp } from '../context/AppContext';

type AdminSection = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: 'statistics',
    label: 'Statistika',
    icon: <BarChart3 size={18} />,
    description: "Markaz ko'rsatkichlari va umumiy raqamlar shu bo'limda boshqariladi.",
  },
  {
    id: 'news',
    label: 'Yangiliklar',
    icon: <Newspaper size={18} />,
    description: "Saytdagi yangiliklar va e'lonlar shu yerda yuritiladi.",
  },
  {
    id: 'international',
    label: 'Xalqaro aloqalar',
    icon: <Globe2 size={18} />,
    description: 'Hamkorlar, loyihalar va xalqaro faoliyat kontenti shu bo‘limda bo‘ladi.',
  },
  {
    id: 'journal',
    label: 'Ilmiy jurnal',
    icon: <BookOpen size={18} />,
    description: 'Ilmiy jurnalga oid sonlar, fayllar va matnlar shu yerda boshqariladi.',
  },
  {
    id: 'students',
    label: 'Tinglovchilar uchun',
    icon: <Users size={18} />,
    description: 'Tinglovchilar uchun ma’lumotlar, reestr va tegishli materiallar shu yerda bo‘ladi.',
  },
  {
    id: 'open-data',
    label: "Ochiq ma'lumotlar",
    icon: <FileText size={18} />,
    description: "Ochiq ma'lumotlar va tegishli hujjatlar shu bo‘lim orqali boshqariladi.",
  },
  {
    id: 'about',
    label: 'Markaz haqida',
    icon: <Info size={18} />,
    description: 'Markaz tarixi, tuzilmasi va asosiy sahifa bloklari shu yerda yangilanadi.',
  },
  {
    id: 'programs',
    label: 'Kurslar',
    icon: <GraduationCap size={18} />,
    description: "Markaz kurslari, aloqa ma'lumotlari va kurs rasmlari shu yerda boshqariladi.",
  },
  {
    id: 'teachers',
    label: 'Ustozlar',
    icon: <Users size={18} />,
    description: "Ustozlar tarkibi va ularning ma'lumotlari shu bo'limda yuritiladi.",
  },
  {
    id: 'applications',
    label: 'Arizalar',
    icon: <Mail size={18} />,
    description: 'Kelgan arizalar bilan ishlash uchun bo‘lim shu yerda joylashadi.',
  },
  {
    id: 'appeals',
    label: 'Murojaatlar',
    icon: <Mail size={18} />,
    description: 'Foydalanuvchi murojaatlari va ularning holati shu bo‘limda yuritiladi.',
  },
  {
    id: 'site-settings',
    label: 'Sayt sozlamalari',
    icon: <Settings size={18} />,
    description: 'Saytning umumiy sozlamalari va texnik parametrlar shu yerda bo‘ladi.',
  },
  {
    id: 'photo-gallery',
    label: 'Foto galereya',
    icon: <Image size={18} />,
    description: 'Foto galereya elementlari va albomlari shu bo‘limdan boshqariladi.',
  },
  {
    id: 'art-gallery',
    label: 'Art galereya',
    icon: <Brush size={18} />,
    description: 'Art galereya uchun alohida kontent va kolleksiyalar shu yerda yuritiladi.',
  },
  {
    id: 'library',
    label: 'Kutubxona',
    icon: <Library size={18} />,
    description: 'Kutubxona materiallari va foydali resurslar shu bo‘limga joylanadi.',
  },
];

const AdminPanel: React.FC = () => {
  const app = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(BackendAPI.isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [credentials, setCredentials] = useState({ username: 'admin', password: '' });
  const [activeSection, setActiveSection] = useState('statistics');
  const [newsCategories, setNewsCategories] = useState<any[]>([]);

  const currentSection = useMemo(
    () => ADMIN_SECTIONS.find((section) => section.id === activeSection) ?? ADMIN_SECTIONS[0],
    [activeSection]
  );
  const safeCurrentSection = currentSection || ADMIN_SECTIONS[0];

  const runAction = async (action: () => Promise<unknown>, successMessage: string) => {
    setLoading(true);
    setMessage('');
    try {
      await action();
      await app.refreshData();
      const categories = await BackendAPI.getNewsCategories().catch(() => []);
      setNewsCategories(Array.isArray(categories) ? categories : []);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    BackendAPI.getNewsCategories()
      .then((items) => setNewsCategories(Array.isArray(items) ? items : []))
      .catch(() => setNewsCategories([]));
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await BackendAPI.login(credentials);
      setIsLoggedIn(true);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_35%),linear-gradient(135deg,#020617,#0f172a_45%,#172554)] px-4 py-16">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-700">
            Admin kirish
          </p>
          <h1 className="mb-2 text-3xl font-black text-slate-900">Boshqaruv paneli</h1>
          <p className="mb-8 text-sm text-slate-500">
            Login va parol orqali admin panelga kiring.
          </p>
          <div className="grid gap-4">
            <input
              className="rounded-xl border px-4 py-3"
              value={credentials.username}
              onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Login"
            />
            <input
              className="rounded-xl border px-4 py-3"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Parol"
            />
            <button
              disabled={loading}
              className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Kutilmoqda...' : 'Kirish'}
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-700">
              Admin panel
            </p>
            <h1 className="text-3xl font-black text-slate-900">
              Sayt boshqaruv markazi
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Saytga qaytish
            </Link>
            <button
              onClick={() => {
                BackendAPI.logout();
                setIsLoggedIn(false);
              }}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[2rem] bg-slate-950 p-4 text-white shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-4 rounded-[1.5rem] bg-white/5 px-4 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
              Bo‘limlar
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Chap tomondagi menyudan kerakli bo‘limni tanlang.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {ADMIN_SECTIONS.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-lg'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-white/10 text-blue-300'
                    }`}
                  >
                    {section.icon}
                  </span>
                  <span className="text-sm font-bold">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
                Faol bo‘lim
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {safeCurrentSection.label}
              </h2>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              {safeCurrentSection.icon}
            </div>
          </div>

          {activeSection === 'statistics' && (
            <StatisticsSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'news' && (
            <NewsSection
              app={app}
              loading={loading}
              runAction={runAction}
              categories={newsCategories}
            />
          )}
          {activeSection === 'international' && (
            <InternationalSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'journal' && (
            <JournalSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'students' && (
            <StudentsSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'open-data' && (
            <OpenDataSection loading={loading} runAction={runAction} app={app} />
          )}
          {activeSection === 'about' && (
            <AboutSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'programs' && (
            <ProgramsSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'teachers' && (
            <TeachersSection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'applications' && (
            <ApplicationsSection app={app} />
          )}
          {activeSection === 'appeals' && (
            <AppealsSection app={app} />
          )}
          {activeSection === 'library' && (
            <LibrarySection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'photo-gallery' && (
            <PhotoGallerySection app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'art-gallery' && (
            <ArtGallerySectionAdmin app={app} loading={loading} runAction={runAction} />
          )}
          {activeSection === 'site-settings' && (
            <EnhancedSiteSettingsSection
              loading={loading}
              runAction={runAction}
              categories={newsCategories}
              app={app}
            />
          )}
          {!['statistics', 'news', 'international', 'journal', 'students', 'open-data', 'about', 'programs', 'teachers', 'applications', 'appeals', 'library', 'photo-gallery', 'art-gallery', 'site-settings'].includes(activeSection) && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] bg-slate-50 p-6">
                <p className="text-base leading-7 text-slate-600">
                  {safeCurrentSection.description}
                </p>
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                    Keyingi qadam
                  </p>
                  <p className="mt-3 text-slate-600">
                    Shu bo‘lim uchun forma, jadval, filtrlash va CRUD imkoniyatlarini keyingi bosqichda quramiz.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
                  Reja
                </p>
                <ul className="mt-5 space-y-4 text-sm text-slate-300">
                  <li>Bo‘lim struktura va maydonlarini aniqlash</li>
                  <li>Frontend forma va jadval qismini qurish</li>
                  <li>API endpointlarni ulash</li>
                  <li>Validatsiya va saqlash logikasini tekshirish</li>
                </ul>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-[1.5rem] bg-slate-50 p-6">
    <h3 className="mb-4 text-xl font-black text-slate-900">{title}</h3>
    {children}
  </div>
);

const SubmitButton = ({ loading, label = 'Saqlash' }: { loading: boolean; label?: string }) => (
  <button disabled={loading} className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50">
    {loading ? 'Saqlanmoqda...' : label}
  </button>
);

const ModalShell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-black text-slate-900">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const StatisticsSection = ({ app, loading, runAction }: any) => {
  const [state, setState] = useState({
    totalPedagogs: app.stats.totalPedagogs,
    professors: app.stats.professors,
    dotsents: app.stats.dotsents,
    academics: app.stats.academics,
    potential: app.stats.potential,
  });
  const [yearly, setYearly] = useState({
    year: '',
    professional_development_count: 0,
    retraining_count: 0,
  });

  useEffect(() => {
    setState({
      totalPedagogs: app.stats.totalPedagogs,
      professors: app.stats.professors,
      dotsents: app.stats.dotsents,
      academics: app.stats.academics,
      potential: app.stats.potential,
    });
  }, [app.stats]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Dashboard statistikasi">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAction(() => BackendAPI.saveStats({ ...app.stats, ...state }), "Statistika yangilandi.");
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <input className="rounded-xl border px-4 py-3" type="number" value={state.totalPedagogs} onChange={(e) => setState((p) => ({ ...p, totalPedagogs: Number(e.target.value) }))} placeholder="Umumiy pedagoglar soni" />
            <input className="rounded-xl border px-4 py-3" type="number" value={state.professors} onChange={(e) => setState((p) => ({ ...p, professors: Number(e.target.value) }))} placeholder="Professorlar soni" />
            <input className="rounded-xl border px-4 py-3" type="number" value={state.dotsents} onChange={(e) => setState((p) => ({ ...p, dotsents: Number(e.target.value) }))} placeholder="Dotsentlar soni" />
            <input className="rounded-xl border px-4 py-3" type="number" value={state.academics} onChange={(e) => setState((p) => ({ ...p, academics: Number(e.target.value) }))} placeholder="Akademiklar soni" />
            <input className="rounded-xl border px-4 py-3 md:col-span-2" type="number" value={state.potential} onChange={(e) => setState((p) => ({ ...p, potential: Number(e.target.value) }))} placeholder="Ilmiy salohiyat %" />
            <div className="md:col-span-2">
              <SubmitButton loading={loading} />
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Joriy qiymatlar">
          <div className="space-y-3">
            {[
              ['Umumiy pedagoglar', app.stats.totalPedagogs],
              ['Professorlar', app.stats.professors],
              ['Dotsentlar', app.stats.dotsents],
              ['Akademiklar', app.stats.academics],
              ['Ilmiy salohiyat', `${app.stats.potential}%`],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <span className="text-lg font-black text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Yillar kesimida statistika">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAction(() => BackendAPI.createYearlyStatistic(yearly), "Yillik statistika qo'shildi.");
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <input className="rounded-xl border px-4 py-3" value={yearly.year} onChange={(e) => setYearly((p) => ({ ...p, year: e.target.value }))} placeholder="Yil" />
            <input className="rounded-xl border px-4 py-3" type="number" value={yearly.professional_development_count} onChange={(e) => setYearly((p) => ({ ...p, professional_development_count: Number(e.target.value) }))} placeholder="Malaka oshirganlar soni" />
            <input className="rounded-xl border px-4 py-3 md:col-span-2" type="number" value={yearly.retraining_count} onChange={(e) => setYearly((p) => ({ ...p, retraining_count: Number(e.target.value) }))} placeholder="Qayta tayyorlash kursida o'qiganlar soni" />
            <div className="md:col-span-2">
              <SubmitButton loading={loading} label="Yillik statistikani saqlash" />
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Kiritilgan qiymatlar">
          <div className="space-y-3">
            {(app.stats.studentsCount || []).map((item: any) => (
              <div key={item.year} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{item.year}</p>
                <p className="mt-1 text-sm text-slate-500">Malaka oshirish: {item.count}</p>
                <p className="text-sm text-slate-500">Qayta tayyorlash: {item.retraining}</p>
              </div>
            ))}
            {(!app.stats.studentsCount || app.stats.studentsCount.length === 0) && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                Hozircha yillik statistika kiritilmagan.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const NewsSection = ({ app, loading, runAction, categories }: any) => {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeNews = Array.isArray(app?.news) ? app.news : [];
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{ file: File; order: number }[]>([]);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [editState, setEditState] = useState({
    title: '',
    category: '',
    content: '',
    images: [] as { file: File; order: number }[],
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <SectionCard title="Yangilik qo‘shish">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAction(
              () =>
                BackendAPI.createNews({
                  title,
                  category,
                  content,
                  images: images.map((item) => item.file),
                  image_orders: images.map((item) => item.order),
                }),
              "Yangilik qo‘shildi."
            );
          }}
          className="grid gap-4"
        >
          <input className="rounded-xl border px-4 py-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mavzu" />
          <select className="rounded-xl border px-4 py-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Kategoriyani tanlang</option>
            {safeCategories.map((item: any) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <textarea className="min-h-32 rounded-xl border p-3" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Yangilik tavsifi" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImages(
                Array.from(e.target.files || []).map((file, index) => ({
                  file,
                  order: index,
                }))
              )
            }
          />
          {images.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              {images.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_120px] md:items-center">
                  <p className="truncate text-sm font-medium text-slate-700">{item.file.name}</p>
                  <input
                    className="rounded-xl border px-3 py-2"
                    type="number"
                    value={item.order}
                    onChange={(e) =>
                      setImages((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, order: Number(e.target.value) } : entry
                        )
                      )
                    }
                    placeholder="Tartib"
                  />
                </div>
              ))}
            </div>
          )}
          <SubmitButton loading={loading} />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud yangiliklar">
        <div className="space-y-3">
          {safeNews.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{item.category || 'Kategoriya tanlanmagan'}</p>
              <p className="mt-2 text-sm text-slate-500">{item.date}</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingNews(item);
                    setEditState({
                      title: item.title || '',
                      category: item.categoryId || '',
                      content: item.content || '',
                      images: [],
                    });
                  }}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                >
                  Tahrirlash
                </button>
                <button
                  type="button"
                  onClick={() => runAction(() => BackendAPI.deleteNews(String(item.id)), "Yangilik o'chirildi.")}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
                >
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {editingNews && (
        <ModalShell title="Yangilikni tahrirlash" onClose={() => setEditingNews(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAction(async () => {
                await BackendAPI.updateNews(String(editingNews.id), {
                  title: editState.title,
                  category: editState.category,
                  content: editState.content,
                  images: editState.images.map((item) => item.file),
                  image_orders: editState.images.map((item) => item.order),
                });
                setEditingNews(null);
              }, "Yangilik yangilandi.");
            }}
            className="grid gap-4"
          >
            <input className="rounded-xl border px-4 py-3" value={editState.title} onChange={(e) => setEditState((prev) => ({ ...prev, title: e.target.value }))} placeholder="Mavzu" />
            <select className="rounded-xl border px-4 py-3" value={editState.category} onChange={(e) => setEditState((prev) => ({ ...prev, category: e.target.value }))}>
              <option value="">Kategoriyani tanlang</option>
              {safeCategories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <textarea className="min-h-32 rounded-xl border p-3" value={editState.content} onChange={(e) => setEditState((prev) => ({ ...prev, content: e.target.value }))} placeholder="Yangilik tavsifi" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setEditState((prev) => ({
                  ...prev,
                  images: Array.from(e.target.files || []).map((file, index) => ({ file, order: index })),
                }))
              }
            />
            {editState.images.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                {editState.images.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_120px] md:items-center">
                    <p className="truncate text-sm font-medium text-slate-700">{item.file.name}</p>
                    <input
                      className="rounded-xl border px-3 py-2"
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        setEditState((prev) => ({
                          ...prev,
                          images: prev.images.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, order: Number(e.target.value) } : entry
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingNews(null)} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700">
                Bekor qilish
              </button>
              <SubmitButton loading={loading} label="Saqlash" />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
};

const InternationalSection = ({ app, loading, runAction }: any) => {
  const [aboutText, setAboutText] = useState(app.internationalSettings.aboutText || '');
  const [partner, setPartner] = useState({ name: '', country: '', description: '', order: 0, photo: null as File | null });
  const [project, setProject] = useState({
    title: '',
    description: '',
    partners_text: '',
    start_date: '',
    end_date: '',
    status: 'planned' as 'planned' | 'ongoing' | 'completed',
    order: 0,
    images: [] as { file: File; order: number }[],
  });
  const [photoMedia, setPhotoMedia] = useState({ title: '', description: '', order: 0, images: [] as File[] });
  const [video, setVideo] = useState({ title: '', description: '', youtube_url: '', order: 0 });

  useEffect(() => {
    setAboutText(app.internationalSettings.aboutText || '');
  }, [app.internationalSettings.aboutText]);

  return (
    <div className="space-y-6">
      <SectionCard title="Bo‘lim haqida">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.saveInternationalSettings({
            hero_title: app.internationalSettings.heroTitle || 'Xalqaro aloqalar',
            hero_description: app.internationalSettings.heroDescription || '',
            about_text: aboutText,
          }), "Bo‘lim tavsifi saqlandi.");
        }} className="grid gap-4">
          <textarea className="min-h-32 rounded-xl border p-3" value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="Bo‘lim tavsifi" />
          <SubmitButton loading={loading} />
        </form>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Xorijiy hamkor qo‘shish">
          <form onSubmit={(e) => {
            e.preventDefault();
            runAction(() => BackendAPI.createInternationalPartner(partner), "Hamkor qo‘shildi.");
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={partner.name} onChange={(e) => setPartner((p) => ({ ...p, name: e.target.value }))} placeholder="Hamkor nomi" />
            <input className="rounded-xl border px-4 py-3" value={partner.country} onChange={(e) => setPartner((p) => ({ ...p, country: e.target.value }))} placeholder="Mamlakat" />
            <textarea className="min-h-28 rounded-xl border p-3" value={partner.description} onChange={(e) => setPartner((p) => ({ ...p, description: e.target.value }))} placeholder="Hamkor tavsifi" />
            <input className="rounded-xl border px-4 py-3" type="number" value={partner.order} onChange={(e) => setPartner((p) => ({ ...p, order: Number(e.target.value) }))} placeholder="Tartib" />
            <input type="file" accept="image/*" onChange={(e) => setPartner((p) => ({ ...p, photo: e.target.files?.[0] || null }))} />
            <SubmitButton loading={loading} />
          </form>
        </SectionCard>

        <SectionCard title="Hamkorlar ro‘yxati">
          <div className="space-y-3">
            {app.internationalPartners.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.country}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Loyiha qo‘shish">
          <form onSubmit={(e) => {
            e.preventDefault();
            runAction(() => BackendAPI.createInternationalProject({
              ...project,
              images: project.images.map((item) => item.file),
              image_orders: project.images.map((item) => item.order),
            }), "Loyiha qo‘shildi.");
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={project.title} onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))} placeholder="Loyiha nomi" />
            <textarea className="min-h-24 rounded-xl border p-3" value={project.description} onChange={(e) => setProject((p) => ({ ...p, description: e.target.value }))} placeholder="Loyiha tavsifi" />
            <input className="rounded-xl border px-4 py-3" value={project.partners_text} onChange={(e) => setProject((p) => ({ ...p, partners_text: e.target.value }))} placeholder="Hamkorlar (vergul bilan)" />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border px-4 py-3" type="date" value={project.start_date} onChange={(e) => setProject((p) => ({ ...p, start_date: e.target.value }))} />
              <input className="rounded-xl border px-4 py-3" type="date" value={project.end_date} onChange={(e) => setProject((p) => ({ ...p, end_date: e.target.value }))} />
            </div>
            <select className="rounded-xl border px-4 py-3" value={project.status} onChange={(e) => setProject((p) => ({ ...p, status: e.target.value as any }))}>
              <option value="planned">Rejalashtirilgan</option>
              <option value="ongoing">Davom etmoqda</option>
              <option value="completed">Tugagan</option>
            </select>
            <input type="file" accept="image/*" multiple onChange={(e) => setProject((p) => ({ ...p, images: Array.from(e.target.files || []).map((file, index) => ({ file, order: index })) }))} />
            <SubmitButton loading={loading} />
          </form>
        </SectionCard>

        <SectionCard title="Loyihalar ro‘yxati">
          <div className="space-y-3">
            {app.internationalProjects.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.statusDisplay}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Fotosuratlar">
          <form onSubmit={(e) => {
            e.preventDefault();
            Promise.all(photoMedia.images.map((file, index) => BackendAPI.createInternationalMedia({
              title: photoMedia.title || `Foto ${index + 1}`,
              description: photoMedia.description,
              media_type: 'photo',
              order: photoMedia.order + index,
              image: file,
            }))).then(() => runAction(async () => Promise.resolve(), "Fotosuratlar qo‘shildi."));
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={photoMedia.title} onChange={(e) => setPhotoMedia((p) => ({ ...p, title: e.target.value }))} placeholder="Foto sarlavha" />
            <textarea className="min-h-24 rounded-xl border p-3" value={photoMedia.description} onChange={(e) => setPhotoMedia((p) => ({ ...p, description: e.target.value }))} placeholder="Foto tavsifi" />
            <input type="file" accept="image/*" multiple onChange={(e) => setPhotoMedia((p) => ({ ...p, images: Array.from(e.target.files || []) }))} />
            <SubmitButton loading={loading} label="Foto qo‘shish" />
          </form>
        </SectionCard>

        <SectionCard title="Videolar">
          <form onSubmit={(e) => {
            e.preventDefault();
            runAction(() => BackendAPI.createInternationalMedia({
              title: video.title,
              description: video.description,
              media_type: 'video',
              youtube_url: video.youtube_url,
              order: video.order,
            }), "Video qo‘shildi.");
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={video.title} onChange={(e) => setVideo((p) => ({ ...p, title: e.target.value }))} placeholder="Video sarlavha" />
            <textarea className="min-h-24 rounded-xl border p-3" value={video.description} onChange={(e) => setVideo((p) => ({ ...p, description: e.target.value }))} placeholder="Video tavsifi" />
            <input className="rounded-xl border px-4 py-3" value={video.youtube_url} onChange={(e) => setVideo((p) => ({ ...p, youtube_url: e.target.value }))} placeholder="YouTube link" />
            <SubmitButton loading={loading} label="Video qo‘shish" />
          </form>
        </SectionCard>
      </div>
    </div>
  );
};

const SiteSettingsSection = ({ loading, runAction, categories }: any) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Yangilik kategoriyalari">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.createNewsCategory({ name, slug, order }), "Kategoriya qo‘shildi.");
        }} className="grid gap-4">
          <input className="rounded-xl border px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kategoriya nomi" />
          <input className="rounded-xl border px-4 py-3" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
          <input className="rounded-xl border px-4 py-3" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="Tartib" />
          <SubmitButton loading={loading} label="Kategoriya qo‘shish" />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud kategoriyalar">
        <div className="space-y-3">
          {categories.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.slug}</p>
              </div>
              <button onClick={() => runAction(() => BackendAPI.deleteNewsCategory(String(item.id)), "Kategoriya o‘chirildi.")} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                O‘chirish
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

const EnhancedSiteSettingsSection = ({ loading, runAction, categories, app }: any) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState(0);
  const [settings, setSettings] = useState({
    site_name: app.aboutContent.siteName || '',
    contact_info: app.aboutContent.contactInfo || '',
    address: app.aboutContent.address || '',
    map_embed_url: app.aboutContent.mapEmbedUrl || '',
    hero_video_url: app.aboutContent.heroVideoUrl || '',
    header_logo: null as File | null,
    footer_logo: null as File | null,
    hero_images: [] as { file: File; order: number }[],
  });

  useEffect(() => {
    setSettings({
      site_name: app.aboutContent.siteName || '',
      contact_info: app.aboutContent.contactInfo || '',
      address: app.aboutContent.address || '',
      map_embed_url: app.aboutContent.mapEmbedUrl || '',
      hero_video_url: app.aboutContent.heroVideoUrl || '',
      header_logo: null,
      footer_logo: null,
      hero_images: [],
    });
  }, [app.aboutContent]);

  return (
    <div className="space-y-6">
      <SectionCard title="Hero banner, logotip va manzil">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.saveContent({
            history: app.aboutContent.history || '',
            structure: app.aboutContent.structure || '',
            student_notes: app.aboutContent.studentNotes || '',
            contact_info: settings.contact_info,
            address: settings.address,
            map_embed_url: settings.map_embed_url,
            site_name: settings.site_name,
            hero_video_url: settings.hero_video_url,
            header_logo: settings.header_logo,
            footer_logo: settings.footer_logo,
            hero_images: settings.hero_images.map((item) => item.file),
            hero_image_orders: settings.hero_images.map((item) => item.order),
          }), "Sayt sozlamalari saqlandi.");
        }} className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={settings.site_name} onChange={(e) => setSettings((p) => ({ ...p, site_name: e.target.value }))} placeholder="Sayt nomi" />
            <input className="rounded-xl border px-4 py-3" value={settings.hero_video_url} onChange={(e) => setSettings((p) => ({ ...p, hero_video_url: e.target.value }))} placeholder="Banner videosi (YouTube link)" />
            <label className="text-sm font-medium text-slate-600">Yuqori navbar logotipi</label>
            <input type="file" accept="image/*" onChange={(e) => setSettings((p) => ({ ...p, header_logo: e.target.files?.[0] || null }))} />
            <label className="text-sm font-medium text-slate-600">Pastki navbar logotipi</label>
            <input type="file" accept="image/*" onChange={(e) => setSettings((p) => ({ ...p, footer_logo: e.target.files?.[0] || null }))} />
            <label className="text-sm font-medium text-slate-600">Hero banner rasmlari</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setSettings((p) => ({ ...p, hero_images: Array.from(e.target.files || []).map((file, index) => ({ file, order: index })) }))} />
            {settings.hero_images.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                {settings.hero_images.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_120px] md:items-center">
                    <p className="truncate text-sm text-slate-700">{item.file.name}</p>
                    <input className="rounded-xl border px-3 py-2" type="number" value={item.order} onChange={(e) => setSettings((prev) => ({ ...prev, hero_images: prev.hero_images.map((entry, entryIndex) => entryIndex === index ? { ...entry, order: Number(e.target.value) } : entry) }))} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <textarea className="min-h-24 rounded-xl border p-3" value={settings.contact_info} onChange={(e) => setSettings((p) => ({ ...p, contact_info: e.target.value }))} placeholder="Bog'lanish ma'lumotlari" />
            <textarea className="min-h-24 rounded-xl border p-3" value={settings.address} onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))} placeholder="Manzil ma'lumotlari" />
            <input className="rounded-xl border px-4 py-3" value={settings.map_embed_url} onChange={(e) => setSettings((p) => ({ ...p, map_embed_url: e.target.value }))} placeholder="Google map embed link" />
            <SubmitButton loading={loading} label="Sayt sozlamalarini saqlash" />
          </div>
        </form>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Yangilik kategoriyalari">
          <form onSubmit={(e) => {
            e.preventDefault();
            runAction(() => BackendAPI.createNewsCategory({ name, slug, order }), "Kategoriya qo'shildi.");
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kategoriya nomi" />
            <input className="rounded-xl border px-4 py-3" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
            <input className="rounded-xl border px-4 py-3" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="Tartib" />
            <SubmitButton loading={loading} label="Kategoriya qo'shish" />
          </form>
        </SectionCard>

        <SectionCard title="Mavjud kategoriyalar">
          <div className="space-y-3">
            {categories.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.slug}</p>
                </div>
                <button onClick={() => runAction(() => BackendAPI.deleteNewsCategory(String(item.id)), "Kategoriya o'chirildi.")} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                  O'chirish
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const JournalSection = ({ app, loading, runAction }: any) => {
  const [settings, setSettings] = useState({
    about_journal: app.journalSettings.aboutJournal || '',
    article_rules_text: app.journalSettings.articleRulesText || '',
    phone: app.journalSettings.phone || '',
    editorial_address: app.journalSettings.editorialAddress || '',
    email: app.journalSettings.email || '',
    telegram_primary: app.journalSettings.telegramPrimary || '',
    telegram_secondary: app.journalSettings.telegramSecondary || '',
    instagram: app.journalSettings.instagram || '',
    facebook: app.journalSettings.facebook || '',
    article_rules_pdf: null as File | null,
  });
  const [issue, setIssue] = useState({ year: '', issue_number: '', pdf_file: null as File | null, thumbnail: null as File | null });

  return (
    <div className="space-y-6">
      <SectionCard title="Bog‘lanish va mualliflarga ko‘rsatmalar">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.saveJournalSettings(settings), "Jurnal sozlamalari saqlandi.");
        }} className="grid gap-4 md:grid-cols-2">
          <textarea className="min-h-28 rounded-xl border p-3 md:col-span-2" value={settings.about_journal} onChange={(e) => setSettings((p) => ({ ...p, about_journal: e.target.value }))} placeholder="Jurnal haqida" />
          <input className="rounded-xl border px-4 py-3" value={settings.phone} onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon raqam" />
          <input className="rounded-xl border px-4 py-3" value={settings.email} onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
          <textarea className="min-h-24 rounded-xl border p-3 md:col-span-2" value={settings.editorial_address} onChange={(e) => setSettings((p) => ({ ...p, editorial_address: e.target.value }))} placeholder="Tahririyat manzili" />
          <input className="rounded-xl border px-4 py-3" value={settings.telegram_primary} onChange={(e) => setSettings((p) => ({ ...p, telegram_primary: e.target.value }))} placeholder="Telegram link 1" />
          <input className="rounded-xl border px-4 py-3" value={settings.telegram_secondary} onChange={(e) => setSettings((p) => ({ ...p, telegram_secondary: e.target.value }))} placeholder="Telegram link 2" />
          <input className="rounded-xl border px-4 py-3" value={settings.instagram} onChange={(e) => setSettings((p) => ({ ...p, instagram: e.target.value }))} placeholder="Instagram link" />
          <input className="rounded-xl border px-4 py-3" value={settings.facebook} onChange={(e) => setSettings((p) => ({ ...p, facebook: e.target.value }))} placeholder="Facebook link" />
          <textarea className="min-h-32 rounded-xl border p-3 md:col-span-2" value={settings.article_rules_text} onChange={(e) => setSettings((p) => ({ ...p, article_rules_text: e.target.value }))} placeholder="Mualliflarga ko‘rsatmalar" />
          <input type="file" accept=".pdf" className="md:col-span-2" onChange={(e) => setSettings((p) => ({ ...p, article_rules_pdf: e.target.files?.[0] || null }))} />
          <div className="md:col-span-2"><SubmitButton loading={loading} /></div>
        </form>
      </SectionCard>

      <SectionCard title="Jurnal soni qo‘shish">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (issue.pdf_file) {
            runAction(() => BackendAPI.createJournalIssue(issue as any), "Jurnal soni qo‘shildi.");
          }
        }} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border px-4 py-3" value={issue.year} onChange={(e) => setIssue((p) => ({ ...p, year: e.target.value }))} placeholder="Yil" />
          <input className="rounded-xl border px-4 py-3" value={issue.issue_number} onChange={(e) => setIssue((p) => ({ ...p, issue_number: e.target.value }))} placeholder="Son raqami" />
          <input type="file" accept=".pdf" onChange={(e) => setIssue((p) => ({ ...p, pdf_file: e.target.files?.[0] || null }))} />
          <input type="file" accept="image/*" onChange={(e) => setIssue((p) => ({ ...p, thumbnail: e.target.files?.[0] || null }))} />
          <div className="md:col-span-2"><SubmitButton loading={loading} label="Jurnal sonini saqlash" /></div>
        </form>
      </SectionCard>
    </div>
  );
};

const StudentsSection = ({ app, loading, runAction }: any) => {
  const [listener, setListener] = useState({
    record_type: 'MO' as 'MO' | 'QT',
    full_name: '',
    workplace: '',
    course_type: '',
    number: '',
    duration: '',
  });
  const [importType, setImportType] = useState<'MO' | 'QT'>('MO');
  const [file, setFile] = useState<File | null>(null);
  const [documentState, setDocumentState] = useState({ title: '', file: null as File | null, cover_image: null as File | null });

  return (
    <div className="space-y-6">
      <SectionCard title="Malaka oshirish rejasi">
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={(e) => {
            e.preventDefault();
            runAction(() => BackendAPI.createListener(listener), "Reja yozuvi qo‘shildi.");
          }} className="grid gap-4">
            <input className="rounded-xl border px-4 py-3" value={listener.full_name} onChange={(e) => setListener((p) => ({ ...p, full_name: e.target.value }))} placeholder="F.I.SH" />
            <input className="rounded-xl border px-4 py-3" value={listener.workplace} onChange={(e) => setListener((p) => ({ ...p, workplace: e.target.value }))} placeholder="Asosiy ish joyi" />
            <input className="rounded-xl border px-4 py-3" value={listener.course_type} onChange={(e) => setListener((p) => ({ ...p, course_type: e.target.value }))} placeholder="Malaka oshirish yo‘nalishi" />
            <input className="rounded-xl border px-4 py-3" value={listener.duration} onChange={(e) => setListener((p) => ({ ...p, duration: e.target.value }))} placeholder="Malaka oshirish vaqti" />
            <input className="rounded-xl border px-4 py-3" value={listener.number} onChange={(e) => setListener((p) => ({ ...p, number: e.target.value }))} placeholder="Raqam" />
            <SubmitButton loading={loading} label="Yozuv qo‘shish" />
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Excel import</p>
            <div className="grid gap-3">
              <select className="rounded-xl border px-4 py-3" value={importType} onChange={(e) => setImportType(e.target.value as 'MO' | 'QT')}>
                <option value="MO">MO</option>
                <option value="QT">QT</option>
              </select>
              <input type="file" accept=".xls,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button type="button" disabled={!file || loading} onClick={() => file && runAction(() => BackendAPI.bulkImportListeners(file, importType), "Excel import bajarildi.")} className="rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-50">
                Excel import qilish
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Me’yoriy hujjatlar">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (documentState.file) {
            runAction(() => BackendAPI.createDocument({ title: documentState.title, category: 'regulatory', file: documentState.file, cover_image: documentState.cover_image }), "Me’yoriy hujjat qo‘shildi.");
          }
        }} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border px-4 py-3 md:col-span-2" value={documentState.title} onChange={(e) => setDocumentState((p) => ({ ...p, title: e.target.value }))} placeholder="Me’yoriy hujjat nomi" />
          <input type="file" onChange={(e) => setDocumentState((p) => ({ ...p, file: e.target.files?.[0] || null }))} />
          <input type="file" accept="image/*" onChange={(e) => setDocumentState((p) => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
          <div className="md:col-span-2"><SubmitButton loading={loading} label="Hujjatni saqlash" /></div>
        </form>
      </SectionCard>
    </div>
  );
};

const OpenDataSection = ({ loading, runAction, app }: any) => {
  const [state, setState] = useState({
    title: '',
    category: 'open_data' as 'open_data' | 'plan' | 'regulatory',
    file: null as File | null,
    cover_image: null as File | null,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Hujjat qo‘shish">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (state.file) {
            runAction(() => BackendAPI.createDocument(state as any), "Hujjat qo‘shildi.");
          }
        }} className="grid gap-4">
          <input className="rounded-xl border px-4 py-3" value={state.title} onChange={(e) => setState((p) => ({ ...p, title: e.target.value }))} placeholder="Nomi" />
          <select className="rounded-xl border px-4 py-3" value={state.category} onChange={(e) => setState((p) => ({ ...p, category: e.target.value as any }))}>
            <option value="open_data">Ochiq ma’lumotlar</option>
            <option value="plan">Ish rejalari</option>
            <option value="regulatory">Me’yoriy hujjatlar</option>
          </select>
          <input type="file" onChange={(e) => setState((p) => ({ ...p, file: e.target.files?.[0] || null }))} />
          <input type="file" accept="image/*" onChange={(e) => setState((p) => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
          <SubmitButton loading={loading} label="Hujjat qo‘shish" />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud hujjatlar">
        <div className="space-y-3">
          {app.documents.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500">{item.category}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

const AboutSection = ({ app, loading, runAction }: any) => {
  const [about, setAbout] = useState({
    history: app.aboutContent.history || '',
    structure: app.aboutContent.structure || '',
    student_notes: app.aboutContent.studentNotes || '',
    contact_info: app.aboutContent.contactInfo || '',
    address: app.aboutContent.address || '',
    map_embed_url: app.aboutContent.mapEmbedUrl || '',
    site_name: app.aboutContent.siteName || '',
    hero_video_url: app.aboutContent.heroVideoUrl || '',
    structure_image: null as File | null,
  });
  const [personnel, setPersonnel] = useState({
    full_name: '',
    position: '',
    phone: '',
    email: '',
    reception_hours: '',
    category: 'leadership' as 'leadership' | 'staff',
    duties: '',
    biography: '',
    order: 0,
    photo: null as File | null,
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Umumiy ma’lumot va tuzilma">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.saveContent(about), "Markaz haqida ma’lumot saqlandi.");
        }} className="grid gap-4">
          <textarea className="min-h-32 rounded-xl border p-3" value={about.history} onChange={(e) => setAbout((p) => ({ ...p, history: e.target.value }))} placeholder="Markaz haqida umumiy tavsif" />
          <textarea className="min-h-28 rounded-xl border p-3" value={about.structure} onChange={(e) => setAbout((p) => ({ ...p, structure: e.target.value }))} placeholder="Markaz tuzilmasi tavsifi" />
          <input type="file" accept="image/*" onChange={(e) => setAbout((p) => ({ ...p, structure_image: e.target.files?.[0] || null }))} />
          <SubmitButton loading={loading} />
        </form>
      </SectionCard>

      <SectionCard title="Rahbariyat / Markaziy apparat">
        <form onSubmit={(e) => {
          e.preventDefault();
          runAction(() => BackendAPI.createPersonnel(personnel), "Xodim qo‘shildi.");
        }} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border px-4 py-3" value={personnel.full_name} onChange={(e) => setPersonnel((p) => ({ ...p, full_name: e.target.value }))} placeholder="F.I.SH" />
          <input className="rounded-xl border px-4 py-3" value={personnel.position} onChange={(e) => setPersonnel((p) => ({ ...p, position: e.target.value }))} placeholder="Lavozimi" />
          <input className="rounded-xl border px-4 py-3" value={personnel.phone} onChange={(e) => setPersonnel((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon raqam" />
          <input className="rounded-xl border px-4 py-3" value={personnel.email} onChange={(e) => setPersonnel((p) => ({ ...p, email: e.target.value }))} placeholder="Elektron pochta" />
          <input className="rounded-xl border px-4 py-3" value={personnel.reception_hours} onChange={(e) => setPersonnel((p) => ({ ...p, reception_hours: e.target.value }))} placeholder="Qabul kunlari va vaqti" />
          <select className="rounded-xl border px-4 py-3" value={personnel.category} onChange={(e) => setPersonnel((p) => ({ ...p, category: e.target.value as any }))}>
            <option value="leadership">Rahbariyat</option>
            <option value="staff">Markaziy apparat</option>
          </select>
          <textarea className="min-h-24 rounded-xl border p-3 md:col-span-2" value={personnel.duties} onChange={(e) => setPersonnel((p) => ({ ...p, duties: e.target.value }))} placeholder="Vazifalari" />
          <textarea className="min-h-24 rounded-xl border p-3 md:col-span-2" value={personnel.biography} onChange={(e) => setPersonnel((p) => ({ ...p, biography: e.target.value }))} placeholder="Biografiyasi" />
          <input type="file" accept="image/*" className="md:col-span-2" onChange={(e) => setPersonnel((p) => ({ ...p, photo: e.target.files?.[0] || null }))} />
          <div className="md:col-span-2"><SubmitButton loading={loading} label="Xodimni saqlash" /></div>
        </form>
      </SectionCard>
    </div>
  );
};

const ProgramsSection = ({ app, loading, runAction }: any) => {
  const [program, setProgram] = useState({
    title: '',
    course_type: 'professional_development' as 'professional_development' | 'retraining' | 'short_professional_development' | 'profession_learning',
    duration: '',
    description: '',
    phone_numbers: '',
    email: '',
    telegram_link: '',
    order: 0,
    photo: null as File | null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetProgram = () => {
    setProgram({
      title: '',
      course_type: 'professional_development',
      duration: '',
      description: '',
      phone_numbers: '',
      email: '',
      telegram_link: '',
      order: 0,
      photo: null,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Kurslar boshqaruvi">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Yangi kurs qo'shish formasi modal oynada ochiladi. Kurs kartalarida rasm, tur, tavsif va aloqa ma'lumotlari ko'rinadi.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"
          >
            Kurs qo'shish
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Mavjud kurslar">
        <div className="space-y-3">
          {app.courses.map((item: any) => (
            <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[140px_1fr]">
              <div className="h-32 overflow-hidden rounded-2xl bg-slate-100">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">Kurs rasmi</div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">{item.typeDisplay || 'Kurs'}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{item.title}</p>
                {item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}
                <div className="mt-3 grid gap-2 text-sm text-slate-500">
                  {item.duration && <p>Davomiyligi: {item.duration}</p>}
                  {item.phoneNumbers && <p className="flex items-center gap-2"><Phone size={16} /> {item.phoneNumbers}</p>}
                  {item.email && <p className="flex items-center gap-2"><Mail size={16} /> {item.email}</p>}
                  {item.telegramLink && <p className="flex items-center gap-2"><Send size={16} /> {item.telegramLink}</p>}
                </div>
              </div>
            </div>
          ))}
          {app.courses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              Hozircha kurslar kiritilmagan.
            </div>
          )}
        </div>
      </SectionCard>
      {isModalOpen && (
        <ModalShell title="Yangi kurs qo'shish" onClose={() => setIsModalOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAction(async () => {
                await BackendAPI.createCourse(program);
                setIsModalOpen(false);
                resetProgram();
              }, "Kurs qo'shildi.");
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <input className="rounded-xl border px-4 py-3 md:col-span-2" value={program.title} onChange={(e) => setProgram((p) => ({ ...p, title: e.target.value }))} placeholder="Kurs nomi" />
            <select className="rounded-xl border px-4 py-3" value={program.course_type} onChange={(e) => setProgram((p) => ({ ...p, course_type: e.target.value as 'professional_development' | 'retraining' | 'short_professional_development' | 'profession_learning' }))}>
              <option value="retraining">Qayta tayyorlash</option>
              <option value="professional_development">Malaka oshirish</option>
              <option value="short_professional_development">Qisqa malaka oshirish</option>
              <option value="profession_learning">Kasb o'rganish</option>
            </select>
            <input className="rounded-xl border px-4 py-3" value={program.duration} onChange={(e) => setProgram((p) => ({ ...p, duration: e.target.value }))} placeholder="Davomiyligi" />
            <textarea className="min-h-28 rounded-xl border p-3 md:col-span-2" value={program.description} onChange={(e) => setProgram((p) => ({ ...p, description: e.target.value }))} placeholder="Kurs tavsiloti" />
            <input className="rounded-xl border px-4 py-3" value={program.phone_numbers} onChange={(e) => setProgram((p) => ({ ...p, phone_numbers: e.target.value }))} placeholder="Telefon raqamlar (vergul bilan)" />
            <input className="rounded-xl border px-4 py-3" type="email" value={program.email} onChange={(e) => setProgram((p) => ({ ...p, email: e.target.value }))} placeholder="Elektron pochta" />
            <input className="rounded-xl border px-4 py-3 md:col-span-2" value={program.telegram_link} onChange={(e) => setProgram((p) => ({ ...p, telegram_link: e.target.value }))} placeholder="Telegram link" />
            <input className="rounded-xl border px-4 py-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setProgram((p) => ({ ...p, photo: e.target.files?.[0] || null }))} />
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsModalOpen(false); resetProgram(); }} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700">
                Bekor qilish
              </button>
              <SubmitButton loading={loading} label="Kursni saqlash" />
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
};

const TeachersSection = ({ app, loading, runAction }: any) => {
  const [teacher, setTeacher] = useState({
    full_name: '',
    degree: '',
    title: '',
    awards: '',
    order: 0,
    photo: null as File | null,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Ustoz qo'shish">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAction(
              () =>
                BackendAPI.createTeacher({
                  full_name: teacher.full_name,
                  degree: teacher.degree,
                  title: teacher.title,
                  awards: teacher.awards,
                  order: teacher.order,
                  photo: teacher.photo,
                  position: teacher.title || teacher.degree || 'Ustoz',
                }),
              "Ustoz qo'shildi."
            );
          }}
          className="grid gap-4"
        >
          <input className="rounded-xl border px-4 py-3" value={teacher.full_name} onChange={(e) => setTeacher((p) => ({ ...p, full_name: e.target.value }))} placeholder="F.I.SH" />
          <input className="rounded-xl border px-4 py-3" value={teacher.degree} onChange={(e) => setTeacher((p) => ({ ...p, degree: e.target.value }))} placeholder="Ilmiy darajasi" />
          <input className="rounded-xl border px-4 py-3" value={teacher.title} onChange={(e) => setTeacher((p) => ({ ...p, title: e.target.value }))} placeholder="Ilmiy unvoni" />
          <input className="rounded-xl border px-4 py-3" value={teacher.awards} onChange={(e) => setTeacher((p) => ({ ...p, awards: e.target.value }))} placeholder="Davlat mukofotlari" />
          <input type="file" accept="image/*" onChange={(e) => setTeacher((p) => ({ ...p, photo: e.target.files?.[0] || null }))} />
          <SubmitButton loading={loading} label="Ustozni saqlash" />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud ustozlar">
        <div className="space-y-3">
          {app.teachers.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">{item.fullName}</p>
              <p className="mt-1 text-sm text-slate-500">{item.degree}</p>
              <p className="text-sm text-slate-500">{item.title}</p>
              {item.awards && <p className="text-sm text-amber-600">{item.awards}</p>}
            </div>
          ))}
          {app.teachers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              Hozircha ustozlar kiritilmagan.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

const AppealsSection = ({ app }: any) => (
  <SectionCard title="Kelgan murojaatlar">
    <div className="space-y-3">
      {(app.appeals || []).map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-blue-700">ID: {item.id}</p>
          <p className="mt-1 font-bold text-slate-900">{item.fullName}</p>
          <p className="text-sm text-slate-500">{item.appealTypeDisplay || item.appealType}</p>
          <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          <p className="mt-2 text-xs text-slate-500">{item.phone} {item.email ? `| ${item.email}` : ''}</p>
        </div>
      ))}
      {(!app.appeals || app.appeals.length === 0) && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
          Hozircha murojaatlar yo'q.
        </div>
      )}
    </div>
  </SectionCard>
);

const ApplicationsSection = ({ app }: any) => (
  <SectionCard title="Kelgan arizalar">
    <div className="space-y-3">
      {(app.applications || []).map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-blue-700">ID: {item.id}</p>
          <p className="mt-1 font-bold text-slate-900">{item.fullName}</p>
          <p className="text-sm text-slate-500">{item.applicationTypeDisplay || item.applicationType}</p>
          <p className="mt-1 text-sm text-slate-600">Ish joyi: {item.workplace}</p>
          <p className="text-sm text-slate-600">Yo'nalish: {item.direction}</p>
          <p className="mt-2 text-xs text-slate-500">{item.phone}</p>
        </div>
      ))}
      {(!app.applications || app.applications.length === 0) && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
          Hozircha arizalar yo'q.
        </div>
      )}
    </div>
  </SectionCard>
);

const LibrarySection = ({ app, loading, runAction }: any) => {
  const [state, setState] = useState({
    title: '',
    file: null as File | null,
    cover_image: null as File | null,
  });

  const libraryItems = (app.documents || []).filter((item: any) => item.category === 'library');

  return (
    <div className="space-y-6">
      <SectionCard title="Adabiyot qo'shish">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (state.file) {
              runAction(
                () => BackendAPI.createDocument({ title: state.title, category: 'library', file: state.file, cover_image: state.cover_image }),
                "Adabiyot qo'shildi."
              );
            }
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <input className="rounded-xl border px-4 py-3 md:col-span-2" value={state.title} onChange={(e) => setState((p) => ({ ...p, title: e.target.value }))} placeholder="Adabiyot nomi" />
          <input type="file" onChange={(e) => setState((p) => ({ ...p, file: e.target.files?.[0] || null }))} />
          <input type="file" accept="image/*" onChange={(e) => setState((p) => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
          <div className="md:col-span-2">
            <SubmitButton loading={loading} label="Adabiyotni saqlash" />
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Mavjud adabiyotlar">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {libraryItems.map((item: any) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[3/4] bg-slate-100">
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">Muqova yo'q</div>
                )}
              </div>
              <div className="p-4">
                <p className="line-clamp-2 font-bold text-slate-900">{item.title}</p>
              </div>
            </div>
          ))}
          {libraryItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              Hozircha adabiyotlar kiritilmagan.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

const PhotoGallerySection = ({ app, loading, runAction }: any) => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<{ file: File; order: number }[]>([]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Foto galereya qo‘shish">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (images.length > 0) {
            runAction(() => BackendAPI.createGalleryItem({
              title,
              order: 0,
              cover_image: images[0].file,
              images: images.map((item) => item.file),
              image_orders: images.map((item) => item.order),
            }), "Foto galereya qo‘shildi.");
          }
        }} className="grid gap-4">
          <input className="rounded-xl border px-4 py-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Foto tavsifi" />
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []).map((file, index) => ({ file, order: index })))} />
          {images.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              {images.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_120px] md:items-center">
                  <p className="truncate text-sm font-medium text-slate-700">{item.file.name}</p>
                  <input className="rounded-xl border px-3 py-2" type="number" value={item.order} onChange={(e) => setImages((prev) => prev.map((entry, entryIndex) => entryIndex === index ? { ...entry, order: Number(e.target.value) } : entry))} />
                </div>
              ))}
            </div>
          )}
          <SubmitButton loading={loading} label="Foto galereyani saqlash" />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud foto galereya">
        <div className="space-y-3">
          {app.gallery.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">{item.title || 'Foto galereya'}</p>
              <p className="text-sm text-slate-500">{item.images.length} ta rasm</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

const ArtGallerySectionAdmin = ({ app, loading, runAction }: any) => {
  const [state, setState] = useState({
    title: '',
    author: '',
    description: '',
    order: 0,
    image: null as File | null,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Art galereya asari qo‘shish">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (state.image) {
            runAction(() => BackendAPI.createArtGalleryItem({
              title: state.title,
              author: state.author,
              description: state.description,
              order: state.order,
              image: state.image,
            }), "Art galereya asari qo‘shildi.");
          }
        }} className="grid gap-4">
          <input className="rounded-xl border px-4 py-3" value={state.title} onChange={(e) => setState((p) => ({ ...p, title: e.target.value }))} placeholder="Asar nomi" />
          <input className="rounded-xl border px-4 py-3" value={state.author} onChange={(e) => setState((p) => ({ ...p, author: e.target.value }))} placeholder="Muallif" />
          <textarea className="min-h-24 rounded-xl border p-3" value={state.description} onChange={(e) => setState((p) => ({ ...p, description: e.target.value }))} placeholder="Tavsif" />
          <input type="file" accept="image/*" onChange={(e) => setState((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          <SubmitButton loading={loading} label="Asarni saqlash" />
        </form>
      </SectionCard>

      <SectionCard title="Mavjud art galereya">
        <div className="space-y-3">
          {(app.artGallery || []).map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500">{item.author}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};
