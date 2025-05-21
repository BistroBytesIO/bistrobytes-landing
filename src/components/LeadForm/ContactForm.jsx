// src/components/LeadForm/ContactForm.jsx
import { useState } from 'react';

export default function ContactForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        restaurantName: initialData.restaurantName || '',
        ownerName: initialData.ownerName || '',
        email: initialData.email || '',
        phone: initialData.phone || ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = {};

        if (!formData.restaurantName.trim()) {
            newErrors.restaurantName = 'Restaurant name is required';
        }

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = 'Your name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            // Basic phone validation (digits only, at least 10 digits)
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                newErrors.phone = 'Please enter a valid phone number';
            }
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.restaurantName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.restaurantName && (
                    <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.ownerName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.ownerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="(123) 456-7890"
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-bistro-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Continue to Questionnaire
                </button>
            </div>
        </form>
    );
}