<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from '~/stores/UseAuth'
interface Profile {
  last_name: string;
  first_name: string;
  email: string;
  password: string;
}

const supabase = useSupabaseClient<Profile>();
const authStore = useAuthStore()
// To get the current user ID
console.log(authStore.userId)
const id = authStore.userId

const updateProfile = async () => {

  const lname = document.getElementById('lname')?.textContent || "";
  const fname = document.getElementById('fname')?.textContent || "";
  const email = document.getElementById('email')?.textContent || "";
  const phonenumber = document.getElementById('phonenumber')?.textContent || "";


  if (id) {
    const { error } = await supabase
        .from('profiles_duplicates')
        .update({
            last_name: lname,
            first_name: fname,
            email: email,
            phone_number: phonenumber
        })
        .eq('id', id);
    
  } else {
    console.error("User ID is null");
  }
}

</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle>Account</CardTitle>
      <CardDescription>
        Edit your personal details
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <Avatar class="size-28">
            <AvatarImage
              src="https://github.com/radix-vue.png"
              alt="@radix-vue"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4 class="text-m font-bold tracking-tight">Profile Picture</h4>
            <!-- <p class="text-muted-foreground">PNG, JPEG under 15mb</p> -->
          </div>
        </div>

        <!-- <div>
          <Button variant="outline" class="mr-2"> Upload new picture </Button>
          <Button variant="secondary"> Delete </Button>
        </div> -->
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1 gap-2">
          <Label for="lname">Last Name</Label>
          <Input id="lname" type="text" placeholder="" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="fname">First Name</Label>
          <Input id="fname" type="text" placeholder="" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="gap-2">
          <Label for="email" class="col-span-2">Email</Label>
          <Input id="email" type="email" placeholder="Email" />
        </div>
        <div class="gap-2">
          <Label for="number" class="col-span-2">Phone Number</Label>
          <Input id="phonenumber" type="number" placeholder="Phone number" />
        </div>
      </div>
      <div style="margin-top: 4%; text-align: center;">
          <Button type="submit" id="submit" @click="updateProfile" class="btn btn-primary">Update Profile</Button>
        </div>
      <div class="grid grid-cols-2 gap-6">
      </div>
      
    </CardContent>
  </Card>
</template>
