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
    <div class="card">
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
        <div class="file-name" v-if="fileName">当前文件：{{ fileName }}</div>
      </div>
      
      <div class="info-section" v-if="pdfInfo">
        <h2 class="info-title">PDF 文件信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">文件名</div>
            <div class="info-value">{{ pdfInfo.fileName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">总页数</div>
            <div class="info-value">{{ pdfInfo.numPages }} 页</div>
          </div>
          <div class="info-item" v-if="pdfInfo.info?.Title">
            <div class="info-label">标题</div>
            <div class="info-value">{{ pdfInfo.info.Title }}</div>
          </div>
          <div class="info-item" v-if="pdfInfo.info?.Author">
            <div class="info-label">作者</div>
            <div class="info-value">{{ pdfInfo.info.Author }}</div>
          </div>
          <div class="info-item" v-if="pdfInfo.info?.CreationDate">
            <div class="info-label">创建日期</div>
            <div class="info-value">{{ pdfInfo.info.CreationDate }}</div>
          </div>
          <div class="info-item" v-if="pdfInfo.info?.ModDate">
            <div class="info-label">修改日期</div>
            <div class="info-value">{{ pdfInfo.info.ModDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 2rem;
}

.file-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
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
}

.file-input-label:hover {
  background-color: #40a9ff;
}

.file-name {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.info-section {
  background-color: #fafafa;
  border-radius: 6px;
  padding: 1.5rem;
}

.info-title {
  margin: 0 0 1.5rem 0;
  color: #262626;
  font-size: 1.25rem;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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