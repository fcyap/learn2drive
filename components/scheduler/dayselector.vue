<template>
  <div class="w-full">
    <div class="mt-4">
      <div class="flex justify-center space-x-4">
        <div v-for="(day, index) in days" :key="index" class="text-center">
          <div 
  class="p-6 rounded-lg cursor-pointer" 
  :class="{
    'selected': selectedDay === day,
    'no-slots-selected': day.noSlots,
    'availability-set': groupedAvailability[day.fullDate]
  }"
  @click="selectDay(day)"
>
  <div :class="day.noSlots ? 'text-white' : 'text-gray-500'">{{ day.label }}</div>
  <div class="text-lg font-bold" :class="day.noSlots ? 'text-white' : ''">{{ day.date }}</div>
</div>

        </div>
      </div>

      <div v-if="selectedDay" class="mt-6 grid grid-cols-3 gap-4">
        <button
          v-for="(slot, index) in slots"
          :key="index"
          class="border p-3 rounded-lg focus:outline-none"
          :class="{
            'bg-purple-200': selectedSlots.includes(slot.start),
            'bg-gray-300 text-gray-500 cursor-not-allowed': disabledSlots.includes(slot.start)
          }"
          :disabled="disabledSlots.includes(slot.start)"
          @click="toggleSlot(slot)"
        >
          {{ slot.label }}
        </button>
      </div>

      <div v-if="selectedDay" class="mt-4">
        <!-- Shadcn Dialog Component -->
        <Dialog>
          <DialogTrigger asChild>
            <button 
              class="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Submit Availability
            </button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to book the selected slots for 
                {{ selectedDay.label }} ({{ selectedDay.fullDate }})?
                <div class="mt-2">
                  Selected Slots: 
                  <ul>
                    <li v-for="(slot, index) in selectedSlots" :key="index">{{ slotMap[slot] }}</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <DialogClose asChild>
              <Button type='button' @click="confirmAvailability()">Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div class="mt-8 w-full">
        <h3 class="text-2xl font-bold">Upcoming Availability</h3>
        <div v-if="groupedAvailability && Object.keys(groupedAvailability).length > 0" class="mt-4 space-y-6">
          <div v-for="(slots, date) in groupedAvailability" :key="date">
            <h4 class="text-lg font-bold">{{ date }}</h4>
            <ul class="ml-4 mt-2">
              <li v-for="(slot, index) in slots" :key="index" class="bg-gray-100 p-3 rounded-md mb-2">
                {{ slot }}
              </li>
            </ul>
          </div>
        </div>
        <p v-else class="mt-4 text-gray-500">No upcoming availability set.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Configure Supabase client
const client = useSupabaseClient();
const instructorId = 1; // FOR SESSION

// Define the next 7 days from tomorrow
const generateNext7Days = async () => {
  const daysArray = [];
  for (let i = 1; i <= 7; i++) {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    const { data } = await client
      .from('availability')
      .select('time')
      .eq("instructor_id", instructorId)
      .eq('date', date)
      .eq('available', true);

    daysArray.push({
      label: dayjs(date).format('ddd'), // e.g., "Mon"
      date: dayjs(date).format('DD'),   // e.g., "11"
      fullDate: date,
      noSlots: !data || data.length === 0, // Mark day as red if no slots are available
    });
  }
  return daysArray;
};


const days = ref(generateNext7Days());

// Define 2-hour slots
const slots = ref([
  { label: '8:00 AM - 10:00 AM', start: '08:00:00' },
  { label: '10:00 AM - 12:00 PM', start: '10:00:00' },
  { label: '12:00 PM - 2:00 PM', start: '12:00:00' },
  { label: '2:00 PM - 4:00 PM', start: '14:00:00' },
  { label: '4:00 PM - 6:00 PM', start: '16:00:00' },
  { label: '6:00 PM - 8:00 PM', start: '18:00:00' },
  { label: '8:00 PM - 10:00 PM', start: '20:00:00' },
]);

const slotMap = slots.value.reduce((map, slot) => {
  map[slot.start] = slot.label;
  return map;
}, {});

const selectedDay = ref(null); // Track the selected day
const selectedSlots = ref([]); // Track the start time of selected slots
const disabledSlots = ref([]); // Track slots that are already booked as available
const groupedAvailability = ref({}); // Track upcoming availability by date





// Handle selecting a day
const selectDay = async (day) => {
  if (selectedDay.value === day) {
    selectedDay.value = null;
    disabledSlots.value = []; // Reset disabled slots when deselecting
  } else {
    selectedDay.value = day;
    selectedSlots.value = []; // Clear previous selections
    await fetchDisabledSlots(day.fullDate); // Fetch disabled slots for the selected date
  }
};

