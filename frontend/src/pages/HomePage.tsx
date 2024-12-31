import React from 'react';
import Topbar from '../components/Topbar';
import HeroCarousel from '../components/HeroCarousel';
import GameCategorySection from '../components/GameCategorySection';
import AllGamesSection from '../components/AllGamesSection';
import FilterOptionsMenu from '../components/FilterOptionsMenu';


const HomePage: React.FC = () => {
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Implement filter logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Topbar />
      <main className="flex-grow">
        <HeroCarousel />
        <div className="container mx-auto px-4 py-8">
          <GameCategorySection category="Top Sellers" />
          <GameCategorySection category="New Releases" />
          <GameCategorySection category="Free Games" />
          <AllGamesSection />
        </div>
        <FilterOptionsMenu onFilterChange={handleFilterChange} />
      </main>
    </div>
  );
};

export default HomePage;

