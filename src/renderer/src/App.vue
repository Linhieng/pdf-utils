<script setup>
import { ref } from 'vue'

const fileName = ref('')
const filePath = ref('')
const pdfInfo = ref(null)

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    fileName.value = file.name
    filePath.value = file.path // Electron 提供的本地文件路径
    
    try {
      // 获取PDF信息
      const info = await window.electron.ipcRenderer.invoke('get-pdf-info', {
        filePath: file.path
      })
      console.log(info)
      pdfInfo.value = info
    } catch (error) {
      console.error('Error getting PDF info:', error)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <div class="file-section">
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

    <div class="preview-container">
      <div class="preview-placeholder">
        PDF 预览区域
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
}

.sidebar {
  width: 300px;
  background: white;
  padding: 1.5rem;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-container {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.file-input-container {
  margin-bottom: 1rem;
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
  padding: 1rem;
}

.info-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  margin-bottom: 1rem;
}

.info-item:last-child {
  margin-bottom: 0;
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