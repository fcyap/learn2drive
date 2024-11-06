<template>
<Card class="flip-card" :class="{flipped: isFlipped}" @click="toggleFlip()">
  <Card class="flip-card-inner">
    <Card class="flip-card-front">
      <slot name="front">Default Front Content</slot>
    </Card>
    <Card class="flip-card-back">
      <slot name="back">Default Back Content</slot>
    </Card>
  </Card>
  
  
  </Card>
  <div class="flex items-center justify-center my-5">
    <button @click.stop="prevCard" class="mx-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>
    <h1 class="inline-flex text-xl">{{ currentIndex + 1}} / {{dataLength}}</h1>
    <button @click.stop="nextCard" class="mx-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
  </template>
  
  <script setup lang="ts">

import { Card } from '@/components/ui/card';
import { ref, defineProps, defineEmits, computed, nextTick } from 'vue';

const props = defineProps({
  currentIndex: {
    type: Number,
    required: true,
  },
  dataLength: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(['update:index']);

const isFlipped = ref(false);
const isFirstCard = computed(() => props.currentIndex === 0);
const isLastCard = computed(() => props.currentIndex === props.dataLength - 1);

function toggleFlip() {
  isFlipped.value = !isFlipped.value;
}

function nextCard() {
  // Check if we are at the last card
  if (isLastCard.value) {
    // If at the last card, navigate to the first card
    emits("update:index", 0); // Move to the first card
  } else {
    // If not at the last card, proceed normally
    if (isFlipped.value) {
      isFlipped.value = false; // Flip back to the front
    }
    // Wait a bit for the card to flip to the front, then change the index
    setTimeout(() => {
      emits("update:index", props.currentIndex + 1);
    }, 83); // Adjust the delay to match the flip animation duration if needed
  }
}

function prevCard() {
  if (!isFirstCard.value) {
    if (isFlipped.value) {
      isFlipped.value = false;
    }
    // Wait a bit for the card to flip to the front, then change the index
    setTimeout(() => {
      emits("update:index", props.currentIndex - 1);
    }, 83); // Adjust the delay to match the flip animation duration if needed
  
  } else {
    emits("update:index", props.currentIndex == 0 ? props.dataLength - 1 : props.currentIndex - 1);
  }
}

  </script>
  
  <style scoped>
  .flip-card {
    background-color: transparent;
    margin: auto;
    width: 1000px;
    height: 600px;
    perspective: 1000px; /* Adds the 3D effect */
    overflow: hidden;
    display: flex;
  }
  
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }
  
  .flipped .flip-card-inner {
    transform: rotateX(180deg); /* Flip the card vertically */
  }
  
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    text-align: center;
  }
  
  .flip-card-front {
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .flip-card-back {
    background-color: gray;
    color: white;
    font-size: x-large;
    transform: rotateX(180deg);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  </style>
  