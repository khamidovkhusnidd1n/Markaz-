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
  const [stats, setStats] = useState<Statistics>(INITIAL_STATS);
  const [aboutContent, setAboutContent] = useState<AppContent>(defaultAbout);
  const [journalSettings, setJournalSettings] = useState<JournalSettings>(defaultJournalSettings);
  const [internationalSettings, setInternationalSettings] = useState<InternationalSettings>(defaultInternationalSettings);
  const [internationalPartners, setInternationalPartners] = useState<InternationalPartner[]>([]);
  const [internationalProjects, setInternationalProjects] = useState<InternationalProject[]>([]);
  const [internationalMedia, setInternationalMedia] = useState<InternationalMedia[]>([]);

  const refreshData = useCallback(async () => {
    setLoading(true);
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
      setStats(data.stats);
      setAboutContent(data.about);
      setJournalSettings(data.journalSettings);
      setInternationalSettings(data.internationalSettings);
      setInternationalPartners(data.internationalPartners);
      setInternationalProjects(data.internationalProjects);
      setInternationalMedia(data.internationalMedia);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading && news.length === 0 && gallery.length === 0) {
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
