<template>
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="offcanvas" class="bg-slate-900 w-64 hidden md:block">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" class="px-6 py-4">
                <span class="text-2xl font-bold text-white">Learn2Drive</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild class="px-6 py-3">
                <NuxtLink to="/Student/homePage" class="text-slate-200 hover:text-white text-lg flex items-center">
                  <HomeIcon class="mr-3 h-5 w-5" />
                  Home
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild class="px-6 py-3">
                <NuxtLink to="/Student/bookingPage" class="text-slate-200 hover:text-white text-lg flex items-center">
                  <CalendarIcon class="mr-3 h-5 w-5" />
                  Booking
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
              <SidebarMenuButton asChild class="px-6 py-3">
                <NuxtLink to="/Student/resourcesPage" class="text-slate-200 hover:text-white text-lg flex items-center">
                  <BookOpenIcon class="mr-3 h-5 w-5" />
                  Resources
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
              <SidebarMenuButton asChild class="px-6 py-3">
                <NuxtLink to="/Student/instructorReview" class="text-slate-200 hover:text-white text-lg flex items-center">
                  <ClipboardIcon class="mr-3 h-5 w-5" />
                  Instructor Review
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
  
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild class="px-6 py-3">
                <NuxtLink to="/Student/profile" class="text-slate-200 hover:text-white text-lg flex items-center">
                  <UserIcon class="mr-3 h-5 w-5" />
                  Profile
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  
      <SidebarInset class="bg-white">
        <header class="flex items-center p-4 border-b md:hidden">
          <SidebarTrigger class="text-slate-900">
            <MenuIcon class="h-6 w-6" />
          </SidebarTrigger>
        </header>
        <main class="flex-1">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </template>
  
  <script setup>
  import { 
    BookOpen as BookOpenIcon,
    Calendar as CalendarIcon,
    Clipboard as ClipboardIcon,
    Home as HomeIcon,
    Menu as MenuIcon,
    User as UserIcon
  } from 'lucide-vue-next'
  
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
  } from '@/components/ui/sidebar'
  </script>
  
  <style scoped>
  :deep(.sidebar-menu-button) {
    @apply font-normal;
  }
  </style>