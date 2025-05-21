const axios = require('axios');

exports.handler = async (event, context) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse the request body
        const payload = JSON.parse(event.body);
        console.log('Test Zoom meeting request:', payload);

        const { accessToken, meetingData } = payload;

        if (!accessToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Access token is required' }),
            };
        }

        // Create the Zoom meeting
        const response = await axios({
            method: 'POST',
            url: 'https://api.zoom.us/v2/users/me/meetings',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: meetingData || {
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
            }
        });

        console.log('Zoom meeting created:', response.data);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to create Zoom meeting',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};