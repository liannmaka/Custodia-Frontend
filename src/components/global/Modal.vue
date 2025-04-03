<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        :class="['bg-white rounded-[12px] p-6 text-[#191c1c] text-center shadow-[0px_10px_30px_rgba(0,0,0,0.15)] ${w-}', widthClass]"
      >
        <header>
          <slot name="header"></slot>
        </header>
        <div>
          <slot></slot>
        </div>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isOpen: boolean
  widthClass?: string
}>(), {
  widthClass: 'w-[500px]'
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
