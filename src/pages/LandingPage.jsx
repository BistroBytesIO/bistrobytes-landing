import { useState } from 'react';
import LandingHeader from '../components/LandingHeader';
import VideoSection from '../components/VideoSection';
import BulletPoints from '../components/BulletPoints';
import CTAButton from '../components/CTAButton';
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

    return (
        <div className="min-h-screen bg-bistro-secondary">
            {/* Above the fold section - Hero + Video */}
            <section className="min-h-screen flex flex-col">
                <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    {/* Header - Compact for mobile */}
                    <LandingHeader />
                    
                    {/* Video Section - Takes remaining space */}
                    <div className="flex-1 flex flex-col justify-center">
                        <VideoSection />
                        
                        {/* Primary CTA - Visible above the fold */}
                        <div className="text-center mt-4 sm:mt-6">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={hasCompletedSurvey}
                                className={`${
                                    hasCompletedSurvey
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                        : 'bg-bistro-primary hover:bg-opacity-90 text-white hover:scale-105'
                                } font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transform transition-all w-full sm:w-auto`}
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