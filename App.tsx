import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { UtterancesCallback } from './components/shared/UtterancesCallback';

// Pages
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ProjectsPage from './components/pages/ProjectsPage';
import ProjectCategoryPage from './components/pages/ProjectCategoryPage';
import ProjectDetailPage from './components/pages/ProjectDetailPage';
import BlogListPage from './components/pages/BlogListPage';
import BlogPostPage from './components/pages/BlogPostPage';

// Layout wrapper for pages with Navigation and Footer
const MainLayout: React.FC<{
  children: React.ReactNode;
  hideNavigationOnMobile?: boolean;
}> = ({ children, hideNavigationOnMobile = false }) => {
  return (
    <div className="min-h-screen font-body
                    bg-warmCream-50 dark:bg-darkMode-bg
                    text-charcoal-900 dark:text-darkMode-text
                    transition-colors duration-400">
      <div className={hideNavigationOnMobile ? 'hidden md:block' : ''}>
        <Navigation />
      </div>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Standalone layout for pages without Navigation/Footer (e.g., Links page)
const StandaloneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen font-body
                    bg-warmCream-50 dark:bg-darkMode-bg
                    text-charcoal-900 dark:text-darkMode-text
                    transition-colors duration-400">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <UtterancesCallback />
      <ThemeProvider>
        <Routes>
          {/* Main routes with Navigation and Footer */}
          <Route path="/" element={<MainLayout hideNavigationOnMobile><HomePage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

          <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
          <Route path="/projects/:category/:projectId" element={<MainLayout><ProjectDetailPage /></MainLayout>} />
          <Route path="/projects/:category" element={<MainLayout><ProjectCategoryPage /></MainLayout>} />

          <Route path="/blog" element={<MainLayout><BlogListPage /></MainLayout>} />
          <Route path="/blog/:postId" element={<MainLayout><BlogPostPage /></MainLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
