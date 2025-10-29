import React from 'react';
import type { DeviceType } from '../types';

interface DeviceSelectorProps {
  onSelectDevice: (deviceType: DeviceType) => void;
  onSelectHero: () => void;
  onSelectAdvisor: () => void;
}

const DeviceOption: React.FC<{
  label: string;
  description: string;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, description, onClick, icon }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full text-left hover:bg-gray-700/50 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
  >
    <div className="flex items-center space-x-4">
        <div className="text-indigo-400">{icon}</div>
        <div>
            <h3 className="text-xl font-semibold text-white">{label}</h3>
            <p className="text-gray-400 mt-1">{description}</p>
        </div>
    </div>
  </button>
);


export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onSelectDevice, onSelectHero, onSelectAdvisor }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Your Personal Tech Advisor</h2>
      <p className="text-lg text-gray-400 mb-12">
        Design a custom device from scratch, or let our AI find the best on the market for you.
      </p>

      {/* Hero Product Section */}
      <div className="mb-12 p-6 border-2 border-indigo-500/50 rounded-xl bg-gradient-to-br from-gray-900 to-indigo-900/20 shadow-2xl shadow-indigo-500/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Featured Build</h3>
        <h4 className="text-3xl font-bold my-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
          The Focus Phone
        </h4>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          A distraction-free experience with a world-class camera, exceptional battery, and powerful on-device AI. Includes essentials like Gmail & WhatsApp, but no social media or clutter.
        </p>
        <button 
          onClick={onSelectHero}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/20"
        >
          View Configuration
        </button>
      </div>

      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-500 uppercase text-sm">Or Choose Your Path</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DeviceOption
          label="Build a Custom Laptop"
          description="Craft a powerhouse for work, gaming, or creativity."
          onClick={() => onSelectDevice('laptop')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <DeviceOption
          label="Build a Custom Phone"
          description="Build the ultimate smartphone tailored to your lifestyle."
          onClick={() => onSelectDevice('phone')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        <DeviceOption
          label="Find Existing Device"
          description="Get an AI recommendation for the best device on the market."
          onClick={onSelectAdvisor}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};