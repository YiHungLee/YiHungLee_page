import React from 'react';
import { PROFILE } from '../constants';
import { Quote } from 'lucide-react';

export const Philosophy: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-cream-100 relative">
      <div className="max-w-3xl mx-auto text-center relative">
        <Quote className="absolute -top-8 -left-4 md:-left-12 text-camel-400 w-12 h-12 opacity-40" />
        <h3 className="text-2xl font-serif text-forest-800 mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-camel-400"></span>
          對助人工作的相信
          <span className="h-px w-8 bg-camel-400"></span>
        </h3>
        
        <div className="prose prose-lg text-forest-800 leading-relaxed font-serif mx-auto italic">
          <p className="whitespace-pre-line">
            {PROFILE.philosophy}
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 rounded-full bg-olive-600 opacity-50"></div>
        </div>
      </div>
    </section>
  );
};