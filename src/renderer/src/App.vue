<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// 设置 PDF.js worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = `./node_modules/pdfjs-dist/build/pdf.worker.min.js`

const pdfDoc = ref(null)
const pageNum = ref(1)
const scale = ref(1.5)
const canvas = ref(null)
const fileName = ref('')

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    fileName.value = file.name
    const fileReader = new FileReader()
    
    fileReader.onload = async function() {
      const typedarray = new Uint8Array(this.result)
      try {
        // 加载PDF文档
        pdfDoc.value = await pdfjsLib.getDocument(typedarray).promise
        // 渲染第一页
        renderPage(1)
      } catch (error) {
        console.error('Error loading PDF:', error)
      }
    }
    
    fileReader.readAsArrayBuffer(file)
  }
}

// 渲染PDF页面
const renderPage = async (num) => {
  if (!pdfDoc.value) return
  
  try {
    const page = await pdfDoc.value.getPage(num)
    const ctx = canvas.value.getContext('2d')
    const viewport = page.getViewport({ scale: scale.value })

    canvas.value.height = viewport.height
    canvas.value.width = viewport.width

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }

    await page.render(renderContext)
  } catch (error) {
    console.error('Error rendering page:', error)
  }
}

onMounted(() => {
  // 获取canvas元素引用
  canvas.value = document.getElementById('pdf-canvas')
})
</script>

<template>
    <div class="container">
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
            <div class="file-name">{{ fileName }}</div>
        </div>
        <div class="preview-section">
            <div class="preview-container">
                <canvas 
                  id="pdf-canvas" 
                  v-show="pdfDoc"
                  class="pdf-canvas"
                ></canvas>
                <div 
                  class="preview-placeholder" 
                  v-if="!pdfDoc"
                >
                    请选择 PDF 文件进行预览
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
  display: flex;
  padding: 20px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
}

.file-section {
  width: 300px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-section {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.file-input-container {
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-input-label {
  display: block;
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.file-input-label:hover {
  background-color: #45a049;
}

.file-name {
  word-break: break-all;
  color: #666;
  font-size: 14px;
}

.preview-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.preview-placeholder {
  color: #999;
  font-size: 16px;
}

.pdf-canvas {
  max-width: 100%;
  height: auto;
}
</style>