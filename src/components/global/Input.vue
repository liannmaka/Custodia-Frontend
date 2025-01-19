<template>
  <label class="w-full">
    <div class="mb-1 text-[var(--bice-blue)] text-sm leading-snug font-normal">
      {{ label }}
      <span v-if="required">*</span>
    </div>
    <div class="relative flex items-center">
      <span
        v-if="icon && placement === 'start'"
        class="absolute left-3 text-gray-500 cursor-pointer"
      >
        <component :is="icon" />
      </span>
      <input
        :class="[
          'w-full bg-secondary py-3 text-xs lg:text-sm rounded-md border-[1.5px] border-[#ccc] focus:ring-[#ccc] focus:ring-2 outline-none',
          icon && placement === 'start' ? 'pl-9' : '',
          variant === 'search' && 'bg-secondary',
          variant === 'primary' && 'px-3',
        ]"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        @input="handleOnChange"
        autoComplete="on"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  className?: string;
  label?: string;
  placeholder?: string;
  icon?: Component;
  placement?: "start";
  type?: string;
  variant?: "primary" | "search";
  value?: string;
  onChange?: (...args: any[]) => any;
  required?: boolean;
}>();

const emit = defineEmits(["startIconClick", "onChange"]);

const handleOnChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("onChange", value);
};
</script>
