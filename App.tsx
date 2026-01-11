import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { UtterancesCallback } from './components/shared/UtterancesCallback';
import { PageLoading } from './components/shared/PageLoading';

// 首頁保留同步載入（首次訪問必需）
import HomePage from './components/pages/HomePage';

// 其他頁面使用懶載入
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const ProjectCategoryPage = lazy(() => import('./components/pages/ProjectCategoryPage'));
const ProjectDetailPage = lazy(() => import('./components/pages/ProjectDetailPage'));
const BlogListPage = lazy(() => import('./components/pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage'));

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
      <main>
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </main>
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
