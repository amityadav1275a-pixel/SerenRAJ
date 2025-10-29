
import React, { useState } from 'react';
import type { DeviceType } from '../types';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  deviceType: DeviceType;
}

const placeholderExamples: Record<DeviceType, string> = {
  laptop: "e.g., I'm a software developer who travels a lot. I need a lightweight laptop with a great keyboard, long battery life, and enough power to run multiple IDEs and containers. I also enjoy some casual gaming...",
  phone: "e.g., I'm a content creator focused on photography and video. I need the best camera system possible, a vibrant display for editing, and plenty of storage. A unique design would be a plus..."
};

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, deviceType }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-3">Describe Your Ideal {deviceType === 'laptop' ? 'Laptop' : 'Phone'}</h2>
      <p className="text-gray-400 mb-8">
        Tell our AI what you're looking for. The more detail, the better!
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholderExamples[deviceType]}
          className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          required
        />
        <button
          type="submit"
          className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          disabled={!prompt.trim()}
        >
          Build My Device
        </button>
      </form>
    </div>
  );
};