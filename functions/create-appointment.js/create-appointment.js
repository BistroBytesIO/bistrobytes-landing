const axios = require('axios');

// Access environment variables
const ZOHO_CLIENT_ID = process.env.VITE_ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.VITE_ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.VITE_ZOHO_REFRESH_TOKEN;
const ZOHO_CALENDAR_ID = process.env.VITE_ZOHO_CALENDAR_ID;
const OWNER_EMAILS = process.env.VITE_OWNER_EMAILS.split(',');

// Get a fresh access token using the refresh token
async function getAccessToken() {
    try {
        console.log('Getting fresh access token...');
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                refresh_token: ZOHO_REFRESH_TOKEN,
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token'
            }
        });

        console.log('Access token retrieved successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        throw new Error('Failed to refresh access token');
    }
}

// Create an event in your Zoho Calendar
async function createZohoEvent(eventData, accessToken) {
    try {
        console.log('Creating event in Zoho Calendar...');
        console.log('Calendar ID:', ZOHO_CALENDAR_ID);

        const response = await axios({
            method: 'post',
            url: `https://calendar.zoho.com/api/v1/calendars/${ZOHO_CALENDAR_ID}/events`,
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: eventData
        });

        console.log('Event created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error.response?.data || error.message);
        throw new Error('Failed to create calendar event');
    }
}

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
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('Received appointment request');

        // Parse the request body
        const payload = JSON.parse(event.body);
        console.log('Request payload:', payload);

        const {
            startDateTime,
            endDateTime,
            customerName,
            customerEmail,
            restaurantName,
            additionalNotes,
            timeZone = 'America/Chicago'
        } = payload;

        // Validate required fields
        if (!startDateTime || !endDateTime || !customerName || !customerEmail || !restaurantName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Get a fresh access token
        const accessToken = await getAccessToken();

        // Prepare event data for Zoho Calendar
        const eventData = {
            title: `BistroBytes Demo: ${restaurantName}`,
            start: {
                dateTime: new Date(startDateTime).toISOString(),
                timeZone
            },
            end: {
                dateTime: new Date(endDateTime).toISOString(),
                timeZone
            },
            location: "Zoom Meeting (Link will be sent via email)",
            description: `
            Demo consultation for BistroBytes online ordering system.
            
            Customer: ${customerName}
            Restaurant: ${restaurantName}
            Email: ${customerEmail}
            
            Additional Notes:
            ${additionalNotes || 'N/A'}
            `,  
            attendees: [
                ...OWNER_EMAILS.map(email => ({ email, response: "accepted" })),
                { email: customerEmail, name: customerName, response: "needsAction" }
            ],
            color: "#F57C00", // Orange color
            reminders: [
                { minutes: 60, method: "email" },
                { minutes: 15, method: "popup" }
            ]
        };

        console.log('Prepared event data:', JSON.stringify(eventData, null, 2));

        // Create the event in Zoho Calendar
        const result = await createZohoEvent(eventData, accessToken);

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Appointment scheduled successfully',
                eventId: result.id
            })
        };
    } catch (error) {
        console.error('Error processing request:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Internal server error'
            })
        };
    }
};