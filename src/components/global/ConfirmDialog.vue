<template>
  <Modal :isOpen="isOpen" @close="$emit('closeModal')" widthClass="w-[400px]">
    <template #header>
      <h4 class="font-medium text-xl text-center mb-2 text-[#333]">
        {{ title }}
      </h4>
    </template>
    <p class="mb-6 text-[#555] text-sm">{{ message }}</p>

    <template #footer>
      <div class="flex justify-around">
        <Button
          ariaLabel="Cancel button"
          rounded="medium"
          type="button"
          variant="cancel"
          size="small"
          @click="$emit('closeModal')"
        >
          Cancel
        </Button>
        <Button
          ariaLabel="Delete button"
          rounded="medium"
          type="submit"
          variant="delete"
          size="small"
          buttonStyle="disabled:text-gray-100"
          :loading="loading"
          :disabled="loading"
          @click="$emit('confirm', customerId)"
        >
          Yes, Delete
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
import Modal from "./Modal.vue";

defineProps<{
  title: string;
  message?: string;
  isOpen: boolean;
  loading?: boolean;
  customerId: string;
}>();
</script>
