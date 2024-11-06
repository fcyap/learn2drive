<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const salesData = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    fallback: "OM",
    amount: "$90.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    fallback: "JL",
    amount: "$70.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    fallback: "IN",
    amount: "$80.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    fallback: "WK",
    amount: "$80.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    fallback: "SD",
    amount: "$70.00",
  },
];
</script>

<template>
  <Card class="col-span-1 h-100">
    <CardHeader>
      <CardTitle>Recent Sales</CardTitle>
      <CardDescription> You made 265 sales this month. </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-8">
        <div v-for="(sale, index) in salesData" :key="index" class="flex items-center">
          <Avatar class="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>{{ sale.fallback }}</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">{{ sale.name }}</p>
            <p class="text-sm text-muted-foreground">{{ sale.email }}</p>
          </div>
          <div class="ml-auto font-medium">{{ sale.amount }}</div>
        </div>
      </div>
    </CardContent>
  </Card>
    
</template>

