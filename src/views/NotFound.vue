<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="text-red-500 flex text-9xl font-bold">
      4
      <ExclamationTriangle class="w-24 h-24" />
      4
    </div>
    <h1 class="text-lg font-bold">Not Found</h1>
    <p class="text-sm text-[#263238] mb-3">This page does not exist</p>
    <RouterLink
      to="/"
      class="bg-primary text-white p-3 w-full max-w-32 flex items-center justify-center rounded-md font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all ease-in-out duration-100"
      >Go Back</RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangle } from "../components/icons";
</script>
