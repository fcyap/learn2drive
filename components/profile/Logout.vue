<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

const userId = useLocalStorage('userId', null);
const router = useRouter();

const logout = async () => {
    console.log("Logging out");
    userId.value = null;
    await router.push("/");
};
</script>

<template>
  <Card>
    <Button variant="destructive" class="w-full" @click="logout">Logout</Button>
  </Card>
</template>
