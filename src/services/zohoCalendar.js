import axios from 'axios';
import { format, addMinutes } from 'date-fns';

// Constants - replace with your environment variables
const ZOHO_API_BASE = 'https://calendar.zoho.com/api/v1';
const CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_ZOHO_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_ZOHO_REDIRECT_URI;
const OWNER_EMAILS = ['your-email@example.com', 'co-owner-email@example.com'];

// Token management
const getAccessToken = () => localStorage.getItem('zoho_access_token');
const setAccessToken = (token) => localStorage.setItem('zoho_access_token', token);
const getRefreshToken = () => localStorage.getItem('zoho_refresh_token');

// Function to refresh token if expired
async function refreshAccessToken() {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token'
            }
        });

        setAccessToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

// Helper to handle API requests with token refresh
async function apiRequest(method, endpoint, data = null) {
    try {
        const token = getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        const response = await axios({
            method,
            url: `${ZOHO_API_BASE}${endpoint}`,
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
                'Content-Type': 'application/json'
            },
            data
        });

        return response.data;
    } catch (error) {
        // If token expired (401), refresh and retry
        if (error.response && error.response.status === 401) {
            const newToken = await refreshAccessToken();

            // Retry the request with new token
            const retryResponse = await axios({
                method,
                url: `${ZOHO_API_BASE}${endpoint}`,
                headers: {
                    'Authorization': `Zoho-oauthtoken ${newToken}`,
                    'Content-Type': 'application/json'
                },
                data
            });

            return retryResponse.data;
        }
        throw error;
    }
}

// Get calendar list from Zoho
export async function getCalendars() {
    // According to https://www.zoho.com/calendar/help/api/get-calendar-list.html
    return apiRequest('get', '/calendars');
}

// Create a new event in Zoho Calendar
export async function createAppointment({
    subject,
    startDateTime,
    endDateTime,
    timeZone = 'America/Chicago', // Default timezone - change as needed
    description,
    customerName,
    customerEmail,
    restaurantName
}) {
    // Format date strings for Zoho - ISO 8601 format
    const formattedStart = format(new Date(startDateTime), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    const formattedEnd = format(new Date(endDateTime), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

    // Create attendees array with owners and customer
    const attendees = [
        ...OWNER_EMAILS.map(email => ({ email, response: "accepted" })),
        { email: customerEmail, name: customerName, response: "needsAction" }
    ];

    // Get calendar ID to create the event
    const calendarsResponse = await getCalendars();

    if (!calendarsResponse.calendars || calendarsResponse.calendars.length === 0) {
        throw new Error('No calendars found in your Zoho account');
    }

    // Use the primary calendar or the first one in the list
    const calendarId = calendarsResponse.calendars.find(cal => cal.primary)?.id ||
        calendarsResponse.calendars[0].id;

    // Prepare event data according to Zoho API specs
    // See: https://www.zoho.com/calendar/help/api/post-create-event.html
    const eventData = {
        title: `BistroBytes Demo: ${restaurantName}`,
        start: {
            dateTime: formattedStart,
            timeZone
        },
        end: {
            dateTime: formattedEnd,
            timeZone
        },
        location: "Zoom Meeting",
        description: `Demo consultation for BistroBytes online ordering system.\n\nCustomer: ${customerName}\nRestaurant: ${restaurantName}\nEmail: ${customerEmail}\n\nAdditional Notes:\n${description || 'N/A'}`,
        attendees: attendees,
        color: "#F57C00", // Orange color
        reminders: [
            { minutes: 60, method: "email" },
            { minutes: 15, method: "popup" }
        ]
    };

    // Create event in the calendar
    return apiRequest('post', `/calendars/${calendarId}/events`, eventData);
}

// Get free/busy time slots for a date range
export async function getAvailableSlots(startDate, endDate) {
    // For simplicity, we'll just return pre-defined time slots rather
    // than querying the API for free/busy times, which would require
    // more complex processing

    // Standard business hours time slots
    const standardSlots = [
        { start: '09:00', end: '09:30' },
        { start: '10:00', end: '10:30' },
        { start: '11:00', end: '11:30' },
        { start: '13:00', end: '13:30' },
        { start: '14:00', end: '14:30' },
        { start: '15:00', end: '15:30' },
        { start: '16:00', end: '16:30' },
    ];

    // For each day in the range, provide the standard slots
    const availableDays = [];
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
        // Skip weekends (0 = Sunday, 6 = Saturday)
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) {
            availableDays.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                slots: standardSlots
            });
        }

        // Move to next day
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate = nextDate;
    }

    return availableDays;
}

// For more advanced implementations, you could use the freebusy API:
// https://www.zoho.com/calendar/help/api/post-freebusy.html