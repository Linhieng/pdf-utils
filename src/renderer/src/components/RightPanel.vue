<template>
  <div class="right-panel">
    <div class="preview-area">
      <div class="pages-container">
        <div 
          v-for="page in pages" 
          :key="page"
          class="page-wrapper"
          :class="{ 'page-selected': selectedPages.has(page) }"
          @click="togglePageSelection(page)"
        >
          <div 
            class="page-box"
            :style="pageStyle"
          >
            <div class="page-content">
              第 {{ page }} 页内容
            </div>
          </div>
          <div class="page-number">{{ page }}/{{ props.totalPages }}</div>
        </div>
      </div>
    </div>

    <div class="control-panel">
      <span class="scale-label">25%</span>
      <input 
        type="range" 
        class="scale-slider" 
        min="25" 
        max="200" 
        step="1"
        :value="scale"
        @input="handleScaleChange"
      >
      <span class="scale-label">200%</span>
      <span class="scale-value">{{ scale }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    default: 0
  }
})

const currentPage = ref(1)
const scale = ref(100)
const selectedPages = ref(new Set())

const pages = computed(() => 
  Array.from({ length: props.totalPages }, (_, i) => i + 1)
)

const handleScaleChange = (event) => {
  scale.value = Number(event.target.value)
}

const togglePageSelection = (page) => {
  // if (selectedPages.value.has(page)) {
  //   selectedPages.value.delete(page)
  // } else {
  //   selectedPages.value.add(page)
  // }
}

const pageStyle = computed(() => {
  const baseWidth = 595 // A4 基础宽度
  const scaledWidth = (baseWidth * scale.value) / 100
  
  return {
    width: `${scaledWidth}px`,
    flexShrink: 0
  }
})
</script>

<style scoped>
.right-panel {
  flex: 1;
  height: 100vh;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-area {
  flex: 1;
  overflow: auto;
  padding: 2rem;
}

.pages-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-evenly;
  align-items: flex-start;
  min-height: 100%;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 12px;
  transition: all 0.2s;
}

.page-wrapper:hover {
  background: rgba(0, 0, 0, 0.02);
}

.page-wrapper.page-selected {
  background: rgba(0, 0, 0, 0.03);
}

.page-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.page-selected .page-box {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.page-content {
  aspect-ratio: 595/842; /* A4 比例 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 1.2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.page-number {
  font-size: 0.8rem;
  color: #666;
  user-select: none;
}

.control-panel {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.scale-slider {
  width: 200px;
  height: 4px;
  -webkit-appearance: none;
  background: #e6e6e6;
  outline: none;
  border-radius: 2px;
  cursor: pointer;
}

.scale-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.scale-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #1890ff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.scale-label {
  color: #666;
  font-size: 0.9rem;
  user-select: none;
}

.scale-value {
  min-width: 60px;
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  user-select: none;
}
</style>
