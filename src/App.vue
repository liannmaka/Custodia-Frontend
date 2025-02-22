<template>
  <div className="w-screen h-screen relative overflow-hidden">
    <div className="w-full h-full flex flex-col">
      <Header />
      <div class="w-full h-full flex mt-20 overflow-hidden">
        <SideBar :active="active" @close-sidebar="handleSidebarToggle" />
        <div class="relative w-full h-full bg-secondary">
          <button
            :class="[
              'lg:hidden fixed top-24 left-6 py-0.5 px-1 text-primary bg-primary/10 rounded-sm z-10 backdrop-blur-sm',
              active && 'hidden',
            ]"
            @click="handleSidebarToggle"
          >
            <Menu class="w-5 h-5" />
          </button>
          <div
            class="space-pad mt-8 lg:mt-0 w-full h-[calc(100%-2rem)] overflow-auto"
          >
            <RouterView />
          </div>
          <footer
            class="py-1 px-5 lg:px-7 h-8 text-[0.625rem] flex items-center justify-end space-x-0.5"
          >
            <span>Inspiration From:</span>
            <a
              class="text-primary"
              href="https://www.behance.net/gallery/211291667/user-management-%28-UI-design-%29#"
              target="_blank"
              rel="noopener noreferrer"
              >Behance</a
            >
          </footer>
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
