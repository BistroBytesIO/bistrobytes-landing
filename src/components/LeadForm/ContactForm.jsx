// src/components/LeadForm/ContactForm.jsx
import { useState } from 'react';

export default function ContactForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        restaurantName: initialData.restaurantName || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || ''
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
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
                    className={`w-full px-3 py-2 border ${errors.restaurantName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bistro-primary focus:border-transparent`}
                    placeholder="Enter your restaurant name"
                />
                {errors.restaurantName && (
                    <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bistro-primary focus:border-transparent`}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bistro-primary focus:border-transparent`}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bistro-primary focus:border-transparent`}
                    placeholder="Enter your email address"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    We'll send your Zoom meeting invitation to this email
                </p>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-bistro-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-bistro-primary focus:ring-offset-2"
                >
                    Continue to Schedule Consultation
                </button>
            </div>
        </form>
    );
}