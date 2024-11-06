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

import { Button } from "@/components/ui/button";

</script>

<template>
  <div class="flex flex-col ">
    <h1 class="text-3xl font-bold tracking-tight ">Resources</h1>
    <p class="text-muted-foreground">Everything you need to pass</p>
    <br>
  
    <div class="grid grid-cols-2 gap-4 ">
      <a href="/Student/resourceFiles/officialResources">
      <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
        <CardHeader>
          <CardTitle>BTT/FTT Resources</CardTitle>
          <CardDescription>Access the latest syllabus and curriculum notes to prepare for your Basic and Final Theory Test.</CardDescription>
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
    <div class="grid grid-cols-1 gap-4">

      <a href="/Student/resourceFiles/questionsPage">
        <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
          <CardHeader>
            <CardTitle>BTT/FTT Questions</CardTitle>
            <CardDescription>Want to check how prepared you are for your next theory test? Check out our repository of over 200 questions of past BTT/FTT questions or take a timed mock quiz.</CardDescription>
          </CardHeader>
        
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Card>
      </a>

      <!-- <a href="/Student/resourceFiles/revisionReview">
        <Card class="relative h-64 p-2 hover:drop-shadow-xl hover:text-blue-600 bg-slate-100">
          <CardHeader>
            <CardTitle>Review Corner</CardTitle>
            <CardDescription>A personalised section for the questions and topics you most frequently get wrong.</CardDescription>
          </CardHeader>
        
          <div class="absolute bottom-5 right-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div> 
        </Card>
      </a>  -->
    </div>
  </div>
  </template>
 
<style>

</style>