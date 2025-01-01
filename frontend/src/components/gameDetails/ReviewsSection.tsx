import React from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, rating }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Reviews and Ratings</h2>
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <span className="text-3xl font-bold mr-2">{rating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{review.reviewerName}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
        {reviews.length > 3 && (
          <button className="mt-4 text-blue-500 hover:text-blue-400">
            View All Reviews
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;

