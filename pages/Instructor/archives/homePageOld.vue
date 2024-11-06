<script setup lang="ts">
definePageMeta({
  layout: "instructorview",
});

import Overview from "@/components/dashboard/Overview.vue";
import RecentSales from "@/components/dashboard/RecentSales.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from "@/components/dashboard/Notifications.vue";
import Summary from "@/components/dashboard/Summary.vue";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Cal from "@/components/dashboard/Cal.vue";
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
    <p class="text-muted-foreground">See your breakdown</p>
  </div>
  <div class="hidden flex-col md:flex">
    <div class="flex-1 space-y-4 pt-6">
      <Tabs default-value="overview" class="space-y-4">
        <TabsList>
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            <Badge variant="destructive" class="rounded-full px-2 py-1">
              3
            </Badge>
            <!-- need to change the number to a counter -->
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" class="space-y-4">
          <Summary />
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card class="px-20 h-100">
              <Carousel>
              <CarouselContent>

                <CarouselItem>
                  <Overview />

                </CarouselItem>

                <CarouselItem>
                  <Cal />
                </CarouselItem>

              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            </Card>
            <RecentSales />
          </div>
        </TabsContent>

        <TabsContent value="notifications" class="space-y-4">
          <Summary />
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card class="col-span-3">
              <CardHeader>
                <CardTitle>Review</CardTitle>
                <CardDescription>
                  Please complete the following reviews for students!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Notifications />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
<style scoped>
/* Add any homepage-specific styling */
</style>
