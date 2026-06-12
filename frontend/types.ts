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
  degree: string;
  title: string;
  awards?: string;
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
