<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button' // Ensure this is imported from ShadCN or other UI component library
import { format, startOfWeek, addDays, addWeeks } from 'date-fns'

interface Activity {
  name: string
  startHour: number // Column start (0-based for easier calculation)
  duration: number // Duration in hours
  color: string // Tailwind color class
}

interface DayTasks {
  date: Date
  activities: Activity[]
}

// Helper to format date as a key
function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// Specific events tagged to specific dates
const specificEvents = {
  [formatDateKey(new Date())]: [
    { name: 'Team Meeting', startHour: 1, duration: 2, color: 'bg-blue-500' },
    { name: 'Project Review', startHour: 4, duration: 1, color: 'bg-purple-500' },
  ],
  [formatDateKey(addDays(new Date(), 1))]: [
    { name: 'Client Call', startHour: 3, duration: 2, color: 'bg-green-500' },
  ],
  [formatDateKey(addDays(new Date(), 3))]: [
    { name: 'Workshop', startHour: 2, duration: 3, color: 'bg-red-500' },
  ],
  [formatDateKey(addDays(new Date(), 5))]: [
    { name: 'Product Demo', startHour: 6, duration: 2, color: 'bg-yellow-500' },
  ],
}

const hours = ref(['08', '09', '10', '11', '12', '13', '14', '15', '16'])

// Current week dates
const currentDate = ref(new Date())
const currentWeek = ref(getCurrentWeek(currentDate.value))

// Cache of tasks by week start date (formatted as a key)
const taskCache = new Map<string, Record<string, DayTasks>>()

// Initialize tasks for the current week
const tasksByDate = ref(getTasksForWeek(currentWeek.value))

// Utility to get the dates for the current week
function getCurrentWeek(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

// Get tasks for a specific week, either from the cache or by using predefined specific events
function getTasksForWeek(weekDates: Date[]): Record<string, DayTasks> {
  const weekStartKey = formatDateKey(weekDates[0])
  if (taskCache.has(weekStartKey)) {
    return taskCache.get(weekStartKey)!
  }

  // Populate tasks for the week from specificEvents
  const newTasks: Record<string, DayTasks> = {}
  weekDates.forEach((date) => {
    const dateKey = formatDateKey(date)
    newTasks[dateKey] = {
      date,
      activities: specificEvents[dateKey] || [],
    }
  })

  // Store the generated tasks in the cache
  taskCache.set(weekStartKey, newTasks)
  return newTasks
}

// Format date for display
function formatDate(date: Date) {
  return format(date, 'EEE, MMM d')
}

// Update the week when navigating
function updateWeek(weeksToAdd: number) {
  currentDate.value = addWeeks(currentDate.value, weeksToAdd)
  currentWeek.value = getCurrentWeek(currentDate.value)

  // Retrieve tasks from cache or generate new for the week
  tasksByDate.value = getTasksForWeek(currentWeek.value)
}

// Navigation functions
function nextWeek() {
  updateWeek(1)
}

function prevWeek() {
  updateWeek(-1)
}

// Display week label
const weekLabel = computed(() => {
  const start = format(currentWeek.value[0], 'MMM d')
  const end = format(currentWeek.value[6], 'MMM d')
  return `${start} - ${end}`
})
</script>


<template>
    <div class="flex flex-col">
      <!-- Week Navigation -->
      <div class="flex items-center justify-between p-4">
        <Button @click="prevWeek">Previous Week</Button>
        <span class="font-bold">{{ weekLabel }}</span>
        <Button @click="nextWeek">Next Week</Button>
      </div>
  
      <!-- Calendar View -->
      <div class="flex">
        <!-- Dates Column -->
        <div class="w-1/4 p-4 border-r border-gray-200">
          <div
            v-for="date in currentWeek"
            :key="date"
            class="py-2 text-center font-medium border-b border-gray-200 h-16 flex items-center justify-center"
          >
            {{ formatDate(date) }}
          </div>
        </div>
  
        <!-- Calendar Section -->
        <div class="w-3/4 p-4 overflow-x-auto">
          <!-- Time header with dividers -->
          <div class="grid grid-cols-9 gap-0 border-b">
            <div
              v-for="hour in hours"
              :key="hour"
              class="text-center font-bold border-r py-2"
            >
              {{ hour }}:00
            </div>
          </div>
  
          <!-- Task Rows for each day -->
          <div
            v-for="date in currentWeek"
            :key="date"
            class="grid grid-cols-9 gap-0 border-b py-2 h-16"
          >
            <!-- Placeholder for each time slot -->
            <div v-for="n in 9" :key="n" class="border-r h-full"></div>
  
            <!-- Display activities for each day -->
            <template v-for="activity in tasksByDate[formatDateKey(date)]?.activities || []" :key="activity.name">
              <div
                :class="['flex items-center justify-center text-white rounded px-2 py-1 h-full', activity.color]"
                :style="{
                  gridColumnStart: activity.startHour + 1,
                  gridColumnEnd: `span ${activity.duration}`,
                }"
              >
                <span>{{ activity.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped>
  /* Apply consistent row height for alignment */
  .h-16 {
    height: 4rem;
  }
  
  /* Border styling for each column in the grid */
  .grid > .border-r {
    border-color: #e2e8f0;
  }
  </style>
  
  
  
  
  