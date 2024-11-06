<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit.prevent="handleSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email">Email</Label>
          <Input id="email" placeholder="Email" type="email" v-model="email"/>
          <Input id="password" placeholder="Password" type="password" v-model="password" />
        </div>
        I am a
        <p></p>
      </div>

      <div class="flex flex-col md:flex-row gap-4"> 
      <NuxtLink to="/Instructor/homePage" class="w-full md:w-1/2">
        <Button variant="outline" type="button" class="w-full">
          Instructor
        </Button>
      </NuxtLink>

      <NuxtLink to="/Student/homePage" class="w-full md:w-1/2">
        <Button variant="outline" type="button" class="w-full">
          Student
        </Button>
      </NuxtLink>
    </div>

    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <!-- <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or sign up
        </span>
      </div> -->
    </div>
    <p>Not a member? Sign up <NuxtLink to="/Login/Signup" class="nav-link" style="text-decoration: underline; color: blue">here!</NuxtLink></p>
    
  </div>
</template>

<script setup lang="ts">

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const response = await axios.post('login', {
    email: email.value,
    password: password.value,
  });

  localStorage.setItem('token', response.data.token);
}

</script>
