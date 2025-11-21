import React from 'react';
import { EXPERIENCE, EDUCATION, AWARDS } from '../constants';
import { Briefcase, Award, GraduationCap } from 'lucide-react';

export const Resume: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
      {/* Work Experience - Spans 7 columns */}
      <div className="md:col-span-7 space-y-10">
        <div className="flex items-center gap-3 text-olive-600 mb-6">
          <Briefcase size={24} />
          <h3 className="text-xl font-bold font-serif">工作經歷</h3>
        </div>
        
        <div className="relative border-l-2 border-camel-200 ml-3 pl-8 space-y-10">
          {EXPERIENCE.map((item, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[41px] top-1.5 h-5 w-5 rounded-full border-4 border-cream-50 bg-olive-600 group-hover:scale-125 transition-transform duration-300"></span>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-mono text-olive-600 font-medium min-w-[4rem]">{item.year}</span>
                <h4 className="text-lg font-medium text-forest-800">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Education & Awards - Spans 5 columns */}
      <div className="md:col-span-5 space-y-12">
        
        {/* Education */}
        <div>
          <div className="flex items-center gap-3 text-olive-600 mb-6">
            <GraduationCap size={24} />
            <h3 className="text-xl font-bold font-serif">學歷</h3>
          </div>
          <div className="space-y-6">
            {EDUCATION.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-camel-100 hover:border-camel-300 transition-colors">
                <div className="text-sm text-olive-600 mb-1">{item.year}</div>
                <div className="font-medium text-forest-800">{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <div className="flex items-center gap-3 text-olive-600 mb-6">
            <Award size={24} />
            <h3 className="text-xl font-bold font-serif">獲獎紀錄</h3>
          </div>
          <div className="space-y-4">
            {AWARDS.map((item, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-camel-300">
                 <div className="text-sm text-olive-600 mb-1">{item.year}</div>
                 <div className="font-medium text-forest-800">{item.title}</div>
                 {item.description && (
                   <div className="text-sm text-mist-500 mt-1">{item.description}</div>
                 )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};