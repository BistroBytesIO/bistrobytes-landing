import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import StartPage from './StartPage';
import ContactForm from './ContactForm';
import QuestionnaireForm from './QuestionnaireForm';
import CalendarPicker from './CalendarPicker';

export default function FormModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState('start');
    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        email: '',
        phone: '',
        interests: [],
        currentSolution: '',
        locations: '',
        biggestChallenge: ''
    });
    const [success, setSuccess] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Handler functions remain the same...
    const handleStartNext = () => {
        setCurrentStep('contact');
    };

    const handleContactSubmit = (contactData) => {
        setFormData({ ...formData, ...contactData });
        setCurrentStep('questionnaire');
    };

    const handleQuestionnaireSubmit = (questionnaireData) => {
        setFormData({ ...formData, ...questionnaireData });
        setCurrentStep('calendar');
    };

    const handleCalendarSubmit = (appointmentData) => {
        setSuccess(true);
        setTimeout(() => {
            onClose();
            setCurrentStep('start');
            setSuccess(false);
        }, 5000);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setCurrentStep('start');
            setSuccess(false);
        }, 300);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            {/* Modal container - full screen with padding */}
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
                {/* Modal content container - made scrollable */}
                <div
                    className="w-full max-w-lg max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Fixed header section */}
                    <div className="p-6 pb-2 bg-white border-b">
                        <h2 className="text-2xl font-bold text-bistro-primary text-center">
                            Let's Transform Your Restaurant's Online Ordering Experience
                        </h2>

                        {/* Progress indicator */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div className={`flex flex-col items-center ${currentStep === 'start' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'start' ? 'bg-bistro-primary text-white' : 'bg-gray-200'}`}>
                                        1
                                    </div>
                                    <span className="text-xs">Intro</span>
                                </div>
                                <div className={`flex-1 h-1 mx-2 ${currentStep === 'start' ? 'bg-gray-200' : 'bg-bistro-primary'}`}></div>

                                <div className={`flex flex-col items-center ${currentStep === 'contact' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'contact' ? 'bg-bistro-primary text-white' : (currentStep === 'questionnaire' || currentStep === 'calendar' ? 'bg-bistro-primary text-white' : 'bg-gray-200')}`}>
                                        2
                                    </div>
                                    <span className="text-xs">Contact</span>
                                </div>
                                <div className={`flex-1 h-1 mx-2 ${currentStep === 'start' || currentStep === 'contact' ? 'bg-gray-200' : 'bg-bistro-primary'}`}></div>

                                <div className={`flex flex-col items-center ${currentStep === 'questionnaire' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'questionnaire' ? 'bg-bistro-primary text-white' : (currentStep === 'calendar' ? 'bg-bistro-primary text-white' : 'bg-gray-200')}`}>
                                        3
                                    </div>
                                    <span className="text-xs">Questions</span>
                                </div>
                                <div className={`flex-1 h-1 mx-2 ${currentStep === 'start' || currentStep === 'contact' || currentStep === 'questionnaire' ? 'bg-gray-200' : 'bg-bistro-primary'}`}></div>

                                <div className={`flex flex-col items-center ${currentStep === 'calendar' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'calendar' ? 'bg-bistro-primary text-white' : 'bg-gray-200'}`}>
                                        4
                                    </div>
                                    <span className="text-xs">Schedule</span>
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={handleClose}
                            aria-label="Close dialog"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Scrollable content section */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {success ? (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Appointment Scheduled!</h3>
                                <p className="text-gray-600 mb-6">
                                    We've scheduled your consultation and sent a confirmation email.
                                    Looking forward to showing you how BistroBytes can help your restaurant!
                                </p>
                            </div>
                        ) : (
                            <>
                                {currentStep === 'start' && (
                                    <StartPage onNext={handleStartNext} />
                                )}

                                {currentStep === 'contact' && (
                                    <ContactForm onSubmit={handleContactSubmit} initialData={formData} />
                                )}

                                {currentStep === 'questionnaire' && (
                                    <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} initialData={formData} />
                                )}

                                {currentStep === 'calendar' && (
                                    <CalendarPicker onSubmit={handleCalendarSubmit} formData={formData} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}