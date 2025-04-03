<template>
  <div
    class="text-[12.5px] md:flex md:flex-row-reverse md:justify-between md:items-center"
  >
    <div class="flex items-center gap-2 mb-3 md:mb-0">
      <Button
        ariaLabel="Previous button"
        @click="$emit('prevPage')"
        :disabled="currentPage === 1"
        buttonStyle="w-24 h-7 font-normal"
        bordered
        rounded="medium"
        type="button"
      >
        <div class="flex items-center">
          <BackArrow class="w-4 h-4 text-primary" />
          <span class="ml-1">Previous</span>
        </div>
      </Button>

      <div v-for="(page, index) in pages" :key="index">
        <button
          v-if="page !== '...'"
          @click="$emit('pageChange', page)"
          :class="[
            'w-7 h-7 rounded-md font-normal',
            page === currentPage ? 'bg-primary text-white' : 'bg-transparent',
          ]"
        >
          {{ page }}
        </button>
        <span v-else class="w-7 h-7 flex items-center justify-center">
          ...
        </span>
      </div>

      <Button
        ariaLabel="Next button"
        buttonStyle="w-24 h-7 font-normal"
        rounded="medium"
        type="button"
        bordered
        @click="$emit('nextPage')"
        :disabled="currentPage === totalPages"
      >
        <div class="flex flex-row-reverse items-center">
          <ForwardArrow class="w-4 h-4 text-primary" />
          <span class="mr-1">Next</span>
        </div>
      </Button>
    </div>

    <select
      v-model="rowsPerPageComputed"
      class="font-normal border-[1.5px] border-[#ccc] rounded-md outline-none inline-flex items-center justify-center bg-transparent py-1 px-2 w-26 h-7"
    >
      <option :value="10">10 Customers</option>
      <option :value="25">25 Customers</option>
      <option :value="50">50 Customers</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BackArrow, ForwardArrow } from "../icons";
import Button from "./Button.vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
}>();

const emit = defineEmits([
  "prevPage",
  "nextPage",
  "update:rowsPerPage",
  "pageChange",
]);

// Two‑way binding for rowsPerPage using a computed getter/setter.
const rowsPerPageComputed = computed({
  get: () => props.rowsPerPage,
  set: (val: number) => {
    emit("update:rowsPerPage", val);
  },
});

// Compute pagination numbers (and ellipsis) based on current page and total pages.
const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  let pagesArr: (number | string)[] = [];

  // When total pages are 5 or fewer, list them all.
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pagesArr.push(i);
    }
  } else {
    // If current page is near the start, show first three pages, ellipsis, and last page.
    if (current <= 3) {
      pagesArr = [1, 2, 3, "...", total];
    }
    // If current page is near the end, show first page, ellipsis, and last three pages.
    else if (current >= total - 2) {
      pagesArr = [1, "...", total - 2, total - 1, total];
    }
    // Otherwise, show first page, ellipsis, current page, ellipsis, and last page.
    else {
      pagesArr = [1, "...", current, "...", total];
    }
  }
  return pagesArr;
});
</script>
