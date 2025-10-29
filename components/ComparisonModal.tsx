import React from 'react';
import type { CustomConfiguration } from '../types';

interface ComparisonModalProps {
    builds: CustomConfiguration[];
    onSelect: (build: CustomConfiguration) => void;
    onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ builds, onSelect, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-lg w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-white mb-6">Compare With Saved Build</h3>
                {builds.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {builds.map(build => (
                            <button
                                key={build.deviceName}
                                onClick={() => onSelect(build)}
                                className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex justify-between items-center"
                            >
                                <span className="font-semibold">{build.deviceName}</span>
                                <span className="text-gray-400">${build.totalPrice.toFixed(0)}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">You have no saved builds to compare with.</p>
                )}
                 <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
