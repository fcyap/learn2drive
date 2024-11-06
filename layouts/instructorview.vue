<template>
  <div class="side-navbar-container flex flex-col min-h-screen">
    <!-- Hamburger menu button for mobile view using ShadCN Button -->
    <Button
      variant="ghost"
      size="lg"
      class="md:hidden p-4 fixed top-2.5 left-0 z-50 bg-white rounded-full shadow-lg"
      @click="toggleMenu"
    >
      <!-- SVG Icon for Hamburger -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-dark"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </Button>

    <!-- Sidebar Navigation using ShadCN Button component for nav links -->
    <nav
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="side-navbar fixed top-0 left-0 h-full w-60 z-40 md:translate-x-0 transition-transform duration-300 ease-in-out border border-solid text-white bg-slate-900"
    >
      <div class="flex flex-col h-full py-8 px-6">
        <!-- Project Title -->
        <div class="mb-10 flex justify-center">
          <NuxtLink to="/" class="text-3xl font-bold tracking-tight">
            Learn2Drive
          </NuxtLink>
        </div>

        <div class="flex-grow flex flex-col space-y-4">
          <Button variant="ghost" class="w-full">
            <NuxtLink
              to="/Instructor/HomePage"
              class="nav-link text-left w-full"
            >
              🏠 Home
            </NuxtLink>
          </Button>
          <Button variant="ghost" class="w-full">
            <NuxtLink
              to="/Instructor/Availability"
              class="nav-link text-left w-full"
            >
              📅 Availability
            </NuxtLink>
          </Button>
          <Button variant="ghost" class="w-full">
            <NuxtLink
              to="/Instructor/StudentAnalysis"
              class="nav-link text-left w-full"
            >
              📝 Student Analysis
            </NuxtLink>
          </Button>

          <!-- <NuxtLink to="/Instructor/archives/add" class="nav-link"> add </NuxtLink>
          <NuxtLink to="/Instructor/archives/get" class="nav-link"> get </NuxtLink>
          <NuxtLink to="/Instructor/testpage" class="nav-link"> test </NuxtLink> -->
        </div>

        <!-- Profile link flushed to the bottom -->
        <div class="flex justify-center mt-auto">
          <Button variant="ghost">
            <NuxtLink to="/Instructor/Profile" class="nav-link">
              👤 Profile
            </NuxtLink>
          </Button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div
      class="content flex-1 p-8 transition-all duration-300 ease-in-out"
      :class="menuOpen ? 'ml-64' : 'ml-0 md:ml-64'"
    >
      <slot />
    </div>
    
    <!-- Footer -->
    <footer class="text-slate-900">
      <div class="container text-center">
        <p>
          &copy; {{ new Date().getFullYear() }} Learn2Drive. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have a classnames utility function in your project

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style>

</style>
