import React, { useState } from 'react';
import axios from '../../api/axios';
import { Asset } from './types';
import { toast } from 'react-hot-toast';
import DownloadComponent from './DownloadComponent';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PurchaseComponentProps {
  asset: Asset;
}

const PurchaseComponent: React.FC<PurchaseComponentProps> = ({ asset }) => {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please try again later.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post('/api/assetpayment/create-order', { assetId: asset._id }, config);
      const { order } = response.data;

      const options = {
        key: 'rzp_test_Kh4q0sjhzZ5eP4',
        amount: order.amount,
        currency: order.currency,
        name: 'Xylo Asset Marketplace',
        description: `Purchase of ${asset.title}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const confirmResponse = await axios.post('/api/assetpayment/confirm-payment', paymentData, config);

            if (confirmResponse.data.status === 'success') {
              toast.success('Payment successful!');
              setPurchased(true);
            } else {
              toast.error('Payment confirmation failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment confirmation error:', error);
            toast.error('Payment confirmation failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to initiate purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (purchased) {
    return <DownloadComponent assetId={asset._id} />;
  }

  if (asset.price === 0) {
    return (
      <button
        onClick={() => setPurchased(true)}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        Download Free
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {loading ? 'Processing...' : `Buy Now (₹${asset.price.toFixed(2)})`}
    </button>
  );
};

export default PurchaseComponent;

