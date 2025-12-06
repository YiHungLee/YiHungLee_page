import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ProjectDetailPage from './components/pages/ProjectDetailPage';
import BlogListPage from './components/pages/BlogListPage';
import BlogPostPage from './components/pages/BlogPostPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <div className="min-h-screen font-body
                        bg-warmCream-50 dark:bg-darkMode-bg
                        text-charcoal-900 dark:text-darkMode-text
                        transition-colors duration-400">
          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:category/:projectId" element={<ProjectDetailPage />} />
              <Route path="/projects/:category" element={<ProjectCategoryPage />} />

              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
