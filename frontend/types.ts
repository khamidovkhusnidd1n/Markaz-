// News with inline images
export interface NewsImage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  category?: string;
  categoryId?: string;
  content: string;
  date: string;
  image: string; // First image URL for backwards compatibility
  images?: NewsImage[]; // All images
  isImportant?: boolean;
  isActive?: boolean;
  externalLink?: string;
  videoUrl?: string;
  views_count?: number;
}

// Gallery image (single image in album)
export interface GalleryImage {
  id: string;
  imageUrl: string;
  order: number;
}

// Gallery album with multiple images
export interface GalleryItem {
  id: string;
  title: string;
  coverImageUrl: string;
  images: GalleryImage[];
  order: number;
  isActive?: boolean;
}

export interface ArtGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  description?: string;
  createdAt?: string;
  order: number;
  isActive?: boolean;
}

export interface Appeal {
  id: string;
  fullName: string;
  appealType: 'murojaat' | 'shikoyat' | 'taklif';
  appealTypeDisplay?: string;
  description: string;
  phone: string;
  email?: string;
  telegramLink?: string;
  createdAt?: string;
}

export interface Application {
  id: string;
  fullName: string;
  applicationType: 'professional_development' | 'retraining';
  applicationTypeDisplay?: string;
  workplace: string;
  direction: string;
  phone: string;
  telegramLink?: string;
  createdAt?: string;
}

// Teacher without URL fields
export interface Teacher {
  id: string;
  fullName: string;
  position: string;
  position_translated?: string;
  degree: string;
  degree_translated?: string;
  title: string;
  title_translated?: string;
  awards?: string;
  awards_translated?: string;
  biography?: string;
  biography_translated?: string;
  photoUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  type: 'retraining' | 'professional_development' | 'short_professional_development' | 'profession_learning';
  typeDisplay?: string;
  duration?: string;
  description?: string;
  phoneNumbers?: string;
  email?: string;
  telegramLink?: string;
  photoUrl?: string;
}

export interface Personnel {
  id: string;
  fullName: string;
  position: string;
  phone: string;
  email?: string;
  receptionHours: string;
  photoUrl?: string;
  category: 'leadership' | 'staff';
  duties?: string;
  biography?: string;
}

// Journal without title and description
export interface JournalIssue {
  id: string;
  year: string;
  issueNumber?: string;
  pdfUrl: string;
  thumbnailUrl?: string;
}

// Document simplified
export interface Document {
  id: string;
  title: string;
  category: 'regulatory' | 'plan' | 'open_data' | 'library';
  fileUrl: string;
  coverImageUrl?: string;
  date: string;
}

// Listener with MO/QT types (replacing separate Certificate)
export interface PDPlanRecord {
  id: string;
  recordType: 'MO' | 'QT'; // MO - Malaka oshirish, QT - Qayta tayyorlash
  fullName: string;
  workplace: string; // Ish joyi
  courseType: string; // Yo'nalish
  series: string; // Seriya
  number: string; // Raqam
  duration: string; // O'qish muddati (davri)
  isVerified?: boolean;
}

export interface Statistics {
  totalPedagogs: number;
  professors: number;
  dotsents: number;
  academics: number;
  potential: number;
  studentsCount: { year: string; count: number; retraining: number }[];
  retrainingCount: { year: string; count: number }[];
}

export interface AppContent {
  history: string;
  structure: string;
  structureImage: string;
  studentNotes?: string;
  contactInfo?: string;
  address?: string;
  mapEmbedUrl?: string;
  siteName?: string;
  headerLogo?: string;
  footerLogo?: string;
  heroVideoUrl?: string;
  heroImages?: { id: string; imageUrl: string; order: number }[];
}

export interface JournalSettings {
  articleRulesText: string;
  articleRulesPdfUrl?: string;
  aboutJournal: string;
  phone?: string;
  editorialAddress?: string;
  email?: string;
  telegramPrimary?: string;
  telegramSecondary?: string;
  instagram?: string;
  facebook?: string;
}

export interface InternationalSettings {
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
}

export interface InternationalPartner {
  id: string;
  name: string;
  country: string;
  description: string;
  photoUrl?: string;
  order: number;
  isActive?: boolean;
}

export interface InternationalProjectImage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface InternationalProject {
  id: string;
  title: string;
  description: string;
  partners: string[];
  partnersText: string;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'ongoing' | 'completed';
  statusDisplay?: string;
  images: InternationalProjectImage[];
  order: number;
  isActive?: boolean;
}

export interface InternationalMedia {
  id: string;
  title: string;
  description: string;
  mediaType: 'photo' | 'video';
  imageUrl?: string;
  youtubeUrl?: string;
  order: number;
  isActive?: boolean;
}

export interface DepartmentTask {
  id: number;
  department: number;
  title: string;
  title_ru?: string;
  title_en?: string;
  task_text: string;
  task_text_ru?: string;
  task_text_en?: string;
  order: number;
}


export interface DepartmentImage {
  id: number;
  image: string;
  image_url?: string;
  order: number;
}

export interface DepartmentVideo {
  id: number;
  video_url: string;
  order: number;
}

export interface DepartmentPostImage {
  id: number;
  image?: string;
  image_url?: string;
  video?: string;
  video_url?: string;
}

export interface DepartmentPost {
  id: number;
  title: string;
  title_ru?: string;
  title_en?: string;
  content: string;
  content_ru?: string;
  content_en?: string;
  image?: string;
  image_url?: string;
  video?: string;
  video_url?: string;
  date: string;
  views_count: number;
  images?: DepartmentPostImage[];
}

export interface Department {
  id: number;
  name: string;
  name_ru?: string;
  name_en?: string;
  icon_name?: string;
  color_classes?: string;
  description: string;
  description_ru?: string;
  description_en?: string;
  detail_text: string;
  detail_text_ru?: string;
  detail_text_en?: string;
  order: number;
  department_posts?: DepartmentPost[];
  department_tasks?: DepartmentTask[];
  images?: DepartmentImage[];
  videos?: DepartmentVideo[];
}

export interface PedagogueProjectImage {
  id: number;
  image: string;
  project: number;
}

export interface PedagogueProject {
  id: number;
  title: string;
  title_ru?: string;
  title_en?: string;
  description?: string;
  description_ru?: string;
  description_en?: string;
  views_count: number;
  votes_count: number;
  images: PedagogueProjectImage[];
  pedagogue: number;
  pedagogue_name?: string;
}

export interface Pedagogue {
  id: number;
  full_name: string;
  full_name_ru?: string;
  full_name_en?: string;
  bio: string;
  bio_ru?: string;
  bio_en?: string;
  image?: string;
  projects: PedagogueProject[];
  order: number;
}
