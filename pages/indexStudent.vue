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
            Master Driving with Learn2Drive
          </h2>
          <p class="text-xl mb-8 text-gray-600 animate-fade-in-up">
            Your journey to becoming a confident driver starts here
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

      <!-- Features Section -->
      <section
        id="features"
        class="min-h-screen flex items-center py-20 bg-white"
      >
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold mb-12 text-center text-blue-800">
            Why Choose Learn2Drive?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div
              v-for="(feature, index) in features"
              :key="index"
              :ref="(el) => (featureRefs[index] = el)"
              :class="[
                'bg-slate-50 rounded-lg p-6 shadow-md transition-all duration-700 transform opacity-0 translate-y-4',
                {
                  'opacity-100 translate-y-0': featuresInView[index],
                },
              ]"
            >
              <div v-html="feature.icon" class="text-4xl mb-4"></div>
              <h3 class="text-xl font-semibold mb-2 text-slate-700">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section
  id="how-it-works"
  class="min-h-screen flex items-center py-20 bg-slate-50"
>
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold mb-12 text-center text-blue-800">
      How It Works
    </h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div
        v-for="(step, index) in howItWorks"
        :key="index"
        :ref="(el) => (stepRefs[index] = el)"
        :class="[
          'bg-white rounded-lg p-6 shadow-md relative transition-all duration-700 transform opacity-0 translate-y-4',
          {
            'opacity-100 translate-y-0': stepsInView[index],
          },
        ]"
      >
        <div
          class="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
        >
          {{ index + 1 }}
        </div>
        <h3 class="text-xl font-semibold mb-2 text-slate-700 mt-4">
          {{ step.title }}
        </h3>
        <p class="text-gray-600">{{ step.description }}</p>
      </div>
    </div>
  </div>
</section>

    </main>

    <footer class="bg-slate-800 text-white py-8">
      <div class="container mx-auto px-6 text-center">
        <p>
          &copy; {{ new Date().getFullYear() }} Learn2Drive. All rights
          reserved.
        </p>
      </div>
    </footer>

    <!-- Auth Modal -->
    <teleport to="body">
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
                type="password"
                placeholder="Enter your password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            <button
              type="submit"
              class="w-full px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-all duration-300"
            >
              {{ isLogin ? "Login" : "Sign Up" }}
            </button>
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
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const scrollY = ref(0);
const showAuthModal = ref(false);
const isLogin = ref(true);

const features = [
  {
    title: "Seamless Booking",
    description:
      "Choose your preferred instructor and book lessons with flexibility that fits your schedule.",
    icon: '<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
  },
  {
    title: "Track Your Progress",
    description:
      "Monitor your driving journey with detailed progress reports and skill assessments.",
    icon: '<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
  },
  {
    title: "Learning Resources",
    description:
      "Access a wealth of study materials and practice tests to help you pass your driving exam with ease.",
    icon: '<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
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

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const handleSubmit = () => {
  // Handle form submission
  console.log("Form submitted", isLogin.value ? "Login" : "Sign Up");
  showAuthModal.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
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
}
</style>
