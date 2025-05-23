import logo from '../assets/bistro_bytes_final_transparent_logo.png';

export default function LandingHeader() {
    return (
        <div className="text-center mb-2 sm:mb-0">
            {/* Logo - Smaller on desktop */}
            <img src={logo} alt="BistroBytes Logo" className="h-16 sm:h-16 lg:h-20 mx-auto mb-2 sm:mb-1" />

            {/* Main headline - With balanced line break */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight px-2">
                Boost Restaurant Revenue 25% <br className="hidden sm:inline" />
                By Eliminating Third-Party Commission Fees
            </h1>

            {/* Subheadline - More concise */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 px-2">
                <span className="hidden sm:inline">Custom online ordering system built for your restaurant</span>
                <span className="sm:hidden">Custom ordering system for restaurants</span>
            </p>
        </div>
    );
}