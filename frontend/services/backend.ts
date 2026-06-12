import {
  AppContent,
  Appeal,
  Application,
  ArtGalleryItem,
  Course,
  Document,
  GalleryImage,
  GalleryItem,
  InternationalMedia,
  InternationalPartner,
  InternationalProject,
  InternationalProjectImage,
  InternationalSettings,
  JournalIssue,
  JournalSettings,
  NewsItem,
  Statistics,
  PDPlanRecord,
  Personnel,
  Teacher,
} from '../types';
import { INITIAL_STATS } from '../constants';

const API_URL_CACHE_KEY = 'working_api_base_url';
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

function safeStorageGet(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`localStorage get failed for ${key}`, error);
    return null;
  }
}

function safeStorageSet(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`localStorage set failed for ${key}`, error);
  }
}

function safeStorageRemove(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`localStorage remove failed for ${key}`, error);
  }
}

function readConfiguredApiUrl() {
  return (
    import.meta.env.VITE_API_URL?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    import.meta.env.REACT_APP_API_URL?.trim() ||
    import.meta.env.API_BASE_URL?.trim() ||
    ''
  );
}

function resolveApiBaseUrls() {
  const configured = readConfiguredApiUrl();

  if (typeof window === 'undefined') {
    return [configured || 'https://uzbamalaka.uz/api'];
  }

  const { protocol, hostname, origin } = window.location;
  const isLocalHost = ['localhost', '127.0.0.1'].includes(hostname);
  const candidates = new Set<string>();
  const cached = safeStorageGet(API_URL_CACHE_KEY)?.trim();
  const alternateHostnames = new Set<string>();

  alternateHostnames.add(hostname);
  if (hostname.startsWith('www.')) {
    alternateHostnames.add(hostname.replace(/^www\./, ''));
  } else {
    alternateHostnames.add(`www.${hostname}`);
  }

  // Prefer explicit env configuration over previously cached guesses.
  if (configured) {
    candidates.add(configured);
  }

  if (cached && cached !== configured) {
    candidates.add(cached);
  }

  if (isLocalHost) {
    candidates.add(`${origin}/api`);
    candidates.add(`${protocol}//127.0.0.1:8000/api`);
    candidates.add(`${protocol}//127.0.0.1:8001/api`);
    candidates.add('http://localhost:8000/api');
    candidates.add('http://localhost:8001/api');
    return Array.from(candidates);
  }

  candidates.add(`${origin}/api`);
  for (const host of alternateHostnames) {
    candidates.add(`https://${host}/api`);
    candidates.add(`http://${host}/api`);
  }
  candidates.add('https://uzbamalaka.uz/api');
  candidates.add('https://www.uzbamalaka.uz/api');
  candidates.add('http://uzbamalaka.uz/api');
  candidates.add('http://www.uzbamalaka.uz/api');

  return Array.from(candidates);
}

function getApiBaseUrls() {
  const configured = readConfiguredApiUrl();
  const cached = safeStorageGet(API_URL_CACHE_KEY)?.trim();

  // Auto-heal older browser state when the app ships with a new API URL.
  if (configured && cached && cached !== configured) {
    safeStorageRemove(API_URL_CACHE_KEY);
  }

  return resolveApiBaseUrls();
}

