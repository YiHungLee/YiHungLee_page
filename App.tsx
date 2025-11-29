import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Pages
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ProjectsPage from './components/pages/ProjectsPage';
import ProjectCategoryPage from './components/pages/ProjectCategoryPage';
import BlogListPage from './components/pages/BlogListPage';
import BlogPostPage from './components/pages/BlogPostPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <ThemeProvider>
        <div className="min-h-screen font-body
                        bg-warmPaper-100 dark:bg-cosmicBlue-900
                        text-deepOlive-800 dark:text-warmPaper-50
                        transition-colors duration-600">
          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:category" element={<ProjectCategoryPage />} />

              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
