import React, { useState } from 'react';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

// Simple Markdown Renderer Component to avoid heavy dependencies
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  // Helper function to parse bold text
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-forest-800 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };
  
  return (
    <div className="space-y-4 text-forest-800 leading-relaxed">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-serif font-bold mt-8 mb-4 text-forest-800">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-serif font-bold mt-6 mb-3 text-olive-600">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-forest-600">{line.replace('### ', '')}</h3>;
        
        // List items - Apply parseBold to content
        if (line.trim().startsWith('- ')) return <li key={index} className="ml-4 list-disc text-forest-800 my-1 pl-2">{parseBold(line.replace('- ', ''))}</li>;
        if (line.trim().match(/^\d+\./)) return <div key={index} className="ml-4 my-1 font-medium">{parseBold(line)}</div>;

        // Empty lines
        if (line.trim() === '') return <br key={index} />;

        // Paragraphs - Apply parseBold
        return (
          <p key={index} className="mb-2">
            {parseBold(line)}
          </p>
        );
      })}
    </div>
  );
};

export const Blog: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId);

  if (selectedPost) {
    // Single Post View
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setSelectedPostId(null)}
            className="flex items-center gap-2 text-olive-600 hover:text-forest-800 mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>回到文章列表</span>
          </button>

          <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-camel-100">
            <header className="mb-8 border-b border-camel-100 pb-8">
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-forest-50 text-forest-600 text-xs rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest-800 mb-4 leading-tight">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-2 text-mist-500 text-sm">
                <Calendar size={16} />
                {selectedPost.date}
              </div>
            </header>

            <div className="font-sans">
              <SimpleMarkdown content={selectedPost.content} />
            </div>
            
            <div className="mt-12 pt-8 border-t border-camel-100 text-center">
              <p className="text-olive-600 italic font-serif">
                感謝您的閱讀。如果這篇文章對您有幫助，歡迎分享。
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Post List View
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-olive-600 font-medium tracking-widest text-sm mb-3 uppercase">Blog & Sharing</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-800">寫作與分享</h1>
          <p className="mt-4 text-mist-500 max-w-xl mx-auto">
            這裡紀錄了我對諮商、關係與心理健康的觀察。希望文字能成為一種溫柔的陪伴。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPostId(post.id)}
              className="bg-white rounded-2xl overflow-hidden border border-camel-100 hover:border-camel-300 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-olive-600 text-xs mb-3 font-medium">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <h3 className="text-2xl font-serif font-bold text-forest-800 mb-3 group-hover:text-olive-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-mist-500 leading-relaxed mb-6 line-clamp-3 flex-1">
                  {post.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-xs text-forest-600 bg-forest-50 px-2 py-1 rounded-md">#{tag}</span>
                    ))}
                  </div>
                  <span className="text-olive-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    閱讀更多 &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};