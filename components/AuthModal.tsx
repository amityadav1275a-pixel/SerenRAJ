import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

interface AuthModalProps {
    onClose: () => void;
    onSignIn: (provider: 'Google' | 'Apple') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignIn }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-sm w-full text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
                <p className="text-gray-400 mb-8">Sign in to save and manage your builds.</p>
                <div className="space-y-4">
                    <button
                        onClick={() => onSignIn('Google')}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <GoogleIcon />
                        <span>Sign in with Google</span>
                    </button>
                    <button
                        onClick={() => onSignIn('Apple')}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <AppleIcon />
                        <span>Sign in with Apple</span>
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-6">
                    This is a simulated sign-in for demonstration purposes. No personal data is collected.
                </p>
            </div>
        </div>
    );
};