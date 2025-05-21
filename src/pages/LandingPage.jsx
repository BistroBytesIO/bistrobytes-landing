import { useState } from 'react';
import LandingHeader from '../components/LandingHeader';
import VideoSection from '../components/VideoSection';
import BulletPoints from '../components/BulletPoints';
import CTAButton from '../components/CTAButton';
import LimitedAvailability from '../components/LimitedAvailability';
import FormModal from '../components/LeadForm/FormModal';

const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bistro-secondary">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <LandingHeader />
                <VideoSection />
                <BulletPoints />

                <div className="mt-12 text-center">
                    <CTAButton onClick={() => setIsModalOpen(true)} />
                    <LimitedAvailability />
                </div>

                <footer className="mt-16 text-center text-sm text-gray-600">
                    <a href="#" className="hover:underline mx-2">Terms of Service</a>
                    <a href="#" className="hover:underline mx-2">Privacy Policy</a>
                </footer>
            </div>

            <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default LandingPage