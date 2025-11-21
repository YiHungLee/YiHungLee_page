import React from 'react';
import { TRAININGS, OTHER_SKILLS } from '../constants';
import { BookOpen, Cpu } from 'lucide-react';

export const Training: React.FC = () => {
  return (
    <div className="space-y-16">
      
      {/* Professional Training */}
      <div>
        <div className="flex items-center gap-3 text-olive-600 mb-8">
          <BookOpen size={24} />
          <h3 className="text-xl font-bold font-serif">所受訓練 / 專長</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAININGS.map((item, idx) => (
            <div key={idx} className="bg-forest-50/50 p-6 rounded-2xl border border-transparent hover:border-olive-600/30 hover:bg-forest-50 transition-all duration-300">
              <h4 className="font-bold text-forest-800 mb-2 text-lg">{item.title}</h4>
              {item.details && (
                <p className="text-forest-600 text-sm bg-white/60 inline-block px-3 py-1 rounded-full">
                  {item.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Other Skills */}
      <div>
        <div className="flex items-center gap-3 text-olive-600 mb-8">
          <Cpu size={24} />
          <h3 className="text-xl font-bold font-serif">其他技能</h3>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-camel-100">
            {OTHER_SKILLS.map((category, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-bold text-forest-800 mb-4 border-b border-camel-100 pb-2">
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-4 py-2 bg-cream-100 text-forest-800 rounded-lg text-sm font-medium hover:bg-camel-100 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};