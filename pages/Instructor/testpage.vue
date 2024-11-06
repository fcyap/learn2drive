<template>

<div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">
      Availability
    </h2>
    <p class="text-muted-foreground">
      Select the days and timeslots
    </p>
  </div>
  <div class="p-6 mx-auto w-full max-w-screen-lg"> 
    <DaySelector />
  </div>
    <div>
      <TaskTable />
    </div>
  </template>
  
  <script setup lang="ts">
  import TaskTable from '@/components/scheduler/calendarlook.vue';

  definePageMeta({
  layout: 'instructorview'
})

import DaySelector from '@/components/scheduler/dayselector.vue'

  </script>
  