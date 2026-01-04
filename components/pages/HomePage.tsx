import React from 'react';
import { HeroNew } from '../home/HeroNew';
import { MobileHero } from '../home/MobileHero';
import { IdentityGateway } from '../home/IdentityGateway';
import { FeaturedProjects } from '../home/FeaturedProjects';
import { LatestPosts } from '../home/LatestPosts';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Mobile Hero - visible only on mobile */}
      <div className="md:hidden min-h-screen">
        <MobileHero />
      </div>

      {/* Desktop Hero - visible only on md+ */}
      <HeroNew />

      <IdentityGateway />
      <LatestPosts />
      <FeaturedProjects />
    </div>
  );
};

export default HomePage;
