<template>
  <div>
    <h2>Add Driving Lesson Event</h2>
    <form @submit.prevent="addEvent">
      <!-- Input for Start Time -->
      <div>
        <label>Start Time:</label>
        <input v-model="startDateTime" type="datetime-local" required />
      </div>

      <!-- Input for Instructor ID -->
      <div>
        <label>Instructor ID:</label>
        <input v-model="instructorId" type="text" placeholder="Instructor ID" required />
      </div>

      <!-- Input for Student ID -->
      <div>
        <label>Student ID:</label>
        <input v-model="studentId" type="text" placeholder="Student ID" required />
      </div>

      <div>
        <label>Location:</label>
        <input v-model="location" type="text" placeholder="Location" required />
      </div>

      <!-- Submit Button -->
      <button type="submit">Add Event</button>
    </form>

    <!-- Success message, shows the event ID after creation -->
    <p v-if="eventId">Event Created with ID: {{ eventId }}</p>
  </div>
</template>

<script lang="ts">

definePageMeta({
  layout: 'instructorview'
})


import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    // Data input from the form
    const startDateTime = ref(''); // Start Time input from user
    const instructorId = ref('');  // Instructor ID input from user
    const studentId = ref('');     // Student ID input from user
    const location = ref('');     // Student ID input from user

    // Holds the event ID after API response
    const eventId = ref('');       

    // Function to handle adding a new event
    const addEvent = async () => {
      try {
        // Send POST request to API endpoint with form inputs
        const response = await $fetch<{ success: boolean; eventId?: string }>('/api/addEvents', {
          method: 'POST',
          body: {
            // Start time converted to ISO string format
            startDateTime: new Date(startDateTime.value).toISOString(),
            // Instructor and student IDs
            instructorId: instructorId.value,
            studentId: studentId.value,
            location: location.value,
          },
        });

        // If successful, store the returned event ID
        if (response.success) {
          eventId.value = response.eventId || '';
        }
      } catch (error) {
        // Log errors in case API call fails
        console.error('API call failed:', error);
      }
    };

    return {
      startDateTime,  // Binds to start time input field
      instructorId,   // Binds to instructor ID input field
      studentId,      // Binds to student ID input field
      location,
      eventId,        // Displays event ID after event creation
      addEvent,       // Function to handle form submission
    };
  },
});
</script>



