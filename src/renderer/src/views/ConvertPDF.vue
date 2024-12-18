<template>
  <div class="convert-pdf">
    <div class="container">
      <div 
        class="upload-area"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <input 
          type="file" 
          multiple 
          accept=".pdf"
          class="hidden-input" 
          ref="fileInput"
          @change="handleFileUpload"
        />
        <div class="upload-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div 
            @click="$refs.fileInput.click()" 
            class="elegant-button"
          >
            选择 PDF 文件
          </div>
          <p class="upload-hint">或拖拽文件到此处</p>
        </div>
      </div>

      <div v-if="files.length > 0" class="file-list">
        <h3 class="list-title">已选择文件:</h3>
        <ul class="list-container">
          <li 
            v-for="(file, index) in files" 
            :key="index" 
            class="list-item"
          >
            <div class="list-item-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="file-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="file-name">{{ file.name }}</span>
            </div>
            <span class="file-size">{{ file.size }}</span>
          </li>
        </ul>
        <div class="convert-button-container">
          <div 
            @click="convertFiles"
            class="elegant-button convert-button"
          >
            开始转换
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([])

const handleFileUpload = (event) => {
  const uploadedFiles = Array.from(event.target.files)
  files.value = uploadedFiles.map(file => ({
    name: file.name,
    size: (file.size / 1024).toFixed(2) + ' KB'
  }))
}

const handleDrop = (event) => {
  event.preventDefault()
  const uploadedFiles = Array.from(event.dataTransfer.files)
  files.value = uploadedFiles.map(file => ({
    name: file.name,
    size: (file.size / 1024).toFixed(2) + ' KB'
  }))
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const convertFiles = () => {
  // 转换逻辑将在后续实现
  console.log('Converting files:', files.value)
}
</script>

<style scoped>
.convert-pdf {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f0 100%);
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.upload-area {
  padding: 40px;
  text-align: center;
  border: 2px dashed #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #2563eb;
  background-color: rgba(59, 130, 246, 0.1);
}

.hidden-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #3b82f6;
  opacity: 0.7;
}

.upload-hint {
  color: #6b7280;
  font-size: 14px;
}

.file-list {
  padding: 24px;
  background-color: white;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background-color: #e5e7eb;
}

.list-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 24px;
  height: 24px;
  color: #ef4444;
}

.file-name {
  font-size: medium;
  color: #374151;
}

.file-size {
  color: #6b7280;
  font-size: 14px;
}

.convert-button-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.elegant-button {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border-radius: 12px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  user-select: none;
}

.elegant-button:hover {
  background: linear-gradient(135deg, #5b51e5, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.elegant-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.convert-button {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.convert-button:hover {
  background: linear-gradient(135deg, #059669, #10b981);
}
</style>
