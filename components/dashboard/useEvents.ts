import { ref } from "vue";
import { useFetch } from "#app";
import { useLocalStorage } from "@vueuse/core";

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
  

interface FetchResponse {
    success: boolean;
    data?: CalendarEvent[];
    message?: string;
  }

const events = ref<CalendarEvent[]>([]);
const eventCount = ref(0);
const instructorId = Number(useLocalStorage("userId", null).value);

export function useEvents() {
  const fetchEvents = async () => {
    try {
      const response = await $fetch<FetchResponse>("/api/getEventsBefore", {
        params: { instructorId },
      });
      if (response.success && response.data) {
        events.value = response.data;
        eventCount.value = events.value.length;
      } else {
        eventCount.value = 0;
      }
    } catch {
      eventCount.value = 0;
    }
  };

  return { events, eventCount, fetchEvents };
}