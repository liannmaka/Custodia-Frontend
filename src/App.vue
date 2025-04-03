<template>
  <div className="w-screen h-screen relative overflow-hidden">
    <div className="w-full h-full flex flex-col">
      <Header />
      <div class="w-full h-full flex mt-20 overflow-hidden">
        <SideBar :active="active" @close-sidebar="handleSidebarToggle" />
        <div class="relative w-full h-full bg-secondary overflow-auto scroller">
          <button
            :class="[
              'lg:hidden fixed top-24 left-6 py-0.5 px-1 text-primary bg-primary/10 rounded-sm z-10 backdrop-blur-sm hover:opacity-90 hover:-translate-y-0.5',
              active && 'hidden',
            ]"
            class="mb-8"
            @click="handleSidebarToggle"
          >
            <Menu class="w-5 h-5" />
          </button>
          <div
            class="space-pad mt-8 lg:mt-0 w-full h-full"
          >
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Header, SideBar } from "@/components/global";
import { Menu } from "@/components/icons";

const active = ref<boolean>(false);

const handleSidebarToggle = () => {
  active.value = !active.value;
};
</script>
