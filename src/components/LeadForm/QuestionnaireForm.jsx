// src/components/LeadForm/QuestionnaireForm.jsx
import { useState } from 'react';

export default function QuestionnaireForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        interests: initialData.interests || [],
        currentSolution: initialData.currentSolution || '',
        locations: initialData.locations || '',
        biggestChallenge: initialData.biggestChallenge || ''
    });

    const [errors, setErrors] = useState({});

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedInterests = [...formData.interests];

        if (checked) {
            updatedInterests.push(value);
        } else {
            updatedInterests = updatedInterests.filter(interest => interest !== value);
        }

        setFormData({
            ...formData,
            interests: updatedInterests
        });

        // Clear error for interests if at least one is selected
        if (updatedInterests.length > 0 && errors.interests) {
            setErrors({
                ...errors,
                interests: null
            });
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field when user selects an option
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = {};

        if (formData.interests.length === 0) {
            newErrors.interests = 'Please select at least one option';
        }

        if (!formData.currentSolution) {
            newErrors.currentSolution = 'Please select your current solution';
        }

        if (!formData.locations) {
            newErrors.locations = 'Please select number of locations';
        }

        // If there are validation errors, show them and don't proceed
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit the form data
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. What aspects of the demo interested you most? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Eliminating commission fees',
                        'Custom branding options',
                        'Menu management system',
                        'Order fulfillment workflow',
                        'Customer data ownership',
                        'Other'
                    ].map(option => (
                        <div key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`interest-${option}`}
                                value={option}
                                checked={formData.interests.includes(option)}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-bistro-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`interest-${option}`} className="ml-2 text-sm text-gray-700">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.interests && (
                    <p className="text-red-500 text-xs mt-1">{errors.interests}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. What is your current online ordering solution? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'No online ordering currently',
                        'Third-party apps only (UberEats, DoorDash, etc.)',
                        'Basic website form',
                        'Another custom solution',
                        'Other'
                    ].map(option => (
                        <div key={option} className="flex items-center">
                            <input
                                type="radio"
                                id={`solution-${option}`}
                                name="currentSolution"
                                value={option}
                                checked={formData.currentSolution === option}
                                onChange={handleRadioChange}
                                className="h-4 w-4 text-bistro-primary border-gray-300"
                            />
                            <label htmlFor={`solution-${option}`} className="ml-2 text-sm text-gray-700">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.currentSolution && (
                    <p className="text-red-500 text-xs mt-1">{errors.currentSolution}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. How many locations does your restaurant business have? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                    {[
                        'Single location',
                        '2-5 locations',
                        '6-10 locations',
                        '11+ locations'
                    ].map(option => (
                        <div key={option} className="flex items-center">
                            <input
                                type="radio"
                                id={`locations-${option}`}
                                name="locations"
                                value={option}
                                checked={formData.locations === option}
                                onChange={handleRadioChange}
                                className="h-4 w-4 text-bistro-primary border-gray-300"
                            />
                            <label htmlFor={`locations-${option}`} className="ml-2 text-sm text-gray-700">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.locations && (
                    <p className="text-red-500 text-xs mt-1">{errors.locations}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. What's your biggest challenge with online ordering right now?
                </label>
                <textarea
                    name="biggestChallenge"
                    value={formData.biggestChallenge}
                    onChange={handleTextChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Share your current challenges..."
                ></textarea>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-bistro-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Continue to Schedule Consultation
                </button>
            </div>
        </form>
    );
}