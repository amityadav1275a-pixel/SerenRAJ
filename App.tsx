import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { DeviceSelector } from './components/DeviceSelector';
import { PromptInput } from './components/PromptInput';
import { Loader } from './components/Loader';
import { ConfigurationDisplay } from './components/ConfigurationDisplay';
import { AuthModal } from './components/AuthModal';
import { SavedBuilds } from './components/SavedBuilds';
import { AdvisorInput } from './components/AdvisorInput';
import { AdvisorResult } from './components/AdvisorResult';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { generateConfiguration, generateDeviceImage, findBestMarketDevice } from './services/geminiService';
import type { CustomConfiguration, DeviceType, User, AdvisorCriteria, AdvisorResultData } from './types';

const heroPrompt = "A distraction-free phone with a world-class camera for photography, exceptional battery life, and powerful on-device AI. It should have essentials like Gmail & WhatsApp, but no social media or other clutter. The design should be minimalist and premium. The final recommended build should be under $360 USD (around ₹30,000 INR) to be a 'value flagship', but you should still offer more expensive upgrade options.";

type AppState = 'selecting_device' | 'entering_prompt' | 'loading' | 'showing_config' | 'entering_advisor_criteria' | 'showing_advisor_result';
type AppView = 'main' | 'saved_builds';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('selecting_device');
  const [appView, setAppView] = useState<AppView>('main');
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [configuration, setConfiguration] = useState<CustomConfiguration | null>(null);
  const [advisorResult, setAdvisorResult] = useState<AdvisorResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<CustomConfiguration[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('techspec_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedBuildsData = localStorage.getItem('techspec_builds');
      if (savedBuildsData) {
        setSavedBuilds(JSON.parse(savedBuildsData));
      }
      const tutorialCompleted = localStorage.getItem('techspec_tutorial_completed');
      if (!tutorialCompleted) {
        setShowTutorial(true);
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!deviceType) return;
    setAppState('loading');
    setAppView('main');
    setError(null);
    setConfiguration(null);
    try {
      const config = await generateConfiguration(prompt, deviceType);
      setConfiguration(config);
      setAppState('showing_config');
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setAppState(deviceType ? 'entering_prompt' : 'selecting_device');
    }
  }, [deviceType]);

  const handleFindDevice = useCallback(async (criteria: AdvisorCriteria) => {
    setAppState('loading');
    setAppView('main');
    setError(null);
    setAdvisorResult(null);
    try {
        const result = await findBestMarketDevice(criteria);
        setAdvisorResult(result);
        setAppState('showing_advisor_result');
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        setAppState('selecting_device');
    }
  }, []);
  
  const handleSelectHero = () => {
    setDeviceType('phone');
    handleGenerate(heroPrompt);
  };
  
  const handleSelectAdvisor = () => {
    setAppState('entering_advisor_criteria');
  };

  const handleStartOver = () => {
    setAppState('selecting_device');
    setAppView('main');
    setDeviceType(null);
    setConfiguration(null);
    setAdvisorResult(null);
    setError(null);
    setImageError(null);
  };

  const handleSignIn = (provider: 'Google' | 'Apple') => {
    const demoUser = { name: 'Demo User', email: `demo@${provider.toLowerCase()}.com` };
    setUser(demoUser);
    localStorage.setItem('techspec_user', JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('techspec_user');
    handleStartOver();
  };

  const handleSaveBuild = () => {
    if (!configuration || !user) return;
    const newSavedBuilds = [configuration, ...savedBuilds.filter(b => b.deviceName !== configuration.deviceName)];
    setSavedBuilds(newSavedBuilds);
    localStorage.setItem('techspec_builds', JSON.stringify(newSavedBuilds));
    alert(`${configuration.deviceName} saved to your builds!`);
  };

  const handleLoadBuild = (build: CustomConfiguration) => {
    setConfiguration(build);
    // Use the explicit deviceType if it exists, otherwise fall back to the old inference method for backward compatibility.
    const type = build.deviceType || (build.deviceName.toLowerCase().includes('laptop') ? 'laptop' : 'phone');
    setDeviceType(type);
    setAppState('showing_config');
    setAppView('main');
  };

  const handleDeviceNameChange = (newName: string) => {
    if (configuration) {
      setConfiguration({ ...configuration, deviceName: newName });
    }
  };
  
  const handleComponentChange = async (newConfig: CustomConfiguration, changedComponent: string) => {
    const designComponents = ['material', 'display', 'camera design', 'keyboard', 'aesthetic', 'form factor', 'biometric', 'cooling', 'ports', 'backlight'];
    const isDesignChange = designComponents.some(c => changedComponent.toLowerCase().includes(c));
    
    // Immediately update component selections. The `imageUrl` in newConfig is still the old, valid one.
    setConfiguration(newConfig);
    setImageError(null);

    // If it's a visual component, attempt to fetch a new image.
    if (isDesignChange && deviceType) {
        setIsImageLoading(true);
        try {
            const newImageUrl = await generateDeviceImage(newConfig, deviceType);
            // On success, update the configuration with just the new image URL.
            setConfiguration(prev => prev ? ({...prev, imageUrl: newImageUrl}) : null);
        } catch (e) {
            console.error("Failed to regenerate image on component change", e);
            // On failure, just set an error. The configuration already holds the last valid image URL.
            setImageError("Couldn't update image. Please try another option.");
        } finally {
            setIsImageLoading(false);
        }
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('techspec_tutorial_completed', 'true');
  };

  const handleNextTutorialStep = () => {
    // 3 steps total (0, 1, 2)
    if (tutorialStep < 2) {
      setTutorialStep(prev => prev + 1);
    } else {
      handleSkipTutorial();
    }
  };

  const renderMainContent = () => {
    if (error) {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={handleStartOver}>
            <div className="bg-gray-800 border border-red-500/50 rounded-lg p-8 max-w-lg w-full shadow-2xl shadow-red-500/20" onClick={e => e.stopPropagation()}>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 mb-4">
                    <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-3 text-center">Generation Failed</h3>
                <p className="text-gray-400 mb-6 text-center">We couldn't generate a device configuration based on your request.</p>

                <div className="bg-gray-900/50 rounded-md p-4 text-left mb-6 border border-gray-700">
                    <p className="text-sm text-gray-500 font-mono border-b border-gray-700 pb-2 mb-2">Error Details:</p>
                    <p className="text-sm text-gray-400 font-mono">{error}</p>
                </div>

                <div className="text-left mb-8">
                    <h4 className="font-semibold text-white mb-2">What you can try:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                        <li>Rephrase your prompt with more specific details.</li>
                        <li>Check your internet connection.</li>
                        <li>The AI service might be busy. Please try again in a moment.</li>
                    </ul>
                </div>
                
                <button
                    onClick={handleStartOver}
                    className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
      );
    }
    
    switch (appState) {
      case 'selecting_device':
        return <DeviceSelector 
            onSelectDevice={(type) => { setDeviceType(type); setAppState('entering_prompt');}} 
            onSelectHero={handleSelectHero}
            onSelectAdvisor={handleSelectAdvisor} 
        />;
      case 'entering_prompt':
        if (!deviceType) { handleStartOver(); return null; }
        return <PromptInput onGenerate={handleGenerate} deviceType={deviceType} />;
      case 'entering_advisor_criteria':
        return <AdvisorInput onFind={handleFindDevice} />;
      case 'loading':
        return <Loader />;
      case 'showing_config':
        if (!configuration) { handleStartOver(); return null; }
        return (
            <ErrorBoundary onReset={handleStartOver}>
                <ConfigurationDisplay 
                    initialConfiguration={configuration} 
                    onStartOver={handleStartOver} 
                    user={user}
                    onSaveBuild={handleSaveBuild}
                    onDeviceNameChange={handleDeviceNameChange}
                    onComponentChange={handleComponentChange}
                    isImageLoading={isImageLoading}
                    imageError={imageError}
                    onClearImageError={() => setImageError(null)}
                />
            </ErrorBoundary>
        );
      case 'showing_advisor_result':
        if (!advisorResult) { handleStartOver(); return null; }
        return (
            <ErrorBoundary onReset={handleStartOver}>
                <AdvisorResult result={advisorResult} onStartOver={handleStartOver} />
            </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        user={user} 
        onSignIn={() => setIsAuthModalOpen(true)} 
        onSignOut={handleSignOut}
        onShowBuilds={() => setAppView('saved_builds')}
        onShowHome={handleStartOver}
      />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div key={appView + appState} className="animate-fade-in">
            {appView === 'main' ? renderMainContent() : <SavedBuilds savedBuilds={savedBuilds} onLoadBuild={handleLoadBuild} />}
        </div>
      </main>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onSignIn={handleSignIn} />}
      {showTutorial && appState === 'selecting_device' && (
        <OnboardingTutorial
          step={tutorialStep}
          onNext={handleNextTutorialStep}
          onSkip={handleSkipTutorial}
        />
      )}
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>Powered by Google Gemini. All specifications and prices are AI-generated for demonstrative purposes.</p>
      </footer>
    </div>
  );
};

export default App;
