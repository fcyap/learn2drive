<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalStorage } from '@vueuse/core';

interface Profile {
  last_name: string;
  first_name: string;
  email: string;
  password: string;
}

const supabase = useSupabaseClient<Profile>();
// To get the current user ID
const id = useLocalStorage('userId', null); // 'userId' is the key, and `null` is the default value
const lastName = ref('');
const firstName = ref('');
const email = ref('');
const phoneNumber = ref('');

// get current information
if(id.value){
const { data, error} = await supabase
  .from('profiles_duplicates')
  .select('*')
  .eq('id', id.value)
  .single()

  if(error || !data) {
    console.error(error)
  } else {

  email.value = data.email
  lastName.value = data.name.split(' ')[1];
  firstName.value = data.name.split(' ')[0]
  phoneNumber.value = data.phone_number
  }
}

const updateProfile = async () => {

  if (id.value) {
    const fullName = `${firstName.value} ${lastName.value}`;
    const { error } = await supabase
      .from('profiles_duplicates')
      .update({
        name: fullName,
        email: email.value,
        phone_number: phoneNumber.value
      })
      .eq('id', id.value);
    
    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Profile updated successfully');
    }
  } else {
    console.error('User ID is null');
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

      <div class="grid md:grid-cols-2 gap-6 grid-cols-1 ">
        <div class="col-span-1 gap-2">
          <Label for="lname">Last Name</Label>
            <Input id="lname" type="text" v-model="lastName" :placeholder="lastName" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="fname">First Name</Label>
          <Input id="fname" type="text" v-model="firstName" :placeholder="firstName" />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 grid-cols-1">
        <div class="col-span-1 gap-2">
          <Label for="email" class="col-span-2">Email</Label>
          <Input id="email" type="email" v-model="email" :placeholder="email" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="number" class="col-span-2">Phone Number</Label>
          <Input id="phonenumber" type="number" :placeholder="phoneNumber" v-model="phoneNumber"/>
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
