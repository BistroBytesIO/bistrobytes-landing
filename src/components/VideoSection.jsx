import ReactPlayer from 'react-player/lazy';

export default function VideoSection({ onCTAClick, hasCompletedSurvey }) {
    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 lg:p-8 mb-3 sm:mb-4 w-full mx-auto sm:min-h-[400px] md:min-h-[420px] lg:min-h-[450px]">
            {/* Mobile layout (stacked) */}
            <div className="sm:hidden">
                {/* Video container with proper aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                        <ReactPlayer
                            url="/src/assets/demo.mp4"
                            width="100%"
                            height="100%"
                            controls={true}
                            light={true}
                            playIcon={
                                <button className="bg-bistro-primary text-white rounded-full p-3 hover:bg-opacity-90 transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            }
                        />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-bistro-primary mb-2 mt-3 text-center">
                    In This Demo You'll Discover...
                </h2>
                {/* Bullet points */}
                <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                        <span className="text-bistro-primary mr-2 flex-shrink-0">✓</span>
                        <span>How BistroBytes helps you take back control of your restaurant's digital presence</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-bistro-primary mr-2 flex-shrink-0">✓</span>
                        <span>A seamless ordering system designed specifically for your restaurant's unique needs</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-bistro-primary mr-2 flex-shrink-0">✓</span>
                        <span>Why restaurant owners are switching from delivery apps to custom solutions</span>
                    </li>
                </ul>
            </div>
            
            {/* Desktop layout (side by side) */}
            <div className="hidden sm:flex sm:flex-row sm:gap-6 lg:gap-10 sm:h-full max-w-7xl mx-auto">
                {/* Left column - Video */}
                <div className="sm:w-1/2 sm:flex sm:flex-col sm:justify-center">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                            <ReactPlayer
                                url="/src/assets/demo.mp4"
                                width="100%"
                                height="100%"
                                controls={true}
                                light={true}
                                playIcon={
                                    <button className="bg-bistro-primary text-white rounded-full p-4 hover:bg-opacity-90 transition-colors">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
                
                {/* Right column - Text content */}
                <div className="sm:w-1/2 sm:flex sm:flex-col sm:justify-center sm:py-2">
                    <h2 className="text-xl md:text-2xl font-bold text-bistro-primary mb-3 md:mb-4 text-left">
                        In This Demo You'll Discover...
                    </h2>
                    {/* Bullet points - more compact */}
                    <ul className="space-y-2 md:space-y-3 text-base md:text-lg mb-4 md:mb-5">
                        <li className="flex items-start">
                            <span className="text-bistro-primary mr-2 flex-shrink-0 text-lg">✓</span>
                            <span>How BistroBytes helps you take back control of your restaurant's digital presence</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-bistro-primary mr-2 flex-shrink-0 text-lg">✓</span>
                            <span>A seamless ordering system designed specifically for your restaurant's unique needs</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-bistro-primary mr-2 flex-shrink-0 text-lg">✓</span>
                            <span>Why restaurant owners are switching from delivery apps to custom solutions</span>
                        </li>
                    </ul>
                    
                    {/* Desktop CTA Button */}
                    <button
                        onClick={onCTAClick}
                        disabled={hasCompletedSurvey}
                        className={`${
                            hasCompletedSurvey
                                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                : 'bg-bistro-primary hover:bg-opacity-90 text-white hover:scale-105'
                        } font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform transition-all w-full`}
                    >
                        {hasCompletedSurvey 
                            ? 'Thank You! We\'ll Be In Touch Soon' 
                            : 'See How BistroBytes Can Work For Your Restaurant'
                        }
                    </button>
                    
                    {/* Limited Availability - Desktop */}
                    <div className="mt-3 text-center">
                        <p className="text-red-600 font-bold animate-pulse text-sm md:text-base">
                            LIMITED AVAILABILITY: We're currently accepting only 5 new restaurant partners this month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}