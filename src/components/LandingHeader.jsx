import logo from '../assets/bistro_bytes_final_transparent_logo.png';

export default function LandingHeader() {
    return (
        <div className="text-center mb-3 sm:mb-4">
            {/* Logo - Bigger and less padding */}
            <img src={logo} alt="BistroBytes Logo" className="h-16 sm:h-20 lg:h-24 mx-auto mb-2 sm:mb-3" />

            {/* Main headline - Shortened and more punchy */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight px-2">
                Boost Restaurant Revenue 25% By Eliminating Third-Party Commission Fees Forever
            </h1>

            {/* Subheadline - More concise */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 px-2">
                <span className="hidden sm:inline">Custom online ordering system built for your restaurant</span>
                <span className="sm:hidden">Custom ordering system for restaurants</span>
            </p>
        </div>
    );
}