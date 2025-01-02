import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  accentColor: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, description, features, buttonText, accentColor }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col justify-between border-t-4 ${accentColor}`}>
    <div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <button className={`w-full py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${accentColor.replace('border', 'bg')}`}>
      {buttonText}
    </button>
  </div>
);

const PricingSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Flexible Pricing Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard
            title="Revenue Sharing Plan"
            description="No upfront costs – pay only a percentage of your earnings."
            features={[
              "Keep 90% of your revenue",
              "No monthly fees",
              "Access to all platform features",
              "24/7 support"
            ]}
            buttonText="Start Earning"
            accentColor="border-purple-500"
          />
          <PricingCard
            title="Subscription Plan"
            description="Fixed monthly fee – starting at $50/month for up to 4 games."
            features={[
              "Publish up to 4 games",
              "Predictable monthly cost",
              "Priority support",
              "Advanced analytics"
            ]}
            buttonText="Subscribe Now"
            accentColor="border-green-500"
          />
        </div>
        <div className="flex justify-center mt-12 space-x-8">
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span className="text-gray-300">No Hidden Fees</span>
          </div>
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span className="text-gray-300">Scalable Options</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

