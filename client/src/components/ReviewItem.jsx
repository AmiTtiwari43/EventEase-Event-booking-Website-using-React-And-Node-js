import React from 'react';

const ReviewItem = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-semibold text-sm">
              {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.userId?.name || 'Anonymous User'}
            </h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{review.rating}/5</span>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewItem; 