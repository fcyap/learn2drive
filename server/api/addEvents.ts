import { google } from 'googleapis';
// import { promises as fs } from 'fs';
// import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Read dynamic input from the request body
    const { startDateTime, instructorId, studentId,location } = body;

    // Calculate end time (1 hour after start time)
    const startTime = new Date(startDateTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000 * 2); // Add 2 hour

    // Load the service account credentials
    // const credentialsPath = resolve('server/config/key.json');
    // const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf-8'));

    // const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

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

    // Add an event to the existing calendar
    const eventResponse = await calendar.events.insert({
      calendarId: 'aba2812cffb859323a30180e8484b6767ef51177d72fd3111a8f0f21840df05e@group.calendar.google.com', // Use your existing calendar ID
      requestBody: {
        description: `Instructor ID: ${instructorId}, Student ID: ${studentId}`, // Summary with Instructor and Student IDs
        summary: 'Driving Lessons', // Always set to 'Driving Lessons'
        start: {
          dateTime: startTime.toISOString(), // Start time in ISO format
          timeZone: 'Asia/Singapore',
        },
        end: {
          dateTime: endTime.toISOString(), // End time in ISO format (1 hour after start)
          timeZone: 'Asia/Singapore',
        },
        extendedProperties: {
          private: {
            instructor_id: instructorId,
            student_id: studentId,
            location_detail: location,
          },
        },
      },
    });

    // Return the event ID
    return {
      success: true,
      eventId: eventResponse.data.id,
    };
  } catch (error) {
    console.error('Error adding event:', error);
    return {
      success: false,
      message: 'Error adding event',
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
