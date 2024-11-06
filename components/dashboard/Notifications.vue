<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Interface definitions
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

interface Student {
  id: number;
  name: string;
  location: string;
  time: string;
  date: string;
  contact: string;
  upcomingLessonTopic: string;
}

interface StudentDrivingProgress {
  id: number;
  sn: number;
  module: string;
  done: boolean;
  modulesn: string;
}

interface StudentTestRouteProgress {
  id: number;
  sn: number;
  testroute: string;
  done: boolean;
}

export default defineComponent({
  emits: ["updateEventCount"],
  setup(_, { emit }) {
    const events = ref<CalendarEvent[]>([]);
    const errorMessage = ref("");
    const students = ref<Student[]>([]);
    const studentProgress = ref<StudentDrivingProgress[]>([]);
    const loading = ref(true);
    const client = useSupabaseClient();
    const checkedModules = ref([]);
    const studentTestRoute = ref<StudentTestRouteProgress[]>([]);
    const checkedTestRoutes = ref<string[]>([]);

    const getEvents = async () => {
      try {
        const response = await $fetch<FetchResponse>("/api/getEventsBefore");
        if (response.success && response.data) events.value = response.data;
        else
          errorMessage.value = response.message || "Failed to retrieve events";
      } catch (error) {
        errorMessage.value = "API call failed: " + (error as Error).message;
      }
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

    const getTestRoutes = async () => {
      try {
        const { data, error } = await client
          .from("student_test_routes")
          .select();
        if (error) throw error;
        if (data) studentTestRoute.value = data;
      } catch (error) {
        errorMessage.value = "Failed to retrieve student test routes.";
      }
    };

    function getTestRoutesByStudent(studentId: number) {
      return studentTestRoute.value.filter(
        (testroutes) => testroutes.id === studentId && testroutes.done === false
      );
    }



    const getProgress = async () => {
      try {
        const { data, error } = await client
          .from("student_driving_progress")
          .select();
        if (error) throw error;
        if (data) studentProgress.value = data;
      } catch (error) {
        errorMessage.value = "Failed to retrieve student progress.";
      }
    };

    function getProgressByStudent(studentId: number) {
      return studentProgress.value.filter(
        (progress) => progress.id === studentId && progress.done === false
      );
    }

    const updateDatabase = async (studentId: number, eventId: string) => {
      console.log("Update database function called");
      console.log("Checked modules:", checkedModules.value); // Logs the selected modules

      try {
        for (const moduleId of checkedModules.value) {
          const progressItem = studentProgress.value.find(
            (progress) => progress.modulesn === moduleId
          );

          if (progressItem) {
            const { error } = await client
              .from("student_driving_progress")
              .update({ done: true }) // Update the `done` status to true
              .eq("modulesn", moduleId)
              .eq("id", studentId); // Use ID to ensure correct item is updated

            if (error) throw error;
          }
        }

        for (const routeId of checkedTestRoutes.value) {
          const { error } = await client
            .from("student_test_routes")
            .update({ done: true })
            .eq("sn", routeId)
            .eq("id", studentId);
          if (error) throw error;
        }
        console.log("Database updated successfully with checked modules");

        checkedModules.value = [];
        checkedTestRoutes.value = [];
        await nextTick();
        await deleteCalendarEvent(eventId);

        // Remove the event from the local `events` array
        events.value = events.value.filter((event) => event.id !== eventId);
        await Promise.all([getProgress(), getTestRoutes()]);
      } catch (error) {
        console.error("Failed to update database:", error);
        errorMessage.value = "Failed to save progress.";
      }
    };

    const deleteCalendarEvent = async (eventId: string) => {
  try {
    const response = await $fetch('/api/deleteEvent', {
      method: 'DELETE',
      body: { eventId },
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete event');
    }
    console.log("Event deleted successfully from Google Calendar");

    events.value = events.value.filter(event => event.id !== eventId);
        
        // Emit the updated count of events
        emit("updateEventCount", events.value.length);
  } catch (error) {
    console.error("Failed to delete event from Google Calendar:", error);
    throw error;
  }
};

    onMounted(async () => {
      loading.value = true;
      await Promise.all([getEvents(), getStudents(), getProgress(), getTestRoutes()]);
      loading.value = false;
    });

    return {
      events,
      errorMessage,
      getStudentName,
      getProgressByStudent,
      getTestRoutesByStudent,
      loading,
      checkedModules,
      checkedTestRoutes,
      updateDatabase,
      deleteCalendarEvent,
    };
  },
});
</script>

<template>
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle>Review</CardTitle>
      <CardDescription>
        Please complete the following reviews for students!
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex items-center space-x-4">
        <Skeleton class="h-9 w-9 rounded-full" />
        <div class="flex flex-col space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>

      <div v-else-if="events.length" class="space-y-3">
        <div
          v-for="event in events"
          :key="event.id"
          class="flex items-center gap-4"
        >
          <Avatar class="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{ getStudentName(Number(event.extendedProperties?.private?.student_id)) }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{
                event.start.date
                  ? event.start.date
                  : event.start.dateTime
                  ? new Date(event.start.dateTime).toLocaleDateString()
                  : "No Date"
              }}
            </p>
          </div>

          <div class="ml-auto font-medium">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="outline">Review</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[425px]">
                <h1 class="text-xl font-bold tracking-tight text-slate-700">Review Student Progress</h1>
                
                <div class="mt-4">
                  <h2 class="text-lg font-semibold text-blue-600">Uncompleted Modules</h2>
                  <p v-if="!getProgressByStudent(Number(event.extendedProperties?.private?.student_id)).length" class="text-sm text-slate-500">No modules to complete.</p>
                  <div v-else>
                    <div
                      v-for="progress in getProgressByStudent(Number(event.extendedProperties?.private?.student_id))"
                      :key="progress.modulesn"
                      class="flex items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        :id="progress.modulesn"
                        :value="progress.modulesn"
                        v-model="checkedModules"
                        class="w-4 h-4 text-blue-500 bg-slate-100 rounded-md cursor-pointer transition-all duration-150"
                      />
                      <label :for="progress.modulesn" class="ml-2 text-slate-700 text-sm">{{ progress.module }}</label>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <h2 class="text-lg font-semibold text-blue-600">Uncompleted Test Routes</h2>
                  <p v-if="!getTestRoutesByStudent(Number(event.extendedProperties?.private?.student_id)).length" class="text-sm text-slate-500">No test routes to complete.</p>
                  <div v-else>
                    <div
                      v-for="route in getTestRoutesByStudent(Number(event.extendedProperties?.private?.student_id))"
                      :key="route.sn"
                      class="flex items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        :id="'route-' + route.sn"
                        :value="route.sn"
                        v-model="checkedTestRoutes"
                        class="w-4 h-4 text-blue-500 bg-slate-100 rounded-md cursor-pointer transition-all duration-150"
                      />
                      <label :for="'route-' + route.sn" class="ml-2 text-slate-700 text-sm">{{ route.testroute }}</label>
                    </div>
                  </div>
                </div>

                <DialogClose>
                  <button
                    type="submit"
                    class="w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:from-slate-700 hover:to-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @click="updateDatabase(Number(event.extendedProperties?.private?.student_id), event.id)"
                  >
                    Submit
                  </button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div v-else>No events to review.</div>
    </CardContent>
  </Card>
</template>
