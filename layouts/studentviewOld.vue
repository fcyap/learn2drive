<template>
  <div class="side-navbar-container flex">
    <!-- Hamburger menu button for mobile view -->
    <button class="hamburger md:hidden p-4 fixed top-2.5 left-0 z-50 bg-white rounded-full shadow-lg" @click="toggleMenu">
      <!-- SVG Icon for Hamburger -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dark" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>


    <!-- Sidebar Navigation -->
    <nav :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      class="side-navbar fixed top-0 left-0 h-full w-64 shadow-md z-40 md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div class="flex flex-col h-full py-8 px-6">
        <!-- Project Title -->
        <div class="mb-10 flex justify-center">
          <NuxtLink to="/" class="text-3xl font-bold text-white hover:text-primary">
            Edu²
          </NuxtLink>
        </div>


        <!-- Navigation Links with Flex-grow -->
        <div class="flex-grow flex flex-col space-y-6">
          <NuxtLink to="/Student/homePage" class="nav-link">
            🏠 Home
          </NuxtLink>
          <NuxtLink to="/Student/bookingPage" class="nav-link">
            📅 Booking
          </NuxtLink>
          <NuxtLink to="/Student/resourcesPage" class="nav-link">
            📚 Resources
          </NuxtLink>
          <NuxtLink to="/Student/instructorReview" class="nav-link">
            📝 Instructor Review
          </NuxtLink>
        </div>

        <!-- Profile link flushed to the bottom -->
        <div class="mt-auto">
          <NuxtLink to="/Student/profile" class="nav-link">
            Profile
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content flex-1 p-8 transition-all duration-300 ease-in-out"
      :class="menuOpen ? 'ml-64' : 'ml-0 md:ml-64'">
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
/* Navbar styling */
.side-navbar {
  background-color: #45395e;
  /* Darker color */
  color: #ffffff;
  /* White text for readability */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  /* Soft shadow */
  transition: background-color 0.3s ease;
  /* Smooth transition for hover */
}

.side-navbar:hover {
  background-color: #524473;
  /* Slightly lighter on hover */
}

/* Hamburger Menu Styling */
.hamburger {
  margin-top: 8px;
  font-size: 2rem;
  color: #000000;
  cursor: pointer;
  z-index: 50;
}

/* Project Title */
.side-navbar .text-3xl {
  font-family: 'Poppins', sans-serif;
  /* Clean font */
  font-weight: 600;
}

/* Navigation Link Styling */
.nav-link {
  color: #c2c2d2;
  /* Softer gray for the links */
  font-size: 1.3rem;
  /* Increased font size */
  font-family: 'Poppins', sans-serif;
  padding: 12px 0;
  /* Slightly increased padding for better touch targets */
  transition: color 0.2s ease, transform 0.2s ease;
  /* Smooth hover transition */
}

.nav-link:hover {
  color: #ffffff;
  /* Bright white text on hover */
  transform: translateX(5px);
  /* Slight move to the right on hover */
}

/* Content area styling */
.content {
  margin-left: 16rem;
  /* Ensure content is properly aligned for larger screens */
}

@media (max-width: 768px) {

  /* Adjustments for mobile screens */
  .side-navbar {
    width: 16rem;
  }

  .content {
    margin-left: 0;
    /* No margin on mobile when sidebar is hidden */
  }

  .side-navbar-container .content {
    padding-left: 1rem;
    /* Add padding to the main content */
  }

  .side-navbar-container .nav-link {
    font-size: 1.1rem;
    /* Slightly smaller font on mobile */
    padding: 10px 0;
  }

  /* Adjust the positioning to ensure it's responsive */
  .side-navbar {
    max-width: 40%;
    /* Sidebar takes up only part of the screen */
  }
}
</style>
