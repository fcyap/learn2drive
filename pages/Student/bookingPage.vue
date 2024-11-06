<template>
    <div class="container mx-auto p-6 min-h-screen">
        <div class="space-y-2 mb-10">
            <h1 class="text-3xl font-bold tracking-tight text-slate-700">Booking</h1>
            <p class="text-lg text-gray-600">Select the instructor, location, date, and timeslot</p>
        </div>

        <div class="p-8 max-w-2xl mx-auto bg-slate-100 rounded-lg shadow-2xl">
            <div v-if="isLoading" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p class="mt-4 text-gray-600">Loading instructor data...</p>
            </div>
            <div v-else-if="error" class="text-center py-8">
                <p class="text-red-500">{{ error }}</p>
                <button @click="fetchInstructors"
                    class="mt-4 px-6 py-3 bg-slate-500 text-white rounded hover:bg-slate-600">
                    Retry
                </button>
            </div>
            <form v-else @submit.prevent="confirmBooking" class="space-y-6">
                <div class="space-y-2">
                    <label for="location" class="block text-xl font-medium text-slate-700">Select Location</label>
                    <select v-model="selectedLocation" id="location"
                        class="mt-1 block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 rounded-md">
                        <option value="">Choose a location</option>
                        <option v-for="location in locations">{{
                            location['location'] }}</option>
                    </select>
                </div>

                <div v-if="selectedLocation" class="space-y-2">
                    <label for="instructor" class="block text-lg font-medium text-slate-700">Select Instructor</label>
                    <select v-model="selectedInstructor" id="instructor"
                        class="mt-1 block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 rounded-md">
                        <option value="">Choose an instructor</option>
                        <option v-for="instructor in filteredInstructors" :key="instructor['id']" :value="instructor">{{
                            instructor['name'] }}</option>
                    </select>
                </div>

                <div v-if="selectedInstructor" class="space-y-2">
                    <label for="date" class="block text-xl font-medium text-slate-700">Select Date</label>
                    <select v-model="selectedDate" id="date"
                        class="mt-1 block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 rounded-md"
                        @change="fetchAvailableSlots">
                        <option value="">Choose a date</option>
                        <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
                    </select>
                </div>

                <div v-if="selectedDate" class="space-y-2">
                    <label class="block text-xl font-medium text-slate-700">Select Time Slot</label>
                    <div class="grid grid-cols-3 gap-3">
                        <button v-for="slot in availableSlots" :key="slot['time']" type="button"
                            :disabled="!slot['available']"
                            :class="['p-3 text-base font-medium rounded-md', slot['available'] ? 'bg-purple-200 text-purple-700 hover:bg-purple-300' : 'bg-gray-200 text-gray-400 cursor-not-allowed', selectedSlot === slot ? 'ring-2 ring-purple-500' : '']"
                            @click="selectSlot(slot)">
                            {{ slot['time'] }}
                        </button>
                    </div>

                    <!-- Added div to inform users of the 2-hour slot duration -->
                    <div class="mt-2 text-sm text-gray-500">
                        Note: All slots are 2-hour sessions.
                    </div>
                </div>

                <button type="submit"
                    class="w-full px-6 py-3 text-base font-medium text-white bg-slate-500 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    :disabled="!selectedInstructor || !selectedDate || !selectedSlot">
                    Confirm Booking
                </button>
            </form>
        </div>
    </div>
</template>


<script setup lang="ts">
definePageMeta({
    layout: 'studentview'
});
import { ref, computed, onMounted } from 'vue'


// Initialize Supabase client
const client = useSupabaseClient()

import { useAuthStore } from '~/stores/UseAuth'

const authStore = useAuthStore()

// To get the current user ID
const userId = authStore.userId;
console.log(authStore.userId)



// Reactive references for data
const locations = ref([])
const instructors = ref([])
const selectedLocation = ref('')
const selectedInstructor = ref('')
const selectedDate = ref('')
const selectedSlot = ref(null)
const isLoading = ref(false)
const error = ref('')
const availableDates = ref([])
const availableSlots = ref([]);

// Filter instructors based on selected location
const filteredInstructors = computed(() => {
    return selectedLocation.value ? instructors.value.filter(instructor => instructor.location === selectedLocation.value) : instructors.value;
});

// Fetch locations from Supabase
async function fetchLocations() {
    try {
        const { data, error: fetchError } = await client
            .from('instructors')
            .select('location')
        if (fetchError) throw fetchError
        locations.value = [...new Set(data.map(item => item.location))].map(location => ({ location }));
    } catch (err) {
        console.error('Error fetching locations:', err)
    }
}

