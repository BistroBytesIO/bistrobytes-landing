export default function StartPage({ onNext }) {
    return (
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Let's Get Started With Your Free Consultation
            </h2>

            <p className="mb-6 text-gray-600">
                Thank you for your interest in BistroBytes! This quick consultation will help us understand your business website needs so we can provide you with the best possible assistance.
                <br /><br />
                The process takes less than 5 minutes to complete, and you'll be able to schedule your free consultation immediately afterward.
            </p>

            <button
                onClick={onNext}
                className="w-full bg-bistro-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
                Start Consultation Process
            </button>
        </div>
    );
}