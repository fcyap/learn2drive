<template>
  <div>
    <h2>View Events</h2>
    <button @click="getEvents">Get Events</button>

    <!-- Display events if available -->
    <ul v-if="events.length">
      <li v-for="event in events" :key="event.id">
  <strong>{{ event.summary }}</strong><br />
  Date: {{ formatDate(event.start?.dateTime || event.start?.date) }}<br />
  Time: {{ formatTime(event.start?.dateTime) }}<br />
  Description: {{ event.description || 'No description' }}<br />
  Location: {{ event.extendedProperties?.private?.location_detail || "No Location" }}
</li>

    </ul>

    <!-- Error message if events can't be retrieved -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

definePageMeta({
  layout: 'instructorview' // Adjust this as per your app's layout structure
});

// Interface to define the structure of an event
interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  extendedProperties?: {
    private?: {
      location_detail?: string; // Location is stored here
      instructor_id?: string;
      student_id?: string;
    };
  };
}

// Interface for the fetch response
interface FetchResponse {
  success: boolean;
  data?: CalendarEvent[];
  message?: string;
}

export default defineComponent({
  setup() {
    const events = ref<CalendarEvent[]>([]);
    const errorMessage = ref('');

    // Fetch events from the API
    const getEvents = async () => {
      try {
        const response = await $fetch<FetchResponse>('/api/getEventsAfter'); // Adjust the API path if needed
        if (response.success && response.data) {
          events.value = response.data; // Handle the events returned from the API
        } else {
          errorMessage.value = response.message || 'Failed to retrieve events';
        }
      } catch (error) {
        errorMessage.value = 'API call failed: ' + (error instanceof Error ? error.message : String(error));
      }
    };

    // Helper function to format the date
    const formatDate = (dateTime: string | undefined): string => {
      if (!dateTime) return 'N/A';
      const date = new Date(dateTime);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    };

    // Helper function to format the time in AM/PM format
    const formatTime = (dateTime: string | undefined): string => {
      if (!dateTime) return 'All day';
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return 'Invalid time';
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr} ${ampm}`;
    };

    return {
      events, // The events list
      errorMessage, // Error message if any
      getEvents, // Fetch events function
      formatDate, // Date formatting function
      formatTime, // Time formatting function
    };
  },
});
</script>


  