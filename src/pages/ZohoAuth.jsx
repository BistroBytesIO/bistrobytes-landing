import { useState, useEffect } from 'react';

export default function ZohoAuth() {
    const [authStep, setAuthStep] = useState('initial');
    const [authCode, setAuthCode] = useState('');
    const [tokens, setTokens] = useState(null);
    const [error, setError] = useState(null);

    // Replace with your actual client credentials from Zoho Developer Console
    const CLIENT_ID = "1000.CPJ9LCWT54CD2NAHZZ744NUKBDDQKK";
    const CLIENT_SECRET = "f88f7f2b306c8fc44c62889f4dfd00c74c45733787";
    const REDIRECT_URI = "http://localhost:5173/zoho-auth"; // Must match your registered redirect URI

    // Check for authorization code in URL (after redirect from Zoho)
    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
            setAuthCode(code);
            setAuthStep('code_received');
        }
    }, []);

    // Function to start the authorization process
    const startAuth = () => {
        // Build the authorization URL
        const scopes = encodeURIComponent(
            'ZohoCalendar.calendar.READ,ZohoCalendar.event.CREATE,ZohoCalendar.event.READ'
        );

        const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code` +
            `&client_id=${CLIENT_ID}&scope=${scopes}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&access_type=offline&prompt=consent`;

        console.log('Auth URL:', authUrl.replace(CLIENT_ID, 'CLIENT_ID_HIDDEN'));

        // Navigate to the authorization URL
        window.location.href = authUrl;
    };

    // Function to exchange the authorization code for tokens
    const exchangeCodeForTokens = async () => {
        try {
            setAuthStep('exchanging');
            setError(null);

            // Build the query string URL with all parameters
            const tokenUrl = new URL('https://accounts.zoho.com/oauth/v2/token');

            // Add all required parameters to the URL
            tokenUrl.searchParams.append('code', authCode);
            tokenUrl.searchParams.append('grant_type', 'authorization_code');
            tokenUrl.searchParams.append('client_id', CLIENT_ID);
            tokenUrl.searchParams.append('client_secret', CLIENT_SECRET);
            tokenUrl.searchParams.append('redirect_uri', REDIRECT_URI);

            // Add the scope parameter that was used in the initial authorization request
            tokenUrl.searchParams.append('scope', 'ZohoCalendar.calendar.READ,ZohoCalendar.event.CREATE,ZohoCalendar.event.READ');

            console.log('Token request URL:', tokenUrl.toString().replace(CLIENT_SECRET, '***SECRET***'));

            // Make the request to exchange the code for tokens
            const response = await fetch(tokenUrl, {
                method: 'POST', // Still using POST method
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                // No body needed since we're sending parameters in the URL
            });

            const data = await response.json();
            console.log('Token response:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            // Store the tokens
            setTokens(data);
            setAuthStep('complete');

            // Get calendar list to verify access
            await fetchCalendarList(data.access_token);

        } catch (err) {
            console.error('Token exchange error:', err);
            setError(err.message || 'Failed to exchange code for tokens');
            setAuthStep('error');
        }
    };

    // Function to fetch calendar list (to verify the token works)
    const fetchCalendarList = async (accessToken) => {
        try {
            const response = await fetch('https://calendar.zoho.com/api/v1/calendars', {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`
                }
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Add calendar info to tokens object
            setTokens(prev => ({
                ...prev,
                calendars: data.calendars
            }));

        } catch (err) {
            console.error('Calendar fetch error:', err);
            setError(prev => prev + '. Failed to fetch calendars: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Zoho Calendar Authorization Helper</h1>

                {/* Step 1: Authorization Button */}
                {authStep === 'initial' && (
                    <div className="mb-6 p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Step 1: Authorize with Zoho</h2>
                        <p className="mb-4 text-gray-600">
                            Click the button below to start the OAuth process. You'll be redirected to Zoho to login and grant permissions.
                        </p>
                        <button
                            onClick={startAuth}
                            className="bg-bistro-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                        >
                            Authorize with Zoho
                        </button>
                    </div>
                )}

                {/* Step 2: Code Received */}
                {authStep === 'code_received' && (
                    <div className="mb-6 p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Step 2: Exchange Code for Tokens</h2>
                        <p className="mb-2 text-gray-600">Authorization code received:</p>
                        <div className="bg-gray-100 p-3 rounded mb-4 overflow-x-auto">
                            <code className="text-sm">{authCode}</code>
                        </div>
                        <button
                            onClick={exchangeCodeForTokens}
                            className="bg-bistro-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                        >
                            Exchange Code for Tokens
                        </button>
                    </div>
                )}

                {/* Processing */}
                {authStep === 'exchanging' && (
                    <div className="mb-6 p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Processing...</h2>
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bistro-primary"></div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {authStep === 'error' && (
                    <div className="mb-6 p-6 border border-red-200 bg-red-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={startAuth}
                            className="bg-bistro-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Success */}
                {authStep === 'complete' && tokens && (
                    <div className="mb-6 p-6 border border-green-200 bg-green-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-green-700">Authorization Complete!</h2>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Access Token:</h3>
                            <div className="bg-white p-3 rounded border mb-4 overflow-x-auto">
                                <code className="text-sm">{tokens.access_token}</code>
                            </div>

                            <h3 className="font-semibold mb-2">Refresh Token (SAVE THIS!):</h3>
                            <div className="bg-white p-3 rounded border mb-2 overflow-x-auto">
                                <code className="text-sm">{tokens.refresh_token}</code>
                            </div>
                            <p className="text-red-600 text-sm mb-4">
                                ⚠️ Save this refresh token securely as an environment variable. You will not see it again.
                            </p>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(tokens.refresh_token);
                                    alert('Refresh token copied to clipboard!');
                                }}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-4"
                            >
                                Copy Refresh Token
                            </button>
                        </div>

                        {tokens.calendars && (
                            <div>
                                <h3 className="font-semibold mb-2">Your Calendars:</h3>
                                <div className="bg-white p-3 rounded border">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left p-2">Name</th>
                                                <th className="text-left p-2">Calendar ID</th>
                                                <th className="text-left p-2">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tokens.calendars.map(calendar => (
                                                <tr key={calendar.id} className="border-t">
                                                    <td className="p-2">{calendar.name}</td>
                                                    <td className="p-2">
                                                        <code>{calendar.id}</code>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(calendar.id);
                                                                alert('Calendar ID copied to clipboard!');
                                                            }}
                                                            className="ml-2 text-xs bg-gray-200 p-1 rounded"
                                                        >
                                                            Copy
                                                        </button>
                                                    </td>
                                                    <td className="p-2">
                                                        {calendar.primary ? (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                                Primary
                                                            </span>
                                                        ) : 'Secondary'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
                            <ol className="list-decimal ml-5 text-blue-800">
                                <li className="mb-2">Save the refresh token in your server environment variables</li>
                                <li className="mb-2">Save the calendar ID you want to use</li>
                                <li className="mb-2">Implement the server-side code to create calendar events</li>
                                <li>Delete this component when done</li>
                            </ol>
                        </div>
                    </div>
                )}

                <div className="text-center text-sm text-gray-500 mt-8">
                    This component is for temporary use only and should be deleted after obtaining your refresh token.
                </div>
            </div>
        </div>
    );
}