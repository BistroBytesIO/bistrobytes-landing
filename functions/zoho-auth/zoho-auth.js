// functions/zoho-auth/zoho-auth.js
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
        // Parse the incoming request body
        const payload = JSON.parse(event.body);
        const { code } = payload;

        if (!code) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Authorization code is required' }),
            };
        }

        // Exchange authorization code for access token
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                code,
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                redirect_uri: process.env.ZOHO_REDIRECT_URI,
                grant_type: 'authorization_code',
            },
        });

        // Return the tokens to the client
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in,
            }),
        };
    } catch (error) {
        console.error('Error exchanging code for token:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to exchange authorization code for token',
                details: error.response ? error.response.data : error.message
            }),
        };
    }
};