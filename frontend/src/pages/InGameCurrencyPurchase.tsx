import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface GameCoinDetails {
  gameCoin: {
    _id: string;
    coinName: string;
    coinValue: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  game: {
    _id: string;
    image: string;
  };
}

const InGameCurrencyPurchase: React.FC = () => {
  const { userId, gameId } = useParams<{ userId: string; gameId: string }>();
  const [gameDetails, setGameDetails] = useState<GameCoinDetails | null>(null);
  const [coinsToBuy, setCoinsToBuy] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
    fetchGameDetails();
  }, [userId, gameId]);

  useEffect(() => {
    if (gameDetails) {
      setTotalAmount(coinsToBuy * gameDetails.gameCoin.coinValue);
    }
  }, [coinsToBuy, gameDetails]);

  const fetchGameDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get(`api/details/${userId}/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        setGameDetails(response.data);
      } else {
        setError('Failed to fetch game details');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      setError('An error occurred while fetching game details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCoinsToBuy(isNaN(value) ? 0 : value);
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.post('api/ingame/create-order', {
        userId,
        gameId,
        amount: totalAmount,
        coins: coinsToBuy
      });

      if (response.data.status === 'success') {
        const options = {
          key: 'rzp_test_Kh4q0sjhzZ5eP4',
          amount: response.data.order.amount,
          currency: 'INR',
          name: 'Xylo Game Store',
          description: `Purchase ${coinsToBuy} ${gameDetails?.gameCoin.coinName}`,
          order_id: response.data.order.id,
          handler: async function (response: any) {
            try {
              await axiosInstance.post('api/ingame/payment-callback', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                gameId
              });

              const confirmResponse = await axiosInstance.get('api/ingame/confirm', {
                params: { userId, gameId },
              });

              if (confirmResponse.data.status === 'success') {
                alert('Payment successful! Coins added to your account.');
                fetchGameDetails(); // Refresh game details
              } else {
                setError('Payment was processed, but confirmation failed. Please contact support.');
              }
            } catch (error) {
              console.error('Error processing payment:', error);
              setError('An error occurred while processing the payment. Please try again.');
            }
          },
          prefill: {
            name: gameDetails?.user.name,
            email: gameDetails?.user.email
          },
          theme: {
            color: '#3399cc'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setError('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('An error occurred while creating the order');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading game details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!gameDetails) {
    return <div className="text-center py-8">No game details found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Purchase In-Game Currency</h1>
      <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center mb-4">
          <img src={gameDetails.game.image || '/placeholder.png'} alt="Game" className="w-16 h-16 object-cover rounded-lg mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-blue-400">{gameDetails.gameCoin.coinName}</h2>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="coinsToBuy" className="block text-sm font-medium text-gray-300 mb-2">
            Number of coins to buy
          </label>
          <input
            type="number"
            id="coinsToBuy"
            value={coinsToBuy}
            onChange={handleCoinInputChange}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
        <div className="mb-6">
          <p className="text-lg">
            Total Amount: <span className="text-blue-400 font-bold">₹{totalAmount.toFixed(2)}</span>
            <span className="text-sm text-gray-400 ml-2">
              (1 coin = ₹{gameDetails.gameCoin.coinValue.toFixed(2)})
            </span>
          </p>
        </div>
        <button
          onClick={handlePurchase}
          disabled={coinsToBuy <= 0}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out ${
            coinsToBuy <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          Purchase Coins
        </button>
      </div>
    </div>
  );
};

export default InGameCurrencyPurchase;

