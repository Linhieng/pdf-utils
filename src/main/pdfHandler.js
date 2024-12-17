import { ipcMain } from 'electron'
import fs from 'fs'
import { join } from "path"
import { Worker } from 'worker_threads'

let pdfjsLib = null
let currentPDF = null
let pdfWorker = null

// 初始化 PDF.js
async function initPDFJS() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  }
  return pdfjsLib
}

// 创建 PDF Worker
function createPDFWorker() {
  if (!pdfWorker) {
    pdfWorker = new Worker(`
      const { parentPort } = require('worker_threads');
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
      const canvas = require('canvas');

      parentPort.on('message', async ({ pageNum, pdfData, scale }) => {
        try {
          // 加载 PDF
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          // 创建 canvas
          const canvasInstance = canvas.createCanvas(viewport.width, viewport.height);
          const context = canvasInstance.getContext('2d');

          // 渲染页面
          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          // 转换为图片
          const imageBuffer = canvasInstance.toBuffer('image/png');
          
          parentPort.postMessage({
            success: true,
            imageData: imageBuffer.toString('base64'),
            width: viewport.width,
            height: viewport.height
          });
        } catch (error) {
          parentPort.postMessage({
            success: false,
            error: error.message
          });
        }
      });
    `, { eval: true });
  }
  return pdfWorker;
}

async function loadPDF(pdfjsLib, pdfPath) {
  // 读取 PDF 文件
  const data = new Uint8Array(await fs.promises.readFile(pdfPath))
  
  const CMAP_URL = join(__dirname, "../../node_modules/pdfjs-dist/cmaps/");
  const CMAP_PACKED = true;
  const STANDARD_FONT_DATA_URL = join(__dirname, "../../node_modules/pdfjs-dist/standard_fonts/");
  
  // 加载 PDF 文档
  const pdf = await pdfjsLib.getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
  }).promise

  return pdf
}

// 获取指定页面的图片
async function getPageImage(pageNum, scale = 4.0) {
  try {
    if (!currentPDF) {
      throw new Error('No PDF loaded')
    }

    if (pageNum < 1 || pageNum > currentPDF.numPages) {
      throw new Error(`Invalid page number: ${pageNum}`)
    }

    const worker = createPDFWorker();
    
    return new Promise((resolve) => {
      worker.once('message', (result) => {
        resolve(result);
      });

      // 发送任务给 Worker
      worker.postMessage({
        pageNum,
        pdfData: currentPDF._pdfInfo.data,
        scale
      });
    });
  } catch (error) {
    console.error('Error getting page image:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

async function getPDFInfo(pdfPath) {
  try {
    // 确保 PDF.js 已初始化
    const pdfjsLib = await initPDFJS()
    
    // 加载PDF
    currentPDF = await loadPDF(pdfjsLib, pdfPath)

    return {
      success: true,
      numPages: currentPDF.numPages,
      fileName: pdfPath.split(/[\\/]/).pop()
    }
  } catch (error) {
    console.error('Error getting PDF info:', error)
    currentPDF = null
    return {
      success: false,
      error: error.message
    }
  }
}

// 清理资源
function cleanup() {
  if (pdfWorker) {
    pdfWorker.terminate();
    pdfWorker = null;
  }
  currentPDF = null;
}

// 清理临时图片文件
function cleanupImages(directory) {
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory)
    for (const file of files) {
      if (file.startsWith('page-') && file.endsWith('.png')) {
        fs.unlinkSync(join(directory, file))
      }
    }
  }
}

// 设置IPC监听器
export function setupPDFHandlers() {
  // 获取 PDF 信息
  ipcMain.handle('get-pdf-info', async (event, { filePath }) => {
    cleanup(); // 清理之前的资源
    return getPDFInfo(filePath)
  })

  // 获取页面图片
  ipcMain.handle('get-page-image', async (event, { pageNum, scale }) => {
    return getPageImage(pageNum, scale)
  })
}

export { cleanup, cleanupImages }
