<template>
  <div className="w-screen h-screen relative overflow-hidden">
    <div className="w-full h-full flex flex-col">
      <Header />
      <div class="w-full h-full flex mt-20 overflow-hidden">
        <SideBar />
        <div class="w-full h-full bg-secondary">
          <div class="space-pad w-full h-[calc(100%-2rem)] overflow-auto">
            <router-view />
          </div>
          <footer class="py-1 px-5 lg:px-7 h-8 text-[0.625rem] flex items-center justify-end space-x-0.5">
            <span>Inspiration From:</span>
            <a
              class="text-primary"
              href="https://www.behance.net/gallery/211291667/user-management-%28-UI-design-%29#"
              >Behance</a
            >
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Header, SideBar } from "./components/global";
</script>
