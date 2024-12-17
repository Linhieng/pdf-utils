<template>
  <div class="left-panel">
    <div class="upload-section">
      <div class="file-input-container">
        <input 
          type="file" 
          id="pdfFile" 
          accept=".pdf" 
          class="file-input"
          @change="handleFileSelect"
        >
        <label for="pdfFile" class="file-input-label">
          <span class="button-text">选择 PDF 文件</span>
        </label>
      </div>
    </div>
    <div class="info-section" v-if="pdfInfo">
      <h2 class="info-title">PDF 文件信息</h2>
      <div class="info-content">
        <div class="info-item">
          <div class="info-label">文件名</div>
          <div class="info-value">{{ pdfInfo.fileName }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">总页数</div>
          <div class="info-value">{{ pdfInfo.numPages }} 页</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['file-selected'])
const pdfInfo = ref(null)

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    try {
      const result = await window.api.getPDFInfo(file.path)
      if (result.success) {
        pdfInfo.value = result
        emit('file-selected', { file, info: result })
      } else {
        console.error('Failed to load PDF:', result.error)
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }
}
</script>

<style scoped>
.left-panel {
  width: 300px;
  background: white;
  padding: 1.5rem;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100vh;
  overflow-y: auto;
}

.file-input {
  display: none;
}

.file-input-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  text-align: center;
}

.file-input-label:hover {
  background-color: #40a9ff;
}

.info-section {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 1.5rem;
}

.info-title {
  margin: 0 0 1rem 0;
  color: #262626;
  font-size: 1.1rem;
  font-weight: 500;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.info-label {
  color: #8c8c8c;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.info-value {
  color: #262626;
  font-size: 1rem;
  word-break: break-word;
}
</style>
