<script setup>
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator'
import { useLocalStorage } from '@vueuse/core';

const supabase = useSupabaseClient();
// To get the current user ID
const id = useLocalStorage('userId', null); // 'userId' is the key, and `null` is the default value
const oldPassword = ref('');
const newPassword = ref('');


const changePW = async () => {
  if (id) {
    const { data, error } = await supabase
      .from('profiles_duplicate')
      .select('password')
      .eq('id', id.value)
      .single();

    if (error) {
      console.error("Error fetching current password:", error);
      return;
    }

    var currentPassword = data.password;

    if (currentPassword != oldPassword.value) {
      console.error("Passwords do not match");
      return;
    }
    else {
      const { data, error } = await supabase
        .from('profiles_duplicate')
        .update({ password: newPassword.value })
        .eq('id', id.value);

      console.log("Password updated successfully");
    }


  } else {
    console.error("User ID is null");
  }
  
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
      <div>
        <form>
        <div class="col-span-1 gap-2">
          <Label for="oldPassword">Current Password</Label>
          <Input id="oldPassword" type="text" v-model="oldPassword" placeholder="" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="newPassword">New Password</Label>
          <Input id="newPassword" type="text" v-model="newPassword" placeholder="" />
        </div>
        <div style="margin-top: 4%; text-align: center">
          <Button type="submit" id="submit" @click="changePW" class="btn btn-primary">Change Password</Button>
        </div>
        </form>
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
