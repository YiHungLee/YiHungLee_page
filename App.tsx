import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { Resume } from './components/Resume';
import { Training } from './components/Training';
import { Section } from './components/Section';
import { Footer } from './components/Footer';
import { Blog } from './components/Blog';
import { Portfolio } from './components/Portfolio';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'portfolio'>('home');

  const handleNavigate = (page: 'home' | 'blog' | 'portfolio', sectionId?: string) => {
    setCurrentPage(page);
    
    // If navigating to a specific section on the home page
    if (page === 'home' && sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100); // Small delay to allow render
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'blog':
        return <Blog />;
      case 'portfolio':
        return <Portfolio />;
      default:
        return (
          <>
            <Hero />
            <Philosophy />
            
            <Section id="experience" title="經歷與學歷" className="bg-cream-50">
              <Resume />
            </Section>

            <Section id="training" title="專業訓練與技能" className="bg-white rounded-t-[3rem] mt-12 shadow-inner shadow-camel-100/50">
              <Training />
            </Section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-forest-800 bg-cream-50 selection:bg-olive-200 selection:text-forest-800">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
