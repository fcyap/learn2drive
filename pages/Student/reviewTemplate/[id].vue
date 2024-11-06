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

type Checked = DropdownMenuCheckboxItemProps['checked']

const showNewest = ref<Checked>(true)
const showHighest = ref<Checked>(false)
const showLowest = ref<Checked>(false)

import Stars from '@/components/review/Stars.vue';


// Define types as per your existing code

import { useRoute } from 'vue-router';

// Define types
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
const instructor_id = Number(route.params.id); // Ensure it's a number

const instructor = ref<Instructor | null>(null);
const reviews = ref<Review[]>([]);
const client = useSupabaseClient();

onMounted(async () => {
  // Fetch instructor details
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
    console.log('Fetched instructor:', instructor.value); // Log the instructor data
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
    console.log('Fetched reviews:', reviews.value); // Log the reviews data
  }
});
const students = ref<{ [key: number]: string }>({});

onMounted(async () => {
  // Existing instructor and review fetching code

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

</script>

<template>
  <div class="flex flex-col">
    <NuxtLink to="/Student/instructorReview" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Reviews</h1>
    </NuxtLink>
    <br>
    <div class="inline-flex">
      <h1 v-if="instructor" class="text-3xl font-bold tracking-tight">{{ instructor.name }}'s Reviews</h1>
      <p v-else class="text-gray-500">Loading instructor reviews...</p>
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
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-3" style="height:300px" v-if="reviews.length > 0">
    <Card id="app" class="review bg-slate-100" v-for="(review, idx) in sortedReviews" :key="idx">
        <!-- Name and rating in the center -->
        <div class="flex-grow inline-flex items-center mb-2">
          <div class="font-bold" style="font-size: 23px">{{students[review.student_id] || "Unknown Student"}}</div>
          <div class="flex ml-4">
            <Stars :rating="review.rating" />
          </div>
        </div>
        <div>
          <div class="text-sm mb-2" style="color:gray">
          {{ new Date(review.date_posted).toLocaleDateString() }}
          </div>
        <!-- <div class="text-sm mb-2" style="font-style: italic" v-for="badge in review.badges">
            {{ badge }}
        </div> -->
        </div>
        <hr>
        <p class="py-2">{{review.comment}}</p>


    </Card>
  </div>
  <div v-else class="text-2xl">No reviews yet.</div>
  </div>  
</template>

<style>
.review {
  padding: 1rem;
}
</style>