<script setup lang="ts">
  definePageMeta({
    layout: "studentview",
  });

  import { ref } from 'vue';
  //Redirect user if not signed in
  import { useLocalStorage } from "@vueuse/core";
  import { useRouter } from 'vue-router';
  const studentId = Number(useLocalStorage("userId", null).value);
  if (studentId === 0) {
    const router = useRouter();
    router.push("/");
  }

  // Make currentTopic reactive
  const currentTopic = ref<"BTT" | "FTT">("BTT");

  // Define function to toggle the topic
  function toggleTopic() {
    currentTopic.value = currentTopic.value === "BTT" ? "FTT" : "BTT";
  }
</script>

<template>
  <head>
    <title>
      BTT/FTT Resources
    </title>
  </head>
  <!-- Back button -->
  <div>
    <NuxtLink to="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </NuxtLink>
  </div>

  <!-- Slide Toggle Switch -->
  <div class="toggleSwitch" @click="toggleTopic">
    <div :class="{ slideLeft: currentTopic === 'BTT', slideRight: currentTopic === 'FTT' }" class="toggleButton">
      <span>{{ currentTopic === 'BTT' ? 'BTT' : 'FTT' }}</span>
    </div>
  </div>

  <!-- PDF Viewer -->
  <div class="wrapper">
    <iframe
      :src="currentTopic === 'FTT' ? '/externalFiles/FTT.pdf' : '/externalFiles/BTT.pdf'"
      loading="lazy">
    </iframe>
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
    max-width: 90%;
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
  .wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
  }
  .wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
  }
</style>
