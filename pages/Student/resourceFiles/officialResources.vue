<script setup lang="ts">
definePageMeta({
  layout: "studentview",
});

import { ref } from 'vue';

// Make currentTopic reactive
const currentTopic = ref<"BTT" | "FTT">("BTT");

// Define function to toggle the topic
function toggleTopic() {
  currentTopic.value = currentTopic.value === "BTT" ? "FTT" : "BTT";
}
</script>

<template>
  <!-- Back to Resources Link -->
  <div>
    <a href="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </a>
  </div>

  <!-- Slide Toggle Switch -->
  <div class="toggleSwitch" @click="toggleTopic">
    <div :class="{ slideLeft: currentTopic === 'BTT', slideRight: currentTopic === 'FTT' }" class="toggleButton">
      <span>{{ currentTopic === 'BTT' ? 'BTT' : 'FTT' }}</span>
    </div>
  </div>

  <!-- PDF Viewer -->
  <div>
    <iframe
      :src="currentTopic === 'FTT' ? '/externalFiles/FTT.pdf' : '/externalFiles/BTT.pdf'"
      class="pdfViewer"
    ></iframe>
  </div>
</template>

<style>
  /* Toggle Switch */
  .toggleSwitch {
    width: 100px; /* Width of the switch */
    height: 50px; /* Height of the switch */
    background-color: #ddd; /* Background color for inactive state */
    border-radius: 25px; /* Fully rounded edges */
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    margin: 20px auto; /* Center the switch horizontally */
  }

  .toggleButton {
    width: 50%; /* Width of each side */
    height: 100%;
    background-color: green; /* Active color for the button */
    border-radius: 25px; /* Rounded corners */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
    position: absolute;
    transition: 0.3s; /* Smooth sliding transition */
  }

  .slideLeft {
    background-color: green; /* BTT color */
    left: 0; /* Position to the left */
  }

  .slideRight {
    background-color: red; /* FTT color */
    left: 50%; /* Position to the right */
  }

  /* PDF Viewer */
  .pdfViewer {
    width: 100%; /* Full width */
    height: 100vh; /* Responsive height */
    border: none; /* No border */
  }

  /* Center the PDF Viewer header */
  h1 {
    text-align: center;
    margin-bottom: 10px;
  }
</style>
