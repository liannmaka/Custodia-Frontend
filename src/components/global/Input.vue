<template>
  <label class="w-full">
    <div
      class="mb-1 text-[var(--bice-blue)] text-[13px] leading-snug font-normal"
    >
      {{ label }}
      <span v-if="required">*</span>
    </div>
    <div class="relative flex items-center">
      <span
        v-if="icon && placement === 'start'"
        @click="$emit('startIconClick')"
        class="absolute left-3 text-gray-500 cursor-pointer"
      >
        <component :is="icon" />
      </span>
      <input
        :class="[
          icon && placement === 'start' ? 'pl-9' : '',
          variant === 'search' && 'bg-secondary',
          variant === 'primary' && 'px-3'
        ]"
        :type="type"
        :placeholder="placeholder"
        :onChange="handleOnChange"
        autoComplete="on"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autocomplete="on"
        class="w-full bg-secondary py-2 text-xs rounded-md border-[1.5px] border-[#ccc] focus:border-[#ccc] focus:ring-0"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import type { Component } from "vue";

const { onChange } = defineProps<{
  className?: string;
  label?: string;
  placeholder?: string;
  icon?: Component;
  placement?: "start";
  type?: string;
  variant?: "primary" | "search";
  onChange?: (...args: any[]) => any;
  required?: boolean;
}>();

// const handleOnChange = (e: Event) => {
//   if (onChange) {
//     onChange(e);
//   }
//   return null;
// };

const emit = defineEmits(["startIconClick", "onChange"]);

const handleOnChange = (event: Event) => {
  emit("onChange", event);
};
</script>
