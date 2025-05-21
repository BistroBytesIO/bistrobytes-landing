export default function StartPage({ onNext }) {
    return (
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Let's Customize BistroBytes For Your Restaurant
            </h2>

            <p className="mb-6 text-gray-600">
                Thank you for your interest in eliminating commission fees and taking control of your online ordering. This quick 4-question survey will help us understand your restaurant's specific needs so we can prepare a personalized demo that addresses your unique challenges.
                <br /><br />
                It takes less than 2 minutes to complete, and you'll be able to schedule a no-obligation consultation with our team afterward.
            </p>

            <button
                onClick={onNext}
                className="w-full bg-bistro-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
                Start Quick Survey
            </button>
        </div>
    );
}