<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UserAuthForm from '~/pages/Login/Auth.vue'
import * as THREE from 'three'

definePageMeta({
  layout: false,
})

const isLoading = ref(false)
const error = ref('')
const threeContainer = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let car: THREE.Group
let road: THREE.Mesh
let animationFrameId: number

// Initialize Three.js scene
const initThree = () => {
  // Scene setup
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  
  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement)
  }

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Create stylized car (simplified geometry)
  car = new THREE.Group()
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4)
  const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2196f3 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  car.add(body)

  // Car roof
  const roofGeometry = new THREE.BoxGeometry(1.5, 0.8, 2)
  const roof = new THREE.Mesh(roofGeometry, bodyMaterial)
  roof.position.y = 0.9
  roof.position.z = -0.5
  car.add(roof)

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32)
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 })
  
  const wheels = [
    { x: -1.1, z: -1.2 },
    { x: 1.1, z: -1.2 },
    { x: -1.1, z: 1.2 },
    { x: 1.1, z: 1.2 }
  ]

  wheels.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos.x, -0.4, pos.z)
    car.add(wheel)
  })

  // Add car to scene
  car.position.set(0, 1, 0)
  scene.add(car)

  // Create road
  const roadGeometry = new THREE.PlaneGeometry(10, 20)
  const roadMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x444444,
    side: THREE.DoubleSide
  })
  road = new THREE.Mesh(roadGeometry, roadMaterial)
  road.rotation.x = Math.PI / 2
  road.position.y = 0
  scene.add(road)

  // Position camera
  camera.position.set(4, 4, 8)
  camera.lookAt(0, 0, 0)
}

// Animation loop
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  
  if (car) {
    // Gentle floating motion
    car.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.1
    car.rotation.y += 0.01
  }

  renderer.render(scene, camera)
}

// Handle window resize
const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// Lifecycle hooks
onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
  
  // Cleanup Three.js resources
  if (renderer) {
    renderer.dispose()
  }
})

const handleAuthLoad = (loading: boolean) => {
  isLoading.value = loading
}

const handleAuthError = (errorMessage: string) => {
  error.value = errorMessage
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Three.js container -->
    <div 
      ref="threeContainer" 
      class="absolute inset-0 -z-10"
    />

    <!-- Login content -->
    <div class="relative container min-h-screen grid lg:grid-cols-2 lg:px-0">
      <!-- Left Panel -->
      <div class="relative hidden lg:flex flex-col p-10 text-white">
        <div class="relative z-20 flex items-center text-lg font-medium">
          <svg
            class="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span class="font-bold tracking-tight">LEARN2DRIVE</span>
        </div>

        <!-- Content area with backdrop -->
        <div class="mt-auto relative z-20 space-y-6 backdrop-blur-sm bg-black/30 p-6 rounded-lg">
          <h2 class="text-xl font-semibold">Your journey to driving excellence starts here</h2>
          <p class="text-gray-200">
            Join thousands of successful drivers who started their journey with Learn2Drive. 
            Our comprehensive platform offers everything you need to master driving.
          </p>
        </div>
      </div>

      <!-- Right Panel / Login Form -->
      <div class="lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <!-- Error Alert -->
          <div 
            v-if="error" 
            class="flex items-center space-x-2 rounded-lg bg-red-50/90 p-3 text-sm text-red-600 backdrop-blur-sm"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Login Card -->
          <div class="backdrop-blur-md bg-white/90 p-6 rounded-lg space-y-6">
            <div class="flex flex-col space-y-2 text-center">
              <h1 class="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p class="text-sm text-gray-500">
                Sign in to continue your learning journey
              </p>
            </div>

            <!-- Auth Form Component -->
            <UserAuthForm 
              @loading="handleAuthLoad"
              @error="handleAuthError"
            />

            <!-- Terms -->
            <p class="text-center text-sm text-gray-500">
              By continuing, you agree to our
              <a href="/terms" class="underline underline-offset-4 hover:text-gray-900">
                Terms
              </a>
              and
              <a href="/privacy" class="underline underline-offset-4 hover:text-gray-900">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>