<template>
  <div class="space-y-2 px-4 md:px-8 lg:px-16">
    <h2 class="text-xl md:text-2xl font-bold tracking-tight">Home</h2>
    <p class="text-sm md:text-base text-muted-foreground">Manage everything here!</p>

    <!-- Tab Navigation -->
    <div class="md:hidden">
      <Tabs default-value="overview" class="space-y-4">
        <TabsList>
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="calendar"> Calendar </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            <Badge
              v-if="eventCount > 0"
              variant="destructive"
              class="rounded-full px-2 py-1"
            >
              {{ eventCount }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <!-- Overview Tab Content -->
        <TabsContent value="overview" class="space-y-4">
          <Summary />
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            <Card>
              <Overview />
            </Card>
          </div>
        </TabsContent>

        <!-- Calendar Tab Content -->
        <TabsContent value="calendar" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card class="col-span-1 md:col-span-2 lg:col-span-3">
              <Cal />
            </Card>
          </div>
        </TabsContent>

        <!-- Notifications Tab Content -->
        <TabsContent value="notifications" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Notifications @updateEventCount="updateEventCount" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
    
    <!-- Desktop Tabs -->
    <div class="hidden md:flex flex-col space-y-4 pt-6">
      <Tabs default-value="overview" class="space-y-4">
        <TabsList class="flex space-x-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            <Badge v-if="eventCount > 0" variant="destructive" class="rounded-full px-2 py-1 text-xs">
              {{ eventCount }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <!-- Overview Tab Content -->
        <TabsContent value="overview" class="space-y-4">
          <Summary />
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card class="col-span-2">
              <Overview />
            </Card>
          </div>
        </TabsContent>

        <!-- Calendar Tab Content -->
        <TabsContent value="calendar" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card class="col-span-3">
              <Cal />
            </Card>
          </div>
        </TabsContent>

        <!-- Notifications Tab Content -->
        <TabsContent value="notifications" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Notifications @updateEventCount="updateEventCount" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

import Overview from "@/components/dashboard/Overview.vue";
import RecentSales from "@/components/dashboard/RecentSales.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from "@/components/dashboard/Notifications.vue";
import Summary from "@/components/dashboard/Summary.vue";
import { Badge } from "@/components/ui/badge";
import Cal from "@/components/dashboard/Cal.vue";

const eventCount = ref(0);

function updateEventCount(count: number) {
  eventCount.value = count;
}

import { ref, onMounted } from "vue";

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

// State variables
const events = ref<CalendarEvent[]>([]);
const errorMessage = ref("");

interface FetchResponse {
  success: boolean;
  data?: CalendarEvent[];
  message?: string;
}

const getPastEvents = async () => {
  try {
    const response = await $fetch<FetchResponse>("/api/getEventsBefore");
    if (response.success && response.data) {
      events.value = response.data;
      eventCount.value = events.value.length;
    } else {
      errorMessage.value = response.message || "Failed to retrieve events";
      eventCount.value = 0;
    }
  } catch (error) {
    errorMessage.value = "API call failed: " + (error as Error).message;
    eventCount.value = 0;
  }
};

onMounted(async () => {
  await getPastEvents();
});
</script>

<style scoped>
/* Optional custom responsive styling */
@media (max-width: 640px) {
  h2 {
    font-size: 1.25rem;
  }
  .badge {
    font-size: 0.75rem;
  }
}
</style>

