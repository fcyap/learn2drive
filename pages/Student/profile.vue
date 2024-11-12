<script setup lang="ts">
definePageMeta({
  layout: "studentview",
});

import Container from "@/components/profile/Container.vue";
import EditAccount from "@/components/profile/EditAccount.vue";
import SecurityStudent from "~/components/profile/Student/SecurityStudent.vue";
import Logout from "~/components/profile/Logout.vue";
</script>

<template>
  <head>
    <title>Profile</title>
  </head>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Profile</h2>
    <p class="text-muted-foreground">Manage your settings</p>
  </div>

  <div
    class="items-start justify-center gap-5 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-4"
  >
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <EditAccount />
      </Container>
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      
        <Container>
          <SecurityStudent />
        </Container>
      
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <Logout />
      </Container>
      </div>
  </div>
</template>