// Fetch disabled slots for the selected date
const fetchDisabledSlots = async (date) => {
  try {
    const { data, error } = await client
      .from('availability')
      .select('time')
      .eq("instructor_id", instructorId)
      .eq('date', date)
      .eq('available', true);

    if (error) {
      console.error('Error fetching disabled slots:', error);
      return;
    }

    // Populate disabledSlots with start times that are already marked as available
    disabledSlots.value = data.map(item => item.time);
  } catch (err) {
    console.error('Unexpected error fetching disabled slots:', err);
  }
};

// Handle toggling slot selection
const toggleSlot = (slot) => {
  if (disabledSlots.value.includes(slot.start)) return; // Prevent selecting disabled slots
  const index = selectedSlots.value.indexOf(slot.start);
  if (index !== -1) {
    selectedSlots.value.splice(index, 1); // Deselect slot
  } else {
    selectedSlots.value.push(slot.start); // Select slot
  }
};


// Handle confirming availability submission
const confirmAvailability = async () => {
  if (!selectedDay.value || selectedSlots.value.length === 0) return;

  const availabilityData = selectedSlots.value.map((start) => ({
    instructor_id: instructorId,
    date: selectedDay.value.fullDate,
    time: start,
    available: true,
  }));

  try {
    const { error: insertError } = await client
      .from('availability')
      .insert(availabilityData);

    if (insertError) {
      console.error('Error inserting data:', insertError);
      alert('Duplicate availability selected.');
      return;
    }

    await fetchDisabledSlots(selectedDay.value.fullDate); // Refresh disabled slots after submission
    await fetchUpcomingAvailability(); // Refresh upcoming availability after submission
    selectedSlots.value = []; // Clear the selected slots after submission

    // New line to reset red styling by marking noSlots as false
    selectedDay.value.noSlots = false;

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};


// Fetch upcoming availability with detailed date/time parsing
const fetchUpcomingAvailability = async () => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    const { data, error } = await client
      .from('availability')
      .select('date, time')
      .eq("instructor_id",instructorId)
      .eq("available",true)
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming availability:', error);
      return;
    }

    // Group availability by date and prepare slots with formatted labels
    const grouped = {};
    data.forEach(item => {
      const parsedDate = dayjs(item.date).format('dddd, MMMM D');
      const startTime = dayjs(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm:ss');
      const endTime = startTime.add(2, 'hour');
      
      const startLabel = startTime.format('h:mm A');
      const endLabel = endTime.format('h:mm A');

      if (!grouped[parsedDate]) {
        grouped[parsedDate] = [];
      }

      grouped[parsedDate].push({
        startTime,
        endTime,
        label: `${startLabel} - ${endLabel}`
      });
    });

    // Function to merge consecutive slots for each date
    const mergeConsecutiveSlots = (slots) => {
      const mergedSlots = [];
      let currentSlot = null;

      slots.forEach((slot, index) => {
        if (!currentSlot) {
          currentSlot = slot;
        } else {
          // Check if current slot's end time is equal to the next slot's start time
          if (currentSlot.endTime.isSame(slot.startTime)) {
            // Extend the current slot's end time
            currentSlot.endTime = slot.endTime;
            currentSlot.label = `${currentSlot.label.split(' - ')[0]} - ${slot.label.split(' - ')[1]}`;
          } else {
            // Push the current slot and start a new one
            mergedSlots.push(currentSlot.label);
            currentSlot = slot;
          }
        }

        // If it's the last slot, push it to mergedSlots
        if (index === slots.length - 1) {
          mergedSlots.push(currentSlot.label);
        }
      });

      return mergedSlots;
    };

    // Apply merging for each date
    Object.keys(grouped).forEach(date => {
      grouped[date] = mergeConsecutiveSlots(grouped[date]);
    });

    groupedAvailability.value = grouped;
  } catch (err) {
    console.error('Unexpected error fetching upcoming availability:', err);
  }
};

// Fetch upcoming availability on component mount
onMounted(async () => {
  days.value = await generateNext7Days();
  await fetchUpcomingAvailability(); // Load upcoming availability on mount
});

</script>

<style scoped>
.selected {
  border: 2px solid #7c3aed; /* Highlight color for selected day */
}

button.bg-purple-200 {
  background-color: #d8b4fe; /* Color for selected slots */
}

button.bg-gray-300 {
  background-color: #e2e8f0; /* Greyed out for already submitted slots */
  cursor: not-allowed;
  color: #6b7280;
}

.no-slots-selected {
  background-color: #dc2626; /* Fully red background for days with no slots */
  color: #ffffff;
}

</style>
