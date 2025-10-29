import React, { useState } from 'react';
import type { DeviceType, AdvisorCriteria } from '../types';

interface AdvisorInputProps {
  onFind: (criteria: AdvisorCriteria) => void;
}

const priceRanges = [
    'None',
    'Under $400',
    '$400 - $700',
    '$700 - $1000',
    '$1000+'
];

const deviceIcons: Record<DeviceType, React.ReactNode> = {
    phone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    laptop: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
};

export const AdvisorInput: React.FC<AdvisorInputProps> = ({ onFind }) => {
    const [deviceType, setDeviceType] = useState<DeviceType>('phone');
    const [priceRange, setPriceRange] = useState(priceRanges[0]);
    const [priorities, setPriorities] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (priorities.trim()) {
            onFind({ deviceType, priceRange, priorities });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Find the Best Device on the Market</h2>
            <p className="text-gray-400 mb-8">
                Tell us your budget and what's important to you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 border border-gray-700 rounded-lg p-8">
                <div className="space-y-2 text-left">
                    <label className="font-semibold">I'm looking for a...</label>
                    <div className="flex space-x-4">
                        {(['phone', 'laptop'] as DeviceType[]).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setDeviceType(type)}
                                className={`flex-1 p-3 rounded-lg border-2 transition-colors flex items-center justify-center space-x-2 ${deviceType === type ? 'bg-indigo-900/50 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
                            >
                                {deviceIcons[type]}
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <label htmlFor="price-range" className="font-semibold">My budget is...</label>
                    <select
                        id="price-range"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                        {priceRanges.map(range => <option key={range} value={range}>{range}</option>)}
                    </select>
                </div>
                
                <div className="space-y-2 text-left">
                    <label htmlFor="priorities" className="font-semibold">What's most important to you?</label>
                    <textarea
                        id="priorities"
                        value={priorities}
                        onChange={(e) => setPriorities(e.target.value)}
                        placeholder="e.g., A great camera for travel, long battery life, and a bright screen for outdoor use."
                        className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    disabled={!priorities.trim()}
                >
                    Find My Device
                </button>
            </form>
        </div>
    );
};