<template>
  <head>
    <title>Availability</title>
  </head>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">
      Availability
    </h2>
    <p class="text-muted-foreground">
      Indicate your availablity by days and timeslots!
    </p>
  </div>
  <div class="p-4 sm:p-6 mx-auto w-full max-w-screen-lg">
    <DaySelector />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'instructorview'
})

import DaySelector from '@/components/scheduler/dayselector.vue'
</script>
