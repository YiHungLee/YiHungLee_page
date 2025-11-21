import React from 'react';
import { PROFILE } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-800 text-cream-100 py-12 px-6 mt-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-serif">李奕宏 Li Yi-hung</h2>
        <p className="text-olive-100/80 max-w-lg mx-auto text-sm leading-relaxed">
          我們在生命中遭遇到的每一個困難，都可以是一個好好看見自己的機會。
        </p>
        <div className="h-px w-20 bg-olive-600 mx-auto my-6"></div>
        <div className="text-sm text-olive-100/60 space-y-1">
           <p>{PROFILE.email}</p>
           <p>© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};