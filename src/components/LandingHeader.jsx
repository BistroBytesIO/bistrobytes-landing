import logo from '../assets/react.svg';

export default function LandingHeader() {
    return (
        <div className="text-center mb-10">
            <img src={logo} alt="BistroBytes Logo" className="h-20 mx-auto mb-8" />

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover How Restaurant Owners Can Boost Revenue By 25% With A Custom Online Ordering System That Eliminates Third-Party Commission Fees Forever
            </h1>

            <p className="text-xl text-gray-700">
                (Make sure your sound is turned on to watch our quick demo!)
            </p>
        </div>
    );
}