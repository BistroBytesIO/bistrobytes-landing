import { useState } from 'react';
import ContactForm from './LeadForm/ContactForm';
import CalendarPicker from './LeadForm/CalendarPicker';

export default function MainFormSection() {
    const [currentStep, setCurrentStep] = useState('contact');
    const [formData, setFormData] = useState({
        restaurantName: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [success, setSuccess] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null);

    const handleContactSubmit = (contactData) => {
        setFormData({ ...formData, ...contactData });
        setCurrentStep('calendar');
    };

    const handleCalendarSubmit = (appointmentResult) => {
        setAppointmentData(appointmentResult);
        setSuccess(true);
    };

    const resetForm = () => {
        setCurrentStep('contact');
        setSuccess(false);
        setAppointmentData(null);
        setFormData({
            restaurantName: '',
            firstName: '',
            lastName: '',
            email: ''
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header with progress indicator */}
                <div className="p-6 pb-4 bg-white border-b">
                    <h2 className="text-2xl font-bold text-bistro-primary text-center mb-6">
                        {success ? 'Meeting Scheduled!' : 'Schedule Your Free Consultation'}
                    </h2>

                    {/* Progress indicator - only show if not in success state */}
                    {!success && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                <div className={`flex flex-col items-center ${currentStep === 'contact' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'contact' ? 'bg-bistro-primary text-white' : 'bg-gray-200'}`}>
                                        1
                                    </div>
                                    <span className="text-sm">Your Info</span>
                                </div>
                                <div className={`flex-1 h-1 mx-4 ${currentStep === 'contact' ? 'bg-gray-200' : 'bg-bistro-primary'}`}></div>

                                <div className={`flex flex-col items-center ${currentStep === 'calendar' ? 'text-bistro-primary font-medium' : 'text-gray-400'}`}>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'calendar' ? 'bg-bistro-primary text-white' : 'bg-gray-200'}`}>
                                        2
                                    </div>
                                    <span className="text-sm">Schedule</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content section */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Consultation Scheduled!</h3>
                            <p className="text-gray-600 mb-6">
                                Your BistroBytes demo consultation has been scheduled and added to your calendar.
                            </p>

                            {appointmentData && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                    <h4 className="font-semibold text-gray-800 mb-3">Meeting Details:</h4>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Date & Time:</span>
                                            <span className="ml-2 text-gray-600">
                                                {appointmentData.date} at {appointmentData.time}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <span className="font-medium text-gray-700">Restaurant:</span>
                                            <span className="ml-2 text-gray-600">{formData.restaurantName}</span>
                                        </div>
                                        
                                        <div>
                                            <span className="font-medium text-gray-700">Contact:</span>
                                            <span className="ml-2 text-gray-600">{formData.firstName} {formData.lastName}</span>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Email:</span>
                                            <span className="ml-2 text-gray-600">{formData.email}</span>
                                        </div>

                                        {appointmentData.zoomJoinUrl && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded border">
                                                <div className="font-medium text-blue-800 mb-2">
                                                    📱 Zoom Meeting Link:
                                                </div>
                                                <a 
                                                    href={appointmentData.zoomJoinUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                                                >
                                                    {appointmentData.zoomJoinUrl}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-bistro-secondary rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-bistro-primary mb-2">What's Next?</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• You'll receive a calendar invitation via email</li>
                                    <li>• We'll prepare a customized demo based on your responses</li>
                                    <li>• Join the Zoom meeting at your scheduled time</li>
                                    <li>• Get ready to see how BistroBytes can transform your business!</li>
                                </ul>
                            </div>

                            <button
                                onClick={resetForm}
                                className="bg-bistro-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors mb-4"
                            >
                                Schedule Another Consultation
                            </button>

                            <p className="text-sm text-gray-500">
                                Questions before our meeting? Email us at demo@bistrobytes.io
                            </p>
                        </div>
                    ) : (
                        <>
                            {currentStep === 'contact' && (
                                <ContactForm onSubmit={handleContactSubmit} initialData={formData} />
                            )}

                            {currentStep === 'calendar' && (
                                <CalendarPicker onSubmit={handleCalendarSubmit} formData={formData} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}