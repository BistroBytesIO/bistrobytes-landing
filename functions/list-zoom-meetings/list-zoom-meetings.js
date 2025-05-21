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
        console.log('List Zoom meetings request');

        const { accessToken } = payload;

        if (!accessToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Access token is required' }),
            };
        }

        // Get the list of meetings
        const response = await axios({
            method: 'GET',
            url: 'https://api.zoom.us/v2/users/me/meetings',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Zoom meetings listed successfully');
        console.log('Response: ', response);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error listing Zoom meetings:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to list Zoom meetings',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};