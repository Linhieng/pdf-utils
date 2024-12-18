import { createRouter, createWebHashHistory } from 'vue-router'
import PreviewPDF from '../views/PreviewPDF.vue'
import ConvertPDF from '../views/ConvertPDF.vue'

const routes = [
  {
    path: '/',
    redirect: '/preview'
  },
  {
    path: '/preview',
    name: 'PreviewPDF',
    component: PreviewPDF
  },
  {
    path: '/convert',
    name: 'ConvertPDF',
    component: ConvertPDF
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
