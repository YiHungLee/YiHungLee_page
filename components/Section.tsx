import React, { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, className = "", icon }) => {
  return (
    <section id={id} className={`py-20 px-6 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          {icon && <div className="text-olive-600">{icon}</div>}
          <h2 className="text-3xl font-serif font-bold text-forest-800">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
};