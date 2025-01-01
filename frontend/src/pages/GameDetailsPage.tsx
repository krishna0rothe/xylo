import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Topbar from '../components/Topbar';
import HeroSection from '../components/gameDetails/HeroSection';
import GameInfo from '../components/gameDetails/GameInfo';
import GameDescription from '../components/gameDetails/GameDescription';
import SystemRequirements from '../components/gameDetails/SystemRequirements';
import ReviewsSection from '../components/gameDetails/ReviewsSection';

interface GameDetails {
  id: string;
  name: string;
  description: string;
  images: string[];
  platform: string[];
  category: string;
  price: number;
  tags: string[];
  version: string;
  requirements: {
    min: string;
    max: string;
  };
  studioName: string;
  studioLogo: string;
  metadata: {
    rating: number;
    totalDownloads: number;
    reviews: {
      id: string;
      rating: number;
      comment: string;
      reviewerName: string;
    }[];
  };
}

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/game/games/${id}`);
        if (response.data.status === 'success') {
          setGameDetails(response.data.game);
        } else {
          setError('Failed to fetch game details');
        }
      } catch (error) {
        setError('An error occurred while fetching game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error || !gameDetails) {
    return <div className="text-white text-center mt-20">Error: {error || 'Game not found'}</div>;
  }

  const convertToINR = (priceUSD: number) => {
    const exchangeRate = 75; // Assuming 1 USD = 75 INR
    return Math.round(priceUSD * exchangeRate);
  };

  const priceINR = convertToINR(gameDetails.price);
  const priceDisplay = gameDetails.price === 0 ? 'Free' : `₹${priceINR}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Topbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <HeroSection game={gameDetails} />
            <GameDescription description={gameDetails.description} />
            <SystemRequirements requirements={gameDetails.requirements} />
            <ReviewsSection reviews={gameDetails.metadata.reviews} rating={gameDetails.metadata.rating} />
          </div>
          <div className="lg:w-1/3">
            <GameInfo 
              game={gameDetails}
              priceDisplay={priceDisplay}
              studioName={gameDetails.studioName}
              studioLogo={gameDetails.studioLogo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;

