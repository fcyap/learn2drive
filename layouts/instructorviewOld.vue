<template>
  <div class="side-navbar-container flex">
    <!-- Hamburger menu button for mobile view -->
    <button class="hamburger md:hidden p-4 fixed top-2.5 left-0 z-50 bg-white rounded-full shadow-lg" @click="toggleMenu">
      <!-- SVG Icon for Hamburger -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- Sidebar Navigation -->
    <nav :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="side-navbar fixed top-0 left-0 h-full w-60 z-40 md:translate-x-0 transition-transform duration-300 ease-in-out bg-neutral-900 text-slate-200 shadow-md hover:bg-neutral-800">
      <div class="flex flex-col h-full py-8 px-6">
        <!-- Project Title -->
        <div class="mb-10 flex justify-center">
          <NuxtLink to="/" class="text-3xl font-bold text-white hover:text-[var(--primary)]">
            Edu²
          </NuxtLink>
        </div>

        <!-- Navigation Links with Flex-grow -->
        <div class="flex-grow flex flex-col space-y-6">
          <NuxtLink to="/Instructor/HomePage" class="nav-link">
            🏠 Home
          </NuxtLink>
          <NuxtLink to="/Instructor/Availability" class="nav-link">
            📅 Availability
          </NuxtLink>
          <NuxtLink to="/Instructor/StudentAnalysis" class="nav-link">
            📝 Student Analysis
          </NuxtLink>
        </div>


        <!-- Profile link flushed to the bottom -->
        <div class="mt-auto">
          <NuxtLink to="/Instructor/Profile" class="nav-link">
            Profile
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content flex-1 p-8 transition-all duration-300 ease-in-out" :class="menuOpen ? 'ml-64' : 'ml-0 md:ml-64'">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
.nav-link {
  @apply text-[var(--muted-foreground)] text-lg py-3 transition-all ease-in-out;
}

.nav-link:hover {
  @apply text-[var(--foreground)] translate-x-1;
}
</style>
