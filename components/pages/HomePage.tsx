import React from 'react';
import { HeroNew } from '../home/HeroNew';
import { IdentityGateway } from '../home/IdentityGateway';
import { FeaturedProjects } from '../home/FeaturedProjects';
import { LatestPosts } from '../home/LatestPosts';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroNew />
      <IdentityGateway />
      <LatestPosts />
      <FeaturedProjects />
    </div>
  );
};

export default HomePage;
