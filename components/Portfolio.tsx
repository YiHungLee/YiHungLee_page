import React from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import { Code, FileText, Music, ExternalLink, PlayCircle } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const posters = PORTFOLIO_ITEMS.filter(item => item.category === 'poster');
  const codeProjects = PORTFOLIO_ITEMS.filter(item => item.category === 'code');
  const musicWorks = PORTFOLIO_ITEMS.filter(item => item.category === 'music');

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-olive-600 font-medium tracking-widest text-sm mb-3 uppercase">Selected Works</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-800">作品集</h1>
          <p className="mt-4 text-mist-500 max-w-xl mx-auto">
            除了諮商專業，我也熱愛透過程式邏輯與音樂創作來探索世界。這裡是我的跨領域作品紀錄。
          </p>
        </div>

        {/* Academic Posters Section */}
        {posters.length > 0 && (
          <section>
            <div className="flex items-center gap-3 text-olive-600 mb-8 border-b border-camel-200 pb-4">
              <FileText size={24} />
              <h2 className="text-2xl font-serif font-bold text-forest-800">學術研討 & 壁報論文</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posters.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-camel-100 hover:shadow-lg transition-all duration-500 hover:border-camel-300">
                  <div className="relative h-64 overflow-hidden bg-forest-50">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white/90 font-mono text-sm bg-forest-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      {item.year}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-forest-800 mb-3 group-hover:text-olive-600 transition-colors">{item.title}</h3>
                    <p className="text-mist-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coding Projects Section */}
        {codeProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 text-olive-600 mb-8 border-b border-camel-200 pb-4">
              <Code size={24} />
              <h2 className="text-2xl font-serif font-bold text-forest-800">程式開發</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {codeProjects.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-camel-100 hover:border-camel-300 transition-all duration-300">
                  <div className="md:w-2/5 bg-forest-50 h-48 md:h-auto relative overflow-hidden">
                     <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-forest-800">{item.title}</h3>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="text-olive-600 hover:text-olive-800 transition-colors">
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                      <p className="text-mist-500 text-sm mb-4 leading-relaxed">{item.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.techStack?.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-cream-100 text-forest-600 text-xs font-medium rounded border border-camel-100">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Music Section */}
        {musicWorks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 text-olive-600 mb-8 border-b border-camel-200 pb-4">
              <Music size={24} />
              <h2 className="text-2xl font-serif font-bold text-forest-800">音樂創作</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {musicWorks.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-camel-100 hover:shadow-md transition-shadow">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-forest-100 flex-shrink-0">
                       <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-forest-800">{item.title}</h3>
                      <p className="text-xs text-olive-600 font-medium mb-1">{item.year} • Original Composition</p>
                      <p className="text-sm text-mist-500 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-cream-50 rounded-full p-2 border border-camel-100">
                    <audio 
                      controls 
                      className="w-full h-8 [&::-webkit-media-controls-panel]:bg-cream-50 [&::-webkit-media-controls-current-time-display]:text-forest-800 [&::-webkit-media-controls-time-remaining-display]:text-forest-800"
                      src={item.audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
