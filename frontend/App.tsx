
import React from 'react';
// Corrected: Ensured clean and direct imports from react-router-dom
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { useTranslation } from 'react-i18next';
import './i18n'; // Initialize i18n to prevent useTranslation hook errors

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Journal = React.lazy(() => import('./pages/Journal'));
const Students = React.lazy(() => import('./pages/Students'));
const OpenData = React.lazy(() => import('./pages/OpenData'));
const NewsList = React.lazy(() => import('./pages/NewsList'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const VirtualQabulxona = React.lazy(() => import('./pages/VirtualQabulxona'));
const Departments = React.lazy(() => import('./pages/Departments'));
const DepartmentPage = React.lazy(() => import('./pages/DepartmentPage'));
const Library = React.lazy(() => import('./pages/Library'));
const TrainingPlan = React.lazy(() => import('./pages/TrainingPlan'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));

const Teachers = React.lazy(() => import('./pages/Teachers'));
const PhotoGallery = React.lazy(() => import('./pages/PhotoGallery'));
const ArtGallery = React.lazy(() => import('./pages/ArtGallery'));
const ScientificPotential = React.lazy(() => import('./pages/ScientificPotential'));

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/:section" element={<AboutPage />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/students" element={<Students />} />
              <Route path="/opendata" element={<OpenData />} />
              <Route path="/open-data" element={<OpenData />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/virtual-qabulxona" element={<VirtualQabulxona />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:slug" element={<DepartmentPage />} />
              <Route path="/library" element={<Library />} />
              <Route path="/training-plan" element={<TrainingPlan />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/photo-gallery" element={<PhotoGallery />} />
              <Route path="/art-gallery" element={<ArtGallery />} />
              <Route path="/scientific-potential" element={<ScientificPotential />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-20">
                  <h2 className="text-4xl font-bold text-blue-900 mb-4">404</h2>
                  <p className="text-gray-500">{t('layout.not_found_message')}</p>
                </div>
              } />
            </Routes>
          </React.Suspense>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
