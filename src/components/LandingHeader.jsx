import logo from '../assets/bistro_bytes_final_transparent_logo.png';

export default function LandingHeader() {
    return (
        <div className="text-center mb-8 sm:mb-12">
            {/* Logo */}
            <img src={logo} alt="BistroBytes Logo" className="h-16 sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6" />

            {/* Main headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
                Bistro Bytes Free Service Consultation
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 px-2 max-w-3xl mx-auto">
                Schedule a free consultation time to see how Bistro Bytes can assist you in your business website needs
            </p>
        </div>
    );
}