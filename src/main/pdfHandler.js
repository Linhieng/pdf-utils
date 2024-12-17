import { ipcMain } from 'electron'
import fs from 'fs'

let pdfjsLib = null

// 初始化 PDF.js
async function initPDFJS() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
  }
  return pdfjsLib
}

async function getPDFInfo(pdfPath) {
  try {
    // 确保 PDF.js 已初始化
    const pdf = await initPDFJS()
    
    // 读取PDF文件
    const data = new Uint8Array(await fs.promises.readFile(pdfPath))
    
    // 加载PDF文档
    const doc = await pdf.getDocument({ data }).promise
    
    // 获取文档信息
    const metadata = await doc.getMetadata()

    return {
      numPages: doc.numPages,
      fileName: pdfPath.split(/[\\/]/).pop()
    }
  } catch (error) {
    console.error('Error getting PDF info:', error)
    throw error
  }
}

// 设置IPC监听器
export function setupPDFHandlers() {
  ipcMain.handle('get-pdf-info', async (event, { filePath }) => {
    try {
      return await getPDFInfo(filePath)
    } catch (error) {
      console.error('Error in get-pdf-info handler:', error)
      throw error
    }
  })
}
