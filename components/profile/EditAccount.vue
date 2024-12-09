<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

const currentId = Number(useLocalStorage("userId", null).value);
if (currentId === null) {
  const router = useRouter();
  router.push("/");
}

const supabase = useSupabaseClient();
// To get the current user ID
const id = useLocalStorage('userId', null); // 'userId' is the key, and `null` is the default value
const fullName = ref('');
const email = ref('');
const contact_no = ref('');
const user_type = ref('');
const selectedFile = ref(null);
const location = ref('');
var profilePic = ref('');
const rates = ref('');


// get current information
if(id.value){
const { data, error} = await supabase
  .from('profiles_duplicate')
  .select('*')
  .eq('id', id.value)
  .single()

  if(error || !data) {
    console.error(error)
  } else {

  email.value = data.email
  fullName.value = data.name
  contact_no.value = data.contact_no
  user_type.value = data.user_type
  location.value = data.location
  rates.value = data.rates
  }

  if (user_type.value == 'student') {

    const supabaseUrl = "https://tzklhzyswqmorhokvgmw.supabase.co";
    const bucketPath = "new_profile_photos";
    profilePic = `${supabaseUrl}/storage/v1/object/public/${bucketPath}/${id.value}.jpg`;
  
  } else {
  
    const supabaseUrl = "https://tzklhzyswqmorhokvgmw.supabase.co";
    const bucketPath = "instructor_photos";
    profilePic = `${supabaseUrl}/storage/v1/object/public/${bucketPath}/${id.value}.png`;

  } 

}

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0];
  console.log("Selected file:", selectedFile.value);
};

const deletePic = async() => {
  if(id.value){
    if (user_type.value == 'student') {
      const { data, error} = await supabase
      .storage
      .from('new_profile_photos')
      .remove(['new_profile_photos/' + id.value + '.jpg'])
    } else {
      const { data, error} = await supabase
      .storage
      .from('instructor_photos')
      .remove(['instructor_photos/' + id.value + '.png'])
    }
  }
}


const updateProfile = async () => {

  if (id.value) {
    const { error } = await supabase
      .from('profiles_duplicate')
      .update({
        name: fullName.value,
        email: email.value,
        contact_no: contact_no.value,
        location: location.value,
        rates: rates.value
      })
      .eq('id', id.value);
    
    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Profile updated successfully');
    }

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
          <img
                  class="rounded-full h-28 w-28 mb-4"
                  :src=profilePic
                  alt="Photo"
          />
          <div>
            <h4 class="text-m font-bold tracking-tight">Profile Picture</h4>
    
          </div>
        </div>

        
      </div>

       <div class="grid gap-6 grid-cols-1 ">
        <div class="col-span-1 gap-2">
          <Label for="fullName">Full Name</Label>
            <Input id="fullName" type="text" v-model="fullName" :placeholder="fullName" />
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

      <div class="grid md:grid-cols-2 gap-6 grid-cols-1">
        <div class="col-span-1 gap-2">
          <Label for="location" class="col-span-2">Location</Label>
          <Input id="location" type="text" v-model="location" :placeholder="location" />
        </div>
        <div v-if="user_type == 'instructor'">
        <div class="col-span-1 gap-2">
          <Label for="rates" class="col-span-2">Rates (2 hours)</Label>
          <Input id="rates" type="number" v-model="rates" :placeholder="rates" />
        </div>
      </div>
      </div>

      <div style="margin-top: 4%; text-align: center">
        <Button type="submit" id="submit" @click="updateProfile" class="btn btn-primary">Update Profile</Button>
      </div>
      
    </CardContent>
  </Card>
</template>
