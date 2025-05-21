// functions/create-appointment/create-appointment.js
// functions/create-appointment/create-appointment.js
const axios = require('axios');
const { format } = require('date-fns');

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

        // Log detailed date information for debugging
        const startDate = new Date(eventData.startDateTime);
        const endDate = new Date(eventData.endDateTime);

        console.log('Start date (ISO):', eventData.startDateTime);
        console.log('Start date (local):', startDate.toString());
        console.log('Client time zone:', eventData.timeZone);

        // Format the dates in Zoho's expected format
        // Note: UTC format required for Zoho
        const formatZohoDate = (date) => {
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');

            return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
        };

        const zohoStartDate = formatZohoDate(startDate);
        const zohoEndDate = formatZohoDate(endDate);

        console.log('Zoho start date format:', zohoStartDate);
        console.log('Zoho end date format:', zohoEndDate);

        // Prepare attendees
        const attendees = [
            {
                email: eventData.customerEmail,
                status: "NEEDS-ACTION"
            }
        ];

        // Add owner emails
        if (OWNER_EMAILS && OWNER_EMAILS.length > 0 && OWNER_EMAILS[0].trim() !== '') {
            OWNER_EMAILS.forEach(email => {
                if (email && email.trim()) {
                    attendees.push({
                        email: email.trim(),
                        status: "ACCEPTED"
                    });
                }
            });
        }

        // Create the Zoho event object
        const zohoEvent = {
            title: `BistroBytes Demo: ${eventData.restaurantName}`,
            dateandtime: {
                timezone: eventData.timeZone,
                start: zohoStartDate,
                end: zohoEndDate
            },
            attendees: attendees,
            richtext_description: `<div>Demo consultation for BistroBytes online ordering system.<br/><br/>
        Customer: ${eventData.customerName}<br/>
        Restaurant: ${eventData.restaurantName}<br/>
        Email: ${eventData.customerEmail}<br/><br/>
        Additional Notes:<br/>
        ${eventData.additionalNotes || 'N/A'}</div>`,
            reminders: [
                { 
                    action: "email", 
                    minutes: -30 
                },
                {
                    action: "popup",
                    minutes: -15
                }
            ]
        };

        console.log('Zoho-formatted event data:', JSON.stringify(zohoEvent, null, 2));

        // Create the URL with the encoded event data
        const eventdataParam = encodeURIComponent(JSON.stringify(zohoEvent));
        const url = `https://calendar.zoho.com/api/v1/calendars/${ZOHO_CALENDAR_ID}/events?eventdata=${eventdataParam}`;

        // Make the API call
        const response = await axios({
            method: 'post',
            url,
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        console.log('Event created successfully');
        return response.data;
    } catch (error) {
        console.error('Error creating event:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', JSON.stringify(error.response.headers));
            console.error('Data:', JSON.stringify(error.response.data));
        } else {
            console.error(error.message);
        }
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

        // Create the event in Zoho Calendar
        const result = await createZohoEvent({
            startDateTime,
            endDateTime,
            customerName,
            customerEmail,
            restaurantName,
            additionalNotes,
            timeZone
        }, accessToken);

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