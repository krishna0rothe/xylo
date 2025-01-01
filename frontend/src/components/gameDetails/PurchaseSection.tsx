import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import Razorpay from 'razorpay';

interface PurchaseSectionProps {
  gameId: string;
  price: number;
  priceDisplay: string;
  file: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

 const razorpay = new Razorpay({
        key_id: "rzp_test_Kh4q0sjhzZ5eP4",
        key_secret: "oPtRcRDn02y5tjYhN8h13Yn2",
      });

const PurchaseSection: React.FC<PurchaseSectionProps> = ({ gameId, price, priceDisplay, file }) => {
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePayment = async () => {
    try {

      // Initialize Razorpay payment
      const response = await axiosInstance.post( razorpay.orders.create, {
        amount: 10 * 100, // Razorpay expects amount in paise
        currency: 'INR',
        gameId: gameId,
      });

    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/api/file/download/67738d5404ca7473957c4d75`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'game.zip'); // You can set the appropriate file name and extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="mb-6 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Purchase</h2>
      {!isPurchased ? (
        <>
          <div className="text-3xl font-bold mb-4">{priceDisplay}</div>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4"
          >
            Buy Now
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
      <div className="text-sm text-gray-400">
        Secure payment powered by Razorpay
      </div>
    </div>
  );
};

export default PurchaseSection;

