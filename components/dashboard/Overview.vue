<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar";


const client = useSupabaseClient();

interface Earning {
  month: number;
  instructorId: number;
  year: number;
  amount: number;
}

const { data: instructor_earnings } = await useAsyncData<Earning[]>(
  "instructor_earnings",
  async () => {
    const { data } = await client.from("instructor_earnings").select();
    return data ?? [];
  }
);

const instructorId = 1; // replace with session id

function getInstructorEarning(instructorId: number){
  return (
    instructor_earnings.value?.filter(
      (earning) => earning.instructorId === instructorId
    )
  );
}

const formattedEarnings = computed(() => {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return (
    instructor_earnings.value
      ?.filter((earning) => earning.instructorId === instructorId)
      .sort((a, b) => a.month - b.month) // Sort by month number
      .map((earning) => ({
        name: monthNames[earning.month - 1], // Convert month number to name
        total: earning.amount, 
      })) ?? []
  );
});


</script>

<template>
    <CardHeader>
      <CardTitle class="">Overview</CardTitle>
    </CardHeader>
    <CardContent class="pl-2">
      <BarChart
        :data="formattedEarnings"
        :categories="['total']"
        :index="'name'"
        :rounded-corners="4"
      />
    </CardContent>
</template>
