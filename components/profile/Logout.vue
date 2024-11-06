<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLocalStorage } from '@vueuse/core';

const userId = useLocalStorage('userId', null); // 'userId' is the key, and `null` is the default value



const logout = async () => {
    console.log("Logging out");
    // Add logout logic here
    userId.value = null;
    await navigateTo("/");
};
</script>

<template>
  <Card>
    <Button variant="destructive" class="w-full" onClick="logout()">Logout</Button>
  </Card>
</template>
