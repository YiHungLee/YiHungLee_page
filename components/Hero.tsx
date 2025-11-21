import React from 'react';
import { PROFILE } from '../constants';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-50 rounded-full blur-3xl -z-10 opacity-60 transform translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-camel-50 rounded-full blur-3xl -z-10 opacity-60 transform -translate-x-1/3 translate-y-1/4" />

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Profile Image / Avatar Placeholder */}
        <div className="flex-shrink-0 relative group">
          <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
            {/* Using a nature-themed placeholder or the user's actual photo if available. 
                Here using a high-quality placeholder that matches the aesthetic */}
            <img 
              src="https://picsum.photos/400/400?grayscale" 
              alt={PROFILE.name} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-forest-800/10 mix-blend-overlay" />
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 border border-camel-400 rounded-full transform translate-x-4 translate-y-4 -z-0" />
        </div>

        {/* Introduction Text */}
        <div className="text-center md:text-left space-y-6">
          <div>
            <h2 className="text-olive-600 font-medium tracking-widest text-sm mb-2 uppercase">Counseling Psychologist Intern</h2>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-forest-800 mb-4 tracking-tight">
              {PROFILE.name}
            </h1>
            <p className="text-xl text-mist-500 font-light">
              {PROFILE.title}
            </p>
            <p className="text-lg text-forest-600 mt-1">
              {PROFILE.currentRole}
            </p>
          </div>

          {/* Contact Pills */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-camel-200 rounded-full text-forest-800 hover:bg-forest-50 transition-colors shadow-sm">
              <Mail size={16} className="text-olive-600" />
              <span className="text-sm">{PROFILE.email}</span>
            </a>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-camel-200 rounded-full text-forest-800 shadow-sm">
              <Phone size={16} className="text-olive-600" />
              <span className="text-sm">{PROFILE.phone}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-camel-200 rounded-full text-forest-800 shadow-sm">
              <MessageCircle size={16} className="text-olive-600" />
              <span className="text-sm">ID: {PROFILE.lineId}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};