import ReactPlayer from 'react-player/lazy';

export default function VideoSection() {
    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
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
                            <button className="bg-bistro-primary text-white rounded-full p-3 sm:p-4 hover:bg-opacity-90 transition-colors">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </button>
                        }
                    />
                </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-bistro-primary mb-4 sm:mb-6 text-center">
                In This Demo You'll Discover...
            </h2>
            {/* Bullet points - Compact on mobile */}
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg mt-4 sm:mt-6">
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
    );
}