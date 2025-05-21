// Simple API service for form submission
const API_URL = 'https://your-backend-api.com';

export const submitLeadForm = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
};