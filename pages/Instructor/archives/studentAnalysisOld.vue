<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

const client = useSupabaseClient();

interface Student {
  id: number;
  name: string;
  location: string;
  time: string;
  date: string;
  contact: string;
  upcomingLessonTopic: string;
}

const { data: studentview } = await useAsyncData<Student[]>('studentview', async () => {
  const { data } = await client.from('studentview').select();
  return data ?? [];
});
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Current Students</h2>
    <p class="text-muted-foreground">See your students!</p>
  </div>

  <ScrollArea class="w-full max-w-6xl overflow-x-auto">
    <div class="flex p-4 gap-6">
      <div
        v-for="student in studentview"
        :key="student.id"
        class="student-card"
      >
        <figure class="shrink-0">
          <div class="overflow-hidden rounded-md">
            <Card class="h-full overflow-hidden">
              <CardContent>
                <img class="rounded-md"
                  src="https://via.placeholder.com/250x150"
                  alt="Student Photo"
                />
                <h2 class="text-xl font-semibold">{{ student.name }}</h2>
                <p class="mt-2">Date: {{ student.date }}</p>
                <p>Time: {{ student.time }}</p>
                <p>Location: {{ student.location }}</p>
                <p>Contact: {{ student.contact }}</p>
                <p>Upcoming Lesson: {{ student.upcomingLessonTopic }}</p>
              </CardContent>
            </Card>
          </div>
        </figure>
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<style scoped>
.student-card {
  width: 300px; /* Increased width for larger card */
  height: 350px; /* Added height to accommodate more content */
  cursor: pointer;
  transition: transform 0.3s ease-in-out; /* Keep transform transition for smooth scaling */
  overflow: hidden;
  flex: 0 0 auto; /* Ensures cards stay the same size and don't shrink */
}

.student-card:hover {
  transform: scale(1.05); /* Subtle scaling effect */
  box-shadow: none; /* No shadow effect */
  z-index: 10; /* Ensure the card is on top when hovered */
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.dialog {
  overflow: visible;
}
</style>
