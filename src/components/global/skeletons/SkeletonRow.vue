<template>
  <tr v-for="row in rowCount" :key="row">
    <td v-for="col in columnCount" :key="col" class="px-2">
        <div class="h-[42px] bg-gray-200 animate-pulse rounded"></div>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ columnCount: number; rowCount?: number }>();
</script>


