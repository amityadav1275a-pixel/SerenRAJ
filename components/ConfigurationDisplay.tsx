import React, { useState, useMemo } from 'react';
import type { CustomConfiguration, Customization, CustomizationOption, Currency, User } from '../types';
import { USD_TO_INR_RATE } from '../types';
import { CpuIcon } from './icons/CpuIcon';
import { GpuIcon } from './icons/GpuIcon';
import { RamIcon } from './icons/RamIcon';
import { StorageIcon } from './icons/StorageIcon';
import { ScreenIcon } from './icons/ScreenIcon';
import { BatteryIcon } from './icons/BatteryIcon';
import { CameraIcon } from './icons/CameraIcon';
import { MaterialIcon } from './icons/MaterialIcon';
import { CameraDesignIcon } from './icons/CameraDesignIcon';
import { KeyboardIcon } from './icons/KeyboardIcon';
import { DesignAestheticIcon } from './icons/DesignAestheticIcon';
import { FormFactorIcon } from './icons/FormFactorIcon';
import { HapticsIcon } from './icons/HapticsIcon';
import { AudioIcon } from './icons/AudioIcon';
import { SecurityIcon } from './icons/SecurityIcon';
import { PortsIcon } from './icons/PortsIcon';
import { WebcamIcon } from './icons/WebcamIcon';
import { CoolingIcon } from './icons/CoolingIcon';


interface ConfigurationDisplayProps {
  initialConfiguration: CustomConfiguration;
  onStartOver: () => void;
  user: User | null;
  onSaveBuild: () => void;
  onDeviceNameChange: (newName: string) => void;
  onComponentChange: (newConfig: CustomConfiguration, changedComponent: string) => void;
  isImageLoading: boolean;
  imageError: string | null;
  onClearImageError: () => void;
}

const componentIcons: Record<string, React.ReactNode> = {
    "cpu": <CpuIcon />,
    "gpu": <GpuIcon />,
    "ram": <RamIcon />,
    "storage": <StorageIcon />,
    "display": <ScreenIcon />,
    "battery": <BatteryIcon />,
    "camera system": <CameraIcon />,
    "material": <MaterialIcon />,
    "camera design": <CameraDesignIcon />,
    "keyboard": <KeyboardIcon />,
    "design aesthetic": <DesignAestheticIcon />,
    "form factor": <FormFactorIcon />,
    "haptic": <HapticsIcon />,
    "audio": <AudioIcon />,
    "biometric": <SecurityIcon />,
    "ports": <PortsIcon />,
    "webcam": <WebcamIcon />,
    "cooling": <CoolingIcon />,
};

const getIconForComponent = (componentName: string) => {
    const lowerCaseName = componentName.toLowerCase();
    for (const key in componentIcons) {
        if (lowerCaseName.includes(key)) {
            return componentIcons[key];
        }
    }
    return <CpuIcon />;
};

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

export const ConfigurationDisplay: React.FC<ConfigurationDisplayProps> = ({ 
    initialConfiguration, 
    onStartOver, 
    user, 
    onSaveBuild,
    onDeviceNameChange,
    onComponentChange,
    isImageLoading,
    imageError,
    onClearImageError
}) => {
    const config = initialConfiguration;
    const [currency, setCurrency] = useState<Currency>('USD');

    const deviceType = config.deviceType;

    const handleOptionChange = (componentName: string, selectedOption: CustomizationOption) => {
        const newCustomizations = config.customizations.map(cust => {
            if (cust.component === componentName) {
                return { ...cust, selection: selectedOption.selection, price: selectedOption.price, reason: selectedOption.reason };
            }
            return cust;
        });
        const newConfig = { ...config, customizations: newCustomizations };
        onComponentChange(newConfig, componentName);
    };
    
    const totalPrice = useMemo(() => {
        return config.customizations.reduce((total, cust) => total + cust.price, config.basePrice);
    }, [config.customizations, config.basePrice]);

    const handleAddToCart = () => {
        const priceInSelectedCurrency = formatCurrency(totalPrice, currency, USD_TO_INR_RATE);
        alert(`${config.deviceName} has been added to your cart for ${priceInSelectedCurrency}.`);
        console.log("Added to cart:", { ...config, totalPrice, currency });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="lg:sticky top-24 self-start">
                    <input
                        type="text"
                        value={config.deviceName}
                        onChange={(e) => onDeviceNameChange(e.target.value)}
                        className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2 bg-transparent border-none focus:ring-0 w-full p-0"
                        placeholder="My Awesome Device"
                    />
                    <p className="text-gray-400 mb-6">{config.description}</p>
                    
                    <div className={`bg-gray-800 rounded-2xl overflow-hidden relative group border border-gray-700 shadow-2xl shadow-black/30 ${deviceType === 'laptop' ? 'aspect-video' : 'aspect-[9/16]'}`}>
                        {config.imageUrl && (
                            <img 
                                src={config.imageUrl} 
                                alt={config.deviceName} 
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
                            />
                        )}

                        {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}

                        {imageError && (
                            <div className="absolute top-4 left-4 right-4 bg-red-800/90 text-white p-3 rounded-lg text-sm flex justify-between items-center animate-fade-in border border-red-500">
                                <span>{imageError}</span>
                                <button onClick={onClearImageError} className="font-bold text-lg leading-none">&times;</button>
                            </div>
                        )}
                        
                        {!config.imageUrl && !isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                <p className="text-gray-500">Device preview will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {config.customizations.map((cust: Customization) => (
                        <div key={cust.component} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 transition-all duration-300 transform hover:shadow-lg hover:shadow-indigo-500/10 hover:border-gray-600 hover:-translate-y-1 hover:scale-[1.02]">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="text-indigo-400">{getIconForComponent(cust.component)}</div>
                                <h3 className="text-lg font-semibold text-white">{cust.component}</h3>
                            </div>

                            <div className="space-y-3">
                                {cust.options.map((option) => (
                                    <label
                                        key={option.selection}
                                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform ${
                                            cust.selection === option.selection
                                                ? 'bg-indigo-900/50 border-indigo-500 shadow-md shadow-indigo-500/20'
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5 hover:scale-[1.01]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={cust.component}
                                            value={option.selection}
                                            checked={cust.selection === option.selection}
                                            onChange={() => handleOptionChange(cust.component, option)}
                                            className="hidden"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">{option.selection}</p>
                                            <p className="text-sm text-gray-400 mt-1">{option.reason}</p>
                                        </div>
                                        <p className="text-lg font-medium text-gray-300 ml-4">
                                            {option.price > 0 ? `+${formatCurrency(option.price, currency, USD_TO_INR_RATE)}` : 'Included'}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 mt-12 py-4 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 -mx-4 -mb-16 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm text-gray-400">Total Price</p>
                            <div className="flex rounded-md bg-gray-800 p-0.5 text-xs">
                                <button onClick={() => setCurrency('USD')} className={`px-2 py-0.5 rounded transition-colors ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>USD</button>
                                <button onClick={() => setCurrency('INR')} className={`px-2 py-0.5 rounded transition-colors ${currency === 'INR' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>INR</button>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalPrice, currency, USD_TO_INR_RATE)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={onStartOver} className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">Customize Another</button>
                        {user && (
                            <>
                                <button onClick={onSaveBuild} className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">Save Build</button>
                                <button onClick={handleAddToCart} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">Add to Cart</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};