export default function CTAButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-bistro-primary hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all"
        >
            See How BistroBytes Can Work For Your Restaurant
        </button>
    );
}