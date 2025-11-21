import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'blog' | 'portfolio';
  onNavigate: (page: 'home' | 'blog' | 'portfolio', sectionId?: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '關於我', page: 'home', sectionId: 'home' },
    { label: '經歷與學歷', page: 'home', sectionId: 'experience' },
    { label: '專業訓練', page: 'home', sectionId: 'training' },
    { label: '作品集', page: 'portfolio', sectionId: '' },
    { label: 'Blog', page: 'blog', sectionId: '' },
  ];

  const handleLinkClick = (page: string, sectionId?: string) => {
    onNavigate(page as 'home' | 'blog' | 'portfolio', sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-cream-50/80 backdrop-blur-sm py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <button onClick={() => handleLinkClick('home', 'home')} className="text-2xl font-serif font-bold text-forest-800 tracking-tighter hover:opacity-80 transition-opacity">
          Yi-Hong<span className="text-olive-600">.</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.label} 
              onClick={() => handleLinkClick(link.page, link.sectionId)}
              className={`font-medium transition-colors text-sm tracking-wide ${
                currentPage === link.page && (!link.sectionId || link.sectionId === 'home') && link.page !== 'home' // Simple active state check
                  ? 'text-olive-600 font-bold' 
                  : 'text-forest-800 hover:text-olive-600'
              } ${link.label === 'Blog' ? 'px-4 py-1 bg-forest-50 rounded-full text-forest-800 hover:bg-forest-100 border border-forest-100' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-forest-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-camel-100 shadow-lg p-6 flex flex-col gap-4 h-screen">
           {navLinks.map((link) => (
            <button 
              key={link.label} 
              onClick={() => handleLinkClick(link.page, link.sectionId)}
              className="text-forest-800 text-lg font-medium block py-3 border-b border-dotted border-camel-200 text-left"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
