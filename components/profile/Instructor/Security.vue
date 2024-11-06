<script setup lang="ts">
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '~/stores/UseAuth'
interface Profile {
  password: string;
}

const supabase = useSupabaseClient<Profile>();
const authStore = useAuthStore()
// To get the current user ID
console.log(authStore.userId)
const id = authStore.userId

const changePW = async () => {
  if (id) {
    const { data, error } = await supabase
      .from('profiles_duplicates')
      .select('password')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching current password:", error);
      return;
    }

    var currentPassword = data.password;

  } else {
    console.error("User ID is null");
  }
  const newPassword = ref('');

  const updatePassword = async () => {
    
    let currentPasswordInput = document.getElementById('lname');

    if (currentPassword != currentPasswordInput) {
      console.error("Passwords do not match");
      return;
    }

    const newPasswordElement = document.getElementById('fname') as HTMLInputElement;
    const newPassword = newPasswordElement.value;
    if (newPassword && id){
      const { data, error } = await supabase
        .from('profiles_duplicates')
        .update({ password: newPassword })
        .eq('id', id);
    
    if (error) {
      console.error("Error updating password:", error);
    } else {
      console.log("Password updated successfully");
    }
    }
  };
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle>Privacy & Security</CardTitle>
      <CardDescription>
        Keep your account secure
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1 gap-2">
          <Label for="lname">Password</Label>
          <Input id="lname" type="text" placeholder="" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="fname">Confirm Password</Label>
          <Input id="fname" type="text" placeholder="" />
        </div>
        <div style="margin-top: 4%">
          <Button type="submit" id="submit" @click="changePW" class="btn btn-primary">Change Password</Button>
        </div>
      </div>
    </CardContent>
    <Separator />
    <CardHeader class="pb-6">
      <CardTitle>Students can view:</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-6">
      <div class="flex items-center justify-between space-x-2">
        <Label for="necessary" class="flex flex-col space-y-1">
          <span>Your Photo</span>
          <span class="font-normal leading-snug text-muted-foreground">
            A profile picture helps personalise your account
          </span>
        </Label>
        <Switch id="photo" default-checked />
      </div>
      <div class="flex items-center justify-between space-x-2">
        <Label for="functional" class="flex flex-col space-y-1">
          <span>Your Phone Number</span>
          <span class="font-normal leading-snug text-muted-foreground">
            Allow students to contact you directly
          </span>
        </Label>
        <Switch id="phone_number" />
      </div>
    </CardContent>
  </Card>
</template>
