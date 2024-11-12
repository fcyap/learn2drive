<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

import Container from "@/components/profile/Container.vue";
import EditAccount from "@/components/profile/EditAccount.vue";
import Security from "~/components/profile/Instructor/Security.vue";
import Logout from "~/components/profile/Logout.vue";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from 'vue-router';

const id = Number(useLocalStorage("userId", null).value);
if (id === null) {
  const router = useRouter();
  router.push("/");
}

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
    class="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-4"
  >
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <EditAccount />
      </Container>
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
        <Container>
          <Security />
        </Container>
    </div>
    <div class="col-span-2 grid items-start gap-6 lg:col-span-3">
      <Container>
        <Logout />
      </Container>
    </div>
  </div>
</template>
