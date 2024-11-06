<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const client = useSupabaseClient();

interface Student {
  id: number;
  name: string;
  contact: string;
  profile_photo: string;
}

interface Lesson {
  instructor_name: string;
  student_id: number;
  date: Date;
  time: string;
  location: string;
  instructor_id: number;
}

interface StudentDrivingProgress {
  id: number;
  sn: number;
  module: string;
  done: boolean;
}

interface StudentTestRoutes {
  id: number;
  sn: number;
  testroute: string;
  done: boolean;
}

const { data: studentview } = await useAsyncData<Student[]>(
  "studentview",
  async () => {
    const { data } = await client.from("studentview").select();
    return data ?? [];
  }
);

const instructorId = 1;

const { data: lessons } = await useAsyncData<Lesson[]>("lessons", async () => {
  const { data } = await client.from("lessons").select();
  return data ?? [];
});

const futureLessons = computed(() => {
  const now = new Date();
  return (
    lessons.value?.filter(
      (lesson) =>
        lesson.instructor_id === instructorId && new Date(lesson.date) > now
    ) ?? []
  );
});

const studentIdsWithLessons = computed(() => {
  return new Set(futureLessons.value.map((lesson) => lesson.student_id));
});

// Filter student data to include only those with future lessons with the instructor
const studentsWithLessons = computed(() => {
  return (
    studentview.value?.filter((student) =>
      studentIdsWithLessons.value.has(student.id)
    ) ?? []
  );
});

const { data: student_driving_progress } = await useAsyncData<
  StudentDrivingProgress[]
>("student_driving_progress", async () => {
  const { data } = await client.from("student_driving_progress").select();
  return data ?? [];
});

const { data: student_test_routes } = await useAsyncData<StudentTestRoutes[]>(
  "student_test_routes",
  async () => {
    const { data } = await client.from("student_test_routes").select();
    return data ?? [];
  }
);

function getCompletedProgressByStudent(studentId: number) {
  return (
    student_driving_progress.value?.filter(
      (progress) => progress.id === studentId && progress.done === true
    ) || []
  );
}

function getUncompletedProgressByStudent(studentId: number) {
  return (
    student_driving_progress.value?.filter(
      (progress) => progress.id === studentId && progress.done === false
    ) || []
  );
}

function getStudentTestRoutes(studentId: number) {
  return (
    student_test_routes.value
      ?.filter((testroute) => testroute.id === studentId)
      .sort((a, b) => a.sn - b.sn) || []
  );
}

