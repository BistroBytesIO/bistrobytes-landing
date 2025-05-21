// functions/zoom-auth/zoom-auth.js
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
        // Get env variables
        const ZOOM_ACCOUNT_ID = process.env.VITE_ZOOM_ACCOUNT_ID;
        const ZOOM_CLIENT_ID = process.env.VITE_ZOOM_CLIENT_ID;
        const ZOOM_CLIENT_SECRET = process.env.VITE_ZOOM_CLIENT_SECRET;

        if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing Zoom credentials in environment variables' }),
            };
        }

        // Base64 encode the client ID and secret
        const authHeader = 'Basic ' + Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
        
        // Make the request to get an access token
        const response = await axios({
            method: 'POST',
            url: 'https://zoom.us/oauth/token',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error getting Zoom token:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to get Zoom token',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};