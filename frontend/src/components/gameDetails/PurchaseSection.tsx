import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

interface PurchaseSectionProps {
  gameId: string;
  gameName: string;
  price: number;
  priceDisplay: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PurchaseSection: React.FC<PurchaseSectionProps> = ({ gameId, gameName, price, priceDisplay }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpayScript = async () => {
      if (price > 0) {
        const loaded = await loadRazorpay();
        setIsRazorpayLoaded(loaded);
        if (!loaded) {
          setError('Failed to load payment gateway. Please try again later.');
        }
      }
    };
    loadRazorpayScript();
  }, [price]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axiosInstance.get('api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setUserData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const createOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const amountInPaise = Math.round(price * 100); // Convert to paise
      const response = await axiosInstance.post('api/payment/create-order', {
        amount: amountInPaise,
        userId: userData._id,
        gameId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  };

  const confirmPayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }

    try {
      const response = await axiosInstance.get('api/payment/confirm', {
        params: { userId: userData._id, gameId },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (price === 0) {
      handleDownload();
      return;
    }

    if (!isRazorpayLoaded || !userData) {
      setError('Payment gateway is not ready. Please try again later.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const order = await createOrder();

      const options = {
        key: 'rzp_test_Kh4q0sjhzZ5eP4',
        amount: order.amount,
        currency: order.currency,
        name: 'Xylo Game Store',
        description: `Purchase ${gameName}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
              return;
            }

            await axiosInstance.post('api/payment/payment-callback', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userData._id,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const isConfirmed = await confirmPayment();
            if (isConfirmed) {
              setIsPurchased(true);
              setError(null);
            } else {
              setError('Payment was processed, but confirmation failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            setError('An error occurred while processing the payment. Please try again.');
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        setError(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setError('An error occurred while initializing the payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (price === 0) {
        // For free games, skip payment confirmation and directly initiate download
        navigate(`/download/${gameId}`);
      } else {
        const isConfirmed = await confirmPayment();
        if (isConfirmed) {
          navigate(`/download/${gameId}`);
        } else {
          setError('Unable to confirm payment. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Error initiating download:', error);
      setError('An error occurred while trying to download the game. Please try again.');
    }
  };

  if (!userData) {
    return <div className="text-center py-4">Loading payment information...</div>;
  }

  return (
    <div className="mb-6 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Purchase</h2>
      {!isPurchased ? (
        <>
          <div className="text-3xl font-bold mb-4">{priceDisplay}</div>
          <button
            onClick={handlePayment}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4 ${
              (price > 0 && !isRazorpayLoaded) || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={(price > 0 && !isRazorpayLoaded) || isProcessing}
          >
            {isProcessing ? 'Processing...' : price === 0 ? 'Download' : isRazorpayLoaded ? 'Buy Now' : 'Loading Payment...'}
          </button>
        </>
      ) : (
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mb-4"
        >
          Download Game
        </button>
      )}
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      {price > 0 && (
        <div className="text-sm text-gray-400 mt-2">
          Secure payment powered by Razorpay
        </div>
      )}
    </div>
  );
};

export default PurchaseSection;

