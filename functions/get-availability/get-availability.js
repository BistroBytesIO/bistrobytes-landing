// functions/get-availability/get-availability.js
const axios = require('axios');

const ZOHO_CLIENT_ID = process.env.VITE_ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.VITE_ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.VITE_ZOHO_REFRESH_TOKEN;
const ZOHO_CALENDAR_ID = process.env.VITE_ZOHO_CALENDAR_ID;

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

        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        throw new Error('Failed to refresh access token');
    }
}

// Get events for a specific date range using correct Zoho API parameters
async function getEvents(accessToken, startDate, endDate) {
    try {
        console.log(`Fetching events for ${startDate} to ${endDate}`);
        
        // Format dates according to Zoho documentation: yyyyMMdd format
        const formatZohoDate = (dateString) => {
            return dateString.replace(/-/g, ''); // Convert YYYY-MM-DD to YYYYMMDD
        };
        
        const formattedStartDate = formatZohoDate(startDate);
        const formattedEndDate = formatZohoDate(endDate);
        
        console.log(`Formatted dates: ${formattedStartDate} to ${formattedEndDate}`);
        
        const url = `https://calendar.zoho.com/api/v1/calendars/${ZOHO_CALENDAR_ID}/events`;
        
        // Use correct parameter format from Zoho documentation
        // The range parameter should be a JSON object with start and end properties
        const rangeObject = {
            start: formattedStartDate,
            end: formattedEndDate
        };
        
        const params = {
            range: JSON.stringify(rangeObject)
        };
        
        console.log('Request params:', params);
        console.log('Request URL:', url);
        
        const response = await axios({
            method: 'get',
            url,
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params
        });

        console.log('Events API response:', response.data);
        
        // Handle the response structure according to Zoho documentation
        if (response.data && response.data.events) {
            return response.data.events;
        } else if (response.data && Array.isArray(response.data)) {
            // Sometimes the response is directly an array
            return response.data;
        } else {
            console.log('No events found or unexpected response structure');
            return [];
        }
        
    } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
        
        // Log more details for debugging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
        }
        
        throw new Error('Failed to fetch calendar events');
    }
}

// Parse time slots and check availability
function getAvailableTimeSlots(events, date) {
    console.log(`Processing ${events.length} events for date ${date}`);
    
    const availableSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    // Generate 30-minute time slots
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const slotStart = new Date(`${date}T${timeString}:00`);
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000); // 30 minutes later
            
            // Check if this slot conflicts with any existing events
            const isConflict = events.some(event => {
                let eventStart, eventEnd;
                
                try {
                    // Skip all-day events as they don't conflict with time slots
                    if (event.isallday === true) {
                        console.log(`Skipping all-day event: ${event.title}`);
                        return false;
                    }
                    
                    // First try to use dateandtime object (preferred as it includes timezone)
                    if (event.dateandtime && event.dateandtime.start && event.dateandtime.end) {
                        // Format: "20170718T205000+0530"
                        eventStart = parseZohoDateTime(event.dateandtime.start);
                        eventEnd = parseZohoDateTime(event.dateandtime.end);
                        console.log(`Using dateandtime: ${event.title} from ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);
                    }
                    // Fallback to start/end properties (format: "20170718T205000")
                    else if (event.start && event.end) {
                        eventStart = parseZohoDateTime(event.start);
                        eventEnd = parseZohoDateTime(event.end);
                        console.log(`Using start/end: ${event.title} from ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);
                    }
                    else {
                        console.log(`Cannot parse event dates for: ${event.title}`, event);
                        return false; // Skip if we can't parse the event
                    }
                    
                    // Convert slot times to same timezone as events for fair comparison
                    // For simplicity, we'll compare in local time since we're dealing with same-day appointments
                    const eventDate = eventStart.toDateString();
                    const slotDate = slotStart.toDateString();
                    
                    // Only check events on the same date
                    if (eventDate !== slotDate) {
                        return false;
                    }
                    
                    // Check for overlap: slot conflicts if it starts before event ends and ends after event starts
                    const hasConflict = (slotStart < eventEnd && slotEnd > eventStart);
                    
                    if (hasConflict) {
                        console.log(`Conflict found: slot ${timeString} conflicts with event "${event.title}" from ${eventStart.toLocaleTimeString()} to ${eventEnd.toLocaleTimeString()}`);
                    }
                    
                    return hasConflict;
                } catch (error) {
                    console.error(`Error parsing event "${event.title}":`, error);
                    return false; // Don't block slot if we can't parse the event
                }
            });
            
            availableSlots.push({
                time: timeString,
                isAvailable: !isConflict
            });
        }
    }
    
    console.log(`Generated ${availableSlots.length} time slots, ${availableSlots.filter(s => s.isAvailable).length} available`);
    return availableSlots;
}

// Helper function to parse Zoho date/time formats
function parseZohoDateTime(dateTimeString) {
    // Handle formats like:
    // "20170718T205000" (without timezone)
    // "20170718T205000+0530" (with timezone)
    
    if (!dateTimeString) {
        throw new Error('Date time string is required');
    }
    
    // Remove timezone part for parsing if present
    const cleanDateTime = dateTimeString.replace(/[+-]\d{4}$/, '');
    
    // Parse format: YYYYMMDDTHHMMSS
    const year = parseInt(cleanDateTime.substr(0, 4));
    const month = parseInt(cleanDateTime.substr(4, 2)) - 1; // Month is 0-indexed in JS
    const day = parseInt(cleanDateTime.substr(6, 2));
    const hour = parseInt(cleanDateTime.substr(9, 2));
    const minute = parseInt(cleanDateTime.substr(11, 2));
    const second = parseInt(cleanDateTime.substr(13, 2)) || 0;
    
    // Create date object (this will be in local timezone)
    const dateObj = new Date(year, month, day, hour, minute, second);
    
    // If original string had timezone info, we could adjust here
    // For now, we'll assume local timezone for simplicity
    
    return dateObj;
}

exports.handler = async (event, context) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { date } = event.queryStringParameters || {};
        
        if (!date) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Date parameter is required (YYYY-MM-DD format)' })
            };
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD' })
            };
        }

        console.log(`Processing availability request for date: ${date}`);

        // Get access token
        const accessToken = await getAccessToken();
        
        // Get events for the requested date (using same date for start and end to get single day)
        const events = await getEvents(accessToken, date, date);
        
        // Calculate available time slots
        const availableSlots = getAvailableTimeSlots(events, date);
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                date: date,
                slots: availableSlots,
                eventsFound: events.length
            })
        };
        
    } catch (error) {
        console.error('Error getting availability:', error);
        
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