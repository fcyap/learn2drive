<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ref, onMounted } from "vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "#app";
import { useLocalStorage } from "@vueuse/core";
const instructorId = useLocalStorage("userId", null).value;

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
const eventCount = ref(0);

// Function to fetch events from today onwards
const fetchEventsFromToday = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const { data, error } = await useFetch<{
      success: boolean;
      data?: CalendarEvent[];
    }>("/api/getEventsAfter", {
      params: { timeMin: new Date().toISOString(), instructorId },
    });

    if (error.value)
      throw new Error(error.value.message || "Failed to fetch events");

    if (data.value?.success && data.value.data) {
      eventsFromToday.value = data.value.data;
      eventCount.value = eventsFromToday.value.length;
      // console.log("Number of events retrieved in calendar:", eventCount.value);
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

// Group Events by Date
const groupEventsByDate = () => {
  groupedEvents.value = eventsFromToday.value.reduce((acc, event) => {
    const eventDate =
      event.start?.dateTime?.split("T")[0] || event.start?.date || "Unknown";
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
};

// Handle Event Deletion
const handleEventDeleted = async () => {
  await fetchEventsFromToday();
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
  const student = students.value.find((student) => student.id === studentId);
  return student ? student.name : "Unknown Student";
}

function getStudentNumber(studentId: number): string {
  const student = students.value.find((student) => student.id === studentId);
  return student ? student.contact : "NA";
}

onMounted(() => {
  // console.log(instructorId);
  fetchEventsFromToday();
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

function getProfilePhotoUrl(studentId: string) {
  const supabaseUrl = "https://tzklhzyswqmorhokvgmw.supabase.co";
  const bucketPath = "new_profile_photos";
  return `${supabaseUrl}/storage/v1/object/public/${bucketPath}/${studentId}.jpg`;
}
</script>
<template>
  <CardHeader>
    <CardTitle>Upcoming Lessons</CardTitle>
  </CardHeader>
  <CardContent class="pl-2">
    <ScrollArea class="w-full whitespace-nowrap">
      <!-- Loading State -->
      <div v-if="isLoading">
        <div class="flex flex-col space-y-3">
          <Skeleton
            class="h-[378px] w-full sm:w-full md:w-1/2 lg:w-1/3 rounded-xl"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="!isLoading && errorMessage">
        <p class="text-red-500">{{ errorMessage }}</p>
      </div>

      <!-- Display Events with Responsive Grid -->
      <div
        v-if="!isLoading && Object.keys(groupedEvents).length"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div v-for="(events, date) in groupedEvents" :key="date" class="mb-4">
          <Card>
            <CardHeader>
              <CardTitle :class="isToday(date) ? 'text-red-500' : ''">
                {{ isToday(date) ? "Today" : formatDate(date) }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea class="h-72 w-full">
                <div v-for="event in events" :key="event.id" class="mb-4">
                  <div class="flex items-center">
                    <Avatar class="h-9 w-9">
                      <AvatarImage :src="getProfilePhotoUrl(event.extendedProperties?.private?.student_id)" alt="Avatar" />
                      <AvatarFallback>
                        {{
                          event.extendedProperties?.private?.student_id
                            ?.slice(0, 2)
                            .toUpperCase() || "N/A"
                        }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="ml-4 space-y-1">
                      <p
                        class="text-sm font-medium leading-none whitespace-normal"
                      >
                        {{
                          getStudentName(
                            Number(
                              event.extendedProperties?.private?.student_id
                            )
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium leading-none">
                      {{ formatTime(event.start?.dateTime) }}
                    </p>
                    <p class="text-sm text-muted-foreground pt-2">
                      {{
                        getStudentNumber(
                          Number(event.extendedProperties?.private?.student_id)
                        )
                      }}
                    </p>
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
