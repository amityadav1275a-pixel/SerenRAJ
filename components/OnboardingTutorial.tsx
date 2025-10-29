import React from 'react';

interface OnboardingTutorialProps {
    step: number;
    onNext: () => void;
    onSkip: () => void;
}

const tutorialSteps = [
    {
        title: "Welcome to TechSpec AI!",
        content: "This quick tour will show you how to find or create your perfect device. You can either build a custom device from scratch or get an AI recommendation for the best device on the market.",
        buttonText: "Let's Go!",
    },
    {
        title: "Two Paths to Your Perfect Device",
        content: "Use the 'Build a Custom' options to design a device with your exact specifications. Or, choose 'Find Existing Device' and our AI Market Advisor will search the web to find the best real-world tech for your budget and needs.",
        buttonText: "Next",
    },
    {
        title: "Save & Manage Your Builds",
        content: "Click 'Sign In' to create a (simulated) account. This allows you to save your custom creations to the 'My Builds' library, so you can come back and tweak them anytime.",
        buttonText: "Got it, Finish Tour",
    }
];


export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ step, onNext, onSkip }) => {
    const currentStep = tutorialSteps[step];
    if (!currentStep) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
            <div className="bg-gray-800 border border-indigo-500/50 rounded-lg p-8 max-w-md w-full text-center shadow-2xl shadow-indigo-500/20 m-4 relative">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300 mb-4">{currentStep.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{currentStep.content}</p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={onSkip}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={onNext}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        {currentStep.buttonText}
                    </button>
                </div>
                
                <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {step + 1} / {tutorialSteps.length}
                </div>
            </div>
        </div>
    );
};