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
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-bistro-secondary">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <LandingHeader />
                <VideoSection />
                <BulletPoints />

                <div className="mt-12 text-center">
                    <div className="mb-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={hasCompletedSurvey}
                            className={`${
                                hasCompletedSurvey
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'bg-bistro-primary hover:bg-opacity-90 text-white hover:scale-105'
                            } font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all`}
                        >
                            {hasCompletedSurvey 
                                ? 'Thank You! We\'ll Be In Touch Soon' 
                                : 'See How BistroBytes Can Work For Your Restaurant'
                            }
                        </button>
                    </div>
                    
                    {hasCompletedSurvey && (
                        <p className="text-sm text-gray-600 mb-4">
                            Your consultation has been scheduled. Check your email for meeting details.
                        </p>
                    )}
                    
                    <LimitedAvailability />
                </div>

                <footer className="mt-16 text-center text-sm text-gray-600">
                    <a href="#" className="hover:underline mx-2">Terms of Service</a>
                    <a href="#" className="hover:underline mx-2">Privacy Policy</a>
                </footer>
            </div>

            <FormModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                onComplete={handleSurveyComplete}
            />
        </div>
    );
}

export default LandingPage