function backendUnavailableMessage() {
  const candidates = getApiBaseUrls().join(', ');
  return `Backend bilan ulanishda xatolik. Backend server ishlayotganini tekshiring. Tekshirilgan manzillar: ${candidates}`;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function shouldTryNextBaseUrl(response: Response) {
  return response.status === 404;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retried = false): Promise<T> {
  const token = safeStorageGet(TOKEN_KEY);
  const headers: HeadersInit = { ...options.headers };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  let response: Response | null = null;
  let successfulBaseUrl: string | null = null;

  for (const baseUrl of getApiBaseUrls()) {
    try {
      const candidateResponse = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
      if (shouldTryNextBaseUrl(candidateResponse)) {
        response = candidateResponse;
        continue;
      }

      response = candidateResponse;
      successfulBaseUrl = baseUrl;
      break;
    } catch (error) {
      response = null;
    }
  }

  if (!response) {
    throw new Error(backendUnavailableMessage());
  }

  if (successfulBaseUrl) {
    safeStorageSet(API_URL_CACHE_KEY, successfulBaseUrl);
  }

  if (response.status === 401 && !retried) {
    const refreshed = await BackendAPI.refreshToken();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, true);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

const toDate = (value?: string) => (value ? new Date(value).toLocaleDateString('uz-UZ') : '');

function transformNewsItem(item: any): NewsItem {
  const images = (item.images || []).map((img: any) => ({
    id: String(img.id),
    imageUrl: img.image_url || '',
    order: img.order || 0,
  }));

  return {
    id: String(item.id),
    title: item.title || '',
    category: item.category_name || '',
    categoryId: item.category_id ? String(item.category_id) : '',
    content: item.content || '',
    date: toDate(item.created_at),
    image: images[0]?.imageUrl || item.image_url || '',
    images,
    isImportant: item.is_important,
    isActive: item.is_active,
  };
}

function transformGalleryItem(item: any): GalleryItem {
  return {
    id: String(item.id),
    title: item.title || '',
    coverImageUrl: item.cover_image_url || '',
    images: (item.images || []).map((img: any): GalleryImage => ({
      id: String(img.id),
      imageUrl: img.image_url || '',
      order: img.order || 0,
    })),
    order: item.order || 0,
    isActive: item.is_active,
  };
}

function transformArtGalleryItem(item: any): ArtGalleryItem {
  return {
    id: String(item.id),
    imageUrl: item.image_url || '',
    title: item.title || '',
    author: item.author || '',
    description: item.description || '',
    createdAt: item.created_at || '',
    order: item.order || 0,
    isActive: item.is_active,
  };
}

function transformAppeal(item: any): Appeal {
  return {
    id: String(item.id),
    fullName: item.full_name || '',
    appealType: item.appeal_type,
    appealTypeDisplay: item.appeal_type_display || '',
    description: item.description || '',
    phone: item.phone || '',
    email: item.email || '',
    telegramLink: item.telegram_link || '',
    createdAt: item.created_at || '',
  };
}

function transformApplication(item: any): Application {
  return {
    id: String(item.id),
    fullName: item.full_name || '',
    applicationType: item.application_type,
    applicationTypeDisplay: item.application_type_display || '',
    workplace: item.workplace || '',
    direction: item.direction || '',
    phone: item.phone || '',
    telegramLink: item.telegram_link || '',
    createdAt: item.created_at || '',
  };
}

function transformTeacher(item: any): Teacher {
  return {
    id: String(item.id),
    fullName: item.full_name || '',
    position: item.position || '',
    degree: item.degree || '',
    title: item.title || '',
    awards: item.awards || '',
    photoUrl: item.photo_url || '',
  };
}

function transformPersonnel(item: any): Personnel {
  return {
    id: String(item.id),
    fullName: item.full_name || '',
    position: item.position || '',
    phone: item.phone || '',
    email: item.email || '',
    receptionHours: item.reception_hours || '',
    photoUrl: item.photo_url || '',
    category: item.category,
    duties: item.duties || '',
    biography: item.biography || '',
  };
}

function transformCourse(item: any): Course {
  return {
    id: String(item.id),
    title: item.title || '',
    type: item.course_type,
    typeDisplay: item.course_type_display || '',
    duration: item.duration || '',
    description: item.description || '',
    phoneNumbers: item.phone_numbers || '',
    email: item.email || '',
    telegramLink: item.telegram_link || '',
    photoUrl: item.photo_url || '',
  };
}

function transformJournalIssue(item: any): JournalIssue {
  return {
    id: String(item.id),
    year: item.year || '',
    issueNumber: item.issue_number || '',
    pdfUrl: item.pdf_url || '',
    thumbnailUrl: item.thumbnail_url || '',
  };
}

function transformDocument(item: any): Document {
  return {
    id: String(item.id),
    title: item.title || '',
    category: item.category,
    fileUrl: item.file_url || '',
    coverImageUrl: item.cover_image_url || '',
    date: toDate(item.created_at),
  };
}

function transformPDPlanRecord(item: any): PDPlanRecord {
  const recordType = ((item.record_type || item.series || 'MO').toUpperCase() === 'QT' ? 'QT' : 'MO') as 'MO' | 'QT';
  return {
    id: String(item.id),
    recordType,
    fullName: item.full_name || '',
    workplace: item.workplace || '',
    courseType: item.course_type || '',
    series: item.series || recordType,
    number: item.number || '',
    duration: item.duration || '',
    isVerified: item.is_verified,
  };
}

function transformStatistics(data: any): Statistics {
  if (!data) return INITIAL_STATS;
  const yearly = data.yearly_data || [];
  return {
    totalPedagogs: data.total_pedagogs || 0,
    professors: data.professors || 0,
    dotsents: data.dotsents || 0,
    academics: data.academics || 0,
    potential: data.potential || 0,
    studentsCount: yearly.map((item: any) => ({
      year: item.year,
      count: item.professional_development_count || 0,
      retraining: item.retraining_count || 0,
    })),
    retrainingCount: yearly.map((item: any) => ({
      year: item.year,
      count: item.retraining_count || 0,
    })),
  };
}

function transformAppContent(data: any): AppContent {
  return {
    history: data?.history || '',
    structure: data?.structure || '',
    structureImage: data?.structure_image_url || '',
    studentNotes: data?.student_notes || '',
    contactInfo: data?.contact_info || '',
    address: data?.address || '',
    mapEmbedUrl: data?.map_embed_url || '',
    siteName: data?.site_name || '',
    headerLogo: data?.header_logo_url || '',
    footerLogo: data?.footer_logo_url || '',
    heroVideoUrl: data?.hero_video_url || '',
    heroImages: (data?.hero_images || []).map((item: any) => ({
      id: String(item.id),
      imageUrl: item.image_url || '',
      order: item.order || 0,
    })),
  };
}

function transformJournalSettings(data: any): JournalSettings {
  return {
    articleRulesText: data?.article_rules_text || '',
    articleRulesPdfUrl: data?.article_rules_pdf_url || '',
    aboutJournal: data?.about_journal || '',
    phone: data?.phone || '',
    editorialAddress: data?.editorial_address || '',
    email: data?.email || '',
    telegramPrimary: data?.telegram_primary || '',
    telegramSecondary: data?.telegram_secondary || '',
    instagram: data?.instagram || '',
    facebook: data?.facebook || '',
  };
}

function transformInternationalSettings(data: any): InternationalSettings {
  return {
    heroTitle: data?.hero_title || '',
    heroDescription: data?.hero_description || '',
    aboutText: data?.about_text || '',
  };
}

function transformInternationalPartner(item: any): InternationalPartner {
  return {
    id: String(item.id),
    name: item.name || '',
    country: item.country || '',
    description: item.description || '',
    photoUrl: item.photo_url || '',
    order: item.order || 0,
    isActive: item.is_active,
  };
}

function transformInternationalProject(item: any): InternationalProject {
  return {
    id: String(item.id),
    title: item.title || '',
    description: item.description || '',
    partners: item.partners || [],
    partnersText: item.partners_text || '',
    startDate: item.start_date || '',
    endDate: item.end_date || '',
    status: item.status,
    statusDisplay: item.status_display || '',
    images: (item.images || []).map((img: any): InternationalProjectImage => ({
      id: String(img.id),
      imageUrl: img.image_url || '',
      order: img.order || 0,
    })),
    order: item.order || 0,
    isActive: item.is_active,
  };
}

function transformInternationalMedia(item: any): InternationalMedia {
  return {
    id: String(item.id),
    title: item.title || '',
    description: item.description || '',
    mediaType: item.media_type,
    imageUrl: item.image_url || '',
    youtubeUrl: item.youtube_url || '',
    order: item.order || 0,
    isActive: item.is_active,
  };
}

function toFormData(payload: Record<string, string | Blob | number | boolean | undefined | null>) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, typeof value === 'boolean' ? String(value) : (value as string | Blob));
    }
  });
  return formData;
}