// Fetch instructors from Supabase
async function fetchInstructors() {
    isLoading.value = true;
    try {
        const { data, error: fetchError } = await client
            .from('instructors')
            .select('*');
        if (fetchError) throw fetchError;
        instructors.value = data ?? [];
    } catch (err) {
        error.value = 'Error fetching instructors';
        console.error('Error fetching instructors:', err);
    } finally {
        isLoading.value = false;
    }
}

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

async function populateAvailableDates() {
    availableDates.value = [];
    for (let i = 1; i < 7; i++) {
        availableDates.value.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
    }
}

async function fetchAvailableSlots() {
    if (!selectedInstructor.value || !selectedDate.value) return;

    isLoading.value = true;
    availableSlots.value = [];

    try {
        const { data, error } = await client
            .from('availability')
            .select('*')
            .eq('instructor_id', selectedInstructor.value.id)
            .eq('date', selectedDate.value);

        if (error) throw error;

        // Sort the available slots by the time field
        availableSlots.value = data ? data.sort((a, b) => {
            // Assuming time is in 'HH:mm' format
            const timeA = a.time.split(':');
            const timeB = b.time.split(':');

            // Compare hours and minutes
            return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        }) : [];
    } catch (err) {
        error.value = `Error fetching available slots: ${err.message}`;
        console.error('Error fetching available slots:', err);
    } finally {
        isLoading.value = false;
    }
}


// Function to handle slot selection
function selectSlot(slot) {
    selectedSlot.value = slot;
}

import Swal from 'sweetalert2';

async function confirmBooking() {
    if (!selectedSlot.value) return;  // Early return if no slot is selected

    try {
        // Prepare booking data
        const bookingData = {
            instructor_id: selectedInstructor.value.id,
            instructor_name: selectedInstructor.value.name,
            date: selectedDate.value,
            time: selectedSlot.value.time,
            location: selectedLocation.value,
            student_id: userId // Replace with dynamic student ID as needed
        };

        const timeZone = 'Asia/Singapore';
        const formattedDate = dayjs.tz(`${selectedDate.value}T${selectedSlot.value.time}`, timeZone).format();

        const eventData = {
            startDateTime: formattedDate,
            instructorId: selectedInstructor.value.id,
            studentId: userId,
            location:selectedLocation.value,
        }

        const eventId = ref(''); 

        const addEvent = async () => {
      try {
        // Send POST request to API endpoint with form inputs
        const response = await $fetch<{ success: boolean; eventId?: string }>('/api/addEvents', {
          method: 'POST',
          body: eventData

        });


        if (response.success) {
                    eventId.value = response.eventId || '';
                    console.log('Event added to Google Calendar with ID:', eventId.value);
                } else {
                    throw new Error('Failed to create event in Google Calendar.');
                }
            } catch (error) {
                console.error('Error adding event to Google Calendar:', error);
                throw error;
            }
        };

        await addEvent();


        // Insert the booking into the database
        const { error: insertError } = await client
            .from('lessons')
            .insert([bookingData]);

        // Handle any errors from the insert operation
        if (insertError) throw insertError;

        // Update the availability of the selected time slot
        const { error: updateError } = await client
            .from('availability')
            .update({ available: false })
            .eq('instructor_id', selectedInstructor.value.id)
            .eq('date', selectedDate.value)
            .eq('time', selectedSlot.value.time);

        // Handle any errors from the update operation
        if (updateError) throw updateError;

        // Refresh available slots
        fetchAvailableSlots();

        // Display a custom notification for successful booking
        Swal.fire({
            title: 'Booking Confirmed!',
            text: `Your booking with ${selectedInstructor.value.name} on ${selectedDate.value} at ${selectedSlot.value.time} has been confirmed.`,
            icon: 'success',
            confirmButtonText: 'Great!',
            confirmButtonColor: '#3085d6',
            background: '#f9f9f9',
            backdrop: `rgba(0,0,0,0.5)`,
            timer: 5000, // Optional: auto-close after 5 seconds
            timerProgressBar: true
        });

    } catch (err) {
        // Log and display the error with a nicer alert
        console.error('Error confirming booking:', err);

        Swal.fire({
            title: 'Error',
            text: `Could not confirm the booking: ${err.message}`,
            icon: 'error',
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#d33',
            background: '#f9f9f9',
            backdrop: `rgba(0,0,0,0.5)`
        });
    }
}


// On mounted lifecycle hook to fetch data
onMounted(() => {
    fetchLocations();
    fetchInstructors();
    populateAvailableDates();
});
</script>

<style scoped>
/* Add any scoped styles here */
</style>
