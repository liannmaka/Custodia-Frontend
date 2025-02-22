<template>
  <div
    class="bg-white w-full min-w-[12rem] p-6 rounded-md shadow-md"
  >
    <div class="flex">
      <div class="flex flex-col space-y-3 mr-3">
        <div
          class="bg-gradient-to-br from-[#5b42db] to-[#4C33CC] size-10 flex justify-center items-center rounded-full"
        >
          <component
            :is="cardData.icon"
            class="w-5 h-5 text-white"
            stroke-width="2.3"
          />
        </div>
        <div :class="cardData.metricsColor" class="flex text-xs">
          <component
            :is="cardData.metricsIcon"
            class="w-[9px] h-[9px] self-center mr-1"
            stroke-width="2"
          />
          <span>{{ cardData.metricsPercent }}</span>
        </div>
      </div>
      <div>
        <span class="text-2xl font-bold font-jetbrains text-[#263238]">{{
          cardData.value
        }}</span>
        <h3 class="text-sm leading-3 text-[#263238] mb-2">
          {{ cardData.cardHeading }}
        </h3>
        <p class="text-xs text-gray-500">In the last 7 days</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CardData } from "@/types/global";

defineProps<{
  cardData: CardData;
}>();
</script>
