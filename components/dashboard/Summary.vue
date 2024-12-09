<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const client = useSupabaseClient();

interface Earning {
  month: number;
  instructorid: number;
  year: number;
  amount: number;
}

interface Lessons {
  instructor_name: string;
  student_id: number;
  date: Date;
  time: string; 
  location: string;
  instructor_id: number;
}

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
      location_detail?: string;
      instructor_id?: string;
      student_id?: string;
    };
  };
}

import { useLocalStorage } from '@vueuse/core';
const instructorId = Number(useLocalStorage('userId', null).value);
// const instructorId = 1; // Replace with session id or other identifier
const previousMonth  = new Date().getMonth()
const currentMonth = previousMonth + 1;
const currentYear = new Date().getFullYear();

const { data: lessons } = await useAsyncData<Lessons[]>(
  "lessons",
  async () => {
    const { data } = await client.from("lessons").select();
    return data ?? [];
  }
);

// Fetch earnings data
const { data: instructor_earnings } = await useAsyncData<Earning[]>(
  "instructor_earnings",
  async () => {
    const { data } = await client.from("instructor_earnings").select();
    return data ?? [];
  }
);

function getUniqueStudents(instructorId: number) {
  const uniqueStudentIds = new Set(
    lessons.value?.filter(lesson => lesson.instructor_id === instructorId).map(lesson => lesson.student_id)
  );
  return uniqueStudentIds.size;
}

// Function to get earnings for a specific instructor and month/year
function getInstructorEarning(instructorId: number, month?: number, year?: number) {
  return instructor_earnings.value?.filter(
    (earning) =>
      earning.instructorid === instructorId &&
      (!month || earning.month === month) &&
      (!year || earning.year === year)
  ) ?? [];
}

// Total earning up to the current month
const totalEarning = computed(() => {
  return getInstructorEarning(instructorId)
    ?.filter((earning) => earning.month <= currentMonth) // Filter for months before November
    .reduce((sum, earning) => sum + earning.amount, 0) ?? 0;
});

const totalEarningBefore = computed(() => {
  return getInstructorEarning(instructorId)
    ?.filter((earning) => earning.month <= previousMonth) // Filter for months before November
    .reduce((sum, earning) => sum + earning.amount, 0) ?? 0;
});



// Percentage change from the previous month to the current month
const percentageChange = computed(() => {
  return totalEarningBefore.value
    ? ((totalEarning.value - totalEarningBefore.value) / totalEarningBefore.value) * 100
    : 0;
});

const uniqueStudentsCount = computed(() => getUniqueStudents(instructorId));



const events = ref<CalendarEvent[]>([]);
const errorMessage = ref("");
const eventCount = ref(0);
const totalLessonsCount = computed(() => eventCount.value);

interface FetchResponse {
  success: boolean;
  data?: CalendarEvent[];
  message?: string;
}

const getEventsAfter = async () => {
  try {
    const response = await $fetch<FetchResponse>("/api/getEventsAfter", {
      params: { timeMin: new Date().toISOString(), instructorId },
    });
    
    if (response.success && response.data) {
      events.value = response.data;
      eventCount.value = events.value.length; // Update with the count of future events
      // console.log("Number of events retrieved after current time:", eventCount.value);
    } else {
      errorMessage.value = response.message || "Failed to retrieve events";
      eventCount.value = 0;
      console.log("Failed to retrieve events or no events found.");
    }
  } catch (error) {
    errorMessage.value = "API call failed: " + (error as Error).message;
    eventCount.value = 0;
    console.log("Error in getEventsAfter:", error);
  }

  // Return only the count
  return eventCount.value;
};

// Call getPastEvents on component mount
onMounted(() => {
  getEventsAfter();
});

</script>

<template>
  <div class="grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4 text-muted-foreground"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ totalEarning }}</div>
        <p class="text-xs text-muted-foreground">
          +{{ percentageChange.toFixed(1) }}% from last month
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Students (All Time)</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ uniqueStudentsCount }}</div>
        <p class="text-xs text-muted-foreground">
          See
          <NuxtLink to="/Instructor/studentAnalysis">
            Student Analysis
          </NuxtLink>
          for more information on current students
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Current Bookings</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ totalLessonsCount }}</div>
        <p class="text-xs text-muted-foreground">See Calendar for more!</p>
      </CardContent>
    </Card>
  </div>
</template>
