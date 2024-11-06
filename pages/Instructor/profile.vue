<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

import Container from "@/components/profile/Container.vue";
import EditAccount from "@/components/profile/EditAccount.vue";
import Notifications from "~/components/profile/Instructor/Notifications.vue";
import Security from "~/components/profile/Instructor/Security.vue";
import Logout from "~/components/profile/Logout.vue";
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Profile</h2>
    <p class="text-muted-foreground">Manage your settings</p>
  </div>

  <div
    class="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-4"
  >
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <EditAccount />
      </Container>
    </div>
    <div class="grid items-start gap-6 lg:col-span-2">
      <div class="col-span-2">
        <Container>
          <Security />
        </Container>
      </div>
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
      <Container>
        <Notifications />
      </Container>
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <Logout />
      </Container>
    </div>
  </div>
</template>
