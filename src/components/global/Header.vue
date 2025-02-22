<template>
  <header class="bg-white w-full h-20 px-6 fixed top-0 z-50 shadow-sm flex">
    <RouterLink to="/" class="w-full h-full flex items-center">
      <ChipIcon />
      <span class="text-primary text-lg md:text-xl flex items-center">
        Syca<span class="font-bold">more</span>
      </span>
    </RouterLink>
    <!-- <div class="date-time">Date/Time</div>s -->
  </header>
</template>

<script setup lang="ts">
import { ChipIcon } from "@/components/icons";
</script>
