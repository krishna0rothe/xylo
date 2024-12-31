import React from 'react';
import { FaGlobe, FaMoneyBillWave, FaShieldAlt, FaGamepad, FaLayerGroup, FaCrown, FaUsers, FaCode } from 'react-icons/fa';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Benefit: React.FC<BenefitProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-lg">
    <div className="text-4xl mb-4 text-purple-500">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const KeyBenefits: React.FC = () => {
  const benefits = [
    { icon: <FaGlobe />, title: 'Global Reach', description: 'Reach millions of gamers worldwide' },
    { icon: <FaMoneyBillWave />, title: 'Flexible Revenue Models', description: 'Choose the monetization that works for you' },
    { icon: <FaShieldAlt />, title: 'Secure Infrastructure', description: 'Your games and data are always protected' },
    { icon: <FaGamepad />, title: 'Curated Games', description: 'Discover high-quality games across all genres' },
    { icon: <FaLayerGroup />, title: 'Diverse Genres', description: 'From indie to AAA, find your perfect game' },
    { icon: <FaCrown />, title: 'Exclusive Content', description: 'Access unique in-game items and early releases' },
    { icon: <FaUsers />, title: 'Community-Driven Platform', description: 'Connect with fellow developers and gamers' },
    { icon: <FaCode />, title: 'Game Development Simplified', description: 'Access tools and resources to create amazing games' },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;

