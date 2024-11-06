<script setup lang="ts">
import Flashcard from '~/components/resources/flashcard.vue';
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: "studentview",
});

const client = useSupabaseClient();

interface Flashcard {
  image_url: string;
  category: string;
  description: string;
}

const currentIndex = ref(0);
const flashcards = ref<Flashcard[]>([]);
  const loading = ref(true);

  const fetchCards = async () => {
  const { data: flashcardData, error: flashcardError } = await client
    .from('flashcard')
    .select('*');
  
  if (flashcardError) {
    console.log('Error fetching flashcard:', flashcardError); // Handle error appropriately
  }

  if (flashcardData) {
    flashcards.value = flashcardData;
    console.log('Fetched flashcard:', flashcards.value);
  }
  
  loading.value = false; // Set loading to false after fetching
};

onMounted(() => {
  fetchCards();
});
</script>

<template>
  <div>
    <a href="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </a>

    <div v-if="loading">Loading flashcards...</div>
    <div v-else-if="flashcards.length > 0">
      <Flashcard 
      v-if="flashcards.length > 0" 
      :dataLength="flashcards.length" 
      :currentIndex="currentIndex"
      @update:index="(index) => currentIndex = index">
        <template #front>
          <div>
            <img :src="flashcards[currentIndex].image_url" style="object-fit: contain; max-width: 100%; max-height: 100%; display: block">
          </div>
        </template>
        <template #back>
          <h2>{{ flashcards[currentIndex].description }}</h2>
        </template>
        </Flashcard>
    </div>
    <div v-else>No flashcards available.</div>
  </div>
</template>

<style>
</style>