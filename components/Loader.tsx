
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <h3 className="text-xl font-semibold text-gray-300">Building Your Device...</h3>
      <p className="text-gray-500 max-w-sm">
        Our AI is selecting the best components based on your request. This might take a moment.
      </p>
    </div>
  );
};