function getNearestUpcomingLessonDate(studentId: number): Date | null {
  const now = new Date();

  const upcomingLessons = lessons.value
    ?.filter(
      (lesson) =>
        lesson.student_id === studentId &&
        new Date(lesson.date).getTime() > now.getTime() // Check if the lesson is in the future
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

  return upcomingLessons?.[0]?.date || null; // Return the date of the nearest upcoming lesson or null if none found
}

function getProfilePhotoUrl(studentId: string) {
  const supabaseUrl = "https://tzklhzyswqmorhokvgmw.supabase.co";
  const bucketPath = "new_profile_photos"; // Ensure this matches your bucket and folder structure
  return `${supabaseUrl}/storage/v1/object/public/${bucketPath}/${studentId}.jpg`;
}
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Current Students</h2>
    <p class="text-muted-foreground">See your students!</p>
  </div>

  <div class="grid lg:grid-cols-5 gap-2">
    <ScrollArea class="lg:col-span-5 overflow-auto">
      <!-- Apply gap-4 directly to the flex container and set it to wrap -->
      <div class="flex flex-wrap gap-4 p-4 justify-start">
        <div
          v-for="student in studentsWithLessons"
          :key="student.id"
          class="student-card"
        >
          <div class="rounded-md">
            <Card class="h-80 w-60 flex flex-col items-center justify-center">
              <CardContent class="text-center flex flex-col items-center">
                <img
                  class="rounded-full h-28 w-28 mb-4"
                  :src="getProfilePhotoUrl(student.id.toString())"
                  alt="Student Photo"
                />
                <h2 class="text-xl font-semibold">{{ student.name }}</h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  Next Lesson:
                  {{
                    getNearestUpcomingLessonDate(student.id) ||
                    "No upcoming lessons"
                  }}
                </p>
                <Drawer>
                  <DrawerTrigger as-child>
                    <Button
                      variant="secondary"
                      class="mt-5 view-progress"
                      style="cursor: pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6 mr-1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      View Progress
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <div class="space-y-0.5">
                        <h2 class="text-2xl font-bold tracking-tight">
                          {{ student.name }}'s Progress
                        </h2>
                      </div>
                    </DrawerHeader>
                    <div
                      class="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-2 xl:grid-cols-5"
                    >
                      <div
                        class="col-span-2 grid items-start gap-6 lg:col-span-1"
                      >
                        <Container>
                          <Card class="h-72 overflow-hidden">
                            <CardHeader class="pb-3 h-16">
                              <CardTitle>Personal Details</CardTitle>
                            </CardHeader>

                            <CardContent>
                              <div class="flex justify-center">
                                <img
                                  class="rounded-full h-20 w-20 mb-4"
                                  :src="
                                    getProfilePhotoUrl(student.id.toString())
                                  "
                                  alt="Student Photo"
                                />
                              </div>

                              <div class="grid grid-cols-2 gap-2">
                                <!-- Increased gap to 4 -->
                                <div
                                  class="col-span-1 flex flex-col items-center justify-center"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Card
                                          class="h-16 w-24 flex flex-col items-center justify-center m-1"
                                        >
                                          <!-- Added margin 1 -->
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="h-6 w-6 mx-auto"
                                          >
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                                            />
                                          </svg>
                                          <CardContent class="text-center p-0">
                                            {{ student.contact }}
                                          </CardContent>
                                        </Card>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Contact</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>

                                <div
                                  class="col-span-1 flex flex-col items-center justify-center"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Card
                                          class="h-16 w-24 flex flex-col items-center justify-center m-1"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="size-6"
                                          >
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                            />
                                          </svg>
                                          <CardContent class="text-center p-0">
                                            10
                                          </CardContent>
                                        </Card>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Lessons Completed</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Container>
                      </div>
                      <div class="grid items-start gap-6 lg:col-span-2">
                        <div>
                          <Container>
                            <Card class="h-72">
                              <CardHeader class="pb-3 h-16">
                                <CardTitle>Driving Modules</CardTitle>
                              </CardHeader>

                              <CardContent>
                                <div class="grid grid-cols-2 gap-4">
                                  <div class="col-1">
                                    <!-- Completed modules with scrollable area -->
                                    <p>Completed Modules:</p>
                                    <ScrollArea class="h-36 overflow-y-auto">
                                      <ul>
                                        <li
                                          v-for="progress in getCompletedProgressByStudent(
                                            student.id
                                          )"
                                          :key="progress.sn"
                                        >
                                          {{ progress.module }}
                                        </li>
                                      </ul>
                                    </ScrollArea>
                                  </div>
                                  <div class="col-1">
                                    <!-- Uncompleted modules with scrollable area -->
                                    <p>Uncompleted Modules:</p>
                                    <ScrollArea class="h-36 overflow-y-auto">
                                      <ul>
                                        <li
                                          v-for="progress in getUncompletedProgressByStudent(
                                            student.id
                                          )"
                                          :key="progress.sn"
                                        >
                                          {{ progress.module }}
                                        </li>
                                      </ul>
                                    </ScrollArea>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Container>
                        </div>
                      </div>
                      <div
                        class="col-span-2 grid items-start gap-6 lg:col-span-2"
                      >
                        <Container>
                          <Card class="h-72">
                            <CardHeader class="pb-3 h-16">
                              <CardTitle>Test Route Completion</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <!-- Define a grid with 4 columns -->
                              <div class="grid grid-cols-4 gap-4">
                                <!-- Loop through test routes -->
                                <div
                                  v-for="testroute in getStudentTestRoutes(
                                    student.id
                                  )"
                                  :key="testroute.sn"
                                >
                                  <!-- Completed Route -->
                                  <Card class="test" v-if="testroute.done">
                                    <CardContent
                                      class="flex flex-col justify-center items-center h-full mt-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="h-12 w-12"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M4.5 12.75l6 6 9-13.5"
                                        />
                                      </svg>
                                      <p class="text-xs">
                                        {{ testroute.testroute }}
                                      </p>
                                    </CardContent>
                                  </Card>

                                  <!-- Incomplete Route -->
                                  <Card class="test" v-else>
                                    <CardContent
                                      class="flex flex-col justify-center items-center h-full mt-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="h-12 w-12"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      <p class="text-xs">
                                        {{ testroute.testroute }}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Container>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose as-child>
                        <Button variant="outline" style="cursor: pointer">
                          ok!
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>

<style scoped>
.view-progress:hover {
  background-color: rgb(213, 213, 213);
}
.test {
  height: 6rem;
  width: 6rem;
}
.content {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
