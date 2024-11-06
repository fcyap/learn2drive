<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "~/stores/UseAuth";


const authStore = useAuthStore();

const logout = async () => {
    console.log("Logging out");
    // Add logout logic here
    authStore.clearUserId();
    await navigateTo("/");
};
</script>

<template>
  <Card>
    <Button variant="destructive" class="w-full" onClick="logout()">Logout</Button>
  </Card>
</template>
