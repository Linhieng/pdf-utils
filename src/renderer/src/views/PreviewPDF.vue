<template>
  <div class="preview-pdf">
    <div class="container">
      <LeftPanel @file-selected="$emit('file-selected', $event)" />
      <RightPanel :total-pages="totalPages" />
    </div>
  </div>
</template>

<script setup>
import LeftPanel from '../components/LeftPanel.vue'
import RightPanel from '../components/RightPanel.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['file-selected'])
</script>

<style scoped>
.preview-pdf {
  height: 100%;
}

.container {
  display: flex;
  height: 100%;
}
</style>
