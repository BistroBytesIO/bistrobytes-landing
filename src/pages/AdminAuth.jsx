import { useEffect, useState } from 'react';

export default function AdminAuth() {
    const [authStatus, setAuthStatus] = useState('initializing');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if this is a callback from Zoho OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // We got the authorization code, exchange it for tokens
            handleCodeExchange(code);
        } else {
            // Check if we already have a valid token
            const token = localStorage.getItem('zoho_access_token');
            setAuthStatus(token ? 'authorized' : 'unauthorized');
        }
    }, []);

    const handleCodeExchange = async (code) => {
        try {
            setAuthStatus('authorizing');

            // Exchange the code for tokens
            const response = await fetch('/.netlify/functions/zoho-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Store tokens
            localStorage.setItem('zoho_access_token', data.access_token);
            localStorage.setItem('zoho_refresh_token', data.refresh_token);

            setAuthStatus('authorized');
        } catch (err) {
            console.error('Error during authorization:', err);
            setAuthStatus('error');
            setError(err.message);
        }
    };

    const handleAuthorize = () => {
        // According to https://www.zoho.com/calendar/help/api/oauth2-user-guide.html
        const clientId = import.meta.env.VITE_ZOHO_CLIENT_ID;
        const redirectUri = encodeURIComponent(import.meta.env.VITE_ZOHO_REDIRECT_URI);

        // The correct scopes for calendar access
        const scope = encodeURIComponent('ZohoCalendar.calendars.READ,ZohoCalendar.events.CREATE,ZohoCalendar.events.READ');

        // Build the authorization URL
        const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&access_type=offline&prompt=consent`;

        // Redirect to the Zoho authorization page
        window.location.href = authUrl;
    };

    const handleReset = () => {
        localStorage.removeItem('zoho_access_token');
        localStorage.removeItem('zoho_refresh_token');
        setAuthStatus('unauthorized');
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <button
                        onClick={() => {
                            // Very simple password check - replace with a more secure method in production
                            if (password === 'your-secure-password') {
                                setIsAuthorized(true);
                            } else {
                                alert('Invalid password');
                            }
                        }}
                        className="w-full bg-bistro-primary text-white py-2 rounded"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Zoho Calendar Integration</h1>

                {authStatus === 'initializing' && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bistro-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Checking authorization status...</p>
                    </div>
                )}

                {authStatus === 'authorizing' && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bistro-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Authorizing with Zoho...</p>
                    </div>
                )}

                {authStatus === 'unauthorized' && (
                    <div className="text-center">
                        <p className="mb-6 text-gray-600">
                            You need to authorize BistroBytes to access your Zoho Calendar.
                        </p>
                        <button
                            onClick={handleAuthorize}
                            className="bg-bistro-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Authorize Zoho Calendar
                        </button>
                    </div>
                )}

                {authStatus === 'authorized' && (
                    <div className="text-center">
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                            ✓ Successfully connected to Zoho Calendar!
                        </div>
                        <p className="mb-6 text-gray-600">
                            Your landing page is now set up to create events in your Zoho Calendar.
                        </p>
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                        >
                            Reset Authorization
                        </button>
                    </div>
                )}

                {authStatus === 'error' && (
                    <div className="text-center">
                        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
                            Error: {error || 'Failed to authorize with Zoho'}
                        </div>
                        <button
                            onClick={handleAuthorize}
                            className="bg-bistro-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}