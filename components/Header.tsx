import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User | null;
    onSignIn: () => void;
    onSignOut: () => void;
    onShowBuilds: () => void;
    onShowHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignIn, onSignOut, onShowBuilds, onShowHome }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onShowHome} title="Start Over">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 10v4m-2-2h4M5 11h14M5 11a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 11v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
            </svg>
            <h1 className="text-2xl font-bold text-white">TechSpec AI</h1>
        </div>
        <div className="flex items-center space-x-4">
            {user ? (
                <>
                    <button
                        onClick={onShowBuilds}
                        className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                        My Builds
                    </button>
                    <span className="text-gray-300 hidden sm:block">Welcome, {user.name}</span>
                    <button
                        onClick={onSignOut}
                        className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <button
                    onClick={onSignIn}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm"
                >
                    Sign In
                </button>
            )}
        </div>
      </div>
    </header>
  );
};