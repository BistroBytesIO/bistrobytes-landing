import { useState } from 'react';
import { format, addMinutes, addDays } from 'date-fns';

export default function TestZohoCalendar() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testCreateAppointment = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Get current date and time
            const now = new Date();
            console.log('Current local time:', now.toString());
            console.log('Current time zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
            
            // Create a test appointment for tomorrow at the same time as now
            const startDateTime = new Date();
            startDateTime.setDate(startDateTime.getDate() + 1); // Add 1 day (tomorrow)
            
            // Round to nearest half hour
            startDateTime.setMinutes(Math.ceil(startDateTime.getMinutes() / 30) * 30);
            startDateTime.setSeconds(0);
            startDateTime.setMilliseconds(0);
            
            const endDateTime = addMinutes(startDateTime, 30);

            console.log('Appointment local time:', startDateTime.toString());
            console.log('Appointment ISO format:', startDateTime.toISOString());
            console.log('Appointment time (formatted):', format(startDateTime, 'yyyy-MM-dd h:mm a'));

            // The test data
            const testData = {
                startDateTime: startDateTime.toISOString(),
                endDateTime: endDateTime.toISOString(),
                customerName: "Test Customer",
                customerEmail: "admin@bistrobytes.io",
                restaurantName: "Test Restaurant",
                additionalNotes: "This is a test appointment for debugging purposes",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // This is your local time zone
            };

            console.log('Sending test data:', testData);

            // Call your serverless function
            const response = await fetch('/.netlify/functions/create-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            // Parse the response
            const data = await response.json();
            console.log('Response from server:', data);

            if (data.success) {
                setResult({
                    success: true,
                    message: 'Appointment created successfully!',
                    eventId: data.eventId,
                    startTime: format(startDateTime, 'yyyy-MM-dd HH:mm:ss'),
                    endTime: format(endDateTime, 'yyyy-MM-dd HH:mm:ss'),
                    localTime: startDateTime.toString() // Show the complete local time
                });
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error creating test appointment:', err);
            setError(err.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Zoho Calendar Integration Test</h1>

            <p className="mb-4 text-gray-600">
                Click the button below to test creating an appointment in your Zoho Calendar.
                This will create a test appointment tomorrow at approximately the current time.
            </p>

            <button
                onClick={testCreateAppointment}
                disabled={loading}
                className="w-full bg-bistro-primary text-white font-medium py-2 px-4 rounded hover:bg-bistro-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating Appointment...' : 'Test Create Appointment'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="text-red-600 font-medium mb-2">Error</h3>
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {result && result.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-green-600 font-medium mb-2">Success!</h3>
                    <p className="text-green-700">Appointment created successfully</p>
                    <div className="mt-2 text-sm text-gray-700">
                        <p><strong>Event ID:</strong> {result.eventId}</p>
                        <p><strong>Start Time:</strong> {result.startTime}</p>
                        <p><strong>End Time:</strong> {result.endTime}</p>
                        <p><strong>Local Time:</strong> {result.localTime}</p>
                        <p className="mt-2">Check your Zoho Calendar to verify the appointment was created with the correct time.</p>
                    </div>
                </div>
            )}

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-1">Testing Tips:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>The test creates an appointment for tomorrow at your current local time.</li>
                    <li>Your current time zone is used for the appointment.</li>
                    <li>Check the browser console for detailed time information.</li>
                    <li>After testing, you can delete the test appointment from your Zoho Calendar.</li>
                </ul>
            </div>
        </div>
    );
}