import { useState } from 'react';
import LandingHeader from '../components/LandingHeader';
import VideoSection from '../components/VideoSection';
import BulletPoints from '../components/BulletPoints';
import LimitedAvailability from '../components/LimitedAvailability';
import FormModal from '../components/LeadForm/FormModal';

const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSurveyComplete = () => {
        setHasCompletedSurvey(true);
    };

    const handleCTAClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-bistro-secondary">
            {/* Above the fold section - Hero + Video */}
            <section className="min-h-screen flex flex-col">
                <div className="flex-1 w-full max-w-full mx-auto px-4 sm:px-4 pt-4 pb-0 sm:py-4">
                    {/* Header - reduced padding to maximize space */}
                    <div className="max-w-6xl mx-auto sm:mb-2">
                        <LandingHeader />
                    </div>
                    
                    {/* Content Area - full width container */}
                    <div className="flex-1 flex flex-col justify-center w-full max-w-full">
                        {/* Video Section with integrated CTA for desktop */}
                        <VideoSection 
                            onCTAClick={handleCTAClick} 
                            hasCompletedSurvey={hasCompletedSurvey} 
                        />
                        
                        {/* Mobile-only CTA button and Limited Availability */}
                        <div className="sm:hidden text-center mt-4 max-w-md mx-auto">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={hasCompletedSurvey}
                                className={`${
                                    hasCompletedSurvey
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                        : 'bg-bistro-primary hover:bg-opacity-90 text-white hover:scale-105'
                                } font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all w-full`}
                            >
                                {hasCompletedSurvey 
                                    ? 'Thank You! We\'ll Be In Touch Soon' 
                                    : 'See How BistroBytes Can Work For Your Restaurant'
                                }
                            </button>
                            
                            {hasCompletedSurvey && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Your consultation has been scheduled. Check your email for meeting details.
                                </p>
                            )}
                            
                            <LimitedAvailability />
                        </div>
                    </div>
                </div>
            </section>

            {/* Below the fold content */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <BulletPoints />
                    <footer className="mt-16 text-center text-sm text-gray-600">
                        <a href="#" className="hover:underline mx-2">Terms of Service</a>
                        <a href="#" className="hover:underline mx-2">Privacy Policy</a>
                    </footer>
                </div>
            </section>

            <FormModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                onComplete={handleSurveyComplete}
            />
        </div>
    );
}

export default LandingPage