import React, { useState } from 'react';
import type { AdvisorResultData, Currency } from '../types';
import { USD_TO_INR_RATE } from '../types';

interface AdvisorResultProps {
  result: AdvisorResultData;
  onStartOver: () => void;
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

export const AdvisorResult: React.FC<AdvisorResultProps> = ({ result, onStartOver }) => {
    const [currency, setCurrency] = useState<Currency>('INR');
    const deviceType = result.deviceName.toLowerCase().includes('laptop') ? 'laptop' : 'phone';

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400">AI Recommendation</h2>
                <p className="text-3xl md:text-4xl font-bold mt-2">The Best Device For You</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="lg:sticky top-24 self-start">
                    {result.imageUrl && (
                        <div className={`bg-gray-800 rounded-2xl overflow-hidden group border border-gray-700 ${deviceType === 'laptop' ? 'aspect-video' : 'aspect-[9/16]'}`}>
                            <img src={result.imageUrl} alt={result.deviceName} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight text-white">{result.deviceName}</h3>
                        <p className="text-lg text-gray-400">by {result.company}</p>
                    </div>

                    <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2">
                             <p className="text-sm text-gray-400">Approx. Price</p>
                            <div className="flex rounded-md bg-gray-800 p-0.5 text-xs">
                                <button onClick={() => setCurrency('USD')} className={`px-2 py-0.5 rounded transition-colors ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>USD</button>
                                <button onClick={() => setCurrency('INR')} className={`px-2 py-0.5 rounded transition-colors ${currency === 'INR' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>INR</button>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatCurrency(result.approximatePriceUSD, currency, USD_TO_INR_RATE)}</p>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{result.description}</p>
                    
                    <div>
                        <h4 className="font-semibold text-lg mb-3">Key Specifications</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                            {result.keySpecs.map(spec => <li key={spec}>{spec}</li>)}
                        </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-green-400">Pros</h4>
                            <ul className="space-y-2">
                                {result.pros.map(pro => <li key={pro} className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span> {pro}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-red-400">Cons</h4>
                            <ul className="space-y-2">
                                {result.cons.map(con => <li key={con} className="flex items-start"><span className="text-red-500 mr-2 mt-1">&#10007;</span> {con}</li>)}
                            </ul>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-lg mb-3">AI's Reasoning</h4>
                        <p className="text-gray-400 leading-relaxed">{result.reasoning}</p>
                    </div>

                     {result.groundingSources && result.groundingSources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-3">Sources</h4>
                            <ul className="space-y-2 text-sm">
                                {result.groundingSources.map(source => (
                                    <li key={source.uri}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline truncate block">
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center mt-12">
                 <button onClick={onStartOver} className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">Search Again</button>
            </div>
        </div>
    );
};