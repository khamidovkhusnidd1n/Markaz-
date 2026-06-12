
import React from 'react';
// Corrected: Ensured clean and direct imports from react-router-dom
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import './i18n'; // Initialize i18n

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Journal = React.lazy(() => import('./pages/Journal'));
const International = React.lazy(() => import('./pages/International'));
const Students = React.lazy(() => import('./pages/Students'));
const OpenData = React.lazy(() => import('./pages/OpenData'));
const NewsList = React.lazy(() => import('./pages/NewsList'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

const App: React.FC = () => {
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
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/international" element={<International />} />
              <Route path="/students" element={<Students />} />
              <Route path="/open-data" element={<OpenData />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-20">
                  <h2 className="text-4xl font-bold text-blue-900 mb-4">404</h2>
                  <p className="text-gray-500">Kechirasiz, bunday sahifa mavjud emas.</p>
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
