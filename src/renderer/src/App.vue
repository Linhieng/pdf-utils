<script setup>
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const totalPages = ref(0)

const handleFileSelected = ({ info }) => {
  totalPages.value = info.numPages
}
</script>

<template>
  <div class="app-container">
    <nav class="navbar">
      <router-link to="/preview" class="nav-item">预览PDF</router-link>
      <router-link to="/convert" class="nav-item">转换PDF为图片</router-link>
    </nav>
    <div class="content-wrapper">
      <RouterView 
        :total-pages="totalPages" 
        @file-selected="handleFileSelected" 
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  flex-shrink: 0;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  z-index: 10;
}

.content-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.nav-item {
  margin-right: 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #f0f0f0;
}

.nav-item.router-link-active {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>