<script setup>
import { ref } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'

const totalPages = ref(0)

const handleFileSelected = ({ info }) => {
  totalPages.value = info.numPages
}
</script>

<template>
  <div class="container">
    <LeftPanel @file-selected="handleFileSelected" />
    <RightPanel :total-pages="totalPages" />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
}
</style>