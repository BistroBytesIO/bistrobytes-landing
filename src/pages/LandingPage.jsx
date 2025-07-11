import LandingHeader from '../components/LandingHeader';
import MainFormSection from '../components/MainFormSection';
import BulletPoints from '../components/BulletPoints';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-bistro-secondary">
            {/* Main content section */}
            <section className="min-h-screen flex flex-col">
                <div className="flex-1 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    {/* Header */}
                    <div className="max-w-6xl mx-auto">
                        <LandingHeader />
                    </div>
                    
                    {/* Main Form Section - replaces video and middle content */}
                    <div className="flex-1 flex flex-col justify-center w-full max-w-full">
                        <MainFormSection />
                    </div>
                </div>
            </section>

            {/* Footer section */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <BulletPoints />
                    <footer className="mt-16 text-center text-sm text-gray-600">
                        <a href="#" className="hover:underline mx-2">Terms of Service</a>
                        <a href="#" className="hover:underline mx-2">Privacy Policy</a>
                    </footer>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;