<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalStorage } from '@vueuse/core';


const supabase = useSupabaseClient();
// To get the current user ID
const id = useLocalStorage('userId', null); // 'userId' is the key, and `null` is the default value
const lastName = ref('');
const firstName = ref('');
const email = ref('');
const contact_no = ref('');
const user_type = ref('');
const selectedFile = ref(null);

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
  lastName.value = data.name.split(' ')[-1];
  firstName.value = data.name.split(' ').slice(0, -1).join(',')
  contact_no.value = data.contact_no
  user_type.value = data.user_type
  }

  if (user_type.value == 'student') {
    const { data, error} = await supabase
    .storage
    .from('new_profile_photos')
    .download('new_profile_photos/' + id.value + '.jpg')
  } else {
    const { data, error} = await supabase
    .storage
    .from('instructor_phots')
    .download('instructor_photos/' + id.value + '.png')
  } 
}

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0];
  console.log("Selected file:", selectedFile.value);
};

const updateProfile = async () => {

  if (id.value) {
    const fullName = `${firstName.value} ${lastName.value}`;
    const { error } = await supabase
      .from('profiles_duplicates')
      .update({
        name: fullName,
        email: email.value,
        contact_no: contact_no.value
      })
      .eq('id', id.value);
    
    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Profile updated successfully');
    }

    const profilePic = selectedFile.value;
      if (id.value == "student" && profilePic){
        const { data, error } = await supabase
          .storage
          .from('new_profile_photos')
          .update(`public/${profilePic}`, profilePic, {
            cacheControl: '3600',
            upsert: true,
          })}
      else{
        if (profilePic){
        const { data, error } = await supabase
          .storage
          .from('instructor_photos')
          .update(`public/${profilePic}`, profilePic, {
            cacheControl: '3600',
            upsert: true,
          })
        }
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
            <p class="text-muted-foreground">PNG, JPEG under 15mb</p>
          </div>
        </div>

        
      </div>

      <div class="grid md:grid-cols-2 gap-6 grid-cols-1 ">
        <div class="col-span-1 gap-2">
          <label for="profilePic" class="block text-sm font-medium text-gray-700"
            >Update Profile Pic</label>
          <input
            id="profilePic"
            type="file"
            @change="onFileSelected"
          />
        </div>
      </div>
        <div class="grid md:grid-cols-4 gap-6 grid-cols-1">
          <Button variant="secondary" @click="delete"> Delete </Button>
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
          <Input id="contact_no" type="number" :placeholder="contact_no" v-model="contact_no"/>
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
