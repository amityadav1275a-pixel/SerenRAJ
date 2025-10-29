import React, { useState } from 'react';
import type { CustomConfiguration, Currency } from '../types';
import { USD_TO_INR_RATE } from '../types';

interface SavedBuildsProps {
    savedBuilds: CustomConfiguration[];
    onLoadBuild: (build: CustomConfiguration) => void;
}

const formatCurrency = (amount: number, currency: Currency, rate: number) => {
    const displayAmount = currency === 'INR' ? amount * rate : amount;
    const currencyCode = currency === 'INR' ? 'INR' : 'USD';
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(displayAmount);
};

export const SavedBuilds: React.FC<SavedBuildsProps> = ({ savedBuilds, onLoadBuild }) => {
    const [currency, setCurrency] = useState<Currency>('USD');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Saved Builds</h2>
                <div className="flex rounded-md bg-gray-800 p-0.5 text-xs">
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-2 py-0.5 rounded transition-colors ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        USD
                    </button>
                    <button
                        onClick={() => setCurrency('INR')}
                        className={`px-2 py-0.5 rounded transition-colors ${currency === 'INR' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        INR
                    </button>
                </div>
            </div>

            {savedBuilds.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-300">No Builds Saved Yet</h3>
                    <p className="text-gray-500 mt-2">Create a custom device and save it to see it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedBuilds.map((build, index) => (
                        <div key={`${build.deviceName}-${index}`} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-center hover:border-indigo-500 transition-colors">
                            <div>
                                <h4 className="text-lg font-semibold">{build.deviceName}</h4>
                                <p className="text-gray-400">{formatCurrency(build.totalPrice, currency, USD_TO_INR_RATE)}</p>
                            </div>
                            <button
                                onClick={() => onLoadBuild(build)}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm"
                            >
                                Load Build
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};