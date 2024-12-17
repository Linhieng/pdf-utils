import { ipcMain } from 'electron'
import fs from 'fs'
import { join } from "path";

let pdfjsLib = null

// 初始化 PDF.js
async function initPDFJS() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  }
  return pdfjsLib
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

async function convertPDFToImages(pdf, outputDir, scale = 4.0) {
  try {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const images = []
    
    // 遍历每一页并转换为图片
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      
      // 创建 canvas
      const canvasFactory = pdf.canvasFactory
      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
      )

      // 渲染页面
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
      }

      await page.render(renderContext).promise

      // 转换为图片并保存
      const image = canvasAndContext.canvas.toBuffer('image/png')
      const imagePath = join(outputDir, `page-${pageNum}.png`)
      await fs.promises.writeFile(imagePath, image)
      
      images.push(imagePath)

      // 释放资源
      page.cleanup()
      canvasFactory.destroy(canvasAndContext)

      console.log(`Converted page ${pageNum}/${pdf.numPages}`)
    }

    return {
      success: true,
      totalPages: pdf.numPages,
      images
    }

  } catch (error) {
    console.error('Error converting PDF to images:', error)
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
    const pdf = await loadPDF(pdfjsLib, pdfPath)
    

    convertPDFToImages(pdf, join(process.cwd(), 'resources', 'images'))

    return {
      numPages: pdf.numPages,
      fileName: pdfPath.split(/[\\/]/).pop()
    }
    
    
  } catch (error) {
    console.error('Error getting PDF info:', error)
    return {
      success: false,
      error: error.message
    }
  }
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
    return getPDFInfo(filePath)
  })

  // PDF 转图片
  ipcMain.handle('convert-pdf-to-images', async (event, { pdfPath, outputDir, scale }) => {
    return convertPDFToImages(pdfPath, outputDir, scale)
  })
}

export { convertPDFToImages, cleanupImages }
