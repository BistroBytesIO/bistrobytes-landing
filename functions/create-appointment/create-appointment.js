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

const ZOOM_ACCOUNT_ID = process.env.VITE_ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.VITE_ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.VITE_ZOOM_CLIENT_SECRET;
const ZOOM_USER_ID = process.env.VITE_ZOOM_USER_ID;

async function getZoomAccessToken() {
    try {
        console.log('Getting Zoom access token...');

        // Base64 encode the client ID and secret
        const authHeader = 'Basic ' + Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID
            },
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Zoom access token retrieved successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Zoom token:', error.response?.data || error.message);
        throw new Error('Failed to get Zoom access token');
    }
}

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
async function createZohoEvent(eventData, accessToken, zoomMeeting) {
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

        // Create rich text description with properly formatted Zoom info
        let description = `<div>
            <strong>Demo consultation for BistroBytes online ordering system</strong><br/><br/>
            <strong>Zoom Meeting Link:</strong> <a href="${zoomMeeting.join_url}">${zoomMeeting.join_url}</a><br/>
            <strong>Meeting ID:</strong> ${zoomMeeting.id}<br/>
            <strong>Passcode:</strong> ${zoomMeeting.password}<br/><br/>
            <strong>Customer:</strong> ${eventData.customerName}<br/>
            <strong>Restaurant:</strong> ${eventData.restaurantName}<br/>
            <strong>Email:</strong> ${eventData.customerEmail}<br/><br/>
            <strong>Additional Notes:</strong><br/>
            ${eventData.additionalNotes || 'N/A'}
        </div>`;

        // Set the location to the Zoom meeting URL
        const location = `Zoom Meeting: ${zoomMeeting.join_url}`;
        console.log('Location: ', location);

        // Create the Zoho event object
        const zohoEvent = {
            title: `BistroBytes Demo: ${eventData.restaurantName}`,
            dateandtime: {
                timezone: eventData.timeZone,
                start: zohoStartDate,
                end: zohoEndDate
            },
            attendees: attendees,
            richtext_description: description,
            location: location,
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

// Create a Zoom meeting
async function createZoomMeeting(meetingData, accessToken) {
    try {
        console.log('Creating Zoom meeting...');

        // Format the dates for Zoom (ISO format required)
        const startTime = new Date(meetingData.startDateTime).toISOString();

        // Calculate duration in minutes
        const start = new Date(meetingData.startDateTime);
        const end = new Date(meetingData.endDateTime);
        const durationMinutes = Math.round((end - start) / 60000);

        // Create meeting data according to Zoom API requirements
        const zoomMeetingData = {
            topic: `BistroBytes Demo: ${meetingData.restaurantName}`,
            type: 2, // Scheduled meeting
            start_time: startTime,
            duration: durationMinutes,
            timezone: meetingData.timeZone,
            password: generateRandomPassword(), // Generate a random password
            agenda: `Demo consultation for BistroBytes online ordering system.\n\nCustomer: ${meetingData.customerName}\nRestaurant: ${meetingData.restaurantName}`,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: true,
                mute_upon_entry: false,
                auto_recording: "none",
                waiting_room: false,
                meeting_authentication: false,
                // Add attendees as meeting invitees
                meeting_invitees: [
                    { email: meetingData.customerEmail }
                ].concat(
                    OWNER_EMAILS.filter(email => email.trim()).map(email => ({ email: email.trim() }))
                )
            }
        };

        console.log('Zoom meeting data:', JSON.stringify(zoomMeetingData, null, 2));

        // Create the meeting - note the URL format and userId parameter
        // For user-level apps, 'me' can be used instead of a specific userId
        const userId = ZOOM_USER_ID || 'me'; // Default to 'me' if no specific user ID is provided
        const response = await axios({
            method: 'post',
            url: `https://api.zoom.us/v2/users/${userId}/meetings`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: zoomMeetingData
        });

        console.log('Zoom meeting created successfully');
        console.log('Zoom meeting ID:', response.data.id);
        console.log('Zoom join URL:', response.data.join_url);

        return response.data;
    } catch (error) {
        console.error('Error creating Zoom meeting:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
        } else {
            console.error(error.message);
        }
        throw new Error('Failed to create Zoom meeting: ' + (error.response?.data?.message || error.message));
    }
}

// Helper function to generate a secure random password for Zoom meetings
function generateRandomPassword() {
    // Generate a random 6-10 character password with letters and numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    const length = Math.floor(Math.random() * 5) + 6; // 6-10 characters
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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

        // Step 1: Get Zoom access token using Server-to-Server OAuth
        const zoomAccessToken = await getZoomAccessToken();

        // Step 2: Create Zoom meeting
        const zoomMeeting = await createZoomMeeting({
            startDateTime,
            endDateTime,
            customerName,
            customerEmail,
            restaurantName,
            additionalNotes,
            timeZone
        }, zoomAccessToken);

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
        }, accessToken, zoomMeeting);

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Appointment with Zoom meeting scheduled successfully',
                eventId: result.id,
                zoomMeetingId: zoomMeeting.id,
                zoomJoinUrl: zoomMeeting.join_url
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