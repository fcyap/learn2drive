<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <header
      class="fixed top-0 left-0 right-0 bg-white bg-opacity-90 shadow-md z-50 transition-all duration-300"
      :class="{ 'py-2': scrollY > 50, 'py-4': scrollY <= 50 }"
    >
      <nav class="container mx-auto px-6 flex justify-between items-center">
        <h1
          class="text-2xl font-bold text-slate-600 transition-all duration-300"
          :class="{ 'text-xl': scrollY > 50 }"
        >
          Learn2Drive
        </h1>
        <button
          @click="showAuthModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-slate-700 transition-all duration-300"
        >
          Sign Up / Login
        </button>
      </nav>
    </header>
    <main>
      <!-- Hero Section -->
      <section
        class="min-h-screen flex items-center justify-center relative overflow-hidden animation-delay-300"
      >
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-5xl font-bold mb-4 text-blue-800 animate-fade-in-up">
            Driving with Learn2Drive
          </h2>
          <p class="text-xl mb-8 text-gray-600 animate-fade-in-up">
            Your One-Stop Platform for Instructors and Students
          </p>
          <button
            @click="showAuthModal = true"
            class="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-slate-700 transition-all transform hover:scale-105 animate-fade-in-up"
          >
            Get Started
            <span class="ml-2">→</span>
          </button>
          <div
            class="absolute bottom-0 left-[25vw] transform animate-fade-in-up"
            :style="{
              transform: `translateX(${((scrollY % 1000) / 1000) * 50}vw)`,
            }"
          >
            <div class="w-32 h-16 bg-blue-500 bottom-2 rounded-t-full relative">
              <div
                class="absolute top-2 left-2 right-2 h-6 bg-slate-400 rounded-t-full"
              ></div>
              <div
                class="absolute -bottom-6 left-4 w-6 h-6 bg-gray-800 rounded-full"
              ></div>
              <div
                class="absolute -bottom-6 right-4 w-6 h-6 bg-gray-800 rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </section>
      <!-- User Section -->
      <section
        class="min-h-screen flex items-center justify-center py-20 bg-gray-50"
      >
        <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <h2
            class="text-4xl font-bold mb-12 text-center text-blue-800 md:col-span-2"
          >
            Our Users
          </h2>
          <!-- Students Card -->
          <div @click="showAuthModal = true"
            class="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden hover:-translate-y-2 transition-transform duration-300 ease-in-out"
          >
            <div class="absolute top-6 right-6">
              <button class="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 6.75L6.75 17.25M6.75 6.75l10.5 10.5"
                  />
                </svg>
              </button>
            </div>
            <h3 class="text-3xl font-semibold text-slate-700 mb-4">Students</h3>
            <p class="text-gray-600 mb-6">
              A platform for learners to manage their driving lessons, track
              progress, and connect with instructors.
            </p>
            <div
              class="rounded-lg overflow-hidden shadow-lg border bg-white p-4"
            >
              <div class="flex space-x-4">
                <img
                src="../public/externalFiles/images/Student Dashboard.jpg"
                alt="Students Snapshot 1"
                  class="w-1/2 h-40 object-contain object-center"
                />
                <img
                src="../public/externalFiles/images/Instructor Dashboard.jpg"
                alt="Students Snapshot 2"
                  class="w-1/2 h-40 object-contain object-center"
                />
              </div>
              <div class="pt-4">
                <h4 class="font-semibold text-gray-700">Lesson Schedule</h4>
                <p class="text-sm text-gray-500">
                  Easily view and manage your upcoming driving lessons with a
                  streamlined calendar interface.
                </p>
              </div>
            </div>
            <button @click="showAuthModal = true"
              class="absolute top-6 right-6 bg-white text-blue-600 rounded-full p-3 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5L19.5 10.5m-6 0L7.5 16.5m6-6h6M7.5 10.5h6"
                />
              </svg>
            </button>
          </div>
          <!-- Instructors Card -->
          <div @click="showAuthModal = true"
            class="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden hover:-translate-y-2 transition-transform duration-300 ease-in-out"
          >
            <div class="absolute top-6 right-6">
              <button class="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 6.75L6.75 17.25M6.75 6.75l10.5 10.5"
                  />
                </svg>
              </button>
            </div>
            <h3 class="text-3xl font-semibold text-slate-700 mb-4">
              Instructors
            </h3>
            <p class="text-gray-600 mb-6">
              A tool for driving instructors to manage schedules, track student
              progress, and optimize lesson plans.
            </p>
            <div
              class="rounded-lg overflow-hidden shadow-lg border bg-white p-4"
            >
              <div class="flex space-x-4">
                <img
                  src="../public/externalFiles/images/Student Dashboard.jpg"
                  alt="Students Snapshot 1"
                  class="w-1/2 h-40 object-contain object-center"
                />
                <img
                  src="../public/externalFiles/images/Instructor Dashboard.jpg"
                  alt="Students Snapshot 2"
                  class="w-1/2 h-40 object-contain object-center"
                />
              </div>
              <div class="pt-4">
                <h4 class="font-semibold text-gray-700">Lesson Schedule</h4>
                <p class="text-sm text-gray-500">
                  Easily view and manage your upcoming driving lessons with a
                  streamlined calendar interface.
                </p>
              </div>
            </div>
            <button
            class="absolute top-6 right-6 bg-white text-orange-600 rounded-full p-3 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5L19.5 10.5m-6 0L7.5 16.5m6-6h6M7.5 10.5h6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section
        class="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center justify-center relative overflow-hidden px-10 bg-gradient-to-b from-blue-50 to-white"
      >
        <!-- Carousel Section on the Left -->
        <div class="flex justify-center w-full px-4 py-8 order-2 md:order-1">
          <Carousel class="relative w-full max-w-l" :plugins="[plugin]">
            <CarouselContent>
              <CarouselItem
                v-for="(card, index) in cards"
                :key="index"
                class="pl-1 md:basis-full lg:basis-2/5"
              >
                <div class="p-4">
                  <Card
                    :class="[card.bgColor, 'w-fit h-96 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out']"
                  >
                    <CardContent
                      class="flex flex-col items-center justify-center p-6"
                    >
                    <div v-html="card.icon"></div>
                      <h2 class="text-xl font-bold mt-4 text-center">
                        {{ card.title }}
                      </h2>

                      <p
                        v-if="card.highlight"
                        class="text-5xl font-extrabold mt-2"
                      >
                        {{ card.highlight }}
                      </p>

                      <p class="text-sm mt-2 text-center">
                        {{ card.description }}
                      </p>

                      <!-- Conditional Divider -->
                      <div v-if="card.showDivider" class="w-full my-4">
                        <hr class="border-t border-gray-300" />
                        <p
                          v-if="card.dividerText"
                          class="text-xs mt-2 text-center text-gray-500"
                        >
                          {{ card.dividerText }}
                        </p>
                      </div>

                      <div class="mt-4"></div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <!-- Text Section on the Right -->
        <div class="container mx-auto px-6 text-center md:text-right order-1 md:order-2">
          <h2 class="text-3xl md:text-5xl mb-4 text-blue-800 animate-fade-in-up">
            Providing better experiences,
            <br />connecting both <br />learners and instructors
          </h2>
          <p class="text-xl mb-8 text-gray-600 animate-fade-in-up">
            Communities run better with Learn2Drive.
          </p>
        </div>
      </section>
    </main>
    <footer class="bg-slate-800 text-white py-8">
      <div class="container mx-auto px-6 text-center">
        <p>&copy; {{ currentYear }} Learn2Drive. All rights reserved.</p>
      </div>
    </footer>
    <!-- Auth Modal -->
    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="showAuthModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg p-8 max-w-md w-full">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-slate-800">
                {{ isLogin ? "Login" : "Sign Up" }}
              </h2>
              <button
                @click="showAuthModal = false"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div v-if="!isLogin" class="space-y-2">
                <label for="name" class="block text-sm font-medium text-gray-700"
                  >Full Name</label
                >
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  placeholder="Enter your full name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div class="space-y-2">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Enter your password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div v-if="!isLogin" class="space-y-2">
                <label for="userType" class="block text-sm font-medium text-gray-700"
                  >User Type</label
                >
                <select
                  id="userType"
                  v-model="userType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <button
                type="submit"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
              >
                {{ isLogin ? "Login" : "Sign Up" }}
              </button>
              <div v-if="error" class="text-red-500 text-sm mt-2">
                {{ error }}
              </div>
            </form>
            <div class="mt-4 text-center">
              <button
                @click="isLogin = !isLogin"
                class="text-slate-600 hover:underline"
              >
                {{
                  isLogin
                    ? "Need an account? Sign up"
                    : "Already have an account? Login"
                }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>
<script setup>
import { useAuthStore } from '~/stores/UseAuth'
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'vue-router';
const supabase = useSupabaseClient();
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
const plugin = Autoplay({
  delay: 5000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
});
const router = useRouter();
const scrollY = ref(0);
const showAuthModal = ref(false);
const isLogin = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const userType = ref("student");let currentIndex = 0;


function updateCarousel() {
  const carousel = document.querySelector(".carousel");
  const itemWidth = carousel.querySelector(".carousel-item").offsetWidth;
  carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

function previousSlide() {
  const items = document.querySelectorAll(".carousel-item");
  currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
  updateCarousel();
}

function nextSlide() {
  const items = document.querySelectorAll(".carousel-item");
  currentIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
  updateCarousel();
}

const cards = [
  {
    title: "95% satisfaction rate among learners",
    description:
      "Our instructors are rated highly by students across all regions.",
    bgColor: "bg-blue-100",
    icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          `,
    showDivider: false,
    dividerText: "",
  },
  {
    title: "1,200+ lessons booked this month",
    description:
      "More learners are joining every day, connecting with top-rated instructors.",
    bgColor: "bg-slate-300",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-700">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
</svg>
`,
    showDivider: true,
    dividerText: "A monthly record of lessons booked.",
  },
  {
    title: 'Chester Y. - "Great experience!"',
    description:
      "Chester says his instructor was patient and helped him pass on his first try.",
    bgColor: "bg-blue-100",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-700">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
</svg>
`,
    showDivider: false,
    dividerText: "",
  },
  {
    title: "80% pass rate on the first attempt",
    description:
      "Our instructors focus on essential skills, preparing learners for success.",
    bgColor: "bg-slate-300",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-700">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`,
    showDivider: true,
    dividerText: "Our success rate is higher than the average.",
  },
  {
    title: "150+ instructors available near you",
    description:
      "Find the perfect match from our experienced driving instructors.",
    bgColor: "bg-blue-100",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-700">
  <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
</svg>
`,
    showDivider: false,
    dividerText: "",
  },
];

const features = [
  {
    title: "Student",
    description:
      "Choose your preferred instructor and book lessons with flexibility that fits your schedule.",
    icon: '<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
  },
  {
    title: "Instructor",
    description:
      "Monitor your driving journey with detailed progress reports and skill assessments.",
    icon: '<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
  },
];

const howItWorks = [
  {
    title: "Sign Up",
    description: "Create your account",
  },
  {
    title: "Book Lessons",
    description:
      "Browse available instructors and schedule lessons that fit your calendar.",
  },
  {
    title: "Learn & Progress",
    description:
      "Take lessons, track your progress, and use our resources to improve your skills.",
  },
];

const featureRefs = Array(features.length).fill(null);
const stepRefs = Array(howItWorks.length).fill(null);

const featuresInView = ref(Array(features.length).fill(false));
const stepsInView = ref(Array(howItWorks.length).fill(false));

// Create intersection observer to observe elements
const createObserver = (refs, inViewArray) => {
  const options = { threshold: 0.01 };
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = refs.indexOf(entry.target);
      if (entry.isIntersecting) {
        inViewArray.value[index] = true;
      }
    });
  }, options);
};

onMounted(() => {
  const featureObserver = createObserver(featureRefs, featuresInView);
  const stepObserver = createObserver(stepRefs, stepsInView);

  featureRefs.forEach((el) => el && featureObserver.observe(el));
  stepRefs.forEach((el) => el && stepObserver.observe(el));
});
const error = ref(null);
const currentYear = computed(() => new Date().getFullYear());
const handleScroll = () => {
  scrollY.value = window.scrollY;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
const getNextId = async (userType) => {
  const { data, error } = await supabase
    .from('profiles_duplicate')
    .select('id')
    .eq('user_type', userType)
    .order('id', { ascending: false })
    .limit(1);
  if (error) {
    console.error("Error fetching last ID:", error);
    throw error;
  }
  if (data && data.length > 0) {
    const lastId = data[0].id;
    if (userType === 'instructor') {
      return Math.max(lastId, 0) + 1;
    } else {
      return Math.max(lastId, 100) + 1;
    }
  } else {
    return userType === 'instructor' ? 1 : 101;
  }
};
const handleSubmit = async () => {
  const authStore = useAuthStore();
  error.value = null;
  try {
    if (isLogin.value) {
      // Login
      console.log("Attempting to log in with:", { email: email.value });
      const { data, error: loginError } = await supabase
        .from('profiles_duplicate')
        .select('*')
        .eq('email', email.value)
        .eq('password', password.value)
        .single();
      if (loginError) {
        console.error("Login error:", loginError);
        throw new Error("Invalid email or password");
      }
      if (!data) {
        throw new Error("User not found");
      }
      console.log("Login successful, user data:", data);
      authStore.setUserId(data.id);
      console.log(authStore.userId);
      if (data.user_type === 'student') {
        await navigateTo(`/student/homepage`);
      } else if (data.user_type === 'instructor') {
        await navigateTo(`/instructor/homepage`);
      }
    } else {
      // Sign Up
      console.log("Attempting to sign up with:", { email: email.value, name: name.value, userType: userType.value });
      const nextId = await getNextId(userType.value);
      const { data, error: signUpError } = await supabase
        .from('profiles_duplicate')
        .insert({
          id: nextId,
          name: name.value,
          email: email.value,
          password: password.value,
          user_type: userType.value,
        })
        .select();
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      console.log("Sign up successful, user data:", data);
      authStore.setUserId(nextId)
      if (data && data.length > 0) {
        authStore.setUserId(data[0].id);
        if (userType.value === 'student') {
          await navigateTo(`/student/homepage?id=${data[0].id}`);
        } else if (userType.value === 'instructor') {
          await navigateTo(`/instructor/homepage?id=${data[0].id}`);
        }
      } else {
        throw new Error("Failed to create user");
      }
    }
    showAuthModal.value = false;
  } catch (err) {
    console.error('Error in handleSubmit:', err);
    error.value = err instanceof Error ? err.message : "An unexpected error occurred";
  }
};
</script>
<style>
@keyframes fadeInOpenUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px); /* Start slightly smaller and below */
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0); /* End at full size and in position */
  }
}

.animate-fade-in-open-up {
  animation: fadeInOpenUp 1.5s ease-out;
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

.animate-fade-in-left {
  animation: fadeInLeft 1s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 1s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}</style>