export const BackendAPI = {
  async getAllData() {
    const data = await apiRequest<any>('/all-data/');
    return {
      news: (data.news || []).map(transformNewsItem),
      gallery: (data.gallery || []).map(transformGalleryItem),
      artGallery: (data.artGallery || []).map(transformArtGalleryItem),
      appeals: (data.appeals || []).map(transformAppeal),
      applications: (data.applications || []).map(transformApplication),
      teachers: (data.teachers || []).map(transformTeacher),
      courses: (data.courses || []).map(transformCourse),
      personnel: (data.personnel || []).map(transformPersonnel),
      journalIssues: (data.journalIssues || data.journal_issues || []).map(transformJournalIssue),
      documents: (data.documents || []).map(transformDocument),
      pdPlans: (data.listeners || []).map(transformPDPlanRecord),
      stats: transformStatistics(data.stats),
      about: transformAppContent(data.about),
      journalSettings: transformJournalSettings(data.journalSettings),
      internationalSettings: transformInternationalSettings(data.internationalSettings),
      internationalPartners: (data.internationalPartners || []).map(transformInternationalPartner),
      internationalProjects: (data.internationalProjects || []).map(transformInternationalProject),
      internationalMedia: (data.internationalMedia || []).map(transformInternationalMedia),
    };
  },

  async login(credentials: { username: string; password: string }) {
    let response: Response | null = null;
    let successfulBaseUrl: string | null = null;

    for (const baseUrl of getApiBaseUrls()) {
      try {
        const candidateResponse = await fetch(`${baseUrl}/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (shouldTryNextBaseUrl(candidateResponse)) {
          response = candidateResponse;
          continue;
        }

        response = candidateResponse;
        successfulBaseUrl = baseUrl;
        break;
      } catch (error) {
        response = null;
      }
    }

    if (!response) {
      throw new Error(backendUnavailableMessage());
    }

    if (successfulBaseUrl) {
      safeStorageSet(API_URL_CACHE_KEY, successfulBaseUrl);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login yoki parol noto'g'ri!");
    }

    safeStorageSet(TOKEN_KEY, data.token || 'static-admin-token');
    if (data.refresh) {
      safeStorageSet(REFRESH_KEY, data.refresh);
    } else {
      safeStorageRemove(REFRESH_KEY);
    }
    return data;
  },

  logout() {
    safeStorageRemove(TOKEN_KEY);
    safeStorageRemove(REFRESH_KEY);
  },

  isAuthenticated() {
    return Boolean(safeStorageGet(TOKEN_KEY));
  },

  async refreshToken() {
    const refresh = safeStorageGet(REFRESH_KEY);
    if (!refresh) return false;

    try {
      const data = await apiRequest<{ access?: string }>('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
      if (data.access) {
        safeStorageSet(TOKEN_KEY, data.access);
        return true;
      }
    } catch (error) {
      console.warn('Token refresh failed', error);
    }
    this.logout();
    return false;
  },

  async saveStats(stats: Statistics) {
    return apiRequest('/statistics/', {
      method: 'POST',
      body: JSON.stringify({
        total_pedagogs: stats.totalPedagogs,
        professors: stats.professors,
        dotsents: stats.dotsents,
        academics: stats.academics,
        potential: stats.potential,
      }),
    });
  },

  async getNewsCategories() {
    return apiRequest<any[]>('/news-categories/');
  },

  async createNewsCategory(payload: { name: string; slug: string; order: number }) {
    return apiRequest('/news-categories/', {
      method: 'POST',
      body: JSON.stringify({ ...payload, is_active: true }),
    });
  },

  async deleteNewsCategory(id: string) {
    return apiRequest(`/news-categories/${id}/`, { method: 'DELETE' });
  },

  async createYearlyStatistic(payload: { year: string; professional_development_count: number; retraining_count: number }) {
    return apiRequest('/yearly-statistics/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteYearlyStatistic(id: string) {
    return apiRequest(`/yearly-statistics/${id}/`, { method: 'DELETE' });
  },

  async saveContent(payload: {
    history: string;
    structure: string;
    student_notes: string;
    contact_info: string;
    address: string;
    map_embed_url: string;
    site_name: string;
    hero_video_url: string;
    structure_image?: File | null;
    header_logo?: File | null;
    footer_logo?: File | null;
    hero_images?: File[];
    hero_image_orders?: number[];
  }) {
    const formData = toFormData({
      history: payload.history,
      structure: payload.structure,
      student_notes: payload.student_notes,
      contact_info: payload.contact_info,
      address: payload.address,
      map_embed_url: payload.map_embed_url,
      site_name: payload.site_name,
      hero_video_url: payload.hero_video_url,
      structure_image: payload.structure_image || null,
      header_logo: payload.header_logo || null,
      footer_logo: payload.footer_logo || null,
    });
    (payload.hero_images || []).forEach((file, idx) => {
      formData.append('hero_images', file);
      formData.append('hero_image_orders', String(payload.hero_image_orders?.[idx] ?? idx));
    });
    return apiRequest('/content/', {
      method: 'POST',
      body: formData,
    });
  },

  async saveJournalSettings(payload: {
    article_rules_text: string;
    about_journal: string;
    phone: string;
    editorial_address: string;
    email: string;
    telegram_primary: string;
    telegram_secondary: string;
    instagram: string;
    facebook: string;
    article_rules_pdf?: File | null;
  }) {
    return apiRequest('/journal-settings/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async saveInternationalSettings(payload: {
    hero_title: string;
    hero_description: string;
    about_text: string;
  }) {
    return apiRequest('/international-settings/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createNews(payload: {
    title: string;
    category?: string;
    content: string;
    is_important?: boolean;
    images?: File[];
    image_orders?: number[];
  }) {
    const formData = toFormData({
      title: payload.title,
      category: payload.category || '',
      content: payload.content,
      is_important: payload.is_important ?? false,
      is_active: true,
    });
    (payload.images || []).forEach((file, idx) => {
      formData.append('images', file);
      formData.append('image_orders', String(payload.image_orders?.[idx] ?? idx));
    });
    return apiRequest('/news/', { method: 'POST', body: formData });
  },

  async deleteNews(id: string) {
    return apiRequest(`/news/${id}/`, { method: 'DELETE' });
  },

  async updateNews(id: string, payload: {
    title: string;
    category?: string;
    content: string;
    is_important?: boolean;
    images?: File[];
    image_orders?: number[];
  }) {
    const formData = toFormData({
      title: payload.title,
      category: payload.category || '',
      content: payload.content,
      is_important: payload.is_important ?? false,
    });
    (payload.images || []).forEach((file, idx) => {
      formData.append('images', file);
      formData.append('image_orders', String(payload.image_orders?.[idx] ?? idx));
    });
    return apiRequest(`/news/${id}/`, { method: 'PATCH', body: formData });
  },

  async createGalleryItem(payload: {
    title: string;
    order: number;
    cover_image?: File | null;
    images?: File[];
    image_orders?: number[];
  }) {
    const formData = toFormData({
      title: payload.title,
      order: payload.order,
      cover_image: payload.cover_image || payload.images?.[0] || null,
    });
    (payload.images || []).forEach((file, idx) => {
      formData.append('images', file);
      formData.append('image_orders', String(payload.image_orders?.[idx] ?? idx));
    });
    return apiRequest('/gallery/', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteGalleryItem(id: string) {
    return apiRequest(`/gallery/${id}/`, { method: 'DELETE' });
  },

  async createArtGalleryItem(payload: {
    title: string;
    author: string;
    description?: string;
    order: number;
    image: File;
  }) {
    return apiRequest('/art-gallery/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteArtGalleryItem(id: string) {
    return apiRequest(`/art-gallery/${id}/`, { method: 'DELETE' });
  },

  async createAppeal(payload: {
    full_name: string;
    appeal_type: 'murojaat' | 'shikoyat' | 'taklif';
    description: string;
    phone: string;
    email?: string;
    telegram_link?: string;
  }) {
    return apiRequest('/appeals/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createApplication(payload: {
    full_name: string;
    application_type: 'professional_development' | 'retraining';
    workplace: string;
    direction: string;
    phone: string;
    telegram_link?: string;
  }) {
    return apiRequest('/applications/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createTeacher(payload: { full_name: string; position: string; degree: string; title: string; awards?: string; order: number; photo?: File | null }) {
    return apiRequest('/teachers/', { method: 'POST', body: toFormData(payload) });
  },

  async deleteTeacher(id: string) {
    return apiRequest(`/teachers/${id}/`, { method: 'DELETE' });
  },

  async createPersonnel(payload: {
    full_name: string;
    position: string;
    phone: string;
    email: string;
    reception_hours: string;
    category: 'leadership' | 'staff';
    duties: string;
    biography?: string;
    order: number;
    photo?: File | null;
  }) {
    return apiRequest('/personnel/', { method: 'POST', body: toFormData(payload) });
  },

  async deletePersonnel(id: string) {
    return apiRequest(`/personnel/${id}/`, { method: 'DELETE' });
  },

  async createCourse(payload: {
    title: string;
    course_type: 'professional_development' | 'retraining' | 'short_professional_development' | 'profession_learning';
    duration: string;
    description: string;
    phone_numbers: string;
    email: string;
    telegram_link: string;
    order: number;
    photo?: File | null;
  }) {
    return apiRequest('/courses/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteCourse(id: string) {
    return apiRequest(`/courses/${id}/`, { method: 'DELETE' });
  },

  async createListener(payload: {
    record_type: 'MO' | 'QT';
    full_name: string;
    workplace: string;
    course_type: string;
    number: string;
    duration: string;
  }) {
    return apiRequest('/listeners/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteListener(id: string) {
    return apiRequest(`/listeners/${id}/`, { method: 'DELETE' });
  },

  async bulkImportListeners(file: File, recordType: 'MO' | 'QT') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('record_type', recordType);
    return apiRequest('/listeners/bulk_import/', { method: 'POST', body: formData });
  },

  async createJournalIssue(payload: { year: string; issue_number: string; pdf_file: File; thumbnail?: File | null }) {
    return apiRequest('/journal/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteJournalIssue(id: string) {
    return apiRequest(`/journal/${id}/`, { method: 'DELETE' });
  },

  async createDocument(payload: {
    title: string;
    category: 'regulatory' | 'plan' | 'open_data' | 'library';
    file: File;
    cover_image?: File | null;
  }) {
    return apiRequest('/documents/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteDocument(id: string) {
    return apiRequest(`/documents/${id}/`, { method: 'DELETE' });
  },

  async createInternationalPartner(payload: {
    name: string;
    country: string;
    description: string;
    order: number;
    photo?: File | null;
  }) {
    return apiRequest('/international-partners/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteInternationalPartner(id: string) {
    return apiRequest(`/international-partners/${id}/`, { method: 'DELETE' });
  },

  async createInternationalProject(payload: {
    title: string;
    description: string;
    partners_text: string;
    start_date: string;
    end_date?: string;
    status: 'planned' | 'ongoing' | 'completed';
    order: number;
    images?: File[];
    image_orders?: number[];
  }) {
    const formData = toFormData({
      title: payload.title,
      description: payload.description,
      partners_text: payload.partners_text,
      start_date: payload.start_date,
      end_date: payload.end_date || '',
      status: payload.status,
      order: payload.order,
      is_active: true,
    });
    (payload.images || []).forEach((file, idx) => {
      formData.append('images', file);
      formData.append('image_orders', String(payload.image_orders?.[idx] ?? idx));
    });
    return apiRequest('/international-projects/', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteInternationalProject(id: string) {
    return apiRequest(`/international-projects/${id}/`, { method: 'DELETE' });
  },

  async createInternationalMedia(payload: {
    title: string;
    description: string;
    media_type: 'photo' | 'video';
    youtube_url?: string;
    order: number;
    image?: File | null;
  }) {
    return apiRequest('/international-media/', {
      method: 'POST',
      body: toFormData(payload),
    });
  },

  async deleteInternationalMedia(id: string) {
    return apiRequest(`/international-media/${id}/`, { method: 'DELETE' });
  },

  async request<T>(endpoint: string, method: Method = 'GET', body?: BodyInit | object) {
    const normalizedBody =
      body && !(body instanceof FormData) && typeof body !== 'string'
        ? JSON.stringify(body)
        : body;
    return apiRequest<T>(endpoint, { method, body: normalizedBody as BodyInit | undefined });
  },
};
