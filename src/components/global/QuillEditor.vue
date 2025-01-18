<template>
  <div>
    <div ref="editor" class="quill-editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Or another Quill theme if desired

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const editor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (editor.value) {
    const quill = new Quill(editor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
        ],
      },
    });

    // Set initial content
    quill.root.innerHTML = props.modelValue;

    // Listen for text change and emit updates
    quill.on('text-change', () => {
      emit('update:modelValue', quill.root.innerHTML);
    });
  }
});
</script>

<style>
.quill-editor {
  height: 300px; /* Set height as needed */
}
</style>
