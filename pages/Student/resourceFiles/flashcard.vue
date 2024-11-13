<script setup lang="ts">
  definePageMeta({
    layout: "studentview",
  });
  
  import Flashcard from '~/components/resources/flashcard.vue';
  import { ref, onMounted } from 'vue';
  //Redirect user if not signed in
  import { useLocalStorage } from "@vueuse/core";
  import { useRouter } from 'vue-router';
  const studentId = Number(useLocalStorage("userId", null).value);
  if (studentId === null) {
    const router = useRouter();
    router.push("/");
  }
  
  const client = useSupabaseClient();
  const currentIndex = ref(0);
  const flashcards = ref<Flashcard[]>([]);
  const loading = ref(true);

  interface Flashcard {
    image_url: string;
    category: string;
    description: string;
  }

  const fetchCards = async () => {
    const { data: flashcardData, error: flashcardError } = await client
      .from('flashcard')
      .select('*');
    
    if (flashcardError) {
      console.log('Error fetching flashcard:', flashcardError); // Handle error appropriately
    }

    if (flashcardData) {
      flashcards.value = flashcardData;
    }
    
    loading.value = false; // Set loading to false after fetching
  };

  onMounted(() => {
    fetchCards();
  });
</script>

<template>
  <head>
    <title>
      Road Sign Flashcards
    </title>
  </head>
  <div>
    <!-- Back button -->
    <a href="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </a>

    <div class="mt-5">
      <div v-if="loading">Loading flashcards...</div>
      <div v-else-if="flashcards.length > 0">
        <Flashcard 
        v-if="flashcards.length > 0" 
        :dataLength="flashcards.length" 
        :currentIndex="currentIndex"
        @update:index="(index) => currentIndex = index"
        class="m-auto md:mr-3">
          <template #front>
            <div class='p-3'>
              <img :src="flashcards[currentIndex].image_url" style="object-fit: contain; max-width: 100%; max-height: 90%; display: block;">
            </div>
          </template>
          <template #back>
            <h2>{{ flashcards[currentIndex].description }}</h2>
          </template>
          </Flashcard>
      </div>
      <div v-else class="px-4">No flashcards available.</div>
    </div>
  </div>
</template>
