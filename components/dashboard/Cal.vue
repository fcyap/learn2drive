<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ref, onMounted } from "vue";
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from "#app";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  extendedProperties?: {
    private?: {
      instructor_id?: string;
      student_id?: string;
    };
  };
}

interface Student {
  id: number;
  name: string;
  location: string;
  time: string;
  date: string;
  contact: string;
  upcomingLessonTopic: string;
}

// State variables
const eventsFromToday = ref<CalendarEvent[]>([]); // Events from today onward
const groupedEvents = ref<Record<string, CalendarEvent[]>>({}); // Grouped events by date
const isLoading = ref(false); // Loading state
const errorMessage = ref(""); // Error message for debugging
const client = useSupabaseClient();
const students = ref<Student[]>([]);

// Function to fetch events from today onwards
const fetchEventsFromToday = async (instructorId: string) => {
  isLoading.value = true;
  errorMessage.value = ""; // Clear previous error message
  try {
    // Fetch the data from the API with timeMin set to the current date/time (today onward)
    const { data, error } = await useFetch<{
      success: boolean;
      data?: CalendarEvent[];
    }>("/api/getEventsAfter", {
      params: { timeMin: new Date().toISOString(), instructorId }, // timeMin is now from today onwards
    });

    // Log the response data for debugging purposes
    console.log("API Response:", data.value);

    if (error.value) {
      throw new Error(error.value.message || "Failed to fetch events");
    }

    // Check if the API returned success and events
    if (data.value?.success && data.value.data) {
      eventsFromToday.value = data.value.data;
      groupEventsByDate();
    } else {
      eventsFromToday.value = [];
      groupedEvents.value = {};
      errorMessage.value = "No events found or API request failed.";
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    errorMessage.value = err instanceof Error ? err.message : String(err);
    eventsFromToday.value = [];
    groupedEvents.value = {};
  } finally {
    isLoading.value = false;
  }
};

// Function to group events by date
const groupEventsByDate = () => {
  groupedEvents.value = eventsFromToday.value.reduce((acc, event) => {
    const eventDate =
      event.start?.dateTime?.split("T")[0] || event.start?.date || "Unknown";
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
};


const handleEventDeleted = async () => {
  // Refetch events after deletion
  await fetchEventsFromToday("101"); // Replace "1" with the actual instructorId as needed
};

const getStudents = async () => {
      try {
        const { data, error } = await client.from("studentview").select();
        if (error) throw error;
        if (data) students.value = data;
      } catch (error) {
        errorMessage.value = "Failed to retrieve student data.";
      }
    };

    function getStudentName(studentId: number): string {
      const student = students.value.find(
        (student) => student.id === studentId
      );
      return student ? student.name : "Unknown Student";
    }

    function getStudentNumber(studentId: number): string {
      const student = students.value.find(
        (student) => student.id === studentId
      );
      return student ? student.contact : "NA";
    }

onMounted(() => {
  const instructorId = "1"; // hardcoded - replace with session ID
  fetchEventsFromToday(instructorId);
  getStudents();
});

// Helper function to format time
const formatTime = (dateTime: string | undefined): string => {
  if (!dateTime) return "All day";
  const date = new Date(dateTime);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

// Helper function to check if the date is today
const isToday = (date: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
};

// Helper function to format the date
const formatDate = (dateTime: string | undefined): string => {
  if (!dateTime) return "N/A";
  const date = new Date(dateTime);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
</script>

<template>
  <CardHeader>
    <CardTitle>Upcoming Lessons</CardTitle>
  </CardHeader>
  <CardContent class="pl-2">
    <ScrollArea class="w-100% whitespace-nowrap">
      <!-- Loading State -->
      <div v-if="isLoading">
        <div class="flex flex-col space-y-3">
          <Skeleton class="h-[378px] w-1/4 rounded-xl" />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="!isLoading && errorMessage">
        <p class="text-red-500">{{ errorMessage }}</p>
      </div>

      <!-- Display Events -->
      <div v-if="!isLoading && Object.keys(groupedEvents).length">
        <div
          v-for="(events, date) in groupedEvents"
          :key="date"
          class="inline-block w-1/4 mr-4"
        >
          <Card class="mb-4">
            <CardHeader>
              <CardTitle :class="isToday(date) ? 'text-red-500' : ''">
                {{ isToday(date) ? "Today" : formatDate(date) }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea class="h-72 w-100%">
                <div v-for="event in events" :key="event.id" class="mb-4">
                  <div class="flex items-center">
                    <Avatar class="h-9 w-9">
                      <AvatarImage src="" alt="Avatar" />
                      <AvatarFallback>{{
                        event.extendedProperties?.private?.student_id
                          ?.slice(0, 2)
                          .toUpperCase() || "N/A"
                      }}</AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                      <p class="text-sm font-medium leading-none">
                        {{
                          getStudentName(Number(event.extendedProperties?.private?.student_id))
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium leading-none">
                      {{ formatTime(event.start?.dateTime) }}
                    </p>
                    <p class="text-sm text-muted-foreground pt-2">{{getStudentNumber(Number(event.extendedProperties?.private?.student_id))}}</p>
                  </div>
                  <Separator class="my-2" />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- No Events Fallback -->
      <div
        v-if="!isLoading && !Object.keys(groupedEvents).length && !errorMessage"
      >
        <p>No upcoming lessons</p>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </CardContent>
</template>
