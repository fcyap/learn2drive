import { google } from 'googleapis';
// import { promises as fs } from 'fs';
// import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event); // Read dynamic query parameters from the request
    const { timeMin } = query;

    const instructorId = "1"; // Replace this with the actual hardcoded ID
    // Ensure timeMin is a string or set it to the current date
    const validTimeMax = typeof timeMin === 'string' ? timeMin : new Date().toISOString();

    // // Load the service account credentials
    // const credentialsPath = resolve('server/config/key.json');
    // const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf-8'));


    // Authenticate the service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Correctly format newline characters
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Initialize the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // Fetch events from the calendar
    const response = await calendar.events.list({
      calendarId: 'aba2812cffb859323a30180e8484b6767ef51177d72fd3111a8f0f21840df05e@group.calendar.google.com',
      timeMax: validTimeMax, // Ensure timeMin is valid
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Filter events based on instructor ID in extended properties (if provided)
    const events = (response.data.items || []).filter((event) => {
      return instructorId
        ? event.extendedProperties?.private?.instructor_id === instructorId
        : true;
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error retrieving events',
      error: error instanceof Error ? error.message : String(error),
    };
  }
});