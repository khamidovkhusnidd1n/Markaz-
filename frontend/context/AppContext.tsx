import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AppContent,
  Appeal,
  Application,
  ArtGalleryItem,
  Course,
  Document,
  GalleryItem,
  InternationalMedia,
  InternationalPartner,
  InternationalProject,
  InternationalSettings,
  JournalIssue,
  JournalSettings,
  NewsItem,
  PDPlanRecord,
  Personnel,
  Statistics,
  Teacher,
} from '../types';
import { BackendAPI } from '../services/backend';
import { INITIAL_STATS } from '../constants';

interface AppState {
  news: NewsItem[];
  gallery: GalleryItem[];
  artGallery: ArtGalleryItem[];
  appeals: Appeal[];
  applications: Application[];
  teachers: Teacher[];
  courses: Course[];
  personnel: Personnel[];
  journalIssues: JournalIssue[];
  documents: Document[];
  pdPlans: PDPlanRecord[];
  stats: Statistics;
  aboutContent: AppContent;
  journalSettings: JournalSettings;
  internationalSettings: InternationalSettings;
  internationalPartners: InternationalPartner[];
  internationalProjects: InternationalProject[];
  internationalMedia: InternationalMedia[];
  loading: boolean;
  // BUG FIX: expose error state so UI can show a friendly message
  backendError: string | null;
  refreshData: () => Promise<void>;
}

const defaultAbout: AppContent = {
  history: '',
  structure: '',
  structureImage: '',
  studentNotes: '',
  contactInfo: '',
  address: '',
  mapEmbedUrl: '',
  siteName: '',
  headerLogo: '',
  footerLogo: '',
  heroVideoUrl: '',
  heroImages: [],
};

const defaultJournalSettings: JournalSettings = {
  articleRulesText: '',
  articleRulesPdfUrl: '',
  aboutJournal: '',
};

const defaultInternationalSettings: InternationalSettings = {
  heroTitle: '',
  heroDescription: '',
  aboutText: '',
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [artGallery, setArtGallery] = useState<ArtGalleryItem[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [journalIssues, setJournalIssues] = useState<JournalIssue[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pdPlans, setPdPlans] = useState<PDPlanRecord[]>([]);
  // BUG FIX: start with INITIAL_STATS so charts always have fallback data
  const [stats, setStats] = useState<Statistics>(INITIAL_STATS);
  const [aboutContent, setAboutContent] = useState<AppContent>(defaultAbout);
  const [journalSettings, setJournalSettings] = useState<JournalSettings>(defaultJournalSettings);
  const [internationalSettings, setInternationalSettings] = useState<InternationalSettings>(defaultInternationalSettings);
  const [internationalPartners, setInternationalPartners] = useState<InternationalPartner[]>([]);
  const [internationalProjects, setInternationalProjects] = useState<InternationalProject[]>([]);
  const [internationalMedia, setInternationalMedia] = useState<InternationalMedia[]>([]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setBackendError(null);
    try {
      const data = await BackendAPI.getAllData();
      setNews(data.news);
      setGallery(data.gallery);
      setArtGallery(data.artGallery || []);
      setAppeals(data.appeals || []);
      setApplications(data.applications || []);
      setTeachers(data.teachers);
      setCourses(data.courses);
      setPersonnel(data.personnel);
      setJournalIssues(data.journalIssues);
      setDocuments(data.documents);
      setPdPlans(data.pdPlans);
      // BUG FIX: only update stats if backend returned real data
      if (data.stats && (data.stats.totalPedagogs > 0 || data.stats.studentsCount.length > 0)) {
        setStats(data.stats);
      }
      setAboutContent(data.about);
      setJournalSettings(data.journalSettings);
      setInternationalSettings(data.internationalSettings);
      setInternationalPartners(data.internationalPartners);
      setInternationalProjects(data.internationalProjects);
      setInternationalMedia(data.internationalMedia);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik";
      console.error("Backend xatosi:", msg);
      // BUG FIX: store error but don't crash — keep existing/default data visible
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // BUG FIX: Don't block render waiting for backend — show skeleton only on very first load
  // when there's literally nothing to show yet
  if (loading && news.length === 0 && gallery.length === 0 && !backendError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500" />
          <p className="text-xs font-bold uppercase tracking-[0.3em]">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        news,
        gallery,
        artGallery,
        appeals,
        applications,
        teachers,
        courses,
        personnel,
        journalIssues,
        documents,
        pdPlans,
        stats,
        aboutContent,
        journalSettings,
        internationalSettings,
        internationalPartners,
        internationalProjects,
        internationalMedia,
        loading,
        backendError,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
