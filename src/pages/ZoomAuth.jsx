import { useState } from 'react';
import axios from 'axios';

export default function ZoomAuth() {
    const [status, setStatus] = useState('idle');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [meetings, setMeetings] = useState(null);

    const getServerToServerToken = async () => {
        setStatus('loading');
        setError(null);
        
        try {
            // Call our serverless function instead of directly calling Zoom
            const response = await fetch('/.netlify/functions/zoom-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error || 'Unknown error occurred');
            }
            
            console.log('Token response:', data);
            setToken(data);
            setStatus('success');
            
            // Test the token by listing meetings
            await testToken(data.access_token);
            
        } catch (err) {
            console.error('Error getting token:', err);
            setError(err.message || 'Failed to get token');
            setStatus('error');
        }
    };
    
    const testToken = async (accessToken) => {
        try {
            // Use our serverless function to list meetings instead of direct API call
            const response = await fetch('/.netlify/functions/list-zoom-meetings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken }),
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error || 'Unknown error occurred');
            }
            
            console.log('Meetings response:', data);
            setMeetings(data);
        } catch (err) {
            console.error('Error testing token:', err);
            setError(prev => `${prev || ''} Error testing token: ${err.message || 'Failed to list meetings'}`);
        }
    };
    
    const testCreateMeeting = async () => {
        if (!token) {
            setError('Please get a token first');
            return;
        }
        
        try {
            setStatus('creating');
            
            // Create a test meeting using the serverless function
            const meetingData = {
                topic: 'Test BistroBytes Meeting',
                type: 2, // Scheduled meeting
                start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                duration: 30,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                agenda: 'Testing Zoom API Integration',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true
                }
            };
            
            // Call our serverless function to create a meeting
            const response = await fetch('/.netlify/functions/test-zoom-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: token.access_token,
                    meetingData: meetingData
                }),
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error || 'Unknown error occurred');
            }
            
            console.log('Meeting created:', data);
            setMeetings(prev => ({
                ...prev,
                newMeeting: data
            }));
            setStatus('created');
        } catch (err) {
            console.error('Error creating meeting:', err);
            setError(`Error creating meeting: ${err.message || 'Failed to create meeting'}`);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold text-center mb-6">Zoom Server-to-Server Auth Test</h1>
                
                <div className="mb-6 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Get Server-to-Server Token</h2>
                    <p className="mb-4 text-gray-600">
                        This will use Server-to-Server OAuth to get an access token for your Zoom account.
                    </p>
                    <button
                        onClick={getServerToServerToken}
                        disabled={status === 'loading'}
                        className="bg-bistro-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:bg-gray-300"
                    >
                        {status === 'loading' ? 'Getting Token...' : 'Get Zoom Access Token'}
                    </button>
                </div>
                
                {token && (
                    <div className="mb-6 p-6 border-green-200 bg-green-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-green-700">Access Token Received!</h2>
                        
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Access Token:</h3>
                            <div className="bg-white p-3 rounded border mb-2 overflow-x-auto">
                                <code className="text-sm">{token.access_token}</code>
                            </div>
                            <p className="text-gray-600 text-sm">
                                This token expires in {token.expires_in} seconds.
                            </p>
                            
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(token.access_token);
                                    alert('Access token copied to clipboard!');
                                }}
                                className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Copy Access Token
                            </button>
                        </div>
                        
                        <div className="mt-4">
                            <button
                                onClick={testCreateMeeting}
                                disabled={status === 'creating'}
                                className="bg-bistro-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:bg-gray-300"
                            >
                                {status === 'creating' ? 'Creating Meeting...' : 'Test Create Meeting'}
                            </button>
                        </div>
                    </div>
                )}
                
                {meetings && meetings.newMeeting && (
                    <div className="mb-6 p-6 border-blue-200 bg-blue-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">Meeting Created!</h2>
                        
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Meeting Details:</h3>
                            <div className="bg-white p-3 rounded border">
                                <p><strong>Meeting ID:</strong> {meetings.newMeeting.id}</p>
                                <p><strong>Topic:</strong> {meetings.newMeeting.topic}</p>
                                <p><strong>Join URL:</strong> <a href={meetings.newMeeting.join_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{meetings.newMeeting.join_url}</a></p>
                                <p><strong>Password:</strong> {meetings.newMeeting.password}</p>
                                <p><strong>Start URL:</strong> <span className="text-xs text-gray-500">(Only for the host, truncated for security)</span></p>
                                <p className="text-xs overflow-x-auto">{meetings.newMeeting.start_url.substring(0, 50)}...</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 p-6 border border-red-200 bg-red-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
                        <p className="text-red-600 mb-4">
                            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                        </p>
                    </div>
                )}
                
                <div className="text-center text-sm text-gray-500 mt-8">
                    This is a test component for Zoom Server-to-Server OAuth. Use for development only.
                </div>
            </div>
        </div>
    );
}