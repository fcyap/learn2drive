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
} from "@/components/ui/card"

  //Redirect user if not signed in
  import { useLocalStorage } from '@vueuse/core';
  const userId = useLocalStorage('userId', null).value;
  import { useRouter } from 'vue-router';
  if (userId === null) {
    const router = useRouter();
    router.push("/");
  }

</script>

<template>
  <head>
    <title>Resources</title>
  </head>
    <div class="container mx-auto p-6 min-h-screen">
        <div class="space-y-2 mb-6 sm:mb-10">
            <h1 class="text-3xl font-bold tracking-tight text-slate-700">Resources</h1>
            <p class="text-lg text-gray-600">Everything you need to pass</p>
        </div>
      
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <a href="/Student/resourceFiles/officialResources">
      <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
        <CardHeader>
          <CardTitle>BTT/FTT Resources</CardTitle>
          <CardDescription>Access the latest syllabus and curriculum notes for your Theory tests.</CardDescription>
        </CardHeader>
        
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Card>
      </a>

      <a href="/Student/resourceFiles/flashcard">
      <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
        <CardHeader>
          <CardTitle>Road Sign Flashcards</CardTitle>
          <CardDescription>Revise and test your knowledge on road signs.</CardDescription>
        </CardHeader>
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
      </Card>
      </a>

    </div>
    <br>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <a href="/Student/resourceFiles/questionsPage">
        <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
          <CardHeader>
            <CardTitle>BTT/FTT Questions</CardTitle>
            <CardDescription>Want to check how prepared you are for your next theory test? Check out our repository of past BTT/FTT questions or take a timed mock quiz.</CardDescription>
          </CardHeader>
        
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Card>
      </a>

      <a href="/Student/resourceFiles/revisionReview">
        <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
          <CardHeader>
            <CardTitle>Review Corner</CardTitle>
            <CardDescription>Review your most recent mock test results.</CardDescription>
          </CardHeader>
        
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div> 
        </Card>
      </a> 
    </div>
  </div>
  </template>
 
<style>

</style>