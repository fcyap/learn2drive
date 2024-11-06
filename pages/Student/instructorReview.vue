<template>
  <div class="flex flex-col">
    <div class="inline-flex w-full items-start mb-4">
    <!-- Flex column for "Reviews" and "View the instructor reviews" stacked vertically -->
    <div class="flex flex-col">
      <h1 class="text-3xl font-bold tracking-tight">Reviews</h1>
      <p class="text-muted-foreground">View the instructor reviews</p>
    </div>
    
    <div class="ml-auto flex-end" style="cursor:pointer;">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Filter
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
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <br>
    </div>
    <div v-for="instructor in sortedInstructors" :key="instructor.id">
      <NuxtLink :to="`/Student/reviewTemplate/${instructor.id}`">
        <Card class="card bg-slate-100">
          <div class="flex-shrink-0 mr-16">
            <img v-if="instructor.image !== null"
              height="100px" 
              width="100px" 
              :src="instructor.image"
              alt="Instructor Uncle" 
              class="rounded-full"
            />
            <img v-else
              height="100px" 
              width="100px" 
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Instructor Uncle" 
              class="rounded-full"
            />
          </div>
          <div class="flex-grow">
  <h1 class="font-bold mb-2" style="text-align: left; font-size: 23px;">{{ instructor.name }}</h1>
  <h1 class="italic mb-2 text-slate-600" style="text-align: left; font-size: 15px">{{ instructor.location }}</h1>
  <div class="inline-flex items-center">
    <h2 style="font-size: 19px">
      {{ instructor.rating !== null ? instructor.rating.toFixed(1) : 'No reviews yet' }}
    </h2>
    <div class="flex ml-2"  v-if="instructor.rating !== null">
      <template v-for="n in 5" :key="n">
        <!-- Full stars -->
        <svg
          v-if="n <= Math.floor(instructor.rating)"
          xmlns="http://www.w3.org/2000/svg"
          fill="gold"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="color:gold"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>

<!-- Partial star with gold outline -->
<svg
  v-else-if="n === Math.ceil(instructor.rating)"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="gold"
  class="w-6 h-6"
>
  <defs>
    <clipPath :id="'partial-clip-' + n">
      <!-- Width adjusts based on the remainder of the rating -->
      <rect :width="(instructor.rating % 1) * 24" height="24" />
    </clipPath>
  </defs>

  <!-- Filled part -->
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="gold"
    :clip-path="'url(#partial-clip-' + n + ')'"
    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
  />

  <!-- Outline -->
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    stroke="gold"
    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
  />
</svg>


        <!-- Empty stars -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="color: gold;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </template>
    </div>
  </div>
</div>

          <div class="flex p-3 text-center">
            <h2 class="text-lg"><b>Total reviews:</b><br>{{ instructor.totalReviews }}</h2>
          </div>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>



<style>
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    overflow: hidden;
    margin-bottom: 10px
  }

  .card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: rgb(79, 83, 92);
  }
</style>
<script setup lang="ts">
definePageMeta({
  layout: 'studentview'
});

import {Card} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const client = useSupabaseClient();

interface Instructor {
  id: number;
  name: string;
  location: string;
  rating: number | null ;
  totalReviews: number;
  image: string;
}


import { ref, onMounted } from 'vue';

// Main instructors data with initial data from Supabase
const instructors = ref<Instructor[]>([]);
const sortCriteria = ref('');
const sortedInstructors = computed(() => {
  return [...instructors.value].sort((a, b) => {
    if (sortCriteria.value === "highest") {
      return (b.rating ?? 0) - (a.rating ?? 0); // Sort by highest rating
    } else if (sortCriteria.value === "lowest") {
      return (a.rating ?? 0) - (b.rating ?? 0); // Sort by lowest rating
    } else {
      return b.totalReviews - a.totalReviews; // Sort by total number of reviews
    }
    return 0;
  });
});
const fetchInstructorsWithReviews = async () => {
  try {
    // Fetch instructors without reviews first
    const { data: instructorsData, error } = await client.from('instructors').select('id, name, location, image');
    if (error) throw error;

    // For each instructor, fetch their reviews and calculate rating/totalReviews
    for (const instructor of instructorsData ?? []) {
      const { data: reviews, error: reviewError } = await client
        .from('instructor_reviews')
        .select('rating')
        .eq('instructor_id', instructor.id);

      if (reviewError) throw reviewError;

      const totalReviews = reviews?.length ?? 0;
      const averageRating = totalReviews
      ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)) : null;

      // Add to instructors array with calculated fields
      instructors.value.push({
        id: instructor.id,
        name: instructor.name,
        location: instructor.location,
        rating: averageRating,
        totalReviews: totalReviews,
        image: instructor.image
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data on component mount
onMounted(fetchInstructorsWithReviews);






</script>