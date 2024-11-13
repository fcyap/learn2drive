<script setup lang="ts">

  definePageMeta({
    layout: "studentview",
  });

  import { ref } from 'vue';
  import { Button } from '~/components/ui/button';
  import { Card } from '~/components/ui/card';
  import {  DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger, } from '~/components/ui/dropdown-menu';

  //Redirect user if not signed in
  import { useLocalStorage } from "@vueuse/core";
  import { useRouter } from 'vue-router';
  const studentId = Number(useLocalStorage("userId", null).value);
  if (studentId === null) {
    const router = useRouter();
    router.push("/");
  }

  const isButtonClicked = ref(false);
  const router = useRouter();
  
  //GET query to questions page, detailing topic (BTT/FTT) and type of question format
  function goToQuestions() {
    isButtonClicked.value = true;
    const query: { 
      topic: "BTT" | "FTT"; 
      type: "practise" | "test"; 
      questions?: string 
    } = {
      topic: currentTopic.value,
      type: currentType.value,
    };
    if (currentType.value === 'practise' && selectedQuestions.value !== null) {
      query.questions = String(selectedQuestions.value); // Convert to string
    }

    if (!(currentType.value === "practise" && selectedQuestions.value === null)) {
      router.push({
      path: '/Student/resourceFiles/questions',
      query: query,
      })
    };
  }

  // Make currentTopic reactive
  const currentTopic = ref<"BTT" | "FTT">("BTT");

  // Define function to toggle the topic
  function changeToFTT() {
    currentTopic.value = "FTT";
  }
  function changeToBTT() {
    currentTopic.value = "BTT";
  }

  // Make currentTopic reactive
  const currentType = ref<"practise" | "test">("practise");

  // Define function to toggle the topic
  function changeToTest() {
    currentType.value = "test";
  }

  function changeToPractise() {
    currentType.value = "practise";
  }

  const selectedQuestions = ref<number | null>(null); // Reactive reference for the selected number of questions

</script>

<template>
  <head>
    <title>
      Questions
    </title>
  </head>
  <div>
    <!-- Back button -->
    <NuxtLink to="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </NuxtLink>
  </div>
  
  <h1 class="text-xl font-bold pt-4 text-center">What would you like to do today?</h1>

  <!-- Choose between BTT and FTT -->
  <div class="buttonsDiv">
    <Card class="testButton btt" @click="changeToBTT()" :style="{ backgroundColor: currentTopic === 'BTT' ? '#90CAF9' : '' }">
      BTT
    </Card>
    <Card class="testButton ftt" @click="changeToFTT()" :style="{ backgroundColor: currentTopic === 'FTT' ? '#90CAF9' : '' }">
      FTT
    </Card>
  </div>

  <!-- Choose between practice or mock test -->
  <div class="optionDiv items-center">
    <Card class="optionButton" @click="changeToPractise()" :style="{ backgroundColor: currentType === 'practise' ? '#66B2FF' : '' }">
      Practice Questions
    </Card>

    <!-- Choose num of questions -->
    <div v-if="currentType === 'practise'" style="text-align: center; margin-top: 10px;">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="dropdown">
            Number of Questions:  {{ selectedQuestions }}
            <span class="dropdown-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuRadioGroup v-model="selectedQuestions">
            <DropdownMenuRadioItem value="5">
              5
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="10">
              10
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="15">
              15
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Card class="optionButton" @click="changeToTest()" :style="{ backgroundColor: currentType === 'test' ? '#66B2FF' : '' }">
      Mock Test
    </Card>
  </div>

  <!-- Let's go button -->
    <div style="text-align:center;">
      <Button style="margin: 10px auto;cursor: pointer;background-color:#0f172a;" @click="goToQuestions">Let's Go!</Button>
    </div>
    <p v-if="isButtonClicked === true" style="color: red; text-align:center;">
      Please select a number of questions to proceed.
    </p>
    
</template>

<style>
.testButton {
  font-size: 2rem;
  padding: 15px 30px;
  margin: 20px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;  /* Ensures the text inside is centered */
  min-width: 200px;  /* Ensures the card has a minimum width */
  width: auto;  /* Allows the card to expand based on content */
}

.optionButton {
  font-size: 1.25rem;
  text-align: center;
  margin: 20px;
  padding: 13px 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;  /* Vertically centers the text */
  word-wrap: break-word;  /* Prevents text overflow */
  min-width: 200px;  /* Ensures the card has a minimum width */
  width: auto;  /* Allows the card to expand based on content */
}

.buttonsDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;  /* Allows buttons to wrap on smaller screens */
  width: 100%;
}

.optionDiv {
  max-width: 40%;
  margin: 0 auto;
  text-align: center;
}

@media (max-width: 640px) {
  .testButton {
    font-size: 1.75rem;  /* Adjust font size for smaller screens */
    padding: 12px 25px;  /* Adjust padding for smaller screens */
    margin: 10px;
  }

  .optionButton {
    font-size: 1.15rem;  /* Adjust font size for smaller screens */
    padding: 10px 18px;  /* Adjust padding for smaller screens */
  }

  .optionDiv {
    max-width: 90%;  /* Use more screen width on small screens */
  }
}

.dropdown {
  font-size: 15px;
  margin-top: 15px; /* Adjusts spacing above the dropdown */
  margin-bottom: 30px; /* Adjusts spacing below the dropdown */
  padding: 13px 10px; /* Padding inside the button */
  color: black; /* Set text color to white */
  background-color: white; /* Set background to transparent to show dropdown color */
  border: 2px solid white; /* Square borders */
  border-radius: 0; /* No rounded corners */
  cursor: pointer;
}

.dropdown:hover {
  background-color: white; /* Keep the same background color on hover */
  color: black; /* Keep text color */
}

.dropdown-indicator {
  margin-left: 5px; /* Add space between text and dropdown indicator */
}

</style>