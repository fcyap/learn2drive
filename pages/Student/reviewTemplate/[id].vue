<script setup lang="ts">

  definePageMeta({
    layout: "studentview",
  });

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { ref, onMounted } from 'vue';
  import Stars from '@/components/review/Stars.vue';
  import { useRoute } from 'vue-router';
  
  //Redirect user if not signed in
  import { useLocalStorage } from "@vueuse/core";
  import { useRouter } from 'vue-router';
  const studentId = Number(useLocalStorage("userId", null).value);
  if (studentId === 0) {
    const router = useRouter();
    router.push("/");
  }

  type Checked = DropdownMenuCheckboxItemProps['checked']

  interface Instructor {
    id: number;
    name: string;
    location: string;
    rating: number | null;
    totalReviews: number;
  }

  interface Review {
    instructor_id: number;
    student_id: number;
    rating: number;
    comment: string;
    date_posted: Date;
  }

  const route = useRoute();
  const instructor_id = Number(route.params.id); 
  const instructor = ref<Instructor | null>(null);
  const reviews = ref<Review[]>([]);
  const client = useSupabaseClient();
  const students = ref<{ [key: number]: string }>({});

  onMounted(async () => {
    // Fetch instructor data
    const { data: instructorData, error: instructorError } = await client
      .from('instructors')
      .select('*')
      .eq('id', instructor_id)
      .single();

    if (instructorError) {
      console.error('Error fetching instructor:', instructorError);
      return; // Handle error appropriately
    }

    if (instructorData) {
      instructor.value = instructorData;
    }
    
    // Fetch reviews for this instructor
    const { data: reviewData, error: reviewError } = await client
      .from('instructor_reviews')
      .select('*')
      .eq('instructor_id', instructor_id);

    if (reviewError) {
      console.error('Error fetching reviews:', reviewError);
      return; // Handle error appropriately
    }

    if (reviewData) {
      reviews.value = reviewData;
    }
    // Fetch student data
    const { data: studentData, error: studentError } = await client
      .from('studentview')
      .select('id, name');

    if (studentError) {
      console.error('Error fetching students:', studentError);
      return;
    }

    if (studentData) {
      // Map student IDs to names for easy lookup
      studentData.forEach(student => {
        students.value[student.id] = student.name;
      });
    }
  });

  //Filter functions
  const sortCriteria = ref('newest');

  const sortedReviews = computed(() => {
    return [...reviews.value].sort((a, b) => {
      if (sortCriteria.value === 'highest') {
        // Sort by rating (high to low), then by date (newest first) for same ratings
        return b.rating - a.rating || new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime();
      }
      if (sortCriteria.value === 'lowest') {
        // Sort by rating (low to high), then by date (newest first) for same ratings
        return a.rating - b.rating || new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime();
      }
      if (sortCriteria.value === 'newest') {
        // Sort by date (newest first), then by rating (high to low) for same dates
        return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime() || b.rating - a.rating;
      }
      return 0;
    });
  });

  //Read more function
  const showFullText = ref({});

  function toggleFullText(idx: number) {
    // Toggle the expanded state of the selected review
    showFullText.value[idx] = !showFullText.value[idx];
  }

  function truncatedText(text: string) {
    // Truncate text to a certain length
    return text.length > 300 ? text.slice(0, 300) + '...' : text;
  }

</script>

<template>
  <head>
    <title v-if="instructor">{{ instructor.name }}'s Reviews</title>
  </head>
  <div class="flex min-h-screen flex-col">
    <!-- Back button-->
    <NuxtLink to="/Student/instructorReview" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Reviews</h1>
    </NuxtLink>
    <br>
    <div class="inline-flex p-6">
      <h1 v-if="instructor" class="text-3xl font-bold tracking-tight text-slate-700">{{ instructor.name }}'s Reviews</h1>
      <p v-else class="text-gray-500">Loading instructor reviews...</p>
      <!-- Filter button -->
      <div class="ml-auto flex-end" style="cursor:pointer;">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              Sort reviews
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuRadioGroup v-model="sortCriteria">
                <DropdownMenuRadioItem value="highest">
                  Highest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lowest">
                  Lowest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <br>
    <div class="flex-grow">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3" v-if="reviews.length > 0">
        <Card id="app" class="review bg-slate-100 max-w-full p-4" v-for="(review, idx) in sortedReviews" :key="idx">
          <!-- Name and rating in the center -->
          <div class="flex-grow flex items-center mb-2">
            <div class="font-bold text-lg truncate">
              {{ students[review.student_id] || "Unknown Student" }}
            </div>
            <div class="flex ml-4 flex-wrap">
              <Stars :rating="review.rating" />
            </div>
          </div>
          <div>
            <div class="text-sm mb-2 text-gray-500">
              {{ new Date(review.date_posted).toLocaleDateString() }}
            </div>
          </div>
          <hr>
          <div class="py-2 break-words">
            <p :class="{ 'max-h-[200px] overflow-hidden': !showFullText[idx] }">
              {{ showFullText[idx] ? review.comment : truncatedText(review.comment) }}
            </p>
          </div>
          <button
            v-if="review.comment.length > 150"
            @click="toggleFullText(idx)"
            class="text-gray-500 hover:underline mt-1"
          >
            {{ showFullText[idx] ? 'Read less' : 'Read more' }}
          </button>
        </Card>
      </div>

      <div v-else class="text-xl px-4">No reviews yet.</div>
    </div>  
  </div>
</template>

<style>
  .review {
    padding: 1rem;
  }
</style>