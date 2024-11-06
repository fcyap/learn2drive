import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { timeMin } = query;

    const instructorId = "1"; // Replace with the actual ID

    const validTimeMin = typeof timeMin === 'string' ? timeMin : new Date().toISOString();

    // Authenticate using environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Correctly format newline characters
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'aba2812cffb859323a30180e8484b6767ef51177d72fd3111a8f0f21840df05e@group.calendar.google.com',
      timeMin: validTimeMin,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (response.data.items || []).filter((event) => {
      return event.extendedProperties?.private?.instructor_id === instructorId;
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
