<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <span
      v-if="loading"
      role="status"
      class="absolute w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
    ></span>
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["click"])

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    buttonStyle?: string;
    ariaLabel?: string;
    bordered?: boolean;
    rounded?: "small" | "medium" | "large";
    type?: "button" | "submit" | "reset";
    variant?: "transparent" | "create" | "cancel" | "delete";
    size?: "small" | "medium" | "large";
  }>(),
  {
    loading: false,
    disabled: false,
    bordered: false,
    type: "button",
  }
);

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event)
  }
}

const buttonClasses = computed(() => [
  "relative flex items-center justify-center font-medium transition-all ease-in-out duration-100",

  // disabled
  "disabled:cursor-not-allowed",

  // variant
  {
    "bg-transparent": props.variant === "transparent",
    "bg-primary text-white w-full hover:opacity-90 hover:-translate-y-0.5":
      props.variant === "create",
    "bg-secondary text-black/75 w-full hover:opacity-90 hover:-translate-y-0.5":
      props.variant === "cancel",
    "bg-red-500 text-white w-full hover:opacity-90 hover:-translate-y-0.5":
      props.variant === "delete",
  },

  // size
  {
    "p-2 max-w-32 font-medium": props.size === "small",
    "p-3 max-w-36 font-medium": props.size === "medium",
    "p-[0.8rem] font-bold": props.size === "large",
  },

  // rounded
  {
    "rounded-sm": props.rounded === "small",
    "rounded-md": props.rounded === "medium",
    "rounded-lg": props.rounded === "large",
  },

  // border
  props.bordered ? "border-[1.5px] border-[#ccc]" : "",
  props.buttonStyle,
]);
</script>
